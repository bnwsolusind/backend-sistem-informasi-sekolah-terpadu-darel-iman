# 02-AUDIT MODEL RELATIONS — SIMSIT

## Pemetaan 91 Eloquent Model SIMSIT

### 1. Struktur Relasi Entitas Utama (Core Hierarchy)
```text
Yayasan (Master / Foundation Scope)
 └── EducationUnit (Unit Pendidikan) [UUID]
      ├── JenisUnitPendidikan [BigInteger]
      ├── AcademicYear (Tahun Ajaran) [UUID]
      ├── Semester [UUID]
      ├── Division (Divisi Work Unit) [UUID]
      ├── Position (Jabatan & Satuan Kerja) [UUID]
      ├── Employee (Pegawai / Guru) [UUID] ──> Teacher [UUID]
      └── Student (Siswa) [UUID]
           ├── ParentModel (Orang Tua / Wali) [UUID] (via student_parent_pivot)
           ├── Kelas / tbl_kelas [UUID]
           ├── ClassSchedule (Jadwal Kelas) [UUID]
           ├── Attendance (Presensi Digital / Gate / Shalat) [BigInteger]
           ├── TahfizhRecord & TahfizhDailyLog [UUID / BigInteger]
           ├── MutabaahDailyHeader & MutabaahEntry [UUID]
           ├── StudentGrade & LmsPenilaian [BigInteger / UUID]
           └── StudentNote & PortalMessage [BigInteger]
```

---

## Tabel Audit Relasi & Castings Model Kunci

| Model Class | Table | Key Type | SoftDeletes | Primary Relasi | Status Audit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `User` | `users` | UUID | Tidak | `belongsTo(EducationUnit)`, `belongsToMany(Role)` | Sesuai |
| `EducationUnit` | `education_units` | UUID | Ya | `belongsTo(JenisUnitPendidikan)`, `hasMany(Student)` | Sesuai |
| `JenisUnitPendidikan` | `master_jenis_unit_pendidikan` | BigInt | Ya | `hasMany(EducationUnit)` | Sesuai |
| `Student` | `students` | UUID | Ya | `belongsTo(EducationUnit)`, `belongsTo(Kelas, 'kelas_id')`, `belongsToMany(ParentModel)` | Sesuai |
| `ParentModel` | `parents` | UUID | Ya | `belongsToMany(Student)` | Sesuai |
| `Employee` | `employees` | UUID | Ya | `belongsTo(User)`, `belongsTo(EducationUnit)`, `belongsTo(Division)` | Sesuai |
| `Teacher` | `teachers` | UUID | Ya | `belongsTo(Employee)`, `hasMany(ClassSchedule)` | Sesuai |
| `Kelas` | `tbl_kelas` / `classes` | UUID | Ya | `belongsTo(EducationUnit)`, `hasMany(Student, 'kelas_id')` | Sesuai |
| `Subject` | `subjects` | UUID | Ya | `belongsTo(EducationUnit)`, `belongsTo(MasterKurikulum)` | Sesuai |
| `MasterKurikulum` | `master_kurikulum` | UUID | Ya | `belongsTo(EducationUnit)`, `hasMany(Subject)` | Sesuai |
| `ClassSchedule` | `class_schedules` | UUID | Ya | `belongsTo(Teacher)`, `belongsTo(Subject)`, `belongsTo(Kelas)` | Sesuai |
| `Attendance` | `attendances` | BigInt | Ya | `belongsTo(Student)`, `belongsTo(ClassSchedule)` | Sesuai |
| `TahfizhRecord` | `tahfizh_records` | UUID | Ya | `belongsTo(Student)`, `belongsTo(Employee, 'guru_id')` | Sesuai |
| `MutabaahDailyHeader` | `mutabaah_daily_headers` | UUID | Ya | `belongsTo(Student)`, `hasMany(MutabaahDailyDetail)` | Sesuai |
| `LmsModulAjar` | `lms_modul_ajar` | UUID | Ya | `belongsTo(Subject)`, `belongsTo(Teacher)`, `belongsToMany(CapaianPembelajaran)` | Sesuai |
| `SiteSetting` | `site_settings` | BigInt | Ya | Global Key-Value Config Store | Sesuai |

---

## Verifikasi Integritas Relasi Eloquent
1. Seluruh relasi `Student` ke `Kelas` menggunakan kolom `kelas_id` yang konsisten.
2. Aksesor gambar/foto `Student` telah memprioritaskan kolom `photo` secara aman sebelum beralih ke metadata.
3. Seluruh relasi `EducationUnit` ke `JenisUnitPendidikan` telah dihubungkan via `jenis_unit_id` (BigInteger FK).
