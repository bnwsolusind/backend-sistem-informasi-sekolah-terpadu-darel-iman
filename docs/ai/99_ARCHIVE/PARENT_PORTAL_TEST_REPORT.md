# Parent Portal — Laporan Pengujian (Sesi 10)

## Tes Baru

File: `backend/tests/Feature/StudentParentPortalChildSwitchingTest.php` (6 test / 44 assertion)

| Test | Menverifikasi |
|------|---------------|
| `test_parent_can_switch_context_between_linked_children` | Switch anak A↔B via `?child_id=` & `X-Child-Id`; `children` hanya berisi anak terhubung |
| `test_child_scoped_endpoints_reject_unlinked_child` | 13 endpoint child-scoped → **404** untuk anak tak terhubung |
| `test_submit_permission_scopes_record_to_selected_child` | Izin tersimpan ke `student_id` anak terpilih; riwayat per anak; anak asing → 404 |
| `test_student_cannot_submit_mutabaah_without_active_assignment` | Gate 422 tanpa assignment; 200 + header valid dengan assignment aktif |
| `test_parent_signature_detects_content_change_on_note` | Tanda tangan `signed` → konten diubah → `signed_updated`; catatan anak asing → 404 |
| `test_notifications_endpoint_is_stable_for_parent_without_records` | Dual-schema guard tidak crash; `success:true` |

## Tes Eksisting yang Tetap Hijau

- `StudentParentPortalOwnershipTest` — pivot-only child dikenali; anak asing → 404.
- `MutabaahPortalAccessTest` — resolusi `parentStudent` / `ownStudent` (service).
- `MultiPortalAuthTest` — autentikasi multi portal.

## Hasil Suite Penuh

- `php artisan test`: **209 passed, 5 failed** (803 assertions, 374s).
- **5 failure = bug fixture pra-eksisting sesi 9** (bukan regresi):
  - `MutabaahCrudFullExecutionTest` (3): `NOT NULL constraint failed:
    mutabaah_daily_headers.supervisor_assignment_id`, `...template_id`, `tbl_kelas.unit_pendidikan_id`.
  - `TahfizhCalculationAndOwnershipTest` (2): `NOT NULL constraint failed: tbl_kelas.unit_pendidikan_id`.

Perbandingan: sesi 9 akhir = **202 passed / 5 failed** → sesi 10 = **209 passed / 5 failed**
(+7 hijau, termasuk 6 tes portal baru; tidak ada regresi).

## CLOSURE SESI 10 — 5 FAILURE DITUTUP

- Full suite kini **227 passed / 0 failed** (878 assertions, ±330s).
- Kelima failure lama diperbaiki tanpa melemahkan assertion (lihat
  `SESSION_10_CLOSURE_REPORT.md` untuk format TEST/FILE/LINE/EXPECTED/ACTUAL).
- 1 celah nyata ditutup: route `DELETE /api/mutabaah/enterprise/{resource}/{id}/force` (routes/api.php:231).
- Tes baru: `StudentParentPortalSignatureVersioningTest` (4), `MutabaahPortalGateTest` (5),
  `NotificationDualSchemaWriteTest` (3), `ParentStudentLoginRateLimitTest` (1) — semua PASS.
- Perbaikan bug nyata saat closure: upsert header mutabaah (`startOfDay()` di controller &
  `MutabaahDailyService::header()`), unifikasi skema notifikasi (`Notification::deliver()`),
  2 bug portabilitas PG pada migration `2026_08_01_000004_*`.
- Validasi PostgreSQL: seluruh suite migration sukses & idempotent di **PostgreSQL 14**
  (PG 17 tidak tersedia lokal; lihat SESSION_10_CLOSURE_REPORT §6).
- Verifikasi ulang 5 test pada PostgreSQL (DB khusus `sms_closure_testing`):
  10 test / 25 assertion **PASS** — termasuk fix fixture gender `'L'/'P'` → `male`/`female`
  (PG menegakkan `CHECK (gender IN ('male','female'))`, SQLite tidak).
- 6 filter wajib (SQLite): **25 passed / 100 assertions**; full suite **227 passed / 0 failed**.

## Frontend

- `npm run lint` → **0 error** (warning pra-eksisting tidak berubah).
- `npm run build` → sukses (3.4s).
- `npm run typecheck` / `npm run test` → **tidak ada** (proyek JSX non-TypeScript, tanpa script test).

## Catatan

- Migration `2026_08_06_100000_reconcile_student_notes_for_parent_portal` diverifikasi
  `migrate --force` pada scratch SQLite baru (sukses) dan pada in-memory test schema.
- Deploy produksi: jalankan `php artisan migrate` untuk menayangkan tanda tangan catatan.
