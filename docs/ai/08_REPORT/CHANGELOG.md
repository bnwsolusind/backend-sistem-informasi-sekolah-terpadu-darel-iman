# CHANGELOG

Catatan perubahan dokumentasi & aturan SIMSIT. Baru ditambahkan di bawah `UNRELEASED`.

## UNRELEASED

### 2026-08-10 - PRE SESSION 00: Refactor Dokumentasi (docs/ai single source of truth)

- **Struktur**: canonical docs dipisah ke `01_PROJECT`–`07_TESTING`; report aktif di `08_REPORT`; prompt di `09_PROMPT`; dokumen lama dipertahankan di `99_ARCHIVE`.
- **Canonical docs**: README, INDEX, project architecture/flow, database rule/schema/migration/seeder/PostgreSQL/scope, auth/login/role/security, UI/UX standards, module contracts, API standards, dan testing rules.
- **Consolidated rules**: UI tokens dan behavior, E2E flow, PostgreSQL separation, auth/role source, parent multi-child ownership, API envelope, dan regression guard.
- **Prompt boundary**: seluruh prompt diawali instruksi membaca `docs/ai/README.md` dan `INDEX.md`; path rulebook lama dihapus dari prompt aktif.
- **Archive**: 273 dokumen lama tetap ada dan tidak menjadi source of truth; tidak ada deletion.
- **Link validation**: 50 link historis `file:///` diperbaiki menjadi relative links dalam archive; broken Markdown links tersisa 0.
- **Audit inventory**: `08_REPORT/DOCUMENTATION_AUDIT.md` mencatat file set, duplicate groups, outdated claims, dan keputusan KEEP/MERGE/ARCHIVE.
- **Final worktree count**: 329 Markdown files, termasuk `.agent.md`; 0 dokumen dihapus.
- **Impact**: 0 perubahan source code aplikasi oleh refactor dokumentasi ini.
# 2026-08-11 — Pra-Sesi 16 Step 01 Baseline Freeze

- Menambahkan canonical `ROLE_PORTAL_MATRIX`, `MODULE_ACCESS_MATRIX`, `ATTENDANCE_FLOW_MATRIX`, `QR_CARD_FLOW_MATRIX`, `TEACHER_REALTIME_MONITORING_MATRIX`, `NAVIGATION_MATRIX`, `SEED_DATA_MATRIX`, dan `CRITICAL_FLOW_MATRIX`.
- Menambahkan active `BUG_REGISTER` dengan klasifikasi P0–P3.
- Membekukan invariant `ONLINE != HADIR MENGAJAR != SEDANG MENGAJAR` dan pemisahan gerbang/pembelajaran/ibadah.
- Mengoreksi schema doc absensi agar sesuai PostgreSQL aktual.
- Tidak mengubah source, route, permission, migration, atau business logic.
- Verifikasi: migration seluruhnya `Ran`; targeted backend 33 test/167 assertion PASS; lint 0 error/660 warning; Vite build PASS (2.52s).

## 2026-08-11 - Pra-Sesi 16 Step 02 Auth/Access Hardening

- Unified `/masuk` login now resolves identifier, role, default portal, and ambiguous workspace without hardcoded credentials or login attendance side effects.
- Gate permissions, student parent-controlled attendance transactions, teacher route role allowlist, parent/student route separation, and backend unit scope were tightened.
- Demo seed reconciliation is local/testing-only and idempotent; stale Super Admin student/parent links are detached rather than reused.
- Verification: targeted backend 53 tests/383 assertions PASS; `TeacherPortalApiTest` included; frontend build PASS; lint warning-only; browser acceptance PASS for login/redirect/sidebar/profile/logout and three portal roles.
- Full backend suite was not completed within 600 seconds and remains a verification finding; Step 03 is not started.

## 2026-08-11 - Pra-Sesi 16 Step 03 Role Dashboard/Portal Audit

- Menambahkan canonical `05_MODULE/ROLE_DASHBOARD_STANDARD.md` dan memperbarui navigation/portal/dashboard contracts.
- Memisahkan default Operator ke `/dashboard/operator`, menambah child route permission guard, dan membatasi generic Tahfizh ke permission class/schedule/master yang sesuai.
- Menghapus fallback KPI/activity sintetis pada dashboard Operator/Musyrif; memperbaiki mapping PostgreSQL Divisi, TU, Kepala Sekolah, dan context tahun ajaran.
- Menyembunyikan mutation UI Student yang ditolak backend; employee chat hanya aktif bila permission chat tersedia.
- Verification: DashboardRoleAccessTest 8/46 pass; AttendanceWorkflowTest 9/43 pass; MutabaahPortalGateTest 5/12 pass; 13-account browser matrix dan 7 negative-route cases pass; build/lint/PHP syntax/diff check pass.
- Step 04, QR attendance, teacher realtime monitoring, dan full suite tetap deferred.

## 2026-08-11 - Pra-Sesi 16 Step 04 Teacher Attendance/Monitoring

- Menambahkan migration add-only untuk `teaching_attendances`, teaching-attendance relation pada `lesson_attendance_sessions`, unique schedule/date guard, dan model/relasi terkait.
- Menambahkan `TeachingAttendanceService` dan `TeacherMonitoringService` dengan QR employee-card hash, schedule/unit/period/day/time validation, server timezone `Asia/Jakarta`, duplicate transaction lock, session state, heartbeat, audit, dan `AccessScopeService`.
- Menambahkan endpoint Step 04, permission granular, `Step04DemoSeeder`, Portal Guru QR/session panel, monitoring panel, route guard, dan menu monitoring.
- Memperbarui canonical attendance, QR, teaching-session, portal guru, monitoring, role/permission, data scope, API, dan seed matrix.
- Verification: Step04 test 6/35 pass; TeacherPortal 6/28 pass; seeder dual-run stable; frontend lint warning-only/0 error; Vite build 3294 modules; browser flow dan responsive `1440/1024/768/390` pass tanpa console error/document overflow.
- Step 04 tetap **PASS WITH FINDINGS** karena full regression timeout finding masih terbuka; topbar date presentation sudah server-time based dan browser verified; Step 05 belum dimulai.

## 2026-08-11 - Pra-Sesi 16 Step 05 Student QR/Gate/Lesson Attendance

- Menambahkan `StudentQrCredentialService` dengan token `stuqr:v1:*` opaque stabil berbasis HMAC; raw token tidak memuat student ID/NIS/NISN/nama dan `qr_credentials` hanya menyimpan SHA-256 hash.
- Mengganti student card/portal QR dari encrypted/random atau JSON PII menjadi credential aktif yang reusable; parent/student endpoint `/api/portal/attendance-qr` memakai child/self ownership scope.
- Gate attendance sekarang resolve student QR melalui `qr_credentials`, memvalidasi unit terminal/user scope, menolak duplicate IN/OUT, dan menolak checkout tanpa check-in; PostgreSQL advisory key melengkapi transaction lock tanpa migration destruktif.
- Lesson attendance sekarang selalu melengkapi roster siswa aktif dengan `belum_diverifikasi`, memaksa QR melalui backend active-session/roster resolver, menolak scan duplicate, dan menolak finalisasi sebelum seluruh status dipilih serta teaching session Step 04 aktif.
- Verification: Step05 `5 passed / 40 assertions`; supporting Gate/Workflow `14 / 56`, Step04/Teacher/MultiPortal/Parent `26 / 141`; frontend build PASS Vite 8.2.1 `3294 modules`; lint tetap warning-only baseline.
- Authenticated browser UAT Step 05 dan full PHPUnit suite belum diklaim PASS; jangan mulai Step 06.

## 2026-08-11 - Pra-Sesi 16 Step 05 Verification Closure

- Memperbaiki konflik unique `lms_presensi_schedule_student_date_unique` saat row roster pernah di-soft-delete; capture sekarang me-restore row di dalam transaction sebelum upsert.
- Menambahkan regression test untuk soft-delete restore; targeted Step 05 menjadi `6 passed / 45 assertions`, Gate + Step05 menjadi `14 passed / 68 assertions`.
- Frontend lint tetap exit 0 dengan warning baseline; Vite build PASS `3295 modules`.
- Authenticated browser UAT guru PASS untuk login -> schedule -> QR -> review -> finalization pada viewport `1440` dan `390`, tanpa console error/document overflow; status demo session terverifikasi `final`.
- Full PHPUnit timeout dan viewport `1024`/`768`/`360` tetap findings; Step 06 belum dimulai.
