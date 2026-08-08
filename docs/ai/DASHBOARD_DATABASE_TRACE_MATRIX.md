# DASHBOARD DATABASE TRACE MATRIX

## End-to-End Database Traceability for Dashboard Metrics

```text
UI Component
  ↓
API Request
  ↓
Controller / Service
  ↓
Eloquent Model / Query Builder
  ↓
PostgreSQL Table
```

### Traceability Table

| Page / Widget | UI Display Metric | API Endpoint | Service / Query Method | PostgreSQL Source Table | Status |
|---|---|---|---|---|---|
| Yayasan Dashboard | Total Unit Pendidikan | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `education_units` | VERIFIED |
| Yayasan Dashboard | Total Pegawai | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `employees` | VERIFIED |
| Yayasan Dashboard | Total Guru | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `employees` + `positions` | VERIFIED |
| Yayasan Dashboard | Total Siswa Aktif | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `students` | VERIFIED |
| Yayasan Dashboard | Siswa Baru | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `students` | VERIFIED |
| Yayasan Dashboard | Mutasi Masuk / Keluar | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `students` (`metadata`) | VERIFIED |
| Yayasan Dashboard | Siswa Lulus / Alumni | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `students` | VERIFIED |
| Yayasan Dashboard | Monitoring Akademik | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `attendance_scan_logs`, `student_grades` | VERIFIED |
| Yayasan Dashboard | Monitoring Ibadah | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `mutabaah_daily_details`, `mutabaah_daily_headers` | VERIFIED |
| Yayasan Dashboard | Ranking Unit | `/api/foundation/dashboard` | `FoundationDashboardService::getUnitSummaries()` | `education_units`, `students` | VERIFIED |
| Yayasan Dashboard | Agenda Yayasan | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `pengumuman_sekolah` | VERIFIED |
| Yayasan Dashboard | Aktivitas Terbaru | `/api/foundation/dashboard` | `FoundationDashboardService::getDashboardOverview()` | `attendance_scan_logs` | VERIFIED |
| Teacher Workspace | My Classes & Students | `/api/teacher/classes` | `TeacherDashboardController::classes()` | `kelas`, `students` | VERIFIED |
| Teacher Workspace | My Log Absensi | `/api/attendance/my-logs` | `AttendanceWorkflowController::myLogs()` | `attendance_scan_logs` | VERIFIED |
