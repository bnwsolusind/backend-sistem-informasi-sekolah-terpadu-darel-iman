# Parent Portal — Alur Autentikasi (Portal Orang Tua & Siswa)

## 1. Endpoint

```
POST /api/auth/login/parent-student        (legacy)
POST /api/v2/auth/login/parent-student     (dipakai web-dashboard)
```

Keduanya **rate-limited** sejak sesi 10: `throttle:10,1` (10 percobaan/menit/IP) untuk menahan brute-force password/PIN.

Payload: `{ portal_type: "parent" | "student", identifier, password, device_name }`

## 2. Alur di `AuthService::loginParentStudent` (`app/Services/Auth/AuthService.php:182`)

1. **Cari identitas**
   - `portal_type=student` → `Student` by `nis`/`nisn`; fallback `User` by `username`/`email`.
   - `portal_type=parent` → `ParentModel` by `nik`/`phone`/`email`; fallback `User` by `username`/`phone`/`email`.
2. **Cek profil portal** — `hasPortalProfile`: siswa harus aktif; orang tua cukup ada record `parents`. Tanpa profil → `401 UnauthorizedHttpException`.
3. **Verifikasi password/PIN** → `verifyPassword`.
4. **Cek `user->is_active`** → akun nonaktif ditolak.
5. **Terbitkan token** (`createToken`) + **catat `LoginEvent`** dengan `portal_type`, `method`, `status`, `ip_address`.

## 3. Keluar (Logout)

`AuthController::logout` **mencabut token saat ini** (`$request->user()->currentAccessToken()->delete()`). Client-side, sesi portal dibersihkan; tidak ada cookie anak aktif karena model stateless.

## 4. Temuan Audit & Perbaikan Sesi 10

| Temuan | Status | Aksi |
|--------|--------|------|
| Login parent-student tanpa rate limit | **DIPERBAIKI** | `throttle:10,1` pada route `/auth/login/parent-student` dan `/v2/auth/login/parent-student` |
| Identifier & password di-validasi bersama; pesan generik | OK | Tidak membocorkan keberadaan akun |
| Profil portal diperiksa sebelum password | OK | Akun tanpa profil portal ditolak |
| Logout mencabut token | OK | Tidak ada token valid tersisa |
| State "anak aktif" hanya client-side | OK | Backend selalu memvalidasi ownership per request (stateless, fail-closed) |

## 5. Peran untuk Portal Routes

Group `/api/portal/*` diproteksi `auth:api` + `role:Orang Tua|Siswa`. Route aksi siswa (submit tugas, isi mutabaah, mulai CBT, simpan jawaban) menambah `role:Siswa` sehingga orang tua **tidak** dapat bertindak atas nama anak, hanya memantau.
