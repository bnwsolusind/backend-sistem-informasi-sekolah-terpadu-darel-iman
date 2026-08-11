# ROLE PERMISSION

Sumber kebenaran: PostgreSQL `roles`, `permissions`, `role_has_permissions`, `model_has_roles`, `model_has_permissions` (Spatie). Alias historis dipertahankan agar kontrak API tidak berubah.

## Role Kanonik (24)

| # | Role | Scope data | Template akses |
|---:|---|---|---|
| 1 | Super Admin | Global, seluruh unit | seluruh permission |
| 2 | Ketua Yayasan | Lintas unit, read/report | Foundation |
| 3 | Pengurus Yayasan | Lintas unit, read/report | Foundation |
| 4 | Sekretaris Yayasan | Lintas unit, read/report | Foundation |
| 5 | Bendahara Yayasan | Lintas unit, read/report | Foundation |
| 6 | Kepala Bidang Pendidikan | Lintas unit pendidikan | Divisi Pendidikan |
| 7 | Divisi Kurikulum | Lintas unit akademik | Waka Kurikulum |
| 8 | Divisi Kesiswaan | Lintas unit kesiswaan | Waka Kesiswaan |
| 9 | Divisi Bahasa | Lintas unit pendidikan | Divisi Pendidikan |
| 10 | Divisi Program Khusus | Lintas unit pendidikan | Divisi Pendidikan |
| 11 | Kepala Sekolah | Unit sendiri | Kepala Sekolah |
| 12 | Wakil Kepala Sekolah | Unit sendiri | Waka Kurikulum |
| 13 | Wakil Kurikulum | Unit/akademik sendiri | Waka Kurikulum |
| 14 | Wakil Kesiswaan | Unit/kesiswaan sendiri | Waka Kesiswaan |
| 15 | Tata Usaha | Unit sendiri | Tata Usaha |
| 16 | Operator | Unit sendiri | TU/Operator |
| 17 | Guru | Penugasan/jadwal/rombel sendiri | Guru |
| 18 | Guru Tahfizh | Penugasan/tahfizh sendiri | Guru Tahfizh |
| 19 | Guru BK | Siswa layanan sendiri | Guru BK |
| 20 | Wali Kelas | Rombel sendiri | Wali Kelas |
| 21 | Musyrif | Kelompok binaan sendiri | Musyrif |
| 22 | Orang Tua | Anak tertaut | Parent portal |
| 23 | Siswa | Data sendiri | Student portal |
| 24 | Alumni | Data sendiri | Alumni portal |

Verifikasi terakhir yang tercatat: 24/24 role tersedia; runtime harus tetap berasal dari relasi Spatie/database.

## Permission

- Kontrak minimum 26 permission inti tersedia (`dashboard.view`, `master.*`, `academic.*`, `attendance.*`, `lms.*`, `cbt.manage`, `grades.manage`, `report.*`, `portal.view`, `approval.manage`, `notification.manage`, `chat.manage`, `setting.manage`, `user.manage`, `permission.manage`, `role.manage`, `audit.view`, `activity.view`, dll).
- Runtime PostgreSQL: **345 permission**; permission granular lama tidak dihapus agar route, Gate, kontrak frontend kompatibel.
- Super Admin bypass `Gate::before` + seluruh permission.

### Step 04 Teaching Attendance / Monitoring

| Permission | Pemakai utama | Scope |
|---|---|---|
| `teaching_attendance.scan` | Guru dan role mengajar | Schedule guru sendiri |
| `teaching_attendance.view_own` | Guru dan role mengajar | Attendance mengajar sendiri |
| `teaching_session.start` | Guru dan role mengajar | Session dari schedule sendiri |
| `teaching_session.close` | Guru dan role mengajar | Session aktif milik sendiri |
| `teacher_presence.heartbeat` | Guru dan role mengajar | Device user sendiri |
| `teacher_monitoring.view` | Kepsek/Waka, Yayasan/Divisi, Super Admin | Unit/allowed units/global sesuai `AccessScopeService` |

QR atau frontend guard tidak menggantikan permission middleware dan ownership check backend.

## Ringkasan Akses per Keluarga Role

| Keluarga | View | Manage | Report/Audit | Scope |
|---|---|---|---|---|
| Super Admin | Semua | Semua | Semua | Global |
| Yayasan | Dashboard/master/akademik | Sesuai workflow | Export + audit | Cross-unit read |
| Bidang/divisi | Dashboard/master/akademik/attendance/LMS | Akademik sesuai jabatan | Report + audit | Cross-unit/unit |
| Pimpinan sekolah | Dashboard/master/akademik/attendance/LMS | Akademik, approval, notification | Report + audit | Unit |
| TU/Operator | Master/akademik/attendance/LMS | CRUD operasional | Sesuai permission | Unit |
| Guru/Wali/Musyrif/BK | Akademik/attendance/LMS sendiri | Penugasan sendiri | Sesuai permission | Assignment |
| Orang Tua/Siswa/Alumni | Portal milik sendiri | tidak manage global; siswa tidak membuat izin/sakit | sesuai kontrak role | Linked/self |

## Sidebar (Frontend Gate)

Sidebar `DashboardLayout.jsx` permission-driven via `/api/me`; master-unit fetch hanya dilakukan bila user memiliki permission unit/master-data. Parent dan student menu dipisahkan; backend tetap otoritas final.

## Referensi

- Scope query per role: `02_DATABASE/DATA_SCOPE.md`
- Detail: `99_ARCHIVE/ROLE_MATRIX.md`, `99_ARCHIVE/PERMISSION_MATRIX.md`, `99_ARCHIVE/ROLE_PERMISSION_DATABASE_MATRIX.md`, `99_ARCHIVE/ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/SIDEBAR_PERMISSION_MATRIX.md`, `99_ARCHIVE/CRUD_PERMISSION_MATRIX.md`, `99_ARCHIVE/ROLE_DASHBOARD_MATRIX.md`, `99_ARCHIVE/ROLE_TEST_REPORT.md`
- Audit role/permission: `99_ARCHIVE/05-audit-role-permission.md`
