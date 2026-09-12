<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

echo "=== MEMULAI SIMULASI & PELENGKAPAN KELAS SELURUH UNIT PENDIDIKAN ===" . PHP_EOL;

$activeAy = DB::table('academic_years')->where('is_active', true)->first();
$activeSem = DB::table('semesters')->where('academic_year_id', $activeAy->id)->where('is_active', true)->first()
    ?? DB::table('semesters')->where('academic_year_id', $activeAy->id)->first();

echo "Tahun Ajaran Aktif: {$activeAy->name} (ID: {$activeAy->id})" . PHP_EOL;
echo "Semester Aktif: {$activeSem->name} (ID: {$activeSem->id})" . PHP_EOL . PHP_EOL;

$units = DB::table('education_units')->orderBy('code')->get();

// Daftar konfigurasi standar per unit
$unitConfigs = [
    'PLAYHOUSE-01' => [
        'jenjang' => 'Daycare',
        'classes' => [
            ['tingkat' => 'Toddler', 'kode' => 'PLAY-TODDLER-A', 'nama' => 'Toddler & Daycare Group A', 'kapasitas' => 20, 'ruang' => 'Ruang Ceria 01', 'is_asrama' => false],
        ],
    ],
    'TAUD-01' => [
        'jenjang' => 'TAUD',
        'classes' => [
            ['tingkat' => 'Shighor', 'kode' => 'TAUD-SHIGHOR', 'nama' => 'TAUD-A (Shighor - Makkah)', 'kapasitas' => 25, 'ruang' => 'Ruang Talaqqi 01', 'is_asrama' => false],
            ['tingkat' => 'Kibar', 'kode' => 'TAUD-KIBAR', 'nama' => 'TAUD-B (Kibar - Madinah)', 'kapasitas' => 25, 'ruang' => 'Ruang Talaqqi 02', 'is_asrama' => false],
        ],
    ],
    'TKIT-01' => [
        'jenjang' => 'TKIT',
        'classes' => [
            ['tingkat' => 'A', 'kode' => 'TK1-A-MAKKAH', 'nama' => 'TK-A1 (Makkah)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang A1', 'is_asrama' => false],
            ['tingkat' => 'A', 'kode' => 'TK1-A-MADINAH', 'nama' => 'TK-A2 (Madinah)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang A2', 'is_asrama' => false],
            ['tingkat' => 'B', 'kode' => 'TK1-B-AQSHA', 'nama' => 'TK-B1 (Al-Aqsha)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang B1', 'is_asrama' => false],
            ['tingkat' => 'B', 'kode' => 'TK1-B-CORDOBA', 'nama' => 'TK-B2 (Cordoba)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang B2', 'is_asrama' => false],
        ],
    ],
    'TKIT-02' => [
        'jenjang' => 'TKIT',
        'classes' => [
            ['tingkat' => 'A', 'kode' => 'TK2-A-HAMZAH', 'nama' => 'TK-A1 (Hamzah)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang A1', 'is_asrama' => false],
            ['tingkat' => 'A', 'kode' => 'TK2-A-BILAL', 'nama' => 'TK-A2 (Bilal)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang A2', 'is_asrama' => false],
            ['tingkat' => 'B', 'kode' => 'TK2-B-SALMAN', 'nama' => 'TK-B1 (Salman)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang B1', 'is_asrama' => false],
            ['tingkat' => 'B', 'kode' => 'TK2-B-KHALID', 'nama' => 'TK-B2 (Khalid)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang B2', 'is_asrama' => false],
        ],
    ],
    'TKIT-03' => [
        'jenjang' => 'TKIT',
        'classes' => [
            ['tingkat' => 'A', 'kode' => 'TK3-A-UBAIDAH', 'nama' => 'TK-A1 (Abu Ubaidah)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang A1', 'is_asrama' => false],
            ['tingkat' => 'A', 'kode' => 'TK3-A-AUF', 'nama' => 'TK-A2 (Abdurrahman)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang A2', 'is_asrama' => false],
            ['tingkat' => 'B', 'kode' => 'TK3-B-JAFAR', 'nama' => 'TK-B1 (Ja\'far)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang B1', 'is_asrama' => false],
            ['tingkat' => 'B', 'kode' => 'TK3-B-MUADZ', 'nama' => 'TK-B2 (Mu\'adz)', 'kapasitas' => 25, 'ruang' => 'Gedung TK Ruang B2', 'is_asrama' => false],
        ],
    ],
    'SDIT-01' => [
        'jenjang' => 'SDIT',
        'classes' => [
            ['tingkat' => '1', 'kode' => 'SD1-1-MAKKAH', 'nama' => 'Kelas 1 Makkah', 'kapasitas' => 25, 'ruang' => 'Ruang 101 Gedung A', 'is_asrama' => false],
            ['tingkat' => '2', 'kode' => 'SD1-2-MADINAH', 'nama' => 'Kelas 2 Madinah', 'kapasitas' => 25, 'ruang' => 'Ruang 102 Gedung A', 'is_asrama' => false],
            ['tingkat' => '3', 'kode' => 'SD1-3-BAGHDAD', 'nama' => 'Kelas 3 Baghdad', 'kapasitas' => 25, 'ruang' => 'Ruang 201 Gedung B', 'is_asrama' => false],
            ['tingkat' => '4', 'kode' => 'SD1-4-KAIRO', 'nama' => 'Kelas 4 Kairo', 'kapasitas' => 25, 'ruang' => 'Ruang 202 Gedung B', 'is_asrama' => false],
            ['tingkat' => '5', 'kode' => 'SD1-5-CORDOBA', 'nama' => 'Kelas 5 Cordoba', 'kapasitas' => 25, 'ruang' => 'Ruang 301 Gedung C', 'is_asrama' => false],
            ['tingkat' => '6', 'kode' => 'SD1-6-GRANADA', 'nama' => 'Kelas 6 Granada', 'kapasitas' => 25, 'ruang' => 'Ruang 302 Gedung C', 'is_asrama' => false],
        ],
    ],
    'SDIT-02' => [
        'jenjang' => 'SDIT',
        'classes' => [
            ['tingkat' => '1', 'kode' => 'SD2-1A-MAKKAH', 'nama' => 'Kelas 1 Makkah', 'kapasitas' => 25, 'ruang' => 'Ruang R-101', 'is_asrama' => false],
            ['tingkat' => '1', 'kode' => 'SD2-1B-MADINAH', 'nama' => 'Kelas 1 Madinah', 'kapasitas' => 25, 'ruang' => 'Ruang R-102', 'is_asrama' => false],
            ['tingkat' => '2', 'kode' => 'SD2-2A-MAKKAH', 'nama' => 'Kelas 2 Makkah', 'kapasitas' => 25, 'ruang' => 'Ruang R-201', 'is_asrama' => false],
            ['tingkat' => '2', 'kode' => 'SD2-2B-MADINAH', 'nama' => 'Kelas 2 Madinah', 'kapasitas' => 25, 'ruang' => 'Ruang R-202', 'is_asrama' => false],
            ['tingkat' => '3', 'kode' => 'SD2-3A-MAKKAH', 'nama' => 'Kelas 3 Makkah', 'kapasitas' => 25, 'ruang' => 'Ruang R-301', 'is_asrama' => false],
            ['tingkat' => '3', 'kode' => 'SD2-3B-MADINAH', 'nama' => 'Kelas 3 Madinah', 'kapasitas' => 25, 'ruang' => 'Ruang R-302', 'is_asrama' => false],
            ['tingkat' => '4', 'kode' => 'SD2-4A-MAKKAH', 'nama' => 'Kelas 4 Makkah', 'kapasitas' => 25, 'ruang' => 'Ruang R-401', 'is_asrama' => false],
            ['tingkat' => '4', 'kode' => 'SD2-4B-MADINAH', 'nama' => 'Kelas 4 Madinah', 'kapasitas' => 25, 'ruang' => 'Ruang R-402', 'is_asrama' => false],
            ['tingkat' => '5', 'kode' => 'SD2-5A-MAKKAH', 'nama' => 'Kelas 5 Makkah', 'kapasitas' => 25, 'ruang' => 'Ruang R-501', 'is_asrama' => false],
            ['tingkat' => '5', 'kode' => 'SD2-5B-MADINAH', 'nama' => 'Kelas 5 Madinah', 'kapasitas' => 25, 'ruang' => 'Ruang R-502', 'is_asrama' => false],
            ['tingkat' => '6', 'kode' => 'SD2-6A-MAKKAH', 'nama' => 'Kelas 6 Makkah', 'kapasitas' => 25, 'ruang' => 'Ruang R-601', 'is_asrama' => false],
            ['tingkat' => '6', 'kode' => 'SD2-6B-MADINAH', 'nama' => 'Kelas 6 Madinah', 'kapasitas' => 25, 'ruang' => 'Ruang R-602', 'is_asrama' => false],
        ],
    ],
    'SDIT-03' => [
        'jenjang' => 'SDIT',
        'classes' => [
            ['tingkat' => '1', 'kode' => 'SD3-1-ABUBAKAR', 'nama' => 'Kelas 1 Abu Bakar', 'kapasitas' => 25, 'ruang' => 'Ruang 101', 'is_asrama' => false],
            ['tingkat' => '2', 'kode' => 'SD3-2-UMAR', 'nama' => 'Kelas 2 Umar', 'kapasitas' => 25, 'ruang' => 'Ruang 102', 'is_asrama' => false],
            ['tingkat' => '3', 'kode' => 'SD3-3-UTSMAN', 'nama' => 'Kelas 3 Utsman', 'kapasitas' => 25, 'ruang' => 'Ruang 201', 'is_asrama' => false],
            ['tingkat' => '4', 'kode' => 'SD3-4-ALI', 'nama' => 'Kelas 4 Ali', 'kapasitas' => 25, 'ruang' => 'Ruang 202', 'is_asrama' => false],
            ['tingkat' => '5', 'kode' => 'SD3-5-THALHAH', 'nama' => 'Kelas 5 Thalhah', 'kapasitas' => 25, 'ruang' => 'Ruang 301', 'is_asrama' => false],
            ['tingkat' => '6', 'kode' => 'SD3-6-ZUBAIR', 'nama' => 'Kelas 6 Zubair', 'kapasitas' => 25, 'ruang' => 'Ruang 302', 'is_asrama' => false],
        ],
    ],
    'SDIT-04' => [
        'jenjang' => 'SDIT',
        'classes' => [
            ['tingkat' => '1', 'kode' => 'SD4-1-SAAD', 'nama' => 'Kelas 1 Sa\'ad bin Abi Waqqash', 'kapasitas' => 25, 'ruang' => 'Ruang 101', 'is_asrama' => false],
            ['tingkat' => '2', 'kode' => 'SD4-2-SAID', 'nama' => 'Kelas 2 Sa\'id bin Zaid', 'kapasitas' => 25, 'ruang' => 'Ruang 102', 'is_asrama' => false],
            ['tingkat' => '3', 'kode' => 'SD4-3-AUF', 'nama' => 'Kelas 3 Abdurrahman bin Auf', 'kapasitas' => 25, 'ruang' => 'Ruang 201', 'is_asrama' => false],
            ['tingkat' => '4', 'kode' => 'SD4-4-UBAIDAH', 'nama' => 'Kelas 4 Abu Ubaidah bin Jarrah', 'kapasitas' => 25, 'ruang' => 'Ruang 202', 'is_asrama' => false],
            ['tingkat' => '5', 'kode' => 'SD4-5-BILAL', 'nama' => 'Kelas 5 Bilal bin Rabah', 'kapasitas' => 25, 'ruang' => 'Ruang 301', 'is_asrama' => false],
            ['tingkat' => '6', 'kode' => 'SD4-6-SALMAN', 'nama' => 'Kelas 6 Salman Al-Farisi', 'kapasitas' => 25, 'ruang' => 'Ruang 302', 'is_asrama' => false],
        ],
    ],
    'MIT-01' => [
        'jenjang' => 'MIT',
        'classes' => [
            ['tingkat' => '1', 'kode' => 'MIT-1-NAFI', 'nama' => 'Kelas 1 MIT SaQu (Imam Nafi\')', 'kapasitas' => 25, 'ruang' => 'Ruang Tahfizh 101', 'is_asrama' => false],
            ['tingkat' => '2', 'kode' => 'MIT-2-KATSIR', 'nama' => 'Kelas 2 MIT SaQu (Ibnu Katsir)', 'kapasitas' => 25, 'ruang' => 'Ruang Tahfizh 102', 'is_asrama' => false],
            ['tingkat' => '3', 'kode' => 'MIT-3-AMR', 'nama' => 'Kelas 3 MIT SaQu (Abu \'Amr)', 'kapasitas' => 25, 'ruang' => 'Ruang Tahfizh 201', 'is_asrama' => false],
            ['tingkat' => '4', 'kode' => 'MIT-4-AMIR', 'nama' => 'Kelas 4 MIT SaQu (Ibnu \'Amir)', 'kapasitas' => 25, 'ruang' => 'Ruang Tahfizh 202', 'is_asrama' => false],
            ['tingkat' => '5', 'kode' => 'MIT-5-ASHIM', 'nama' => 'Kelas 5 MIT SaQu (Imam \'Ashim)', 'kapasitas' => 25, 'ruang' => 'Ruang Tahfizh 301', 'is_asrama' => false],
            ['tingkat' => '6', 'kode' => 'MIT-6-HAMZAH', 'nama' => 'Kelas 6 MIT SaQu (Imam Hamzah)', 'kapasitas' => 25, 'ruang' => 'Ruang Tahfizh 302', 'is_asrama' => false],
        ],
    ],
    'SMPIT-01' => [
        'jenjang' => 'SMPIT',
        'classes' => [
            ['tingkat' => '7', 'kode' => 'SMP1-7A-SYAFII', 'nama' => 'Kelas VII-A Imam Syafi\'i (Ikhwan)', 'kapasitas' => 25, 'ruang' => 'Gedung Putra R-101', 'is_asrama' => false],
            ['tingkat' => '7', 'kode' => 'SMP1-7B-KHADIJAH', 'nama' => 'Kelas VII-B Khadijah (Akhwat)', 'kapasitas' => 25, 'ruang' => 'Gedung Putri R-102', 'is_asrama' => false],
            ['tingkat' => '8', 'kode' => 'SMP1-8A-MALIK', 'nama' => 'Kelas VIII-A Imam Malik (Ikhwan)', 'kapasitas' => 25, 'ruang' => 'Gedung Putra R-201', 'is_asrama' => false],
            ['tingkat' => '8', 'kode' => 'SMP1-8B-AISYAH', 'nama' => 'Kelas VIII-B Aisyah (Akhwat)', 'kapasitas' => 25, 'ruang' => 'Gedung Putri R-202', 'is_asrama' => false],
            ['tingkat' => '9', 'kode' => 'SMP1-9A-AHMAD', 'nama' => 'Kelas IX-A Imam Ahmad (Ikhwan)', 'kapasitas' => 25, 'ruang' => 'Gedung Putra R-301', 'is_asrama' => false],
            ['tingkat' => '9', 'kode' => 'SMP1-9B-FATHIMAH', 'nama' => 'Kelas IX-B Fathimah (Akhwat)', 'kapasitas' => 25, 'ruang' => 'Gedung Putri R-302', 'is_asrama' => false],
        ],
    ],
    'SMPIT-02' => [
        'jenjang' => 'SMPIT',
        'classes' => [
            ['tingkat' => '7', 'kode' => 'SMP2-7-THARIQ', 'nama' => 'Kelas VII Thariq bin Ziyad', 'kapasitas' => 25, 'ruang' => 'Ruang Belajar VII', 'is_asrama' => false],
            ['tingkat' => '8', 'kode' => 'SMP2-8-KHALID', 'nama' => 'Kelas VIII Khalid bin Walid', 'kapasitas' => 25, 'ruang' => 'Ruang Belajar VIII', 'is_asrama' => false],
            ['tingkat' => '9', 'kode' => 'SMP2-9-SHALAHUDDIN', 'nama' => 'Kelas IX Shalahuddin Al-Ayyubi', 'kapasitas' => 25, 'ruang' => 'Ruang Belajar IX', 'is_asrama' => false],
        ],
    ],
    'SMAIT-01' => [
        'jenjang' => 'SMAIT',
        'classes' => [
            ['tingkat' => '10', 'kode' => 'SMA-10-MIPA', 'nama' => 'Kelas X MIPA (Al-Khawarizmi)', 'kapasitas' => 25, 'ruang' => 'Lab Sains R-101', 'is_asrama' => false],
            ['tingkat' => '10', 'kode' => 'SMA-10-IPS', 'nama' => 'Kelas X IPS (Ibnu Khaldun)', 'kapasitas' => 25, 'ruang' => 'Ruang Sosial R-102', 'is_asrama' => false],
            ['tingkat' => '11', 'kode' => 'SMA-11-MIPA', 'nama' => 'Kelas XI MIPA (Ibnu Sina)', 'kapasitas' => 25, 'ruang' => 'Lab Sains R-201', 'is_asrama' => false],
            ['tingkat' => '11', 'kode' => 'SMA-11-IPS', 'nama' => 'Kelas XI IPS (Al-Biruni)', 'kapasitas' => 25, 'ruang' => 'Ruang Sosial R-202', 'is_asrama' => false],
            ['tingkat' => '12', 'kode' => 'SMA-12-MIPA', 'nama' => 'Kelas XII MIPA (Ibnu Haitsam)', 'kapasitas' => 25, 'ruang' => 'Lab Sains R-301', 'is_asrama' => false],
            ['tingkat' => '12', 'kode' => 'SMA-12-IPS', 'nama' => 'Kelas XII IPS (Ibnu Battuta)', 'kapasitas' => 25, 'ruang' => 'Ruang Sosial R-302', 'is_asrama' => false],
        ],
    ],
    'PONPES-PA' => [
        'jenjang' => 'PONPES',
        'classes' => [
            ['tingkat' => '7', 'kode' => 'PONPES-PA-7', 'nama' => 'Kelas VII Putra Ponpes (Imam Bukhari)', 'kapasitas' => 25, 'ruang' => 'KBM Syar\'i 01', 'is_asrama' => false],
            ['tingkat' => '8', 'kode' => 'PONPES-PA-8', 'nama' => 'Kelas VIII Putra Ponpes (Imam Muslim)', 'kapasitas' => 25, 'ruang' => 'KBM Syar\'i 02', 'is_asrama' => false],
            ['tingkat' => '9', 'kode' => 'PONPES-PA-9', 'nama' => 'Kelas IX Putra Ponpes (Imam Tirmidzi)', 'kapasitas' => 25, 'ruang' => 'KBM Syar\'i 03', 'is_asrama' => false],
            ['tingkat' => 'Asrama', 'kode' => 'ASR-FARABI', 'nama' => 'Asrama Gedung Al-Farabi (Putra)', 'kapasitas' => 50, 'ruang' => 'Kamar Asrama 101-105', 'is_asrama' => true],
        ],
    ],
    'PONPES-PI' => [
        'jenjang' => 'PONPES',
        'classes' => [
            ['tingkat' => '7', 'kode' => 'PONPES-PI-7', 'nama' => 'Kelas VII Putri Ponpes (Maryam)', 'kapasitas' => 25, 'ruang' => 'KBM Syar\'i Putri 01', 'is_asrama' => false],
            ['tingkat' => '8', 'kode' => 'PONPES-PI-8', 'nama' => 'Kelas VIII Putri Ponpes (Asma\')', 'kapasitas' => 25, 'ruang' => 'KBM Syar\'i Putri 02', 'is_asrama' => false],
            ['tingkat' => '9', 'kode' => 'PONPES-PI-9', 'nama' => 'Kelas IX Putri Ponpes (Hafshah)', 'kapasitas' => 25, 'ruang' => 'KBM Syar\'i Putri 03', 'is_asrama' => false],
            ['tingkat' => 'Asrama', 'kode' => 'ASR-KHADIJAH', 'nama' => 'Asrama Gedung Khadijah (Putri)', 'kapasitas' => 50, 'ruang' => 'Kamar Asrama Putri A-C', 'is_asrama' => true],
        ],
    ],
    'MAHAD-01' => [
        'jenjang' => 'MAHAD',
        'classes' => [
            ['tingkat' => '1', 'kode' => 'MAHAD-IDAD', 'nama' => 'Kelas I\'dad Lughowi (Tholabah)', 'kapasitas' => 25, 'ruang' => 'Halaqah Syaikh Al-Albani', 'is_asrama' => false],
            ['tingkat' => '2', 'kode' => 'MAHAD-TAKMILI', 'nama' => 'Kelas Takmili (Tholabah)', 'kapasitas' => 25, 'ruang' => 'Halaqah Ibnu Baz', 'is_asrama' => false],
            ['tingkat' => 'Asrama', 'kode' => 'ASR-ABUBAKAR', 'nama' => 'Asrama Gedung Abu Bakar (Ma\'had)', 'kapasitas' => 50, 'ruang' => 'Kamar Tholabah 201-205', 'is_asrama' => true],
        ],
    ],
];

// Ambil daftar guru aktif untuk ditunjuk sebagai wali kelas
$employees = DB::table('employees')->where('status', 'Aktif')->pluck('id')->toArray();
$empIndex = 0;

$createdCount = 0;
$updatedCount = 0;

DB::beginTransaction();
try {
    foreach ($units as $unit) {
        $cfg = $unitConfigs[$unit->code] ?? null;
        if (! $cfg) continue;

        echo "--- Unit: {$unit->code} ({$unit->name}) ---" . PHP_EOL;

        foreach ($cfg['classes'] as $c) {
            $assignedTeacherId = !empty($employees) ? $employees[$empIndex % count($employees)] : null;
            $empIndex++;

            // Cek apakah sudah ada kelas dengan kode/nama yang sama di unit ini
            $existing = DB::table('tbl_kelas')
                ->where('unit_pendidikan_id', $unit->id)
                ->where(function ($q) use ($c) {
                    $q->where('kode_kelas', $c['kode'])
                      ->orWhere('nama_kelas', $c['nama']);
                })
                ->whereNull('deleted_at')
                ->first();

            if ($existing) {
                // Update kapasitas & ruangan agar standar
                DB::table('tbl_kelas')->where('id', $existing->id)->update([
                    'tingkat' => (string) $c['tingkat'],
                    'nama_kelas' => $c['nama'],
                    'kapasitas' => $c['kapasitas'],
                    'ruangan' => $c['ruang'],
                    'status' => 'aktif',
                    'updated_at' => now(),
                ]);
                $kelasId = $existing->id;
                $updatedCount++;
                echo " [UPDATED] {$c['nama']} ({$c['tingkat']}) -> Kuota: {$c['kapasitas']} | {$c['ruang']}" . PHP_EOL;
            } else {
                // Insert baru
                $kelasId = (string) Str::uuid();
                DB::table('tbl_kelas')->insert([
                    'id' => $kelasId,
                    'unit_pendidikan_id' => $unit->id,
                    'tahun_ajaran_id' => $activeAy->id,
                    'semester_id' => $activeSem->id,
                    'jenjang' => $cfg['jenjang'],
                    'tingkat' => (string) $c['tingkat'],
                    'kode_kelas' => $c['kode'],
                    'nama_kelas' => $c['nama'],
                    'wali_kelas_id' => $assignedTeacherId,
                    'kapasitas' => $c['kapasitas'],
                    'ruangan' => $c['ruang'],
                    'status' => 'aktif',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $createdCount++;
                echo " [CREATED] {$c['nama']} ({$c['tingkat']}) -> Kuota: {$c['kapasitas']} | {$c['ruang']}" . PHP_EOL;
            }

            // Sync ke tabel classes (SchoolClass) jika belum ada
            $existingSchoolClass = DB::table('classes')
                ->where('academic_year_id', $activeAy->id)
                ->where('name', $c['nama'])
                ->whereNull('deleted_at')
                ->first();

            if (! $existingSchoolClass) {
                DB::table('classes')->insert([
                    'id' => (string) Str::uuid(),
                    'academic_year_id' => $activeAy->id,
                    'semester_id' => $activeSem->id,
                    'homeroom_teacher_id' => null,
                    'name' => $c['nama'],
                    'level' => (string) $c['tingkat'],
                    'metadata' => json_encode(['unit_code' => $unit->code, 'kapasitas' => $c['kapasitas'], 'ruangan' => $c['ruang']]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    DB::commit();
    echo PHP_EOL . "=== SIMULASI SUKSES: {$createdCount} DIBUAT, {$updatedCount} DIPERBARUI ===" . PHP_EOL;
} catch (\Throwable $e) {
    DB::rollBack();
    echo "[ERROR] " . $e->getMessage() . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
}
