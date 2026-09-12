<?php

namespace Database\Seeders;

use App\Models\LmsBankSoal;
use App\Models\LmsKisiKisi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LmsKisiKisiSeeder extends Seeder
{
    /**
     * Simulasi data Kisi-kisi Ujian untuk audit halaman LmsKisiKisiPage.
     * Data referensi diambil langsung dari database yang sudah ada (no hardcode ID).
     * Mencakup variasi: semua jenis ujian, semua level kognitif, berbagai status soal.
     */
    public function run(): void
    {
        // ─── Ambil data referensi dari database ───────────────────────────────
        $semGanjil   = \App\Models\Semester::where('name', 'Ganjil')->orWhere('name', 'Semester Ganjil')->first()
            ?? \App\Models\Semester::first();
        $semGenap    = \App\Models\Semester::where('name', 'Genap')->first()
            ?? \App\Models\Semester::skip(1)->first()
            ?? $semGanjil;
        $tahunAjaran = \App\Models\AcademicYear::where('is_active', true)->first()
            ?? \App\Models\AcademicYear::first();

        // Kurikulum per jenjang
        $kurSD  = \App\Models\MasterKurikulum::where('nama_kurikulum', 'like', '%SD%')->first()
            ?? \App\Models\MasterKurikulum::first();
        $kurSMP = \App\Models\MasterKurikulum::where('nama_kurikulum', 'like', '%SMP%')->first()
            ?? $kurSD;
        $kurSMA = \App\Models\MasterKurikulum::where('nama_kurikulum', 'like', '%SMA%')->first()
            ?? $kurSD;

        // Guru – ambil 5 random
        $gurus = \App\Models\Employee::limit(10)->get()->shuffle()->take(5)->values();

        // Kelas SD dan SMP
        $kelasSD  = \App\Models\Kelas::whereIn('tingkat', ['4', '5', '6'])->orWhere('nama_kelas', 'like', 'Kelas 4%')->limit(3)->get()->values();
        $kelasSMP = \App\Models\Kelas::whereIn('tingkat', ['7', '8', '9'])->orWhere('nama_kelas', 'like', 'Kelas 7%')->limit(3)->get()->values();
        if ($kelasSD->isEmpty()) $kelasSD = \App\Models\Kelas::limit(3)->get()->values();
        if ($kelasSMP->isEmpty()) $kelasSMP = \App\Models\Kelas::skip(3)->limit(3)->get()->values();

        // CP & TP SD
        $cpSD1 = \App\Models\CapaianPembelajaran::where('kode_cp', 'like', 'CP-SD-PAI%')->first();
        $tpSD1 = $cpSD1 ? \App\Models\TujuanPembelajaran::where('cp_id', $cpSD1->id)->first() : null;

        $cpSD2 = \App\Models\CapaianPembelajaran::where('kode_cp', 'like', 'CP-SD-MTK%')->first();
        $tpSD2 = $cpSD2 ? \App\Models\TujuanPembelajaran::where('cp_id', $cpSD2->id)->first() : null;

        $cpSD3 = \App\Models\CapaianPembelajaran::where('kode_cp', 'like', 'CP-SD-IND%')->first();
        $tpSD3 = $cpSD3 ? \App\Models\TujuanPembelajaran::where('cp_id', $cpSD3->id)->first() : null;

        // CP & TP SMP
        $cpSMP1 = \App\Models\CapaianPembelajaran::where('kode_cp', 'like', 'CP-SMP-PAI%')->first();
        $tpSMP1 = $cpSMP1 ? \App\Models\TujuanPembelajaran::where('cp_id', $cpSMP1->id)->first() : null;

        $cpSMP2 = \App\Models\CapaianPembelajaran::where('kode_cp', 'like', 'CP-SMP-MTK%')->first();
        $tpSMP2 = $cpSMP2 ? \App\Models\TujuanPembelajaran::where('cp_id', $cpSMP2->id)->first() : null;

        $cpSMP3 = \App\Models\CapaianPembelajaran::where('kode_cp', 'like', 'CP-SMP-TFZ%')->first()
            ?? \App\Models\CapaianPembelajaran::where('kode_cp', 'like', 'CP-SMP%')->skip(2)->first();
        $tpSMP3 = $cpSMP3 ? \App\Models\TujuanPembelajaran::where('cp_id', $cpSMP3->id)->first() : null;

        // Mata pelajaran yang terhubung ke CP
        $mapelPAI_SD  = $cpSD1 ? \App\Models\Subject::find($cpSD1->mata_pelajaran_id) : \App\Models\Subject::where('kode_mapel', 'like', '%PAI%')->first();
        $mapelMTK_SD  = $cpSD2 ? \App\Models\Subject::find($cpSD2->mata_pelajaran_id) : \App\Models\Subject::where('kode_mapel', 'like', '%MTK%SD%')->first();
        $mapelIND_SD  = $cpSD3 ? \App\Models\Subject::find($cpSD3->mata_pelajaran_id) : \App\Models\Subject::where('kode_mapel', 'like', '%IND%')->first();
        $mapelPAI_SMP = $cpSMP1 ? \App\Models\Subject::find($cpSMP1->mata_pelajaran_id) : \App\Models\Subject::where('kode_mapel', 'like', '%PAI%SMP%')->first();
        $mapelMTK_SMP = $cpSMP2 ? \App\Models\Subject::find($cpSMP2->mata_pelajaran_id) : \App\Models\Subject::where('kode_mapel', 'like', '%MTK%SMP%')->first();
        $mapelTFZ_SMP = $cpSMP3 ? \App\Models\Subject::find($cpSMP3->mata_pelajaran_id) : null;

        // Fallback ke subject pertama jika null
        $fallbackMapel = \App\Models\Subject::first();
        $mapelPAI_SD  = $mapelPAI_SD ?? $fallbackMapel;
        $mapelMTK_SD  = $mapelMTK_SD ?? $fallbackMapel;
        $mapelIND_SD  = $mapelIND_SD ?? $fallbackMapel;
        $mapelPAI_SMP = $mapelPAI_SMP ?? $fallbackMapel;
        $mapelMTK_SMP = $mapelMTK_SMP ?? $fallbackMapel;
        $mapelTFZ_SMP = $mapelTFZ_SMP ?? $fallbackMapel;

        $guru0 = $gurus->get(0);
        $guru1 = $gurus->get(1) ?? $guru0;
        $guru2 = $gurus->get(2) ?? $guru0;
        $guru3 = $gurus->get(3) ?? $guru0;
        $guru4 = $gurus->get(4) ?? $guru0;

        $kelasSD_0  = $kelasSD->get(0);
        $kelasSD_1  = $kelasSD->get(1) ?? $kelasSD_0;
        $kelasSMP_0 = $kelasSMP->get(0) ?? $kelasSD_0;
        $kelasSMP_1 = $kelasSMP->get(1) ?? $kelasSMP_0;

        // ─── Template 20 data kisi-kisi ──────────────────────────────────────
        $data = [
            // --- UH (Ulangan Harian) SD ---
            [
                'judul_kisi'         => 'Kisi-kisi UH 1 - PAI Semester Ganjil Kelas 4',
                'mata_pelajaran_id'  => $mapelPAI_SD->id,
                'cp_id'              => $cpSD1?->id,
                'tp_id'              => $tpSD1?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru0?->id,
                'jenis_ujian'        => 'UH',
                'jumlah_soal'        => 20,
                'alokasi_waktu_menit'=> 45,
                'kompetensi_dasar'   => 'Menjelaskan makna beriman kepada Allah SWT dan rukun iman; memahami dalil-dalil naqli',
                'level_kognitif'     => 'C2 - Memahami',
                'distribusi_bobot'   => ['pg' => 60, 'isian' => 20, 'esai' => 20],
                'status'             => true,
                'bank_soal_count'    => 20, // penuh — untuk simulasi progress bar 100%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi UH 2 - Matematika Operasi Bilangan Kelas 4',
                'mata_pelajaran_id'  => $mapelMTK_SD->id,
                'cp_id'              => $cpSD2?->id,
                'tp_id'              => $tpSD2?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru1?->id,
                'jenis_ujian'        => 'UH',
                'jumlah_soal'        => 25,
                'alokasi_waktu_menit'=> 60,
                'kompetensi_dasar'   => 'Operasi hitung bilangan bulat: penjumlahan, pengurangan, perkalian dan pembagian',
                'level_kognitif'     => 'C3 - Mengaplikasikan',
                'distribusi_bobot'   => ['pg' => 50, 'isian' => 30, 'esai' => 20],
                'status'             => true,
                'bank_soal_count'    => 12, // sebagian — 48%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi UH 1 - Bahasa Indonesia Teks Narasi Kelas 5',
                'mata_pelajaran_id'  => $mapelIND_SD->id,
                'cp_id'              => $cpSD3?->id,
                'tp_id'              => $tpSD3?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_1?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru2?->id,
                'jenis_ujian'        => 'UH',
                'jumlah_soal'        => 30,
                'alokasi_waktu_menit'=> 90,
                'kompetensi_dasar'   => 'Menyusun teks narasi dengan struktur orientasi, komplikasi, dan resolusi yang tepat',
                'level_kognitif'     => 'C4 - Menganalisis',
                'distribusi_bobot'   => ['pg' => 40, 'isian' => 30, 'esai' => 30],
                'status'             => true,
                'bank_soal_count'    => 0, // kosong — 0%
            ],

            // --- PTS (Penilaian Tengah Semester) ---
            [
                'judul_kisi'         => 'Kisi-kisi PTS Ganjil - PAI Kelas 4 SD',
                'mata_pelajaran_id'  => $mapelPAI_SD->id,
                'cp_id'              => $cpSD1?->id,
                'tp_id'              => $tpSD1?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru0?->id,
                'jenis_ujian'        => 'PTS',
                'jumlah_soal'        => 40,
                'alokasi_waktu_menit'=> 90,
                'kompetensi_dasar'   => 'Materi tengah semester 1: Rukun Islam, Sifat Allah, Thaharah, Shalat',
                'level_kognitif'     => 'C1 - Mengingat',
                'distribusi_bobot'   => ['pg' => 70, 'isian' => 20, 'esai' => 10],
                'status'             => true,
                'bank_soal_count'    => 35, // hampir penuh — 87.5%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi PTS Ganjil - Matematika Kelas 5 SD',
                'mata_pelajaran_id'  => $mapelMTK_SD->id,
                'cp_id'              => $cpSD2?->id,
                'tp_id'              => $tpSD2?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_1?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru1?->id,
                'jenis_ujian'        => 'PTS',
                'jumlah_soal'        => 35,
                'alokasi_waktu_menit'=> 90,
                'kompetensi_dasar'   => 'Bilangan bulat, pecahan, pengukuran panjang dan berat, serta geometri bangun datar',
                'level_kognitif'     => 'C3 - Mengaplikasikan',
                'distribusi_bobot'   => ['pg' => 60, 'isian' => 20, 'esai' => 20],
                'status'             => true,
                'bank_soal_count'    => 20, // sebagian — 57%
            ],

            // --- PAS (Penilaian Akhir Semester) ---
            [
                'judul_kisi'         => 'Kisi-kisi PAS Ganjil - PAI Semester 1 Kelas 4',
                'mata_pelajaran_id'  => $mapelPAI_SD->id,
                'cp_id'              => $cpSD1?->id,
                'tp_id'              => $tpSD1?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru0?->id,
                'jenis_ujian'        => 'PAS',
                'jumlah_soal'        => 50,
                'alokasi_waktu_menit'=> 120,
                'kompetensi_dasar'   => 'Seluruh materi Semester 1: Aqidah, Ibadah, Akhlak, Al-Quran, Sejarah Islam',
                'level_kognitif'     => 'C2 - Memahami',
                'distribusi_bobot'   => ['pg' => 60, 'isian' => 25, 'esai' => 15],
                'status'             => true,
                'bank_soal_count'    => 50, // penuh — 100%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi PAS Ganjil - Matematika Kelas 4 SD',
                'mata_pelajaran_id'  => $mapelMTK_SD->id,
                'cp_id'              => $cpSD2?->id,
                'tp_id'              => $tpSD2?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru1?->id,
                'jenis_ujian'        => 'PAS',
                'jumlah_soal'        => 45,
                'alokasi_waktu_menit'=> 120,
                'kompetensi_dasar'   => 'Rekap materi: operasi hitung, KPK-FPB, pecahan, bangun datar dan ruang',
                'level_kognitif'     => 'C4 - Menganalisis',
                'distribusi_bobot'   => ['pg' => 55, 'isian' => 25, 'esai' => 20],
                'status'             => true,
                'bank_soal_count'    => 0, // kosong
            ],

            // --- SMP Jenjang ---
            [
                'judul_kisi'         => 'Kisi-kisi UH 1 - PAI Kelas 7 Semester Ganjil',
                'mata_pelajaran_id'  => $mapelPAI_SMP->id,
                'cp_id'              => $cpSMP1?->id,
                'tp_id'              => $tpSMP1?->id,
                'kurikulum_id'       => $kurSMP?->id,
                'kelas_id'           => $kelasSMP_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru2?->id,
                'jenis_ujian'        => 'UH',
                'jumlah_soal'        => 25,
                'alokasi_waktu_menit'=> 60,
                'kompetensi_dasar'   => 'Beriman kepada Allah: Asmaul Husna, sifat wajib dan mustahil Allah SWT',
                'level_kognitif'     => 'C2 - Memahami',
                'distribusi_bobot'   => ['pg' => 60, 'isian' => 20, 'esai' => 20],
                'status'             => true,
                'bank_soal_count'    => 15, // sebagian — 60%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi UH 2 - Matematika Aljabar Kelas 7 SMP',
                'mata_pelajaran_id'  => $mapelMTK_SMP->id,
                'cp_id'              => $cpSMP2?->id,
                'tp_id'              => $tpSMP2?->id,
                'kurikulum_id'       => $kurSMP?->id,
                'kelas_id'           => $kelasSMP_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru3?->id,
                'jenis_ujian'        => 'UH',
                'jumlah_soal'        => 30,
                'alokasi_waktu_menit'=> 75,
                'kompetensi_dasar'   => 'Persamaan dan pertidaksamaan linear satu variabel, PLSV, PTLSV',
                'level_kognitif'     => 'C3 - Mengaplikasikan',
                'distribusi_bobot'   => ['pg' => 50, 'isian' => 30, 'esai' => 20],
                'status'             => true,
                'bank_soal_count'    => 30, // penuh — 100%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi PTS Ganjil - Tahfizh Al-Quran Kelas 8 SMP',
                'mata_pelajaran_id'  => $mapelTFZ_SMP->id,
                'cp_id'              => $cpSMP3?->id,
                'tp_id'              => $tpSMP3?->id,
                'kurikulum_id'       => $kurSMP?->id,
                'kelas_id'           => $kelasSMP_1?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru4?->id,
                'jenis_ujian'        => 'PTS',
                'jumlah_soal'        => 15,
                'alokasi_waktu_menit'=> 30,
                'kompetensi_dasar'   => 'Hafalan surat Al-Mulk hingga An-Naba; tajwid mad thabii dan mad wajib muttashil',
                'level_kognitif'     => 'C1 - Mengingat',
                'distribusi_bobot'   => ['pg' => 40, 'isian' => 30, 'esai' => 30],
                'status'             => true,
                'bank_soal_count'    => 8, // sebagian — 53%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi PAS Ganjil - PAI Kelas 8 SMP',
                'mata_pelajaran_id'  => $mapelPAI_SMP->id,
                'cp_id'              => $cpSMP1?->id,
                'tp_id'              => $tpSMP1?->id,
                'kurikulum_id'       => $kurSMP?->id,
                'kelas_id'           => $kelasSMP_1?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru2?->id,
                'jenis_ujian'        => 'PAS',
                'jumlah_soal'        => 50,
                'alokasi_waktu_menit'=> 120,
                'kompetensi_dasar'   => 'Materi Semester 1: Iman, Fiqih Ibadah, Muamalah, Sejarah Khulafaurrasyidin',
                'level_kognitif'     => 'C5 - Mengevaluasi',
                'distribusi_bobot'   => ['pg' => 60, 'isian' => 20, 'esai' => 20],
                'status'             => true,
                'bank_soal_count'    => 0,
            ],

            // --- CBT ---
            [
                'judul_kisi'         => 'Kisi-kisi CBT Seleksi Olimpiade Matematika SD',
                'mata_pelajaran_id'  => $mapelMTK_SD->id,
                'cp_id'              => $cpSD2?->id,
                'tp_id'              => $tpSD2?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_1?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru1?->id,
                'jenis_ujian'        => 'CBT',
                'jumlah_soal'        => 40,
                'alokasi_waktu_menit'=> 90,
                'kompetensi_dasar'   => 'Soal HOTS olimpiade: pola bilangan, logika matematika, kombinatorika dasar',
                'level_kognitif'     => 'C6 - Mencipta',
                'distribusi_bobot'   => ['pg' => 100, 'isian' => 0, 'esai' => 0],
                'status'             => true,
                'bank_soal_count'    => 28, // 70%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi CBT Diagnosis Belajar - Bahasa Indonesia Kelas 5',
                'mata_pelajaran_id'  => $mapelIND_SD->id,
                'cp_id'              => $cpSD3?->id,
                'tp_id'              => $tpSD3?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_1?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru2?->id,
                'jenis_ujian'        => 'CBT',
                'jumlah_soal'        => 20,
                'alokasi_waktu_menit'=> 45,
                'kompetensi_dasar'   => 'Diagnosis kemampuan membaca pemahaman, kosa kata, dan menulis kalimat efektif',
                'level_kognitif'     => 'C4 - Menganalisis',
                'distribusi_bobot'   => ['pg' => 80, 'isian' => 20, 'esai' => 0],
                'status'             => true,
                'bank_soal_count'    => 20, // penuh — 100%
            ],

            // --- Remedial ---
            [
                'judul_kisi'         => 'Kisi-kisi Remedial UH 1 - PAI Kelas 4',
                'mata_pelajaran_id'  => $mapelPAI_SD->id,
                'cp_id'              => $cpSD1?->id,
                'tp_id'              => $tpSD1?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru0?->id,
                'jenis_ujian'        => 'Remedial',
                'jumlah_soal'        => 10,
                'alokasi_waktu_menit'=> 30,
                'kompetensi_dasar'   => 'Soal perbaikan fokus materi: rukun iman dan pengertian iman kepada Allah',
                'level_kognitif'     => 'C1 - Mengingat',
                'distribusi_bobot'   => ['pg' => 70, 'isian' => 30, 'esai' => 0],
                'status'             => true,
                'bank_soal_count'    => 5, // 50%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi Remedial PTS - Matematika Kelas 7 SMP',
                'mata_pelajaran_id'  => $mapelMTK_SMP->id,
                'cp_id'              => $cpSMP2?->id,
                'tp_id'              => $tpSMP2?->id,
                'kurikulum_id'       => $kurSMP?->id,
                'kelas_id'           => $kelasSMP_0?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru3?->id,
                'jenis_ujian'        => 'Remedial',
                'jumlah_soal'        => 15,
                'alokasi_waktu_menit'=> 45,
                'kompetensi_dasar'   => 'Perbaikan materi PLSV: penyelesaian persamaan linear dengan satu variabel',
                'level_kognitif'     => 'C2 - Memahami',
                'distribusi_bobot'   => ['pg' => 60, 'isian' => 40, 'esai' => 0],
                'status'             => true,
                'bank_soal_count'    => 0,
            ],

            // --- Status nonaktif (untuk uji filter status) ---
            [
                'judul_kisi'         => '[DRAFT] Kisi-kisi PAS Genap - PAI Kelas 4 (Belum Aktif)',
                'mata_pelajaran_id'  => $mapelPAI_SD->id,
                'cp_id'              => $cpSD1?->id,
                'tp_id'              => $tpSD1?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_0?->id,
                'semester_id'        => $semGenap->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru0?->id,
                'jenis_ujian'        => 'PAS',
                'jumlah_soal'        => 50,
                'alokasi_waktu_menit'=> 120,
                'kompetensi_dasar'   => 'Draft materi Semester 2: belum final, menunggu verifikasi tim kurikulum',
                'level_kognitif'     => 'C3 - Mengaplikasikan',
                'distribusi_bobot'   => ['pg' => 60, 'isian' => 20, 'esai' => 20],
                'status'             => false, // NONAKTIF
                'bank_soal_count'    => 0,
            ],
            [
                'judul_kisi'         => '[DRAFT] Kisi-kisi UH Genap - Matematika Kelas 7 SMP',
                'mata_pelajaran_id'  => $mapelMTK_SMP->id,
                'cp_id'              => $cpSMP2?->id,
                'tp_id'              => $tpSMP2?->id,
                'kurikulum_id'       => $kurSMP?->id,
                'kelas_id'           => $kelasSMP_0?->id,
                'semester_id'        => $semGenap->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru3?->id,
                'jenis_ujian'        => 'UH',
                'jumlah_soal'        => 25,
                'alokasi_waktu_menit'=> 60,
                'kompetensi_dasar'   => 'Materi semester genap: Perbandingan, Aritmatika sosial, Himpunan (draft)',
                'level_kognitif'     => 'C4 - Menganalisis',
                'distribusi_bobot'   => ['pg' => 50, 'isian' => 30, 'esai' => 20],
                'status'             => false, // NONAKTIF
                'bank_soal_count'    => 3,
            ],

            // --- Tanpa distribusi bobot (bobot kosong, dihandle backend) ---
            [
                'judul_kisi'         => 'Kisi-kisi UH - Bahasa Indonesia Teks Eksposisi Kelas 5',
                'mata_pelajaran_id'  => $mapelIND_SD->id,
                'cp_id'              => $cpSD3?->id,
                'tp_id'              => $tpSD3?->id,
                'kurikulum_id'       => $kurSD?->id,
                'kelas_id'           => $kelasSD_1?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru2?->id,
                'jenis_ujian'        => 'UH',
                'jumlah_soal'        => 20,
                'alokasi_waktu_menit'=> 45,
                'kompetensi_dasar'   => 'Membedakan teks eksposisi dan deskripsi, menyusun kerangka teks, argumentasi',
                'level_kognitif'     => 'C5 - Mengevaluasi',
                'distribusi_bobot'   => null, // tanpa distribusi — backend handle default
                'status'             => true,
                'bank_soal_count'    => 11, // 55%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi CBT - Penilaian Karakter Islami SMP',
                'mata_pelajaran_id'  => $mapelPAI_SMP->id,
                'cp_id'              => $cpSMP1?->id,
                'tp_id'              => null, // tanpa TP
                'kurikulum_id'       => $kurSMP?->id,
                'kelas_id'           => $kelasSMP_1?->id,
                'semester_id'        => $semGanjil->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru4?->id,
                'jenis_ujian'        => 'CBT',
                'jumlah_soal'        => 60,
                'alokasi_waktu_menit'=> 90,
                'kompetensi_dasar'   => 'Penilaian karakter: kejujuran, kedisiplinan, tanggung jawab, kerja keras, dan toleransi',
                'level_kognitif'     => 'C6 - Mencipta',
                'distribusi_bobot'   => ['pg' => 100, 'isian' => 0, 'esai' => 0],
                'status'             => true,
                'bank_soal_count'    => 45, // 75%
            ],
            [
                'judul_kisi'         => 'Kisi-kisi PAS Genap - Matematika Kelas 8 SMP',
                'mata_pelajaran_id'  => $mapelMTK_SMP->id,
                'cp_id'              => $cpSMP2?->id,
                'tp_id'              => $tpSMP2?->id,
                'kurikulum_id'       => $kurSMP?->id,
                'kelas_id'           => $kelasSMP_1?->id,
                'semester_id'        => $semGenap->id,
                'tahun_ajaran_id'    => $tahunAjaran->id,
                'guru_id'            => $guru3?->id,
                'jenis_ujian'        => 'PAS',
                'jumlah_soal'        => 40,
                'alokasi_waktu_menit'=> 120,
                'kompetensi_dasar'   => 'Relasi dan Fungsi, Sistem Persamaan Linear, Teorema Pythagoras, Bangun Ruang',
                'level_kognitif'     => 'C4 - Menganalisis',
                'distribusi_bobot'   => ['pg' => 60, 'isian' => 20, 'esai' => 20],
                'status'             => true,
                'bank_soal_count'    => 40, // penuh — 100%
            ],
        ];

        $this->command->info('[LmsKisiKisiSeeder] Memasukkan ' . count($data) . ' data kisi-kisi ujian...');

        foreach ($data as $index => $item) {
            $bankSoalCount = $item['bank_soal_count'] ?? 0;
            unset($item['bank_soal_count']);

            // Hapus null agar tidak override default
            $item = array_filter($item, fn($v) => $v !== null);

            /** @var LmsKisiKisi $kisi */
            $kisi = LmsKisiKisi::create($item);

            // Simulasi bank soal sesuai jumlah (agar bank_soal_count akurat via withCount)
            if ($bankSoalCount > 0 && $kisi) {
                $soalBatch = [];
                $tipoSoal = 'pg';
                for ($i = 1; $i <= $bankSoalCount; $i++) {
                    $kodeUrut = str_pad($i, 3, '0', STR_PAD_LEFT);
                    $soalBatch[] = [
                        'id'               => Str::uuid()->toString(),
                        'kisi_kisi_id'     => $kisi->id,
                        'mata_pelajaran_id'=> $kisi->mata_pelajaran_id,
                        'kode_soal'        => 'SOAL-' . strtoupper(Str::random(4)) . '-' . $kodeUrut,
                        'pertanyaan'       => "Soal simulasi #{$i}: Manakah pernyataan yang paling tepat terkait materi pada kisi-kisi \"{$kisi->judul_kisi}\"?",
                        'tipe_soal'        => $tipoSoal,
                        'opsi_a'           => 'Pernyataan A yang benar',
                        'opsi_b'           => 'Pernyataan B yang salah',
                        'opsi_c'           => 'Pernyataan C yang mendekati benar',
                        'opsi_d'           => 'Pernyataan D yang salah',
                        'opsi_e'           => null,
                        'kunci_jawaban'    => 'a',
                        'pembahasan'       => "Jawaban A adalah yang paling tepat karena sesuai dengan konsep dasar materi #{$i}.",
                        'poin'             => 1,
                        'tingkat_kesulitan'=> ($i % 3 === 0) ? 'sulit' : (($i % 2 === 0) ? 'sedang' : 'mudah'),
                        'indikator'        => $kisi->kompetensi_dasar,
                        'gambar_path'      => null,
                        'status'           => true,
                        'created_at'       => now(),
                        'updated_at'       => now(),
                    ];
                }
                LmsBankSoal::insert($soalBatch);
            }

            $no = $index + 1;
            $this->command->line("  [{$no}] {$kisi->judul_kisi} (soal: {$bankSoalCount}/{$kisi->jumlah_soal})");
        }

        $this->command->info('[LmsKisiKisiSeeder] Selesai. Total: ' . LmsKisiKisi::count() . ' kisi-kisi, ' . LmsBankSoal::count() . ' bank soal.');
    }
}
