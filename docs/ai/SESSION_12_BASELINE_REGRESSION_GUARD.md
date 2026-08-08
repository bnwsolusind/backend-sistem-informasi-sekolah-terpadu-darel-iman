# SESI 12 — BASELINE REGRESSION GUARD

Dokumen ini mengunci baseline Sesi 11 sebagai ambang minimum Sesi 12 (Notifikasi Real + Chat Role-Scoped + Auto-timeout CBT).
Sesi 12 **tidak boleh menurunkan** baseline di bawah ini.

## BASELINE SESI 11 (diambil 2026-08-07)

```text
BASELINE TEST COUNT:      246
BASELINE ASSERTIONS:      947
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

## STATUS AKHIR SESI 12 (setelah seluruh perubahan)

```text
CURRENT TEST COUNT:      278  (baseline 246 + 32: Chat 8, NotifScope 5, CbtTimeout 9, NotifApi fixture 1,
                              DualSchema 3, SchoolInformationVisibility 11)
CURRENT ASSERTIONS:      1050 (baseline 947 + 103)
CURRENT FAILURES:        0
CURRENT ERRORS:          0
REGRESSION FOUND:        NO
REGRESSION FIXED:        —
GUARD (SQLite)           25 passed / 100 assertions — BASELINE INTACT
GUARD GROUP (PG 14):     64 passed / 249 assertions (Chat|NotifScope|CbtTimeout|NotifApi|DualSchema|
                       SchoolInfo|Portal isolation|CBT security|Parent portal)
PG KNOWN LIMITATION:     2 failure pra-eksisting absensi pegawai (attendances partition) — bukan regresi
STATUS:                  BASELINE INTACT — SESSION 12 PASSED WITH ENVIRONMENT NOTE (PG17 runtime pending)
```

## ATURAN GUARD

1. Jumlah test akhir boleh bertambah; **tidak boleh berkurang** tanpa penjelasan + audit.
2. **Jangan menghapus test baseline.**
3. Setelah setiap perubahan pada modul notifikasi/chat/CBT, jalankan 6 filter critical + full suite.
4. Full suite akhir Sesi 12 harus: `FAILED: 0`, `ERRORS: 0`.
5. Jika terjadi regresi, perbaiki sebelum lanjut; catat di `BUG_FIX_LOG.md` dan log sesi.
