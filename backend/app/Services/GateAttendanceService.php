<?php

namespace App\Services;

use App\Jobs\SendParentAttendanceNotification;
use App\Models\Attendance;
use App\Models\EducationUnit;
use App\Models\SiteSetting;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GateAttendanceService
{
    /**
     * Perform gate check-in scan validation & recording.
     */
    public function recordCheckIn(array $data, ?string $userId = null): array
    {
        $student = $this->resolveStudent($data);
        if (! $student) {
            return [
                'success' => false,
                'message' => 'Kartu/Identitas siswa tidak ditemukan atau tidak aktif.',
                'code' => 'STUDENT_NOT_FOUND',
            ];
        }

        // Validate active student & active card status
        if (isset($student->is_active) && ! $student->is_active) {
            return [
                'success' => false,
                'message' => 'Siswa dinyatakan tidak aktif dalam sistem.',
                'code' => 'STUDENT_INACTIVE',
            ];
        }

        $date = $data['attendance_date'] ?? today()->toDateString();
        $scanTime = $data['check_in_time'] ?? now()->toTimeString();
        $scanTimeFormatted = Carbon::parse($scanTime)->format('H:i');

        // Check if student already checked in today
        $existing = Attendance::where('student_id', $student->id)
            ->whereDate('attendance_date', $date)
            ->first();

        if ($existing && $existing->check_in_time) {
            return [
                'success' => false,
                'message' => "Siswa {$student->nama_lengkap} sudah melakukan absensi masuk hari ini pada pukul ".Carbon::parse($existing->check_in_time)->format('H:i').'.',
                'code' => 'DUPLICATE_CHECKIN',
                'data' => $existing,
            ];
        }

        // Determine schedule & late status
        $entryConfig = $this->getEntryConfig($student->education_unit_id);
        $status = $this->evaluateCheckInStatus($scanTimeFormatted, $entryConfig);

        DB::beginTransaction();
        try {
            $attendance = Attendance::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'attendance_date' => $date,
                ],
                [
                    'id' => $existing->id ?? (string) Str::uuid(),
                    'tipe_presensi' => 'Siswa',
                    'student_id' => $student->id,
                    'unit_pendidikan_id' => $student->education_unit_id,
                    'class_id' => $student->class_id,
                    'check_in_time' => Carbon::parse("{$date} {$scanTime}"),
                    'status' => strtoupper($status),
                    'attendance_method' => strtoupper($data['attendance_method'] ?? 'QRCODE'),
                    'location' => $data['location'] ?? 'Gerbang Utama',
                    'latitude' => $data['latitude'] ?? null,
                    'longitude' => $data['longitude'] ?? null,
                    'photo_snapshot' => $data['photo_snapshot'] ?? null,
                    'keterangan' => $data['notes'] ?? null,
                    'created_by' => $userId,
                ]
            );

            DB::commit();

            // Dispatch async parent notification
            $notificationType = strtolower($status) === 'terlambat' ? 'late' : 'checkin';
            SendParentAttendanceNotification::dispatch(
                $student->id,
                $notificationType,
                $scanTimeFormatted,
                $status
            );

            return [
                'success' => true,
                'message' => "Absensi masuk {$student->nama_lengkap} berhasil dicatat ({$status}).",
                'data' => $attendance->load(['student', 'educationUnit']),
            ];

        } catch (\Throwable $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Gagal menyimpan data absensi gerbang: '.$e->getMessage(),
                'code' => 'STORAGE_ERROR',
            ];
        }
    }

    /**
     * Perform gate check-out scan validation & recording.
     */
    public function recordCheckOut(array $data, ?string $userId = null): array
    {
        $student = $this->resolveStudent($data);
        if (! $student) {
            return [
                'success' => false,
                'message' => 'Kartu/Identitas siswa tidak ditemukan.',
                'code' => 'STUDENT_NOT_FOUND',
            ];
        }

        $date = $data['attendance_date'] ?? today()->toDateString();
        $scanTime = $data['check_out_time'] ?? now()->toTimeString();
        $scanTimeFormatted = Carbon::parse($scanTime)->format('H:i');

        $attendance = Attendance::where('student_id', $student->id)
            ->whereDate('attendance_date', $date)
            ->first();

        if (! $attendance) {
            // No check-in record found
            $attendance = Attendance::create([
                'id' => (string) Str::uuid(),
                'tipe_presensi' => 'Siswa',
                'student_id' => $student->id,
                'unit_pendidikan_id' => $student->education_unit_id,
                'class_id' => $student->class_id,
                'attendance_date' => $date,
                'status' => 'BELUM_HADIR',
                'check_out_status' => 'tidak_ada_absensi_masuk',
                'attendance_method' => strtoupper($data['attendance_method'] ?? 'QRCODE'),
                'keterangan' => 'Absensi pulang tanpa absensi masuk.',
            ]);
        }

        $exitConfig = $this->getExitConfig($student->education_unit_id);
        $checkOutStatus = $this->evaluateCheckOutStatus($scanTimeFormatted, $exitConfig, $data);

        $attendance->update([
            'check_out_time' => Carbon::parse("{$date} {$scanTime}"),
            'check_out_status' => $checkOutStatus,
            'check_out_method' => strtoupper($data['attendance_method'] ?? 'QRCODE'),
            'pickup_person' => $data['pickup_person'] ?? null,
            'pickup_relation' => $data['pickup_relation'] ?? null,
            'pickup_verification' => $data['pickup_verification'] ?? null,
            'photo_snapshot' => $data['photo_snapshot'] ?? $attendance->photo_snapshot,
            'approved_by' => $data['approved_by'] ?? null,
            'updated_by' => $userId,
        ]);

        SendParentAttendanceNotification::dispatch(
            $student->id,
            'checkout',
            $scanTimeFormatted,
            $checkOutStatus
        );

        return [
            'success' => true,
            'message' => "Absensi pulang {$student->nama_lengkap} berhasil dicatat.",
            'data' => $attendance->fresh(['student', 'educationUnit']),
        ];
    }

    private function resolveStudent(array $data): ?Student
    {
        if (! empty($data['student_id'])) {
            return Student::find($data['student_id']);
        }
        if (! empty($data['nisn'])) {
            return Student::where('nisn', $data['nisn'])->first();
        }
        if (! empty($data['nis'])) {
            return Student::where('nis', $data['nis'])->first();
        }
        if (! empty($data['card_number'])) {
            return Student::where('metadata->card_number', $data['card_number'])
                ->orWhere('nis', $data['card_number'])
                ->first();
        }

        return null;
    }

    public function getScheduleConfig(?string $unitId = null): array
    {
        if ($unitId) {
            $unit = EducationUnit::find($unitId);
            if ($unit && isset($unit->metadata['gate_schedule'])) {
                return array_merge([
                    'jam_masuk' => '07:15',
                    'toleransi_menit' => 10,
                    'jam_pulang' => '14:15',
                    'jam_cutoff_alpha' => '12:00',
                ], $unit->metadata['gate_schedule']);
            }
        }

        // Global fallback setting from SiteSetting or hardcoded default
        $globalSetting = SiteSetting::where('key', 'gate_schedule_default')->first();
        if ($globalSetting && is_array($globalSetting->value)) {
            return array_merge([
                'jam_masuk' => '07:15',
                'toleransi_menit' => 10,
                'jam_pulang' => '14:15',
                'jam_cutoff_alpha' => '12:00',
            ], $globalSetting->value);
        }

        return [
            'jam_masuk' => '07:15',
            'toleransi_menit' => 10,
            'jam_pulang' => '14:15',
            'jam_cutoff_alpha' => '12:00',
        ];
    }

    public function getAllUnitsScheduleConfig(): array
    {
        $units = EducationUnit::all();
        $globalConfig = $this->getScheduleConfig(null);

        $result = [];
        foreach ($units as $unit) {
            $unitConfig = isset($unit->metadata['gate_schedule'])
                ? array_merge($globalConfig, $unit->metadata['gate_schedule'])
                : $globalConfig;

            $result[] = [
                'unit_id' => $unit->id,
                'unit_name' => $unit->name ?? $unit->nama,
                'code' => $unit->code,
                'schedule' => $unitConfig,
                'has_custom_schedule' => isset($unit->metadata['gate_schedule']),
            ];
        }

        return [
            'global' => $globalConfig,
            'units' => $result,
        ];
    }

    public function saveScheduleConfig(?string $unitId, array $data): array
    {
        $config = [
            'jam_masuk' => $data['jam_masuk'] ?? '07:15',
            'toleransi_menit' => (int) ($data['toleransi_menit'] ?? 10),
            'jam_pulang' => $data['jam_pulang'] ?? '14:15',
            'jam_cutoff_alpha' => $data['jam_cutoff_alpha'] ?? '12:00',
        ];

        if ($unitId) {
            $unit = EducationUnit::find($unitId);
            if ($unit) {
                $meta = $unit->metadata ?? [];
                $meta['gate_schedule'] = $config;
                $unit->metadata = $meta;
                $unit->save();
            }
        } else {
            SiteSetting::updateOrCreate(
                ['key' => 'gate_schedule_default'],
                ['value' => $config, 'group' => 'attendance']
            );
        }

        return [
            'success' => true,
            'message' => 'Pengaturan jam masuk dan jam pulang berhasil diperbarui.',
            'data' => $config,
        ];
    }

    private function getEntryConfig(?string $unitId): array
    {
        return $this->getScheduleConfig($unitId);
    }

    private function getExitConfig(?string $unitId): array
    {
        return $this->getScheduleConfig($unitId);
    }

    private function evaluateCheckInStatus(string $scanTime, array $config): string
    {
        $scan = Carbon::parse($scanTime);
        $scheduled = Carbon::parse($config['jam_masuk']);
        $toleranceLimit = (clone $scheduled)->addMinutes((int) ($config['toleransi_menit'] ?? 10));

        if ($scan->lte($scheduled)) {
            return 'hadir';
        }
        if ($scan->lte($toleranceLimit)) {
            return 'hadir_dalam_toleransi';
        }

        return 'terlambat';
    }

    private function evaluateCheckOutStatus(string $scanTime, array $config, array $data): string
    {
        $scan = Carbon::parse($scanTime);
        $scheduled = Carbon::parse($config['jam_pulang']);

        if (! empty($data['is_early']) || $scan->lt($scheduled)) {
            return 'pulang_lebih_awal';
        }

        return 'pulang_normal';
    }
}
