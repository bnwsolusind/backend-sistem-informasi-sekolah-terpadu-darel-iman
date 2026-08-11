# DASHBOARD REGRESSION REPORT — SESI 9

Tanggal: 2026-08-06

## 1. Ringkasan Eksekusi
- Backend suite penuh: `php artisan test` → **Tests: 5 failed, 202 passed (758 assertions)**.
- Kelima kegagalan adalah **pre-existing fixture bugs** (BUKAN dari perubahan Sesi 9):
  - `MutabaahCrudFullExecutionTest` (3 gagal) — fixture legacy kolom `education_unit_id`, `student_notes` tanpa `title`.
  - `TahfizhCalculationAndOwnershipTest` (2 gagal) — FK NOT NULL `supervisor_assignment_id`/`template_id` di mutabaah headers.
- **Bukti pre-existing**: `git stash push -- app database/seeders routes tests/Feature/TeacherPortalApiTest.php` lalu baseline tetap gagal 5; `git stash pop` sukses.
- Sebelum Sesi 9: 201 passed / 5 failed. Setelah Sesi 9: **202 passed / 5 failed** (bertambah 1 test baru pemantauan yang lulus; 0 regresi baru).

## 2. Hasil per Area

| Area | Sebelum | Sesudah | Regresi? |
|---|---|---|---|
| DashboardRoleAccessTest (baru) | — | 8 passed (46 assertions) | — |
| TeacherPortalApiTest (diubah, role Guru) | 5 test pakai user tanpa role | semua lulus (helper `teacherUser`) | Tidak |
| Auth/guard dashboard | — | 0 regresi | Tidak |
| Pemantauan guard (baru) | — | Guru 403 / Yayasan+Admin 200 | Tidak |
| Frontend lint | 0 error | 0 error (hanya warning unused) | Tidak |
| Frontend build | sukses | sukses (2.24s) | Tidak |

## 3. Kesimpulan
- **0 regresi baru** pada Sesi 9.
- 5 kegagalan identik dengan baseline sebelum Sesi 9 (pre-existing, terdokumentasi di REMAINING_ISSUES.md #1).
- Keputusan: **SESI 9 TIDAK MENYEBABKAN REGRESI. Dashboard siap lanjut ke sesi berikutnya.**

## 4. Catatan
- Verifikasi Postgres 17 tidak tersedia lokal (tanpa Docker); sqlite `:memory:` dipakai sebagai pengganti.
