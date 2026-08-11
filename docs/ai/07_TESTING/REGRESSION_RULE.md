# REGRESSION RULE

Baseline guard & non-breaking. Bukti historis: `99_ARCHIVE/SESSION_11_BASELINE_REGRESSION_GUARD.md`, `99_ARCHIVE/SESSION_12_BASELINE_REGRESSION_GUARD.md`, `99_ARCHIVE/SESSION_16_REGRESSION_REPORT.md`.

## Prinsip

100% NON-BREAKING: setiap perubahan TIDAK boleh mengubah:

- Skema database / migration yang sudah ada (hanya add-only, lihat `02_DATABASE/MIGRATION_RULE.md`).
- Kontrak API & payload (lihat `06_API/API_CONTRACT.md`).
- Permission & role (lihat `03_AUTH/ROLE_PERMISSION.md`).
- Business logic / controller / service.

## Guard Baseline (Verifikasi Setiap Sesi; angka di bawah adalah report terakhir)

```text
1. PHPUnit  : 315 tests / 1115 assertions / 0 failure / 0 error
2. ESLint   : 0 errors (web-dashboard)
3. Vite Build: rerun and record result
4. PostgreSQL 14 smoke: rerun and record result
5. Portal group + security groups hijau di PG
```

## Regresi yang pernah dicegah (contoh)

- Mock data tersisa di komponen (Bell notifikasi, MutabaahWorkspace `DEFAULT_ACTIVITIES`) → dibuang.
- CBT: kunci jawaban bocor ke siswa; fallback `Student::first()`; timer tidak ditegakkan → di-hardening + regression test.
- Employee attendance: `student_id NOT NULL` di partitioned table menolak presensi pegawai → reconciliation migration + test.
- Chat: alias route tanpa role middleware → dibungkus role + `ChatAccessScopeTest`.

## Prosedur Bila Ada Regresi

1. Identifikasi test yang gagal; perbaiki penyebab di kode (bukan hapus/disable test).
2. Tambahkan regression test bila celah belum ter-cover.
3. Jalankan full suite (SQLite + PG14) sampai baseline hijau.
4. Catat di `08_REPORT/CHANGELOG.md`.

## Referensi

- Detail arsip: `99_ARCHIVE/SESSION_*_REGRESSION_REPORT.md`, `99_ARCHIVE/SESSION_*_BASELINE_REGRESSION_GUARD.md`
