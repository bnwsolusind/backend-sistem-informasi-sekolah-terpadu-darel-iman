<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Services\GateAttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GateAttendanceController extends Controller
{
    public function __construct(private GateAttendanceService $gateService) {}

    /**
     * Get paginated gate check-in / check-out logs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Attendance::with(['student', 'educationUnit', 'schoolClass']);

        $effectiveUnitId = $this->resolveUserUnitScope($request);
        if ($effectiveUnitId) {
            $query->where('unit_pendidikan_id', $effectiveUnitId);
        }
        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }
        if ($request->filled('date')) {
            $query->whereDate('attendance_date', $request->query('date'));
        } else {
            $query->whereDate('attendance_date', today());
        }
        if ($request->filled('status')) {
            $query->where('status', strtoupper($request->query('status')));
        }
        if ($request->filled('search')) {
            $search = '%'.$request->query('search').'%';
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', $search)
                    ->orWhere('nisn', 'like', $search)
                    ->orWhere('nis', 'like', $search);
            });
        }

        $perPage = (int) $request->query('per_page', 20);
        $data = $query->orderByDesc('check_in_time')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Data absensi gerbang berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Gate Check-in scan endpoint (QR, RFID, Face, Manual).
     */
    public function scanCheckIn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'nullable|string',
            'card_number' => 'nullable|string',
            'nisn' => 'nullable|string',
            'nis' => 'nullable|string',
            'attendance_date' => 'nullable|date',
            'check_in_time' => 'nullable|string',
            'attendance_method' => 'nullable|string|in:QRCODE,RFID,FACE,FINGERPRINT,MANUAL,qr,rfid,face,fingerprint,manual',
            'location' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'photo_snapshot' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $result = $this->gateService->recordCheckIn($validated, $request->user()?->id);

        return response()->json($result, $result['success'] ? 200 : 422);
    }

    /**
     * Gate Check-out scan endpoint.
     */
    public function scanCheckOut(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'nullable|string',
            'card_number' => 'nullable|string',
            'nisn' => 'nullable|string',
            'nis' => 'nullable|string',
            'attendance_date' => 'nullable|date',
            'check_out_time' => 'nullable|string',
            'attendance_method' => 'nullable|string|in:QRCODE,RFID,FACE,FINGERPRINT,MANUAL,qr,rfid,face,fingerprint,manual',
            'is_early' => 'nullable|boolean',
            'pickup_person' => 'nullable|string',
            'pickup_relation' => 'nullable|string',
            'pickup_verification' => 'nullable|string',
            'photo_snapshot' => 'nullable|string',
            'approved_by' => 'nullable|string',
        ]);

        $result = $this->gateService->recordCheckOut($validated, $request->user()?->id);

        return response()->json($result, $result['success'] ? 200 : 422);
    }

    /**
     * Overview stats for gate check-in/out terminal.
     */
    public function stats(Request $request): JsonResponse
    {
        $date = $request->query('date', today()->toDateString());
        $unitId = $this->resolveUserUnitScope($request);

        $query = Attendance::whereDate('attendance_date', $date);
        if ($unitId) {
            $query->where('unit_pendidikan_id', $unitId);
        }

        $totalScanned = (clone $query)->count();
        $hadir = (clone $query)->whereIn('status', ['HADIR', 'HADIR_DALAM_TOLERANSI'])->count();
        $terlambat = (clone $query)->where('status', 'TERLAMBAT')->count();
        $izin = (clone $query)->where('status', 'IZIN')->count();
        $sakit = (clone $query)->where('status', 'SAKIT')->count();
        $belumHadir = (clone $query)->where('status', 'BELUM_HADIR')->count();
        $alpha = (clone $query)->where('status', 'ALPHA')->count();
        $checkedOut = (clone $query)->whereNotNull('check_out_time')->count();

        // Calculate total active students in unit
        $studentQuery = Student::query()->where('is_active', true);
        if ($unitId) {
            $studentQuery->where('education_unit_id', $unitId);
        }
        $totalStudents = $studentQuery->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'tanggal' => $date,
                'total_siswa' => $totalStudents,
                'total_scanned' => $totalScanned,
                'hadir' => $hadir,
                'terlambat' => $terlambat,
                'izin' => $izin,
                'sakit' => $sakit,
                'belum_hadir' => $belumHadir,
                'alpha' => $alpha,
                'sudah_pulang' => $checkedOut,
            ],
        ]);
    }

    /**
     * Get gate attendance schedule settings (jam masuk & jam pulang).
     */
    public function getScheduleConfig(Request $request): JsonResponse
    {
        $unitId = $this->resolveUserUnitScope($request);
        $config = $this->gateService->getScheduleConfig($unitId);

        return response()->json([
            'status' => 'success',
            'data' => $config,
        ]);
    }

    /**
     * Get all education units' gate attendance schedule settings.
     */
    public function getAllScheduleConfigs(): JsonResponse
    {
        $all = $this->gateService->getAllUnitsScheduleConfig();

        return response()->json([
            'status' => 'success',
            'data' => $all,
        ]);
    }

    /**
     * Save gate attendance schedule settings.
     */
    public function saveScheduleConfig(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'unit_id' => 'nullable|string',
            'jam_masuk' => 'required|string',
            'toleransi_menit' => 'required|integer|min:0|max:120',
            'jam_pulang' => 'required|string',
            'jam_cutoff_alpha' => 'nullable|string',
        ]);

        $unitId = $this->resolveUserUnitScope($request) ?: ($validated['unit_id'] ?? null);
        $result = $this->gateService->saveScheduleConfig($unitId, $validated);

        return response()->json($result);
    }

    /**
     * Resolve effective unit scope based on user role.
     * Superadmin, Admin, Yayasan, Divisi Pendidikan have multi-unit access.
     * Pegawai, Guru, etc. are restricted to their assigned education unit.
     */
    private function resolveUserUnitScope(Request $request): ?string
    {
        $user = $request->user();
        if (! $user) {
            return $request->query('unit_id');
        }

        $roles = array_map('strtolower', (array) ($user->roles?->pluck('name')->toArray() ?? [$user->role ?? '']));
        $multiUnitRoles = ['superadmin', 'admin', 'yayasan', 'pengurus_yayasan', 'divisi_pendidikan', 'direktur_pendidikan', 'kabid_pendidikan', 'pimpinan'];

        $isMultiUnit = false;
        foreach ($roles as $r) {
            foreach ($multiUnitRoles as $mu) {
                if (str_contains($r, $mu)) {
                    $isMultiUnit = true;
                    break 2;
                }
            }
        }

        if ($isMultiUnit) {
            return $request->query('unit_id');
        }

        // Single unit restriction for pegawai, guru, etc.
        $userUnitId = $user->education_unit_id ?? $user->unit_id ?? $user->employee?->unit_id;

        return $userUnitId ?: $request->query('unit_id');
    }
}
