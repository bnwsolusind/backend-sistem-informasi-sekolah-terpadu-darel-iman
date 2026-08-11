# ROLE FLOW MATRIX — SESI 13

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Role-based permissions, navigation routes, CRUD actions, and security scoping matrix across 11 system roles.

---

## 1. ROLE MATRIX & ROUTE SCOPE

| ROLE NAME | DEFAULT ROUTE | ALLOWED API SCOPES | CRUD CAPABILITIES | PORTAL / REPORT ACCESS |
|---|---|---|---|---|
| Super Admin | `/dashboard` | `*` (All Scopes) | Full Create, Read, Update, Delete, Restore | All System Reports & Configs |
| Pengurus Yayasan | `/foundation` | `foundation.*`, `reports.*` | Read-only Executive Reports & Settings | Cross-Unit Foundation Portal |
| Divisi Pendidikan | `/divisi-pendidikan` | `academic.*`, `reports.*` | Read & Review Academic Content | Academic & LMS Analytics |
| Kepala Sekolah | `/kepala-sekolah` | `unit.*`, `approval.*` | Unit Level Read/Update, Delete Approval | Unit Reports & Staff Directory |
| TU (Tata Usaha) | `/tata-usaha` | `employee.*`, `student.*` | Create/Update Student & Staff Records | Administrative & Attendance Reports |
| Guru | `/guru` | `lms.*`, `teaching.*` | Manage LMS Content, Grading, Presensi | Teacher Workspace & LMS Portal |
| Guru Tahfizh | `/guru-tahfizh` | `tahfizh.*`, `mutabaah.*` | Input Tahfizh Setoran & Evaluation | Tahfizh & Mutaba'ah Workspace |
| Wali Kelas | `/wali-kelas` | `homeroom.*`, `rapor.*` | Finalize Grades, Report Cards, Chat Ortu | Homeroom Portal & Chat |
| Operator | `/operator` | `master.*`, `gate.*` | Master Entry & Gate Attendance Import | Gate & Attendance Logs |
| Orang Tua | `/parent-portal` | `parent.*` (Child Scoped) | Submit Mutaba'ah, Send Notes, Chat Guru | Parent Portal |
| Siswa | `/student-portal` | `student.*` (Self Scoped) | Submit Assignment, Take CBT, View Rapor | Student LMS & Exam Portal |

---

## 2. SECURITY SCOPING DIRECTIVE

1. **Child Ownership Scoping**: Orang Tua hanya dapat membaca data siswa yang terhubung via `parent_student_relations`.
2. **Homeroom Scoping**: Wali Kelas & Guru hanya dapat bertukar pesan chat dengan siswa/ortu yang terdaftar pada rombel / jadwal aktif mereka.
3. **Unit Scoping**: Staf unit tertentu tidak dapat mengakses data pegawai atau siswa dari unit pendidikan lain.
4. **CBT Answer Protection**: Kunci jawaban dan pembahasan CBT di-redact untuk role Siswa dan Orang Tua.
