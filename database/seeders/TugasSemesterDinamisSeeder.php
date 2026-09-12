<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassSchedule;
use App\Models\Employee;
use App\Models\Kelas;
use App\Models\LmsMateri;
use App\Models\LmsModulAjar;
use App\Models\LmsPengumpulanTugas;
use App\Models\LmsPenugasan;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TugasSemesterDinamisSeeder extends Seeder
{
    /**
     * Jalankan seeder penugasan LMS untuk semua rombel & kelas 1 semester ganjil (2026/2027).
     * Sesuai standar simulasi operasional (titik jangkar: 9 September 2026),
     * bebas data hardcode, dan idempoten.
     */
    public function run(): void
    {
        $this->command->info('=== MEMULAI SEEDER PENUGASAN SEMESTER DINAMIS (2026/2027) ===');

        // 1. Validasi Tahun Ajaran & Semester Aktif
        $academicYear = AcademicYear::where('is_active', true)->first()
            ?? AcademicYear::where('name', '2026/2027')->first();

        if (!$academicYear) {
            $this->command->error('Tahun Ajaran Aktif 2026/2027 tidak ditemukan!');
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

        $this->command->info(sprintf(
            'Tahun Ajaran: %s | Semester: %s (ID: %s)',
            $academicYear->name,
            $semesterGanjil->name,
            $semesterGanjil->id
        ));

        // Titik jangkar simulasi operasional sistem
        $systemAnchorDate = Carbon::parse('2026-09-09 23:59:59');

        // Admin default user untuk created_by
        $adminUser = User::orderBy('id')->first();
        $adminUserId = $adminUser ? $adminUser->id : null;

        // 2. Pembersihan Data Penugasan Lama Semester Ganjil TA Ini (Idempoten & Bersih)
        $this->command->info('Membersihkan data penugasan lama untuk Semester Ganjil...');
        $oldPenugasanIds = DB::table('lms_penugasan')
            ->where('tahun_ajaran_id', $academicYear->id)
            ->where('semester_id', $semesterGanjil->id)
            ->pluck('id');

        if ($oldPenugasanIds->isNotEmpty()) {
            foreach ($oldPenugasanIds->chunk(500) as $chunkIds) {
                DB::table('lms_pengumpulan_tugas')->whereIn('penugasan_id', $chunkIds)->delete();
                DB::table('lms_penugasan')->whereIn('id', $chunkIds)->delete();
            }
            $this->command->info(sprintf('Berhasil mereset %d penugasan lama beserta pengumpulannya.', $oldPenugasanIds->count()));
        }

        // 3. Ambil Semua Kelas Aktif
        $kelases = Kelas::where(function ($q) use ($academicYear) {
            $q->where('tahun_ajaran_id', $academicYear->id)
              ->orWhereNull('tahun_ajaran_id');
        })->whereIn('status', ['Aktif', 'aktif'])
          ->orderBy('nama_kelas')
          ->get();

        if ($kelases->isEmpty()) {
            $kelases = Kelas::whereIn('status', ['Aktif', 'aktif'])->get();
        }

        $this->command->info(sprintf('Memproses %d kelas/rombel aktif...', $kelases->count()));

        // 4. Cache Pendukung
        $allSubjects = Subject::where('status', true)->get()->keyBy('id');
        $subjectsByUnit = $allSubjects->groupBy('unit_pendidikan_id');
        $teacherMapping = Teacher::pluck('employee_id', 'id');
        $defaultTeacher = Employee::first();

        // Mapping guru pengampu per kelas dan mapel dari jadwal
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
                })->filter()->unique()->first()));

        DB::disableQueryLog();

        // Cache Modul Ajar Semester Ganjil (hanya ID, kelas_id, mata_pelajaran_id)
        $allModuls = DB::table('lms_modul_ajar')
            ->where('tahun_ajaran_id', $academicYear->id)
            ->where('semester_id', $semesterGanjil->id)
            ->whereNull('deleted_at')
            ->select(['id', 'kelas_id', 'mata_pelajaran_id'])
            ->get()
            ->groupBy(fn ($m) => $m->kelas_id . '_' . $m->mata_pelajaran_id);

        // Cache Siswa Aktif per Kelas (hanya kolom kunci tanpa metadata besar)
        $studentsByClass = DB::table('students')
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->where(function ($q) {
                $q->whereNotNull('kelas_id')->orWhereNotNull('class_id');
            })
            ->select(['id', 'kelas_id', 'class_id', 'full_name'])
            ->get()
            ->groupBy(fn ($s) => $s->kelas_id ?? $s->class_id);

        $totalPenugasanCreated = 0;
        $totalPengumpulanCreated = 0;
        $totalClassesProcessed = 0;

        $penugasanBatch = [];
        $pengumpulanBatch = [];

        // 5. Template Ulasan Guru Positif & Konstruktif
        $feedbackTemplates = [
            'high' => [
                'Masya Allah, pengerjaan tugas sangat rapi, sistematis, dan argumentasi pemahaman sangat kuat. Pertahankan prestasi ini!',
                'Alhamdulillah jawaban luar biasa komprehensif, analisis terperinci, dan sesuai dengan seluruh indikator kompetensi pembelajaran.',
                'Sangat memuaskan! Pemahaman materi mendalam serta disajikan dengan bahasa yang terstruktur dan santun. Barakallahu fiik.',
                'Pekerjaan yang sangat istimewa, mandiri, dan orisinal. Refleksi materi diterapkan dengan sangat tepat.',
            ],
            'medium' => [
                'Alhamdulillah hasil pengerjaan sudah baik dan memenuhi standar capaian. Tingkatkan ketelitian pada bagian studi kasus.',
                'Tugas dikerjakan dengan cukup rapi. Perlu sedikit elaborasi pada poin kesimpulan agar pemahaman lebih mendalam.',
                'Bagus dan sistematis. Terus jaga kedisiplinan dan tingkatkan pembiasaan membaca materi pengayaan yang ditautkan.',
                'Pekerjaan cukup baik. Catatan koreksi kecil telah diberikan pada lembar kerja untuk perbaikan pada tugas berikutnya.',
            ],
            'pass' => [
                'Tugas diterima dan sudah mencapai nilai KKM. Silakan pelajari kembali ringkasan materi untuk persiapan evaluasi.',
                'Sudah memahami konsep dasar, namun perlu lebih teliti dalam menjawab pertanyaan penalaran tingkat tinggi.',
            ],
        ];

        // 6. Loop Rombel & Kelas
        foreach ($kelases as $kls) {
            $unitId = $kls->unit_pendidikan_id;
            $classScheduleTeachers = $scheduleTeachers->get($kls->id, collect());

            // Tentukan mata pelajaran kelas ini
            if ($classScheduleTeachers->isNotEmpty()) {
                $unitSubjects = $classScheduleTeachers->keys()->map(fn ($sId) => $allSubjects->get($sId))->filter();
            } else {
                $unitSubjects = $subjectsByUnit->get($unitId);
                if (!$unitSubjects || $unitSubjects->isEmpty()) {
                    $unitSubjects = $allSubjects->take(4);
                }
            }

            $studentsInClass = $studentsByClass->get($kls->id, collect());

            foreach ($unitSubjects as $subj) {
                // Tentukan guru pengampu
                $teacherId = $classScheduleTeachers->get($subj->id)
                    ?? $subj->guru_pengampu_id
                    ?? $kls->wali_kelas_id
                    ?? $defaultTeacher?->id;

                if (!$teacherId) {
                    continue;
                }

                // Ambil modul ajar kelas & mapel ini
                $classModuls = $allModuls->get($kls->id . '_' . $subj->id, collect());
                $firstModul = $classModuls->first();
                $modulIds = $classModuls->pluck('id')->toArray();

                // Ambil materi belajar secara terarah (on-demand) untuk modul-modul ini saja
                $materisForSubject = !empty($modulIds)
                    ? DB::table('lms_materi')
                        ->whereIn('modul_ajar_id', $modulIds)
                        ->whereNull('deleted_at')
                        ->orderBy('urutan')
                        ->select(['id', 'modul_ajar_id', 'judul', 'urutan'])
                        ->get()
                    : collect();

                // Buat 4 Tugas Terstruktur Sepanjang Semester 1
                $assignmentBlueprints = [
                    [
                        'urutan' => 1,
                        'fase_name' => 'Formatif Awal',
                        'tipe' => 'individu',
                        'jenis' => 'latihan',
                        'bobot' => 15.0,
                        'nilai_maks' => 100.0,
                        'mulai' => Carbon::parse('2026-07-28 08:00:00'),
                        'deadline' => Carbon::parse('2026-08-06 23:59:59'),
                        'is_published' => true,
                        'materi_slice' => $materisForSubject->slice(0, 2),
                        'submission_state' => 'graded', // 100% siswa dinilai
                    ],
                    [
                        'urutan' => 2,
                        'fase_name' => 'Analisis Terapan',
                        'tipe' => 'individu',
                        'jenis' => 'tugas',
                        'bobot' => 20.0,
                        'nilai_maks' => 100.0,
                        'mulai' => Carbon::parse('2026-08-18 08:00:00'),
                        'deadline' => Carbon::parse('2026-08-28 23:59:59'),
                        'is_published' => true,
                        'materi_slice' => $materisForSubject->slice(2, 2),
                        'submission_state' => 'graded', // 100% siswa dinilai
                    ],
                    [
                        'urutan' => 3,
                        'fase_name' => 'Studi Kasus & Lembar Kerja Mandiri',
                        'tipe' => 'individu',
                        'jenis' => 'tugas',
                        'bobot' => 25.0,
                        'nilai_maks' => 100.0,
                        'mulai' => Carbon::parse('2026-09-03 08:00:00'),
                        'deadline' => Carbon::parse('2026-09-16 23:59:59'), // Aktif sekarang! (Jangkar: 9 Sep 2026)
                        'is_published' => true,
                        'materi_slice' => $materisForSubject->slice(4, 3), // Menautkan multi-materi (hingga 3 materi!)
                        'submission_state' => 'active_live', // 65% submit, 35% pending
                    ],
                    [
                        'urutan' => 4,
                        'fase_name' => 'Proyek Portofolio Terpadu',
                        'tipe' => 'kelompok',
                        'jenis' => 'proyek',
                        'bobot' => 40.0,
                        'nilai_maks' => 100.0,
                        'mulai' => Carbon::parse('2026-10-26 08:00:00'),
                        'deadline' => Carbon::parse('2026-11-20 23:59:59'), // Mendatang
                        'is_published' => true,
                        'materi_slice' => $materisForSubject->slice(7, 2),
                        'submission_state' => 'scheduled', // Belum dimulai
                    ],
                ];

                foreach ($assignmentBlueprints as $blueprint) {
                    $penugasanId = (string) Str::uuid();

                    // Tautkan materi-materi terkait
                    $attachedMaterials = $blueprint['materi_slice']->values();
                    $attachedMateriIds = $attachedMaterials->pluck('id')->toArray();
                    $primaryMateriId = !empty($attachedMateriIds) ? $attachedMateriIds[0] : null;

                    // Buat judul dan deskripsi dinamis dari materi dan mapel
                    $topicHint = $attachedMaterials->isNotEmpty()
                        ? preg_replace('/^Pekan\s+\d+:\s*/i', '', $attachedMaterials[0]->judul)
                        : $subj->nama_mapel;

                    $judulTugas = sprintf(
                        'Tugas %d: %s (%s)',
                        $blueprint['urutan'],
                        $topicHint,
                        $blueprint['fase_name']
                    );

                    // Pangkas judul jika melebihi 190 karakter
                    if (mb_strlen($judulTugas) > 190) {
                        $judulTugas = mb_substr($judulTugas, 0, 187) . '...';
                    }

                    $deskripsi = sprintf(
                        'Penugasan terstruktur %s untuk mata pelajaran %s di %s. Fokus pengerjaan pada pemahaman komprehensif topik "%s" dan penerapannya dalam kehidupan sehari-hari.',
                        strtolower($blueprint['fase_name']),
                        $subj->nama_mapel,
                        $kls->nama_kelas,
                        $topicHint
                    );

                    $instruksi = "1. Pelajari secara seksama materi dan bahan ajar yang telah ditautkan pada tugas ini.\n"
                        . "2. Kerjakan seluruh instruksi lembar kerja secara mandiri dengan menjunjung tinggi nilai kejujuran dan ketelitian.\n"
                        . "3. Format pengumpulan dapat berupa uraian teks langsung atau unggah dokumen PDF / foto pengerjaan yang terbaca jelas.\n"
                        . "4. Pastikan submit sebelum batas waktu yang ditentukan.";

                    // Masukkan penugasan ke database terlebih dahulu untuk menjaga foreign key integritas
                    DB::table('lms_penugasan')->insert([
                        'id' => $penugasanId,
                        'mata_pelajaran_id' => $subj->id,
                        'kelas_id' => $kls->id,
                        'guru_id' => $teacherId,
                        'semester_id' => $semesterGanjil->id,
                        'tahun_ajaran_id' => $academicYear->id,
                        'modul_ajar_id' => $firstModul?->id,
                        'materi_id' => $primaryMateriId,
                        'materi_ids' => !empty($attachedMateriIds) ? json_encode($attachedMateriIds) : null,
                        'judul_tugas' => $judulTugas,
                        'deskripsi' => $deskripsi,
                        'instruksi' => $instruksi,
                        'tipe_tugas' => $blueprint['tipe'],
                        'jenis_tugas' => $blueprint['jenis'],
                        'nilai_maksimal' => $blueprint['nilai_maks'],
                        'bobot_persen' => $blueprint['bobot'],
                        'tanggal_mulai' => $blueprint['mulai'],
                        'deadline' => $blueprint['deadline'],
                        'izin_kumpul_terlambat' => true,
                        'is_published' => $blueprint['is_published'],
                        'file_lampiran' => '/storage/lms/materi/sample_document.pdf',
                        'created_by' => $adminUserId,
                        'updated_by' => $adminUserId,
                        'created_at' => $blueprint['mulai'],
                        'updated_at' => $blueprint['mulai'],
                    ]);
                    $totalPenugasanCreated++;

                    // 7. Pengumpulan Tugas Mahasiswa / Siswa Rombel Ini
                    if ($studentsInClass->isNotEmpty()) {
                        $state = $blueprint['submission_state'];

                        foreach ($studentsInClass as $sIdx => $student) {
                            $submissionId = (string) Str::uuid();

                            if ($state === 'graded') {
                                // 100% siswa dinilai (Tugas 1 & 2)
                                $score = round(78 + (crc32($student->id . $penugasanId) % 200) / 10, 1);
                                if ($score > 98) $score = 98.0;

                                $catatanCategory = ($score >= 93) ? 'high' : (($score >= 84) ? 'medium' : 'pass');
                                $feedbackList = $feedbackTemplates[$catatanCategory];
                                $catatan = $feedbackList[crc32($student->id) % count($feedbackList)];

                                $submitDate = $blueprint['mulai']->copy()->addDays(2 + ($sIdx % 4));
                                $gradeDate = $submitDate->copy()->addDays(1);

                                $pengumpulanBatch[] = [
                                    'id' => $submissionId,
                                    'penugasan_id' => $penugasanId,
                                    'siswa_id' => $student->id,
                                    'jawaban_teks' => sprintf('Alhamdulillah berikut hasil pengerjaan lembar kerja %s dari saya. Dokumen telah disesuaikan dengan instruksi modul.', $judulTugas),
                                    'file_path' => sprintf('https://storage.dareliman.sch.id/lms/submissions/%s_%s.pdf', substr($penugasanId, 0, 8), substr($student->id, 0, 8)),
                                    'url_link' => null,
                                    'status' => 'dinilai',
                                    'waktu_kumpul' => $submitDate,
                                    'nilai_guru' => $score,
                                    'catatan_guru' => $catatan,
                                    'waktu_dinilai' => $gradeDate,
                                    'dinilai_oleh' => $teacherId,
                                    'created_by' => $adminUserId,
                                    'updated_by' => $adminUserId,
                                    'created_at' => $submitDate,
                                    'updated_at' => $gradeDate,
                                ];
                                $totalPengumpulanCreated++;
                            } elseif ($state === 'active_live') {
                                // 65% submit (menunggu dinilai), 35% belum kumpul
                                $isSubmitted = ($sIdx % 10) < 7; // 70% submit
                                if ($isSubmitted) {
                                    $submitDate = Carbon::parse('2026-09-05 09:00:00')->addHours(($sIdx * 7) % 72);

                                    $pengumpulanBatch[] = [
                                        'id' => $submissionId,
                                        'penugasan_id' => $penugasanId,
                                        'siswa_id' => $student->id,
                                        'jawaban_teks' => sprintf('Bismillah, saya telah menyelesaikan studi kasus dan rangkuman materi %s. Mohon bimbingan dan koreksinya Ustadz/Ustadzah.', $topicHint),
                                        'file_path' => sprintf('https://storage.dareliman.sch.id/lms/submissions/%s_%s.pdf', substr($penugasanId, 0, 8), substr($student->id, 0, 8)),
                                        'url_link' => null,
                                        'status' => 'dikumpulkan',
                                        'waktu_kumpul' => $submitDate,
                                        'nilai_guru' => null,
                                        'catatan_guru' => null,
                                        'waktu_dinilai' => null,
                                        'dinilai_oleh' => null,
                                        'created_by' => $adminUserId,
                                        'updated_by' => $adminUserId,
                                        'created_at' => $submitDate,
                                        'updated_at' => $submitDate,
                                    ];
                                    $totalPengumpulanCreated++;
                                }
                            }
                            // Jika scheduled (Tugas 4), tidak membuat pengumpulan tugas (status belum mulai)
                        }
                    }

                    // Flush batch pengumpulan per 250 baris agar hemat memori
                    if (count($pengumpulanBatch) >= 250) {
                        DB::table('lms_pengumpulan_tugas')->insert($pengumpulanBatch);
                        $pengumpulanBatch = [];
                    }
                }
            }

            $totalClassesProcessed++;
        }

        // Flush sisa batch pengumpulan
        if (!empty($pengumpulanBatch)) {
            DB::table('lms_pengumpulan_tugas')->insert($pengumpulanBatch);
            $pengumpulanBatch = [];
        }

        $this->command->info('=== SEEDER PENUGASAN SEMESTER SELESAI DENGAN SUKSES ===');
        $this->command->info(sprintf('Total Kelas/Rombel Diproses: %d kelas', $totalClassesProcessed));
        $this->command->info(sprintf('Total Penugasan Dibuat: %d tugas (Multi-Materi tertaut)', $totalPenugasanCreated));
        $this->command->info(sprintf('Total Pengumpulan Siswa Dibuat: %d submissions (Dinilai & Aktif)', $totalPengumpulanCreated));
    }
}
