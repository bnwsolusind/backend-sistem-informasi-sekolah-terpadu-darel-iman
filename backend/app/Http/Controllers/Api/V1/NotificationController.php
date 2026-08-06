<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Ambil daftar notifikasi pengguna yang sedang login.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $search = trim((string) $request->query('search', ''));
        $type = $request->query('type');
        $isReadParam = $request->query('is_read');

        $query = Notification::byUser($userId);

        if ($search !== '') {
            $operator = \Illuminate\Support\Facades\DB::getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($search, $operator) {
                $q->where('title', $operator, "%{$search}%")
                  ->orWhere('body', $operator, "%{$search}%");
                if (\Illuminate\Support\Facades\Schema::hasColumn('notifications', 'message')) {
                    $q->orWhere('message', $operator, "%{$search}%");
                }
            });
        }

        if ($type && $type !== 'all') {
            $query->where('type', $type);
        }

        if ($isReadParam !== null && $isReadParam !== '' && $isReadParam !== 'all') {
            $isReadBool = filter_var($isReadParam, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($isReadBool !== null) {
                if ($isReadBool) {
                    $query->whereNotNull('read_at');
                } else {
                    $query->unread();
                }
            }
        }

        $notifications = $query->latest()
            ->paginate(min(max((int) $request->query('per_page', 20), 1), 100));

        return response()->json($notifications);
    }

    /**
     * Ambil jumlah notifikasi yang belum dibaca.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::byUser($request->user()->id)
            ->unread()
            ->count();

        return response()->json([
            'status' => 'success',
            'unread_count' => $count,
        ]);
    }

    /**
     * Tandai satu notifikasi sebagai sudah dibaca.
     */
    public function markAsRead(Request $request, $id): JsonResponse
    {
        $notification = Notification::byUser($request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        $notification->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi ditandai telah dibaca.',
            'data' => $notification,
        ]);
    }

    /**
     * Tandai semua notifikasi pengguna sebagai sudah dibaca.
     */
    public function markAllRead(Request $request): JsonResponse
    {
        Notification::byUser($request->user()->id)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Semua notifikasi ditandai telah dibaca.',
        ]);
    }

}
