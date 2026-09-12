<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\LmsMateri;
use App\Models\LmsModulAjar;
use App\Models\Semester;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LmsMediaSemesterDinamisSeeder extends Seeder
{
    /**
     * Sinkronisasi & generate media pembelajaran (lms_media) untuk seluruh materi belajar
     * semester ganjil (2026/2027) secara efisien, bebas data hardcode, dan idempoten.
     */
    public function run(): void
    {
        $this->command->info('=== MEMULAI SINKRONISASI MEDIA MATERI BELAJAR (LMS MEDIA) ===');

        DB::disableQueryLog();

        $academicYear = AcademicYear::where('is_active', true)->first()
            ?? AcademicYear::where('name', '2026/2027')->first();

        if (!$academicYear) {
            $this->command->error('Tahun Ajaran 2026/2027 tidak ditemukan!');
            return;
        }

        $semesterGanjil = Semester::where('academic_year_id', $academicYear->id)
            ->where(function ($q) {
                $q->where('sequence', 1)->orWhere('name', 'like', '%Ganjil%');
            })->first()
            ?? Semester::where('is_active', true)->first();

        if (!$semesterGanjil) {
            $this->command->error('Semester Ganjil tidak ditemukan!');
            return;
        }

        // Ambil ID modul semester ganjil
        $modulIds = DB::table('lms_modul_ajar')
            ->where('tahun_ajaran_id', $academicYear->id)
            ->where('semester_id', $semesterGanjil->id)
            ->whereNull('deleted_at')
            ->pluck('id');

        $this->command->info(sprintf('Ditemukan %d modul ajar semester ganjil.', $modulIds->count()));

        // Ambil materi belajar semester ganjil (chunking untuk hemat memori)
        $totalMediaCreated = 0;
        $mediaBatch = [];

        // Hapus media lama dari materi semester ganjil ini
        $this->command->info('Membersihkan media pembelajaran lama semester ganjil...');
        $materiIds = DB::table('lms_materi')
            ->whereIn('modul_ajar_id', $modulIds)
            ->whereNull('deleted_at')
            ->pluck('id');

        foreach ($materiIds->chunk(1000) as $chunkMateriIds) {
            DB::table('lms_media')->whereIn('materi_id', $chunkMateriIds)->delete();
        }

        $this->command->info(sprintf('Membuat media pembelajaran untuk %d materi belajar...', $materiIds->count()));

        // Loop materi secara chunked
        DB::table('lms_materi')
            ->whereIn('modul_ajar_id', $modulIds)
            ->whereNull('deleted_at')
            ->select(['id', 'judul', 'tipe_materi', 'tipe', 'file', 'video', 'link', 'is_published', 'created_by'])
            ->orderBy('id')
            ->chunk(500, function ($materis) use (&$mediaBatch, &$totalMediaCreated) {
                foreach ($materis as $m) {
                    $mediaIndex = 1;

                    // 1. Dokumen PDF Modul
                    if (!empty($m->file)) {
                        $mediaBatch[] = [
                            'id' => (string) Str::uuid(),
                            'materi_id' => $m->id,
                            'nama_file' => sprintf('Modul Bacaan - %s.pdf', $m->judul),
                            'tipe_file' => 'pdf',
                            'path_file' => $m->file,
                            'url_eksternal' => str_starts_with($m->file, 'http') ? $m->file : null,
                            'ukuran_bytes' => 2450000,
                            'durasi_detik' => null,
                            'deskripsi' => 'Dokumen referensi dan materi ajar terstruktur.',
                            'urutan' => $mediaIndex++,
                            'created_by' => $m->created_by,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        $totalMediaCreated++;
                    }

                    // 2. Video Pembelajaran YouTube
                    if (!empty($m->video)) {
                        $mediaBatch[] = [
                            'id' => (string) Str::uuid(),
                            'materi_id' => $m->id,
                            'nama_file' => sprintf('Video Pembelajaran - %s', $m->judul),
                            'tipe_file' => 'video',
                            'path_file' => null,
                            'url_eksternal' => $m->video,
                            'ukuran_bytes' => null,
                            'durasi_detik' => 600,
                            'deskripsi' => 'Tautan video penjelasan materi dan pembahasan studi kasus.',
                            'urutan' => $mediaIndex++,
                            'created_by' => $m->created_by,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        $totalMediaCreated++;
                    }

                    // 3. Presentasi Slides / Tautan Interaktif
                    if (!empty($m->link)) {
                        $mediaBatch[] = [
                            'id' => (string) Str::uuid(),
                            'materi_id' => $m->id,
                            'nama_file' => sprintf('Slide Tayangan & Ringkasan - %s', $m->judul),
                            'tipe_file' => 'link',
                            'path_file' => null,
                            'url_eksternal' => $m->link,
                            'ukuran_bytes' => null,
                            'durasi_detik' => null,
                            'deskripsi' => 'Slide presentasi digital dan ringkasan visual konsep.',
                            'urutan' => $mediaIndex++,
                            'created_by' => $m->created_by,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        $totalMediaCreated++;
                    }

                    // Flush batch per 500 rows
                    if (count($mediaBatch) >= 500) {
                        DB::table('lms_media')->insert($mediaBatch);
                        $mediaBatch = [];
                    }
                }
            });

        // Flush sisa batch
        if (!empty($mediaBatch)) {
            DB::table('lms_media')->insert($mediaBatch);
            $mediaBatch = [];
        }

        $this->command->info(sprintf('=== BERHASIL MEMBUAT %d MEDIA PEMBELAJARAN (LMS MEDIA) ===', $totalMediaCreated));
    }
}
