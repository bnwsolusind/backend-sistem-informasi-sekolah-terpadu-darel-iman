# INTEGRATED DEMO DATASET REPORT — SESI 13

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Objective: Verify end-to-end database entity relation link integrity and idempotent seeder execution.

---

## 1. ENTITY RELATIONSHIP DEPENDENCY CHAIN

Dataset demo dibangun secara hierarkis dengan constraint Foreign Key yang ketat dan idempotent:

```text
Yayasan (Master Base)
 └── Unit Pendidikan (SD, SMP, SMA, SMK)
      ├── Tahun Ajaran & Semester
      ├── Pegawai (Jabatan, Staf, TU, Operator)
      │    └── Guru (Guru Mapel, Guru Tahfizh, Wali Kelas)
      ├── Orang Tua (Ayah, Ibu, Wali)
      │    └── Siswa (NISN, Unit, Status Aktif)
      │         ├── Kelas & Rombel (Wali Kelas, Room Assignment)
      │         │    ├── Jadwal Pelajaran (Guru Mapel, Jam Ke)
      │         │    ├── Presensi Harian & Jam Pelajaran
      │         │    ├── Materi Pembelajaran & Referensi (LMS)
      │         │    ├── Penugasan LMS (Task & Submissions)
      │         │    ├── CBT Bank Soal, Ujian & Sesi (Auto-Timeout Active)
      │         │    ├── Rekap Nilai Akademik & Rapor (Struktur Kurikulum)
      │         │    ├── Tahfizh Surah & Mutaba'ah Yaumiyah (Target Evaluation)
      │         │    ├── Prestasi, Mutasi Siswa & Kelulusan (Alumni)
      │         │    └── Informasi Sekolah & Notifikasi Real-Time
```

---

## 2. SEEDER EXECUTION MATRIX

| SEEDER FILE | ENTITY MODIFIED | RECORD COUNT (IDEMPOTENT) | FK DEPENDENCIES | STATUS |
|---|---|---|---|---|
| `RolePermissionSeeder` | Roles & Permissions | 11 Roles / 85+ Perms | System Base | PASS |
| `AttendancePermissionSeeder` | Attendance Perms | 12 Perms | Roles | PASS |
| `DefaultRoleUserSeeder` | Users | 11 Role Accounts | Roles | PASS |
| `SiteSettingsSeeder` | System Config | 1 Global Config | None | PASS |
| `StudentCardSettingsSeeder` | Card Config | 1 Template Config | None | PASS |
| `MasterJenisUnitPendidikanSeeder` | Unit Types | 4 Types | None | PASS |
| `DataDummyUnitPendidikanSeeder` | Education Units | 4 Units | Unit Types | PASS |
| `MasterJabatanSeeder` | Job Titles | 8 Titles | None | PASS |
| `DataDummyPegawaiSeeder` | Employees | 20+ Employees | Units, Job Titles | PASS |
| `TeacherSeeder` | Teachers | 12 Teachers | Employees | PASS |
| `ParentSeeder` | Parents | 15 Parents | Users | PASS |
| `DataDummySiswaSeeder` | Students | 30+ Students | Units, Parents | PASS |
| `MasterKurikulumSeeder` | Curriculums | 3 Curriculums | Units | PASS |
| `SubjectSeeder` | Subjects | 25+ Subjects | Units, Curriculums | PASS |
| `KelasSeeder` | Classes & Rombel | 12 Classes | Units, Teachers | PASS |
| `JadwalPelajaranSeeder` | Schedules | 40+ Schedules | Classes, Subjects, Teachers | PASS |
| `ModulSemesterSeeder` | Semester Modules | 8 Modules | Curriculums, Units | PASS |
| `ModulAjarSeeder` | Teaching Modules | 15+ Modules | Subjects, Teachers | PASS |
| `LmsMateriSeeder` | LMS Materials | 20+ Materials | Subjects, Classes | PASS |
| `LmsPenugasanSeeder` | Assignments | 15+ Assignments | Subjects, Classes | PASS |
| `LmsPengumpulanTugasSeeder` | Submissions | 25+ Submissions | Assignments, Students | PASS |
| `LmsBankSoalSeeder` | Question Banks | 10+ Question Banks | Subjects, Teachers | PASS |
| `LmsUjianSeeder` | Exams & Sessions | 8 Exams / 20+ Sessions | Question Banks, Classes | PASS |
| `LmsPenilaianSeeder` | Assessment Formulas | 4 Formulas | Units, Subjects | PASS |
| `StudentGradesSeeder` | Grades | 50+ Grade Records | Students, Subjects | PASS |
| `LmsRaporSeeder` | Report Cards | 30+ Report Cards | Students, Classes | PASS |
| `AttendanceSeeder` | Attendance Logs | 100+ Logs | Students, Classes | PASS |
| `WorshipAttendanceSeeder` | Worship Logs | 100+ Logs | Students | PASS |
| `MutabaahEnterpriseSeeder` | Mutabaah Records | 150+ Records | Students, Indicators | PASS |
| `QuranSurahSeeder` | Quran Surahs | 114 Surahs | None | PASS |
| `DoaSeeder` | Daily Prayers | 30+ Prayers | None | PASS |
| `PrayerScheduleSeeder` | Prayer Times | 12 Monthly Sets | Units | PASS |
| `TahfizhSeeder` | Tahfizh Records | 50+ Records | Students, Surahs | PASS |
| `StudentMutationSeeder` | Student Mutations | 5 Mutation Records | Students, Units | PASS |

---

## 3. IDEMPOTENCY & VERIFICATION

Seluruh seeder menggunakan pattern `updateOrCreate` atau `firstOrCreate` berbasis identifier unik (misal `email`, `nisn`, `kode_unit`, `code`). Running `php artisan db:seed` secara berulang **tidak akan menghasilkan duplikasi data atau constraint error**.
