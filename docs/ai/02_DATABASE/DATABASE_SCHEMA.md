# DATABASE SCHEMA

Ringkasan tabel/model/relasi inti. Detail historis: `99_ARCHIVE/02-audit-model-relations.md`, `99_ARCHIVE/DATABASE_RELATION_AUDIT.md`, `99_ARCHIVE/academic-lms-data-relations.md`.

## Auth & Identity

| Tabel | Model | Catatan |
|---|---|---|
| `users` | `User` | PK `id` (bigint), `name`, `email`, `password` (hashed), `phone`, `is_active`, `deleted_at` |
| `roles`, `permissions` | Spatie | RBAC |
| `model_has_roles`, `model_has_permissions`, `role_has_permissions` | Spatie | Relasi RBAC |
| `personal_access_tokens` | Sanctum | Bearer token |
| `employees` | `Employee` | `niy`, `nik` → user |
| `students` | `Student` | `nis`, `nisn`, `parent_id`, `user_id` |
| `parents` | `ParentModel` | `nik`, `phone` |
| `student_parents` | `StudentParent` | pivot + `relationship_type`, `is_primary`, `metadata` |
| `alumni` | `Alumni` | relasi 1-to-1 dengan Student |

## Master & Periode

| Tabel | Model | Relasi penting |
|---|---|---|
| `education_units` | `EducationUnit` | 1-to-M student/employee/kelas |
| `academic_years`, `semesters` | `AcademicYear`, `Semester` | periode aktif seluruh modul |
| `master_kurikulum` | `MasterKurikulum` | 1-to-M subject |
| `subjects` | `Subject` | `kurikulum_id` |
| `tbl_kelas` | `Kelas` | 1-to-M student, jadwal |

## Akademik & LMS

| Domain | Tabel |
|---|---|
| Jadwal | `class_schedules` |
| CP/TP | `lms_capaian_pembelajaran`, `lms_tujuan_pembelajaran` |
| Modul ajar | `lms_modul_ajar` + pivot `lms_modul_ajar_cp`, `lms_modul_ajar_tp` |
| Konten | `lms_materi`, `lms_media`, `lms_referensi` |
| Aktivitas | `lms_aktivitas_belajar`, `lms_diskusi`, `lms_diskusi_komentar` |
| Tugas | `lms_penugasan`, `lms_pengumpulan_tugas` |
| Evaluasi | `lms_kisi_kisi`, `lms_bank_soal`, `lms_ujian`, `lms_ujian_sesi`, `lms_jawaban_siswa` |
| Nilai/Rapor | penilaian LMS, `lms_rapor` |

## Absensi

| Tabel | Model |
|---|---|
| `attendances` | `Attendance` (gerbang siswa + kehadiran pegawai harian; PostgreSQL partitioned by month) |
| `lesson_attendance_sessions` | `LessonAttendanceSession` (sesi pembelajaran; bukan teaching attendance guru) |
| `lms_presensi` | `LmsPresensi` (detail presensi siswa per jadwal) |
| `attendance_scan_logs`, `attendance_devices` | scan lesson + terminal capture |
| `worship_attendance_sessions`, `worship_attendance_details` | ibadah |

Belum ada tabel/source of truth khusus kehadiran guru pada jadwal mengajar. `attendances` employee adalah kehadiran kerja harian dan tidak boleh dipakai sebagai sinonim teaching attendance.

## Tahfizh & Mutabaah

| Tabel | Model |
|---|---|
| `tahfizh_deposits` / `tahfizh_daily_logs` | `TahfizhDeposit` / `TahfizhDailyLog` |
| `memorization_deposits` | `TahfizhRecord` |
| `tbl_master_quran_surahs` | `MasterQuranSurah` |
| `mutabaah_daily_records` / `mutabaah_daily_headers` + details | `MutabaahDailyRecord` |
| `mutabaah_agenda_items` | template agenda |
| `mutabaah_parent_signatures` | tanda tangan ortu |

## Kesiswaan & Lainnya

| Tabel | Model |
|---|---|
| `student_notes` | `StudentNote` |
| `student_mutations` | `StudentMutation` |
| `chat_messages` | `ChatMessage` |
| `notifications` | `Notification` (skema kanonik partitioned + legacy dual-schema) |

## Catatan Penting

- `notifications` punya dua skema (kanonik partitioned `notifiable_id`/`title`/`body`/`channel`/`read_at` vs legacy `user_id`/`message`/`type`/`is_read`). Penulisan wajib lewat `Notification::deliver()`; pembacaan lewat `Notification::userQuery()`.
- Migration koreksi `fix_lms_cp_tp_cascade_to_restrict` mempertahankan data induk CP/TP (delete restrict).
- Detail per-domain trace (tabel → service → API): `99_ARCHIVE/DATABASE_SOURCE_OF_TRUTH_MATRIX.md`, `99_ARCHIVE/MODULE_DATABASE_TRACE_MATRIX.md`, `99_ARCHIVE/CHART_DATABASE_TRACE_MATRIX.md`, `99_ARCHIVE/TABLE_DATABASE_TRACE_MATRIX.md`, `99_ARCHIVE/DASHBOARD_DATABASE_TRACE_MATRIX.md`.
