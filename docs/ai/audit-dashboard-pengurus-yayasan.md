# Audit Dashboard Pengurus Yayasan

Sistem Manajemen Sekolah Terpadu Dar el-Iman

## Matrix Audit Modul & Data Source

| Halaman/Fitur | Sumber Data | Model | Relasi | API | UI | Permission | Status | Tindakan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Unit Pendidikan | `education_units`, `jenis_unit_pendidikan` | `EducationUnit`, `JenisUnitPendidikan` | `belongsTo(JenisUnitPendidikan)`, `hasMany(Employee)`, `hasMany(Kelas)` | `GET /api/v1/education-units`, `GET /api/foundation/units` | Modern Soft Dashboard & Card Grid | `foundation.unit.view` | Lengkap dan Berfungsi | Pertahankan & Tambah View Scope Agregasi |
| Pegawai & Guru | `employees`, `teachers`, `positions`, `divisions` | `Employee`, `Teacher`, `Position`, `Division` | `belongsTo(EducationUnit)`, `belongsTo(Position)`, `belongsTo(Division)` | `GET /api/v1/employees`, `GET /api/foundation/employees` | Table & Detail Drawer (Read-Only) | `foundation.employee.view`, `foundation.teacher.view` | Lengkap dan Berfungsi | Agregasi Data Lintas Unit Tanpa CRUD |
| Data Siswa | `students`, `tbl_kelas`, `academic_years`, `semesters` | `Student`, `Kelas`, `AcademicYear`, `Semester` | `belongsTo(EducationUnit)`, `belongsTo(Kelas)` | `GET /api/v1/students`, `GET /api/foundation/students` | Table & Detail Drawer (Read-Only) | `foundation.student.view` | Lengkap dan Berfungsi | Filter Tahun Ajaran & Semester Aktif |
| Siswa Baru | `students`, `metadata`, `tahun_masuk` | `Student`, `AcademicYear` | `belongsTo(EducationUnit)` | `GET /api/foundation/new-students` | Table Ringkasan Per Unit & Detail | `foundation.student_new.view` | Lengkap dan Berfungsi | Agregasi Penerimaan Tahun Ajaran Aktif |
| Mutasi Siswa | `students`, `metadata->mutasi` | `Student` | `belongsTo(EducationUnit)` | `GET /api/foundation/student-mutations` | Tabbed Table (Masuk/Keluar/Berhenti) | `foundation.student_mutation.view` | Lengkap dan Berfungsi | Agregasi Status Mutasi |
| Kelulusan & Alumni | `students`, `alumni` | `Student`, `Alumni` | `belongsTo(EducationUnit)` | `GET /api/foundation/graduations`, `GET /api/foundation/alumni` | Tabbed Table (Tingkat Akhir, Lulus, Alumni) | `foundation.graduation.view`, `foundation.alumni.view` | Lengkap dan Berfungsi | Agregasi Kelulusan & Data Alumni |
| Informasi Sekolah | `pengumuman_sekolahs`, `berita` | `PengumumanSekolah` | `belongsTo(User)` | `GET /api/foundation/information` | Tabbed Card Grid & Detail Reader | `foundation.information.view` | Lengkap dan Berfungsi | Agregasi Berita & Pengumuman Aktif |
| Laporan Lintas Unit | Agregasi Seluruh Tabel | Multi-Model | Agregasi Dynamic Query | `GET /api/foundation/reports` | Export Preview & Download (PDF/Excel) | `foundation.report.view`, `foundation.report.export` | Lengkap dan Berfungsi | Dynamic Reporting & File Stream |

## Jaminan Non-Duplikasi & Aturan Non-Breaking

1. **Migration Baru**: Tidak ada.
2. **Tabel Baru**: Tidak ada.
3. **Model Duplikat**: Tidak ada.
4. **CRUD Duplikat**: Tidak ada.
5. **Data Hardcode**: Tidak ada.
6. **Perilaku Existing**: Seluruh controller, service, dan route existing dipertahankan tanpa perubahan breaking.
