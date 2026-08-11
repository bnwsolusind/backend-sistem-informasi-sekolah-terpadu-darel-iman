# MASTER DATA DEPENDENCY MAP

Audit Session 2, 2026-08-05. Hanya status yang didukung source code dan test saat ini yang dicatat sebagai terverifikasi.

## Jenis Unit Pendidikan
MASTER: Jenis Unit Pendidikan
TABLE: `tbl_jenis_unit_pendidikan`
MODEL: `JenisUnitPendidikan`
FOREIGN KEY: direferensikan oleh Unit Pendidikan
PARENT: -
CHILD: `education_units`
USED BY MODULE: Unit, siswa, pegawai, kelas
UNIT SCOPE: Yayasan
ACADEMIC YEAR SCOPE: Tidak
SEMESTER SCOPE: Tidak
STATUS: VERIFIED — NO CHANGE REQUIRED; CRUD dan unique code/name diuji.

## Unit Pendidikan
MASTER: Unit Pendidikan
TABLE: `education_units`
MODEL: `EducationUnit`
FOREIGN KEY: `employees.unit_id`, `students.unit_id`, `tbl_kelas.unit_pendidikan_id`
PARENT: Jenis Unit Pendidikan
CHILD: Pegawai, siswa, kelas, kurikulum/mapel sesuai modul
USED BY MODULE: Seluruh modul ber-unit
UNIT SCOPE: Sumber scope operasional
ACADEMIC YEAR SCOPE: Hybrid, tergantung child
SEMESTER SCOPE: Hybrid, tergantung child
STATUS: VERIFIED — NO CHANGE REQUIRED; CRUD diuji.

## Tahun Ajaran dan Semester
MASTER: Tahun Ajaran -> Semester
TABLE: `academic_years` -> `semesters`
MODEL: `AcademicYear` -> `Semester`
FOREIGN KEY: `semesters.academic_year_id`, `tbl_kelas.tahun_ajaran_id`, `tbl_kelas.semester_id`
PARENT: - -> Tahun Ajaran
CHILD: Semester -> Kelas/Rombel dan modul akademik
USED BY MODULE: Kelas, jadwal, LMS, nilai, rapor
UNIT SCOPE: Global pada skema saat ini
ACADEMIC YEAR SCOPE: Ya
SEMESTER SCOPE: Ya
STATUS: PARTIALLY VERIFIED; dependency FK dipakai fixture test kelas, tetapi CRUD kalender penuh belum diuji pada sesi ini.

## Kurikulum dan Mata Pelajaran
MASTER: Kurikulum -> Mata Pelajaran
TABLE: `tbl_master_kurikulum` dan `subjects`
MODEL: `MasterKurikulum`, `Subject`
FOREIGN KEY: subject ke kurikulum sesuai migration modul
PARENT: Unit/Tahun Ajaran sesuai konfigurasi kurikulum
CHILD: CP, TP, modul ajar, jadwal
USED BY MODULE: Akademik dan LMS
UNIT SCOPE: Diterapkan oleh controller/repository modul
ACADEMIC YEAR SCOPE: Sesuai field kurikulum
SEMESTER SCOPE: Tidak langsung
STATUS: Mata Pelajaran VERIFIED — NO CHANGE REQUIRED (CRUD, duplicate, restore diuji); Kurikulum PARTIALLY VERIFIED.

## Pegawai, Guru, Jabatan, dan Divisi
MASTER: Jabatan/Divisi -> Pegawai -> Guru reference
TABLE: `positions`, `divisions`, `employees`, legacy `teachers`
MODEL: `Position`, `Division`, `Employee`, `Teacher`
FOREIGN KEY: `employees.unit_id`, `employees.jabatan_id`, `employees.user_id`
PARENT: Unit, Jabatan, Divisi
CHILD: Wali kelas, jadwal, scope user
USED BY MODULE: Master siswa/kelas, akademik, presensi
UNIT SCOPE: Pegawai memakai `unit_id`; list Unit A vs Unit B diuji
ACADEMIC YEAR SCOPE: Tidak langsung
SEMESTER SCOPE: Tidak langsung
STATUS: PARTIALLY VERIFIED; list scope aman, tetapi source-of-truth guru legacy belum diaudit penuh.

## Siswa, Kelas/Rombel, dan Orang Tua
MASTER: Unit -> Kelas/Rombel -> Siswa
TABLE: `tbl_kelas`, `students`, `parents`, `student_parents`
MODEL: `Kelas`, `Student`, `ParentModel`
FOREIGN KEY: `students.kelas_id -> tbl_kelas.id`; `students.parent_id -> parents.id`; pivot `student_parents(student_id,parent_id)`
PARENT: Unit, Tahun Ajaran, Semester, Kelas
CHILD: Jadwal, presensi, akademik, tahfizh, portal
USED BY MODULE: Semua alur siswa
UNIT SCOPE: Student create/list/detail dan kelas list Unit A vs B diuji
ACADEMIC YEAR SCOPE: `tbl_kelas.tahun_ajaran_id`
SEMESTER SCOPE: `tbl_kelas.semester_id`
STATUS: Student-to-Kelas RELATION FIXED. Tidak ada model/tabel rombel terpisah; `tbl_kelas` adalah source of truth aktif. CRUD parent/pivot belum tersedia pada route internal.