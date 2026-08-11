# MODULE: LAPORAN

Bukti historis: `99_ARCHIVE/REPORT_SOURCE_OF_TRUTH_MATRIX.md`, `99_ARCHIVE/REPORT_ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/REPORT_DRILLDOWN_MATRIX.md`, `99_ARCHIVE/REPORT_EXPORT_MATRIX.md`, `99_ARCHIVE/REPORT_FILTER_MATRIX.md`, `99_ARCHIVE/REPORT_BROWSER_ACCEPTANCE.md`.

## 20 Laporan Enterprise (Source of Truth)

| # | Laporan | Service / Endpoint Utama | Scope |
|---|---|---|---|
| 1 | Laporan SDM | `SdmReportService` → `/api/foundation/laporan/sdm` | Unit & Role |
| 2 | Laporan Guru | `SdmReportService` → `/api/foundation/laporan/sdm` | Unit |
| 3 | Laporan Pegawai | `SdmReportService` → `/api/employees` | Unit |
| 4 | Laporan Siswa | `StudentReportService` → `/api/foundation/laporan/siswa` | Unit |
| 5 | Laporan Siswa Baru | `StudentReportService` | Unit & Period |
| 6 | Laporan Presensi Siswa | `AttendanceWorkflowController` → `/api/attendance/reports/summary` | Unit & Class |
| 7 | Laporan Presensi Pembelajaran | `LmsPresensiController` → `/api/lms/presensi` | Class & Teacher |
| 8 | Laporan Presensi Guru/Pegawai | `SdmReportService` → `/api/attendance/reports/summary` | Unit & Role |
| 9 | Laporan Mutasi | `MutationReportService` → `/api/foundation/laporan/mutasi` | Unit |
| 10 | Laporan Kelulusan | `GraduationReportService` → `/api/foundation/laporan/kelulusan` | Unit & Period |
| 11 | Laporan Alumni | `AlumniReportService` → `/api/foundation/laporan/alumni` | Unit & Year |
| 12 | Laporan Prestasi | `StudentReportService` | Verified Only |
| 13 | Laporan Tahfizh | `TahfizhController` → `/api/tahfizh/report` | Unit & Halaqah |
| 14 | Laporan Mutabaah | `MutabaahAnalyticsController` → `/api/mutabaah/analytics/recap` | Child/Class |
| 15 | Laporan Akademik | `AcademicLmsController` → `/api/lms/materi/stats` | Unit |
| 16 | Laporan Tugas & Submission | `LmsPenugasanController` → `/api/lms/penugasan/stats` | Class & Teacher |
| 17 | Laporan CBT | `LmsUjianController` → `/api/lms/ujian/stats` | Staff (kunci redact) |
| 18 | Laporan Nilai | `GradeController` → `/api/grades` | Class & Period |
| 19 | Laporan Rapor | `LmsRaporController` → `/api/lms/rapor/stats` | Published only |
| 20 | Laporan Lintas Unit | `CrossUnitReportService` → `/api/foundation/laporan/lintas-unit` | Foundation |

## Directives

- **Zero Mock**: payload dihitung real-time dari PostgreSQL.
- **Soft Delete Filter**: `whereNull('deleted_at')` global pada semua query laporan.
- **Period Alignment**: filter akademik ketat ke `academic_year_id` & `semester_id` aktif.
- Drill-down & filter lintas unit; export via `ExportDialog` (format Excel/PDF/JSON/CSV).

## Referensi

- Detail arsip: `99_ARCHIVE/REPORT_*`
- Export: `04_UI_UX/MODAL_DRAWER_STANDARD.md`
