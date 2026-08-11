# DASHBOARD VS REPORT METRIC CONSISTENCY AUDIT — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Verification of metric definitions and value alignment between role dashboards and enterprise reports.

---

## 1. METRIC CONSISTENCY COMPARISON MATRIX

| METRIC NAME | METRIC DEFINITION | DASHBOARD SOURCE | REPORT SOURCE | VALUE ALIGNMENT RESULT | EXPLANATION |
|---|---|---|---|---|---|
| Total Pegawai | Count of employees with `status = 'Aktif'` | `DashboardService::stats()` | `SdmReportService::getReport()` | MATCH (Identical) | Queries `Employee::where('status', 'Aktif')` |
| Total Guru | Count of active employees with teacher role/flag | `DashboardService::stats()` | `SdmReportService::getReport()` | MATCH (Identical) | Queries `Teacher::where('is_active', true)` |
| Total Siswa Aktif | Count of students with `status = 'Aktif'` | `DashboardService::stats()` | `StudentReportService::getReport()` | MATCH (Identical) | Queries `Student::where('status', 'Aktif')` |
| Presensi Kehadiran (%) | Percentage of `status = 'Hadir'` / Total Active Days | `AttendanceWorkflowController::stats()` | `AttendanceWorkflowController::report()` | MATCH (Identical) | Identical date range calculation |
| Total Mutasi Approved | Count of mutations with `status = 'Disetujui'` | `FoundationDashboardService::stats()` | `MutationReportService::getReport()` | MATCH (Identical) | Excludes pending/cancelled requests |
| Total Kelulusan Final | Count of graduations with `status = 'Lulus'` | `FoundationDashboardService::stats()` | `GraduationReportService::getReport()` | MATCH (Identical) | Excludes draft graduation lists |
| Total Alumni Registered | Count of alumni records linked to students | `FoundationDashboardService::stats()` | `AlumniReportService::getReport()` | MATCH (Identical) | Derived from `Alumni::count()` |
| Target Tahfizh Achieved | Count of setoran records meeting target | `GuruTahfizhDashboardController::stats()` | `TahfizhController::report()` | MATCH (Identical) | Deduplicates verse intervals |
| Keterisian Mutaba'ah (%) | Percentage of active students submitting daily entries | `MutabaahAnalyticsController::stats()` | `MutabaahAnalyticsController::recap()` | MATCH (Identical) | Same activity date filtering |

---

## 2. METRIC DISCREPANCY PREVENTION DIRECTIVE

- Shared metrics utilize identical Repository / Service classes for both Dashboard stats endpoints and Enterprise Report endpoints.
- No separate raw SQL queries with conflicting WHERE clauses are allowed for the same metric definition.
