# API CONTRACT

Kontrak endpoint per domain. Bukti historis: `99_ARCHIVE/CROSS_MODULE_API_CONTRACT.md`, `99_ARCHIVE/OPTIONS_API_CONTRACT.md`, `99_ARCHIVE/NOTIFICATION_API_CONTRACT.md`, `99_ARCHIVE/API_FRONTEND_MAPPING.md`, `99_ARCHIVE/04-audit-routes-api.md`.

## Standar Umum

- Base URL: `/api/*` — Laravel Sanctum; sebagian besar route ber-`middleware auth:sanctum` + `role`.
- Format UUID: **v4 RFC 4122** (36 karakter lowercase hyphenated).
- Tanggal: `YYYY-MM-DD` · Timezone: `Asia/Jakarta (UTC+07:00)`.
- Foto: `photo_url` (URL string ke public storage / base64 fallback).
- NULL handling: field nullable eksplisit `null` (bukan key hilang).
- STATUS_ENUM (siswa): `aktif, non_aktif, mutasi_keluar, mutasi_masuk, lulus, alumni`.
- Semua data scoped by auth (fail-closed: tidak dikenal → 404/403).

## Envelope Sukses

```json
{ "success": true, "message": "Data retrieved successfully", "data": {}, "meta": { "page": 1, "limit": 15, "total": 100, "last_page": 7 } }
```

## Envelope Error

401 `UNAUTHENTICATED` · 403 `FORBIDDEN` · 404 `NOT_FOUND` · 422 field errors · 500 `SERVER_ERROR`. Detail di `ERROR_STANDARD.md`.

## Options Payload (semua endpoint options)

```json
{ "status": "success", "message": "...", "data": [ { "value": "<uuid>", "label": "...", "meta": { ... } } ] }
```

Query baku: `search`, `unit_id`, `academic_year_id`, `semester_id`, `class_id`, `subject_id`, `cp_id`, `per_page` (default 50), `page` (default 1). Scope & redaction data sensitif enforced (403 jika melanggar).

## Kelompok Endpoint Utama (682 route API)

| Domain | Contoh endpoint | Catatan |
|---|---|---|
| Auth | `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` | Unified `identifier` login; response portal/default redirect/workspaces; semua login throttle `10,1` |
| Foundation (Yayasan) | `/api/foundation/laporan/*` (sdm, siswa, mutasi, kelulusan, alumni, lintas-unit) | Scope unit & role |
| Master data | `/api/employees`, `/api/students`, `/api/classes`, lookup/options | Unit scoped |
| Akademik/LMS | `/api/lms/*` (materi, penugasan, diskusi, presensi, bank-soal, ujian, rapor) | Class & teacher scoped; CBT redaction |
| Attendance | `/api/attendance/*`, `/api/attendance/reports/summary` | Unit & class scoped |
| Tahfizh | `/api/tahfizh/*`, `/api/tahfizh/report` | Unit & halaqah |
| Mutabaah | `/api/mutabaah/*`, `/api/mutabaah/analytics/*` | Child/class |
| Grades | `/api/grades`, `/api/grades/*` | Class & period |
| Portal | `/api/portal/*` (dashboard, children, schedules, materials, assignments, tahfizh, mutabaah, attendance, attendance-qr, chat, cbt, results) | Orang Tua/Siswa; self/child-scope |
| Teacher portal | `/api/teacher/*` | Staf mengajar |
| Step 04 teaching attendance | `/api/teacher/step04/schedules`, `/api/teacher/teaching-attendance/scan`, `/api/teacher/teaching-sessions/*`, `/api/teacher/presence/heartbeat` | QR hash + schedule ownership + server time; attendance/session/presence terpisah |
| Teacher monitoring | `GET /api/teacher-monitoring` | `teacher_monitoring.view`; read-only, allowed-unit scoped, polling 20s |
| Step 05 gate attendance | `/api/gate-attendance/scan-in`, `/api/gate-attendance/scan-out`, `/api/gate-attendance/logs` | Student opaque QR → active credential → unit scope; `attendances` source; duplicate IN/OUT guarded |
| Step 05 lesson attendance | `/api/lesson-attendance/*`, `/api/lesson-attendances/*` | Active Step 04 session when linked; active roster; draft/checklist/QR/review/finalization |
| Chat | `/api/chat/*`, `/api/employee/chat/*` | Role-scoped; lihat `05_MODULE/CHAT.md` |
| Notifications | `/api/notifications`, `/api/notifications/unread-count`, `/api/notifications/read-all` | Polling 60s |
| Reports | `GET /api/foundation/laporan/*`, stats endpoints | Zero Mock, `whereNull deleted_at`, period aktif |

## Unified Auth Response

`POST /api/auth/login` menerima `{ identifier, password, device_name }` dan mengembalikan token, user, `portal`, `default_portal`, `default_redirect`, serta `available_workspaces`. Identifier ambigu mengembalikan HTTP `409` dengan `workspace_chooser: true`; pemilihan workspace harus meminta endpoint explicit parent/student.

## Step 04 Endpoint Contract

| Method | Path | Input utama | Output/source |
|---|---|---|---|
| GET | `/api/teacher/step04/schedules` | `date?` | server date/timezone + schedule guru aktif |
| POST | `/api/teacher/teaching-attendance/scan` | `schedule_id`, opaque `qr_token` | teaching attendance + session ready; raw token tidak pernah dikembalikan |
| POST | `/api/teacher/teaching-sessions/{session}/start` | `duration_minutes?` | session active + start timestamp |
| POST | `/api/teacher/teaching-sessions/{session}/close` | none | session completed + close timestamp |
| POST | `/api/teacher/presence/heartbeat` | `device_id`, `device_name?` | device last-active timestamp; tidak membuat attendance |
| GET | `/api/teacher-monitoring` | `date?` | server time, threshold, KPI, real scoped teacher rows |

Invalid QR, schedule ownership, period, time window, duplicate, session state, dan permission menghasilkan error standar 403/404/422 sesuai kondisi.

## Step 05 Endpoint Contract

| Method | Path | Input utama | Output/source |
|---|---|---|---|
| GET | `/api/portal/attendance-qr` | `X-Child-Id` atau `child_id?` | stable opaque student `qr_token`; parent child ownership/self scope |
| POST | `/api/gate-attendance/scan-in` | `qr_token` atau legacy card identifier, `unit_id?`, gate time | `attendances` check-in; active student + unit + duplicate guard |
| POST | `/api/gate-attendance/scan-out` | `qr_token` atau legacy card identifier, `unit_id?`, gate time | existing check-in updated with checkout; no checkout-only row |
| GET | `/api/lesson-attendance/my-schedules/{schedule}/students` | `date`, `attendance_context?` | active student roster; leave/sick is recommendation only |
| POST | `/api/lesson-attendance/sessions/{session}/scan/qr` | opaque `identifier` | draft `lms_presensi` + hashed scan log; active session + roster required |
| POST | `/api/lesson-attendance/sessions/{session}/start-session` | `duration_minutes?` | capture session active; linked Step 04 session must be valid |
| POST | `/api/lesson-attendances/{session}/finalize` | none | final only with complete roster, selected statuses, owner, and active linked teaching session |

Student QR response never contains status attendance, password/PIN, NIK, NIS/NISN, name, parent data, or session credential.

## Referensi

- Envelope/error detail: `06_API/RESPONSE_STANDARD.md`, `06_API/ERROR_STANDARD.md`
- Detail arsip: `99_ARCHIVE/CROSS_MODULE_API_CONTRACT.md`, `99_ARCHIVE/OPTIONS_API_CONTRACT.md`, `99_ARCHIVE/NOTIFICATION_API_CONTRACT.md`, `99_ARCHIVE/API_FRONTEND_MAPPING.md`, `99_ARCHIVE/04-audit-routes-api.md`, `99_ARCHIVE/api-*.md`
