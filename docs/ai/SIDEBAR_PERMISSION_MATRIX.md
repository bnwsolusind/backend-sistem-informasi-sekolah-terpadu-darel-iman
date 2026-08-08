# SIDEBAR PERMISSION MATRIX

## Frontend Sidebar Menu Config & Permission Gating

Sidebar items in `web-dashboard/src/layouts/DashboardLayout.jsx` are database & permission-driven via `/api/me` Spatie permissions.

| Menu Item | Frontend Label | Required Permission | Backend Route / Gate |
| --- | --- | --- | --- |
| Dashboard Super Admin | Dashboard | `dashboard.superadmin.view` | `/api/dashboard/super-admin` |
| Dashboard Executive | Executive Dashboard | `foundation.dashboard.view` | `/api/foundation/dashboard` |
| Master Unit Pendidikan | Unit Pendidikan | `education_units.view` | `/api/education-units` |
| Master Pegawai | Data Pegawai | `employees.view` | `/api/employees` |
| Master Siswa | Data Siswa | `students.view` | `/api/students` |
| Master Orang Tua | Data Orang Tua | `parents.view` | `/api/parents` |
| Master Akademik & Rombel | Rombel & Kelas | `classes.view` | `/api/classes` |
| Mata Pelajaran & Jadwal | Jadwal & Mapel | `schedules.view` | `/api/schedules` |
| Presensi Workspaces | Presensi Siswa & Pegawai | `attendances.view` | `/api/attendances/rekap` |
| LMS & CBT | Learning & Assessment | `lms.view`, `cbt.view` | `/api/lms/courses`, `/api/cbt/exams` |
| Tahfizh & Mutabaah | Tahfizh & Mutabaah | `tahfizh.view`, `mutabaah.view` | `/api/tahfizh/records`, `/api/mutabaah/records` |
| Laporan & Analytics | Laporan Terpadu | `reports.view` | `/api/reports/overview` |
| Mutasi & Kelulusan | Mutasi & Kelulusan | `students.mutate`, `graduations.view` | `/api/student-mutations`, `/api/graduations` |
| Alumni | Data Alumni | `alumni.view` | `/api/alumni` |
