# LOGIN FLOW

Alur autentikasi untuk masing-masing portal.

## Target UI dan Endpoint Login

Target dan runtime Step 02 adalah **satu UI login** yang me-resolve user → role → permission → data scope → default portal. `/masuk-keluarga` dipertahankan sebagai redirect compatibility ke `/masuk`.

```
POST /api/auth/login                         (unified identifier login)
POST /api/auth/login/admin                   (explicit compatibility)
POST /api/auth/login/employee                (explicit compatibility)
POST /api/auth/login/employee-qr             (QR employee)
POST /api/auth/login/parent-student          (explicit workspace compatibility)
POST /api/v2/auth/login/*                    (versioned compatibility)
```

Semua endpoint login di-rate-limit `throttle:10,1` (10 percobaan/menit/IP).

Payload unified: `{ identifier, password, device_name }`. Payload explicit parent/student: `{ portal_type: "parent"|"student", identifier, password, device_name }`.

## Employee (Admin/Pegawai)

- Identifier: No HP (`users.phone`), NIY/NIP (`employees.niy`/`employees.nik`), Email (`users.email`).
- Alur `AuthService`:
  1. Resolve identitas (user/employee/teacher).
  2. Verifikasi password (`Hash::check`).
  3. Cek `user->is_active`.
  4. Terbitkan Sanctum token + catat `LoginEvent`.
   5. Resolve `portal`, `default_portal`, `default_redirect`, dan daftar workspace sesuai role.

Login password/QR tidak mencatat presensi pegawai maupun kehadiran mengajar.

## Parent (Orang Tua)

- Identifier: No HP, NIK Ayah, NIK Ibu, NIS anak terhubung, atau Email.
- Resolve `ParentModel` by `nik`/`phone`/`email`; fallback `User`.
- Untuk NIS anak, resolve siswa lebih dahulu lalu household parent melalui `parent_student`/`student_parents` dan `students.parent_id`; tanpa relasi valid, login ditolak.
- `hasPortalProfile`: cukup ada record `parents` (tanpa profil → 401).
- **Multi-child**: satu login, termasuk login melalui NIS anak terhubung, dapat resolve household; daftar anak diambil dari pivot + `students.parent_id`. Parent dapat switch seluruh anak terhubung; backend memvalidasi ownership per request (anak tak terhubung → 404).
- Unified login mengembalikan `409 workspace_chooser` bila identifier valid tetapi cocok dengan parent dan student; tidak ada pemilihan role berdasarkan tebakan frontend.

## Student (Siswa)

- Identifier: NIS (`students.nis`), juga via NISN.
- Siswa wajib aktif; data ter-scope self.
- Action endpoint (submit tugas, isi mutabaah, mulai CBT, simpan jawaban) hanya role `Siswa` — orang tua tidak bisa bertindak atas nama anak, hanya memantau.
- Transaksi izin/sakit attendance dikendalikan parent; siswa hanya membaca riwayat/permission yang diizinkan.

## Logout

`AuthController::logout` mencabut token saat ini (`currentAccessToken()->delete()`). Portal stateless; konteks anak aktif client-side, selalu divalidasi ulang backend.

## Keamanan

- Identifier & password divalidasi bersama; pesan generik (tidak membocorkan keberadaan akun).
- Profil portal diperiksa sebelum password.
- Rate limit brute-force.

## Referensi

- Identitas per entitas: `03_AUTH/AUTHENTICATION.md`
- Parent portal detail: `05_MODULE/PORTAL_ORANG_TUA.md`, `99_ARCHIVE/PARENT_PORTAL_AUTH_FLOW.md`
- Student portal: `05_MODULE/PORTAL_SISWA.md`, `99_ARCHIVE/STUDENT_PORTAL_ROUTE_MAP.md`
- Portal matrix: `03_AUTH/ROLE_PORTAL_MATRIX.md`, `01_PROJECT/NAVIGATION_MATRIX.md`
