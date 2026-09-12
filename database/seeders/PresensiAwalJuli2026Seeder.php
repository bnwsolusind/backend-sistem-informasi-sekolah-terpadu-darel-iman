<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassSchedule;
use App\Models\Employee;
use App\Models\LessonAttendanceSession;
use App\Models\LmsPresensi;
use App\Models\Semester;
use App\Models\Student;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PresensiAwalJuli2026Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ini_set('memory_limit', '512M');
        DB::disableQueryLog();

        $this->command->info('=== Memulai Seeder Presensi Dinamis (Awal Juli 2026 s.d. Sekarang) ===');

        // 1. Dapatkan Tahun Ajaran Aktif (2026/2027) & Semester Ganjil
        $academicYear = AcademicYear::query()->where('is_active', true)->first()
            ?? AcademicYear::query()->where('name', 'like', '%2026%')->first()
            ?? AcademicYear::query()->orderByDesc('start_date')->first();

        if (! $academicYear) {
            $this->command->error('Tahun ajaran aktif tidak ditemukan.');

            return;
        }

        $semester = Semester::query()
            ->where('academic_year_id', $academicYear->id)
            ->where(function ($q) {
                $q->where('is_active', true)
                    ->orWhere('sequence', 1)
                    ->orWhere('name', 'like', '%Ganjil%');
            })
            ->first()
            ?? Semester::query()->where('academic_year_id', $academicYear->id)->orderBy('sequence')->first();

        if (! $semester) {
            $this->command->error('Semester ganjil tidak ditemukan untuk tahun ajaran ' . $academicYear->name);

            return;
        }

        // 2. Tentukan Rentang Tanggal Dinamis (Awal Juli 2026 s.d. Hari Aktif Saat Ini)
        $startDate = Carbon::parse($academicYear->start_date)->startOfDay();
        $now = now()->startOfDay();
        $periodEnd = Carbon::parse($semester->end_date ?? $academicYear->end_date)->startOfDay();
        $endDate = $now->between($startDate, $periodEnd) ? $now : $periodEnd;

        $this->command->info("Periode Presensi: {$startDate->toDateString()} s.d. {$endDate->toDateString()} (Tahun Ajaran: {$academicYear->name}, Semester: {$semester->name})");

        // 3. Bangun Daftar Hari Sekolah Dinamis (Senin - Jumat, Non-Libur Nasional)
        $period = CarbonPeriod::create($startDate, $endDate);
        /** @var Carbon[] $schoolDays */
        $schoolDays = [];
        foreach ($period as $date) {
            if ($date->isWeekend()) {
                continue;
            }
            // Lewati Hari Kemerdekaan RI (17 Agustus)
            if ($date->month === 8 && $date->day === 17) {
                continue;
            }
            $schoolDays[] = $date->copy();
        }

        $totalSchoolDays = count($schoolDays);
        $this->command->info("Total Hari Efektif Sekolah: {$totalSchoolDays} hari kerja");

        if ($totalSchoolDays === 0) {
            $this->command->warn('Tidak ada hari sekolah dalam rentang tanggal ini.');

            return;
        }

        // -------------------------------------------------------------
        // A. PRESENSI HARIAN / GERBANG PEGAWAI & GURU (attendances)
        // -------------------------------------------------------------
        $employees = Employee::query()
            ->where('status', 'Aktif')
            ->select(['id', 'unit_id', 'user_id', 'nama_lengkap', 'niy'])
            ->orderBy('id')
            ->get();

        $this->command->info("Memproses Presensi Pegawai & Guru ({$employees->count()} pegawai)...");

        // Preload existing employee attendance dates
        $existingEmployeeDates = DB::table('attendances')
            ->whereNotNull('employee_id')
            ->whereBetween('attendance_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->selectRaw("employee_id || '_' || attendance_date as k")
            ->pluck('k')
            ->flip()
            ->toArray();

        $employeeAttendanceRows = [];
        $insertedEmployeesCount = 0;

        foreach ($employees as $empIndex => $emp) {
            foreach ($schoolDays as $dayIndex => $day) {
                $dateStr = $day->toDateString();
                $lookupKey = "{$emp->id}_{$dateStr}";

                if (isset($existingEmployeeDates[$lookupKey])) {
                    continue;
                }

                $month = (int) $day->format('n');
                $isToday = $day->isSameDay($now);
                $hash = abs(crc32($emp->id . $dateStr)) % 100;

                // Distribusi status pegawai: 93% HADIR, 4% TERLAMBAT, 2% DINAS_LUAR, 1% IZIN
                if ($hash < 93) {
                    $status = 'HADIR';
                    $checkInTime = $day->copy()->setTime(6, 35)->addMinutes($hash % 25)->toDateTimeString();
                    $checkOutTime = $isToday ? null : $day->copy()->setTime(16, 0)->addMinutes($hash % 30)->toDateTimeString();
                    $keterangan = 'Presensi Mengajar & Kerja Pegawai';
                } elseif ($hash < 97) {
                    $status = 'TERLAMBAT';
                    $checkInTime = $day->copy()->setTime(7, 16)->addMinutes($hash % 15)->toDateTimeString();
                    $checkOutTime = $isToday ? null : $day->copy()->setTime(16, 0)->addMinutes($hash % 30)->toDateTimeString();
                    $keterangan = 'Terlambat Masuk Mengajar';
                } elseif ($hash < 99) {
                    $status = 'DINAS_LUAR';
                    $checkInTime = $day->copy()->setTime(8, 0)->toDateTimeString();
                    $checkOutTime = $isToday ? null : $day->copy()->setTime(15, 30)->toDateTimeString();
                    $keterangan = 'Tugas Dinas Luar / Pelatihan Kurikulum';
                } else {
                    $status = 'IZIN';
                    $checkInTime = null;
                    $checkOutTime = null;
                    $keterangan = 'Izin Keperluan Keluarga Resmi';
                }

                $method = (($empIndex + $dayIndex) % 2 === 0) ? 'RFID' : 'GEOLOCATION';
                $location = 'Ruang Guru / Gate Utama SIMS';

                $employeeAttendanceRows[] = [
                    'id' => (string) Str::uuid(),
                    'academic_year_id' => $academicYear->id,
                    'semester_id' => $semester->id,
                    'month' => $month,
                    'attendance_date' => $dateStr,
                    'student_id' => null,
                    'employee_id' => $emp->id,
                    'class_id' => null,
                    'unit_pendidikan_id' => $emp->unit_id,
                    'check_in_time' => $checkInTime,
                    'check_out_time' => $checkOutTime,
                    'status' => $status,
                    'tipe_presensi' => 'Pegawai',
                    'attendance_method' => $method,
                    'location' => $location,
                    'latitude' => -6.200000,
                    'longitude' => 106.816666,
                    'keterangan' => $keterangan,
                    'metadata' => json_encode([
                        'device' => 'Gate Terminal & Mobile Guru',
                        'ip_address' => '192.168.1.' . (10 + ($empIndex % 200)),
                        'source' => 'PresensiAwalJuli2026Seeder',
                    ]),
                    'created_at' => $checkInTime ?? ($dateStr . ' 07:00:00'),
                    'updated_at' => $checkOutTime ?? ($dateStr . ' 16:00:00'),
                ];

                if (count($employeeAttendanceRows) >= 1000) {
                    DB::table('attendances')->insertOrIgnore($employeeAttendanceRows);
                    $insertedEmployeesCount += count($employeeAttendanceRows);
                    $employeeAttendanceRows = [];
                }
            }
        }

        if (! empty($employeeAttendanceRows)) {
            DB::table('attendances')->insertOrIgnore($employeeAttendanceRows);
            $insertedEmployeesCount += count($employeeAttendanceRows);
            unset($employeeAttendanceRows);
        }

        unset($existingEmployeeDates, $employees);
        $this->command->info("Selesai memproses presensi pegawai: {$insertedEmployeesCount} baris baru tersimpan.");

        // -------------------------------------------------------------
        // B. PRESENSI HARIAN / GERBANG SISWA (attendances)
        // -------------------------------------------------------------
        $totalStudents = Student::query()->active()->whereNotNull('class_id')->count();
        $this->command->info("Memproses Presensi Siswa ({$totalStudents} siswa aktif di rombel) secara chunking...");

        $insertedStudentsCount = 0;
        $studentBatchIndex = 0;

        Student::query()
            ->active()
            ->whereNotNull('class_id')
            ->select(['id', 'class_id', 'unit_id', 'full_name'])
            ->orderBy('id')
            ->chunk(150, function ($studentChunk) use (
                $startDate,
                $endDate,
                $schoolDays,
                $now,
                $academicYear,
                $semester,
                &$insertedStudentsCount,
                &$studentBatchIndex
            ) {
                $studentBatchIndex++;
                $studentIds = $studentChunk->pluck('id')->toArray();

                // Idempotency: preload existing attendance for this chunk only
                $chunkExistingDates = DB::table('attendances')
                    ->whereIn('student_id', $studentIds)
                    ->whereBetween('attendance_date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->selectRaw("student_id || '_' || attendance_date as k")
                    ->pluck('k')
                    ->flip()
                    ->toArray();

                $studentAttendanceRows = [];

                foreach ($studentChunk as $stuIndex => $stu) {
                    foreach ($schoolDays as $dayIndex => $day) {
                        $dateStr = $day->toDateString();
                        $lookupKey = "{$stu->id}_{$dateStr}";

                        if (isset($chunkExistingDates[$lookupKey])) {
                            continue;
                        }

                        $month = (int) $day->format('n');
                        $isToday = $day->isSameDay($now);
                        $hash = abs(crc32($stu->id . $dateStr)) % 100;

                        // Distribusi status siswa: 90% HADIR, 4% TERLAMBAT, 3% SAKIT, 2% IZIN, 1% ALPHA
                        if ($hash < 90) {
                            $status = 'HADIR';
                            $checkInTime = $day->copy()->setTime(6, 40)->addMinutes($hash % 25)->toDateTimeString();
                            $checkOutTime = $isToday ? null : $day->copy()->setTime(15, 10)->addMinutes($hash % 30)->toDateTimeString();
                            $keterangan = 'Presensi Masuk Siswa';
                        } elseif ($hash < 94) {
                            $status = 'TERLAMBAT';
                            $checkInTime = $day->copy()->setTime(7, 16)->addMinutes($hash % 20)->toDateTimeString();
                            $checkOutTime = $isToday ? null : $day->copy()->setTime(15, 10)->addMinutes($hash % 30)->toDateTimeString();
                            $keterangan = 'Terlambat Masuk Sekolah';
                        } elseif ($hash < 97) {
                            $status = 'SAKIT';
                            $checkInTime = null;
                            $checkOutTime = null;
                            $keterangan = 'Surat Dokter Terlampir';
                        } elseif ($hash < 99) {
                            $status = 'IZIN';
                            $checkInTime = null;
                            $checkOutTime = null;
                            $keterangan = 'Izin Keperluan Keluarga';
                        } else {
                            $status = 'ALPHA';
                            $checkInTime = null;
                            $checkOutTime = null;
                            $keterangan = 'Tanpa Keterangan';
                        }

                        $method = (($stuIndex + $dayIndex) % 3 === 0) ? 'RFID' : 'QRCODE';
                        $location = 'Gerbang Utama SIMS Terpadu';

                        $studentAttendanceRows[] = [
                            'id' => (string) Str::uuid(),
                            'academic_year_id' => $academicYear->id,
                            'semester_id' => $semester->id,
                            'month' => $month,
                            'attendance_date' => $dateStr,
                            'student_id' => $stu->id,
                            'employee_id' => null,
                            'class_id' => $stu->class_id,
                            'unit_pendidikan_id' => $stu->unit_id,
                            'check_in_time' => $checkInTime,
                            'check_out_time' => $checkOutTime,
                            'status' => $status,
                            'tipe_presensi' => 'Siswa',
                            'attendance_method' => $method,
                            'location' => $location,
                            'latitude' => -6.200000,
                            'longitude' => 106.816666,
                            'keterangan' => $keterangan,
                            'metadata' => json_encode([
                                'device' => 'Gate Scanner #01',
                                'ip_address' => '192.168.1.150',
                                'source' => 'PresensiAwalJuli2026Seeder',
                            ]),
                            'created_at' => $checkInTime ?? ($dateStr . ' 07:00:00'),
                            'updated_at' => $checkOutTime ?? ($dateStr . ' 15:30:00'),
                        ];

                        if (count($studentAttendanceRows) >= 1000) {
                            DB::table('attendances')->insertOrIgnore($studentAttendanceRows);
                            $insertedStudentsCount += count($studentAttendanceRows);
                            $studentAttendanceRows = [];
                        }
                    }
                }

                if (! empty($studentAttendanceRows)) {
                    DB::table('attendances')->insertOrIgnore($studentAttendanceRows);
                    $insertedStudentsCount += count($studentAttendanceRows);
                    unset($studentAttendanceRows);
                }

                unset($chunkExistingDates);

                if ($studentBatchIndex % 5 === 0) {
                    $this->command->info("  Progres Presensi Siswa: batch ke-{$studentBatchIndex} (tersimpan {$insertedStudentsCount} baris)...");
                }
            });

        $this->command->info("Selesai memproses presensi siswa: {$insertedStudentsCount} baris baru tersimpan.");

        // -------------------------------------------------------------
        // -------------------------------------------------------------
        // C. KBM LESSON ATTENDANCE & LMS PRESENSI (Kelas & Mapel)
        // -------------------------------------------------------------
        $this->command->info('Memproses Sesi Presensi Pembelajaran KBM (lesson_attendance_sessions & lms_presensi)...');

        // Pastikan sinkronisasi class_id pada class_schedules jika kelas_id tersedia
        DB::statement("UPDATE class_schedules SET class_id = kelas_id WHERE class_id IS NULL AND kelas_id IS NOT NULL");

        $classIdsWithStudents = Student::query()
            ->active()
            ->where(fn ($q) => $q->whereNotNull('class_id')->orWhereNotNull('kelas_id'))
            ->get()
            ->map(fn ($s) => $s->kelas_id ?: $s->class_id)
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        $totalSchedules = ClassSchedule::query()
            ->where('academic_year_id', $academicYear->id)
            ->where('is_active', true)
            ->where(function ($q) use ($classIdsWithStudents) {
                $q->whereIn('kelas_id', $classIdsWithStudents)
                  ->orWhereIn('class_id', $classIdsWithStudents);
            })
            ->count();

        $this->command->info("Ditemukan {$totalSchedules} jadwal KBM aktif. Memproses secara chunking...");

        // Preload siswa berdasarkan kelas_id dan class_id
        $studentsList = Student::query()
            ->active()
            ->where(fn ($q) => $q->whereNotNull('class_id')->orWhereNotNull('kelas_id'))
            ->select(['id', 'class_id', 'kelas_id', 'full_name'])
            ->get();

        $studentsByClass = [];
        foreach ($studentsList as $stu) {
            $c1 = $stu->kelas_id;
            $c2 = $stu->class_id;
            if ($c1) $studentsByClass[$c1][] = $stu;
            if ($c2 && $c2 !== $c1) $studentsByClass[$c2][] = $stu;
        }

        $insertedSessionsCount = 0;
        $insertedLmsCount = 0;
        $scheduleBatchIndex = 0;

        ClassSchedule::query()
            ->where('academic_year_id', $academicYear->id)
            ->where('is_active', true)
            ->where(function ($q) use ($classIdsWithStudents) {
                $q->whereIn('kelas_id', $classIdsWithStudents)
                  ->orWhereIn('class_id', $classIdsWithStudents);
            })
            ->with(['subject'])
            ->chunk(50, function ($schedules) use (
                $startDate,
                $endDate,
                $schoolDays,
                $now,
                $studentsByClass,
                &$insertedSessionsCount,
                &$insertedLmsCount,
                &$scheduleBatchIndex
            ) {
                $scheduleBatchIndex++;
                $scheduleIds = $schedules->pluck('id')->toArray();
                $existingSessions = DB::table('lesson_attendance_sessions')
                    ->whereIn('schedule_id', $scheduleIds)
                    ->whereBetween('attendance_date', [$startDate->toDateString(), $endDate->toDateString()])
                    ->select(['id', 'schedule_id', 'attendance_date'])
                    ->get()
                    ->keyBy(fn ($row) => "{$row->schedule_id}_{$row->attendance_date}");

                $sessionRows = [];
                $scheduleSessionsMap = [];

                // 1. Kumpulkan dan simpan semua sesi terlebih dahulu
                foreach ($schedules as $schedule) {
                    $scheduleDayOfWeek = (int) $schedule->day_of_week;
                    $matchingDates = array_values(array_filter(
                        $schoolDays,
                        fn (Carbon $d) => $d->dayOfWeekIso === $scheduleDayOfWeek
                    ));

                    $subjectName = $schedule->subject?->name ?? 'Mata Pelajaran';
                    $teacherUserId = $schedule->created_by ?? $schedule->updated_by;

                    foreach ($matchingDates as $seqIndex => $date) {
                        $meetingNum = $seqIndex + 1;
                        $dateStr = $date->toDateString();
                        $sessionKey = "{$schedule->id}_{$dateStr}";

                        $existing = $existingSessions->get($sessionKey);
                        if ($existing) {
                            $scheduleSessionsMap[$sessionKey] = $existing->id;
                            continue;
                        }

                        $sessionId = (string) Str::uuid();
                        $scheduleSessionsMap[$sessionKey] = $sessionId;

                        $isPast = $date->lt($now);
                        $status = $isPast ? 'final' : 'draft';
                        $timeStart = $schedule->time_start ?? '08:00:00';
                        $sessionStartedAt = $dateStr . ' ' . $timeStart;

                        $sessionRows[] = [
                            'id' => $sessionId,
                            'schedule_id' => $schedule->id,
                            'attendance_date' => $dateStr,
                            'meeting_number' => $meetingNum,
                            'topic' => "{$subjectName} - Pertemuan {$meetingNum}: Pembahasan Modul & Latihan",
                            'learning_material' => "Modul KBM pertemuan {$meetingNum}",
                            'learning_activity' => 'Pemaparan teori, tanya jawab interaktif, dan penugasan mandiri.',
                            'meeting_notes' => 'Kegiatan pembelajaran berlangsung tertib dan kondusif.',
                            'status' => $status,
                            'attendance_method' => 'manual',
                            'session_started_at' => $sessionStartedAt,
                            'finalized_at' => $status === 'final' ? ($dateStr . ' 10:30:00') : null,
                            'finalized_by' => $status === 'final' ? $teacherUserId : null,
                            'created_by' => $teacherUserId,
                            'updated_by' => $teacherUserId,
                            'created_at' => $sessionStartedAt,
                            'updated_at' => $sessionStartedAt,
                        ];
                    }
                }

                if (! empty($sessionRows)) {
                    DB::table('lesson_attendance_sessions')->insertOrIgnore($sessionRows);
                    $insertedSessionsCount += count($sessionRows);
                    unset($sessionRows);
                }

                // 2. Sekarang simpan lms_presensi untuk setiap sesi yang pasti sudah ada
                $lmsPresensiRows = [];
                foreach ($schedules as $schedule) {
                    $effId = $schedule->kelas_id ?: $schedule->class_id;
                    $raw = $studentsByClass[$effId] ?? ($studentsByClass[$schedule->class_id] ?? ($studentsByClass[$schedule->kelas_id] ?? []));
                    $classStudents = collect($raw)->unique('id');
                    if ($classStudents->isEmpty()) {
                        continue;
                    }

                    $scheduleDayOfWeek = (int) $schedule->day_of_week;
                    $matchingDates = array_values(array_filter(
                        $schoolDays,
                        fn (Carbon $d) => $d->dayOfWeekIso === $scheduleDayOfWeek
                    ));

                    $teacherUserId = $schedule->created_by ?? $schedule->updated_by;
                    $timeStart = $schedule->time_start ?? '08:00:00';

                    foreach ($matchingDates as $seqIndex => $date) {
                        $meetingNum = $seqIndex + 1;
                        $dateStr = $date->toDateString();
                        $sessionKey = "{$schedule->id}_{$dateStr}";
                        $sessionId = $scheduleSessionsMap[$sessionKey] ?? null;

                        if (! $sessionId) {
                            continue;
                        }

                        $sessionStartedAt = $dateStr . ' ' . $timeStart;

                        foreach ($classStudents as $student) {
                            $hash = abs(crc32($student->id . $dateStr . $schedule->id)) % 100;
                            if ($hash < 90) {
                                $hadirStatus = 'hadir';
                                $keterangan = 'Mengikuti pembelajaran dengan baik.';
                                $arrivalTime = substr($timeStart, 0, 5);
                            } elseif ($hash < 94) {
                                $hadirStatus = 'terlambat';
                                $keterangan = 'Terlambat memasuki ruang pembelajaran.';
                                $arrivalTime = '08:20';
                            } elseif ($hash < 97) {
                                $hadirStatus = 'sakit';
                                $keterangan = 'Sakit dan ada pemberitahuan dari orang tua.';
                                $arrivalTime = null;
                            } elseif ($hash < 99) {
                                $hadirStatus = 'izin';
                                $keterangan = 'Izin resmi kepentingan mendesak.';
                                $arrivalTime = null;
                            } else {
                                $hadirStatus = 'alpa';
                                $keterangan = 'Tidak hadir tanpa konfirmasi.';
                                $arrivalTime = null;
                            }

                            $lmsPresensiRows[] = [
                                'id' => (string) Str::uuid(),
                                'session_id' => $sessionId,
                                'jadwal_pelajaran_id' => $schedule->id,
                                'siswa_id' => $student->id,
                                'tanggal' => $dateStr,
                                'status_hadir' => $hadirStatus,
                                'keterangan' => $keterangan,
                                'pertemuan_ke' => $meetingNum,
                                'waktu_presensi' => $sessionStartedAt,
                                'arrival_time' => $arrivalTime,
                                'verification_status' => in_array($hadirStatus, ['hadir', 'terlambat']) ? 'verified' : 'pending',
                                'recorded_method' => 'manual',
                                'recorded_at' => $sessionStartedAt,
                                'recorded_by' => $teacherUserId,
                                'created_by' => $teacherUserId,
                                'updated_by' => $teacherUserId,
                                'created_at' => $sessionStartedAt,
                                'updated_at' => $sessionStartedAt,
                            ];

                            if (count($lmsPresensiRows) >= 1000) {
                                DB::table('lms_presensi')->insertOrIgnore($lmsPresensiRows);
                                $insertedLmsCount += count($lmsPresensiRows);
                                $lmsPresensiRows = [];
                            }
                        }
                    }
                }

                if (! empty($lmsPresensiRows)) {
                    DB::table('lms_presensi')->insertOrIgnore($lmsPresensiRows);
                    $insertedLmsCount += count($lmsPresensiRows);
                    unset($lmsPresensiRows);
                }

                unset($existingSessions, $scheduleSessionsMap);

                if ($scheduleBatchIndex % 4 === 0) {
                    $this->command->info("  Progres KBM: batch ke-{$scheduleBatchIndex} (tersimpan {$insertedSessionsCount} sesi, {$insertedLmsCount} presensi)...");
                }
            });

        $this->command->info("Selesai memproses KBM: {$insertedSessionsCount} sesi KBM dan {$insertedLmsCount} entri presensi LMS berhasil ditambahkan.");
        $this->command->info('=== Seeder Presensi Awal Juli 2026 Selesai dengan Sukses ===');
    }
}
