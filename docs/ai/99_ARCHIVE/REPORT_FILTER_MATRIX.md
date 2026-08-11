# REPORT FILTER MATRIX — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Filter parameters and backend validation rules for all 20 enterprise reports.

---

## 1. REPORT FILTER PARAMETERS & BACKEND VALIDATION

| REPORT NAME | SUPPORTED FILTERS | BACKEND VALIDATION RULE | DEFAULT VALUE |
|---|---|---|---|
| Laporan SDM | `unit_id`, `status`, `jabatan_id`, `search` | `unit_id` must exist in `education_units` | `unit_id = all` |
| Laporan Guru | `unit_id`, `subject_id`, `status` | `subject_id` scoped to unit | `unit_id = current` |
| Laporan Pegawai | `unit_id`, `status`, `search` | Must match user unit permission | `status = Aktif` |
| Laporan Siswa | `unit_id`, `class_id`, `status`, `search` | `class_id` must belong to `unit_id` | `status = Aktif` |
| Laporan Siswa Baru | `unit_id`, `academic_year_id`, `search` | Valid `academic_year_id` UUID | Active Academic Year |
| Laporan Presensi Siswa | `unit_id`, `class_id`, `start_date`, `end_date` | Valid ISO date range ($\le 366$ days) | Current Month |
| Laporan Presensi Pembelajaran | `class_id`, `subject_id`, `teacher_id` | Scoped to active schedule | Current Class |
| Laporan Presensi Pegawai | `unit_id`, `month`, `year`, `search` | Month 1–12, Year valid YYYY | Current Month/Year |
| Laporan Mutasi | `unit_id`, `jenis_mutasi`, `status` | `jenis_mutasi` in enum | All Types |
| Laporan Kelulusan | `unit_id`, `academic_year_id`, `status` | Finalized status check | Current Year |
| Laporan Alumni | `unit_id`, `graduation_year`, `search` | Year $\ge 2000$ | All Years |
| Laporan Prestasi | `unit_id`, `level`, `category` | Verified status filter | All Levels |
| Laporan Tahfizh | `unit_id`, `halaqah_id`, `teacher_id` | Scoped to active halaqah | Current Halaqah |
| Laporan Mutaba'ah | `class_id`, `indicator_id`, `date` | Valid date entry | Today |
| Laporan Akademik | `unit_id`, `curriculum_id`, `subject_id` | Scoped to active curriculum | Active Curriculum |
| Laporan Tugas & Submission | `class_id`, `subject_id`, `status` | Scoped to class teacher | Active Assignments |
| Laporan CBT | `exam_id`, `class_id`, `status` | Redacts answer keys for students | Selected Exam |
| Laporan Nilai | `class_id`, `subject_id`, `semester_id` | Valid semester UUID | Active Semester |
| Laporan Rapor | `class_id`, `semester_id`, `status` | Published status check | Published Only |
| Laporan Lintas Unit | `academic_year_id`, `comparison_type` | Foundation Role Only | Active Academic Year |

---

## 2. BACKEND FILTER SANITIZATION

1. **Parameter Stripping**: Unrecognized query parameters are automatically stripped before query construction.
2. **Cross-Unit Guard**: Non-foundation roles attempting to pass external `unit_id` parameters have their query overridden to their assigned unit.
