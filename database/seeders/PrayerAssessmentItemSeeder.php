<?php

namespace Database\Seeders;

use App\Models\PrayerAssessmentItem;
use App\Models\PrayerGradeRule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PrayerAssessmentItemSeeder extends Seeder
{
    public function run(): void
    {
        // 62 Doa Harian persis dari dokumen fisik
        $doas = [
            1  => ['name' => 'Doa sebelum Makan', 'group' => 'Adab Makan & Minum'],
            2  => ['name' => 'Doa lupa baca bismillah', 'group' => 'Adab Makan & Minum'],
            3  => ['name' => 'Doa lupa baca bismillah (ketika ingat)', 'group' => 'Adab Makan & Minum'],
            4  => ['name' => 'Doa Setelah makan', 'group' => 'Adab Makan & Minum'],
            5  => ['name' => 'Doa sebelum tidur', 'group' => 'Aktivitas Harian'],
            6  => ['name' => 'Doa Bangun tidur', 'group' => 'Aktivitas Harian'],
            7  => ['name' => 'Doa Masuk Wc :', 'group' => 'Adab Bersuci'],
            8  => ['name' => 'Doa keluar Wc :', 'group' => 'Adab Bersuci'],
            9  => ['name' => 'Doa akan berbuka', 'group' => 'Ibadah Puasa'],
            10 => ['name' => 'Doa Keluar rumah', 'group' => 'Rumah & Safar'],
            11 => ['name' => 'Doa Masuk Rumah', 'group' => 'Rumah & Safar'],
            12 => ['name' => 'Doa naik kendaraan', 'group' => 'Rumah & Safar'],
            13 => ['name' => 'Doa kedua orang tua', 'group' => 'Keluarga & Birrul Walidain'],
            14 => ['name' => 'Doa minta dikuatkan iman', 'group' => 'Keimanan & Keteguhan'],
            15 => ['name' => 'Doa ketika bersin', 'group' => 'Adab Harian'],
            16 => ['name' => 'Doa Bagi yang mendengar', 'group' => 'Adab Harian'],
            17 => ['name' => 'Doa Bagi yang bersin kembali', 'group' => 'Adab Harian'],
            18 => ['name' => 'Doa agar diterima amal ibadah dan taubat', 'group' => 'Taubat & Amal Shalih'],
            19 => ['name' => 'Doa agar dijadikan hamba yang bersyukur', 'group' => 'Syukur & Hidayah'],
            20 => ['name' => 'Doa berlindung dari setan', 'group' => 'Perlindungan Diri'],
            21 => ['name' => 'Doa agar hati ditetapkan dalam hidayah', 'group' => 'Keimanan & Keteguhan'],
            22 => ['name' => 'Doa Sebelum Berwuduk', 'group' => 'Adab Bersuci'],
            23 => ['name' => 'Doa setelah Berwuduk', 'group' => 'Adab Bersuci'],
            24 => ['name' => 'Doa Pergi ke Masjid', 'group' => 'Masjid & Sholat'],
            25 => ['name' => 'Doa Masuk Masjid', 'group' => 'Masjid & Sholat'],
            26 => ['name' => 'Doa Keluar Masjid', 'group' => 'Masjid & Sholat'],
            27 => ['name' => 'Doa Ditetapkan hati dalam Iman', 'group' => 'Keimanan & Keteguhan'],
            28 => ['name' => 'Doa Berlindung dari Keburukan Amal', 'group' => 'Perlindungan Diri'],
            29 => ['name' => 'Doa Mohon Bisa Melihat Wajah Allah', 'group' => 'Ketinggian Harapan'],
            30 => ['name' => 'Doa Ampunan dalam segala hal', 'group' => 'Taubat & Istighfar'],
            31 => ['name' => 'Doa Mohon Diperbaiki Segala Urusan', 'group' => 'Kelancaran Urusan'],
            32 => ['name' => 'Doa Berlindung dari Keburukan Amal (Pengulangan/Penguatan)', 'group' => 'Perlindungan Diri'],
            33 => ['name' => 'Doa Dicukupkan dari Harta Yang Halal', 'group' => 'Rezeki & Keberkahan'],
            34 => ['name' => 'Doa Mohon Ampunan dan Rahmad', 'group' => 'Taubat & Rahmat'],
            35 => ['name' => 'Doa ketetapan diri dan keluarga dalam mendirikan Sholat', 'group' => 'Keluarga & Sholat'],
            36 => ['name' => 'Doa Diselamatkan dari orang orang yang Zholim', 'group' => 'Perlindungan dari Kezaliman'],
            37 => ['name' => 'Doa agar amal ibadah diterima', 'group' => 'Penerimaan Amal'],
            38 => ['name' => 'Doa berlindung dari keburukan orang-orang kafir', 'group' => 'Perlindungan Diri'],
            39 => ['name' => 'Doa agar disempurnakan cahayanya', 'group' => 'Cahaya Iman'],
            40 => ['name' => 'Doa agar dijadikan hamba yang bersyukur (Lanjutan)', 'group' => 'Syukur & Hidayah'],
            41 => ['name' => 'Doa agar hati ditetapkan dalam hidayah (Penguatan)', 'group' => 'Keimanan & Keteguhan'],
            42 => ['name' => 'Doa agar dilapangkan hati dan dimudahkan dalam urusan', 'group' => 'Kelancaran Urusan'],
            43 => ['name' => 'Doa meminta keamanan negeri dan berlindung dari syirik', 'group' => 'Keamanan & Tauhid'],
            44 => ['name' => 'DOA UNTUK ORANG YANG SAKIT 1', 'group' => 'Kesehatan & Kesembuhan'],
            45 => ['name' => 'DOA UNTUK ORANG YANG SAKIT 2', 'group' => 'Kesehatan & Kesembuhan'],
            46 => ['name' => 'Doa ketika hujan Turun', 'group' => 'Fenomena Alam'],
            47 => ['name' => 'Doa ketika Hujan Lebat', 'group' => 'Fenomena Alam'],
            48 => ['name' => 'Setelah Turun Hujan:', 'group' => 'Fenomena Alam'],
            49 => ['name' => 'Doa ketika mendengar petir.', 'group' => 'Fenomena Alam'],
            50 => ['name' => 'Doa ketika mendengar petir. (Versi 2)', 'group' => 'Fenomena Alam'],
            51 => ['name' => 'Doa ketika ada angin kencang', 'group' => 'Fenomena Alam'],
            52 => ['name' => 'Doa memakai pakaian', 'group' => 'Adab Berpakaian'],
            53 => ['name' => 'Doa ketika beli kendaraan baru', 'group' => 'Rumah & Kendaraan'],
            54 => ['name' => 'Doa Naik Kendaraan', 'group' => 'Rumah & Safar'],
            55 => ['name' => 'Doa orang mau safar dan berdoa buat yang tinggal', 'group' => 'Safar & Perjalanan'],
            56 => ['name' => 'Orang yang ditinggalkan membaca doa sebagaimana yang ada dalam hadis ini:', 'group' => 'Safar & Perjalanan'],
            57 => ['name' => 'doa pembuka pintu Rizki', 'group' => 'Rezeki & Keberkahan'],
            58 => ['name' => 'Doa Agar dicukupkan dengan yang Halal', 'group' => 'Rezeki & Keberkahan'],
            59 => ['name' => 'Do\'a Memohon Kemudahan', 'group' => 'Kelancaran Urusan'],
            60 => ['name' => 'Do\'a Agar Terlepas dari Sulitnya Utang', 'group' => 'Perlindungan dari Utang'],
            61 => ['name' => 'Do\'a dari sifat Malas', 'group' => 'Perlindungan dari Malas'],
            62 => ['name' => 'Doa Perbaikan Akhlak', 'group' => 'Akhlak & Kepribadian'],
        ];

        foreach ($doas as $num => $info) {
            PrayerAssessmentItem::updateOrCreate(
                ['order_number' => $num],
                [
                    'id' => (string) Str::uuid(),
                    'name' => $info['name'],
                    'group' => $info['group'],
                    'max_score' => 100.00,
                    'passing_score' => 75.00,
                    'is_active' => true,
                ]
            );
        }

        // Skala Grade Standar
        $grades = [
            ['grade' => 'A', 'label' => 'Mumtaz (Istimewa)', 'min_score' => 90.00, 'max_score' => 100.00, 'order_index' => 1, 'description' => 'Hafal sangat lancar, tajwid & makhraj sangat baik, adab sempurna'],
            ['grade' => 'B', 'label' => 'Jayyid Jiddan (Sangat Baik)', 'min_score' => 80.00, 'max_score' => 89.99, 'order_index' => 2, 'description' => 'Hafal lancar, tajwid & makhraj baik, adab baik'],
            ['grade' => 'C', 'label' => 'Jayyid (Baik / Cukup)', 'min_score' => 75.00, 'max_score' => 79.99, 'order_index' => 3, 'description' => 'Memenuhi KKM, perlu peningkatan kelancaran'],
            ['grade' => 'D', 'label' => 'Maqbul (Perlu Bimbingan)', 'min_score' => 0.00, 'max_score' => 74.99, 'order_index' => 4, 'description' => 'Belum memenuhi KKM, wajib mengulang setoran'],
        ];

        foreach ($grades as $g) {
            PrayerGradeRule::updateOrCreate(
                ['grade' => $g['grade']],
                [
                    'id' => (string) Str::uuid(),
                    'label' => $g['label'],
                    'min_score' => $g['min_score'],
                    'max_score' => $g['max_score'],
                    'order_index' => $g['order_index'],
                    'description' => $g['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
