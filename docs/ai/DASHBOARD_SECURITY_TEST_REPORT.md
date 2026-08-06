# DASHBOARD SECURITY TEST REPORT — SESI 9

Tanggal: 2026-08-06
File test utama: `backend/tests/Feature/DashboardRoleAccessTest.php` (8 test, 46 assertions — PASS).

## 1. Hasil Uji Keamanan (Otomatis)

| # | Skenario | Ekspektasi | Hasil |
|---|---|---|---|
| 1 | Endpoint dashboard tanpa autentikasi | 401/403 | PASS (semua endpoint dashboard wajib auth) |
| 2 | Setiap role hanya akses dashboard sendiri (provider 13 role + endpoint) | 200 | PASS |
| 3 | Guru mencoba akses dashboard role lain | 403 | PASS |
| 4 | Foundation dashboard butuh `foundation.dashboard.view` | Guru 403, Yayasan 200 | PASS |
| 5 | Pemantauan ringkasan butuh `dashboard.pemantauan.lihat` | Guru 403, Yayasan 200, Admin 200 | PASS (BUG-S9-01/02) |
| 6 | Wali Kelas `class_id` luar scope homeroom diabaikan | tidak memengaruhi data | PASS (BUG-S9-06, anti-IDOR) |
| 7 | Guru Tahfizh tanpa assignment → 0 (bukan semua siswa) | 0 binaan | PASS (BUG-S9-07) |
| 8 | Alumni dashboard hanya data milik user (`user_id`) | scope sendiri | PASS |

## 2. Perbaikan Keamanan Sesi 9
- **BUG-S9-01**: grup `/api/dashboard-pemantauan/*` kini `can:dashboard.pemantauan.lihat` (sebelumnya akses terbuka untuk user terautentikasi mana pun).
- **BUG-S9-02**: `DashboardPemantauanController::pastikanHakAkses` berbasis permission (bukan hardcode role yang mengkontradiksi seeder); write routes menuntut `dashboard.pemantauan.kelola`.
- **BUG-S9-03/04**: frontend fallback Admin → `/dashboard/pemantauan` (tidak lagi memanggil `/foundation/dashboard` yang 403); route pemantauan di-gate.
- **BUG-S9-05 s.d. BUG-S9-10**: scope unit/kelas/assignment/employee per user (IDOR ditutup) — lihat BUG_FIX_LOG.md.

## 3. Prinsip yang Dijaga
- `Admin` TIDAK punya permission Super Admin (hanya `dashboard.view` + `dashboard.pemantauan.lihat` view-only).
- Frontend-only auth TIDAK dipakai sebagai keamanan utama — backend selalu menegakkan permission (`can:`) dan scope data.
- Tidak ada data uji tersisa di profil production; test memakai sqlite `:memory:` + `RefreshDatabase`.

## 4. Celah Tersisa (di-track)
- CRUD pemantauan tiap resource belum diuji per-endpoint secara terpisah (direkomendasikan di sesi berikutnya — lihat REMAINING_ISSUES.md #2).
