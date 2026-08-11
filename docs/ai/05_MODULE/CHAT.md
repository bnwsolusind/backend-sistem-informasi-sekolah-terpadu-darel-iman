# MODULE: CHAT

Bukti historis: `99_ARCHIVE/CHAT_ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/PARENT_PORTAL_CHILD_OWNERSHIP_MODEL.md`, `99_ARCHIVE/CHAT_SECURITY_TEST_REPORT.md`.

## Jalur Endpoint & Middleware

| Jalur | Middleware | Controller |
|---|---|---|
| `/api/portal/chat/*` | auth + portal | `StudentParentPortalController` |
| `/api/teacher/chat/*` | auth + teacher portal | `TeacherPortalController` |
| `/api/chat/*` (alias seragam) | auth + role (Ortu/Siswa/staf) | gabungan |
| `/api/employee/chat/*` | auth + role staf | `EmployeeChatController` |

Semua konteks dibaca dari **auth**, bukan request (fail-closed: tidak dikenal → 404/403).

## Matriks Keputusan

| AKSI | ORANG TUA / SISWA | GURU (wali & mapel) | PEGAWAI LAIN |
|---|---|---|---|
| Kontak guru | Wali kelas + guru mapel jadwal **aktif kelas anak** (`isValidTeacherContact`) | — | — |
| Kirim/lihat pesan guru | Wali/guru mapel aktif kelas anak saja | — | — |
| Kontak siswa | — | Hanya kelas wali (homeroom) atau jadwal aktif (`isAssignedToStudent`) | — |
| Kontak pegawai | **403** | Semua pegawai unit sama + aktif | Semua pegawai unit sama + aktif |
| Kontak siswa lewat employee chat | — | — | **403** (hanya antar-pegawai) |

## Ownership Rule (intisari)

- `isValidTeacherContact(Student, teacherUserId)`: wali kelas (via `kelas.waliKelas.user`, fallback email) ATAU guru mapel pada ClassSchedule aktif kelas siswa; selain itu false.
- `isAssignedToStudent(Request, Student)`: wali kelas (`kelas.wali_kelas_id`) ATAU ClassSchedule aktif dengan teacher/employee = guru.
- Employee directory: `user_id <> requester`, `user.is_active = true`, `unit_id = unit requester` (tanpa param unit dari request); kirim pesan → penerima wajib Employee aktif, selain itu 403.

## Frontend

- Portal: `FloatingChatWidget` + kategori `chat` di NotificationCenter.
- Unread via `notificationUnreadCount`; online/last-seen/typing hanya bila source API tersedia — dilarang fake status.

## Verifikasi

`ChatAccessScopeTest` (8 test / 18 assertion) tercatat lulus di SQLite & PostgreSQL 14 pada report terakhir; tidak direrun pada refactor dokumentasi.

## Referensi

- Detail arsip: `99_ARCHIVE/CHAT_ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/CHAT_SECURITY_TEST_REPORT.md`
