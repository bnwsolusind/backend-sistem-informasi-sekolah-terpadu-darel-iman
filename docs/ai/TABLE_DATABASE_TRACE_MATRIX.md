# TABLE DATABASE TRACE MATRIX

## End-to-End Table Data Traceability

| Page | Table Name | Data Prop Source | API Endpoint | Database Table | Pagination & Search | Failure State Behavior |
|---|---|---|---|---|---|---|
| Units Page | Unit Pendidikan | `dataUnitPendidikan` | `/api/foundation/units` | `education_units` | Server-side / Client filter | Renders Error State |
| Employees Page | Pegawai & Guru | `employees` | `/api/foundation/employees` | `employees` | Server-side pagination & search | Renders Error State |
| Students Page | Siswa Aktif | `students` | `/api/foundation/students` | `students` | Server-side pagination & search | Renders Error State |
| Classes Page | Rombongan Belajar | `classes` | `/api/foundation/classes` | `kelas` | Server-side pagination & search | Renders Error State |
| Attendance Page | Log Scan Presensi | `attendanceLogs` | `/api/attendance/logs` | `attendance_scan_logs` | Server-side pagination & search | Renders Error State |
| Mutabaah Page | Evaluasi Mutaba'ah | `entries` | `/api/mutabaah/entries` | `mutabaah_daily_headers` | Server-side pagination & search | Renders Error State |
| Tahfizh Page | Setoran Tahfizh | `tahfizhLogs` | `/api/tahfizh/logs` | `tahfizh_daily_logs` | Server-side pagination & search | Renders Error State |
