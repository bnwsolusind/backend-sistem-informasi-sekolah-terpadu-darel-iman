# DASHBOARD DATA SCOPE MATRIX — SESI 9

Tanggal: 2026-08-06
Tujuan: memetakan CAKUPAN DATA (scope) tiap dashboard per role. Jaminan: setiap user hanya melihat data miliknya/unitnya — tanpa IDOR, tanpa bocor data global.

| Dashboard / Endpoint | Scope Utama | Unit/Kelas/Assignment | Status (Sesi 9) |
|---|---|---|---|
| `/api/dashboard/super-admin` | Global (Super Admin) | seluruh unit | OK |
| `/api/foundation/dashboard` | Lintas unit untuk yayasan | user memilih unit; orang tua di-scope `whereHas('students', whereIn('unit_id',$unitIds))` | FIXED (BUG-S9-05) |
| `/api/dashboard/kepala-sekolah` | Unit terpilih `$targetUnitId` | `Kelas::where('unit_pendidikan_id', $targetUnitId)`; attendance `whereIn('student_id', pluck(studentQuery))` | FIXED (BUG-S9-05) |
| `/api/dashboard/divisi-pendidikan` | Unit milik divisi (`unitIds`) | siswa/guru/laporan bulanan per `unitIds` | OK (validated) |
| `/api/dashboard/waka-kurikulum` | Unit terpilih | kelas/akademik per unit | OK |
| `/api/dashboard/waka-kesiswaan` | Unit terpilih | `StudentNote` + `RekapPrestasiSiswa` scoped `whereIn('student_id',$studentIds)` | FIXED (BUG-S9-09) |
| `/api/dashboard/tata-usaha` | Unit terpilih | attendance hari ini scoped siswa unit | FIXED (BUG-S9-09) |
| `/api/dashboard/wali-kelas` | Hanya homeroom | `class_id` request HANYA diterima bila ∈ `$allowedClassIds`; `selectedClass` dari `$homeroomClasses` | FIXED (BUG-S9-06) |
| `/api/dashboard/guru-tahfizh` | Assignment milik user | `count($assignedStudentIds)`; tanpa assignment → 0 | FIXED (BUG-S9-07) |
| `/api/dashboard/guru-bk` | Unit terpilih | siswa/pembinaan per unit | OK |
| `/api/dashboard/operator` | Unit milik user | `Employee::user_id` → unit; siswa & pegawai per unit | FIXED (BUG-S9-09) |
| `/api/dashboard-pemantauan/*` | Global (pemantauan) | seluruh unit; wajib `dashboard.pemantauan.lihat` | FIXED (BUG-S9-01) |
| `/api/teacher/dashboard` | Employee milik user | jadwal/kelas ajar/mutabaah milik employee; unverified mutabaah scoped `whereIn('supervisor_assignment_id',$assignmentIds)` | FIXED (BUG-S9-10) |
| `/api/students/dashboard` | User itu sendiri | siswa terhubung ke akun user | OK |
| `/api/portal/dashboard` | Anak dari relasi orang tua | child switcher hanya menampilkan anak terhubung | OK |
| `/api/portal/alumni/dashboard` | `user_id` milik user | alumni scope `user_id` only | OK |

## Kolom Kunci yang Dipakai (perbaikan Sesi 9)
- `tbl_kelas.unit_pendidikan_id` (BUKAN `unit_id`).
- `students.unit_id`, `students.kelas_id`, `students.nis`, `students.nisn`, `students.gender`, `students.is_active`, `students.status`.
- `employees.niy` (wajib).
- `student_notes.content` (TIDAK ada kolom `title`).
- `mutabaah_daily_headers.supervisor_assignment_id` + `template_id` (wajib).
- `attendances.attendance_date`, `attendances.status`.

## Verifikasi
- `DashboardRoleAccessTest` (8 test, 46 assertions, PASS): role provider 13+ endpoint, guru 403 ke dashboard lain, `class_id` luar scope diabaikan, guru tahfizh tanpa assignment = 0, alumni hanya data sendiri, pemantauan wajib permission, foundation wajib permission.
