<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\CapaianPembelajaran;
use App\Models\EducationUnit;
use App\Models\MasterKurikulum;
use App\Models\Subject;
use App\Models\TujuanPembelajaran;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CapaianPembelajaranSeeder extends Seeder
{
    /**
     * Jalankan seeder simulasi Capaian Pembelajaran & Tujuan Pembelajaran 2026/2027.
     */
    public function run(): void
    {
        $tahunAktif = AcademicYear::where('is_active', true)->first()
            ?? AcademicYear::where('name', '2026/2027')->first()
            ?? AcademicYear::first();

        if (! $tahunAktif) {
            $tahunAktif = AcademicYear::create([
                'name' => '2026/2027',
                'start_date' => '2026-07-01',
                'end_date' => '2027-06-30',
                'is_active' => true,
            ]);
        }

        $adminUser = User::first();
        $adminId = $adminUser?->id;

        $units = EducationUnit::all();
        if ($units->isEmpty()) {
            return;
        }

        // Definisi template Capaian Pembelajaran kontekstual Kurikulum Merdeka Terpadu
        $cpTemplates = [
            'TK' => [
                [
                    'sub_keywords' => ['PAI', 'AGAMA', 'AKHLAK', 'ISLAM'],
                    'kode_prefix' => 'CP-TK-AGM',
                    'nama_cp' => 'Nilai Agama dan Budi Pekerti Usia Dini',
                    'fase' => 'Fase Fondasi',
                    'kelas' => 'TK A',
                    'deskripsi' => 'Anak mengenal dan mempraktikkan rukun iman, rukun Islam, adab islami harian, kalimat thoyyibah, serta hafalan surat-surat pendek Juz Amma dengan pembiasaan penuh kasih sayang.',
                    'tps' => [
                        ['kode' => 'TP-TK-AGM-01', 'nama' => 'Mengenal Rukun Iman & Islam', 'deskripsi' => 'Menyebutkan rukun iman dan rukun Islam melalui senandung dan lagu islami terpadu.', 'jp' => 2],
                        ['kode' => 'TP-TK-AGM-02', 'nama' => 'Mempraktikkan Adab Makan & Belajar', 'deskripsi' => 'Membiasakan doa harian sebelum dan sesudah makan, belajar, serta adab masuk kamar mandi.', 'jp' => 2],
                    ],
                ],
                [
                    'sub_keywords' => ['TAHFIZH', 'QURAN', 'SAQU'],
                    'kode_prefix' => 'CP-TK-TFZ',
                    'nama_cp' => 'Hafalan dan Mahabbah Al-Qur\'an Juz Amma',
                    'fase' => 'Fase Fondasi',
                    'kelas' => 'TK B',
                    'deskripsi' => 'Anak mencintai Al-Qur\'an, mampu melafalkan surah An-Nas sampai Al-Kafirun dengan makharijul huruf yang baik serta menyimak kisah keteladanan Nabi.',
                    'tps' => [
                        ['kode' => 'TP-TK-TFZ-01', 'nama' => 'Hafalan Surah Pendek (An-Nas - Al-Ikhlas)', 'deskripsi' => 'Melafalkan surah An-Nas, Al-Falaq, dan Al-Ikhlas secara tartil dan berulang.', 'jp' => 4],
                        ['kode' => 'TP-TK-TFZ-02', 'nama' => 'Pengenalan Huruf Hijaiyah Berharakat', 'deskripsi' => 'Menunjuk dan menyebutkan huruf hijaiyah berharakat fathah, kasrah, dan dhommah.', 'jp' => 2],
                    ],
                ],
                [
                    'sub_keywords' => ['TEMATIK', 'LITERASI', 'DASAR', 'UMUM', 'INDO'],
                    'kode_prefix' => 'CP-TK-LIT',
                    'nama_cp' => 'Dasar-Dasar Literasi dan Karakter Jati Diri',
                    'fase' => 'Fase Fondasi',
                    'kelas' => 'TK B',
                    'deskripsi' => 'Anak menunjukkan kemampuan pra-membaca, mengenali simbol bunyi, mengekspresikan emosi secara mandiri, dan berinteraksi sosial dengan teman sebaya.',
                    'tps' => [
                        ['kode' => 'TP-TK-LIT-01', 'nama' => 'Mengenal Fonik dan Huruf Vokal', 'deskripsi' => 'Mengidentifikasi suara huruf vokal (A, I, U, E, O) dan menghubungkannya dengan gambar benda.', 'jp' => 2],
                        ['kode' => 'TP-TK-LIT-02', 'nama' => 'Berkomunikasi Santun & Berbagi', 'deskripsi' => 'Mengungkapkan ide sederhana dan berbagi mainan bersama teman secara bergiliran.', 'jp' => 2],
                    ],
                ],
            ],
            'SD' => [
                [
                    'sub_keywords' => ['PAI', 'AGAMA', 'ISLAM'],
                    'kode_prefix' => 'CP-SD-PAI-FA',
                    'nama_cp' => 'Memahami Rukun Islam dan Praktik Ibadah Sholat',
                    'fase' => 'Fase A',
                    'kelas' => 'Kelas 1',
                    'deskripsi' => 'Peserta didik mampu mengenal huruf hijaiyah bersambung, rukun iman, rukun Islam, tata cara bersuci (thaharah), serta gerakan dan bacaan sholat fardhu secara tertib.',
                    'tps' => [
                        ['kode' => 'TP-SD-PAI-01', 'nama' => 'Mempraktikkan Tata Cara Wudhu Sesuai Sunnah', 'deskripsi' => 'Mendemonstrasikan urutan dan doa wudhu dengan tertib dan benar.', 'jp' => 4],
                        ['kode' => 'TP-SD-PAI-02', 'nama' => 'Melafalkan Bacaan Sholat Fardhu', 'deskripsi' => 'Menghafal bacaan ruku, iktidal, sujud, dan tasyahhud akhir beserta artinya secara ringkas.', 'jp' => 4],
                    ],
                ],
                [
                    'sub_keywords' => ['TAHFIZH', 'QURAN'],
                    'kode_prefix' => 'CP-SD-TFZ-FB',
                    'nama_cp' => 'Hafalan Mutqin Juz 30 dan Tajwid Terpadu',
                    'fase' => 'Fase B',
                    'kelas' => 'Kelas 3',
                    'deskripsi' => 'Peserta didik mampu menghafalkan surah-surah Juz 30 (Al-Lail sampai An-Naba) secara mutqin, menerapkan hukum nun sukun, tanwin, dan mim sukun dalam tilawah harian.',
                    'tps' => [
                        ['kode' => 'TP-SD-TFZ-01', 'nama' => 'Ziyadah Surah Al-Muthaffifin - An-Naba', 'deskripsi' => 'Menghafal dan menyetorkan hafalan surah Al-Muthaffifin hingga An-Naba tanpa terbata-bata.', 'jp' => 6],
                        ['kode' => 'TP-SD-TFZ-02', 'nama' => 'Menerapkan Hukum Ghunnah dan Ikhfa', 'deskripsi' => 'Mengidentifikasi dan mempraktikkan hukum tajwid ghunnah dan ikhfa haqiqi saat membaca Al-Qur\'an.', 'jp' => 2],
                    ],
                ],
                [
                    'sub_keywords' => ['MATEMATIKA', 'MTK', 'BERHITUNG'],
                    'kode_prefix' => 'CP-SD-MTK-FA',
                    'nama_cp' => 'Pemahaman Bilangan Cacah dan Operasi Hitung Dasar',
                    'fase' => 'Fase A',
                    'kelas' => 'Kelas 2',
                    'deskripsi' => 'Peserta didik menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 100, menyelesaikan operasi penjumlahan dan pengurangan benda konkret.',
                    'tps' => [
                        ['kode' => 'TP-SD-MTK-01', 'nama' => 'Membilang dan Mengurutkan Bilangan 1-100', 'deskripsi' => 'Membaca, menuliskan lambang bilangan, dan membandingkan dua bilangan cacah hingga 100.', 'jp' => 4],
                        ['kode' => 'TP-SD-MTK-02', 'nama' => 'Operasi Penjumlahan & Pengurangan Tanpa Menyimpan', 'deskripsi' => 'Menyelesaikan soal kontekstual penjumlahan dan pengurangan bilangan dua angka.', 'jp' => 4],
                    ],
                ],
                [
                    'sub_keywords' => ['MATEMATIKA', 'MTK'],
                    'kode_prefix' => 'CP-SD-MTK-FC',
                    'nama_cp' => 'Operasi Pecahan, Desimal, dan Pengukuran Geometri',
                    'fase' => 'Fase C',
                    'kelas' => 'Kelas 5',
                    'deskripsi' => 'Peserta didik mampu memahami konsep KPK dan FPB, melakukan operasi hitung pecahan dan persen, serta menghitung luas dan keliling bangun datar gabungan.',
                    'tps' => [
                        ['kode' => 'TP-SD-MTK-03', 'nama' => 'Menentukan KPK dan FPB Menggunakan Faktorisasi', 'deskripsi' => 'Menemukan faktor persekutuan terbesar dan kelipatan persekutuan terkecil dalam pemecahan masalah nyata.', 'jp' => 4],
                        ['kode' => 'TP-SD-MTK-04', 'nama' => 'Penjumlahan dan Pengurangan Pecahan Berbeda Penyebut', 'deskripsi' => 'Menyamakan penyebut dan menghitung operasi penjumlahan pecahan biasa dan campuran.', 'jp' => 4],
                    ],
                ],
                [
                    'sub_keywords' => ['BAHASA INDONESIA', 'BINDO', 'INDONESIA'],
                    'kode_prefix' => 'CP-SD-IND-FB',
                    'nama_cp' => 'Membaca Teks Narasi dan Menulis Paragraf Deskripsi',
                    'fase' => 'Fase B',
                    'kelas' => 'Kelas 4',
                    'deskripsi' => 'Peserta didik mampu memahami ide pokok, kosakata baru, dan pesan moral dari teks narasi fiksi dan nonfiksi, serta terampil menulis karangan deskriptif runtut.',
                    'tps' => [
                        ['kode' => 'TP-SD-IND-01', 'nama' => 'Menemukan Ide Pokok Paragraf', 'deskripsi' => 'Mengidentifikasi kalimat utama dan kalimat penjelas dalam teks narasi pendek.', 'jp' => 3],
                        ['kode' => 'TP-SD-IND-02', 'nama' => 'Menyusun Karangan Deskripsi Pengalaman Santri', 'deskripsi' => 'Menulis karangan minimal 3 paragraf dengan tanda baca dan huruf kapital yang benar.', 'jp' => 3],
                    ],
                ],
                [
                    'sub_keywords' => ['IPA', 'IPAS', 'SAINS'],
                    'kode_prefix' => 'CP-SD-IPA-FC',
                    'nama_cp' => 'Sistem Organ Tubuh dan Ekosistem Lingkungan Hidup',
                    'fase' => 'Fase C',
                    'kelas' => 'Kelas 6',
                    'deskripsi' => 'Peserta didik mengidentifikasi sistem pernapasan dan pencernaan manusia, rantai makanan dalam ekosistem, serta melestarikan keanekaragaman hayati ciptaan Allah SWT.',
                    'tps' => [
                        ['kode' => 'TP-SD-IPA-01', 'nama' => 'Menganalisis Organ Pencernaan Manusia', 'deskripsi' => 'Menjelaskan fungsi lambung, usus halus, dan proses penyerapan nutrisi makanan halal lagi thoyyib.', 'jp' => 4],
                        ['kode' => 'TP-SD-IPA-02', 'nama' => 'Menganalisis Hubungan Jaring-Jaring Makanan', 'deskripsi' => 'Membuat bagan rantai makanan dalam ekosistem sawah dan hutan.', 'jp' => 3],
                    ],
                ],
                [
                    'sub_keywords' => ['ARAB', 'BARAB'],
                    'kode_prefix' => 'CP-SD-ARB-FB',
                    'nama_cp' => 'Percakapan Bahasa Arab Tematik Sekolah dan Rumah',
                    'fase' => 'Fase B',
                    'kelas' => 'Kelas 3',
                    'deskripsi' => 'Peserta didik mampu menyimak, melafalkan kosakata (mufrodat) tentang ruangan sekolah, anggota tubuh, dan percakapan salam ta\'aruf harian.',
                    'tps' => [
                        ['kode' => 'TP-SD-ARB-01', 'nama' => 'Mufrodat Perlengkapan Kelas & Sekolah', 'deskripsi' => 'Menghafalkan 20 kosakata benda di kelas beserta isim isyarah (hadza / hadzihi).', 'jp' => 2],
                        ['kode' => 'TP-SD-ARB-02', 'nama' => 'Hiwar Sederhana Perkenalan Diri', 'deskripsi' => 'Melakukan dialog tanya jawab nama, asal, dan hobi dalam bahasa Arab secara berpasangan.', 'jp' => 2],
                    ],
                ],
            ],
            'SMP' => [
                [
                    'sub_keywords' => ['PAI', 'AGAMA', 'DINIYAH', 'FIQIH'],
                    'kode_prefix' => 'CP-SMP-PAI-FD',
                    'nama_cp' => 'Kajian Ayat Al-Qur\'an, Hadits, dan Fiqih Muamalah Kontemporer',
                    'fase' => 'Fase D',
                    'kelas' => 'Kelas 8',
                    'deskripsi' => 'Peserta didik mampu menganalisis ayat-ayat Al-Qur\'an dan hadits tentang integritas, amanah, serta memahami prinsip muamalah jual beli yang bebas dari riba dan penipuan.',
                    'tps' => [
                        ['kode' => 'TP-SMP-PAI-01', 'nama' => 'Kajian Tafsir Tematik Kejujuran & Amanah', 'deskripsi' => 'Menganalisis kandungan QS An-Nisa: 58 tentang kewajiban menyampaikan amanah kepada pemiliknya.', 'jp' => 3],
                        ['kode' => 'TP-SMP-PAI-02', 'nama' => 'Ketentuan Jual Beli Islami & Bahaya Riba', 'deskripsi' => 'Membedakan transaksi jual beli yang sah dan transaksi batil yang dilarang syariat.', 'jp' => 3],
                    ],
                ],
                [
                    'sub_keywords' => ['TAHFIZH', 'QURAN', 'KITAB'],
                    'kode_prefix' => 'CP-SMP-TFZ-FD',
                    'nama_cp' => 'Tahfizh Al-Qur\'an Juz 28 - 26 dan Tahsin Al-Jazariyyah',
                    'fase' => 'Fase D',
                    'kelas' => 'Kelas 7',
                    'deskripsi' => 'Peserta didik menghafal mutqin surah Al-Mujadilah sampai At-Tahrim (Juz 28), memahami kaidah sifatul huruf dan makharijul huruf berpedoman pada matan Jazariyyah.',
                    'tps' => [
                        ['kode' => 'TP-SMP-TFZ-01', 'nama' => 'Ziyadah Surah Al-Hasyr dan Al-Mumtahanah', 'deskripsi' => 'Menghafalkan dan memperdengarkan hafalan dengan tajwid makharijul huruf sempurna.', 'jp' => 6],
                        ['kode' => 'TP-SMP-TFZ-02', 'nama' => 'Tasmi\' Sab\'ah & Muroja\'ah Bersanad', 'deskripsi' => 'Menyetorkan sekali duduk 1 juz hafalan tanpa kesalahan fatal.', 'jp' => 4],
                    ],
                ],
                [
                    'sub_keywords' => ['MATEMATIKA', 'MTK'],
                    'kode_prefix' => 'CP-SMP-MTK-FD',
                    'nama_cp' => 'Aljabar, Persamaan Linear, dan Teorema Pythagoras',
                    'fase' => 'Fase D',
                    'kelas' => 'Kelas 8',
                    'deskripsi' => 'Peserta didik mampu mengoperasikan bentuk aljabar suku banyak, menyelesaikan sistem persamaan linear dua variabel (SPLDV), serta menerapkan teorema Pythagoras pada geometri ruang.',
                    'tps' => [
                        ['kode' => 'TP-SMP-MTK-01', 'nama' => 'Menyelesaikan Masalah Kontekstual SPLDV', 'deskripsi' => 'Menggunakan metode eliminasi dan substitusi dalam menyelesaikan persoalan harga barang.', 'jp' => 4],
                        ['kode' => 'TP-SMP-MTK-02', 'nama' => 'Penerapan Teorema Pythagoras', 'deskripsi' => 'Menghitung panjang sisi miring segitiga siku-siku dan diagonal bidang balok/kubus.', 'jp' => 4],
                    ],
                ],
                [
                    'sub_keywords' => ['IPA', 'SAINS'],
                    'kode_prefix' => 'CP-SMP-IPA-FD',
                    'nama_cp' => 'Tekanan Zat, Gelombang, Listrik Dinamis, dan Pewarisan Sifat',
                    'fase' => 'Fase D',
                    'kelas' => 'Kelas 9',
                    'deskripsi' => 'Peserta didik mampu menganalisis konsep tekanan hidrostatis, hukum Pascal, hukum Ohm dan rangkaian listrik, serta hukum Mendel dalam pewarisan sifat makhluk hidup.',
                    'tps' => [
                        ['kode' => 'TP-SMP-IPA-01', 'nama' => 'Eksperimen Hukum Archimedes & Tekanan Zat Cair', 'deskripsi' => 'Menganalisis gaya apung pada kapal laut dan kapal selam melalui percobaan laboratorium.', 'jp' => 4],
                        ['kode' => 'TP-SMP-IPA-02', 'nama' => 'Persilangan Monohibrid dan Dihibrid Mendel', 'deskripsi' => 'Membuat diagram persilangan genetika dan menghitung rasio fenotip keturunan.', 'jp' => 3],
                    ],
                ],
                [
                    'sub_keywords' => ['ARAB', 'BARAB', 'NAHWU'],
                    'kode_prefix' => 'CP-SMP-ARB-FD',
                    'nama_cp' => 'Kaidah Nahwu-Shorof Dasar dan Qira\'ah Kutub',
                    'fase' => 'Fase D',
                    'kelas' => 'Kelas 7',
                    'deskripsi' => 'Peserta didik memahami pembagian kata (Isim, Fi\'il, Huruf), tanda-tanda I\'rob (Rofa, Nashob, Khofad, Jazm), serta mampu menterjemahkan teks berbahasa Arab gundul sederhana.',
                    'tps' => [
                        ['kode' => 'TP-SMP-ARB-01', 'nama' => 'I\'rab Jumlah Fi\'liyyah dan Ismiyyah', 'deskripsi' => 'Menentukan kedudukan Mubtada-Khobar dan Fi\'il-Fa\'il dalam kalimat sempurna.', 'jp' => 3],
                        ['kode' => 'TP-SMP-ARB-02', 'nama' => 'Tasrif Lughowi dan Istilahi Fi\'il Madhi & Mudhari', 'deskripsi' => 'Mentashrif fi\'il tsulatsi mujarrad sesuai 14 dhomir munfashil.', 'jp' => 3],
                    ],
                ],
                [
                    'sub_keywords' => ['INGGRIS', 'BING', 'ENGLISH'],
                    'kode_prefix' => 'CP-SMP-ENG-FD',
                    'nama_cp' => 'Interactive Communication & Analytical Exposition Reading',
                    'fase' => 'Fase D',
                    'kelas' => 'Kelas 8',
                    'deskripsi' => 'Peserta didik mampu menggunakan bahasa Inggris lisan dan tulisan untuk berinteraksi dalam lingkup interpersonal dan transaksional, memahami teks recount, narrative, dan report.',
                    'tps' => [
                        ['kode' => 'TP-SMP-ENG-01', 'nama' => 'Comprehending Narrative Moral Stories', 'deskripsi' => 'Identify conflict, resolution, and moral value from traditional and Islamic folklores.', 'jp' => 4],
                        ['kode' => 'TP-SMP-ENG-02', 'nama' => 'Presenting Scientific Observations in English', 'deskripsi' => 'Draft a short report text describing endangered animals and present it orally.', 'jp' => 3],
                    ],
                ],
            ],
            'SMA' => [
                [
                    'sub_keywords' => ['PAI', 'AGAMA', 'SYARIAH', 'USHUL'],
                    'kode_prefix' => 'CP-SMA-PAI-FE',
                    'nama_cp' => 'Filosofi Hukum Islam, Fiqih Mawaris, dan Munakahat',
                    'fase' => 'Fase E',
                    'kelas' => 'Kelas 10',
                    'deskripsi' => 'Peserta didik mampu menganalisis sumber hukum Islam yang disepakati dan diperselisihkan (Ijma, Qiyas), hikmah pensyariatan pernikahan dan pembagian warisan sesuai syariat.',
                    'tps' => [
                        ['kode' => 'TP-SMA-PAI-01', 'nama' => 'Kajian Ushul Fiqih: Dalil Al-Qur\'an dan Sunnah', 'deskripsi' => 'Menganalisis metode istinbath hukum ulama mazhab empat terhadap problematika kekinian.', 'jp' => 3],
                        ['kode' => 'TP-SMA-PAI-02', 'nama' => 'Simulasi Perhitungan Waris Faraidh', 'deskripsi' => 'Menghitung pembagian harta waris bagi ashabul furudh dan ashabah secara proporsional.', 'jp' => 4],
                    ],
                ],
                [
                    'sub_keywords' => ['MATEMATIKA', 'MTK', 'KALKULUS'],
                    'kode_prefix' => 'CP-SMA-MTK-FF',
                    'nama_cp' => 'Kalkulus Diferensial Integral dan Vektor Spasial',
                    'fase' => 'Fase F',
                    'kelas' => 'Kelas 11',
                    'deskripsi' => 'Peserta didik mampu memahami limit fungsi trigonometri, turunan fungsi aljabar/trigonometri, integral tentu/tak tentu serta aplikasinya dalam menghitung luas daerah dan volume benda putar.',
                    'tps' => [
                        ['kode' => 'TP-SMA-MTK-01', 'nama' => 'Menghitung Luas Bidang Menggunakan Integral Tentu', 'deskripsi' => 'Menerapkan integral Riemann dalam menghitung luasan kurva pada koordinat kartesius.', 'jp' => 4],
                        ['kode' => 'TP-SMA-MTK-02', 'nama' => 'Analisis Vektor Dimensi Tiga (R3)', 'deskripsi' => 'Menentukan hasil kali titik (dot product) dan hasil kali silang (cross product) dua vektor spasial.', 'jp' => 4],
                    ],
                ],
                [
                    'sub_keywords' => ['FISIKA', 'BIOLOGI', 'KIMIA', 'IPA'],
                    'kode_prefix' => 'CP-SMA-SAI-FE',
                    'nama_cp' => 'Hukum Kekekalan Energi dan Dinamika Termodinamika',
                    'fase' => 'Fase E',
                    'kelas' => 'Kelas 10',
                    'deskripsi' => 'Peserta didik mampu menganalisis konsep usaha energi, momentum impuls, fluida dinamis, serta siklus termodinamika Carnot dan efisiensi mesin pemanas modern.',
                    'tps' => [
                        ['kode' => 'TP-SMA-SAI-01', 'nama' => 'Penerapan Hukum Kekekalan Energi Mekanik', 'deskripsi' => 'Menghitung kecepatan benda jatuh bebas dan gerak parabola tanpa gesekan udara.', 'jp' => 4],
                        ['kode' => 'TP-SMA-SAI-02', 'nama' => 'Analisis Siklus Termodinamika Mesin Carnot', 'deskripsi' => 'Menghitung usaha dan efisiensi termal pada grafik P-V gas ideal.', 'jp' => 3],
                    ],
                ],
                [
                    'sub_keywords' => ['TAHFIZH', 'QURAN'],
                    'kode_prefix' => 'CP-SMA-TFZ-FF',
                    'nama_cp' => 'Hafalan Al-Qur\'an Al-Baqarah - Ali Imran Mutqin Bersanad',
                    'fase' => 'Fase F',
                    'kelas' => 'Kelas 12',
                    'deskripsi' => 'Peserta didik mampu menuntaskan hafalan Juz 1 sampai Juz 5, memahami gharib Al-Qur\'an, wakaf ibtida, serta mempersiapkan ujian kelulusan tasmi 30 juz Al-Qur\'an.',
                    'tps' => [
                        ['kode' => 'TP-SMA-TFZ-01', 'nama' => 'Tasmi\' Bil Ghaib Juz 1 - 3 Sekali Duduk', 'deskripsi' => 'Menyetorkan hafalan Surah Al-Baqarah dan Ali Imran secara lancar di hadapan dewan penguji.', 'jp' => 6],
                        ['kode' => 'TP-SMA-TFZ-02', 'nama' => 'Penerapan Kaidah Waqaf Ibtida & Gharibul Qur\'an', 'deskripsi' => 'Menerapkan bacaan imalah, isymam, saktah, dan tashil sesuai riwayat Imam Ashim.', 'jp' => 4],
                    ],
                ],
            ],
        ];

        $totalCpCreated = 0;
        $totalTpCreated = 0;

        foreach ($units as $unit) {
            $level = strtoupper($unit->level ?? '');
            $code = strtoupper($unit->code ?? '');
            $name = strtoupper($unit->name ?? '');
            $combined = "{$level} {$code} {$name}";

            $jenjangKey = 'SD';
            if (str_contains($combined, 'TK') || str_contains($combined, 'PAUD') || str_contains($combined, 'TAUD')) {
                $jenjangKey = 'TK';
            } elseif (str_contains($combined, 'SMP') || str_contains($combined, 'PONPES') || str_contains($combined, 'PESANTREN') || str_contains($combined, 'MTS')) {
                $jenjangKey = 'SMP';
            } elseif (str_contains($combined, 'SMA') || str_contains($combined, 'MAHAD') || str_contains($combined, 'ALIYAH')) {
                $jenjangKey = 'SMA';
            }

            // 1. Pastikan Kurikulum aktif tersedia untuk unit ini
            $kurikulum = MasterKurikulum::where('unit_pendidikan_id', $unit->id)->first();
            if (! $kurikulum) {
                $kurikulumName = match ($jenjangKey) {
                    'TK' => "Kurikulum Merdeka PAUD/TK Islam Terpadu - {$unit->code}",
                    'SD' => "Kurikulum Merdeka SD Islam Terpadu - {$unit->code}",
                    'SMP' => str_contains($combined, 'PONPES')
                        ? "Kurikulum Pesantren Tahfizh & Diniyah - {$unit->code}"
                        : "Kurikulum Merdeka SMP Islam Terpadu - {$unit->code}",
                    'SMA' => "Kurikulum Merdeka SMA Islam Terpadu - {$unit->code}",
                    default => "Kurikulum Merdeka Terpadu - {$unit->code}",
                };

                $kurikulum = MasterKurikulum::create([
                    'kode_kurikulum' => "KUR-{$unit->code}-" . strtoupper(Str::random(4)),
                    'nama_kurikulum' => $kurikulumName,
                    'jenis_kurikulum' => str_contains($combined, 'PONPES') ? 'Pesantren' : 'SIT',
                    'jenjang' => $jenjangKey,
                    'unit_pendidikan_id' => $unit->id,
                    'tahun_ajaran_id' => $tahunAktif->id,
                    'tanggal_mulai' => '2026-07-01',
                    'tanggal_selesai' => '2027-06-30',
                    'status' => true,
                    'deskripsi' => "Kurikulum resmi operasional untuk unit {$unit->name} tahun ajaran 2026/2027.",
                    'created_by' => $adminId,
                ]);
            }

            // Update subjects of this unit so their kurikulum_id matches if empty
            Subject::where('unit_pendidikan_id', $unit->id)
                ->whereNull('kurikulum_id')
                ->update(['kurikulum_id' => $kurikulum->id]);

            $subjects = Subject::where('unit_pendidikan_id', $unit->id)->get();
            if ($subjects->isEmpty()) {
                continue;
            }

            // 2. Buat Capaian Pembelajaran & Tujuan Pembelajaran dari template
            $templates = $cpTemplates[$jenjangKey] ?? $cpTemplates['SD'];
            $urutan = 1;

            foreach ($templates as $tIndex => $tpl) {
                // Cari mapel yang sesuai keyword
                $matchedSubject = $subjects->first(function ($s) use ($tpl) {
                    $sText = strtoupper("{$s->nama_mapel} {$s->kode_mapel} {$s->name} {$s->code}");
                    foreach ($tpl['sub_keywords'] as $kw) {
                        if (str_contains($sText, $kw)) {
                            return true;
                        }
                    }
                    return false;
                }) ?? $subjects->get($tIndex % $subjects->count());

                if (! $matchedSubject) {
                    continue;
                }

                $kodeCp = "{$tpl['kode_prefix']}-{$unit->code}-" . str_pad((string)$urutan, 2, '0', STR_PAD_LEFT);
                
                // Berikan status aktif mayoritas, dengan 1 CP nonaktif sebagai sampel arsip
                $isAktif = ($urutan % 6 !== 0);

                $cp = CapaianPembelajaran::updateOrCreate(
                    [
                        'unit_pendidikan_id' => $unit->id,
                        'kode_cp' => $kodeCp,
                    ],
                    [
                        'tahun_ajaran_id' => $tahunAktif->id,
                        'kurikulum_id' => $kurikulum->id,
                        'mata_pelajaran_id' => $matchedSubject->id,
                        'nama_cp' => $tpl['nama_cp'],
                        'deskripsi' => $tpl['deskripsi'],
                        'fase' => $tpl['fase'],
                        'kelas_target' => $tpl['kelas'],
                        'urutan' => $urutan,
                        'status' => $isAktif,
                        'created_by' => $adminId,
                        'updated_by' => $adminId,
                    ]
                );

                $totalCpCreated++;

                // 3. Buat Tujuan Pembelajaran (TP) turunan untuk setiap CP
                $tpUrutan = 1;
                foreach ($tpl['tps'] as $tpData) {
                    $kodeTp = "{$tpData['kode']}-{$unit->code}-" . str_pad((string)$tpUrutan, 2, '0', STR_PAD_LEFT);

                    TujuanPembelajaran::updateOrCreate(
                        [
                            'cp_id' => $cp->id,
                            'kode_tp' => $kodeTp,
                        ],
                        [
                            'nama_tp' => $tpData['nama'],
                            'deskripsi' => $tpData['deskripsi'],
                            'alokasi_waktu_jp' => $tpData['jp'],
                            'urutan' => $tpUrutan,
                            'status' => $isAktif,
                            'created_by' => $adminId,
                            'updated_by' => $adminId,
                        ]
                    );

                    $tpUrutan++;
                    $totalTpCreated++;
                }

                $urutan++;
            }
        }

        $this->command->info("Simulasi berhasil dibuat: {$totalCpCreated} Capaian Pembelajaran dan {$totalTpCreated} Tujuan Pembelajaran terpasang rapi.");
    }
}
