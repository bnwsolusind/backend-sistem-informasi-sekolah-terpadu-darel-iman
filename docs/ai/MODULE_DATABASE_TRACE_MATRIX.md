# MODULE DATABASE TRACE MATRIX

## End-to-End PostgreSQL Data Flow Reconciliation

All priority modules were audited and verified reading directly from PostgreSQL tables without mock fallbacks.

| Module Name | Frontend Page | API Endpoint | Controller & Service | PostgreSQL Table | DB Row Count | Status |
| --- | --- | --- | --- | --- | --- | --- |
| **Super Admin Dashboard** | `DashboardOverviewPage` | `/api/dashboard/super-admin` | `DashboardController` | `users`, `students`, `employees` | > 0 | VERIFIED |
| **Yayasan Dashboard** | `ExecutiveDashboardPage` | `/api/foundation/dashboard` | `FoundationDashboardController` | `education_units`, `employees` | > 0 | VERIFIED |
| **Unit Pendidikan** | `MasterEducationUnitPage` | `/api/education-units` | `EducationUnitController` | `education_units` | > 0 | VERIFIED |
| **Pegawai** | `MasterEmployeesPage` | `/api/employees` | `EmployeeController` | `employees` | > 0 | VERIFIED |
| **Guru** | `MasterEmployeesPage` | `/api/employees?role=Guru` | `EmployeeController` | `employees`, `teachers` | > 0 | VERIFIED |
| **Siswa** | `MasterStudentsPage` | `/api/students` | `StudentController` | `students` | > 0 | VERIFIED |
| **Kelas / Rombel** | `MasterRombelPage` | `/api/classes` | `KelasController` | `classes` | > 0 | VERIFIED |
| **Jadwal** | `MasterSchedulesPage` | `/api/schedules` | `ScheduleController` | `schedules` | > 0 | VERIFIED |
| **Presensi** | `PresensiWorkflowPage` | `/api/attendances/rekap` | `AttendanceWorkflowController` | `student_attendances` | > 0 | VERIFIED |
| **LMS** | `LmsWorkspacePage` | `/api/lms/courses` | `LmsCourseController` | `lms_courses` | > 0 | VERIFIED |
| **Tahfizh** | `TahfizhPage` | `/api/tahfizh/records` | `TahfizhRecordController` | `tahfizh_records` | > 0 | VERIFIED |
| **Mutabaah** | `MutabaahPage` | `/api/mutabaah/records` | `MutabaahRecordController` | `mutabaah_records` | > 0 | VERIFIED |
| **Notifikasi** | `DashboardLayout` | `/api/notifications` | `NotificationController` | `notifications` | > 0 | VERIFIED |
| **Chat** | `EmployeeChatPage` | `/api/chat/contacts` | `EmployeeChatController` | `chat_messages` | > 0 | VERIFIED |
| **Laporan** | `ReportsPage` | `/api/reports/overview` | `ReportController` | multiple tables | > 0 | VERIFIED |
