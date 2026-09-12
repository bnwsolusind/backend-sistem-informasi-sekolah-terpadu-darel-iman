<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\AcademicYear;
use App\Models\ClassSchedule;
use App\Models\Kelas;
use App\Models\Semester;

echo "=========================================================\n";
echo " AUDIT JADWAL PELAJARAN IKHWAN (10A, 11A, 12A) GENAP 2026\n";
echo "=========================================================\n\n";

// 1. Dapatkan Tahun Ajaran & Semester
$ay = AcademicYear::where('name', 'like', '%2026/2027%')->first()
    ?? AcademicYear::where('is_active', true)->first();
$sem = Semester::where('academic_year_id', $ay?->id)
    ->where(function ($q) {
        $q->where('sequence', 2)->orWhere('name', 'like', '%Genap%');
    })->first();

if (! $ay || ! $sem) {
    echo "[FAIL] Tahun Ajaran 2026/2027 atau Semester Genap tidak ditemukan!\n";
    exit(1);
}

echo "Tahun Ajaran : {$ay->name} (ID: {$ay->id})\n";
echo "Semester     : {$sem->name} (ID: {$sem->id})\n\n";

// 2. Dapatkan Rombel
$rombels = Kelas::where(function ($q) {
    $q->where('nama_kelas', 'like', '%10A%')
      ->orWhere('nama_kelas', 'like', '%11A%')
      ->orWhere('nama_kelas', 'like', '%12A%')
      ->orWhere('kode_kelas', 'SMA-10-MIPA')
      ->orWhere('kode_kelas', 'SMA-11-MIPA')
      ->orWhere('kode_kelas', 'SMA-12-MIPA');
})->get();

if ($rombels->isEmpty()) {
    echo "[WARN] Rombel 10A, 11A, 12A belum ada di database. Silakan jalankan seeder terlebih dahulu.\n";
    exit(0);
}

$totalJpSemua = 0;
$hasClash = false;
$clashes = [];

// 3. Periksa Jumlah JP per Rombel
echo "--- 1. AUDIT JUMLAH JAM PELAJARAN (TARGET: 43 JP/KELAS) ---\n";
foreach ($rombels as $r) {
    $schedules = ClassSchedule::where('kelas_id', $r->id)
        ->where('academic_year_id', $ay->id)
        ->where('semester_id', $sem->id)
        ->get();

    $count = $schedules->count();
    $totalJpSemua += $count;
    $status = ($count === 43) ? "[OK]" : "[PERHATIAN - diharapkan 43]";
    echo "  {$status} {$r->nama_kelas} ({$r->kode_kelas}): {$count} JP terjadwal.\n";
}

echo "\n--- 2. AUDIT DETEKSI BENTROK GURU (TEACHER CLASH) ---\n";
// Ambil semua jadwal untuk ketiga rombel ini
$allSchedules = ClassSchedule::whereIn('kelas_id', $rombels->pluck('id'))
    ->where('academic_year_id', $ay->id)
    ->where('semester_id', $sem->id)
    ->with(['employee', 'subject', 'kelas'])
    ->get();

// Kelompokkan per (hari, time_start)
$grouped = $allSchedules->groupBy(function ($item) {
    return $item->day_of_week . '_' . $item->time_start;
});

$clashCount = 0;
foreach ($grouped as $key => $items) {
    // Cek apakah ada employee_id yang sama mengajar di lebih dari 1 kelas pada jam yang sama
    $teacherGroups = $items->whereNotNull('employee_id')->groupBy('employee_id');
    foreach ($teacherGroups as $empId => $teachingItems) {
        if ($teachingItems->count() > 1) {
            $hasClash = true;
            $clashCount++;
            $first = $teachingItems->first();
            $clashes[] = "Hari {$first->nama_hari} ({$first->time_start}-{$first->time_end}): Guru {$first->employee?->nama_lengkap} mengajar di " . $teachingItems->pluck('kelas.nama_kelas')->join(' & ');
        }
    }
}

if ($clashCount === 0) {
    echo "  [OK] ZERO TEACHER CLASH: Tidak ada guru yang bertabrakan jam mengajar!\n";
} else {
    echo "  [FAIL] Ditemukan {$clashCount} bentrok guru:\n";
    foreach ($clashes as $c) {
        echo "    - {$c}\n";
    }
}

echo "\n--- 3. RINGKASAN AUDIT ---\n";
echo "Total Jadwal Terdaftar : {$totalJpSemua} JP (Target: 129)\n";
echo "Status Integritas      : " . ($totalJpSemua === 129 && ! $hasClash ? "SEMPURNA & SIAP PRODUKSI (PAS)" : "PERLU PENYESUAIAN") . "\n";
echo "=========================================================\n";
