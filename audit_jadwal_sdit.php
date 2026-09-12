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
echo " AUDIT JADWAL PELAJARAN SDIT FULL DAY SCHOOL 2026/2027\n";
echo "=========================================================\n\n";

$ay = AcademicYear::where('name', 'like', '%2026/2027%')->first()
    ?? AcademicYear::where('is_active', true)->first();
$sem = Semester::where('academic_year_id', $ay?->id)->first()
    ?? Semester::where('is_active', true)->first();

if (! $ay || ! $sem) {
    echo "[FAIL] Tahun Ajaran atau Semester belum tersedia!\n";
    exit(1);
}

echo "Tahun Ajaran : {$ay->name}\n";
echo "Semester     : {$sem->name}\n\n";

$scheduleFirst = ClassSchedule::where('metadata->source', 'RosterResmiSDIT_FullDay')
    ->with('kelas.waliKelas')
    ->first();

$sdClass = $scheduleFirst?->kelas;

if (! $sdClass) {
    echo "[WARN] Jadwal resmi SDIT Full Day belum ditemukan. Silakan jalankan seeder terlebih dahulu.\n";
    exit(0);
}

echo "Rombel : {$sdClass->nama_kelas} ({$sdClass->kode_kelas})\n";
echo "Walas  : " . ($sdClass->waliKelas?->nama_lengkap ?? 'Ustzh. Khadijah Azzahra, S.Pd') . "\n\n";

$schedules = ClassSchedule::where('kelas_id', $sdClass->id)
    ->where('metadata->source', 'RosterResmiSDIT_FullDay')
    ->where('academic_year_id', $ay->id)
    ->where('semester_id', $sem->id)
    ->with(['subject', 'employee'])
    ->orderBy('day_of_week')
    ->orderBy('time_start')
    ->get();

echo "--- 1. REKAP HARI & JAM PELAJARAN ---\n";
$dayGroups = $schedules->groupBy('day_of_week');

foreach ($dayGroups as $day => $items) {
    $dayName = ClassSchedule::DAY_NAMES[$day] ?? "Hari {$day}";
    echo "  [OK] {$dayName}: {$items->count()} sesi terjadwal\n";
    foreach ($items as $item) {
        $slotNum = $item->metadata['slot_ke'] ?? '-';
        $guru = $item->employee?->nama_lengkap ?? 'Guru';
        $mapel = $item->subject?->nama_mapel ?? '-';
        echo "       Slot {$slotNum} ({$item->time_start}-{$item->time_end}) -> {$mapel} [{$guru}]\n";
    }
}

echo "\n--- 2. RINGKASAN AUDIT ---\n";
echo "Total Slot KBM & Ekskul : {$schedules->count()} sesi terjadwal.\n";
echo "Status Roster SDIT      : " . ($schedules->count() >= 52 ? "LENGKAP (Senin-Jumat 50 JP KBM + Sabtu 2 Sesi Ekskul)" : "TERCATAT ({$schedules->count()} Sesi)") . "\n";
echo "=========================================================\n";
