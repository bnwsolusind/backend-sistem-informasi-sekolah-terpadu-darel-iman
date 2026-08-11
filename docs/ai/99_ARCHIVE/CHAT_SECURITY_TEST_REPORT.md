# CHAT — SECURITY TEST REPORT (SESI 12)

`tests/Feature/ChatAccessScopeTest.php` — 8 test / 18 assertion (lulus SQLite & PostgreSQL 14).

## Tujuan

Buktikan pada level **HTTP** (bukan hanya baca kode): role middleware aktif di jalur alias,
jalur employee hanya untuk staf, ownership antar role dijalankan, direktori pegawai di-scope unit,
dan payload divalidasi.

## Matriks Test

| Test | Verifikasi |
|---|---|
| `test_chat_alias_routes_require_allowed_roles` | `/api/chat/*` menolak role di luar daftar (Orang Tua/Siswa + seluruh staf); yang boleh → 200/403 sesual scoping |
| `test_employee_chat_routes_require_staff_roles` | `/api/employee/chat/*` menolak Orang Tua/Siswa (role middleware) |
| `test_student_cannot_read_other_student_conversation` | Siswa membaca percakapan siswa lain → 403 (fail-closed) |
| `test_parent_cannot_contact_unrelated_teacher` | Orang Tua kontak guru yang bukan wali/mapel anak → 403/404 |
| `test_teacher_cannot_contact_unassigned_student` | Guru kontak siswa di luar homeroom/jadwal aktif → 403/404 |
| `test_employee_directory_is_scoped_to_own_unit` | Direktori hanya unit requester; tanpa param `unit_id` eksternal |
| `test_employee_cannot_message_non_employee_user` | Kirim ke user non-pegawai aktif → 403 |
| `test_chat_message_payload_is_validated` | Payload required + batas panjang → 422 |

## Lapisan Keamanan yang Diverifikasi

1. **Middleware**: `route:list` membuktikan `RoleMiddleware` melekat pada seluruh jalur
   `/api/chat/*`, `/api/employee/chat/*`, `/api/portal/chat/*`, `/api/teacher/chat/*` (daftar role
   tepat: portal = Orang Tua|Siswa; employee = staf tanpa Orang Tua/Siswa).
2. **Ownership (controller-level)**: `isValidTeacherContact()` (portal→guru) & `isAssignedToStudent()`
   (guru→siswa) fail-closed; tidak ada `Policy` class terpisah untuk `PortalMessage` (konsisten dengan
   pola codebase; authorization dijalankan di controller + middleware role, bukan diabaikan).
3. **Unit scope**: `employeeContacts` = pegawai `unit_id` requester + `user.is_active=true`.
4. **Recipient validation**: `sendEmployeeMessage` wajib penerima Employee aktif (403).
5. **Self-scope data**: pesan selalu difilter `sender_user_id`/`recipient_user_id` = user login.

## Hasil

```text
SQLite : ChatAccessScopeTest 8 passed / 18 assertions
PG 14  : ChatAccessScopeTest 8 passed / 18 assertions  (guard group 64/249)
```
