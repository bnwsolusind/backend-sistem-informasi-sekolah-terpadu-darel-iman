# ROLE PERMISSION DATABASE MATRIX

Source of Truth: Spatie Permission Tables (`roles`, `permissions`, `role_has_permissions`) stored in PostgreSQL.

| ROLE | MODULE | VIEW | CREATE | UPDATE | DELETE | VERIFY | FINALIZE | EXPORT | SCOPE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Super Admin** | ALL | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Global / All Units |
| **Pengurus Yayasan** | ALL | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | Cross-Unit Monitoring |
| **Divisi Pendidikan** | Master Data, Academic, LMS, CBT, Reports | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | Multi-Unit Academic |
| **Kepala Sekolah** | School Unit, Employees, Students, LMS, Tahfizh | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | Single Unit Scope |
| **Waka Kurikulum** | Academic, Schedules, Subjects, LMS, CBT, Grades | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | Single Unit Academic |
| **Waka Kesiswaan** | Students, Attendance, Mutabaah, Tahfizh, Mutations | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | Single Unit Student |
| **TU (Tata Usaha)** | Master Data, Employees, Students, Attendance | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | Single Unit Admin |
| **Operator** | Master Data, Students, Employees | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | Single Unit Operator |
| **Guru** | Classes, Schedules, LMS, CBT, Grades, Presensi | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | Assigned Classes / Subjects |
| **Wali Kelas** | Rombel, Students, Presensi, Rapor, Mutabaah | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | Assigned Class Rombel |
| **Guru Tahfizh** | Tahfizh Records, Surah, Juz | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | Assigned Halaqah / Group |
| **Musyrif** | Mutabaah, Asrama/Worship Attendance | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | Assigned Dormitory/Group |
| **Orang Tua** | Child Portal (Presensi, Grades, Mutabaah, Chat) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | Connected Children Only |
| **Siswa** | Student Portal (Presensi, LMS, CBT, Rapor, Chat) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Self Profile Only |
