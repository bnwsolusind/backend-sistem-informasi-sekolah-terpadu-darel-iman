<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RealtimeController extends Controller
{
    /**
     * Poll recent events for authorized channels.
     */
    public function poll(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        $sinceId = $request->query('since_id');
        $channels = $this->resolveAuthorizedChannels($user, $request);

        if (empty($channels)) {
            return response()->json(['success' => true, 'events' => []]);
        }

        $query = DB::table('realtime_events')
            ->whereIn('channel', $channels)
            ->orderBy('created_at', 'asc');

        if ($sinceId) {
            $sinceCreated = DB::table('realtime_events')->where('id', $sinceId)->value('created_at');
            if ($sinceCreated) {
                $query->where('created_at', '>', $sinceCreated);
            } else {
                $query->where('created_at', '>=', now()->subMinutes(15));
            }
        } else {
            $query->where('created_at', '>=', now()->subMinutes(15));
        }

        $events = $query->limit(50)->get()->map(function ($row) {
            return [
                'id' => $row->id,
                'channel' => $row->channel,
                'event' => $row->event,
                'payload' => json_decode($row->payload, true),
                'sender_id' => $row->sender_id,
                'created_at' => $row->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'events' => $events,
            'timestamp' => now()->toISOString(),
        ]);
    }

    /**
     * Persistent Realtime Event Stream (Server-Sent Events / SSE) fallback.
     */
    public function stream(Request $request): StreamedResponse
    {
        $user = $request->user();
        abort_unless($user, 401);

        $channels = $this->resolveAuthorizedChannels($user, $request);

        return response()->stream(function () use ($channels) {
            $lastSeenTime = now()->subSeconds(5);
            $heartbeatCounter = 0;

            // Stream for up to 25 seconds per HTTP request (standard keep-alive cycle)
            $startTime = time();
            while (time() - $startTime < 25) {
                if (connection_aborted()) {
                    break;
                }

                $events = DB::table('realtime_events')
                    ->whereIn('channel', $channels)
                    ->where('created_at', '>', $lastSeenTime)
                    ->orderBy('created_at', 'asc')
                    ->limit(20)
                    ->get();

                foreach ($events as $ev) {
                    $lastSeenTime = $ev->created_at;
                    $data = json_encode([
                        'id' => $ev->id,
                        'channel' => $ev->channel,
                        'event' => $ev->event,
                        'payload' => json_decode($ev->payload, true),
                        'created_at' => $ev->created_at,
                    ]);
                    echo "event: {$ev->event}\n";
                    echo "data: {$data}\n\n";
                    ob_flush();
                    flush();
                }

                $heartbeatCounter++;
                if ($heartbeatCounter % 5 === 0) {
                    echo ": heartbeat\n\n";
                    ob_flush();
                    flush();
                }

                usleep(400000); // 400ms check interval for ultra-fast push without CPU stress
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    /**
     * Authenticate private channel subscription (for WebSocket client handshake).
     */
    public function authenticateChannel(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user, 401);

        $channelName = $request->input('channel_name');
        $authorizedChannels = $this->resolveAuthorizedChannels($user, $request);

        $normalizedName = str_replace('private-', '', $channelName);
        if (in_array($normalizedName, $authorizedChannels, true)) {
            return response()->json([
                'auth' => hash_hmac('sha256', $request->input('socket_id', 'sims') . ':' . $channelName, config('app.key')),
                'channel_data' => json_encode(['user_id' => $user->id, 'name' => $user->name]),
            ]);
        }

        return response()->json(['message' => 'Unauthorized channel access'], 403);
    }

    /**
     * Resolve all authorized channels for the current user.
     */
    private function resolveAuthorizedChannels($user, Request $request): array
    {
        $channels = ['user.' . $user->id];

        // If parent, add their children's channels
        $parent = DB::table('parents')->where('user_id', $user->id)->first();
        if ($parent) {
            $studentIds = DB::table('students')
                ->where('parent_id', $parent->id)
                ->pluck('id')
                ->toArray();

            $pivotStudentIds = [];
            if (DB::getSchemaBuilder()->hasTable('student_parents')) {
                $pivotStudentIds = DB::table('student_parents')
                    ->where('parent_id', $parent->id)
                    ->pluck('student_id')
                    ->toArray();
            }

            $allChildIds = array_unique(array_merge($studentIds, $pivotStudentIds));
            foreach ($allChildIds as $cId) {
                $channels[] = 'student.' . $cId;
            }
        }

        // If student account, add student self channel
        $studentSelf = DB::table('students')->where('user_id', $user->id)->first();
        if ($studentSelf && ! in_array('student.' . $studentSelf->id, $channels, true)) {
            $channels[] = 'student.' . $studentSelf->id;
        }

        // If childId parameter explicitly passed and user has access
        $explicitChildId = $request->query('child_id') ?? $request->header('X-Child-Id');
        if ($explicitChildId && ! in_array('student.' . $explicitChildId, $channels, true)) {
            $channels[] = 'student.' . $explicitChildId;
        }

        return array_values(array_unique($channels));
    }
}
