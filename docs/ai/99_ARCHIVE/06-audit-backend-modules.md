# 06-AUDIT BACKEND MODULES — SIMSIT

## Matriks Audit Modul Backend SIMSIT

| Nama Modul | Service / Repository | API Controller | Dynamic Filter & Pagination | Transaction & Rollback | Audit Log | Status Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A. Dashboard Pemantauan** | `DashboardPemantauanService` | `FoundationDashboardController` | Unit, Period, Year | N/A (Read) | Ya | Lengkap & Berfungsi |
| **B. Absensi Digital** | `GateAttendanceService`, `WorshipAttendanceService` | `GateAttendanceController`, `WorshipAttendanceController` | Date, Unit, Status, Method | DB Transaction | Ya | Lengkap & Berfungsi |
| **C. Tahfizh & Mutabaah** | `TahfizhService`, `MutabaahEnterpriseService` | `TahfizhController`, `MutabaahEnterpriseController` | Student, Date Range, Category | DB Transaction | Ya | Lengkap & Berfungsi |
| **D. Akademik & LMS** | `MasterKurikulumService`, `ModulAjarService`, `SubjectService` | `SubjectController`, `LmsModulAjarController`, `LmsUjianController` | Unit, Subject, Kurikulum | DB Transaction | Ya | Lengkap & Berfungsi |
| **E. Portal Ortu & Siswa** | `StudentParentPortalService` | `StudentParentPortalController` | Parent ID, Child Student ID | N/A (Read) | Ya | Lengkap & Berfungsi |
| **F. Master Data Core** | `EducationUnitService`, `EmployeeService`, `StudentService` | `EducationUnitController`, `StudentController`, `EmployeeController` | Unit, Search, Active Status | DB Transaction | Ya | Lengkap & Berfungsi |
| **G. Mutasi & Alumni** | `StudentMutationService`, `AlumniService` | `StudentMutationController`, `AlumniController` | Type, Status, Academic Year | DB Transaction | Ya | Lengkap & Berfungsi |
| **H. Informasi & Chat** | `NotificationService`, `PortalMessageService` | `NotificationController`, `TeacherPortalController` | Recipient, Unread Only | DB Transaction | Ya | Lengkap & Berfungsi |

---

## Standarisasi Penanganan Error & Transaction
1. **Multi-Table Operations**: Penggunaan `DB::transaction(function() { ... })` diterapkan pada simpan setoran tahfizh, mutasi siswa, absensi gerbang, dan pembuatan modul ajar.
2. **Audit Logging**: Perubahan status presensi dan request hapus terlindungi oleh `attendance_audit_logs` & `delete_requests`.
