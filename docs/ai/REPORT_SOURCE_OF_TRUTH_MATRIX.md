# REPORT SOURCE OF TRUTH MATRIX — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Complete database source of truth mapping for all 20 required enterprise reports.

---

## 1. ENTERPRISE REPORTS SOURCE OF TRUTH MAPPING

| # | REPORT NAME | PRIMARY METRIC | SOURCE TABLE(S) | SOURCE MODEL(S) | REPORTING SERVICE / CONTROLLER | API ENDPOINT | SCOPE RULE |
|---|---|---|---|---|---|---|---|
| 1 | Laporan SDM | Total Pegawai & Guru | `employees`, `job_titles` | `Employee`, `JobTitle` | `SdmReportService` | `GET /api/foundation/laporan/sdm` | Unit & Role Scoped |
| 2 | Laporan Guru | Distribution & Subject Assignments | `teachers`, `employees` | `Teacher`, `Employee` | `SdmReportService` | `GET /api/foundation/laporan/sdm` | Unit Scoped |
| 3 | Laporan Pegawai | Employee Demographics & Status | `employees` | `Employee` | `SdmReportService` | `GET /api/employees` | Unit Scoped |
| 4 | Laporan Siswa | Student Directory & Status | `students`, `classes` | `Student`, `Kelas` | `StudentReportService` | `GET /api/foundation/laporan/siswa` | Unit Scoped |
| 5 | Laporan Siswa Baru | New Admissions Trend | `students` | `Student` | `StudentReportService` | `GET /api/foundation/laporan/siswa` | Unit & Period Scoped |
| 6 | Laporan Presensi Siswa | Student Attendance Rate | `attendances` | `Attendance` | `AttendanceWorkflowController` | `GET /api/attendance/reports/summary` | Unit & Class Scoped |
| 7 | Laporan Presensi Pembelajaran | Lesson Attendance Sync | `lms_presensi`, `schedules` | `LmsPresensi`, `Schedule` | `LmsPresensiController` | `GET /api/lms/presensi` | Class & Teacher Scoped |
| 8 | Laporan Presensi Guru/Pegawai | Staff Attendance Log | `attendances` (Reconciled) | `Attendance`, `Employee` | `SdmReportService` | `GET /api/attendance/reports/summary` | Unit & Role Scoped |
| 9 | Laporan Mutasi | Student Transfers & Mutations | `student_mutations` | `StudentMutation` | `MutationReportService` | `GET /api/foundation/laporan/mutasi` | Unit Scoped |
| 10 | Laporan Kelulusan | Graduation Finalization Rate | `graduations` | `Graduation` | `GraduationReportService` | `GET /api/foundation/laporan/kelulusan` | Unit & Period Scoped |
| 11 | Laporan Alumni | Alumni Employment/Education | `alumni`, `students` | `Alumni`, `Student` | `AlumniReportService` | `GET /api/foundation/laporan/alumni` | Unit & Year Scoped |
| 12 | Laporan Prestasi | Verified Achievements | `rekap_prestasi_siswas` | `RekapPrestasiSiswa` | `StudentReportService` | `GET /api/foundation/laporan/siswa` | Verified Only |
| 13 | Laporan Tahfizh | Memorization Target vs Actual | `tahfizh_daily_logs`, `surahs` | `TahfizhRecord`, `QuranSurah` | `TahfizhController` | `GET /api/tahfizh/report` | Unit & Halaqah Scoped |
| 14 | Laporan Mutaba'ah | Daily Worship Progress | `mutabaah_records` | `MutabaahRecord` | `MutabaahAnalyticsController` | `GET /api/mutabaah/analytics/recap` | Child/Class Scoped |
| 15 | Laporan Akademik | Curriculum & Lesson Content | `curriculums`, `lms_materi` | `MasterKurikulum`, `LmsMateri` | `AcademicLmsController` | `GET /api/lms/materi/stats` | Unit Scoped |
| 16 | Laporan Tugas & Submission | Submission Completion Rate | `lms_penugasan`, `submissions` | `LmsPenugasan`, `LmsPengumpulanTugas` | `LmsPenugasanController` | `GET /api/lms/penugasan/stats` | Class & Teacher Scoped |
| 17 | Laporan CBT | CBT Exam & Attempt Results | `lms_ujian_sesis`, `lms_ujians` | `LmsUjianSesi`, `LmsUjian` | `LmsUjianController` | `GET /api/lms/ujian/stats` | Staff Scoped (Answer Key Redacted) |
| 18 | Laporan Nilai | Subject Final Grades | `student_grades` | `StudentGrade` | `GradeController` | `GET /api/grades` | Class & Period Scoped |
| 19 | Laporan Rapor | Published Report Cards | `lms_rapors` | `LmsRapor` | `LmsRaporController` | `GET /api/lms/rapor/stats` | Published Records Only |
| 20 | Laporan Lintas Unit | Cross-Unit Executive Summary | Multi-Table Aggregation | All Primary Models | `CrossUnitReportService` | `GET /api/foundation/laporan/lintas-unit` | Foundation Scoped |

---

## 2. DIRECTIVE ON DATA ACCURACY

1. **Zero Mock Policy**: Entire payload arrays are computed in real time from PostgreSQL records.
2. **Soft Delete Filter**: `whereNull('deleted_at')` applied globally on all report queries.
3. **Period Alignment**: All academic metrics strictly filter by current active `academic_year_id` and `semester_id`.
