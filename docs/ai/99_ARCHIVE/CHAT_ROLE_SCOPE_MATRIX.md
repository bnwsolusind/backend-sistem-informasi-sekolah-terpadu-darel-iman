# CHAT ROLE & OWNERSHIP SCOPE MATRIX — SESI 12

Matriks keputusan akses modul chat per role, jalur endpoint, dan verifikasi test.
Semua jalur membaca konteks dari **auth**, bukan dari request (fail-closed: tidak kenal → 404/403).

## 1. Jalur Endpoint & Middleware

| Jalur | Middleware | Controller |
|---|---|---|
| `/api/portal/chat/*` | `auth:sanctum` + parent portal | `StudentParentPortalController` |
| `/api/portal/chat/contacts` (Orang Tua & Siswa) | sama | `StudentParentPortalController::chatContacts` |
| `/api/teacher/chat/*` (staf) | auth + teacher portal | `TeacherPortalController` |
| `/api/chat/*` (alias seragam) | `auth:sanctum` + **role**: Orang Tua/Siswa/…/seluruh staf | gabungan |
| `/api/employee/chat/*` | auth + **role: staf** (tanpa Orang Tua/Siswa) | `EmployeeChatController` |

Perubahan Sesi 12: alias `/api/chat/*` dan `/api/employee/chat/*` kini dibungkus role middleware
(BUG-S12-05). Sebelumnya hanya `auth:sanctum` — data tetap self-scoped tetapi non-staf dapat memanggil.

## 2. Matriks Keputusan

| AKSI | ORANG TUA / SISWA | GURU (wali & mapel) | PEGAWAI LAIN (staf) |
|---|---|---|---|
| Kontak guru (portal) | Wali kelas + guru mapel jadwal **aktif kelas anak** (`isValidTeacherContact`) | — | — |
| Kirim/lihat pesan guru (portal) | Wali/guru mapel aktif kelas anak saja | — | — |
| Kontak siswa (guru) | — | Hanya kelas **wali (homeroom)** atau **jadwal aktif** yang diajar (`isAssignedToStudent`) | — |
| Kontak pegawai (employee chat) | **403** (bukan staf) | Semua pegawai **unit yang sama** + aktif | Semua pegawai unit yang sama + aktif |
| Kirim pesan pegawai | **403** | Penerima wajib `Employee` aktif (selain itu 403) | Sama |
| Kontak siswa lewat employee chat | — | — | **403** (hanya antar-pegawai) |

Catatan: chat pegawai = **antar-pegawai** (unit yang sama). Komunikasi pegawai↔orang tua/siswa
berjalan lewat portal chat (guru) dengan aturan ownership di atas.

## 3. Rule Ownership (intisari)

- **Portal → guru** `isValidTeacherContact(Student $student, string $teacherUserId)`:
  1. Wali kelas siswa (via `kelas.waliKelas.user`, fallback email);
  2. Guru mapel pada `ClassSchedule` **aktif** kelas siswa (via `employee.user`/`teacher.user`, fallback email);
  3. Selain itu → false → 404/403.
- **Guru → siswa** `isAssignedToStudent(Request $request, Student $student)`:
  1. Wali kelas siswa (`kelas.wali_kelas_id` = teacher/employee context);
  2. `ClassSchedule` aktif pada kelas siswa dengan `teacher_id`/`employee_id` = guru.
- **Pegawai**: `employeeContacts` = `Employee` dengan `user_id <> requester`, `user.is_active = true`,
  `unit_id = unit requester` (tanpa parameter unit dari request). `sendEmployeeMessage` memvalidasi
  penerima `Employee` aktif → selain itu 403.

## 4. Perilaku Fail-Closed

- Konteks siswa/pegawai tidak tersedia (mis. auth tidak punya profil) → list kosong / 403, bukan throw.
- Siswa yang tidak terkait guru → 404 (guru) / tidak muncul di daftar (portal).
- Guru yang tidak wali/mengajar siswa → pesan chat ke siswa tersebut ditolak.
- Penerima non-pegawai aktif → 403.

## 5. Verifikasi Test — `ChatAccessScopeTest` (8 test / 18 assertion)

| Test | Inti |
|---|---|
| `test_chat_alias_routes_require_allowed_roles` | Alias `/api/chat/*` menolak role di luar daftar (Orang Tua/Siswa + staf) |
| `test_employee_chat_routes_require_staff_roles` | `/api/employee/chat/*` hanya untuk role staf (bukan Orang Tua/Siswa) |
| `test_student_cannot_read_other_student_conversation` | Siswa tidak dapat membaca percakapan milik siswa lain (fail-closed) |
| `test_parent_cannot_contact_unrelated_teacher` | Orang Tua hanya dapat kontak wali/guru mapel aktif anak; guru tidak terkait → ditolak |
| `test_teacher_cannot_contact_unassigned_student` | Guru tidak dapat mengakses siswa di luar homeroom/jadwal aktif |
| `test_employee_directory_is_scoped_to_own_unit` | Direktori pegawai hanya unit requester; unit lain tidak muncul; tanpa param `unit_id` dari request |
| `test_employee_cannot_message_non_employee_user` | Kirim ke user non-pegawai → 403 |
| `test_chat_message_payload_is_validated` | Payload pesan divalidasi (required/maksimum panjang) |

Semua 8 test **lulus di SQLite dan PostgreSQL 14** (bagian dari guard group S12: 64 passed / 249 assertions di PG).

Catatan: filter `user.is_active = true` pada direktori pegawai aktif di kode
(`EmployeeChatController::employeeContacts`), verifikasi otomatis lewat suite; disarankan smoke manual.
