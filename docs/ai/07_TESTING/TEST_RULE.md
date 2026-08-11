# TEST RULE

Aturan & baseline test. Bukti historis: `99_ARCHIVE/SESSION_16_REGRESSION_REPORT.md`, `99_ARCHIVE/SESSION_16_FINAL_REPORT.md`, `99_ARCHIVE/REGRESSION_TEST_REPORT.md`, `99_ARCHIVE/INTEGRATION_TEST_MATRIX.md`, `99_ARCHIVE/10-audit-testing.md`.

## Baseline Terakhir Tercatat (Wajib Tetap Hijau)

```text
PHPUnit 11.5.56 · PHP 8.3.13 · PostgreSQL 14.23 (runtime Homebrew)
Total Tests    : 315 Passed
Assertions     : 1115
Failures/Errors: 0 / 0
Status         : Reported 100% HIJAU (Sesi 16; rerun diperlukan bila source/runtime berubah)
```

Frontend:
```text
ESLint/Oxlint (web-dashboard) : 311 files, 0 errors, 661 warnings (no-unused-vars / useEffect cleanup)
Vite Production Build         : Reported PASSED (Vite 8.1.5, 2.46s, code splitting aktif)
```

## Command

- Backend: `php artisan test` (dari `backend/`, config `backend/phpunit.xml`).
- Frontend lint: ESLint/Oxlint di `web-dashboard`.
- Build: `npm run build` di `web-dashboard`.

## Aturan

1. **Zero regression**: setiap perubahan wajib menjaga baseline 315 tests / 1115 assertions hijau.
2. Setiap modul baru → test feature yang menyertai (CRUD, scope, permission, redaction).
3. Scope/ownership/permission wajib diuji fail-closed (tidak dikenal → 404/403).
4. Test harus lulus di **SQLite dan PostgreSQL 14** (guard group berjalan di dua runtime).
5. Data test: factory/seeder — tidak boleh bergantung state server development.

## Referensi

- Guard regression: `07_TESTING/REGRESSION_RULE.md`
- Detail arsip: `99_ARCHIVE/SESSION_16_REGRESSION_REPORT.md`, `99_ARCHIVE/REGRESSION_TEST_REPORT.md`, `99_ARCHIVE/INTEGRATION_TEST_MATRIX.md`, `99_ARCHIVE/10-audit-testing.md`
