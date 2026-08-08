# PostgreSQL Migration Status Matrix

Generated: 2026-08-08

## Migration Files (75 total)

| # | Migration File | Tables/Changes | PG Compatible | Status |
|---|----------------|----------------|:---:|--------|
| 1 | `0001_01_01_000000_create_users_table` | `users`, `password_reset_tokens`, `sessions` | ✅ | PENDING |
| 2 | `0001_01_01_000001_create_cache_table` | `cache`, `cache_locks` | ✅ | PENDING |
| 3 | `0001_01_01_000002_create_jobs_table` | `jobs`, `job_batches`, `failed_jobs` | ✅ | PENDING |
| 4 | `2026_07_21_021721_create_personal_access_tokens_table` | `personal_access_tokens` | ✅ | PENDING |
| 5 | `2026_07_21_021722_create_permission_tables` | `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions` | ✅ | PENDING |
| 6 | `2026_07_21_030000_create_school_erp_core_tables` | `academic_years`, `semesters`, `school_settings`, `parents`, `teachers`, `classrooms`, `classes`, `students`, `subjects`, `materials`, `assignments`, `assignment_submissions`, `question_banks`, `exams`, `student_notes`, `achievements`, `graduates`, `alumni` | ✅ | PENDING |
| 7 | `2026_07_21_030100_create_partitioned_operational_tables` | `attendances` (partitioned), `attendance_logs` (partitioned), `tahfizh_records` (partitioned), `mutabaah_records` (partitioned), `notifications` (partitioned) + 60 partition sub-tables | ✅ | PENDING |
| 8 | `2026_07_21_040000_buat_tabel_dashboard_pemantauan` | Dashboard/monitoring tables | ✅ | PENDING |
| 9 | `2026_07_22_000100_create_tahfizh_akademik_lanjutan_tables` | Tahfizh academic tables | ✅ | PENDING |
| 10 | `2026_07_23_000200_create_education_units_table` | `education_units` | ✅ | PENDING |
| 11 | `2026_07_26_000000_create_employee_management_tables` | `positions`, `employees`, `employee_teachings` | ✅ | PENDING |
| 12 | `2026_07_26_010000_create_tbl_kelas_table` | `tbl_kelas` | ✅ | PENDING |
| 13 | `2026_07_26_020000_add_fields_to_positions_table` | ALTER `positions` | ✅ | PENDING |
| 14 | `2026_07_26_131718_add_atasan_pegawai_id_to_positions_table` | ALTER `positions` | ✅ | PENDING |
| 15 | `2026_07_27_000000_create_master_jenis_unit_pendidikan_table` | `master_jenis_unit_pendidikan` | ✅ | PENDING |
| 16 | `2026_07_27_010000_create_finance_and_portal_tables` | Finance & portal tables | ✅ | PENDING |
| 17 | `2026_07_27_020000_create_attendances_module_table` | `attendances` (non-partitioned fallback) | ✅ | PENDING |
| 18 | `2026_07_27_030000_create_modul_semesters_table` | `modul_semesters` and related | ✅ | PENDING |
| 19 | `2026_07_27_100001_fix_education_units_add_jenis_unit_fk` | ALTER `education_units` | ✅ | PENDING |
| 20 | `2026_07_27_100002_create_divisions_table` | `divisions` | ✅ | PENDING |
| 21 | `2026_07_27_100003_add_division_id_to_employees` | ALTER `employees` | ✅ | PENDING |
| 22 | `2026_07_27_100004_create_v_unified_classes_view` | View `v_unified_classes` | ✅ | PENDING |
| 23 | `2026_07_27_100005_add_employee_bridge_to_teachers` | ALTER `teachers` | ✅ | PENDING |
| 24 | `2026_07_27_100006_add_employee_id_to_memorization_deposits` | ALTER memorization tables | ✅ | PENDING |
| 25 | `2026_07_27_100007_fix_attendances_consolidate_columns` | ALTER `attendances` (both partitioned & non-partitioned) | ✅ | PENDING |
| 26 | `2026_07_27_100008_create_class_schedules_table` | `class_schedules` | ✅ | PENDING |
| 27 | `2026_07_27_100009_create_student_grades_table` | `student_grades` | ✅ | PENDING |
| 28 | `2026_07_27_100010_add_audit_log_to_core_tables` | ALTER core tables | ✅ | PENDING |
| 29 | `2026_07_27_100011_fix_students_add_missing_columns` | ALTER `students` | ✅ | PENDING |
| 30 | `2026_07_27_100012_create_student_parents_pivot` | `student_parents` | ✅ | PENDING |
| 31 | `2026_07_27_110000_create_master_kurikulum_table` | `master_kurikulum` | ✅ | PENDING |
| 32 | `2026_07_28_000001_add_kurikulum_id_to_subjects_table` | ALTER `subjects` | ✅ | PENDING |
| 33 | `2026_07_28_100000_create_lms_core_tables` | LMS core tables | ✅ | PENDING |
| 34 | `2026_07_28_100001_create_lms_penugasan_tables` | LMS assignment tables | ✅ | PENDING |
| 35 | `2026_07_28_100002_create_lms_evaluasi_tables` | LMS evaluation tables | ✅ | PENDING |
| 36 | `2026_07_28_100003_create_lms_rapor_table` | `lms_rapors` | ✅ | PENDING |
| 37 | `2026_07_28_100004_enhance_subjects_table_for_lms` | ALTER `subjects` | ✅ | PENDING |
| 38 | `2026_07_28_100005_create_subject_pivot_tables` | Subject pivots | ✅ | PENDING |
| 39 | `2026_07_28_100006_enhance_lms_modul_ajar_table` | ALTER `lms_modul_ajar` | ✅ | PENDING |
| 40 | `2026_07_28_110000_enhance_lms_materi_table` | ALTER `lms_materi` | ✅ | PENDING |
| 41 | `2026_07_28_120000_create_lms_referensi_table` | `lms_referensi` | ✅ | PENDING |
| 42 | `2026_07_28_130000_create_lms_aktivitas_belajar_table` | `lms_aktivitas_belajar` | ✅ | PENDING |
| 43 | `2026_07_28_140000_create_lms_diskusi_tables` | LMS discussion tables | ✅ | PENDING |
| 44 | `2026_07_28_150000_create_lms_presensi_tables` | LMS attendance tables | ✅ | PENDING |
| 45 | `2026_07_28_160000_add_cp_tp_to_lms_kisi_kisi_table` | ALTER `lms_kisi_kisi` | ✅ | PENDING |
| 46 | `2026_07_28_170000_add_unit_tahun_to_lms_capaian_pembelajaran_table` | ALTER `lms_capaian_pembelajaran` | ✅ | PENDING |
| 47 | `2026_07_29_000001_fix_education_units_constraints` | ALTER `education_units` constraints | ✅ | PENDING |
| 48 | `2026_07_29_100000_create_site_settings_table` | `site_settings` | ✅ | PENDING |
| 49 | `2026_07_29_180000_extend_lesson_attendance_workflow` | Lesson attendance tables | ✅ | PENDING |
| 50 | `2026_07_29_190000_complete_lesson_attendance_workflow` | ALTER lesson attendance | ✅ | PENDING |
| 51 | `2026_07_29_200000_add_attendance_capture_methods` | ALTER attendance | ✅ | PENDING |
| 52 | `2026_07_29_210000_add_work_unit_and_access_scope_to_positions` | ALTER `positions` | ✅ | PENDING |
| 53 | `2026_07_30_000001_create_mutabaah_yaumiyah_tables` | Mutabaah yaumiyah tables | ✅ | PENDING |
| 54 | `2026_07_30_100000_expand_mutabaah_enterprise_module` | Mutabaah enterprise tables | ✅ | PENDING |
| 55 | `2026_07_30_110000_complete_mutabaah_yaumiyyah_schema` | ALTER mutabaah | ✅ | PENDING |
| 56 | `2026_07_31_120000_optimize_students_list_index` | Index on `students` | ✅ | PENDING |
| 57 | `2026_07_31_130000_create_student_card_settings_table` | `student_card_settings` | ✅ | PENDING |
| 58 | `2026_07_31_140000_create_equran_and_prayer_schedules_tables` | eQuran & prayer tables | ✅ | PENDING |
| 59 | `2026_07_31_160000_create_doas_table` | `doas` | ✅ | PENDING |
| 60 | `2026_07_31_170000_create_tahfizh_daily_logs_table` | `tahfizh_daily_logs` | ✅ | PENDING |
| 61 | `2026_08_01_000001_fix_student_kelas_relation` | ALTER students-kelas relation | ✅ | PENDING |
| 62 | `2026_08_01_000002_fix_lms_cp_tp_cascade_to_restrict` | ALTER FK constraints | ✅ | PENDING |
| 63 | `2026_08_01_000003_fix_modul_semester_cascade_to_restrict` | ALTER FK constraints | ✅ | PENDING |
| 64 | `2026_08_01_000004_fix_tbl_kelas_kode_unique_composite` | ALTER unique constraints | ✅ | PENDING |
| 65 | `2026_08_01_000005_add_photo_column_to_students` | ALTER `students` | ✅ | PENDING |
| 66 | `2026_08_01_100000_create_auth_and_approval_tables` | Auth & approval tables | ✅ | PENDING |
| 67 | `2026_08_02_000001_create_worship_attendance_tables` | Worship attendance tables | ✅ | PENDING |
| 68 | `2026_08_02_000002_enhance_gate_checkout_columns` | ALTER gate checkout | ✅ | PENDING |
| 69 | `2026_08_02_100000_create_student_notes_table` | `student_notes` (v2) | ✅ | PENDING |
| 70 | `2026_08_02_120000_create_portal_messages_table` | `portal_messages` | ✅ | PENDING |
| 71 | `2026_08_03_160000_make_student_id_nullable_in_portal_messages_table` | ALTER `portal_messages` | ✅ | PENDING |
| 72 | `2026_08_06_100000_reconcile_student_notes_for_parent_portal` | Reconcile student notes | ✅ | PENDING |
| 73 | `2026_08_06_120000_add_unique_proses_attempt_to_lms_ujian_sesi` | ALTER `lms_ujian_sesi` | ✅ | PENDING |
| 74 | `2026_08_07_000001_reconcile_employee_attendance_partition` | ALTER partitioned `attendances` | ✅ | PENDING |
| 75 | `2026_08_07_100000_add_performance_indexes` | Performance indexes | ✅ | PENDING |

## PostgreSQL-Specific Features Used

| Feature | Migration | Notes |
|---------|-----------|-------|
| `pgcrypto` extension | #6, #11 | `CREATE EXTENSION IF NOT EXISTS "pgcrypto"` |
| `gen_random_uuid()` | #1, #7 | UUID default value |
| `PARTITION BY LIST` | #7 | Month-based partitioning |
| GIN Full-Text Index | #6, #7 | `students_fts_idx`, `materials_fts_idx`, `notifications_fts_idx` |
| `to_tsvector()` | #6, #7 | PostgreSQL FTS |
| `pg_class` introspection | #25, #74 | Partition detection |
| `information_schema` | #25 | FK constraint detection |

## Summary

- **Total Migrations**: 75
- **PostgreSQL Compatible**: 75/75 (100%)
- **MySQL-only Syntax**: 0
- **Status**: All PENDING (need initial run on `school_management`)
