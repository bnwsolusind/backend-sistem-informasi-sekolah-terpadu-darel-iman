<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

echo "=== MEMULAI SIMULASI OPERASIONAL TERPADU ===" . PHP_EOL;

// 1. Dapatkan Actor & Target Data
$teacherUser = DB::table('users')->where('email', 'ahmad.farhan@dareliman.sch.id')->first();
$teacherEmployee = DB::table('employees')->where('email', 'ahmad.farhan@dareliman.sch.id')->first()
    ?? DB::table('employees')->where('user_id', $teacherUser->id)->first();
$teacherRecord = DB::table('teachers')->where('employee_id', $teacherEmployee->id)->first();

$parentUser = DB::table('users')->where('email', 'ahmad.fauzi@parent.local')->first();
$parent = DB::table('parents')->where('user_id', $parentUser->id)->first();

$studentZaky = DB::table('students')->where('id', '019fe0a0-39b5-72da-9e5e-c1f1419e7d52')->first();
$class6A = DB::table('classes')->where('id', '361eb193-ed25-44d0-9ffb-e6512ac061d0')->first();
$tblKelas6A = DB::table('tbl_kelas')->where('id', '019fe0a0-3882-702a-8e64-1e51b51a8479')->first();

$ay = DB::table('academic_years')->where('id', '019fe0a0-3e81-73ce-924b-62b4362d7491')->first();
$sem = DB::table('semesters')->where('id', '019fe0a0-3e83-728f-a378-b58ea28d3223')->first();
$subjectArabic = DB::table('subjects')->where('id', '019fe0a0-3e4f-7219-9240-13060d3b0d3f')->first();
$kurikulum = DB::table('master_kurikulum')->first();

echo "Guru: {$teacherUser->name} ({$teacherUser->email})" . PHP_EOL;
echo "Orang Tua: {$parentUser->name} ({$parentUser->email})" . PHP_EOL;
echo "Siswa: {$studentZaky->full_name} (NIS: {$studentZaky->nis}, Kelas: {$class6A->name})" . PHP_EOL;
echo "Mata Pelajaran: {$subjectArabic->name}" . PHP_EOL;
echo "Tahun Ajaran: {$ay->name} ({$sem->name})" . PHP_EOL;

DB::beginTransaction();
try {
    // 2. Setup Jadwal Pelajaran (Schedule) di Kelas 6A untuk Ahmad Farhan
    $existingSchedule = DB::table('class_schedules')
        ->where('employee_id', $teacherEmployee->id)
        ->where('kelas_id', $tblKelas6A->id)
        ->where('subject_id', $subjectArabic->id)
        ->where('day_of_week', 3)
        ->first();

    if (! $existingSchedule) {
        $scheduleId = (string) Str::uuid();
        DB::table('class_schedules')->insert([
            'id' => $scheduleId,
            'kelas_id' => $tblKelas6A->id,
            'class_id' => $class6A->id,
            'employee_id' => $teacherEmployee->id,
            'teacher_id' => $teacherRecord?->id,
            'subject_id' => $subjectArabic->id,
            'academic_year_id' => $ay->id,
            'semester_id' => $sem->id,
            'day_of_week' => 3, // Rabu
            'time_start' => '08:00:00',
            'time_end' => '09:30:00',
            'week_type' => 'all',
            'is_active' => true,
            'metadata' => json_encode(['room' => 'Ruang Belajar Kelas 6A', 'source' => 'SimulasiTerpadu']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Jadwal Pelajaran Kelas 6A Bahasa Arab (Rabu 08:00-09:30) berhasil dibuat ID: {$scheduleId}" . PHP_EOL;
    } else {
        $scheduleId = $existingSchedule->id;
        echo "[OK] Jadwal Pelajaran sudah ada ID: {$scheduleId}" . PHP_EOL;
    }

    // 3. Setup Modul Ajar (LMS Modul Ajar)
    $modul = DB::table('lms_modul_ajar')
        ->where('guru_id', $teacherEmployee->id)
        ->where('mata_pelajaran_id', $subjectArabic->id)
        ->where('kelas_id', $tblKelas6A->id)
        ->first();

    if (! $modul) {
        $modulId = (string) Str::uuid();
        DB::table('lms_modul_ajar')->insert([
            'id' => $modulId,
            'kurikulum_id' => $kurikulum->id,
            'mata_pelajaran_id' => $subjectArabic->id,
            'guru_id' => $teacherEmployee->id,
            'kelas_id' => $tblKelas6A->id,
            'rombel_id' => $tblKelas6A->id,
            'semester_id' => $sem->id,
            'tahun_ajaran_id' => $ay->id,
            'judul_modul' => 'Modul 1: At-Ta\'aruf wa Al-Hiwar Al-Yaumi (Perkenalan & Percakapan)',
            'tujuan_pembelajaran' => 'Peserta didik mampu melakukan percakapan ta\'aruf dengan makharijul huruf tepat dan mengidentifikasi kata sapaan bahasa Arab.',
            'alokasi_waktu_jp' => 4,
            'model_pembelajaran' => 'Tatap Muka & Praktik Mandiri',
            'metode_pembelajaran' => 'Diskusi, Demonstrasi, Penugasan Praktik',
            'status' => 'published',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Modul Ajar LMS berhasil dibuat ID: {$modulId}" . PHP_EOL;
    } else {
        $modulId = $modul->id;
        echo "[OK] Modul Ajar LMS sudah ada ID: {$modulId}" . PHP_EOL;
    }

    // 4. Setup Materi Pembelajaran (LMS Materi)
    $materi = DB::table('lms_materi')
        ->where('modul_ajar_id', $modulId)
        ->where('judul', 'like', '%At-Ta\'aruf%')
        ->whereNull('deleted_at')
        ->first();

    if (! $materi) {
        $materiId = (string) Str::uuid();
        DB::table('lms_materi')->insert([
            'id' => $materiId,
            'modul_ajar_id' => $modulId,
            'mata_pelajaran_id' => $subjectArabic->id,
            'guru_id' => $teacherEmployee->id,
            'judul' => 'Pekan 01: At-Ta\'aruf - Kosakata dan Ungkapan Percakapan Bahasa Arab di Sekolah',
            'konten' => 'Masmuka? Kaifa haluk? Ana thalibun jadid fil fasli as-sadiis.',
            'tipe_materi' => 'dokumen',
            'urutan' => 1,
            'is_published' => true,
            'tanggal_publish' => now()->subHours(2),
            'status' => 'published',
            'tipe' => 'pdf',
            'isi' => "# At-Ta'aruf: Percakapan Bahasa Arab Sehari-hari\n\n**Mata Pelajaran**: Bahasa Arab | **Kelas**: 6A\n\n### Mufradat Utama:\n1. Masmuka? (Siapa namamu? - Laki-laki)\n2. Masmuki? (Siapa namamu? - Perempuan)\n3. Ismi Ahmad Zaky (Namaku Ahmad Zaky)\n4. Kaifa haluk? (Bagaimana kabarmu?)\n5. Ana bi khoirin walhamdulillah (Saya baik-baik saja, alhamdulillah)\n\n### Kaidah Nahwu Dasar:\nPengenalan kata ganti (dhamir munfashil) dan struktur kalimat tanya sederhana.",
            'file' => '/storage/lms/materi/modul_bahasa_arab_6a.pdf',
            'catatan' => 'Materi resmi pembelajaran Bahasa Arab Kelas 6A Semester Ganjil 2026/2027.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Materi Pembelajaran LMS berhasil dibuat ID: {$materiId}" . PHP_EOL;
    } else {
        $materiId = $materi->id;
        echo "[OK] Materi Pembelajaran LMS sudah ada ID: {$materiId}" . PHP_EOL;
    }

    // 5. Setup Penugasan (LMS Assignment)
    $assignment = DB::table('lms_penugasan')
        ->where('guru_id', $teacherEmployee->id)
        ->where('kelas_id', $tblKelas6A->id)
        ->where('judul_tugas', 'like', '%Percakapan Bahasa Arab%')
        ->whereNull('deleted_at')
        ->first();

    if (! $assignment) {
        $assignmentId = (string) Str::uuid();
        DB::table('lms_penugasan')->insert([
            'id' => $assignmentId,
            'mata_pelajaran_id' => $subjectArabic->id,
            'kelas_id' => $tblKelas6A->id,
            'guru_id' => $teacherEmployee->id,
            'semester_id' => $sem->id,
            'tahun_ajaran_id' => $ay->id,
            'modul_ajar_id' => $modulId,
            'judul_tugas' => 'Tugas 1: Percakapan Bahasa Arab (Ta\'aruf) & Mufradat Harian',
            'deskripsi' => 'Tuliskan dialog ta\'aruf singkat antara dua orang murid baru dan sebutkan 5 mufradat yang dipelajari.',
            'instruksi' => 'Ketikkan jawaban teks dialog atau unggah rekaman audio/dokumen pendukung melalui LMS.',
            'tipe_tugas' => 'mandiri',
            'jenis_tugas' => 'individu',
            'nilai_maksimal' => 100,
            'bobot_persen' => 20,
            'tanggal_mulai' => now()->startOfDay(),
            'deadline' => now()->addDays(7)->endOfDay(),
            'izin_kumpul_terlambat' => true,
            'is_published' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Penugasan LMS berhasil dibuat ID: {$assignmentId}" . PHP_EOL;
    } else {
        $assignmentId = $assignment->id;
        echo "[OK] Penugasan LMS sudah ada ID: {$assignmentId}" . PHP_EOL;
    }

    // 6. Setup Pengumpulan Tugas oleh Ahmad Zaky & Penilaian Guru
    $submission = DB::table('lms_pengumpulan_tugas')
        ->where('penugasan_id', $assignmentId)
        ->where('siswa_id', $studentZaky->id)
        ->first();

    if (! $submission) {
        $submissionId = (string) Str::uuid();
        DB::table('lms_pengumpulan_tugas')->insert([
            'id' => $submissionId,
            'penugasan_id' => $assignmentId,
            'siswa_id' => $studentZaky->id,
            'jawaban_teks' => "Bismillah ustadz, berikut dialog ta'aruf saya:\n\nAhmad: Assalamu'alaikum ya akhi.\nZaid: Wa'alaikumussalam warahmatullah.\nAhmad: Masmuka?\nZaid: Ismi Zaid, wa anta masmuka?\nAhmad: Ismi Ahmad Zaky. Kaifa haluk?\nZaid: Bi khoirin walhamdulillah.\n\n5 Mufradat:\n1. Tholibun (Siswa)\n2. Faslun (Kelas)\n3. Ustadzun (Guru)\n4. Kitabun (Buku)\n5. Qolamun (Pena)",
            'status' => 'dinilai',
            'waktu_kumpul' => now()->subHours(3),
            'nilai_guru' => 95,
            'catatan_guru' => "Mumtaz barakallahu fiik ananda Ahmad Zaky! Susunan kalimat sangat rapi, makhraj dan kaidah nahwu diterapkan dengan tepat.",
            'waktu_dinilai' => now()->subHour(),
            'dinilai_oleh' => $teacherEmployee->id,
            'created_at' => now()->subHours(3),
            'updated_at' => now()->subHour(),
        ]);
        echo "[OK] Pengumpulan Tugas & Penilaian (Nilai: 95) berhasil disimpan ID: {$submissionId}" . PHP_EOL;
    } else {
        DB::table('lms_pengumpulan_tugas')->where('id', $submission->id)->update([
            'status' => 'dinilai',
            'nilai_guru' => 95,
            'catatan_guru' => "Mumtaz barakallahu fiik ananda Ahmad Zaky! Susunan kalimat sangat rapi, makhraj dan kaidah nahwu diterapkan dengan tepat.",
            'waktu_dinilai' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Pengumpulan Tugas diperbarui dengan Nilai 95 ID: {$submission->id}" . PHP_EOL;
    }

    // 7. Setup Presensi Harian (Attendances) Hari Ini untuk Ahmad Zaky
    $todayDate = '2026-09-09';
    $att = DB::table('attendances')
        ->where('student_id', $studentZaky->id)
        ->where('attendance_date', $todayDate)
        ->first();

    if (! $att) {
        $attId = (string) Str::uuid();
        DB::table('attendances')->insert([
            'id' => $attId,
            'academic_year_id' => $ay->id,
            'semester_id' => $sem->id,
            'month' => 9,
            'attendance_date' => $todayDate,
            'student_id' => $studentZaky->id,
            'class_id' => $class6A->id,
            'check_in_time' => "{$todayDate} 07:05:00+07",
            'status' => 'Hadir',
            'attendance_method' => 'RFID',
            'tipe_presensi' => 'gerbang',
            'keterangan' => 'Tiba di sekolah pukul 07.05 WIB dengan tertib.',
            'created_at' => "{$todayDate} 07:05:00+07",
            'updated_at' => "{$todayDate} 07:05:00+07",
        ]);
        echo "[OK] Presensi Gerbang (Hadir 07:05 WIB) berhasil dicatat ID: {$attId}" . PHP_EOL;
    } else {
        echo "[OK] Presensi Gerbang hari ini sudah ada ID: {$att->id}" . PHP_EOL;
    }

    // 8. Setup Presensi Kelas Pelajaran Bahasa Arab (LMS Presensi)
    $lmsPresensi = DB::table('lms_presensi')
        ->where('jadwal_pelajaran_id', $scheduleId)
        ->where('siswa_id', $studentZaky->id)
        ->where('tanggal', $todayDate)
        ->first();

    if (! $lmsPresensi) {
        $lpId = (string) Str::uuid();
        DB::table('lms_presensi')->insert([
            'id' => $lpId,
            'jadwal_pelajaran_id' => $scheduleId,
            'siswa_id' => $studentZaky->id,
            'tanggal' => $todayDate,
            'status_hadir' => 'Hadir',
            'keterangan' => 'Hadir aktif di kelas Bahasa Arab',
            'pertemuan_ke' => 1,
            'waktu_presensi' => "{$todayDate} 08:05:00+07",
            'recorded_method' => 'guru',
            'recorded_by' => $teacherEmployee->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Presensi KBM Bahasa Arab (Hadir 08:05 WIB) berhasil dicatat ID: {$lpId}" . PHP_EOL;
    } else {
        echo "[OK] Presensi KBM Bahasa Arab sudah ada ID: {$lmsPresensi->id}" . PHP_EOL;
    }

    // 9. Setup Tahfizh Harian (Tahfizh Daily Log)
    $tahfizhLog = DB::table('tahfizh_daily_logs')
        ->where('student_id', $studentZaky->id)
        ->where('record_date', $todayDate)
        ->first();

    if (! $tahfizhLog) {
        $tfId = (string) Str::uuid();
        DB::table('tahfizh_daily_logs')->insert([
            'id' => $tfId,
            'academic_year_id' => $ay->id,
            'semester_id' => $sem->id,
            'class_id' => $class6A->id,
            'student_id' => $studentZaky->id,
            'teacher_id' => $teacherEmployee->id,
            'record_date' => $todayDate,
            'day_name' => 'Rabu',
            'hafalan_surah_number' => 78,
            'hafalan_surah_name' => 'An-Naba',
            'hafalan_ayah_start' => 1,
            'hafalan_ayah_end' => 25,
            'hafalan_baris' => 20,
            'murajaah_text' => 'Juz 30 (Surah An-Nas s.d Al-Infitar)',
            'murajaah_lembar' => '5.00',
            'status' => 'lancar',
            'notes_teacher' => 'Alhamdulillah hafalan sangat mutqin, makharijul huruf tepat, dan tajwid dengung terjaga dengan baik.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Setoran Tahfizh Surah An-Naba 1-25 (Lancar) berhasil dicatat ID: {$tfId}" . PHP_EOL;
    } else {
        echo "[OK] Setoran Tahfizh hari ini sudah ada ID: {$tahfizhLog->id}" . PHP_EOL;
    }

    // 10. Setup Catatan Karakter / Perkembangan Siswa (Student Notes)
    $teacherIdForNotes = $teacherRecord ? $teacherRecord->id : $teacherEmployee->id;
    $note = DB::table('student_notes')
        ->where('student_id', $studentZaky->id)
        ->where('teacher_id', $teacherIdForNotes)
        ->where('date', $todayDate)
        ->first();

    if (! $note) {
        $noteId = (string) Str::uuid();
        DB::table('student_notes')->insert([
            'id' => $noteId,
            'student_id' => $studentZaky->id,
            'teacher_id' => $teacherIdForNotes,
            'academic_year_id' => $ay->id,
            'semester_id' => $sem->id,
            'date' => $todayDate,
            'category' => 'akademik_karakter',
            'title' => 'Apresiasi Keaktifan & Adab Belajar Bahasa Arab',
            'content' => 'Ananda Ahmad Zaky menunjukkan adab islami yang sangat terpuji dalam KBM Bahasa Arab, aktif berpartisipasi serta membimbing rekannya dalam praktik percakapan.',
            'note' => 'Ananda Ahmad Zaky menunjukkan adab islami yang sangat terpuji dalam KBM Bahasa Arab, aktif berpartisipasi serta membimbing rekannya dalam praktik percakapan.',
            'priority' => 'normal',
            'visible_to_parent' => true,
            'visible_to_student' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Catatan Karakter Siswa dari Guru ke Orang Tua berhasil dibuat ID: {$noteId}" . PHP_EOL;
    } else {
        echo "[OK] Catatan Karakter Siswa sudah ada ID: {$note->id}" . PHP_EOL;
    }

    // 11. Setup Mutaba'ah Yaumiyyah (Amalan Harian Santri)
    $mutabaah = DB::table('mutabaah_daily_headers')
        ->where('student_id', $studentZaky->id)
        ->where('activity_date', $todayDate)
        ->first();

    if (! $mutabaah) {
        $mutId = (string) Str::uuid();
        $template = DB::table('mutabaah_templates')->first();
        $sa = DB::table('mutabaah_supervisor_assignments')
            ->where('kelas_id', $tblKelas6A->id)
            ->first() ?? DB::table('mutabaah_supervisor_assignments')->first();

        DB::table('mutabaah_daily_headers')->insert([
            'id' => $mutId,
            'student_id' => $studentZaky->id,
            'kelas_id' => $tblKelas6A->id,
            'academic_year_id' => $ay->id,
            'semester_id' => $sem->id,
            'template_id' => $template?->id,
            'supervisor_assignment_id' => $sa?->id,
            'education_unit_id' => $sa?->education_unit_id,
            'activity_date' => $todayDate,
            'status' => 'finalized',
            'total_items' => 5,
            'good_count' => 5,
            'less_count' => 0,
            'not_done_count' => 0,
            'na_count' => 0,
            'score' => '100.00',
            'supervisor_notes' => 'Shalat 5 waktu berjamaah di masjid, Dhuha 4 rakaat, Tilawah 2 \'ain, Dzikir Pagi Petang terlaksana dengan tertib.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "[OK] Mutaba'ah Yaumiyyah (Score: 100) berhasil dicatat ID: {$mutId}" . PHP_EOL;
    } else {
        echo "[OK] Mutaba'ah Yaumiyyah hari ini sudah ada ID: {$mutabaah->id}" . PHP_EOL;
    }

    DB::commit();
    echo "=== SIMULASI BERHASIL DISIMPAN SECARA KONSISTEN ===" . PHP_EOL;
} catch (\Throwable $e) {
    DB::rollBack();
    echo "[FAIL] Terjadi kesalahan: " . $e->getMessage() . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
}
