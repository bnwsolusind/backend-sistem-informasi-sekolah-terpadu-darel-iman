# CURRENT STATUS

Status aktif project SIMSIT berdasarkan verifikasi Pra-Sesi 16 Step 05. Targeted backend dan authenticated browser acceptance sudah PASS WITH FINDINGS; angka yang masih bertanda `Reported` tetap historis; angka runtime bertanda `Verified 2026-08-11` berasal dari PostgreSQL/source saat audit ini.

## Sesi Aktif

PRA-SESI 16 STEP 05 — student QR/card, gate IN/OUT, lesson roster/checklist/QR/review/finalization, parent/student QR scope, dan Step 04 active-session prerequisite. Targeted backend, build, dan authenticated browser UAT pass; full-suite timeout dan viewport tambahan tetap menjadi findings.

## Status Sistem Terakhir Tercatat

| Aspek | Status faktual dari dokumentasi |
|---|---|
| Backend targeted tests | Verified 2026-08-11: Step04 `6 passed / 35 assertions`; TeacherPortal `6 / 28`; AttendanceWorkflow `9 / 43`; MultiPortal `8 / 34`; individual total `29 passed / 140 assertions` |
| Step 05 targeted tests | Verified 2026-08-11: `6 passed / 45 assertions`; stable student QR, gate IN/OUT duplicate, lesson roster/finalization, lesson QR duplicate, soft-delete restore, parent child scope, dan active Step 04 prerequisite |
| Supporting regression after Step 05 | Verified 2026-08-11: Gate + Step05 `14 passed / 68 assertions`; Step04 + TeacherPortal + MultiPortal + Parent switching `26 passed / 141 assertions` remains prior supporting evidence |
| Dashboard role tests | Verified 2026-08-11: 8 passed / 46 assertions / 0 failure / 0 error |
| Backend full suite | Not completed: timeout after 600s at 63/384; failures appeared in unrelated master-data/subject tests |
| Frontend lint | Verified 2026-08-11: 0 errors; warning-only baseline |
| Frontend build | Verified 2026-08-11: PASS, Vite 8.2.1, `3295 modules` |
| API routes | Reported: 682 active / 142 controllers & services |
| Frontend pages | Reported: 85 halaman / 311 komponen |
| Roles and permissions | Verified 2026-08-11: 62 role runtime (24 canonical + alias) / 345 permission |
| Migrations | Verified 2026-08-11: seluruh migration `Ran` |
| Seeder | Verified 2026-08-11: `Step04DemoSeeder` dual-run stable; schedule/QR IDs tidak duplikat; raw QR hanya output local dan DB hanya hash |
| PostgreSQL | Verified connection: driver pgsql, database `school_management`; target PG17 masih pending verifikasi |
| Eager loading | Session 16 report menyatakan 100%; perlu rerun bila source berubah |
| Production readiness | **CONDITIONAL**: verdict historis menyisakan verifikasi PG17, warning lint, dan adopsi komponen canonical |

## Domain Status

| Domain | Status |
|---|---|
| Backend | Existing audit baseline tercatat; tidak diverifikasi ulang pada refactor docs |
| PostgreSQL | Runtime PG14.23 tercatat; PG17 pending |
| Migration | 71 file tercatat; migration lama tidak boleh diedit |
| Seeder | `Step04DemoSeeder` dual-run verified; canonical rule tetap idempotent |
| Auth | Unified `/masuk` + identifier resolver + default portal/workspace chooser verified on targeted tests/browser |
| Role/Permission | Gate, student mutation, teacher role allowlist, parent/student route separation, and unit scope verified |
| UI/UX | Rule canonical sudah dikonsolidasi; adopsi component global masih bertahap |
| Responsive | Step04 verified `1440/1024/768/390` tanpa document overflow; legacy route visual sweep tetap bertahap |
| Portal | Ownership parent-child, multi-child switch, dan student self-scope terdokumentasi; detail test berada di archive |
| Reports | 20 laporan enterprise dipetakan di `05_MODULE/LAPORAN.md`; bukti acceptance tetap historis |
| QR card | Verified 2026-08-11: employee QR dan student QR active; student QR stable opaque berbasis `qr_credentials` dan portal child-scoped |
| Teacher teaching attendance | Verified 2026-08-11: migration, source of truth `teaching_attendances`, QR scan, duplicate guard, ready/active/completed session |
| Realtime monitoring guru | Verified 2026-08-11: `/api/teacher-monitoring`, `user_devices` heartbeat, 90s threshold, 20s visible-tab polling, scoped rows |

## Validasi Pra-Sesi 16 Step 04

- Step04 targeted backend: 6 passed / 35 assertions; invalid/other QR, cross-unit, outside-time-window, duplicate, session ownership/state, heartbeat separation, monitoring scope, dan unauthorized monitoring tercakup.
- Teacher Portal regression: 6 passed / 28 assertions; AttendanceWorkflow 9/43; MultiPortal 8/34. Individual Step04 regression total: 29 passed / 140 assertions; baseline auth/access tetap 53/383 dari verifikasi sebelumnya.
- PostgreSQL migration status: migration Step 04 `Ran`; runtime graph berisi 1 demo schedule, 1 active employee QR, 1 teaching attendance, dan 1 teaching session.
- Seeder: dual-run `Step04DemoSeeder` mempertahankan schedule `019ff055-1f16-7369-8d72-888bc8e0410a` dan QR credential `019ff055-1fb0-73a6-b9eb-1621c14adcf7` tanpa duplikasi.
- Frontend lint: exit 0, 0 error, warning-only baseline.
- Frontend production build: PASS, Vite 8.2.1, 3294 modules.
- Browser acceptance: Guru flow login → jadwal → QR → presensi → mulai → selesai pernah PASS; Kepsek dan Yayasan masing-masing melihat 1 teacher row; console errors 0.
- Responsive smoke: Guru dan Monitoring di `1440`, `1024`, `768`, `390` tanpa document overflow; scanner modal `390` terlihat.
- Step 05 browser UAT: authenticated guru login -> schedule -> QR -> review -> finalization PASS pada `1440` dan `390`; console errors 0 dan document overflow 0. Viewport `1024`, `768`, dan `360` belum direrun.
- Full suite tetap open karena timeout historis/combined; bukan bukti PASS penuh.

## Remaining Issues

- Verifikasi runtime PostgreSQL 17.
- 661 warning lint yang tercatat (no-unused-vars / useEffect cleanup).
- Adopsi komponen canonical pada halaman legacy masih bertahap.
- Full PHPUnit suite must be rerun after unrelated master-data/subject failures are isolated.
- Detail/drill-down dan beberapa report action Yayasan masih partial.
- Musyrif belum memiliki endpoint kelompok binaan khusus dan masih memakai source Guru Tahfizh.
- Full Step04 browser rerun start-flow memerlukan demo session baru setelah session sebelumnya completed; terminal state ini sesuai contract.
- Step 05 authenticated browser UAT untuk lesson QR/review/finalization sudah PASS pada viewport yang diuji; gate, parent/student portal QR, monitoring, dan viewport `1024`/`768`/`360` tetap menjadi cakupan lanjutan bila acceptance matrix penuh diperlukan.
- Jangan gunakan report archive yang lebih tua untuk mengoverride angka atau status canonical terbaru.
- P0/P1 attendance/permission dan daftar lengkap ada di `08_REPORT/BUG_REGISTER.md`.

## Referensi

- Last system report: `99_ARCHIVE/SESSION_16_FINAL_REPORT.md` dan `99_ARCHIVE/SESSION_16_REGRESSION_REPORT.md`.
- Step 02 source evidence: `backend/app/Services/Auth/PortalResolver.php`, `backend/app/Services/Auth/AuthService.php`, `backend/routes/api.php`, `web-dashboard/src/auth/portalResolver.js`, `web-dashboard/src/routes/index.jsx`.
- Deferred items: `99_ARCHIVE/REMAINING_ISSUES.md`.
- Canonical rules: `README.md` dan `INDEX.md`.
