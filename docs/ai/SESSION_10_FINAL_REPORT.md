# SESI 10 — FINAL REPORT: Parent Portal (P0–P24)

Status: **SELESAI** — audit, perbaikan, dan pengujian Portal Orang Tua & Siswa.

## Lingkup

Portal Orang Tua multi-anak: switch anak, scoping data per anak, keamanan akses, tanda tangan
digital catatan guru, gate agenda mutabaah, notifikasi dual-schema, dan rate-limit login.

## Temuan → Perbaikan

| # | Area | Temuan | Perbaikan |
|---|------|--------|-----------|
| 1 | Skema | `student_notes` legacy (core) ≠ skema model: kolom portal tidak ada, `note` NOT NULL | Migration rekonsiliasi idempotent `2026_08_06_100000_*`: tambah kolom, longgarkan `note`, migrasi `note→content`, backfill |
| 2 | Mutabaah | `saveMutabaahStudent` memakai `entry_date` (kolom salah) + NOT NULL `supervisor_assignment_id`/`template_id` | Tulis `activity_date`, isi seluruh kolom wajib dari assignment aktif |
| 3 | Gate mutabaah | Siswa dapat membuat checklist tanpa agenda supervisor | Assignment aktif (status + rentang tanggal + unit) wajib; tanpa → 422 |
| 4 | Tanda tangan | `signStudentNote` tidak mendeteksi perubahan isi | `signature_content_hash` (SHA-256) + status `signed`/`signed_updated`; `signed_by_user_id`/`signed_at` dipersisten |
| 5 | Notifikasi | Query hardcode `user_id` tidak kompatibel skema legacy PG | Guard `Schema::hasColumn` + child scope per tipe `notifiable` |
| 6 | Status code | `dashboard()` → 440 (typo) | Diseragamkan → 404 |
| 7 | CBT | `examOverview` memakai identitas siswa akun (bukan konteks anak) | Child-scoped; start/save/finish tetap `role:Siswa` |
| 8 | Rate limit | Login parent-student tanpa batas percobaan | `throttle:10,1` di route `/auth/login/parent-student` & `/v2/...` |
| 9 | Frontend | Anak aktif tidak persisten; flash data anak lama saat switch | URL `?child=` (persisten, replace) + reset state data per switch + `selectTab` mempertahankan `child` |

## Arsitektur Keamanan (Dijaga)

- Resolusi konteks anak `getStudentContext()`: header `X-Child-Id` → `?child_id=` → fallback
  (siswa → milik akun; orang tua → anak pertama terhubung). Anak tak terhubung → **404**.
- Relasi orang tua–anak via `students.parent_id` **dan** pivot `student_parents` (keduanya valid).
- Stateless, fail-closed; state "anak aktif" selalu divalidasi ulang per request.
- Aksi siswa (submit tugas, isi mutabaah, mulai CBT) diproteksi ekstra `role:Siswa`.

## Pengujian

- `StudentParentPortalChildSwitchingTest` — **6 test / 44 assertion, PASS**.
- `StudentParentPortalOwnershipTest`, `MutabaahPortalAccessTest`, `MultiPortalAuthTest` — hijau.
- Full suite: **209 passed, 5 failed** (5 failure = bug fixture pra-eksisting sesi 9 pada
  `MutabaahCrudFullExecutionTest` & `TahfizhCalculationAndOwnershipTest`; tanpa regresi;
  +7 hijau dibanding sesi 9).
- Frontend: lint **0 error**, build sukses.

## Deliverables Docs

- `PARENT_PORTAL_CHILD_OWNERSHIP_MODEL.md`
- `PARENT_PORTAL_AUTH_FLOW.md`
- `PARENT_PORTAL_SIGNATURE_DIGEST.md`
- `PARENT_PORTAL_CHILD_SWITCHER_UX.md`
- `PARENT_PORTAL_MUTABAAH_GATE.md`
- `PARENT_PORTAL_NOTIFICATIONS_SCOPE.md`
- `PARENT_PORTAL_SECURITY_REPORT.md`
- `PARENT_PORTAL_STUDENT_NOTES_RECONCILE.md`
- `PARENT_PORTAL_TEST_REPORT.md`

## Catatan Deploy

1. Jalankan `php artisan migrate` (migration rekonsiliasi `2026_08_06_100000_*`).
2. Migration aman idempotent untuk SQLite / MySQL / Postgres (Laravel 12 `change()`).

---
**Keputusan akhir: SESI 10 SELESAI → siap lanjut ke sesi berikutnya.**
