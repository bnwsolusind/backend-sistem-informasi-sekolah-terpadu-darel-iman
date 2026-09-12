<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

echo "=== MEMULAI PELENGKAPAN JADWAL & DISTRIBUSI SISWA KE SELURUH ROMBEL ===" . PHP_EOL;

$activeAy = DB::table('academic_years')->where('is_active', true)->first();
$activeSem = DB::table('semesters')->where('academic_year_id', $activeAy->id)->where('is_active', true)->first()
    ?? DB::table('semesters')->where('academic_year_id', $activeAy->id)->first();

$allTeachers = DB::table('employees')->where('status', 'Aktif')->pluck('id')->toArray();
$allUnits = DB::table('education_units')->orderBy('code')->get();

// Slot waktu standar KBM Fullday (Senin - Jumat)
$standardSlots = [
    1 => [ // Senin
        ['start' => '07:30:00', 'end' => '08:50:00'],
        ['start' => '09:00:00', 'end' => '10:20:00'],
        ['start' => '10:45:00', 'end' => '12:00:00'],
        ['start' => '13:00:00', 'end' => '14:30:00'],
    ],
    2 => [ // Selasa
        ['start' => '07:30:00', 'end' => '08:50:00'],
        ['start' => '09:00:00', 'end' => '10:20:00'],
        ['start' => '10:45:00', 'end' => '12:00:00'],
        ['start' => '13:00:00', 'end' => '14:30:00'],
    ],
    3 => [ // Rabu
        ['start' => '07:30:00', 'end' => '08:50:00'],
        ['start' => '09:00:00', 'end' => '10:20:00'],
        ['start' => '10:45:00', 'end' => '12:00:00'],
        ['start' => '13:00:00', 'end' => '14:30:00'],
    ],
    4 => [ // Kamis
        ['start' => '07:30:00', 'end' => '08:50:00'],
        ['start' => '09:00:00', 'end' => '10:20:00'],
        ['start' => '10:45:00', 'end' => '12:00:00'],
        ['start' => '13:00:00', 'end' => '14:30:00'],
    ],
    5 => [ // Jumat
        ['start' => '07:30:00', 'end' => '09:00:00'],
        ['start' => '09:15:00', 'end' => '11:15:00'],
        ['start' => '13:30:00', 'end' => '15:00:00'],
    ],
];

// Slot waktu tambahan hari Sabtu untuk Unit Ponpes/Boarding
$saturdaySlots = [
    6 => [ // Sabtu
        ['start' => '07:30:00', 'end' => '09:00:00', 'label' => 'Tahfizh & Tasmi\' Al-Qur\'an Intensif'],
        ['start' => '09:15:00', 'end' => '10:45:00', 'label' => 'Bahasa Arab & Nahwu / Muhadatsah'],
        ['start' => '11:00:00', 'end' => '12:15:00', 'label' => 'Dirasat Islamiyyah / Fiqih Ibadah'],
        ['start' => '13:30:00', 'end' => '15:00:00', 'label' => 'Halaqah Adab & Pembinaan Santri'],
    ],
];

$boardingUnitCodes = ['PONPES-PA', 'PONPES-PI', 'MAHAD-01'];

DB::beginTransaction();
try {
    $totalSchedulesCreated = 0;
    $teacherIndex = 0;

    // =========================================================================
    // BAGIAN 1: LENGKAPI JADWAL KBM UNTUK SEMUA KELAS & HARI SABTU DI PONPES
    // =========================================================================
    foreach ($allUnits as $unit) {
        $isBoarding = in_array($unit->code, $boardingUnitCodes);

        // Ambil mata pelajaran yang relevan untuk unit ini
        $subjects = DB::table('subjects')
            ->where(function ($q) use ($unit) {
                $q->where('unit_pendidikan_id', $unit->id)
                  ->orWhere('jenjang', $unit->level);
            })
            ->pluck('id')
            ->toArray();

        // Fallback jika tidak ada spesifik, ambil beberapa subject umum
        if (empty($subjects)) {
            $subjects = DB::table('subjects')->take(10)->pluck('id')->toArray();
        }

        // Ambil semua rombel aktif di unit ini yang bukan Asrama murni
        $rombels = DB::table('tbl_kelas')
            ->where('unit_pendidikan_id', $unit->id)
            ->where('nama_kelas', 'not like', '%Asrama%')
            ->whereNull('deleted_at')
            ->get();

        $subIndex = 0;

        foreach ($rombels as $rombel) {
            // Cari kelas companion di tabel classes
            $schoolClass = DB::table('classes')
                ->where('name', $rombel->nama_kelas)
                ->where('academic_year_id', $activeAy->id)
                ->whereNull('deleted_at')
                ->first();
            $schoolClassId = $schoolClass?->id;

            // Cek jadwal yang sudah ada untuk rombel ini
            $existingDays = DB::table('class_schedules')
                ->where('kelas_id', $rombel->id)
                ->pluck('day_of_week')
                ->unique()
                ->toArray();

            // 1. Lengkapi jadwal Senin - Jumat jika belum ada
            foreach ($standardSlots as $day => $slots) {
                if (in_array($day, $existingDays)) {
                    continue; // Hari ini sudah punya jadwal, lewati
                }

                foreach ($slots as $slot) {
                    $selectedSubId = $subjects[$subIndex % count($subjects)];
                    $selectedTeacherId = $rombel->wali_kelas_id 
                        ?? ($allTeachers[$teacherIndex % count($allTeachers)] ?? null);

                    DB::table('class_schedules')->insert([
                        'id' => (string) Str::uuid(),
                        'kelas_id' => $rombel->id,
                        'class_id' => $schoolClassId,
                        'employee_id' => $selectedTeacherId,
                        'teacher_id' => null,
                        'subject_id' => $selectedSubId,
                        'academic_year_id' => $activeAy->id,
                        'semester_id' => $activeSem->id,
                        'day_of_week' => $day,
                        'time_start' => $slot['start'],
                        'time_end' => $slot['end'],
                        'week_type' => 'all',
                        'is_active' => true,
                        'metadata' => json_encode(['room' => $rombel->ruangan ?? 'Ruang Belajar', 'source' => 'SimulasiTerpadu']),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $totalSchedulesCreated++;
                    $subIndex++;
                    $teacherIndex++;
                }
            }

            // 2. Lengkapi jadwal hari Sabtu KHUSUS untuk unit Ponpes & Mahad
            if ($isBoarding) {
                $hasSaturday = in_array(6, $existingDays);
                if (! $hasSaturday) {
                    foreach ($saturdaySlots[6] as $satSlot) {
                        $selectedSubId = $subjects[$subIndex % count($subjects)];
                        $selectedTeacherId = $rombel->wali_kelas_id 
                            ?? ($allTeachers[$teacherIndex % count($allTeachers)] ?? null);

                        DB::table('class_schedules')->insert([
                            'id' => (string) Str::uuid(),
                            'kelas_id' => $rombel->id,
                            'class_id' => $schoolClassId,
                            'employee_id' => $selectedTeacherId,
                            'teacher_id' => null,
                            'subject_id' => $selectedSubId,
                            'academic_year_id' => $activeAy->id,
                            'semester_id' => $activeSem->id,
                            'day_of_week' => 6, // Sabtu
                            'time_start' => $satSlot['start'],
                            'time_end' => $satSlot['end'],
                            'week_type' => 'all',
                            'is_active' => true,
                            'metadata' => json_encode(['room' => $rombel->ruangan ?? 'Ruang Halaqah', 'kegiatan' => $satSlot['label'], 'source' => 'SimulasiTerpaduBoarding']),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        $totalSchedulesCreated++;
                        $subIndex++;
                        $teacherIndex++;
                    }
                }
            }
        }
    }

    echo "[SUKSES] Total {$totalSchedulesCreated} jadwal pelajaran baru berhasil ditambahkan (Senin-Jumat Fullday & Senin-Sabtu Ponpes)." . PHP_EOL;

    // =========================================================================
    // BAGIAN 2: DISTRIBUSI SISWA KE ROMBEL TEMATIK BARU (MAKSIMAL 25 SISWA)
    // =========================================================================
    echo PHP_EOL . "--- MEMULAI PLOTTING SISWA KE ROMBEL TEMATIK BERKUOTA 25 SISWA ---" . PHP_EOL;

    $totalStudentsReassigned = 0;

    foreach ($allUnits as $unit) {
        $isBoarding = in_array($unit->code, $boardingUnitCodes);

        // Ambil semua siswa aktif di unit ini
        $unitStudents = DB::table('students')
            ->where('unit_id', $unit->id)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->orderBy('created_at')
            ->get();

        if ($unitStudents->isEmpty()) continue;

        // Ambil target rombel di unit ini
        $targetRombels = DB::table('tbl_kelas')
            ->where('unit_pendidikan_id', $unit->id)
            ->where('nama_kelas', 'not like', '%Asrama%')
            ->whereNull('deleted_at')
            ->orderBy('tingkat')
            ->orderBy('nama_kelas')
            ->get();

        // Asrama jika boarding
        $asramaRombel = null;
        if ($isBoarding) {
            $asramaRombel = DB::table('tbl_kelas')
                ->where('unit_pendidikan_id', $unit->id)
                ->where('nama_kelas', 'like', '%Asrama%')
                ->whereNull('deleted_at')
                ->first();
        }

        if ($targetRombels->isEmpty()) continue;

        $studentList = $unitStudents->all();
        $stIndex = 0;

        // Bagi rata siswa ke rombel target (maksimal 25 per rombel)
        foreach ($targetRombels as $rombel) {
            if ($stIndex >= count($studentList)) break;

            // Cari companion classes
            $schoolClass = DB::table('classes')
                ->where('name', $rombel->nama_kelas)
                ->where('academic_year_id', $activeAy->id)
                ->whereNull('deleted_at')
                ->first();
            $schoolClassId = $schoolClass ? $schoolClass->id : $rombel->id;

            // Alokasikan hingga kapasitas maksimal (25 siswa)
            $quota = $rombel->kapasitas ?: 25;
            $allocatedInThisClass = 0;

            while ($stIndex < count($studentList) && $allocatedInThisClass < $quota) {
                $student = $studentList[$stIndex];

                DB::table('students')->where('id', $student->id)->update([
                    'kelas_id' => $rombel->id,
                    'class_id' => $schoolClassId,
                    'updated_at' => now(),
                ]);

                $allocatedInThisClass++;
                $stIndex++;
                $totalStudentsReassigned++;
            }

            echo "  Unit [{$unit->code}] -> {$rombel->nama_kelas} ({$rombel->tingkat}): Terisi {$allocatedInThisClass} siswa." . PHP_EOL;
        }

        // Sisa santri di unit boarding dialokasikan ke Asrama
        if ($isBoarding && $asramaRombel && $stIndex < count($studentList)) {
            $asramaAllocated = 0;
            $asramaSchoolClass = DB::table('classes')
                ->where('name', $asramaRombel->nama_kelas)
                ->where('academic_year_id', $activeAy->id)
                ->whereNull('deleted_at')
                ->first();
            $asramaClassId = $asramaSchoolClass ? $asramaSchoolClass->id : $asramaRombel->id;

            while ($stIndex < count($studentList)) {
                $student = $studentList[$stIndex];
                DB::table('students')->where('id', $student->id)->update([
                    'kelas_id' => $asramaRombel->id,
                    'class_id' => $asramaClassId,
                    'updated_at' => now(),
                ]);
                $asramaAllocated++;
                $stIndex++;
                $totalStudentsReassigned++;
            }
            echo "  Unit [{$unit->code}] -> {$asramaRombel->nama_kelas}: Terisi {$asramaAllocated} santri mukim asrama." . PHP_EOL;
        }
    }

    echo PHP_EOL . "[SUKSES] Total {$totalStudentsReassigned} siswa berhasil di-plot ke rombel-rombel tematik baru." . PHP_EOL;

    DB::commit();
    echo "=== SIMULASI LENGKAP & KONSISTEN BERHASIL DISIMPAN KE DATABASE ===" . PHP_EOL;
} catch (\Throwable $e) {
    DB::rollBack();
    echo "[ERROR] " . $e->getMessage() . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
}
