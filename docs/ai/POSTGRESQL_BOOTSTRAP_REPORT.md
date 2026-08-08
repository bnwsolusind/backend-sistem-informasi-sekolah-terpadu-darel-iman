# PostgreSQL Bootstrap Report

Generated: 2026-08-08
Status: **AWAITING USER EXECUTION**

## Environment

| Item | Value |
|------|-------|
| Stack | Laravel 12 + PHP 8.3 + PostgreSQL + React 19 + Vite |
| DB Connection | `pgsql` |
| DB Host | `127.0.0.1:5432` |
| DB Name | `school_management` |
| DB User | `postgres` |
| Config Default | `pgsql` (config/database.php line 19) |

## Pre-Bootstrap Audit Results

### Migration Audit

| Metric | Value |
|--------|-------|
| Total Migration Files | 75 |
| PostgreSQL Compatible | 75/75 (100%) |
| MySQL-only Syntax | 0 |
| PostgreSQL-specific Features | 6 (pgcrypto, gen_random_uuid, partitioning, GIN indexes, FTS, pg_class introspection) |
| Migration Order Correct | ✅ Yes |
| Enum Usage | 11 instances (compatible via CHECK constraints) |

### Seeder Audit

| Metric | Value |
|--------|-------|
| Total Seeder Files | 41 |
| Idempotent (firstOrCreate/updateOrCreate) | 41/41 (100%) |
| Contains Destructive Operations | 0 bulk, 2 scoped (safe) |
| Fixes Applied | DataDummySiswaSeeder: raw insert → updateOrInsert |

### DatabaseSeeder Order

| Phase | Seeders | FK Dependencies Met |
|-------|---------|:---:|
| 1. Auth & Config | RolePermissionSeeder, AttendancePermissionSeeder, DefaultRoleUserSeeder, SiteSettingsSeeder, StudentCardSettingsSeeder | ✅ |
| 2. Master Data | MasterJenisUnitPendidikanSeeder, DataDummyUnitPendidikanSeeder, MasterJabatanSeeder, DataDummyPegawaiSeeder, TeacherSeeder | ✅ |
| 3. Parents/Students | ParentSeeder, DataDummySiswaSeeder | ✅ |
| 4. Academic | MasterKurikulumSeeder, SubjectSeeder, KelasSeeder, JadwalPelajaranSeeder, ModulSemesterSeeder | ✅ |
| 5. LMS Content | 12 seeders (ModulAjar...LmsPenilaian) | ✅ |
| 6. Grades/Rapor | StudentGradesSeeder, LmsRaporSeeder | ✅ |
| 7. Operational | AttendanceSeeder, WorshipAttendanceSeeder, MutabaahEnterpriseSeeder, QuranSurahSeeder, DoaSeeder, PrayerScheduleSeeder, TahfizhSeeder, SuperadminStudentLinkSeeder | ✅ |
| 8. Dev-only | StudentMutationSeeder | ✅ |

### Test User Accounts (from DefaultRoleUserSeeder)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@school-erp.local | Password123! |
| Admin | admin@school-erp.local | Admin@2026! |
| Yayasan | yayasan@school-erp.local | Yayasan@2026! |
| Ketua Yayasan | ketua.yayasan@school-erp.local | Yayasan@2026! |
| Sekretaris Yayasan | sekretaris.yayasan@school-erp.local | Yayasan@2026! |
| Bendahara Yayasan | bendahara.yayasan@school-erp.local | Yayasan@2026! |
| Pengurus Yayasan | pengurus.yayasan@school-erp.local | Yayasan@2026! |
| Kepala Sekolah | kepsek@school-erp.local | Kepsek@2026! |
| Divisi Pendidikan | divisi.pendidikan@school-erp.local | Divisi@2026! |
| Tata Usaha | tu@school-erp.local | TU@2026! |
| Guru | guru@school-erp.local | Guru@2026! |
| Guru Tahfizh | guru.tahfizh@school-erp.local | Tahfizh@2026! |
| Musyrif | musyrif@school-erp.local | Musyrif@2026! |
| Orang Tua | orangtua@school-erp.local | OrangTua@2026! |
| Siswa | siswa@school-erp.local | Siswa@2026! |

## Bootstrap Script

A complete bootstrap script is available at:
```
backend/scripts/postgresql_bootstrap.sh
```

Run in terminal:
```bash
cd /Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/backend
chmod +x scripts/postgresql_bootstrap.sh
bash scripts/postgresql_bootstrap.sh
```

## Post-Bootstrap Verification (To Be Filled After Execution)

```
POSTGRESQL CONNECTION: [PENDING]
POSTGRESQL VERSION: [PENDING]
DATABASE: school_management

MIGRATION FILES: 75
MIGRATIONS RAN: [PENDING]
MIGRATIONS PENDING: [PENDING]
MIGRATION ERRORS: [PENDING]
MIGRATION FIXES: 0

TABLES BEFORE: [PENDING]
TABLES AFTER: [PENDING]

SEEDERS AUDITED: 41
SEEDERS SAFE: 41
SEEDERS FIXED: 1 (DataDummySiswaSeeder)
SEED RUN 1: [PENDING]
SEED RUN 2: [PENDING]
DUPLICATES: [PENDING]

USERS: [PENDING]
ROLES: [PENDING]
PERMISSIONS: [PENDING]
UNITS: [PENDING]
EMPLOYEES: [PENDING]
TEACHERS: [PENDING]
PARENTS: [PENDING]
STUDENTS: [PENDING]
CLASSES: [PENDING]
ROMBELS: [PENDING]
SUBJECTS: [PENDING]
SCHEDULES: [PENDING]

LOGIN SUPERADMIN: [PENDING]
LOGIN YAYASAN: [PENDING]
LOGIN KEPSEK: [PENDING]
LOGIN TU: [PENDING]
LOGIN GURU: [PENDING]
LOGIN PARENT: [PENDING]
LOGIN STUDENT: [PENDING]

CRITICAL API SMOKE: [PENDING]
HTTP 500: [PENDING]
SCHEMA ERRORS: [PENDING]

CRUD DB SYNC: [PENDING]
BROWSER MCP: [PENDING]

SQLITE TESTS: [PENDING]
POSTGRESQL TESTS: [PENDING]

FRONTEND LINT: [PENDING]
FRONTEND BUILD: [PENDING]

REMAINING ISSUES: [PENDING]
```

## Current Status

```
POSTGRESQL BOOTSTRAP PARTIALLY PASSED — MIGRATION OR SEEDER WORK REMAINS
```

> Audit and preparation complete. Awaiting user execution of bootstrap script.
> Cannot execute from IDE due to sandbox library restrictions.
