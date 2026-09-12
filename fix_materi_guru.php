<?php
/**
 * Fix Script: Perbaiki guru_id pada lms_materi dan lms_modul_ajar
 * agar setiap materi hanya dimiliki guru yang BENAR-BENAR mengajar
 * mapel tersebut di kelas tersebut berdasarkan class_schedules.
 *
 * Pendekatan:
 * 1. Untuk setiap (kelas_id, mata_pelajaran_id) di modul_ajar:
 *    - Cari employee_id dari class_schedules yang sesuai
 *    - Update guru_id di lms_modul_ajar dan lms_materi
 * 2. Hapus modul_ajar + materi yang tidak ada pasangan jadwalnya (orphan)
 */

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== FIXING MATERI GURU ASSIGNMENT ===\n\n";

// Step 1: Ambil semua modul ajar beserta kelas dan mapelnya
$modulAjars = DB::table('lms_modul_ajar')
    ->whereNull('deleted_at')
    ->whereNotNull('kelas_id')
    ->whereNotNull('mata_pelajaran_id')
    ->select(['id', 'kelas_id', 'mata_pelajaran_id', 'guru_id', 'rombel_id'])
    ->get();

echo "Total modul ajar ditemukan: " . count($modulAjars) . "\n\n";

$fixedModuls = 0;
$fixedMateris = 0;
$deletedModuls = 0;
$deletedMateris = 0;
$skipped = 0;

foreach ($modulAjars as $modul) {
    $kelasId   = $modul->kelas_id;
    $mapelId   = $modul->mata_pelajaran_id;
    $modulId   = $modul->id;

    // Cari guru yang mengajar mapel ini di kelas ini dari jadwal
    $scheduleEmployeeIds = DB::table('class_schedules')
        ->where('kelas_id', $kelasId)
        ->where('subject_id', $mapelId)
        ->where('is_active', true)
        ->whereNotNull('employee_id')
        ->pluck('employee_id')
        ->unique()
        ->values();

    if ($scheduleEmployeeIds->isEmpty()) {
        // Tidak ada jadwal untuk kelas+mapel ini → modul ini adalah orphan
        // Hapus materi terlebih dahulu
        $matCount = DB::table('lms_materi')
            ->where('modul_ajar_id', $modulId)
            ->whereNull('deleted_at')
            ->count();
        DB::table('lms_materi')
            ->where('modul_ajar_id', $modulId)
            ->update(['deleted_at' => now()]);
        DB::table('lms_modul_ajar')
            ->where('id', $modulId)
            ->update(['deleted_at' => now()]);
        $deletedMateris += $matCount;
        $deletedModuls++;
        continue;
    }

    if ($scheduleEmployeeIds->count() > 1) {
        // Lebih dari 1 guru → ambil yang pertama (konsisten dengan seeder logic)
        $correctEmployeeId = $scheduleEmployeeIds->first();
    } else {
        $correctEmployeeId = $scheduleEmployeeIds->first();
    }

    // Update modul_ajar jika guru_id berbeda
    if ($modul->guru_id !== $correctEmployeeId) {
        DB::table('lms_modul_ajar')
            ->where('id', $modulId)
            ->update(['guru_id' => $correctEmployeeId]);

        // Update semua materi dalam modul ini
        $matUpdated = DB::table('lms_materi')
            ->where('modul_ajar_id', $modulId)
            ->whereNull('deleted_at')
            ->update(['guru_id' => $correctEmployeeId]);

        $fixedModuls++;
        $fixedMateris += $matUpdated;
        $kelasName = DB::table('tbl_kelas')->where('id', $kelasId)->value('nama_kelas');
        $mapelName = DB::table('subjects')->where('id', $mapelId)->value('nama_mapel');
        echo "  ✓ Fix: Kelas '{$kelasName}' + Mapel '{$mapelName}'\n";
        echo "    guru_id lama: {$modul->guru_id}\n";
        echo "    guru_id baru: {$correctEmployeeId}\n";
        echo "    materi diupdate: {$matUpdated}\n";
    } else {
        $skipped++;
    }
}

echo "\n=== HASIL ===\n";
echo "Modul Ajar difix   : $fixedModuls\n";
echo "Materi difix       : $fixedMateris\n";
echo "Modul orphan dihapus : $deletedModuls\n";
echo "Materi orphan dihapus: $deletedMateris\n";
echo "Sudah benar (skip) : $skipped\n";

// Verifikasi Ahmad Farhan
echo "\n=== VERIFIKASI Ahmad Farhan ===\n";
$farhanEmpId = '019fe0a0-2677-7073-901c-7918f5ccb95c';
$farhanMats = DB::table('lms_materi')
    ->where('guru_id', $farhanEmpId)
    ->whereNull('deleted_at')
    ->count();
echo "Total materi Ahmad Farhan setelah fix: $farhanMats\n";

$farhanByKelas = DB::table('lms_materi as m')
    ->join('lms_modul_ajar as ma', 'm.modul_ajar_id', '=', 'ma.id')
    ->join('tbl_kelas as k', 'ma.kelas_id', '=', 'k.id')
    ->join('subjects as s', 'ma.mata_pelajaran_id', '=', 's.id')
    ->where('m.guru_id', $farhanEmpId)
    ->whereNull('m.deleted_at')
    ->select('k.nama_kelas', 's.nama_mapel', DB::raw('COUNT(*) as total'))
    ->groupBy('k.nama_kelas', 's.nama_mapel')
    ->get();
foreach ($farhanByKelas as $row) {
    echo "  {$row->nama_kelas} | {$row->nama_mapel}: {$row->total} materi\n";
}
