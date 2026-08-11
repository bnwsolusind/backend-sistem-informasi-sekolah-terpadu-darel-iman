# EMPLOYEE ATTENDANCE SCHEMA RECONCILIATION REPORT — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Reconciliation of PostgreSQL partitioned `attendances` table DDL constraints to support employee attendance storage.

---

## 1. PRE-EXISTING PROBLEM IDENTIFICATION

- **Problem**: Migration `2026_07_21_030100_create_partitioned_operational_tables.php` defined raw DDL for partitioned `attendances` table on PostgreSQL where `student_id` and `class_id` were set to `UUID NOT NULL`.
- **Symptom**: When employees checked in / recorded attendance (`employee_id` set, `tipe_presensi = 'Pegawai'`), PostgreSQL thrown a SQL error: `null value in column "student_id" violates not-null constraint`.
- **Root Cause**: Partitioned table DDL creation script omitted nullable modifier for student and class columns, causing pre-existing failure on multi-portal login and employee attendance storage in PostgreSQL environments.

---

## 2. ARCHITECTURAL RESOLUTION & RECONCILIATION

- **Migration Added**: `2026_08_07_000001_reconcile_employee_attendance_partition.php`.
- **DDL Execution**:
  ```sql
  ALTER TABLE attendances ALTER COLUMN student_id DROP NOT NULL;
  ALTER TABLE attendances ALTER COLUMN class_id DROP NOT NULL;
  ALTER TABLE attendances ADD COLUMN IF NOT EXISTS tipe_presensi VARCHAR(20) DEFAULT 'Siswa';
  ALTER TABLE attendances ADD COLUMN IF NOT EXISTS employee_id UUID NULL;
  ALTER TABLE attendances ADD COLUMN IF NOT EXISTS unit_pendidikan_id UUID NULL;
  ```
- **Source of Truth**: Employee attendance logs use `attendances` table with `tipe_presensi = 'Pegawai'` / `'Guru'` and `employee_id` linked to `employees(id)`. Student attendance logs continue using `tipe_presensi = 'Siswa'` and `student_id` linked to `students(id)`.

---

## 3. VERIFICATION & TEST EVIDENCE

Verified by test suite `EnterpriseReportingAndExportTest`:
- `test_employee_attendance_can_be_stored_on_postgresql`
- `test_employee_attendance_partition_accepts_employee_record`
- `test_employee_attendance_does_not_require_student_id`
- `test_employee_attendance_report_reads_employee_source`
- `test_student_attendance_and_employee_attendance_do_not_conflict`
