<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassSchedule;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\Kelas;
use App\Models\LmsMateri;
use App\Models\LmsModulAjar;
use App\Models\MasterKurikulum;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\Teacher;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MateriBelajarTahunanSeeder extends Seeder
{
    /**
     * Taksonomi Domain Kurikulum per Kategori Mapel.
     * Masing-masing memuat 16 topik Semester Ganjil dan 16 topik Semester Genap (Total 32 Pekan KBM).
     */
    private array $curriculumDomains = [
        'Al-Quran' => [
            'fase_default' => 'Fase Fondasi - Menengah',
            'ganjil' => [
                ['pekan' => 1,  'topik' => 'Adab & Keutamaan Membaca Al-Qur\'an', 'sub' => 'Niat ikhlas, bersuci, menghadap kiblat, dan thaharah lahir batin.'],
                ['pekan' => 2,  'topik' => 'Makharijul Huruf Bagian Al-Halaq', 'sub' => 'Pengucapan huruf tenggorokan: Hamzah, Ha, Ain, Ha, Ghain, Kha.'],
                ['pekan' => 3,  'topik' => 'Makharijul Huruf Bagian Al-Lisan Bagian Pangkal', 'sub' => 'Huruf Qaf dan Kaf serta perbedaannya.'],
                ['pekan' => 4,  'topik' => 'Makharijul Huruf Bagian Tengah & Tepi Lidah', 'sub' => 'Huruf Jim, Syin, Ya, dan Dhad.'],
                ['pekan' => 5,  'topik' => 'Hukum Nun Sukun & Tanwin: Idzhar Halqi', 'sub' => 'Pengertian, cara membaca jelas tanpa dengung, dan contoh ayat.'],
                ['pekan' => 6,  'topik' => 'Hukum Nun Sukun & Tanwin: Idgham Bighunnah', 'sub' => 'Memasukkan bunyi ke huruf Ya, Nun, Mim, Wawu dengan dengung 2 harakat.'],
                ['pekan' => 7,  'topik' => 'Hukum Nun Sukun & Tanwin: Idgham Bilaghunnah', 'sub' => 'Memasukkan tanpa dengung ke huruf Lam dan Ra.'],
                ['pekan' => 8,  'topik' => 'Hukum Nun Sukun & Tanwin: Iqlab & Ikhfa Haqiqi', 'sub' => 'Mengubah ke mim samar dan menyamarkan bacaan pada 15 huruf.'],
                ['pekan' => 9,  'topik' => 'Hukum Mim Sukun: Ikhfa Syafawi & Idgham Mimi', 'sub' => 'Penerapan pada bacaan Juz 30.'],
                ['pekan' => 10, 'topik' => 'Hukum Mim Sukun: Idzhar Syafawi', 'sub' => 'Kehati-hatian membaca mim sukun sebelum huruf Wawu dan Fa.'],
                ['pekan' => 11, 'topik' => 'Hukum Mad Asli (Thabi\'i)', 'sub' => 'Panjang 2 harakat pada alif, wawu, dan ya sukun.'],
                ['pekan' => 12, 'topik' => 'Hukum Mad Wajib Muttashil & Jaiz Munfashil', 'sub' => 'Panjang 4-5 harakat dalam satu kata vs dua kata.'],
                ['pekan' => 13, 'topik' => 'Hukum Mad Lazim Kilmi & Harfi', 'sub' => 'Panjang 6 harakat pada fawatihussuwar dan ayat-ayat bertasydid.'],
                ['pekan' => 14, 'topik' => 'Sifatul Huruf: Hams vs Jahr, Syiddah vs Rakhawah', 'sub' => 'Aliran nafas dan suara saat mengucapkan huruf hijaiyah.'],
                ['pekan' => 15, 'topik' => 'Tadabbur & Talaqqi Surat An-Naba Ayat 1-20', 'sub' => 'Berita hari kiamat dan kekuasaan Allah menciptakan alam semesta.'],
                ['pekan' => 16, 'topik' => 'Muroja\'ah Akbar & Simulasi Ujian Tahsin Semester 1', 'sub' => 'Pengujian kelancaran tajwid dan tartil berstandar SaQu.'],
            ],
            'genap' => [
                ['pekan' => 17, 'topik' => 'Hukum Qalqalah Sughra & Kubra', 'sub' => 'Pantulan suara pada huruf Qaf, Tha, Ba, Jim, Dal saat sukun dan wakaf.'],
                ['pekan' => 18, 'topik' => 'Tafkhim & Tarqiq pada Huruf Ra', 'sub' => 'Kondisi ra dibaca tebal dan tipis beserta pengecualiannya.'],
                ['pekan' => 19, 'topik' => 'Hukum Lam Jalalah (Lafazh Allah)', 'sub' => 'Membaca tebal setelah fathah/dhammah dan tipis setelah kasrah.'],
                ['pekan' => 20, 'topik' => 'Tanda-tanda Wakaf & Washal dalam Mushaf Utsmani', 'sub' => 'Tanda Mim lazim, La mustahab, Jim jaiz, dan titik tiga mu\'anaqah.'],
                ['pekan' => 21, 'topik' => 'Gharibul Qur\'an: Saktah, Imalah, Isymam', 'sub' => 'Bentuk bacaan khusus pada riwayat Imam Hafsh an Asim.'],
                ['pekan' => 22, 'topik' => 'Tadabbur Surat An-Nazi\'at: Malaikat Pencabut Nyawa', 'sub' => 'Kisah Nabi Musa dan Fir\'aun serta kepastian hari pembalasan.'],
                ['pekan' => 23, 'topik' => 'Tadabbur Surat \'Abasa: Memuliakan Penuntut Ilmu', 'sub' => 'Teguran Allah dan hikmah dakwah kepada kaum lemah/tunanetra.'],
                ['pekan' => 24, 'topik' => 'Tadabbur Surat At-Takwir & Al-Infithar: Kedahsyatan Kiamat', 'sub' => 'Peristiwa kosmik dan catatan amal manusia di yaumul hisab.'],
                ['pekan' => 25, 'topik' => 'Hukum Mad Iwadh, Mad Badal, & Mad Shilah', 'sub' => 'Mad pengganti tanwin fathah dan mad penghubung ha dhamir.'],
                ['pekan' => 26, 'topik' => 'Hukum Mad Farq & Mad Tamkin', 'sub' => 'Pembeda kalimat tanya dan pengukuhan dua huruf ya bertemu.'],
                ['pekan' => 27, 'topik' => 'Tadabbur Surat Al-Muthaffifin: Kejujuran Berdagang', 'sub' => 'Ancaman bagi pencurang takaran dan kenikmatan surga Illiyyin.'],
                ['pekan' => 28, 'topik' => 'Tadabbur Surat Al-Insyiqaq s/d Al-Buruj', 'sub' => 'Penerimaan kitab amal dan keteguhan kaum Ashabul Ukhdud.'],
                ['pekan' => 29, 'topik' => 'Teknik Menghafal Cepat (Metode Ziyadah Efektif)', 'sub' => 'Kombinasi tikrar 20 kali dan peta memori visual ayat.'],
                ['pekan' => 30, 'topik' => 'Manajemen Muroja\'ah Harian Santri & Pelajar', 'sub' => 'Membagi porsi murajaah qorib (hafalan baru) dan ba\'id (hafalan lama).'],
                ['pekan' => 31, 'topik' => 'Adab Penghafal Qur\'an di Tengah Kehidupan Sosial', 'sub' => 'Mencerminkan akhlak Al-Qur\'an dalam tutur kata dan tindakan harian.'],
                ['pekan' => 32, 'topik' => 'Ujian Komprehensif Tahfizh & Tasmi\' 1 Juz Sekali Duduk', 'sub' => 'Ujian akhir kenaikan tingkat dan sertifikasi hafalan santri.'],
            ],
        ],

        'Diniyyah' => [
            'fase_default' => 'Fase A - Fase E',
            'ganjil' => [
                ['pekan' => 1,  'topik' => 'Konsep Tauhid & Rukun Iman', 'sub' => 'Mengenal Allah melalui Asmaul Husna dan ayat-ayat kauniyah.'],
                ['pekan' => 2,  'topik' => 'Keimanan kepada Malaikat Allah', 'sub' => 'Tugas 10 malaikat dan pengaruhnya pada kejujuran perilaku.'],
                ['pekan' => 3,  'topik' => 'Fiqih Thaharah: Wudhu yang Benar Sesuai Sunnah', 'sub' => 'Rukun, sunnah, hal yang membatalkan, dan doa setelah wudhu.'],
                ['pekan' => 4,  'topik' => 'Fiqih Thaharah: Tayammum & Mandi Wajib', 'sub' => 'Kondisi darurat air dan tata cara bersuci besar.'],
                ['pekan' => 5,  'topik' => 'Tata Cara Sholat Fardhu: Gerakan & Bacaan Tartil', 'sub' => 'Rukun sholat dari takbiratul ihram hingga salam.'],
                ['pekan' => 6,  'topik' => 'Khusyuk dalam Sholat: Menghadirkan Makna Bacaan', 'sub' => 'Memahami arti Al-Fatihah dan doa rukuk/sujud.'],
                ['pekan' => 7,  'topik' => 'Sholat Berjamaah & Keutamaan Shaf Depan', 'sub' => 'Adab makmum, masbuq, dan aturan meluruskan shaf.'],
                ['pekan' => 8,  'topik' => 'Sholat Sunnah Rawatib & Dhuha', 'sub' => 'Menjaga 12 rakaat istana surga dan pembuka rezeki.'],
                ['pekan' => 9,  'topik' => 'Akhlak kepada Kedua Orang Tua (Birrul Walidain)', 'sub' => 'Bakti anak salih semasa hidup dan setelah wafat orang tua.'],
                ['pekan' => 10, 'topik' => 'Akhlak Menghormati Guru & Ulama', 'sub' => 'Adab mendengarkan pelajaran dan meminta izin dalam majelis ilmu.'],
                ['pekan' => 11, 'topik' => 'Sifat Shiddiq & Amanah dalam Muamalah Sekolah', 'sub' => 'Kejujuran dalam ujian dan menjaga titipan barang teman.'],
                ['pekan' => 12, 'topik' => 'Menjauhi Sifat Buruk: Hasad, Riya, dan Ujub', 'sub' => 'Bahaya penyakit hati yang menghanguskan amal kebaikan.'],
                ['pekan' => 13, 'topik' => 'Sirah Nabawiyah: Kelahiran & Masa Kecil Nabi SAW', 'sub' => 'Tahun Gajah, penyusuan di Bani Sa\'ad, dan tanda kenabian.'],
                ['pekan' => 14, 'topik' => 'Sirah Nabawiyah: Dakwah Makkah & Boikot Quraisy', 'sub' => 'Ketegaran Rasulullah dan para sahabat di Syi\'ib Abi Thalib.'],
                ['pekan' => 15, 'topik' => 'Sirah Nabawiyah: Peristiwa Isra\' Mi\'raj', 'sub' => 'Perjalanan agung dan perintah sholat 5 waktu.'],
                ['pekan' => 16, 'topik' => 'Evaluasi Pembelajaran PAI & Refleksi Adab Semester 1', 'sub' => 'Rekapitulasi capaian ibadah yaumiyyah dan evaluasi pemahaman.'],
            ],
            'genap' => [
                ['pekan' => 17, 'topik' => 'Sirah Nabawiyah: Hijrah ke Yatsrib (Madinah)', 'sub' => 'Pembangunan Masjid Nabawi dan persaudaraan Muhajirin-Anshar.'],
                ['pekan' => 18, 'topik' => 'Perang Badar Al-Kubra: Kemenangan Hak atas Batil', 'sub' => 'Pelajaran pertolongan Allah bagi pasukan mukmin yang bersabar.'],
                ['pekan' => 19, 'topik' => 'Perang Uhud: Pentingnya Kepatuhan pada Pemimpin', 'sub' => 'Hikmah di balik ujian kekalahan pasukan pemanah.'],
                ['pekan' => 20, 'topik' => 'Perjanjian Hudaibiyah & Fathu Makkah', 'sub' => 'Kemenangan diplomasi damai dan pemaafan agung Rasulullah.'],
                ['pekan' => 21, 'topik' => 'Haji Wada\' & Pesan-Pesan Terakhir Rasulullah', 'sub' => 'Kesetaraan manusia di hadapan Allah kecuali karena ketakwaannya.'],
                ['pekan' => 22, 'topik' => 'Fiqih Puasa Ramadhan: Syarat, Rukun, & Pembatal', 'sub' => 'Persiapan menyambut bulan suci dan hikmah menahan hawa nafsu.'],
                ['pekan' => 23, 'topik' => 'Amalan Utama Bulan Ramadhan & Malam Lailatul Qadar', 'sub' => 'Qiyamul lail, tadarus Al-Qur\'an, sedekah, dan i\'tikaf.'],
                ['pekan' => 24, 'topik' => 'Fiqih Zakat Fitrah & Zakat Maal', 'sub' => 'Nisab, haul, mustahiq zakat, dan pembersihan harta.'],
                ['pekan' => 25, 'topik' => 'Fiqih Sholat Hari Raya (Idul Fitri & Idul Adha)', 'sub' => 'Sunnah mandi, takbiran, khutbah, dan silaturahim.'],
                ['pekan' => 26, 'topik' => 'Ibadah Kurban & Adab Menyembelih Hewan', 'sub' => 'Meneladani pengorbanan Nabi Ibrahim dan Ismail AS.'],
                ['pekan' => 27, 'topik' => 'Adab Penggunaan Gadget & Media Sosial Islami', 'sub' => 'Menjaga pandangan, tabayyun informasi, dan menjauhi ghibah online.'],
                ['pekan' => 28, 'topik' => 'Ukhuwah Islamiyah & Adab Bertetangga', 'sub' => 'Hak tetangga muslim dan non-muslim dalam pandangan syariat.'],
                ['pekan' => 29, 'topik' => 'Hadits Arba\'in: Amalan Tergantung Niat', 'sub' => 'Kajian hadits nomor 1 karya Imam An-Nawawi.'],
                ['pekan' => 30, 'topik' => 'Hadits Arba\'in: Tingkatan Islam, Iman, & Ihsan', 'sub' => 'Kajian hadits Jibril tentang pilar agama Islam.'],
                ['pekan' => 31, 'topik' => 'Mengenal Khulafaur Rasyidin: Abu Bakar & Umar bin Khattab', 'sub' => 'Keteguhan iman Ash-Shiddiq dan keadilan Al-Faruq.'],
                ['pekan' => 32, 'topik' => 'Mengenal Khulafaur Rasyidin: Utsman & Ali bin Abi Thalib', 'sub' => 'Kedermawanan Dzun Nurain dan kecerdasan pintu gerbang ilmu.'],
            ],
        ],

        'Bahasa Arab' => [
            'fase_default' => 'Fase A - Fase D',
            'ganjil' => [
                ['pekan' => 1,  'topik' => 'At-Ta\'aruf: Perkenalan Diri & Menanyakan Kabar', 'sub' => 'Masmuka? Kaifa haluk? Ana thalibun jadid.'],
                ['pekan' => 2,  'topik' => 'Dhamir Munfashil (Kata Ganti Orang)', 'sub' => 'Penggunaan Ana, Anta, Anti, Huwa, Hiya, Nahnu.'],
                ['pekan' => 3,  'topik' => 'Isim Isyarah: Haadzaa & Haadzihi', 'sub' => 'Menunjuk benda dekat maskulin (mudzakkar) dan feminin (muannats).'],
                ['pekan' => 4,  'topik' => 'Isim Isyarah: Dzaalika & Tilka', 'sub' => 'Menunjuk benda jauh dan perbedaan tandanya dalam kalimat.'],
                ['pekan' => 5,  'topik' => 'Al-Adawatul Madrasiyyah (Alat Tulis & Buku)', 'sub' => 'Kitabun, qalamun, daftarun, mimhatun, mistaratun.'],
                ['pekan' => 6,  'topik' => 'Huruf Jar Dasar (Fi, \'Ala, Ila, Min)', 'sub' => 'Makna di dalam, di atas, ke, dari dan harakat kasrah isim sesudahnya.'],
                ['pekan' => 7,  'topik' => 'Fil Fashli (Benda-benda di Dalam Ruang Kelas)', 'sub' => 'Maktabun, kursiyyun, sabbuuratun, faslun, naafidzatun.'],
                ['pekan' => 8,  'topik' => 'Hiwar Singkat: Percakapan di Depan Kelas', 'sub' => 'Latihan percakapan berpasangan dengan intonasi fasih.'],
                ['pekan' => 9,  'topik' => 'Al-Usrah (Anggota Keluarga Tercinta)', 'sub' => 'Abun, ummun, akhun, ukhtun, jaddun, jaddatun.'],
                ['pekan' => 10, 'topik' => 'Dhamir Muttashil Lil Milkiyah (Kepemilikan)', 'sub' => 'Kitabi (bukuku), kitabuka (bukumu), kitabuha (bukunya).'],
                ['pekan' => 11, 'topik' => 'Al-Alwan (Mengenal Warna-Warni)', 'sub' => 'Ahmar, abyadh, aswad, azraq, akhdhar, ashfar.'],
                ['pekan' => 12, 'topik' => 'Al-A\'dad 1 - 10 (Bilangan Angka Arab)', 'sub' => 'Wahidun s/d \'Asyaratun serta penggunaannya dengan ma\'dud.'],
                ['pekan' => 13, 'topik' => 'A\'dhaul Jismi (Bagian Tubuh Manusia)', 'sub' => 'Ra\'sun, \'ainun, anfun, famun, yadun, rijlun.'],
                ['pekan' => 14, 'topik' => 'Kaidah Na\'at & Man\'ut (Kata Sifat)', 'sub' => 'Kesesuaian gender dan i\'rab antara sifat dan yang disifati.'],
                ['pekan' => 15, 'topik' => 'Qira\'ah: Membaca Cerita Pendek Kehidupan Santri', 'sub' => 'Menerjemahkan teks bertema keseharian di pondok dan madrasah.'],
                ['pekan' => 16, 'topik' => 'Ujian Tengah Semester Bahasa Arab (Lisan & Tulis)', 'sub' => 'Evaluasi kosakata, penyusunan kalimat sederhana, dan imla\'.'],
            ],
            'genap' => [
                ['pekan' => 17, 'topik' => 'Ayyamul Usbu\' (Nama-Nama Hari)', 'sub' => 'Al-Ahad, Al-Itsnain, Ats-Tsulatsa, Al-Arbi\'a, Al-Khamis, Al-Jumu\'ah, As-Sabt.'],
                ['pekan' => 18, 'topik' => 'As-Sa\'ah wal Awqat (Mengenal Waktu Jam)', 'sub' => 'As-Sa\'atul wahidah, an-nisfu (setengah), ar-rub\'u (seperempat).'],
                ['pekan' => 19, 'topik' => 'Fi\'il Madhi (Kata Kerja Masa Lampau) Bentuk Dasar', 'sub' => 'Dzahaba, qara\'a, kataba, jalasa beserta dhamir failnya.'],
                ['pekan' => 20, 'topik' => 'Fi\'il Mudhari\' (Kata Kerja Sedang/Akan Datang)', 'sub' => 'Yadzhabu, yaqra\'u, yaktubu beserta huruf mudhara\'ah.'],
                ['pekan' => 21, 'topik' => 'Fil Bait (Kegiatan dan Ruangan di Rumah)', 'sub' => 'Ghurfatun naum, al-mathbakh, ghurfatul julus, al-hammam.'],
                ['pekan' => 22, 'topik' => 'Fi\'il Amr (Kata Kerja Perintah)', 'sub' => 'Iqra\', uktub, idzhab, ijlis dan adab menyampaikan perintah.'],
                ['pekan' => 23, 'topik' => 'Fil Maktabah (Di Perpustakaan Sekolah)', 'sub' => 'Kutubun mutanawwi\'ah, isti\'aratul kutub, al-hudu\'.'],
                ['pekan' => 24, 'topik' => 'Al-Mihnah wal Mihanu (Profesi & Pekerjaan)', 'sub' => 'Mudarris, thabib, muhandis, falah, syurthiy.'],
                ['pekan' => 25, 'topik' => 'Al-Jumlatul Ismiyyah (Mubtada\' & Khabar)', 'sub' => 'Struktur kalimat berawalan isim dan harakat raf\' dhammah.'],
                ['pekan' => 26, 'topik' => 'Al-Jumlatul Fi\'liyyah (Fi\'il, Fa\'il, Maf\'ul Bih)', 'sub' => 'Struktur kalimat kerja dan objek harakat nashab fathah.'],
                ['pekan' => 27, 'topik' => 'Fil Math\'am wal Ma\'kulat (Makanan & Minuman)', 'sub' => 'Ruzzun, khubzun, labanun, syayun, ma\'un ma\'diniy.'],
                ['pekan' => 28, 'topik' => 'Al-Hiwar fil Mustasyfa (Dialog Menjenguk Orang Sakit)', 'sub' => 'Syafakallah, thahurun insya Allah, dan doa kesembuhan.'],
                ['pekan' => 29, 'topik' => 'Al-Washailun Naqli (Alat Transportasi)', 'sub' => 'Sayyarah, darrajah, hafilah, qithar, tha\'irah.'],
                ['pekan' => 30, 'topik' => 'Praktek Insya\' (Mengarang Bebas 5 Baris)', 'sub' => 'Menulis paragraf tentang cita-cita dan kecintaan pada bahasa Al-Qur\'an.'],
                ['pekan' => 31, 'topik' => 'Istima\' (Menyimak Audio Percakapan Penutur Asli)', 'sub' => 'Melatih pendengaran menangkap makna kalimat cepat.'],
                ['pekan' => 32, 'topik' => 'Evaluasi Akhir Tahun: Muhadatsah & Imla\' Komprehensif', 'sub' => 'Ujian lisan pidato bahasa Arab singkat dan tes tata bahasa.'],
            ],
        ],

        'Umum' => [
            'fase_default' => 'Fase A - Fase E',
            'ganjil' => [
                ['pekan' => 1,  'topik' => 'Membaca Intensif & Menemukan Ide Pokok Paragraf', 'sub' => 'Teknik skimming, scanning, dan membedakan kalimat utama vs penjelas.'],
                ['pekan' => 2,  'topik' => 'Menyusun Teks Deskripsi Lingkungan Sekolah & Alam', 'sub' => 'Pemanfaatan pancaindra dalam menggambarkan objek secara terperinci.'],
                ['pekan' => 3,  'topik' => 'Kaidah Ejaan Bahasa Indonesia (PUEBI): Huruf Kapital & Tanda Baca', 'sub' => 'Penggunaan titik, koma, tanda petik, dan penulisan gelar resmi.'],
                ['pekan' => 4,  'topik' => 'Teks Prosedur: Menyusun Petunjuk Kerja Bertahap', 'sub' => 'Struktur tujuan, bahan/alat, langkah-langkah, dan penutup.'],
                ['pekan' => 5,  'topik' => 'Mengidentifikasi Unsur Intrinsik Cerita Pendek', 'sub' => 'Tema, tokoh/penokohan, alur, latar, sudut pandang, dan amanat.'],
                ['pekan' => 6,  'topik' => 'Apresiasi Puisi & Pantun Nasihat Islami', 'sub' => 'Mengenal rima, bait, sampiran, isi, dan pesan moral sastra Melayu.'],
                ['pekan' => 7,  'topik' => 'Teks Laporan Hasil Observasi (LHO) Lingkungan Hidup', 'sub' => 'Pengamatan ilmiah objektif tentang flora dan fauna di sekitar kita.'],
                ['pekan' => 8,  'topik' => 'Teknik Menyimpulkan Informasi dari Teks Berita & Informasi', 'sub' => 'Penerapan rumus 5W + 1H (Adiksimba) dalam menganalisis peristiwa.'],
                ['pekan' => 9,  'topik' => 'Kebugaran Jasmani: Latihan Kelenturan & Kekuatan Otot', 'sub' => 'Push-up, sit-up, plank, dan peregangan statis/dinamis.'],
                ['pekan' => 10, 'topik' => 'Permainan Bola Besar: Teknik Dasar Sepakbola & Futsal', 'sub' => 'Passing, dribbling, shooting, dan sportivitas fair play.'],
                ['pekan' => 11, 'topik' => 'Pola Hidup Sehat: Gizi Seimbang & Istirahat Teratur', 'sub' => 'Komposisi makanan 4 sehat 5 sempurna dan bahaya makanan cepat saji.'],
                ['pekan' => 12, 'topik' => 'Pencegahan Penyakit Menular & Kebersihan Diri', 'sub' => 'Cuci tangan 6 langkah, menjaga kebersihan pakaian, dan lingkungan.'],
                ['pekan' => 13, 'topik' => 'Keterampilan Berbicara: Pidato & Khutbah Singkat', 'sub' => 'Menyusun teks pidato bertema persaudaraan dan latihan vokal.'],
                ['pekan' => 14, 'topik' => 'Menulis Surat Resmi & Undangan Kegiatan Sekolah', 'sub' => 'Kop surat, nomor surat, lampiran, perihal, dan salam pembuka/penutup.'],
                ['pekan' => 15, 'topik' => 'Literasi Digital & Etika Komunikasi Maya', 'sub' => 'Memilah informasi fakta vs hoaks dan etika berbahasa di media sosial.'],
                ['pekan' => 16, 'topik' => 'Evaluasi Formatif Tengah Semester & Ujian Praktik Bahasa', 'sub' => 'Penilaian portofolio tulisan deskripsi dan ketangkasan fisik.'],
            ],
            'genap' => [
                ['pekan' => 17, 'topik' => 'Teks Eksplanasi: Memahami Proses Terjadinya Gejala Alam', 'sub' => 'Sebab-akibat fenomena gempa bumi, banjir, dan siklus hujan.'],
                ['pekan' => 18, 'topik' => 'Analisis Kaidah Kebahasaan Teks Eksplanasi (Konjungsi Kausalitas)', 'sub' => 'Penggunaan kata karena, sebab, akibatnya, sehingga, jika.'],
                ['pekan' => 19, 'topik' => 'Teks Eksposisi: Menyampaikan Pendapat Disertai Argumen Fakta', 'sub' => 'Tesis, argumentasi ilmiah, dan penegasan ulang pendapat.'],
                ['pekan' => 20, 'topik' => 'Debat Santun: Mengemukakan Gagasan dengan Data Valid', 'sub' => 'Tata cara sanggahan sopan dan menghargai perbedaan pandangan.'],
                ['pekan' => 21, 'topik' => 'Permainan Bola Kecil: Teknik Dasar Bulutangkis & Tenis Meja', 'sub' => 'Pukulan forehand, backhand, servis, dan footwork.'],
                ['pekan' => 22, 'topik' => 'Senam Irama & Aktivitas Ritmik Koordinasi Gerak', 'sub' => 'Menyelaraskan langkah kaki dan ayunan lengan dengan irama.'],
                ['pekan' => 23, 'topik' => 'Menulis Esai Inspiratif Berbasis Nilai Islam', 'sub' => 'Menceritakan teladan tokoh muslim Indonesia yang berkontribusi nyata.'],
                ['pekan' => 24, 'topik' => 'Kritik Sastra Sederhana & Resensi Buku Bacaan', 'sub' => 'Menilai kelebihan dan kekurangan novel serta buku biografi.'],
                ['pekan' => 25, 'topik' => 'Pertolongan Pertama pada Kecelakaan (P3K) di Sekolah', 'sub' => 'Penanganan luka lecet, mimisan, kram otot, dan pingsan.'],
                ['pekan' => 26, 'topik' => 'Bahaya Rokok, Narkoba, & Minuman Keras bagi Tubuh', 'sub' => 'Dampak kerusakan organ tubuh dan hukum syariat yang melarangnya.'],
                ['pekan' => 27, 'topik' => 'Menulis Karya Ilmiah Remaja Sederhana: Merumuskan Masalah', 'sub' => 'Latar belakang, rumusan masalah, dan metodologi observasi mini.'],
                ['pekan' => 28, 'topik' => 'Penyusunan Daftar Pustaka Standar APA', 'sub' => 'Teknik mencantumkan sumber buku, jurnal, dan situs web resmi.'],
                ['pekan' => 29, 'topik' => 'Renang Gaya Dada & Keselamatan di Air', 'sub' => 'Posisi badan, gerakan kaki, pernapasan, dan etika kolam renang.'],
                ['pekan' => 30, 'topik' => 'Aktivitas Luar Kelas (Outbound): Kerjasama Tim & Kepemimpinan', 'sub' => 'Membangun empati, solidaritas, dan problem solving beregu.'],
                ['pekan' => 31, 'topik' => 'Pentas Seni Budaya & Gelar Wicara Bahasa Indonesia', 'sub' => 'Membaca puisi karya sendiri dan apresiasi seni teater islami.'],
                ['pekan' => 32, 'topik' => 'Ujian Akhir Tahun Praktik Kebugaran & Literasi Tulis', 'sub' => 'Evaluasi menyeluruh keterampilan berbahasa dan ketahanan fisik.'],
            ],
        ],

        'Eksak' => [
            'fase_default' => 'Fase A - Fase E',
            'ganjil' => [
                ['pekan' => 1,  'topik' => 'Operasi Hitung Bilangan Bulat Positif & Negatif', 'sub' => 'Garis bilangan, penjumlahan, pengurangan, perkalian, dan pembagian.'],
                ['pekan' => 2,  'topik' => 'Sifat-sifat Operasi Hitung: Komutatif, Asosiatif, Distributif', 'sub' => 'Penyederhanaan perhitungan matematika dalam kehidupan sehari-hari.'],
                ['pekan' => 3,  'topik' => 'Pecahan Biasa, Campuran, Desimal, & Persen', 'sub' => 'Konversi bentuk pecahan dan operasi hitung campurannya.'],
                ['pekan' => 4,  'topik' => 'Kelipatan Persekutuan Terkecil (KPK) & Faktor Persekutuan Terbesar (FPB)', 'sub' => 'Pohon faktor, faktorisasi prima, dan aplikasi soal cerita.'],
                ['pekan' => 5,  'topik' => 'Ciri-Ciri Makhluk Hidup & Klasifikasi 5 Kingdom', 'sub' => 'Bergerak, bernafas, berkembang biak, dan sistem binomial nomenklatur.'],
                ['pekan' => 6,  'topik' => 'Sistem Organ Tumbuhan: Akar, Batang, Daun, & Bunga', 'sub' => 'Fungsi xilem, floem, stomata, dan proses fotosintesis.'],
                ['pekan' => 7,  'topik' => 'Sistem Organ Tubuh Manusia: Rangka & Otot', 'sub' => 'Jenis tulang, persendian, dan cara menjaga kesehatan tulang.'],
                ['pekan' => 8,  'topik' => 'Sistem Pencernaan Makanan & Enzim-Enzim Pencernaan', 'sub' => 'Perjalanan makanan dari mulut hingga usus besar.'],
                ['pekan' => 9,  'topik' => 'Aljabar Dasar: Variabel, Koefisien, & Konstanta', 'sub' => 'Operasi penjumlahan dan pengurangan suku-suku sejenis.'],
                ['pekan' => 10, 'topik' => 'Persamaan Linear Satu Variabel (PLSV)', 'sub' => 'Penyelesaian nilai x dan aplikasi soal pemodelan matematika.'],
                ['pekan' => 11, 'topik' => 'Geometri Bangun Datar: Persegi, Persegi Panjang, & Segitiga', 'sub' => 'Perhitungan keliling, luas, dan teorema Pythagoras dasar.'],
                ['pekan' => 12, 'topik' => 'Geometri Bangun Datar: Lingkaran & Unsur-Unsurnya', 'sub' => 'Jari-jari, diameter, busur, juring, keliling, dan luas lingkaran.'],
                ['pekan' => 13, 'topik' => 'Zat & Wujudnya: Padat, Cair, Gas serta Perubahannya', 'sub' => 'Mencair, membeku, menguap, mengembun, menyublim, mengkristal.'],
                ['pekan' => 14, 'topik' => 'Suhu, Kalor, & Pemuaian Bahan', 'sub' => 'Konversi skala Celcius, Reamur, Fahrenheit, Kelvin, dan azas Black.'],
                ['pekan' => 15, 'topik' => 'Pengolahan Data Statistika: Mean, Median, Modus', 'sub' => 'Menghitung rata-rata nilai, nilai tengah, dan nilai paling sering muncul.'],
                ['pekan' => 16, 'topik' => 'Evaluasi Tengah Semester Eksak & Pembahasan Soal HOTS', 'sub' => 'Penyelesaian masalah logika matematis dan penalaran sains terpadu.'],
            ],
            'genap' => [
                ['pekan' => 17, 'topik' => 'Perbandingan Senilai & Berbalik Nilai', 'sub' => 'Grafik perbandingan dan penerapan pada kecepatan serta pekerja proyek.'],
                ['pekan' => 18, 'topik' => 'Aritmetika Sosial: Untung, Rugi, Diskon, & Bunga Bank', 'sub' => 'Menghitung persentase laba dan harga bersih setelah potongan.'],
                ['pekan' => 19, 'topik' => 'Geometri Bangun Ruang Sisi Datar: Kubus & Balok', 'sub' => 'Jaring-jaring, luas permukaan, dan perhitungan volume.'],
                ['pekan' => 20, 'topik' => 'Geometri Bangun Ruang: Prisma & Limas', 'sub' => 'Bentuk alas, luas selimut, dan volume limas/prisma.'],
                ['pekan' => 21, 'topik' => 'Gaya & Hukum Gerak Newton (I, II, III)', 'sub' => 'Pengaruh resultan gaya pada percepatan benda dan aksi-reaksi.'],
                ['pekan' => 22, 'topik' => 'Usaha, Daya, & Pesawat Sederhana', 'sub' => 'Pengungkit/tuas, katrol, bidang miring, dan keuntungan mekanik.'],
                ['pekan' => 23, 'topik' => 'Tekanan Zat Padat, Cair, & Gas', 'sub' => 'Tekanan hidrostatis, hukum Pascal, bejana berhubungan, hukum Archimedes.'],
                ['pekan' => 24, 'topik' => 'Sistem Peredaran Darah Manusia & Penyakitnya', 'sub' => 'Jantung, pembuluh darah nadi/balik, golongan darah, dan anemia.'],
                ['pekan' => 25, 'topik' => 'Sistem Pernapasan Manusia: Mekanisme Dada & Perut', 'sub' => 'Kapasitas paru-paru dan pertukaran gas O2 dengan CO2 di alveolus.'],
                ['pekan' => 26, 'topik' => 'Getaran, Gelombang, & Bunyi', 'sub' => 'Periode, frekuensi, gelombang transversal/longitudinal, dan resonansi.'],
                ['pekan' => 27, 'topik' => 'Cahaya & Alat Optik: Cermin Datar, Cekung, Cembung', 'sub' => 'Pembentukan bayangan, lup, kacamata miopi/hipermetropi, dan mikroskop.'],
                ['pekan' => 28, 'topik' => 'Peluang Teoritik & Empirik Suatu Kejadian', 'sub' => 'Ruang sampel dadu/koin dan frekuensi harapan kemunculan peristiwa.'],
                ['pekan' => 29, 'topik' => 'Penyajian Data: Diagram Batang, Garis, & Lingkaran', 'sub' => 'Membaca dan memvisualisasikan data sensus serta grafik tren.'],
                ['pekan' => 30, 'topik' => 'Tata Surya & Karakteristik Planet-Planet', 'sub' => 'Merkurius s/d Neptunus, sabuk asteroid, komet, meteor, dan rotasi bumi.'],
                ['pekan' => 31, 'topik' => 'Struktur Lapisan Bumi & Mitigasi Bencana Gempa', 'sub' => 'Kerak, mantel, inti bumi, lempeng tektonik, dan simulasi keselamatan diri.'],
                ['pekan' => 32, 'topik' => 'Ujian Kenaikan Kelas Matematika & Sains Komprehensif', 'sub' => 'Asesmen sumatif akhir tahun menguji konsep komprehensif dua semester.'],
            ],
        ],
    ];

    public function run(): void
    {
        $this->command->info('=== MEMULAI SEEDER MATERI BELAJAR GURU TAHUNAN (2026/2027) ===');

        // 1. Validasi Tahun Ajaran & Semester
        $academicYear = AcademicYear::where('is_active', true)->first()
            ?? AcademicYear::where('name', '2026/2027')->first();

        if (!$academicYear) {
            $this->command->error('Tahun Ajaran 2026/2027 tidak ditemukan!');
            return;
        }

        $semesterGanjil = Semester::where('academic_year_id', $academicYear->id)->where('sequence', 1)->first()
            ?? Semester::where('name', 'Ganjil')->first();

        $semesterGenap = Semester::where('academic_year_id', $academicYear->id)->where('sequence', 2)->first()
            ?? Semester::where('name', 'Genap')->first();

        $kurikulum = MasterKurikulum::first();
        if (!$kurikulum) {
            $kurikulum = MasterKurikulum::create([
                'id' => (string) Str::uuid(),
                'kode_kurikulum' => 'KM-2026',
                'nama_kurikulum' => 'Kurikulum Merdeka Darel Iman 2026/2027',
                'versi' => '2026.1',
                'status' => true,
            ]);
        }

        // Tanggal jangkar sistem
        $systemToday = Carbon::parse('2026-09-09 23:59:59');
        $kbmStartDateGanjil = Carbon::parse('2026-07-13 08:00:00');
        $kbmStartDateGenap  = Carbon::parse('2027-01-04 08:00:00');

        // 2. Membersihkan Materi Lama untuk Tahun Ajaran Ini (Idempotent)
        $this->command->info('Membersihkan Modul & Materi lama untuk Tahun Ajaran 2026/2027...');
        $oldModulIds = DB::table('lms_modul_ajar')->where('tahun_ajaran_id', $academicYear->id)->pluck('id');
        if ($oldModulIds->isNotEmpty()) {
            DB::table('lms_materi')->whereIn('modul_ajar_id', $oldModulIds)->delete();
            DB::table('lms_modul_ajar')->whereIn('id', $oldModulIds)->delete();
        }

        // 3. Ambil Seluruh Kelas Aktif (case-insensitive)
        $kelases = Kelas::where(function ($q) use ($academicYear) {
            $q->where('tahun_ajaran_id', $academicYear->id)
              ->orWhereNull('tahun_ajaran_id');
        })->whereIn('status', ['Aktif', 'aktif'])->get();

        if ($kelases->isEmpty()) {
            $kelases = Kelas::whereIn('status', ['Aktif', 'aktif'])->get();
        }

        $allSubjects = Subject::where('status', true)->get()->keyBy('id');
        $subjectsByUnit = $allSubjects->groupBy('unit_pendidikan_id');
        $teacherMapping = Teacher::pluck('employee_id', 'id');

        // Mapping jadwal mengajar ke seluruh guru (baik via employee_id maupun teacher_id)
        $scheduleTeachers = ClassSchedule::query()
            ->where('is_active', true)
            ->whereNotNull('kelas_id')
            ->whereNotNull('subject_id')
            ->where(function ($q) {
                $q->whereNotNull('employee_id')->orWhereNotNull('teacher_id');
            })
            ->get(['kelas_id', 'subject_id', 'employee_id', 'teacher_id'])
            ->groupBy('kelas_id')
            ->map(fn ($schedules) => $schedules
                ->groupBy('subject_id')
                ->map(fn ($subjectSchedules) => $subjectSchedules->map(function ($s) use ($teacherMapping) {
                    return $s->employee_id ?? $teacherMapping->get($s->teacher_id);
                })->filter()->unique()->values()));
        $defaultTeacher = Employee::first();

        $totalModulCreated = 0;
        $totalMateriCreated = 0;
        $materiBatch = [];

        $this->command->info('Mengenerate Modul Ajar dan Materi Belajar Dinamis...');

        foreach ($kelases as $kls) {
            $unitId = $kls->unit_pendidikan_id;
            $classScheduleTeachers = $scheduleTeachers->get($kls->id, collect());
            if ($classScheduleTeachers->isNotEmpty()) {
                $unitSubjects = $classScheduleTeachers->keys()->map(fn ($sId) => $allSubjects->get($sId))->filter();
            } else {
                $unitSubjects = $subjectsByUnit->get($unitId) ?? $allSubjects->take(4);
            }

            // Tentukan Fase berdasarkan jenjang kelas
            $fase = $this->determineFase($kls->tingkat, $kls->jenjang);

            foreach ($unitSubjects as $subj) {
                $assignedTeacherIds = $classScheduleTeachers->get($subj->id, collect());
                $teacherList = $assignedTeacherIds->isNotEmpty()
                    ? $assignedTeacherIds
                    : collect([$kls->wali_kelas_id ?? $defaultTeacher?->id])->filter();

                foreach ($teacherList as $teacherId) {
                    if (! $teacherId) {
                        continue;
                    }

                    // Pilih domain kurikulum yang sesuai dengan kategori atau nama mapel
                    $domainKey = $this->resolveDomainKey($subj->kategori, $subj->nama_mapel);
                    $domainData = $this->curriculumDomains[$domainKey] ?? $this->curriculumDomains['Umum'];

                    // 2 Semester: Ganjil & Genap
                    $semestersConfig = [
                        [
                            'semesterObj' => $semesterGanjil,
                            'name' => 'Ganjil',
                            'topics' => $domainData['ganjil'],
                            'startDate' => $kbmStartDateGanjil,
                        ],
                        [
                            'semesterObj' => $semesterGenap,
                            'name' => 'Genap',
                            'topics' => $domainData['genap'],
                            'startDate' => $kbmStartDateGenap,
                        ],
                    ];

                    foreach ($semestersConfig as $sConfig) {
                        $semObj = $sConfig['semesterObj'];
                        if (!$semObj) continue;

                        $semTopics = $sConfig['topics'];
                        $semStartDate = $sConfig['startDate'];

                        // Bagi 16 Pekan menjadi 2 Modul Ajar (Bab 1: Pekan 1-8, Bab 2: Pekan 9-16)
                        $modulChunks = [
                            [
                                'kode_suffix' => 'M1',
                                'part_title' => 'Bagian I: Konsep Dasar & Pemahaman Inti',
                                'pekan_slice' => array_slice($semTopics, 0, 8),
                                'week_offset' => 0,
                            ],
                            [
                                'kode_suffix' => 'M2',
                                'part_title' => 'Bagian II: Pendalaman, Aplikasi & Proyek Terpadu',
                                'pekan_slice' => array_slice($semTopics, 8, 8),
                                'week_offset' => 8,
                            ],
                        ];

                        foreach ($modulChunks as $mIndex => $mChunk) {
                            $modulId = (string) Str::uuid();
                            $cleanKelas = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $kls->kode_kelas ?? $kls->nama_kelas), 0, 10));
                            $cleanMapel = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $subj->kode_mapel ?? $subj->nama_mapel), 0, 14));
                            $cleanTeacher = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', (string) $teacherId), -4));
                            $kodeModul = substr(sprintf(
                                'MOD-%s-%s-%s-%s-%s',
                                $cleanKelas,
                                $cleanMapel,
                                substr(strtoupper($sConfig['name']), 0, 3),
                                $mChunk['kode_suffix'],
                                $cleanTeacher
                            ), 0, 50);
                        $judulModul = sprintf(
                            'Modul Ajar %s (%s) — %s',
                            $subj->nama_mapel,
                            $sConfig['name'],
                            $mChunk['part_title']
                        );

                        // Buat Modul Ajar
                        LmsModulAjar::create([
                            'id' => $modulId,
                            'unit_pendidikan_id' => $unitId,
                            'tahun_ajaran_id' => $academicYear->id,
                            'semester_id' => $semObj->id,
                            'kurikulum_id' => $kurikulum->id,
                            'mata_pelajaran_id' => $subj->id,
                            'guru_id' => $teacherId,
                            'kelas_id' => $kls->id,
                            'rombel_id' => $kls->id,
                            'kode_modul' => $kodeModul,
                            'judul_modul' => $judulModul,
                            'fase' => $fase,
                            'semester' => $sConfig['name'],
                            'alokasi_waktu_jp' => 16,
                            'tujuan_pembelajaran' => sprintf(
                                'Peserta didik mampu memahami, mempraktikkan, dan menginternalisasi materi %s secara tuntas dan berakhlak mulia.',
                                $subj->nama_mapel
                            ),
                            'profil_pelajar_pancasila' => 'Beriman, Bertakwa kepada Tuhan YME, Berakhlak Mulia, Mandiri, Bernalar Kritis',
                            'model_pembelajaran' => 'Project & Inquiry-Based Learning',
                            'metode_pembelajaran' => 'Talaqqi, Diskusi Terbimbing, Praktik Langsung, Refleksi',
                            'media_pembelajaran' => 'Video Pembelajaran, E-Book LMS, Slide Interaktif, Lembar Kerja Siswa',
                            'sumber_belajar' => 'Buku Panduan Darel Iman & Materi Terverifikasi Yayasan',
                            'kegiatan_pendahuluan' => "1. Pembukaan dengan salam, tilawah pembuka, dan doa bersama.\n2. Guru mengecek kehadiran dan memberikan apersepsi kontekstual.\n3. Menyampaikan tujuan dan capaian pembelajaran pertemuan.",
                            'kegiatan_inti' => "1. Eksplorasi konsep materi melalui bahan bacaan dan visual.\n2. Diskusi kelompok terarah dan pemecahan studi kasus harian.\n3. Presentasi kelompok dan konfirmasi pemahaman oleh guru.",
                            'kegiatan_penutup' => "1. Menyimpulkan intisari pembelajaran bersama siswa.\n2. Doa kafaratul majelis dan arahan amalan yaumiyyah.",
                            'rencana_penilaian' => 'Asesmen Formatif (40%), Asesmen Portofolio (30%), Sikap & Disiplin (30%)',
                            'status' => 'published',
                            'versi' => '1.0',
                            'deskripsi' => 'Modul pembelajaran lengkap 1 tahun ajaran kurikulum terpadu Darel Iman.',
                            'created_at' => $kbmStartDateGanjil,
                            'updated_at' => $kbmStartDateGanjil,
                        ]);
                        $totalModulCreated++;

                        // Buat Materi Belajar (8 Pertemuan per Modul)
                        foreach ($mChunk['pekan_slice'] as $pIndex => $topicItem) {
                            $weekNumber = $mChunk['week_offset'] + $pIndex + 1;
                            $materiPublishDate = $semStartDate->copy()->addWeeks($weekNumber - 1);
                            $isPublished = $materiPublishDate->lessThanOrEqualTo($systemToday);
                            $statusMateri = $isPublished ? 'published' : 'draft';

                            // Rotasi format media pembelajaran
                            $mediaTypes = ['dokumen', 'video', 'artikel', 'presentasi'];
                            $selectedMediaType = $mediaTypes[$pIndex % 4];
                            $tipeField = ($selectedMediaType === 'dokumen') ? 'pdf' : (($selectedMediaType === 'video') ? 'video' : (($selectedMediaType === 'presentasi') ? 'link' : 'teks'));

                            // Real working embeddable YouTube video per domain
                            $domainVideos = [
                                'Al-Quran'    => 'https://www.youtube.com/watch?v=0hW2x7b7w2w',
                                'Diniyyah'    => 'https://www.youtube.com/watch?v=w77zPAtVTuI',
                                'Bahasa Arab' => 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
                                'Eksak'       => 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
                                'Umum'        => 'https://www.youtube.com/watch?v=tgbNymZ7vqY',
                            ];

                            // Real working sample PDF per domain
                            $domainPdfs = [
                                'Al-Quran'    => '/storage/lms/materi/modul_tajwid_al_quran.pdf',
                                'Diniyyah'    => '/storage/lms/materi/modul_fiqih_ibadah.pdf',
                                'Bahasa Arab' => '/storage/lms/materi/modul_bahasa_arab.pdf',
                                'Eksak'       => '/storage/lms/materi/modul_matematika_sains.pdf',
                                'Umum'        => '/storage/lms/materi/sample_document.pdf',
                            ];

                            $slug = Str::slug($subj->nama_mapel . '-p' . $weekNumber . '-' . $topicItem['topik']);
                            $filePath = ($selectedMediaType === 'dokumen' || $pIndex % 4 === 0)
                                ? ($domainPdfs[$domainKey] ?? '/storage/lms/materi/sample_document.pdf')
                                : null;

                            $videoUrl = ($selectedMediaType === 'video' || $pIndex % 4 === 1)
                                ? ($domainVideos[$domainKey] ?? 'https://www.youtube.com/watch?v=0hW2x7b7w2w')
                                : null;

                            $linkUrl  = ($selectedMediaType === 'presentasi') ? "https://slides.dareliman.sch.id/view/" . substr(md5($slug), 0, 8) : null;

                            $judulMateri = sprintf(
                                'Pekan %02d: %s',
                                $weekNumber,
                                $topicItem['topik']
                            );

                            $kontenMarkdown = $this->buildRichMarkdownContent(
                                $subj->nama_mapel,
                                $weekNumber,
                                $topicItem['topik'],
                                $topicItem['sub'],
                                $kls->nama_kelas
                            );

                            $materiBatch[] = [
                                'id' => (string) Str::uuid(),
                                'modul_ajar_id' => $modulId,
                                'mata_pelajaran_id' => $subj->id,
                                'guru_id' => $teacherId,
                                'judul' => $judulMateri,
                                'tipe_materi' => $selectedMediaType,
                                'tipe' => $tipeField,
                                'isi' => $kontenMarkdown,
                                'konten' => $topicItem['sub'],
                                'file' => $filePath,
                                'video' => $videoUrl,
                                'link' => $linkUrl,
                                'urutan' => $pIndex + 1,
                                'is_published' => $isPublished,
                                'status' => $statusMateri,
                                'tanggal_publish' => $materiPublishDate->format('Y-m-d H:i:s'),
                                'catatan' => 'Materi resmi pembelajaran semester ' . $sConfig['name'] . ' 2026/2027.',
                                'created_at' => $materiPublishDate,
                                'updated_at' => $materiPublishDate,
                            ];
                            $totalMateriCreated++;

                            // Flush batch per 200 baris agar hemat memori
                            if (count($materiBatch) >= 200) {
                                DB::table('lms_materi')->insert($materiBatch);
                                $materiBatch = [];
                            }
                        }
                    }
                }
            }
        }
    }

        // Insert sisa batch terakhir
        if (!empty($materiBatch)) {
            DB::table('lms_materi')->insert($materiBatch);
        }

        $this->command->info('=== SEEDER MATERI BELAJAR GURU TAHUNAN SELESAI ===');
        $this->command->info('Total Modul Ajar Dibuat: ' . $totalModulCreated . ' Modul');
        $this->command->info('Total Materi Belajar Dibuat: ' . $totalMateriCreated . ' Materi (1 Tahun Ajaran Penuh: Ganjil & Genap)');
    }

    private function determineFase(string $tingkat, ?string $jenjang): string
    {
        $tingkatClean = strtoupper(trim($tingkat));
        if (str_contains($tingkatClean, 'TK') || str_contains($tingkatClean, 'PAUD') || str_contains($tingkatClean, 'DAYCARE')) {
            return 'Fase Fondasi';
        }
        if (in_array($tingkatClean, ['1', '2'])) {
            return 'Fase A';
        }
        if (in_array($tingkatClean, ['3', '4'])) {
            return 'Fase B';
        }
        if (in_array($tingkatClean, ['5', '6'])) {
            return 'Fase C';
        }
        if (in_array($tingkatClean, ['7', '8', '9'])) {
            return 'Fase D';
        }
        if ($tingkatClean === '10') {
            return 'Fase E';
        }
        if (in_array($tingkatClean, ['11', '12'])) {
            return 'Fase F';
        }
        return 'Fase Terpadu';
    }

    private function resolveDomainKey(?string $kategori, string $namaMapel): string
    {
        $combined = strtolower(($kategori ?? '') . ' ' . $namaMapel);

        if (str_contains($combined, 'tahfizh') || str_contains($combined, 'quran') || str_contains($combined, 'tahsin')) {
            return 'Al-Quran';
        }
        if (str_contains($combined, 'diniyyah') || str_contains($combined, 'agama') || str_contains($combined, 'adab') || str_contains($combined, 'fiqih') || str_contains($combined, 'akhlak')) {
            return 'Diniyyah';
        }
        if (str_contains($combined, 'arab')) {
            return 'Bahasa Arab';
        }
        if (str_contains($combined, 'matematika') || str_contains($combined, 'ipa') || str_contains($combined, 'sains') || str_contains($combined, 'eksak')) {
            return 'Eksak';
        }
        return 'Umum';
    }

    private function buildRichMarkdownContent(string $mapel, int $pekan, string $topik, string $sub, string $kelas): string
    {
        return <<<MARKDOWN
# {$topik}
**Mata Pelajaran**: {$mapel} | **Kelas**: {$kelas} | **Pertemuan Pekan Ke**: {$pekan}

---

### A. Tujuan Pembelajaran
Setelah menuntaskan materi pada pertemuan ini, peserta didik diharapkan mampu:
1. Memahami esensi dan konsep dasar mengenai **{$topik}** dengan benar.
2. Menganalisis contoh riil dan aplikasi praktis dari *{$sub}*.
3. Menerapkan nilai-nilai keislaman, kedisiplinan, dan integritas dalam kehidupan sehari-hari.

---

### B. Uraian Materi & Pembahasan
Pembahasan pada pertemuan ke-{$pekan} memfokuskan pada pemahaman menyeluruh terhadap:
> **{$sub}**

Konsep ini menjadi landasan penting dalam menguasai capaian pembelajaran {$mapel}. Peserta didik diajak untuk mengamati, menelaah literatur yang tersedia, serta mendiskusikan studi kasus terpilih bersama guru dan teman sekelas.

#### Poin-Poin Kunci:
- Pengertian dan landasan teori utama.
- Dalil syar'i atau prinsip ilmiah yang mendasarinya.
- Contoh penerapan praktis dalam adab santri dan pelajar terpadu.

---

### C. Lembar Kerja & Diskusi Terarah
1. Bacalah rangkuman materi di atas dengan seksama.
2. Catatlah 3 kata kunci penting yang menjadi intisari pembelajaran pekan ini.
3. Kerjakan latihan formatif yang disediakan pada menu Tugas LMS untuk menguji pemahaman ananda.

---
*Materi Pembelajaran Resmi Sistem Informasi Manajemen Sekolah Terpadu Darel Iman — Tahun Ajaran 2026/2027.*
MARKDOWN;
    }
}
