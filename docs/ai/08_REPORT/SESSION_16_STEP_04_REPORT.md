# PRA-SESI 16 STEP 04 REPORT

Tanggal: 2026-08-11

## Scope

Teacher QR attendance per schedule, teaching session state machine,
server-time/day/period/unit validation, teacher device heartbeat, scoped
Kepsek/Yayasan monitoring, demo seed graph, targeted regression, and responsive
browser acceptance.

Student QR, student roster finalization, gate attendance, global/master-data
refactor, and Step 05 are explicitly out of scope.

## Changes

- Add-only migration membuat `teaching_attendances`, unique
  `(schedule_id, attendance_date)`, FK/index/check constraint, dan menambah
  `teaching_attendance_id` serta `teaching_session_status` ke
  `lesson_attendance_sessions`.
- `TeachingAttendanceService` sekarang memvalidasi employee aktif, ownership
  schedule, unit rombel, tahun ajaran, semester, hari, server time window,
  active/revoked QR credential, duplicate, dan state session.
- Raw QR tidak disimpan; resolver memakai SHA-256 dari opaque employee card.
  Login tetap auth-only dan tidak menulis attendance.
- Teaching session memakai state `ready` → `active` → `completed`; completed
  session tidak dapat dimulai ulang.
- Heartbeat menulis `user_devices.last_active_at` secara terpisah dari
  attendance/session; threshold online adalah 90 detik.
- `TeacherMonitoringService` menggabungkan schedule, employee/unit,
  teaching attendance, session, device presence, login event, KPI, dan rows
  read-only melalui `AccessScopeService`.
- Endpoint Step 04 ditambahkan di `backend/routes/api.php`; permission granular
  ditambahkan ke seeder role/attendance.
- `Step04DemoSeeder` membuat satu schedule guru aktif dan satu employee QR
  aktif secara local/development/testing-only.
- Portal Guru mendapat panel QR/kamera/manual token, status attendance/session,
  dan heartbeat. Monitoring mendapat panel KPI/table/detail read-only dengan
  polling 20 detik saat tab visible.
- `DashboardLayout` topbar disesuaikan agar Guru dan Monitoring tidak overflow
  pada breakpoint tablet `768px`.
- Canonical docs diperbarui: attendance, QR, teaching session, portal guru,
  monitoring, role/permission, data scope, API, seed matrix, bug register,
  current status, session history, dan changelog.

## Runtime Evidence

| Item | Result |
|---|---|
| Migration | Step 04 migration `Ran` via `php artisan migrate --force` |
| Demo schedule | `019ff055-1f16-7369-8d72-888bc8e0410a` |
| Demo QR credential | `019ff055-1fb0-73a6-b9eb-1621c14adcf7`; raw token tidak disimpan |
| PostgreSQL graph | 1 Step04 schedule, 1 active employee QR, 1 teaching attendance, 1 teaching session |
| Seeder dual-run | PASS; ID tetap sama dan tidak membuat duplikasi |
| Step04 backend test | 6 passed / 35 assertions |
| Teacher portal regression | 6 passed / 28 assertions |
| Attendance/portal regression | AttendanceWorkflow 9/43; MultiPortalAuth 8/34; individual Step04 set total 29/140 |
| Frontend lint | PASS, 0 errors; warning-only baseline |
| Frontend build | PASS, Vite 8.2.1 / 3294 modules |
| Browser Guru flow | Login → schedule → QR → attendance → start → close: PASS |
| Browser monitoring | Kepsek dan Yayasan masing-masing melihat 1 teacher row; console errors 0 |
| Server date display | Portal Guru header matched `server_time=2026-08-11T18:27:18+07:00`, timezone `Asia/Jakarta` |
| Responsive | Guru/Monitoring `1440`, `1024`, `768`, `390`: no document overflow; scanner modal visible at `390` |

Runner mencatat beberapa `ERR_ABORTED` untuk HMR/font asset saat reload, tetapi
tidak ada console error atau API 4xx/5xx pada acceptance flow.

## Findings Remaining

- Full PHPUnit suite belum selesai; combined regression command timeout setelah
  suite AttendanceWorkflow dan MultiPortal memulai pass. Ini bukan full-suite
  PASS claim.
- Existing lint warnings (unused variables/imports dan hook dependency) tetap
  warning-only dan bukan error build.
- Student roster/finalization/completion belum diisi oleh monitoring dan tetap
  berada di luar Step 04; jangan menutup gap dengan mock atau memulai Step 05.
- Realtime memakai polling 20 detik; WebSocket/Reverb tidak ditambahkan.

## Verdict

**PASS WITH FINDINGS** untuk Step 04. Step 05 belum dimulai.
