# ROLE TEST REPORT

Tanggal: 2026-08-08

## Hasil

- Canonical role test: **2 passed, 122 assertions**.
- Legacy role matrix regression: **3 passed, 37 assertions**.
- Full PHPUnit: **322 passed, 1,248 assertions, 0 failed, 0 error**; 59 PostgreSQL-only skipped pada konfigurasi SQLite.
- PostgreSQL certification final setelah perbaikan: **59 passed, 339 assertions, 0 failed, 0 error**.
- Run diagnostik awal menemukan FK class/rombel seeder; setelah koreksi, full suite diulang dari awal dan seluruhnya hijau.
- Auth identifier PostgreSQL: NIY/email/HP, parent NIK/email/HP, student NIS/email/HP, multi-child, self-scope: **PASS**.
- Login runtime PostgreSQL: **24 role berhasil**; password hash dan relasi profil diverifikasi.

Tidak ada perubahan route, API contract, atau pencabutan permission existing. Alias role historis tetap diuji melalui regression suite.
