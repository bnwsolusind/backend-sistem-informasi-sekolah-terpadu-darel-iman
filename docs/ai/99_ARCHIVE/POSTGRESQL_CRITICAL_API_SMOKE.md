# POSTGRESQL CRITICAL API SMOKE TEST REPORT

## Critical Module Endpoints Audit

All primary API modules were verified against live PostgreSQL query execution:

| Module / Endpoint | Tested Route | HTTP Status | SQLSTATE Errors | Data Source | Result |
|---|---|---|---|---|---|
| **Dashboard Super Admin** | `/api/dashboard/super-admin` | 200 OK | 0 | PostgreSQL | PASSED |
| **Dashboard Yayasan** | `/api/dashboard/yayasan` | 200 OK | 0 | PostgreSQL | PASSED |
| **Unit Pendidikan** | `/api/education-units` | 200 OK | 0 | PostgreSQL | PASSED |
| **Pegawai** | `/api/employees` | 200 OK | 0 | PostgreSQL | PASSED |
| **Guru** | `/api/teachers` | 200 OK | 0 | PostgreSQL | PASSED |
| **Siswa** | `/api/students` | 200 OK | 0 | PostgreSQL | PASSED |
| **Kelas/Rombel** | `/api/classes` | 200 OK | 0 | PostgreSQL | PASSED |
| **Jadwal** | `/api/schedules` | 200 OK | 0 | PostgreSQL | PASSED |
| **Presensi** | `/api/attendances/rekap` | 200 OK | 0 | PostgreSQL | PASSED |
| **LMS** | `/api/lms/courses` | 200 OK | 0 | PostgreSQL | PASSED |
| **CBT** | `/api/cbt/exams` | 200 OK | 0 | PostgreSQL | PASSED |
| **Tahfizh** | `/api/tahfizh/records/rekap` | 200 OK | 0 | PostgreSQL | PASSED |
| **Mutaba'ah** | `/api/mutabaah/records/rekap` | 200 OK | 0 | PostgreSQL | PASSED |
| **Chat** | `/api/chat/employee/contacts` | 200 OK | 0 | PostgreSQL | PASSED |
| **Notifikasi** | `/api/notifications` | 200 OK | 0 | PostgreSQL | PASSED |
| **Laporan** | `/api/reports/overview` | 200 OK | 0 | PostgreSQL | PASSED |
| **Portal Orang Tua** | `/api/parent/dashboard` | 200 OK | 0 | PostgreSQL | PASSED |
| **Portal Siswa** | `/api/student/dashboard` | 200 OK | 0 | PostgreSQL | PASSED |

---

## Smoke Test Summary

```text
HTTP 500 ERRORS: 0
UNDEFINED TABLE ERRORS: 0
UNDEFINED COLUMN ERRORS: 0
FOREIGN KEY ERRORS: 0
NOT-NULL VIOLATIONS: 0
```
