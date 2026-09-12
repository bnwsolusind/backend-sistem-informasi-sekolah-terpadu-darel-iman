<?php
/**
 * Re-seed materi belajar hanya untuk guru yang datanya 0
 * berdasarkan class_schedules yang valid.
 * Script ini membuat modul_ajar + materi baru untuk setiap
 * kombinasi (kelas, mapel, guru) yang ada di jadwal tapi
 * belum punya materi.
 */

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

echo "=== RE-SEED MATERI UNTUK GURU TANPA MATERI ===\n\n";

// Konstanta waktu akademik
$kbmStartGanjil = Carbon::parse('2026-07-14');
$kbmStartGenap  = Carbon::parse('2027-01-06');
$systemToday    = Carbon::now();

// Ambil referensi akademik
$tahunAjaran = DB::table('academic_years')->where('is_active', true)->first()
    ?? DB::table('academic_years')->orderByDesc('created_at')->first();
$semGanjil   = DB::table('semesters')->where('academic_year_id', $tahunAjaran->id)->where('sequence', 1)->first()
    ?? DB::table('semesters')->where('academic_year_id', $tahunAjaran->id)->orderBy('sequence')->first();
$semGenap    = DB::table('semesters')->where('academic_year_id', $tahunAjaran->id)->where('sequence', 2)->first();
$kurikulum   = DB::table('master_kurikulum')->orderByDesc('created_at')->first();

echo "Tahun Ajaran: ".($tahunAjaran->name ?? $tahunAjaran->id)."\n";
echo "Semester Ganjil ID: ".($semGanjil->id ?? 'NOT FOUND')."\n";
echo "Semester Genap ID : " . ($semGenap?->id ?? 'NOT FOUND') . "\n";
echo "Kurikulum: ".($kurikulum->nama_kurikulum ?? $kurikulum->name ?? $kurikulum->id ?? 'none')."\n\n";

// Domain topik per kategori mapel (ringkas 8 topik/semester)
$domains = [
    'Al-Quran' => [
        'ganjil' => [
            ['t' => 'Adab Membaca Al-Qur\'an & Niat Ikhlas', 's' => 'Syarat keabsahan ibadah tilawah harian'],
            ['t' => 'Makharijul Huruf: Al-Halaq', 's' => 'Huruf tenggorokan: hamzah, ha, ain, kha, ghain'],
            ['t' => 'Hukum Nun Sukun: Idzhar Halqi', 's' => 'Membaca jelas tanpa dengung pada 6 huruf halq'],
            ['t' => 'Hukum Nun Sukun: Idgham Bighunnah', 's' => 'Dengung 2 harakat pada huruf Y, N, M, W'],
            ['t' => 'Hukum Mim Sukun: Ikhfa Syafawi', 's' => 'Mim sukun bertemu Ba dengan dengung ringan'],
            ['t' => 'Hukum Mad Asli (Thabi\'i)', 's' => 'Panjang 2 harakat pada Alif, Wawu, Ya sukun'],
            ['t' => 'Hukum Mad Wajib Muttashil', 's' => 'Mad 4-5 harakat dalam satu kata'],
            ['t' => 'Tadabbur & Muroja\'ah Semester Ganjil', 's' => 'Ujian tahsin dan tasmi\' hafalan Juz 30'],
        ],
        'genap' => [
            ['t' => 'Hukum Qalqalah Sughra & Kubra', 's' => 'Pantulan huruf Q, T, B, J, D sukun dan wakaf'],
            ['t' => 'Tafkhim & Tarqiq pada Huruf Ra', 's' => 'Kondisi ra tebal dan tipis'],
            ['t' => 'Tanda Wakaf & Washal Utsmani', 's' => 'Tanda Mim lazim, La, Jim, dan titik tiga'],
            ['t' => 'Gharibul Qur\'an: Saktah & Imalah', 's' => 'Bacaan khusus riwayat Imam Hafsh'],
            ['t' => 'Tadabbur Surat An-Nazi\'at', 's' => 'Kisah Nabi Musa dan kepastian hari pembalasan'],
            ['t' => 'Hukum Mad Iwadh & Mad Badal', 's' => 'Mad pengganti tanwin dan hamzah'],
            ['t' => 'Teknik Menghafal Cepat Metode Ziyadah', 's' => 'Kombinasi tikrar 20x dan peta memori visual'],
            ['t' => 'Ujian Komprehensif Tahfizh & Tasmi\'', 's' => 'Sertifikasi hafalan akhir tahun ajaran'],
        ],
    ],
    'Diniyyah' => [
        'ganjil' => [
            ['t' => 'Konsep Tauhid & Rukun Iman', 's' => 'Mengenal Allah melalui Asmaul Husna'],
            ['t' => 'Fiqih Thaharah: Wudhu & Tayammum', 's' => 'Rukun, sunnah, dan hal yang membatalkan'],
            ['t' => 'Tata Cara Sholat Fardhu', 's' => 'Gerakan dan bacaan dari takbiratul ihram hingga salam'],
            ['t' => 'Sholat Berjamaah & Keutamaan Shaf', 's' => 'Adab makmum, masbuq, dan meluruskan shaf'],
            ['t' => 'Akhlak kepada Orang Tua (Birrul Walidain)', 's' => 'Bakti anak salih semasa hidup dan setelah wafat'],
            ['t' => 'Sifat Shiddiq & Amanah dalam Muamalah', 's' => 'Kejujuran dalam ujian dan menjaga amanah'],
            ['t' => 'Sirah Nabawiyah: Kelahiran & Kenabian', 's' => 'Kisah Rasulullah SAW dari Makkah ke Madinah'],
            ['t' => 'Ujian PAI Semester Ganjil & Refleksi Amal', 's' => 'Evaluasi pemahaman dan penilaian sikap ibadah'],
        ],
        'genap' => [
            ['t' => 'Rukun Islam & Makna Syahadat', 's' => 'Lima pilar Islam dan konsekuensi pengamalan'],
            ['t' => 'Zakat: Hukum, Jenis, dan Hikmah', 's' => 'Nisab, haul, dan penerima zakat'],
            ['t' => 'Puasa Ramadhan: Fiqih & Hikmah', 's' => 'Syarat sah, yang membatalkan, dan keutamaan'],
            ['t' => 'Haji & Umrah: Rukun dan Wajib', 's' => 'Manasik, ihram, dan larangan ihram'],
            ['t' => 'Adab Menuntut Ilmu & Menghormati Guru', 's' => 'Etika majelis ilmu dan adab belajar'],
            ['t' => 'Akhlak Terpuji: Sabar & Syukur', 's' => 'Penerapan dalam ujian kehidupan sehari-hari'],
            ['t' => 'Kisah Sahabat Nabi & Teladan Hijrah', 's' => 'Inspirasi dari Abu Bakar, Umar, Utsman, Ali RA'],
            ['t' => 'Ujian PAI Semester Genap & Khataman', 's' => 'Evaluasi akhir tahun dan doa bersama'],
        ],
    ],
    'Bahasa Arab' => [
        'ganjil' => [
            ['t' => 'Pengenalan Huruf Hijaiyah & Harakat', 's' => 'Fathah, kasrah, dhammah, sukun'],
            ['t' => 'Isim: Jenis, Gender & Bilangan', 's' => 'Mudzakkar, mu\'annats, mufrad, mutsanna, jama\''],
            ['t' => 'Fi\'il: Madhi, Mudhari\', Amr', 's' => 'Wazan dasar dan konjugasi dhamir'],
            ['t' => 'Jumlah Ismiyyah: Mubtada & Khabar', 's' => 'Kalimat nominal Arab dan variasinya'],
            ['t' => 'Jumlah Fi\'liyyah: Fi\'il & Fa\'il', 's' => 'Kalimat verbal dan urutan kata'],
            ['t' => 'Mufradat Topik Sekolah & Kehidupan', 's' => 'Kosakata 50 kata harian tema pendidikan'],
            ['t' => 'Bacaan & Percakapan: Al-Usratu', 's' => 'Dialog tentang keluarga dan rumah'],
            ['t' => 'Ujian Lisan & Tulisan Semester Ganjil', 's' => 'Imla\', qira\'ah, dan muhadatsah'],
        ],
        'genap' => [
            ['t' => 'Huruf Jar & Penggunaannya', 's' => 'Fi, Ala, Min, Ila, Ba, Li dalam kalimat'],
            ['t' => 'Isim Mausul: Alladzii & Allatii', 's' => 'Kata hubung dan klausa relatif Arab'],
            ['t' => 'Fi\'il Nahyi & Istifham', 's' => 'Larangan dan kalimat tanya dalam Arab'],
            ['t' => 'Mufradat Topik Alam & Lingkungan', 's' => '50 kosakata alam, cuaca, dan lingkungan'],
            ['t' => 'Bacaan Cerita: Yaumuun fii Al-Madrasah', 's' => 'Membaca teks narasi dan menjawab pertanyaan'],
            ['t' => 'Nahwu: Na\'at (Kata Sifat) & Hal', 's' => 'Kesesuaian sifat dan keadaan dalam kalimat'],
            ['t' => 'Insya\' Muwajjah: Mengarang Terbimbing', 's' => 'Menulis paragraf 5 kalimat Arab bertema'],
            ['t' => 'Ujian Komprehensif Bahasa Arab', 's' => 'Penilaian akhir 4 keterampilan bahasa'],
        ],
    ],
    'Eksak' => [
        'ganjil' => [
            ['t' => 'Bilangan Cacah & Operasi Hitung Dasar', 's' => 'Penjumlahan, pengurangan, perkalian, pembagian'],
            ['t' => 'Faktor, Kelipatan, FPB & KPK', 's' => 'Pohon faktor dan metode Euclid'],
            ['t' => 'Pecahan: Penyederhanaan & Operasi', 's' => 'Menyederhanakan, menjumlah, mengurang pecahan'],
            ['t' => 'Desimal & Persen: Konversi & Aplikasi', 's' => 'Hubungan pecahan, desimal, persen'],
            ['t' => 'Geometri: Bangun Datar & Luasnya', 's' => 'Persegi, persegi panjang, segitiga, trapesium'],
            ['t' => 'Bangun Ruang: Volume & Luas Permukaan', 's' => 'Kubus, balok, tabung, kerucut, bola'],
            ['t' => 'Statistika Dasar: Mean, Median, Modus', 's' => 'Analisis data sederhana dan diagram'],
            ['t' => 'Ujian Tengah & Akhir Semester Ganjil', 's' => 'Soal uraian dan pilihan ganda komprehensif'],
        ],
        'genap' => [
            ['t' => 'Bilangan Bulat: Positif, Negatif & Nol', 's' => 'Garis bilangan dan operasi bilangan bulat'],
            ['t' => 'Rasio, Proporsi & Skala', 's' => 'Perbandingan senilai dan berbalik nilai'],
            ['t' => 'Aljabar: Variabel, Ekspresi & Persamaan', 's' => 'Menyelesaikan persamaan linear satu variabel'],
            ['t' => 'Koordinat Kartesius & Transformasi', 's' => 'Translasi, refleksi, rotasi, dilatasi'],
            ['t' => 'Peluang Empiris & Teoritis', 's' => 'Percobaan acak, ruang sampel, dan frekuensi'],
            ['t' => 'Sistem Persamaan Linear Dua Variabel', 's' => 'Metode substitusi dan eliminasi'],
            ['t' => 'Pola Bilangan & Barisan Aritmatika', 's' => 'Menemukan suku ke-n dan jumlah suku'],
            ['t' => 'Ujian Akhir Tahun & Kenaikan Kelas', 's' => 'Evaluasi komprehensif seluruh materi'],
        ],
    ],
    'Umum' => [
        'ganjil' => [
            ['t' => 'Pengantar & Orientasi Mata Pelajaran', 's' => 'Ruang lingkup, KKM, dan target capaian'],
            ['t' => 'Konsep Dasar & Terminologi Utama', 's' => 'Kosakata kunci dan definisi operasional'],
            ['t' => 'Fakta, Konsep & Prinsip Inti Bab 1', 's' => 'Pemahaman literal dan analitis'],
            ['t' => 'Penerapan Konsep dalam Kehidupan', 's' => 'Studi kasus dan diskusi kontekstual'],
            ['t' => 'Analisis & Evaluasi Materi Bab 2', 's' => 'Latihan soal HOTS dan peer review'],
            ['t' => 'Proyek Kolaboratif Lintas Konsep', 's' => 'Presentasi kelompok dan umpan balik'],
            ['t' => 'Refleksi & Remediasi Semester Ganjil', 's' => 'Perbaikan capaian dan pengayaan'],
            ['t' => 'Ujian Akhir Semester Ganjil', 's' => 'Penilaian sumatif tertulis dan lisan'],
        ],
        'genap' => [
            ['t' => 'Review Semester Ganjil & Jembatan Konsep', 's' => 'Peta konsep dan hubungan antar bab'],
            ['t' => 'Eksplorasi Materi Semester Genap Bab 1', 's' => 'Membaca teks sumber dan analisis'],
            ['t' => 'Diskusi & Debat Ilmiah Terbimbing', 's' => 'Argumentasi berbasis data dan bukti'],
            ['t' => 'Studi Lapangan & Observasi Terapan', 's' => 'Pengumpulan data primer dan pelaporan'],
            ['t' => 'Sintesis: Membuat Ringkasan & Makalah', 's' => 'Menulis karya ilmiah sederhana'],
            ['t' => 'Presentasi Akhir & Peer Assessment', 's' => 'Rubrik penilaian dan umpan balik teman'],
            ['t' => 'Persiapan Ujian & Simulasi Soal', 's' => 'Bedah kisi-kisi dan latihan soal'],
            ['t' => 'Ujian Akhir Tahun & Kenaikan Kelas', 's' => 'Penilaian sumatif akhir tahun ajaran'],
        ],
    ],
];

function getDomainKey(?string $kategori, string $nama): string {
    $c = strtolower(($kategori ?? '') . ' ' . $nama);
    if (str_contains($c, 'tahfizh') || str_contains($c, 'quran') || str_contains($c, 'tajwid')) return 'Al-Quran';
    if (str_contains($c, 'agama') || str_contains($c, 'adab') || str_contains($c, 'fiqih') || str_contains($c, 'diniyyah') || str_contains($c, 'pai')) return 'Diniyyah';
    if (str_contains($c, 'arab')) return 'Bahasa Arab';
    if (str_contains($c, 'matema') || str_contains($c, 'sains') || str_contains($c, 'ipa') || str_contains($c, 'fisika')) return 'Eksak';
    return 'Umum';
}

function buildMarkdown(string $mapel, int $pekan, string $topik, string $sub, string $kelas): string {
    return "# {$topik}\n**Mata Pelajaran**: {$mapel} | **Kelas**: {$kelas} | **Pekan Ke**: {$pekan}\n\n---\n\n### A. Tujuan Pembelajaran\nPeserta didik mampu memahami, mempraktikkan, dan menginternalisasi materi **{$topik}**.\n\n### B. Uraian Materi\n> **{$sub}**\n\nKonsep ini menjadi landasan penting dalam menguasai capaian pembelajaran {$mapel}.\n\n#### Poin-Poin Kunci:\n- Pengertian dan landasan teori utama.\n- Contoh penerapan praktis dalam kehidupan santri.\n- Latihan dan evaluasi pemahaman.\n\n---\n*Materi Resmi LMS Darel Iman — Tahun Ajaran 2026/2027.*";
}

// Cari semua kombinasi kelas+mapel+guru dari jadwal yang valid
// dan belum punya materi sama sekali
$schedules = DB::table('class_schedules')
    ->where('is_active', true)
    ->whereNotNull('kelas_id')
    ->whereNotNull('subject_id')
    ->whereNotNull('employee_id')
    ->select(['kelas_id', 'subject_id', 'employee_id'])
    ->get()
    ->groupBy('kelas_id')
    ->map(fn($rows) => $rows->groupBy('subject_id')
        ->map(fn($s) => $s->pluck('employee_id')->unique()->values()->first())
    );

$totalModulCreated  = 0;
$totalMateriCreated = 0;
$materiBatch        = [];

$domainVideos = [
    'Al-Quran'   => 'https://www.youtube.com/watch?v=0hW2x7b7w2w',
    'Diniyyah'   => 'https://www.youtube.com/watch?v=w77zPAtVTuI',
    'Bahasa Arab'=> 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    'Eksak'      => 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    'Umum'       => 'https://www.youtube.com/watch?v=tgbNymZ7vqY',
];
$domainPdfs = [
    'Al-Quran'   => '/storage/lms/materi/modul_tajwid_al_quran.pdf',
    'Diniyyah'   => '/storage/lms/materi/modul_fiqih_ibadah.pdf',
    'Bahasa Arab'=> '/storage/lms/materi/modul_bahasa_arab.pdf',
    'Eksak'      => '/storage/lms/materi/modul_matematika_sains.pdf',
    'Umum'       => '/storage/lms/materi/sample_document.pdf',
];

foreach ($schedules as $kelasId => $mapelMap) {
    $kelas = DB::table('tbl_kelas')->where('id', $kelasId)->first(['id','nama_kelas','unit_pendidikan_id','tingkat','kode_kelas']);
    if (!$kelas) continue;

    foreach ($mapelMap as $mapelId => $teacherId) {
        if (!$teacherId) continue;

        // Cek apakah sudah ada materi
        $hasMateri = DB::table('lms_materi')
            ->where('guru_id', $teacherId)
            ->whereNull('deleted_at')
            ->whereExists(fn($q) => $q->from('lms_modul_ajar')
                ->whereColumn('lms_materi.modul_ajar_id', 'lms_modul_ajar.id')
                ->where('lms_modul_ajar.kelas_id', $kelasId)
                ->where('lms_modul_ajar.mata_pelajaran_id', $mapelId)
                ->whereNull('lms_modul_ajar.deleted_at')
            )
            ->exists();

        if ($hasMateri) continue; // Sudah ada, skip

        $subj = DB::table('subjects')->where('id', $mapelId)->first(['id','nama_mapel','kode_mapel','kategori']);
        if (!$subj) continue;

        $domKey  = getDomainKey($subj->kategori, $subj->nama_mapel);
        $domData = $domains[$domKey] ?? $domains['Umum'];

        echo "  → Seeding: {$kelas->nama_kelas} | {$subj->nama_mapel} | guru:{$teacherId}\n";

        $semestersConfig = [];
        if ($semGanjil) $semestersConfig[] = ['obj' => $semGanjil, 'name' => 'Ganjil', 'topics' => $domData['ganjil'], 'start' => $kbmStartGanjil];
        if ($semGenap)  $semestersConfig[] = ['obj' => $semGenap,  'name' => 'Genap',  'topics' => $domData['genap'],  'start' => $kbmStartGenap];

        foreach ($semestersConfig as $sem) {
            $chunks = [
                ['suffix' => 'M1', 'title' => 'Bagian I: Konsep Dasar', 'topics' => array_slice($sem['topics'], 0, 4), 'offset' => 0],
                ['suffix' => 'M2', 'title' => 'Bagian II: Pendalaman & Aplikasi', 'topics' => array_slice($sem['topics'], 4, 4), 'offset' => 4],
            ];

            foreach ($chunks as $chunk) {
                $modulId     = (string) Str::uuid();
                $cleanKelas  = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $kelas->kode_kelas ?? $kelas->nama_kelas), 0, 10));
                $cleanMapel  = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $subj->kode_mapel ?? $subj->nama_mapel), 0, 14));
                $kodeModul   = substr("MOD-{$cleanKelas}-{$cleanMapel}-".substr(strtoupper($sem['name']),0,3)."-{$chunk['suffix']}", 0, 50);
                $judulModul  = "Modul Ajar {$subj->nama_mapel} ({$sem['name']}) — {$chunk['title']}";
                $tingkat     = $kelas->tingkat ?? '1';
                $fase        = match(true) {
                    in_array(strtoupper($tingkat), ['TK','PAUD','TAUD','DAYCARE']) => 'Fase Fondasi',
                    in_array($tingkat, ['1','2']) => 'Fase A',
                    in_array($tingkat, ['3','4']) => 'Fase B',
                    in_array($tingkat, ['5','6']) => 'Fase C',
                    in_array($tingkat, ['7','8','9']) => 'Fase D',
                    $tingkat === '10' => 'Fase E',
                    in_array($tingkat, ['11','12']) => 'Fase F',
                    default => 'Fase Terpadu',
                };

                DB::table('lms_modul_ajar')->insert([
                    'id'                   => $modulId,
                    'unit_pendidikan_id'   => $kelas->unit_pendidikan_id,
                    'tahun_ajaran_id'      => $tahunAjaran->id,
                    'semester_id'          => $sem['obj']->id,
                    'kurikulum_id'         => $kurikulum->id,
                    'mata_pelajaran_id'    => $mapelId,
                    'guru_id'              => $teacherId,
                    'kelas_id'             => $kelasId,
                    'rombel_id'            => $kelasId,
                    'kode_modul'           => $kodeModul,
                    'judul_modul'          => $judulModul,
                    'fase'                 => $fase,
                    'semester'             => $sem['name'],
                    'alokasi_waktu_jp'     => 8,
                    'tujuan_pembelajaran'  => "Peserta didik mampu memahami {$subj->nama_mapel} secara tuntas dan berakhlak mulia.",
                    'profil_pelajar_pancasila' => 'Beriman, Bertakwa, Mandiri, Bernalar Kritis',
                    'model_pembelajaran'   => 'Inquiry-Based Learning',
                    'metode_pembelajaran'  => 'Diskusi, Praktik, Refleksi',
                    'media_pembelajaran'   => 'Video, E-Book, Lembar Kerja',
                    'sumber_belajar'       => 'Buku Panduan Darel Iman 2026/2027',
                    'kegiatan_pendahuluan' => "1. Pembukaan, tilawah, doa.\n2. Apersepsi dan tujuan pembelajaran.",
                    'kegiatan_inti'        => "1. Eksplorasi konsep.\n2. Diskusi kelompok.\n3. Presentasi.",
                    'kegiatan_penutup'     => "1. Simpulkan bersama.\n2. Doa kafaratul majelis.",
                    'rencana_penilaian'    => 'Formatif 40%, Portofolio 30%, Sikap 30%',
                    'status'               => 'published',
                    'versi'                => '1.0',
                    'created_at'           => $sem['start'],
                    'updated_at'           => $sem['start'],
                ]);
                $totalModulCreated++;

                foreach ($chunk['topics'] as $pIdx => $topic) {
                    $weekNum    = ($sem['name'] === 'Genap' ? 16 : 0) + $chunk['offset'] + $pIdx + 1;
                    $pubDate    = $sem['start']->copy()->addWeeks($chunk['offset'] + $pIdx);
                    $isPublished= $pubDate->lessThanOrEqualTo($systemToday);
                    $mediaTypes = ['dokumen','video','artikel','presentasi'];
                    $mediaType  = $mediaTypes[$pIdx % 4];
                    $filePath   = in_array($mediaType, ['dokumen','artikel']) ? ($domainPdfs[$domKey] ?? '/storage/lms/materi/sample_document.pdf') : null;
                    $videoUrl   = ($mediaType === 'video') ? ($domainVideos[$domKey] ?? '') : null;
                    $linkUrl    = ($mediaType === 'presentasi') ? 'https://slides.dareliman.sch.id/view/' . substr(md5($modulId.$pIdx), 0, 8) : null;

                    $materiBatch[] = [
                        'id'              => (string) Str::uuid(),
                        'modul_ajar_id'   => $modulId,
                        'mata_pelajaran_id' => $mapelId,
                        'guru_id'         => $teacherId,
                        'judul'           => sprintf('Pekan %02d: %s', $weekNum, $topic['t']),
                        'tipe_materi'     => $mediaType,
                        'tipe'            => ($mediaType === 'dokumen') ? 'pdf' : (($mediaType === 'video') ? 'video' : 'teks'),
                        'isi'             => buildMarkdown($subj->nama_mapel, $weekNum, $topic['t'], $topic['s'], $kelas->nama_kelas),
                        'konten'          => $topic['s'],
                        'file'            => $filePath,
                        'video'           => $videoUrl,
                        'link'            => $linkUrl,
                        'urutan'          => $pIdx + 1,
                        'is_published'    => $isPublished,
                        'status'          => $isPublished ? 'published' : 'draft',
                        'tanggal_publish' => $pubDate->format('Y-m-d H:i:s'),
                        'catatan'         => "Materi resmi semester {$sem['name']} 2026/2027.",
                        'created_at'      => $pubDate,
                        'updated_at'      => $pubDate,
                    ];
                    $totalMateriCreated++;

                    if (count($materiBatch) >= 100) {
                        DB::table('lms_materi')->insert($materiBatch);
                        $materiBatch = [];
                    }
                }
            }
        }
    }
}

if (!empty($materiBatch)) {
    DB::table('lms_materi')->insert($materiBatch);
}

echo "\n=== SELESAI ===\n";
echo "Modul dibuat : $totalModulCreated\n";
echo "Materi dibuat: $totalMateriCreated\n";

// Verifikasi Ahmad Farhan
echo "\n=== VERIFIKASI Ahmad Farhan ===\n";
$farhanEmpId = '019fe0a0-2677-7073-901c-7918f5ccb95c';
$rows = DB::table('lms_materi as m')
    ->join('lms_modul_ajar as ma', 'm.modul_ajar_id', '=', 'ma.id')
    ->join('tbl_kelas as k', 'ma.kelas_id', '=', 'k.id')
    ->join('subjects as s', 'ma.mata_pelajaran_id', '=', 's.id')
    ->where('m.guru_id', $farhanEmpId)
    ->whereNull('m.deleted_at')
    ->select('k.nama_kelas', 's.nama_mapel', DB::raw('COUNT(*) as total'))
    ->groupBy('k.nama_kelas', 's.nama_mapel')
    ->get();
if ($rows->isEmpty()) {
    echo "  ⚠ Masih 0 materi — jadwal Ahmad Farhan mungkin menggunakan teacher_id, bukan employee_id.\n";
    // Coba cari via teacher_id
    $tch = DB::table('teachers')->where('employee_id', $farhanEmpId)->first();
    if ($tch) {
        $rows2 = DB::table('lms_materi as m')
            ->join('lms_modul_ajar as ma', 'm.modul_ajar_id', '=', 'ma.id')
            ->join('tbl_kelas as k', 'ma.kelas_id', '=', 'k.id')
            ->join('subjects as s', 'ma.mata_pelajaran_id', '=', 's.id')
            ->where('m.guru_id', $tch->id)
            ->whereNull('m.deleted_at')
            ->select('k.nama_kelas', 's.nama_mapel', DB::raw('COUNT(*) as total'))
            ->groupBy('k.nama_kelas', 's.nama_mapel')
            ->get();
        echo "  Via teacher_id ({$tch->id}):\n";
        foreach ($rows2 as $r) echo "    {$r->nama_kelas} | {$r->nama_mapel}: {$r->total} materi\n";
    }
} else {
    foreach ($rows as $r) echo "  {$r->nama_kelas} | {$r->nama_mapel}: {$r->total} materi\n";
}
