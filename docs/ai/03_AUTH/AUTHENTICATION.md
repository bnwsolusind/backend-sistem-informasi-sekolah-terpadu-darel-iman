# AUTHENTICATION

Sumber kebenaran autentikasi: PostgreSQL + Laravel Sanctum + Spatie Permission.

## Tabel Auth (PostgreSQL)

| Tabel | Peran |
|---|---|
| `users` | Akun utama: `id`, `name`, `email`, `password`, `phone`, `is_active`, `deleted_at` |
| `roles`, `permissions`, `role_has_permissions`, `model_has_roles`, `model_has_permissions` | RBAC Spatie |
| `personal_access_tokens` | Sanctum bearer token |

Semua role/permission berasal dari PostgreSQL (Spatie); seeder hanya bootstrap idempotent.

## Hashing Password

- Driver: bcrypt via Laravel `Hash` facade.
- Model cast: `password => hashed` pada `User`.
- Verifikasi: `Hash::check($inputPassword, $user->password)` di seluruh portal.
- Password seed tersimpan sebagai hash (bukan plaintext).

## Identifier Login per Entitas

| Input | Target | Resolver |
|---|---|---|
| Email | `users.email` | `User::where('email', ...)` |
| No. HP | `users.phone` | `User::where('phone', ...)` |
| NIY / NIP | `employees.niy` / `employees.nik` | `Employee::...->user` |
| NIP Guru | `teachers.employee_number` | `Teacher::...->user` |
| NIS / NISN | `students.nis` / `students.nisn` | `Student::...->user` |
| NIK Orang Tua | `parents.nik` | `ParentModel::...->user` |
| NIS anak terhubung (parent) | `students.nis` + relasi parent | Resolve household melalui `student_parents` dan/atau `students.parent_id` |

Tidak ada kolom `username` di `users`; fallback diresolusi via `email`/`phone`.

## Unified Login Contract (Step 02)

- UI aktif hanya `/masuk`; `/masuk-keluarga` mengarah ke `/masuk`.
- `POST /api/auth/login` menerima `identifier` dan `password`; field `email` tetap diterima sebagai alias request.
- Response login membawa `portal`, `default_portal`, `default_redirect`, dan `available_workspaces`.
- Jika identifier cocok dengan lebih dari satu workspace, API mengembalikan `409 workspace_chooser`; frontend kemudian meminta workspace secara eksplisit.
- Password login dan QR employee tidak membuat record presensi otomatis. `ONLINE`, `HADIR`, dan `SEDANG MENGAJAR` tetap terpisah.

## Akun Fixture (bootstrap)

| Role | Email fixture | Identifier tambahan | Portal |
|---|---|---|---|
| Super Admin | `superadmin@school-erp.local` | email/HP | Admin |
| Pengurus Yayasan | `role.pengurus.yayasan@school-erp.local` | `TEST-NIY-03`/HP | Yayasan |
| Kepala Sekolah | `kepsek@school-erp.local` | `TEST-NIY-11`/HP | Kepala Sekolah |
| Guru | `guru@school-erp.local` | `TEST-NIY-17`/HP | Portal Guru |
| Wali Kelas | `wali.kelas@school-erp.local` | `TEST-NIY-20`/HP | Wali Kelas |
| Orang Tua | `orangtua@school-erp.local` | HP/NIK ayah/NIK ibu/NIS anak/email | Parent (2 anak tertaut) |
| Siswa | `siswa@school-erp.local` | `TEST-NIS-023`/email/HP | Student (self) |
| Alumni | `alumni@school-erp.local` | `TEST-NIS-024`/email/HP | Student/Alumni |

Verifikasi Step 02: akun demo employee, parent, dan student lulus unified login/redirect pada targeted test dan browser smoke. Tidak ada mapping akun yang boleh dibuat di controller/frontend; `AuthService` + `AuthIdentifierResolver` tetap satu jalur autentikasi.

## Kontrak Parent Identifier

- No. HP, NIK Ayah, NIK Ibu, dan NIS anak terhubung adalah identifier yang harus dapat me-resolve household parent.
- Resolusi NIS dimulai dari siswa, lalu mengambil seluruh parent yang terhubung melalui relasi langsung atau pivot.
- Jika siswa tidak memiliki relasi parent atau parent tidak aktif, login harus fail-closed; jangan memilih parent pertama atau record fallback.

## Referensi

- Login flow detail: `03_AUTH/LOGIN_FLOW.md`
- Role & permission: `03_AUTH/ROLE_PERMISSION.md`
- PostgreSQL verification: `02_DATABASE/POSTGRESQL_GUIDE.md`
- Laporan: `99_ARCHIVE/AUTH_DATABASE_SOURCE_OF_TRUTH.md`, `99_ARCHIVE/AUTH_IDENTIFIER_SOURCE_MATRIX.md`, `99_ARCHIVE/LOGIN_ACCOUNT_MATRIX.md`, `99_ARCHIVE/Account.md` (test credentials)
