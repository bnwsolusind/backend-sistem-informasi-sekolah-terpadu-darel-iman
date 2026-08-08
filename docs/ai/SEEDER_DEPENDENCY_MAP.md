# Seeder Dependency Map

Generated: 2026-08-08

## Execution Order (DatabaseSeeder.php)

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Core Auth & System Configuration                    │
│                                                              │
│  RolePermissionSeeder ──► 55 roles, 230+ permissions         │
│       │                                                      │
│       ▼                                                      │
│  AttendancePermissionSeeder ──► attendance-specific perms     │
│       │                                                      │
│       ▼                                                      │
│  DefaultRoleUserSeeder ──► 15 test user accounts             │
│       │                                                      │
│       ▼                                                      │
│  SiteSettingsSeeder ──► site configuration                   │
│  StudentCardSettingsSeeder ──► card template settings         │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Master Data Organizations & Education Units         │
│                                                              │
│  MasterJenisUnitPendidikanSeeder ──► unit types (TK-SMA)     │
│       │                                                      │
│       ▼                                                      │
│  DataDummyUnitPendidikanSeeder ──► 12+ education units       │
│       │                                                      │
│       ▼                                                      │
│  MasterJabatanSeeder ──► position codes (JBT-001 etc)        │
│       │                                                      │
│       ▼                                                      │
│  DataDummyPegawaiSeeder ──► employee records + teachings     │
│       │                                                      │
│       ▼                                                      │
│  TeacherSeeder ──► teacher records linked to users           │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Parents & Students                                  │
│                                                              │
│  ParentSeeder ──► 3 parent records + user accounts           │
│       │                                                      │
│       ▼                                                      │
│  DataDummySiswaSeeder ──► 5 student records + classes        │
│       │  (ensures academic_year & semester exist)             │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Academic Master                                     │
│                                                              │
│  MasterKurikulumSeeder ──► curriculum definitions             │
│       │                                                      │
│       ▼                                                      │
│  SubjectSeeder ──► subjects per unit/level (40+ subjects)    │
│       │                                                      │
│       ▼                                                      │
│  KelasSeeder ──► tbl_kelas records per unit                  │
│       │                                                      │
│       ▼                                                      │
│  JadwalPelajaranSeeder ──► class schedules                   │
│       │                                                      │
│       ▼                                                      │
│  ModulSemesterSeeder ──► semester modules                    │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 5: LMS Content & Evaluasi (12 seeders)                 │
│                                                              │
│  ModulAjarSeeder ──► teaching modules                        │
│  LmsReferensiSeeder ──► references                           │
│  LmsAktivitasBelajarSeeder ──► activities                    │
│  LmsMediaSeeder ──► media files                              │
│  LmsDiskusiSeeder ──► discussions                            │
│  LmsPenugasanSeeder ──► assignments                          │
│  LmsPengumpulanTugasSeeder ──► submissions                   │
│  LmsPresensiSeeder ──► LMS attendance                        │
│  PresensiPembelajaranSeeder ──► lesson attendance             │
│  LmsBankSoalSeeder ──► question banks                        │
│  LmsUjianSeeder ──► exams                                    │
│  LmsPenilaianSeeder ──► grading                              │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 6: Grades & Report Cards                               │
│                                                              │
│  StudentGradesSeeder ──► student grade records               │
│  LmsRaporSeeder ──► academic report cards                    │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 7: Attendance, Islamic Modules & Integration           │
│                                                              │
│  AttendanceSeeder ──► attendance records (students & staff)  │
│  WorshipAttendanceSeeder ──► worship attendance              │
│  MutabaahEnterpriseSeeder ──► mutabaah categories/templates  │
│  QuranSurahSeeder ──► Quran surah data                       │
│  DoaSeeder ──► doa/prayer data                               │
│  PrayerScheduleSeeder ──► prayer schedules                   │
│  TahfizhSeeder ──► tahfizh records                           │
│  SuperadminStudentLinkSeeder ──► integrated test data         │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 8: Dev-Only (env guarded)                              │
│                                                              │
│  StudentMutationSeeder ──► mutation/transfer records         │
│  (only in local/development/testing environments)            │
└─────────────────────────────────────────────────────────────┘
```

## FK Dependency Chain

```
users
  └── roles/permissions (Spatie)
  └── personal_access_tokens
  └── sessions

education_units
  └── jenis_unit_pendidikan FK

positions
  └── employees FK
      └── employee_teachings FK

academic_years
  └── semesters FK
  └── classes FK
  └── tbl_kelas FK

teachers
  └── classes (homeroom_teacher_id) FK
  └── materials FK
  └── assignments FK

parents
  └── students FK
      └── attendances FK
      └── tahfizh_records FK
      └── student_grades FK

subjects
  └── materials FK
  └── assignments FK
  └── lms_modul_ajar FK

classes
  └── students FK
  └── class_schedules FK
```

## Total Seeders: 41
