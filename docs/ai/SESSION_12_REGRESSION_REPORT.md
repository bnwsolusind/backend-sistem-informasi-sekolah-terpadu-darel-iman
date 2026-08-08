# SESI 12 — REGRESSION REPORT

## Ringkasan

| KETERANGAN | HASIL |
|---|---|
| Baseline S11 | 246 tests / 947 assertions / 0 failed |
| Akhir S12 | 278 tests / 1050 assertions / 0 failed / 0 error |
| Delta | +32 tests / +103 assertions |
| Regresi ditemukan | **NO** |
| Guard 6 filter critical (SQLite) | 25 passed / 100 assertions |
| Guard group S12 (PostgreSQL 14) | 64 passed / 249 assertions |
| MultiPortalAuthTest (PG 14) | 4 passed / 2 failed (pra-eksisting, bukan regresi) |

## Hasil per Kelompok (SQLite :memory:)

```text
Guard 6 filter critical           : 25 passed / 100 assertions
Test baru S12                     : 37 passed / 128 assertions
  ChatAccessScopeTest              8 / 18
  NotificationApiScopeTest         5 / 26
  CbtAutoTimeoutTest               9 / 36
  NotificationApiTest              1 /  6
  NotificationDualSchemaWriteTest  3 / 18
  SchoolInformationVisibilityTest  11 / 24
Full suite                         : 278 passed / 1050 assertions / 0 failed / 0 error
```

## Hasil PostgreSQL 14 (DB `sms_closure_testing`)

```text
Guard group S12 (PG)  : 64 passed / 249 assertions
  termasuk ChatAccessScopeTest, NotificationApiScopeTest, CbtAutoTimeoutTest,
  NotificationDualSchemaWriteTest, NotificationApiTest, SchoolInformationVisibilityTest,
  StudentPortalCacheIsolationTest, StudentCbtSecurityHardeningTest,
  StudentParentPortalChildSwitchingTest, StudentParentPortalOwnershipTest, MutabaahPortalAccessTest
MultiPortalAuthTest (PG) : 4 passed / 2 failed (15 assertions)
  → kegagalan = PRA-EKSISTING (identik Sesi 10 §6c & Sesi 11): skema partitioned
    `attendances` (m08) tidak dapat menyimpan absensi pegawai (student_id/class_id
    NOT NULL, tanpa kolom employee_id). BUKAN regresi Sesi 12.
```

## Kegagalan yang Muncul & Ditangani Selama Sesi 12 (di luar baseline)

| Isu | Mesin | Aksi |
|---|---|---|
| `scopeByUser` memakai `user_id` → PG 500 | PG | Fix schema-aware (BUG-S12-01) |
| Carbon `diffInSeconds` negatif → `unsignedInteger` overflow | PG | `abs()` (BUG-S12-02) |
| `TeacherPortalController::notifications` pakai kolom legacy | PG | `userQuery` (BUG-S12-03) |
| Fixture notifikasi UUID all-zero → FK PG | PG | AcademicYear/Semester nyata (BUG-S12-04) |

Semua sudah FIXED + tervalidasi di PG (lihat BUG_FIX_LOG Sesi 12).

## Kesimpulan

Tidak ada penurunan baseline. Semua fungsi baru lulus di SQLite dan PostgreSQL 14.
2 kegagalan di PG adalah batasan DDL pra-eksisting absensi pegawai yang **sudah terdokumentasi
sejak Sesi 10** — bukan regresi Sesi 12.
