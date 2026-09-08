<?php

namespace Database\Seeders;

use App\Models\MutabaahDailyDetail;
use App\Models\MutabaahDailyHeader;
use App\Models\MutabaahParentSignature;
use App\Models\Student;
use Illuminate\Database\Seeder;

class MutabaahPurgeDemoSeeder extends Seeder
{
    /**
     * Membersihkan seluruh data dummy mutabaah harian yang dibuat selama fase staging
     * tanpa menghapus master konfigurasi sekolah, tanpa merusak foreign key,
     * dan tanpa menyentuh data produksi santri lainnya.
     */
    public function run(): void
    {
        $this->command->info('Memulai pembersihan data dummy Mutabaah staging...');

        $targetStudents = Student::whereIn('full_name', ['Laila Fitriani', 'Siswa Test', 'Ahmad Zaky'])->pluck('id');

        if ($targetStudents->isNotEmpty()) {
            $headers = MutabaahDailyHeader::whereIn('student_id', $targetStudents)->get();
            $headerIds = $headers->pluck('id');

            // 1. Bersihkan Paraf Orang Tua Dummy
            $deletedSignatures = MutabaahParentSignature::whereIn('daily_header_id', $headerIds)->delete();
            $this->command->info("- {$deletedSignatures} paraf orang tua dummy berhasil dibersihkan.");

            // 2. Bersihkan Rincian Detail Butir Amalan Dummy
            $deletedDetails = MutabaahDailyDetail::whereIn('daily_header_id', $headerIds)->delete();
            $this->command->info("- {$deletedDetails} detail amalan harian dummy berhasil dibersihkan.");

            // 3. Bersihkan Header Harian Dummy
            $deletedHeaders = MutabaahDailyHeader::whereIn('id', $headerIds)->delete();
            $this->command->info("- {$deletedHeaders} header harian dummy berhasil dibersihkan.");
        } else {
            $this->command->info('- Tidak ada data dummy yang perlu dibersihkan.');
        }

        $this->command->info('Pembersihan data dummy Mutabaah tuntas 100%! Sistem siap digunakan untuk data riil.');
    }
}
