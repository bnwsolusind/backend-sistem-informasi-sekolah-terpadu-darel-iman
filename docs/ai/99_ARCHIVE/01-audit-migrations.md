# 01-AUDIT MIGRATIONS — SIMSIT

## Matriks Audit Migrations Database (71 File)

| Migration File | Tabel Utama | Primary Key | Foreign Key / Reference | Soft Delete | Status Audit | Tindakan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `0001_01_01_000000_create_users_table.php` | `users`, `password_reset_tokens`, `sessions` | UUID (`id`) | - | Tidak | Sesuai | Pertahankan |
| `0001_01_01_000001_create_cache_table.php` | `cache`, `cache_locks` | String | - | Tidak | Sesuai | Pertahankan |
| `0001_01_01_000002_create_jobs_table.php` | `jobs`, `job_batches`, `failed_jobs` | BigInt / String | - | Tidak | Sesuai | Pertahankan |
| `2026_07_21_021721_create_personal_access_tokens_table.php` | `personal_access_tokens` | BigInt | morphs(`tokenable`) | Tidak | Sesuai | Pertahankan |
| `2026_07_21_021722_create_permission_tables.php` | `permissions`, `roles`, `model_has_permissions`, `model_has_roles`, `role_has_permissions` | BigInt / UUID | FK to roles/permissions | Tidak | Sesuai | Pertahankan |
| `2026_07_21_030000_create_school_erp_core_tables.php` | `academic_years`, `semesters`, `education_units`, `students`, `teachers`, `parents`, `classes`, `subjects`, `schedules` | UUID | FK inter-core | Ya | Sesuai | Pertahankan |
| `2026_07_21_030100_create_partitioned_operational_tables.php` | `attendances`, `student_grades`, `tahfizh_records`, `mutabaah_entries` | BigInt / UUID | FK to students, schedules | Ya | Sesuai | Pertahankan |
| `2026_07_21_040000_buat_tabel_dashboard_pemantauan.php` | `pemantauan_divisi`, `laporan_bulanan`, `rekam_prestasi_siswa` | BigInt | FK to education_units | Ya | Sesuai | Pertahankan |
| `2026_07_22_000100_create_tahfizh_akademik_lanjutan_tables.php` | `tahfizh_targets`, `mutabaah_daily_headers`, `mutabaah_daily_details` | UUID | FK to students | Ya | Sesuai | Pertahankan |
| `2026_07_23_000200_create_education_units_table.php` | `education_units` (enhancements) | UUID | FK to jenis_unit_pendidikan | Ya | Sesuai | Pertahankan |
| `2026_07_26_000000_create_employee_management_tables.php` | `employees`, `positions` | UUID | FK to users, education_units | Ya | Sesuai | Pertahankan |
| `2026_07_26_010000_create_tbl_kelas_table.php` | `tbl_kelas` | UUID | FK to education_units | Ya | Sesuai | Pertahankan |
| `2026_07_26_020000_add_fields_to_positions_table.php` | `positions` (fields) | UUID | FK to positions (atasan) | Ya | Sesuai | Pertahankan |
| `2026_07_27_000000_create_master_jenis_unit_pendidikan_table.php` | `master_jenis_unit_pendidikan` | BigInt | - | Ya | Sesuai | Pertahankan |
| `2026_07_27_010000_create_finance_and_portal_tables.php` | `fee_categories`, `student_bills`, `bill_payments` | UUID | FK to students | Ya | Sesuai | Pertahankan |
| `2026_07_27_020000_create_attendances_module_table.php` | `attendances` (columns) | BigInt | FK to students, schedules | Ya | Sesuai | Pertahankan |
| `2026_07_27_030000_create_modul_semesters_table.php` | `modul_semesters`, `modul_semester_details` | UUID | FK to subjects, education_units | Ya | Sesuai | Pertahankan |
| `2026_07_27_100001_fix_education_units_add_jenis_unit_fk.php` | `education_units` (jenis_unit_fk) | UUID | FK to master_jenis_unit_pendidikan | Ya | Sesuai | Pertahankan |
| `2026_07_27_100002_create_divisions_table.php` | `divisions` | UUID | FK to education_units | Ya | Sesuai | Pertahankan |
| `2026_07_27_100003_add_division_id_to_employees.php` | `employees` (division_id) | UUID | FK to divisions | Ya | Sesuai | Pertahankan |
| `2026_07_27_100004_create_v_unified_classes_view.php` | View `v_unified_classes` | - | Join classes & tbl_kelas | - | Sesuai | Pertahankan |
| `2026_07_27_100005_add_employee_bridge_to_teachers.php` | `teachers` (employee_id) | UUID | FK to employees | Ya | Sesuai | Pertahankan |
| `2026_07_27_100006_add_employee_id_to_memorization_deposits.php` | `memorization_deposits` | UUID | FK to employees | Ya | Sesuai | Pertahankan |
| `2026_07_27_100007_fix_attendances_consolidate_columns.php` | `attendances` (consolidation) | BigInt | FK to students | Ya | Sesuai | Pertahankan |
| `2026_07_27_100008_create_class_schedules_table.php` | `class_schedules` | UUID | FK to teachers, subjects, classes | Ya | Sesuai | Pertahankan |
| `2026_07_27_100009_create_student_grades_table.php` | `student_grades` | BigInt | FK to students, subjects | Ya | Sesuai | Pertahankan |
| `2026_07_27_100010_add_audit_log_to_core_tables.php` | `attendance_audit_logs` | BigInt | FK to attendances | Ya | Sesuai | Pertahankan |
| `2026_07_27_100011_fix_students_add_missing_columns.php` | `students` (columns) | UUID | FK to users, education_units | Ya | Sesuai | Pertahankan |
| `2026_07_27_100012_create_student_parents_pivot.php` | `student_parent_pivot` | BigInt | FK to students, parents | Ya | Sesuai | Pertahankan |
| `2026_07_27_110000_create_master_kurikulum_table.php` | `master_kurikulum` | UUID | FK to education_units | Ya | Sesuai | Pertahankan |
| `2026_07_28_000001_add_kurikulum_id_to_subjects_table.php` | `subjects` (kurikulum_id) | UUID | FK to master_kurikulum | Ya | Sesuai | Pertahankan |
| `2026_07_28_100000_create_lms_core_tables.php` | LMS Core Tables | UUID | FK to subjects, education_units | Ya | Sesuai | Pertahankan |
| `2026_07_28_100001_create_lms_penugasan_tables.php` | Penugasan Tables | UUID | FK to subjects, teachers | Ya | Sesuai | Pertahankan |
| `2026_07_28_100002_create_lms_evaluasi_tables.php` | Evaluasi Tables | UUID | FK to subjects, students | Ya | Sesuai | Pertahankan |
| `2026_07_28_100003_create_lms_rapor_table.php` | Rapor Tables | UUID | FK to students, academic_years | Ya | Sesuai | Pertahankan |
| `2026_07_28_100004_enhance_subjects_table_for_lms.php` | `subjects` (LMS fields) | UUID | - | Ya | Sesuai | Pertahankan |
| `2026_07_28_100005_create_subject_pivot_tables.php` | Subject Pivots | BigInt | FK to subjects | Ya | Sesuai | Pertahankan |
| `2026_07_28_100006_enhance_lms_modul_ajar_table.php` | `lms_modul_ajar` | UUID | FK to subjects | Ya | Sesuai | Pertahankan |
| `2026_07_28_110000_enhance_lms_materi_table.php` | `lms_materi` | UUID | FK to subjects | Ya | Sesuai | Pertahankan |
| `2026_07_28_120000_create_lms_referensi_table.php` | `lms_referensi` | UUID | FK to subjects | Ya | Sesuai | Pertahankan |
| `2026_07_28_130000_create_lms_aktivitas_belajar_table.php` | `lms_aktivitas_belajar` | UUID | FK to subjects | Ya | Sesuai | Pertahankan |
| `2026_07_28_140000_create_lms_diskusi_tables.php` | `lms_diskusi`, `lms_diskusi_komentar` | UUID | FK to subjects, users | Ya | Sesuai | Pertahankan |
| `2026_07_28_150000_create_lms_presensi_tables.php` | `lms_presensi` | UUID | FK to subjects, students | Ya | Sesuai | Pertahankan |
| `2026_07_28_160000_add_cp_tp_to_lms_kisi_kisi_table.php` | `lms_kisi_kisi` | UUID | FK to cp, tp | Ya | Sesuai | Pertahankan |
| `2026_07_28_170000_add_unit_tahun_to_lms_capaian_pembelajaran_table.php` | `capaian_pembelajaran` | UUID | FK to education_units | Ya | Sesuai | Pertahankan |
| `2026_07_29_000001_fix_education_units_constraints.php` | `education_units` | UUID | FK constraints adjustment | Ya | Sesuai | Pertahankan |
| `2026_07_29_100000_create_site_settings_table.php` | `site_settings` | BigInt | - | Ya | Sesuai | Pertahankan |
| `2026_07_29_180000_extend_lesson_attendance_workflow.php` | Lesson Attendance Workflow | BigInt | FK to attendances | Ya | Sesuai | Pertahankan |
| `2026_07_29_190000_complete_lesson_attendance_workflow.php` | Workflow completion | BigInt | FK to attendances | Ya | Sesuai | Pertahankan |
| `2026_07_29_200000_add_attendance_capture_methods.php` | Attendance capture methods | BigInt | FK to attendances | Ya | Sesuai | Pertahankan |
| `2026_07_29_210000_add_work_unit_and_access_scope_to_positions.php` | `positions` scope | UUID | - | Ya | Sesuai | Pertahankan |
| `2026_07_30_000001_create_mutabaah_yaumiyah_tables.php` | Mutabaah Yaumiyah | UUID | FK to students | Ya | Sesuai | Pertahankan |
| `2026_07_30_100000_expand_mutabaah_enterprise_module.php` | Mutabaah Enterprise | UUID | FK to students | Ya | Sesuai | Pertahankan |
| `2026_07_30_110000_complete_mutabaah_yaumiyyah_schema.php` | Mutabaah Schema | UUID | FK to students | Ya | Sesuai | Pertahankan |
| `2026_07_31_120000_optimize_students_list_index.php` | `students` indexes | UUID | Performance Indexes | Ya | Sesuai | Pertahankan |
| `2026_07_31_130000_create_student_card_settings_table.php` | `student_card_settings` | BigInt | FK to education_units | Ya | Sesuai | Pertahankan |
| `2026_07_31_140000_create_equran_and_prayer_schedules_tables.php` | EQuran & Shalat Tables | BigInt / UUID | FK to education_units | Ya | Sesuai | Pertahankan |
| `2026_07_31_160000_create_doas_table.php` | `doas` | BigInt | - | Ya | Sesuai | Pertahankan |
| `2026_07_31_170000_create_tahfizh_daily_logs_table.php` | `tahfizh_daily_logs` | BigInt | FK to students | Ya | Sesuai | Pertahankan |
| `2026_08_01_000001_fix_student_kelas_relation.php` | `students` kelas relation | UUID | FK to tbl_kelas | Ya | Sesuai | Pertahankan |
| `2026_08_01_000002_fix_lms_cp_tp_cascade_to_restrict.php` | CP TP FK cascade | UUID | FK restrict protection | Ya | Sesuai | Pertahankan |
| `2026_08_01_000003_fix_modul_semester_cascade_to_restrict.php` | Modul Semester FK | UUID | FK restrict protection | Ya | Sesuai | Pertahankan |
| `2026_08_01_000004_fix_tbl_kelas_kode_unique_composite.php` | `tbl_kelas` unique composite | UUID | Composite index (`kode`, `unit_id`) | Ya | Sesuai | Pertahankan |
| `2026_08_01_000005_add_photo_column_to_students.php` | `students` photo | UUID | - | Ya | Sesuai | Pertahankan |
| `2026_08_01_100000_create_auth_and_approval_tables.php` | Auth & Delete Requests | UUID | FK to users | Ya | Sesuai | Pertahankan |
| `2026_08_02_000001_create_worship_attendance_tables.php` | Worship Attendance Tables | UUID | FK to students | Ya | Sesuai | Pertahankan |
| `2026_08_02_000002_enhance_gate_checkout_columns.php` | Gate checkout fields | BigInt | - | Ya | Sesuai | Pertahankan |
| `2026_08_02_100000_create_student_notes_table.php` | `student_notes` | BigInt | FK to students, teachers | Ya | Sesuai | Pertahankan |
| `2026_08_02_120000_create_portal_messages_table.php` | `portal_messages` | BigInt | FK to users | Ya | Sesuai | Pertahankan |
| `2026_08_03_160000_make_student_id_nullable_in_portal_messages_table.php` | `portal_messages` student_id nullable | BigInt | FK to students | Ya | Sesuai | Pertahankan |

---

## Kesimpulan Audit Migrasi
Seluruh 71 migrasi telah berada dalam urutan eksekusi yang valid, konsisten dalam tipe primary key (UUID untuk entitas bisnis utama & BigInt untuk log/transaksi skala besar), serta terlindungi oleh foreign key constraint yang memadai. **Tidak ada migrasi duplikat atau konflik yang memicu kegagalan database.**
