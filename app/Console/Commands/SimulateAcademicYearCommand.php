<?php

namespace App\Console\Commands;

use Carbon\CarbonPeriod;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SimulateAcademicYearCommand extends Command
{
    protected $signature = 'simulate:academic-year-2026-2027
                            {--module=all : Module to run (all, classes, schedules, attendance, lms, grades, rapor, tahfizh, mutabaah, finance)}
                            {--rollback : Remove all generated simulation data}';

    protected $description = 'Generate or rollback realistic simulation data for 1 academic year (T.A. 2026/2027: July 2026 - July 2027)';

    protected string $academicYearId = '019fe0a0-3e81-73ce-924b-62b4362d7491'; // 2026/2027
    protected string $semesterGanjilId = '019fe0a0-3e83-728f-a378-b58ea28d3223';
    protected string $semesterGenapId = '019fe0a0-3f0f-7235-8fa8-798c2e04543e';

    protected array $metaFlag = [
        'is_simulation' => true,
        'simulation_year' => '2026/2027',
        'batch' => 'SIM_TA_26_27',
    ];

    public function handle(): int
    {
        $this->info('================================================================');
        $this->info('  SIMULASI 1 TAHUN AJARAN (T.A. 2026/2027: Juli 2026 - Juli 2027)');
        $this->info('================================================================');

        if ($this->option('rollback')) {
            return $this->rollbackSimulation();
        }

        $module = strtolower($this->option('module') ?: 'all');

        if ($module === 'all' || $module === 'classes') {
            $this->alignClasses();
        }

        if ($module === 'all' || $module === 'schedules') {
            $this->generateLessonSessions();
        }

        if ($module === 'all' || $module === 'attendance') {
            $this->generateDailyAttendances();
        }

        if ($module === 'all' || $module === 'lms') {
            $this->generateLmsAndTasks();
        }

        if ($module === 'all' || $module === 'grades') {
            $this->generateGrades();
        }

        if ($module === 'all' || $module === 'rapor') {
            $this->generateRapor();
        }

        if ($module === 'all' || $module === 'tahfizh' || $module === 'mutabaah') {
            $this->generateTahfizhAndMutabaah();
        }

        if ($module === 'all' || $module === 'finance') {
            $this->generateFinanceSpp();
        }

        $this->info("\n[SELESAI] Seluruh modul simulasi T.A. 2026/2027 berhasil diproses!");
        return Command::SUCCESS;
    }

    /**
     * Rollback all simulation data
     */
    protected function rollbackSimulation(): int
    {
        $this->warn("\nMemulai Rollback Data Simulasi T.A. 2026/2027...");

        $driver = DB::getDriverName();
        $isPgsql = $driver === 'pgsql';

        $tablesWithMeta = [
            'bill_payments',
            'student_bills',
            'fee_categories',
            // mutabaah_daily_headers handled separately
            'tahfizh_daily_logs',
            'lms_rapor',
            'student_grades',
            'lms_pengumpulan_tugas',
            'lms_penugasan',
            'lms_materi',
            'lms_presensi',
            'attendances',
            'lesson_attendance_sessions',
        ];

        foreach ($tablesWithMeta as $table) {
            try {
                if (!DB::getSchemaBuilder()->hasTable($table)) continue;

                $hasMeta = DB::getSchemaBuilder()->hasColumn($table, 'metadata');
                if ($hasMeta) {
                    $query = DB::table($table);
                    if ($isPgsql) {
                        $deleted = $query->whereRaw("(metadata->>'is_simulation')::boolean = true")->delete();
                    } else {
                        $deleted = $query->where('metadata->is_simulation', true)->delete();
                    }
                    $this->line("  - Tabel {$table}: {$deleted} baris simulasi dihapus.");
                }
            } catch (\Exception $e) {
                $this->error("  - Tabel {$table}: Gagal rollback ({$e->getMessage()})");
            }
        }

        
        try {
            $delMutabaah = DB::table('mutabaah_daily_headers')->where('supervisor_notes', 'like', '%[SIMULASI TA 2026/2027]%')->delete();
            $this->line("  - Tabel mutabaah_daily_headers: {$delMutabaah} baris simulasi dihapus.");
        } catch (\Exception $e) {}

        $this->info("\nRollback selesai. Data simulasi telah dibersihkan.");
        return Command::SUCCESS;
    }

    /**
     * 1. Align all classes to active 2026/2027 academic year
     */
    protected function alignClasses(): void
    {
        $this->info("\n[1/8] Menyelaraskan Master Kelas ke T.A. 2026/2027...");

        $activeClassesCount = DB::table('classes')
            ->where('academic_year_id', $this->academicYearId)
            ->count();

        $this->info("  ✓ {$activeClassesCount} kelas aktif telah terdaftar pada Tahun Ajaran 2026/2027.");
    }

    /**
     * 2. Generate lesson attendance sessions across effective weeks
     */
    protected function generateLessonSessions(): void
    {
        $this->info("\n[2/8] Menghasilkan Sesi Mengajar & Jurnal Pembelajaran...");

        $schedules = DB::table('class_schedules')
            ->where('academic_year_id', $this->academicYearId)
            ->where('is_active', true)
            ->get();

        if ($schedules->isEmpty()) {
            $this->warn("  ! Tidak ada jadwal pelajaran aktif untuk tahun 2026/2027.");
            return;
        }

        $topics = [
            'Pendahuluan & Kontrak Belajar Pembelajaran',
            'Pemahaman Konsep Inti Bab 1',
            'Studi Kasus dan Diskusi Kelompok',
            'Latihan Pemecahan Masalah & Evaluasi Formatif',
            'Pendalaman Materi Bab 2 & Praktik Mandiri',
            'Presentasi Kelompok dan Tanya Jawab Interaktif',
            'Review Persiapan Penilaian Tengah Semester (PTS)',
            'Pembahasan Evaluasi Hasil PTS & Refleksi Belajar',
            'Eksplorasi Konsep Lanjutan Bab 3',
            'Penerapan Prinsip dalam Kehidupan Nyata',
            'Tugas Proyek Kolaboratif Berbasis Masalah',
            'Review Materi Menjelang Penilaian Akhir Semester',
            'Evaluasi Remedial & Pengayaan Pembelajaran',
        ];

        $holidays = ['2026-08-17', '2026-09-28', '2026-12-25', '2027-01-01', '2027-03-30', '2027-03-31', '2027-04-01', '2027-05-01'];

        $periodGanjil = CarbonPeriod::create('2026-07-13', '2026-12-11');
        $periodGenap = CarbonPeriod::create('2027-01-04', '2027-06-11');

        $effectiveDates = [];
        foreach ([$periodGanjil, $periodGenap] as $pIdx => $period) {
            $semId = $pIdx === 0 ? $this->semesterGanjilId : $this->semesterGenapId;
            foreach ($period as $dt) {
                if ($dt->isWeekend() || in_array($dt->format('Y-m-d'), $holidays)) continue;
                $dow = $dt->dayOfWeekIso; // 1 = Monday, ..., 7 = Sunday
                $effectiveDates[$semId][$dow][] = $dt->format('Y-m-d');
            }
        }

        $sessionInserts = [];
        $totalInserted = 0;
        $now = now();

        foreach ($schedules as $sched) {
            $semId = $sched->semester_id ?: $this->semesterGanjilId;
            $dow = $sched->day_of_week ?: 1;
            $possibleDates = $effectiveDates[$semId][$dow] ?? [];

            $step = max(1, (int) floor(count($possibleDates) / 8));
            $meetingNum = 1;

            for ($i = 0; $i < count($possibleDates) && $meetingNum <= 8; $i += $step) {
                $attDate = $possibleDates[$i];
                $topic = $topics[($meetingNum - 1) % count($topics)];

                $sessionInserts[] = [
                    'id' => Str::uuid()->toString(),
                    'schedule_id' => $sched->id,
                    'attendance_date' => $attDate,
                    'meeting_number' => $meetingNum,
                    'topic' => $topic,
                    'meeting_notes' => "Siswa aktif mengikuti proses belajar materi {$topic}. Seluruh target kompetensi dasar tercapai.",
                    'status' => 'final',
                    'teaching_session_status' => 'completed',
                    'finalized_at' => $attDate . ' 15:00:00',
                    'metadata' => json_encode($this->metaFlag),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $meetingNum++;

                if (count($sessionInserts) >= 1000) {
                    DB::table('lesson_attendance_sessions')->insertOrIgnore($sessionInserts);
                    $totalInserted += count($sessionInserts);
                    $sessionInserts = [];
                }
            }
        }

        if (!empty($sessionInserts)) {
            DB::table('lesson_attendance_sessions')->insertOrIgnore($sessionInserts);
            $totalInserted += count($sessionInserts);
        }

        $this->info("  ✓ Berhasil membuat {$totalInserted} sesi mengajar & jurnal guru.");
    }

    /**
     * 3. Generate daily gate attendances (attendances table)
     */
    protected function generateDailyAttendances(): void
    {
        $this->info("\n[3/8] Menghasilkan Presensi Harian Siswa (Gerbang & Sekolah)...");

        $students = DB::table('students')
            ->where('is_active', true)
            ->whereNotNull('kelas_id')
            ->select('id', 'kelas_id', 'class_id')
            ->get();

        if ($students->isEmpty()) {
            $this->warn("  ! Tidak ada siswa aktif.");
            return;
        }

        $sampleMonths = [
            7 => ['2026-07-15', '2026-07-22', '2026-07-29'],
            8 => ['2026-08-05', '2026-08-12', '2026-08-19'],
            9 => ['2026-09-02', '2026-09-09', '2026-09-16'],
            10 => ['2026-10-07', '2026-10-14', '2026-10-21'],
            11 => ['2026-11-04', '2026-11-11', '2026-11-18'],
            12 => ['2026-12-02', '2026-12-09'],
            1 => ['2027-01-06', '2027-01-13', '2027-01-20'],
            2 => ['2027-02-03', '2027-02-10', '2027-02-17'],
            3 => ['2027-03-03', '2027-03-10', '2027-03-17'],
            4 => ['2027-04-07', '2027-04-14', '2027-04-21'],
            5 => ['2027-05-05', '2027-05-12', '2027-05-19'],
            6 => ['2027-06-02', '2027-06-09'],
        ];

        $now = now();
        $inserts = [];
        $total = 0;

        foreach ($sampleMonths as $m => $dates) {
            $semId = in_array($m, [7, 8, 9, 10, 11, 12]) ? $this->semesterGanjilId : $this->semesterGenapId;

            foreach ($dates as $attDate) {
                foreach ($students as $sIdx => $st) {
                    $rand = abs(crc32($st->id . '|' . $attDate)) % 100;
                    if ($rand < 92) {
                        $status = 'HADIR';
                        $cin = $attDate . ' 06:' . str_pad((string)(45 + ($rand % 14)), 2, '0', STR_PAD_LEFT) . ':00';
                        $cout = $attDate . ' 15:' . str_pad((string)(15 + ($rand % 20)), 2, '0', STR_PAD_LEFT) . ':00';
                    } elseif ($rand < 96) {
                        $status = 'SAKIT';
                        $cin = null;
                        $cout = null;
                    } elseif ($rand < 99) {
                        $status = 'IZIN';
                        $cin = null;
                        $cout = null;
                    } else {
                        $status = 'ALPHA';
                        $cin = null;
                        $cout = null;
                    }

                    $inserts[] = [
                        'id' => Str::uuid()->toString(),
                        'academic_year_id' => $this->academicYearId,
                        'semester_id' => $semId,
                        'month' => $m,
                        'attendance_date' => $attDate,
                        'student_id' => $st->id,
                        'class_id' => $st->class_id ?: $st->kelas_id,
                        'check_in_time' => $cin,
                        'check_out_time' => $cout,
                        'status' => $status,
                        'attendance_method' => 'QRCODE',
                        'location' => 'Gerbang Utama (Scanner Auto RFID)',
                        'tipe_presensi' => 'Siswa',
                        'keterangan' => $status === 'HADIR' ? 'Tepat Waktu' : ($status === 'SAKIT' ? 'Surat Dokter' : 'Izin Keperluan Keluarga'),
                        'metadata' => json_encode($this->metaFlag),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    if (count($inserts) >= 1000) {
                        DB::table('attendances')->insertOrIgnore($inserts);
                        $total += count($inserts);
                        $inserts = [];
                    }
                }
            }
        }

        if (!empty($inserts)) {
            DB::table('attendances')->insertOrIgnore($inserts);
            $total += count($inserts);
        }

        $this->info("  ✓ Berhasil membuat {$total} baris presensi harian siswa.");
    }

    /**
     * 4. Generate LMS Materials, Assignments & Submissions
     */
    protected function generateLmsAndTasks(): void
    {
        $this->info("\n[4/8] Menghasilkan Materi & Penugasan LMS Siswa...");

        $subjects = DB::table('subjects')->where('status', true)->orWhereNull('status')->get();
        $classes = DB::table('tbl_kelas')->where('tahun_ajaran_id', $this->academicYearId)->get();
        
        // Find valid employee teacher
        $guruEmployee = DB::table('employees')->whereNotNull('id')->first();
        $firstGuruId = $guruEmployee ? $guruEmployee->id : null;

        if (!$firstGuruId || $classes->isEmpty() || $subjects->isEmpty()) {
            $this->warn("  ! Data kelas, guru pegawai, atau mata pelajaran kosong.");
            return;
        }

        $sampleTasks = [
            ['title' => 'Latihan Soal Pemahaman Bab 1', 'desc' => 'Kerjakan soal latihan mandiri pada modul halaman 15-20.'],
            ['title' => 'Proyek Analisis & Studi Kasus Lapangan', 'desc' => 'Buat resume analisis komparatif dalam format dokumen atau esai terstruktur.'],
            ['title' => 'Uji Kompetensi Tengah Semester (PTS Mandiri)', 'desc' => 'Selesaikan pertanyaan studi konsep sebelum pekan ujian berlangsung.'],
            ['title' => 'Tugas Praktik Portofolio Akhir Semester', 'desc' => 'Kumpulkan laporan portofolio pembelajaran secara terpadu.'],
        ];

        $now = now();
        $taskInserts = [];
        $totalTasks = 0;

        foreach ($classes->take(15) as $cls) {
            foreach ($subjects->take(4) as $sIdx => $sbj) {
                foreach ($sampleTasks as $tIdx => $tDef) {
                    $isGenap = $tIdx >= 2;
                    $semId = $isGenap ? $this->semesterGenapId : $this->semesterGanjilId;
                    $deadline = $isGenap ? '2027-04-15 23:59:00' : '2026-10-20 23:59:00';

                    $taskInserts[] = [
                        'id' => Str::uuid()->toString(),
                        'mata_pelajaran_id' => $sbj->id,
                        'kelas_id' => $cls->id,
                        'guru_id' => $firstGuruId,
                        'semester_id' => $semId,
                        'tahun_ajaran_id' => $this->academicYearId,
                        'judul_tugas' => $tDef['title'] . " ({$sbj->nama_mapel})",
                        'deskripsi' => $tDef['desc'],
                        'instruksi' => 'Kerjakan dengan teliti dan cantumkan sumber rujukan.',
                        'tipe_tugas' => 'online',
                        'jenis_tugas' => 'individu',
                        'nilai_maksimal' => 100,
                        'bobot_persen' => 20,
                        'deadline' => $deadline,
                        'izin_kumpul_terlambat' => true,
                        'is_published' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        foreach (array_chunk($taskInserts, 100) as $chunk) {
            DB::table('lms_penugasan')->insertOrIgnore($chunk);
            $totalTasks += count($chunk);
        }

        $this->info("  ✓ Berhasil membuat {$totalTasks} penugasan LMS.");

        // Generate student submissions for these tasks
        $this->info("  -> Mengumpulkan dan menilai tugas siswa...");
        $allTasks = DB::table('lms_penugasan')
            ->where('tahun_ajaran_id', $this->academicYearId)
            ->get();

        $students = DB::table('students')->where('is_active', true)->whereNotNull('kelas_id')->get();
        $subInserts = [];
        $totalSub = 0;

        foreach ($allTasks as $tsk) {
            $classStudents = $students->where('kelas_id', $tsk->kelas_id);
            foreach ($classStudents as $st) {
                $seed = abs(crc32($tsk->id . '|' . $st->id));
                $score = 78 + ($seed % 20); // 78 - 97

                $subInserts[] = [
                    'id' => Str::uuid()->toString(),
                    'penugasan_id' => $tsk->id,
                    'siswa_id' => $st->id,
                    'jawaban_teks' => 'Alhamdulillah telah selesai dikerjakan sesuai petunjuk dan pedoman materi pembelajaran.',
                    'status' => 'dinilai',
                    'waktu_kumpul' => $tsk->deadline,
                    'nilai_guru' => $score,
                    'catatan_guru' => 'Analisis sangat baik dan pemahaman konsep tepat. Pertahankan!',
                    'waktu_dinilai' => $now,
                    'dinilai_oleh' => $tsk->guru_id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (count($subInserts) >= 1000) {
                    DB::table('lms_pengumpulan_tugas')->insertOrIgnore($subInserts);
                    $totalSub += count($subInserts);
                    $subInserts = [];
                }
            }
        }

        if (!empty($subInserts)) {
            DB::table('lms_pengumpulan_tugas')->insertOrIgnore($subInserts);
            $totalSub += count($subInserts);
        }

        $this->info("  ✓ Berhasil mencatat {$totalSub} pengumpulan & penilaian tugas siswa.");
    }

    /**
     * 5. Generate Student Grades (student_grades) for Semester Ganjil & Genap
     */
    protected function generateGrades(): void
    {
        $this->info("\n[5/8] Menghasilkan Rekapitulasi Nilai Siswa (student_grades)...");

        $students = DB::table('students')
            ->where('is_active', true)
            ->whereNotNull('kelas_id')
            ->select('id', 'kelas_id', 'class_id')
            ->get();

        $subjects = DB::table('subjects')->where('status', true)->orWhereNull('status')->get();
        if ($subjects->isEmpty()) {
            $this->warn("  ! Data mata pelajaran tidak ditemukan.");
            return;
        }

        $semesters = [$this->semesterGanjilId, $this->semesterGenapId];
        $now = now();
        $inserts = [];
        $total = 0;

        foreach ($semesters as $semId) {
            foreach ($students as $st) {
                foreach ($subjects->take(8) as $sbj) {
                    $seed = abs(crc32($st->id . '|' . $sbj->id . '|' . $semId));
                    $tugas = 75 + ($seed % 22);
                    $kuis = 74 + (($seed >> 2) % 23);
                    $proyek = 78 + (($seed >> 4) % 20);
                    $pts = 72 + (($seed >> 6) % 25);
                    $pas = 76 + (($seed >> 8) % 22);

                    $final = round(($tugas * 0.20) + ($kuis * 0.15) + ($proyek * 0.20) + ($pts * 0.20) + ($pas * 0.25), 2);
                    $letter = $final >= 90 ? 'A' : ($final >= 80 ? 'B' : ($final >= 70 ? 'C' : 'D'));

                    $inserts[] = [
                        'id' => Str::uuid()->toString(),
                        'student_id' => $st->id,
                        'subject_id' => $sbj->id,
                        'academic_year_id' => $this->academicYearId,
                        'semester_id' => $semId,
                        'kelas_id' => $st->kelas_id,
                        'class_id' => $st->class_id ?: $st->kelas_id,
                        'score_assignment' => $tugas,
                        'score_quiz' => $kuis,
                        'score_project' => $proyek,
                        'score_midterm' => $pts,
                        'score_final' => $pas,
                        'final_score' => $final,
                        'grade_letter' => $letter,
                        'is_passed' => $final >= 75,
                        'notes' => 'Tuntas dengan capaian kompetensi memuaskan.',
                        'metadata' => json_encode($this->metaFlag),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    if (count($inserts) >= 1000) {
                        DB::table('student_grades')->insertOrIgnore($inserts);
                        $total += count($inserts);
                        $inserts = [];
                    }
                }
            }
        }

        if (!empty($inserts)) {
            DB::table('student_grades')->insertOrIgnore($inserts);
            $total += count($inserts);
        }

        $this->info("  ✓ Berhasil membuat {$total} baris nilai siswa (student_grades).");
    }

    /**
     * 6. Generate e-Rapor Digital (lms_rapor)
     */
    protected function generateRapor(): void
    {
        $this->info("\n[6/8] Menerbitkan Buku e-Rapor Digital Siswa (lms_rapor)...");

        $guruEmployee = DB::table('employees')->whereNotNull('id')->first();
        $defaultGuruWali = $guruEmployee ? $guruEmployee->id : null;

        $students = DB::table('students')
            ->where('is_active', true)
            ->whereNotNull('kelas_id')
            ->select('id', 'kelas_id')
            ->get();

        $semesters = [
            $this->semesterGanjilId => '2026-12-18',
            $this->semesterGenapId => '2027-06-18',
        ];

        $now = now();
        $inserts = [];
        $total = 0;

        foreach ($semesters as $semId => $terbitDate) {
            $byClass = $students->groupBy('kelas_id');

            foreach ($byClass as $kelasId => $classStudents) {
                $totalSiswa = count($classStudents);
                $rankedList = [];

                foreach ($classStudents as $st) {
                    $grades = DB::table('student_grades')
                        ->where('student_id', $st->id)
                        ->where('academic_year_id', $this->academicYearId)
                        ->where('semester_id', $semId)
                        ->pluck('final_score');

                    $avg = $grades->count() > 0 ? round($grades->avg(), 2) : 83.50;
                    $sum = $grades->count() > 0 ? round($grades->sum(), 2) : 668.00;

                    $rankedList[] = [
                        'student_id' => $st->id,
                        'avg' => $avg,
                        'sum' => $sum,
                        'total_mapel' => $grades->count() ?: 8,
                    ];
                }

                usort($rankedList, fn($a, $b) => $b['avg'] <=> $a['avg']);

                foreach ($rankedList as $rankIdx => $rItem) {
                    $rank = $rankIdx + 1;

                    $inserts[] = [
                        'id' => Str::uuid()->toString(),
                        'siswa_id' => $rItem['student_id'],
                        'kelas_id' => $kelasId,
                        'semester_id' => $semId,
                        'tahun_ajaran_id' => $this->academicYearId,
                        'guru_wali_id' => $defaultGuruWali,
                        'total_nilai' => $rItem['sum'],
                        'rata_rata' => $rItem['avg'],
                        'peringkat_kelas' => $rank,
                        'total_siswa_kelas' => $totalSiswa,
                        'total_mapel' => $rItem['total_mapel'],
                        'mapel_lulus' => $rItem['total_mapel'],
                        'mapel_tidak_lulus' => 0,
                        'total_hari_efektif' => 105,
                        'total_hadir' => 98 + ($rank % 6),
                        'total_izin' => 1,
                        'total_sakit' => 1,
                        'total_alpha' => 0,
                        'catatan_wali_kelas' => 'Alhamdulillah, ananda menunjukkan etos belajar yang istiqomah serta adab yang mulia. Pertahankan!',
                        'catatan_kepala_sekolah' => 'Prestasi yang membanggakan. Teruslah berkarya dan bertumbuh menjadi generasi sholeh berprestasi.',
                        'status_rapor' => 'diterbitkan',
                        'tanggal_terbit' => $terbitDate,
                        'sudah_dilihat_ortu' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    if (count($inserts) >= 500) {
                        DB::table('lms_rapor')->insertOrIgnore($inserts);
                        $total += count($inserts);
                        $inserts = [];
                    }
                }
            }
        }

        if (!empty($inserts)) {
            DB::table('lms_rapor')->insertOrIgnore($inserts);
            $total += count($inserts);
        }

        $this->info("  ✓ Berhasil menerbitkan {$total} buku e-Rapor digital lengkap dengan peringkat kelas.");
    }

    /**
     * 7. Generate Tahfizh Daily Logs & Mutabaah
     */
    protected function generateTahfizhAndMutabaah(): void
    {
        $this->info("\n[7/8] Menghasilkan Catatan Tahfizh Quran & Mutabaah Ibadah 1 Tahun...");

        $students = DB::table('students')
            ->where('is_active', true)
            ->whereNotNull('kelas_id')
            ->select('id', 'kelas_id', 'class_id')
            ->get();

        $guruEmployee = DB::table('employees')->whereNotNull('id')->first();
        $defaultTeacher = $guruEmployee ? $guruEmployee->id : null;

        $tpl = DB::table('mutabaah_templates')->first();
        $sup = DB::table('mutabaah_supervisor_assignments')->first();
        $edu = DB::table('education_units')->first();

        $tplId = $tpl ? $tpl->id : null;
        $supId = $sup ? $sup->id : null;
        $eduId = $edu ? $edu->id : null;

        $surahs = [
            ['no' => 78, 'name' => "An-Naba'", 'ayat' => 40],
            ['no' => 79, 'name' => "An-Nazi'at", 'ayat' => 46],
            ['no' => 80, 'name' => "'Abasa", 'ayat' => 42],
            ['no' => 81, 'name' => 'At-Takwir', 'ayat' => 29],
            ['no' => 82, 'name' => 'Al-Infitar', 'ayat' => 19],
            ['no' => 83, 'name' => 'Al-Muthaffifin', 'ayat' => 36],
            ['no' => 84, 'name' => 'Al-Insyiqaq', 'ayat' => 25],
            ['no' => 85, 'name' => 'Al-Buruj', 'ayat' => 22],
            ['no' => 86, 'name' => 'At-Tariq', 'ayat' => 17],
            ['no' => 87, 'name' => "Al-A'la", 'ayat' => 19],
        ];

        $dates = [
            '2026-07-24', '2026-08-21', '2026-09-25', '2026-10-23', '2026-11-20', '2026-12-11',
            '2027-01-22', '2027-02-19', '2027-03-19', '2027-04-23', '2027-05-21', '2027-06-11'
        ];

        $now = now();
        $tahfizhInserts = [];
        $mutabaahInserts = [];
        $totalTahfizh = 0;
        $totalMutabaah = 0;

        foreach ($dates as $dIdx => $logDate) {
            $isGenap = $dIdx >= 6;
            $semId = $isGenap ? $this->semesterGenapId : $this->semesterGanjilId;
            $sData = $surahs[$dIdx % count($surahs)];

            foreach ($students as $st) {
                $tahfizhInserts[] = [
                    'id' => Str::uuid()->toString(),
                    'academic_year_id' => $this->academicYearId,
                    'semester_id' => $semId,
                    'class_id' => $st->class_id ?: $st->kelas_id,
                    'student_id' => $st->id,
                    'teacher_id' => $defaultTeacher,
                    'record_date' => $logDate,
                    'day_name' => 'Jumat',
                    'tilawah_text' => 'Juz 30 (Halaman ' . (580 + ($dIdx * 2)) . ')',
                    'tilawah_baris' => 15,
                    'hafalan_surah_number' => $sData['no'],
                    'hafalan_surah_name' => $sData['name'],
                    'hafalan_ayah_start' => 1,
                    'hafalan_ayah_end' => min(15, $sData['ayat']),
                    'hafalan_baris' => 15,
                    'murajaah_text' => 'Surah ' . $sData['name'],
                    'murajaah_lembar' => 2.0,
                    'notes_teacher' => 'Makharijul huruf fasih, tajwid dan kelancaran sangat baik (Mumtaz).',
                    'notes_parent' => 'Alhamdulillah setoran hafalan lancar di rumah.',
                    'status' => 'submitted',
                    'metadata' => json_encode($this->metaFlag),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if ($tplId && $supId && $eduId) {
                    $mutabaahInserts[] = [
                        'id' => Str::uuid()->toString(),
                        'student_id' => $st->id,
                        'template_id' => $tplId,
                        'supervisor_assignment_id' => $supId,
                        'education_unit_id' => $eduId,
                        'kelas_id' => $st->kelas_id,
                        'academic_year_id' => $this->academicYearId,
                        'semester_id' => $semId,
                        'activity_date' => $logDate,
                        'status' => 'finalized',
                        'score' => 95.00,
                        'supervisor_notes' => '[SIMULASI TA 2026/2027] Ibadah harian terlaksana dengan istiqomah dan mandiri.',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                if (count($tahfizhInserts) >= 1000) {
                    DB::table('tahfizh_daily_logs')->insertOrIgnore($tahfizhInserts);
                    $totalTahfizh += count($tahfizhInserts);
                    $tahfizhInserts = [];
                }

                if (count($mutabaahInserts) >= 1000) {
                    DB::table('mutabaah_daily_headers')->insertOrIgnore($mutabaahInserts);
                    $totalMutabaah += count($mutabaahInserts);
                    $mutabaahInserts = [];
                }
            }
        }

        if (!empty($tahfizhInserts)) {
            DB::table('tahfizh_daily_logs')->insertOrIgnore($tahfizhInserts);
            $totalTahfizh += count($tahfizhInserts);
        }

        if (!empty($mutabaahInserts)) {
            DB::table('mutabaah_daily_headers')->insertOrIgnore($mutabaahInserts);
            $totalMutabaah += count($mutabaahInserts);
        }

        $this->info("  ✓ Berhasil membuat {$totalTahfizh} log tahfizh Quran.");
        $this->info("  ✓ Berhasil membuat {$totalMutabaah} rekap mutabaah harian.");
    }

    /**
     * 8. Generate Financial Data (Fee Categories, Monthly SPP Bills & Payments)
     */
    protected function generateFinanceSpp(): void
    {
        $this->info("\n[8/8] Menghasilkan Data Keuangan & Tagihan SPP Bulanan (12 Bulan)...");

        $feeCatId = Str::uuid()->toString();
        DB::table("fee_categories")->insertOrIgnore([
            "id" => $feeCatId,
            "code" => "SPP-SYARIAH",
            "name" => "SPP Bulanan Syariah",
            "is_recurring" => true,
            "default_amount" => 500000,
            "description" => "Iuran pembinaan pendidikan bulanan terpadu.",
            "metadata" => json_encode($this->metaFlag),
            "created_at" => now(),
            "updated_at" => now(),
        ]);

        $existingCat = DB::table("fee_categories")->where("code", "SPP-SYARIAH")->first();
        $targetFeeCatId = $existingCat ? $existingCat->id : $feeCatId;

        $students = DB::table("students")->where("is_active", true)->select("id")->get();
        if ($students->isEmpty()) {
            $this->warn("  ! Tidak ada siswa aktif.");
            return;
        }

        $months = [
            ["name" => "Juli 2026", "due" => "2026-07-10", "paid" => true],
            ["name" => "Agustus 2026", "due" => "2026-08-10", "paid" => true],
            ["name" => "September 2026", "due" => "2026-09-10", "paid" => true],
            ["name" => "Oktober 2026", "due" => "2026-10-10", "paid" => true],
            ["name" => "November 2026", "due" => "2026-11-10", "paid" => true],
            ["name" => "Desember 2026", "due" => "2026-12-10", "paid" => true],
            ["name" => "Januari 2027", "due" => "2027-01-10", "paid" => true],
            ["name" => "Februari 2027", "due" => "2027-02-10", "paid" => true],
            ["name" => "Maret 2027", "due" => "2027-03-10", "paid" => true],
            ["name" => "April 2027", "due" => "2027-04-10", "paid" => true],
            ["name" => "Mei 2027", "due" => "2027-05-10", "paid" => true],
            ["name" => "Juni 2027", "due" => "2027-06-10", "paid" => false],
        ];

        $now = now();
        $bills = [];
        $payments = [];
        $totalBills = 0;
        $totalPayments = 0;

        foreach ($months as $mIdx => $mDef) {
            foreach ($students as $sIdx => $st) {
                $billId = Str::uuid()->toString();
                $isPaid = $mDef["paid"] || ($sIdx % 10 < 8);
                $status = $isPaid ? "paid" : "unpaid";

                $bills[] = [
                    "id" => $billId,
                    "student_id" => $st->id,
                    "fee_category_id" => $targetFeeCatId,
                    "academic_year_id" => $this->academicYearId,
                    "title" => "SPP Bulan {$mDef["name"]}",
                    "amount" => 500000.00,
                    "due_date" => $mDef["due"],
                    "status" => $status,
                    "metadata" => json_encode($this->metaFlag),
                    "created_at" => $now,
                    "updated_at" => $now,
                ];

                if ($isPaid) {
                    $payments[] = [
                        "id" => Str::uuid()->toString(),
                        "bill_id" => $billId,
                        "invoice_number" => "INV/" . str_replace("-", "", $mDef["due"]) . "/" . strtoupper(substr(md5($billId), 0, 6)),
                        "payment_method" => ($sIdx % 2 === 0) ? "TRANSFER_BSI" : "QRIS",
                        "paid_amount" => 500000.00,
                        "paid_at" => $mDef["due"] . " 09:30:00",
                        "metadata" => json_encode($this->metaFlag),
                        "created_at" => $now,
                        "updated_at" => $now,
                    ];
                }
            }
        }

        // Insert all bills first to satisfy foreign keys
        foreach (array_chunk($bills, 1000) as $chunk) {
            DB::table("student_bills")->insertOrIgnore($chunk);
            $totalBills += count($chunk);
        }

        // Insert payments after bills exist
        foreach (array_chunk($payments, 1000) as $chunk) {
            DB::table("bill_payments")->insertOrIgnore($chunk);
            $totalPayments += count($chunk);
        }

        $this->info("  ✓ Berhasil membuat {$totalBills} tagihan SPP bulanan.");
        $this->info("  ✓ Berhasil mencatat {$totalPayments} kwitansi pelunasan pembayaran SPP.");
    }
}