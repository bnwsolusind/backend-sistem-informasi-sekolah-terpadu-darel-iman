# MASTER LOOKUP SOURCE MATRIX — SESI 13.5

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Comprehensive database-backed lookup audit for all form controls, filters, and pickers.

---

## 1. LOOKUP COMPONENT SOURCE AUDIT MATRIX

| ENTITY / LOOKUP NAME | COMPONENT CONTROLS | SOURCE OF TRUTH (POSTGRESQL MODEL) | OPTIONS ENDPOINT / API | REACT QUERY / SERVICE | AUDIT STATUS |
|---|---|---|---|---|---|
| Unit Pendidikan | Select / Unit Switcher | `EducationUnit` | `GET /api/education-units` | `educationUnitService.getAll()` | VERIFIED DB |
| Jenis Unit | Select / Dropdown | `JenisUnitPendidikan` | `GET /api/master/jenis-unit` | `jenisUnitService.getDaftar()` | VERIFIED DB |
| Tahun Ajaran | Select / Academic Filter | `AcademicYear` | `GET /api/academic/kelas/options` | `tahunAjaranService.getAll()` | VERIFIED DB |
| Semester | Select / Period Switcher | `Semester` | `GET /api/academic/kelas/options` | `semesterService.getAll()` | VERIFIED DB |
| Divisi / Jabatan | Select / Employee Form | `JobTitle`, `Division` | `GET /api/jabatan/options` | `jabatanService.options()` | VERIFIED DB |
| Pegawai | Searchable Select / Combobox | `Employee` | `GET /api/employees` | `employeeService.getAll()` | VERIFIED DB |
| Guru | Select / Teacher Picker | `Teacher` | `GET /api/kelas/options` | `employeeService.getTeachers()` | VERIFIED DB |
| Orang Tua | Searchable Select / Picker | `Parent` | `GET /api/students/parents` | `studentService.getParents()` | VERIFIED DB |
| Siswa | Async Autocomplete / Modal | `Student` | `GET /api/students` | `studentService.getAll()` | VERIFIED DB |
| Kelas & Rombel | Dependent Select / Picker | `Kelas` | `GET /api/kelas/options` | `kelasService.getOptions()` | VERIFIED DB |
| Mata Pelajaran | Select / Subject Picker | `Subject` | `GET /api/academic/subjects` | `subjectService.getAll()` | VERIFIED DB |
| Kurikulum | Select / Curriculum Picker | `MasterKurikulum` | `GET /api/academic/curriculums` | `masterKurikulumService.getAll()` | VERIFIED DB |
| Capaian Pembelajaran (CP) | Dependent Combobox / Picker | `CapaianPembelajaran` | `GET /api/lms/modul-ajar/options` | `lmsModulAjarService.options()` | VERIFIED DB |
| Tujuan Pembelajaran (TP) | Dependent Select / Picker | `TujuanPembelajaran` | `GET /api/lms/tujuan-pembelajaran/options` | `tujuanPembelajaranService.getOptions()` | VERIFIED DB |
| Jadwal Pelajaran | Select / Schedule Picker | `Schedule` | `GET /api/schedules-options` | `scheduleService.getOptions()` | VERIFIED DB |
| Bank Soal & CBT | Select / Exam Picker | `LmsBankSoal`, `LmsUjian` | `GET /api/lms/bank-soal/options` | `lmsBankSoalService.options()` | VERIFIED DB |
| Template Mutaba’ah | Select / Template Picker | `MutabaahTemplate` | `GET /api/mutabaah/options` | `mutabaahService.options()` | VERIFIED DB |
| Pembimbing / Mentor | Search Select / Picker | `Teacher`, `Employee` | `GET /api/mutabaah/enterprise/options` | `mutabaahService.enterpriseOptions()` | VERIFIED DB |
| Surah Tahfizh | Autocomplete / Quran Picker | `MasterQuranSurah` | `GET /api/quran/surahs` | `equranService.getSurahs()` | VERIFIED DB |
| Doa Harian | Select / Doa Picker | `MasterDoa` | `GET /api/master/doa` | `masterDoaService.getAll()` | VERIFIED DB |
| Child Switcher | Dropdown Switcher | `Student` (via Parent relation) | `GET /api/portal/children` | `reportService.parentChildren()` | VERIFIED DB |

---

## 2. OFFICIAL ENUMS EXEMPTIONS

Berikut adalah Business Enums resmi yang tetap digunakan sebagai konstanta karena bersifat statis berdasarkan regulasi/skema bisnis:
- **Status Pegawai**: `Tetap`, `Kontrak`, `Honorer`, `Magang`
- **Status User**: `Aktif`, `Nonaktif`, `Cuti`, `Resign`
- **Status Presensi**: `Hadir`, `Izin`, `Sakit`, `Alpa`, `Terlambat`
- **Jenis Kurikulum**: `SIT`, `Merdeka`, `Nasional`, `Pesantren`, `Lokal`
- **Jenjang Pendidikan**: `TK`, `SD`, `SMP`, `SMA`, `Ponpes`
- **Tingkat Kelas**: `1` s/d `12`, `TK A`, `TK B`
- **Level Jabatan**: `Yayasan`, `Unit`, `Sub-Unit`
