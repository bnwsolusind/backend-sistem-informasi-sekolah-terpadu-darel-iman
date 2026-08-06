# SESI 11 — BASELINE REGRESSION GUARD

Dokumen ini mengunci baseline Sesi 10 sebagai ambang minimum Sesi 11 (Portal Siswa).
Sesi 11 **tidak boleh menurunkan** baseline di bawah ini. Setiap perubahan Portal Siswa
wajib diuji ulang terhadap 6 filter critical di bawah.

## BASELINE SESI 10 (diambil 2026-08-06)

```text
BASELINE TEST COUNT:      227
BASELINE ASSERTIONS:      878
BASELINE FAILURES:        0
BASELINE ERRORS:          0
```

## CRITICAL BASELINE TESTS

```text
- MutabaahCrudFullExecutionTest
- TahfizhCalculationAndOwnershipTest
- StudentParentPortalChildSwitchingTest
- StudentParentPortalOwnershipTest
- MutabaahPortalAccessTest
- MultiPortalAuthTest
```

Regresi setara dengan satu command:

```bash
php artisan test --filter="MutabaahCrudFullExecutionTest|TahfizhCalculationAndOwnershipTest|StudentParentPortalChildSwitchingTest|StudentParentPortalOwnershipTest|MutabaahPortalAccessTest|MultiPortalAuthTest"
```

## STATUS SAAT PELUNCURAN SESI 11

```text
CURRENT TEST COUNT:      227
CURRENT ASSERTIONS:      878
CURRENT FAILURES:        0
CURRENT ERRORS:          0
REGRESSION FOUND:        NO
REGRESSION FIXED:        —
STATUS:                  BASELINE INTACT — SESSION 11 MAY START
```

## STATUS AKHIR SESI 11 (setelah seluruh perubahan Portal Siswa)

```text
CURRENT TEST COUNT:      237  (baseline 227 + 10 test hardening baru)
CURRENT ASSERTIONS:      906  (baseline 878 + 28)
CURRENT FAILURES:        0
CURRENT ERRORS:          0
REGRESSION FOUND:        NO
REGRESSION FIXED:        —
STATUS:                  BASELINE INTACT — SESSION 11 PASSED WITH ENVIRONMENT NOTE (PG17 runtime pending)
```

## ATURAN GUARD

1. Jumlah test akhir boleh bertambah; **tidak boleh berkurang** tanpa penjelasan + audit.
2. **Jangan menghapus test baseline.**
3. Setelah setiap perubahan Portal Siswa, jalankan 6 filter critical di atas + full suite.
4. Full suite akhir Sesi 11 harus: `FAILED: 0`, `ERRORS: 0`.
5. Jika terjadi regresi, perbaiki sebelum lanjut; catat di `BUG_FIX_LOG.md` dan log sesi.
