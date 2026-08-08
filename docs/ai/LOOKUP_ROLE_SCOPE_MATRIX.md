# LOOKUP ROLE SCOPE MATRIX — SESI 13.5

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Role-based data scoping for options API endpoints.

---

## 1. SCOPE PERMISSION MATRIX FOR OPTIONS ENDPOINTS

| ROLE | UNIT ACCESS SCOPE | PERIOD ACCESS SCOPE | DATA RETURNED IN OPTIONS |
|---|---|---|---|
| Super Admin | All Units | All Academic Periods | All Records |
| Pengurus Yayasan | All Units | All Academic Periods | All Records |
| Divisi Pendidikan | All Units | All Academic Periods | Academic & LMS Master |
| Kepala Sekolah | Own Unit Only | Active & Past Unit Periods | Own Unit Employees, Classes, Students |
| TU (Tata Usaha) | Own Unit Only | Active & Past Unit Periods | Own Unit Employees, Classes, Students |
| Guru | Own Unit Only | Active Teaching Schedules | Assigned Classes, Subjects, LMS Content |
| Guru Tahfizh | Own Unit Only | Active Halaqah Assignments | Assigned Halaqah & Tahfizh Students |
| Wali Kelas | Own Unit Only | Active Homeroom Assignment | Homeroom Students, Report Cards, Chat Contacts |
| Operator | Own Unit Only | Active Period | Master Records for Data Entry |
| Orang Tua | Child Scoped | Active Period | Registered Children Data Only |
| Siswa | Self Scoped | Active Period | Self LMS Content, Schedule, Exam Sessions |

---

## 2. CROSS-UNIT LEAKAGE PROTECTION

Backend `FormRequest` dan `Controller` memvalidasi setiap ID relasi yang dikirimkan:
- Menolak ID dari unit lain (HTTP 422 / 403).
- Menolak ID record terhapus (`soft-deleted`).
- Menolak ID dari periode akademik non-aktif kecuali ditentukan secara eksplisit oleh admin.
