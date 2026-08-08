# RUNTIME MOCK USAGE MATRIX

## Classification Guidelines
- **BUSINESS MOCK / HARDCODE (INVALID)**: Static arrays, fake objects, or hardcoded numbers embedded in production components representing business state.
- **VALID CONSTANTS (VALID)**: Enums, status constants, default UI layout settings, pagination sizes, color themes, icon sets.
- **TEST FIXTURES / SEEDERS (VALID)**: Database seeders and PHPUnit test factories that populate PostgreSQL demo datasets.

## Module Inspection Matrix
| Module / Page | Runtime Source | Mock/Hardcode Audit Status |
|---|---|---|
| Super Admin Dashboard | `/api/dashboard/super-admin` | PASS — 100% DB sourced |
| Yayasan Dashboard | `/api/foundation/dashboard` | PASS — Refactored to 100% DB sourced |
| Divisi Pendidikan Dashboard | `/api/dashboard/divisi-pendidikan` | PASS — 100% DB sourced |
| Kepala Sekolah Dashboard | `/api/dashboard/kepala-sekolah` | PASS — 100% DB sourced |
| Tata Usaha Dashboard | `/api/dashboard/tata-usaha` | PASS — 100% DB sourced |
| Operator Dashboard | `/api/dashboard/operator` | PASS — 100% DB sourced |
| Guru / Teacher Workspace | `/api/teacher/dashboard` & `/api/teacher/students` | PASS — Refactored to 100% DB sourced |
| Wali Kelas Dashboard | `/api/dashboard/wali-kelas` | PASS — 100% DB sourced |
| Guru Tahfizh Dashboard | `/api/dashboard/guru-tahfizh` | PASS — 100% DB sourced |
| Parent Portal | `/api/portal/parent/overview` | PASS — 100% DB sourced |
| Student Portal | `/api/portal/student/overview` | PASS — 100% DB sourced |
| Master Data (Units, Employees, Students, Classes, Subjects) | Master API Endpoints | PASS — 100% DB sourced |
| LMS (Kurikulum, Modul, Penilaian, CBT) | LMS API Endpoints | PASS — 100% DB sourced |
| Presensi & Gate Scan | Gate & Presensi API Endpoints | PASS — 100% DB sourced |
| Tahfizh & Mutaba'ah | Tahfizh & Mutaba'ah Analytics Endpoints | PASS — 100% DB sourced |
