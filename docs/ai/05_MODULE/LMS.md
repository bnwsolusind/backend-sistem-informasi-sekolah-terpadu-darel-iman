# MODULE: LMS (LEARNING MANAGEMENT SYSTEM)

Bukti historis: `99_ARCHIVE/ACADEMIC_LMS_FLOW.md`, `99_ARCHIVE/LEARNING_CONTENT_FLOW.md`, `99_ARCHIVE/LEARNING_MEDIA_OWNERSHIP.md`, `99_ARCHIVE/LEARNING_REFERENCE_FLOW.md`, `99_ARCHIVE/LEARNING_ACTIVITY_FLOW.md`, `99_ARCHIVE/ASSIGNMENT_FLOW.md`, `99_ARCHIVE/SUBMISSION_FLOW.md`, `99_ARCHIVE/QUESTION_BANK_FLOW.md`, `99_ARCHIVE/EXAM_BLUEPRINT_FLOW.md`, `99_ARCHIVE/CBT_FLOW.md`, `99_ARCHIVE/CBT_ATTEMPT_STATE_MACHINE.md`, `99_ARCHIVE/CBT_SECURITY_MODEL.md`, `99_ARCHIVE/CLASS_DISCUSSION_FLOW.md`.

## Komponen Modul

1. **Materi**: `lms_modul_ajar`, `lms_materi`, `lms_media`, `lms_referensi`, `lms_aktivitas_belajar`, `lms_diskusi` — ownership terikat guru/penugasan mengajar.
2. **Penugasan**: `lms_penugasan` (published) + `submissions` (LmsPengumpulanTugas) — submit dari portal siswa.
3. **Bank Soal & CBT**: `lms_bank_soal` (kunci/pembahasan redact untuk siswa/ortu), kisi-kisi, `lms_ujians`, `lms_ujian_sesis`, submit answers, timer ditegakkan, scoreboard staff-only.
4. **Penilaian**: grade → rapor (lihat AKADEMIK.md).

## CBT Security Model

- Redact `kunci_jawaban`/`pasangan_menjodohkan`/`pembahasan` untuk role Siswa/Orang Tua/Alumni.
- Start session: non-siswa wajib staff + `siswa_id` eksplisit; gate jadwal & `max_attempt`; tanpa fallback `Student::first()`.
- Submit answers fail-closed untuk semua; penilaian essay staff-only.
- Nilai final di-redact sampai `tampilkan_nilai_langsung=true`.
- Timer ditegakkan (`saveJawabanSesi` menolak setelah deadline `durasi_menit`).
- Detail state machine & timeout scheduler: `99_ARCHIVE/CBT_ATTEMPT_STATE_MACHINE.md`, `99_ARCHIVE/CBT_TIMEOUT_SCHEDULER_FLOW.md`.

## Alur Presensi Pembelajaran

Jadwal (ClassSchedule) → pertemuan (LessonAttendanceSession) → `lms_presensi` → validasi pengajaran & anggota rombel → rekap + cache invalidation → sync dashboard/portal.

## Referensi

- Detail arsip: `99_ARCHIVE/LMS_*`, `99_ARCHIVE/CBT_*`, `99_ARCHIVE/QUESTION_BANK_FLOW.md`, `99_ARCHIVE/EXAM_BLUEPRINT_FLOW.md`, `99_ARCHIVE/GRADE_*`
- API: `06_API/API_CONTRACT.md`
