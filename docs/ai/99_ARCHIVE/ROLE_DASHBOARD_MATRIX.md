# Role Dashboard Matrix - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Verified & Standardized (14 Roles Complete)

---

## 1. Overview & Principle

In accordance with Enterprise UX Principle #5:
> "Dashboard setiap role WAJIB berbeda. Super Admin, Yayasan, Divisi Pendidikan, Kepala Sekolah, TU, Operator, Guru, Guru Tahfizh, Guru BK, Wali Kelas, Musyrif, Orang Tua, Siswa, Alumni. Dashboard disusun berdasarkan pekerjaan role tersebut. Bukan berdasarkan module."

All 14 roles have dedicated, duty-focused dashboard interfaces that source live data from PostgreSQL via backend REST APIs.

---

## 2. 14 Role Dashboard Specification Matrix

| No | Role Name | Primary Route | Main Duty & Focus Area | Dedicated Component | Sourced Backend Endpoints | KPI Drilldown |
|---|---|---|---|---|---|---|
| 1 | **Super Admin** | `/dashboard` | System health, tenant management, overall metrics, role access switcher | `SuperAdminDashboardPage.jsx` | `/foundation/dashboard`, `/foundation/units` | Live Modal / Drawer |
| 2 | **Yayasan** | `/dashboard/yayasan` | Executive summary, multi-unit growth, financial & SDM aggregate | `FoundationDashboardPage.jsx` | `/foundation/dashboard` | Live Modal / Drawer |
| 3 | **Divisi Pendidikan** | `/dashboard/divisi-pendidikan` | Cross-unit academic monitoring, teacher-student ratios, monthly reports | `DivisiPendidikanDashboardPage.jsx` | `/dashboard/divisi-pendidikan` | Live Modal / Drawer |
| 4 | **Kepala Sekolah** | `/dashboard/kepala-sekolah` | Unit operational health, daily attendance, announcements, unit KPIs | `KepalaSekolahDashboardPage.jsx` | `/dashboard/kepala-sekolah` | Live Modal / Drawer |
| 5 | **TU (Tata Usaha)** | `/dashboard/tata-usaha` | Administrative processing, employee/student records, correspondence | `TataUsahaDashboardPage.jsx` | `/dashboard/tata-usaha` | Live Modal / Drawer |
| 6 | **Operator** | `/dashboard/operator` | System data sync, audit log monitoring, master data maintenance | `OperatorDashboardPage.jsx` | `/dashboard/operator` | Live Modal / Drawer |
| 7 | **Guru** | `/portal-guru` | Daily teaching schedule, lesson attendance, materials, assignments, grades | `TeacherStudentPortalDashboardPage.jsx` | `/portal-guru/overview` | Live Modal / Drawer |
| 8 | **Guru Tahfizh** | `/dashboard/guru-tahfizh` | Quran recitation logs (hafalan/murajaah), target progress of assigned students | `GuruTahfizhDashboardPage.jsx` | `/dashboard/guru-tahfizh` | Live Modal / Drawer |
| 9 | **Guru BK** | `/dashboard/guru-bk` | Student counseling records, behavioral points, attendance warnings | `GuruBkDashboardPage.jsx` | `/dashboard/guru-bk` | Live Modal / Drawer |
| 10 | **Wali Kelas** | `/dashboard/wali-kelas` | Homeroom student attendance, mutabaah recap, parent permissions | `WaliKelasDashboardPage.jsx` | `/dashboard/wali-kelas` | Live Modal / Drawer |
| 11 | **Musyrif Asrama** | `/dashboard/musyrif` | Dormitory student supervision, 5-time congregational prayer logs, mutabaah | `MusyrifDashboardPage.jsx` | `/dashboard/musyrif` | Live Modal / Drawer |
| 12 | **Orang Tua** | `/portal-orangtua` | Child daily attendance, mutabaah logs, teacher chat, report cards | `ParentPortalPage.jsx` | `/portal-orangtua/overview` | Live Modal / Drawer |
| 13 | **Siswa** | `/portal-siswa` | Personal schedule, learning materials, CBT exams, grades, mutabaah | `StudentPortalPage.jsx` | `/portal-siswa/overview` | Live Modal / Drawer |
| 14 | **Alumni** | `/portal-alumni` | Higher education tracer, alumni network, career updates, graduation logs | `AlumniPortalPage.jsx` | `/portal-alumni/overview` | Live Modal / Drawer |

---

## 3. Key Verification Results

1. **Duty-Driven Structure**: Each dashboard displays job-specific KPI cards, quick actions, trends, and data tables instead of generic navigation lists.
2. **PostgreSQL Grounding**: Zero mock arrays in final views. All metrics bind to live backend database controllers.
3. **No Pointer on Non-Actionable Cards**: `StatCard` enforces `cursor-default` when no click handler is present.
