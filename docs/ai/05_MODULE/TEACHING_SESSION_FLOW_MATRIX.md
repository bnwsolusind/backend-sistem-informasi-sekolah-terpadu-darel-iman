# TEACHING SESSION FLOW MATRIX

## State Machine

| State | Entry condition | Allowed transition | Source of truth |
|---|---|---|---|
| No attendance | Schedule exists, no valid teacher scan for date | valid QR scan → `ready` | absence of `teaching_attendances` |
| `ready` | Active employee QR + own schedule + active period + valid day/time window | own teacher → `active` | `teaching_attendances` + `lesson_attendance_sessions.teaching_session_status` |
| `active` | Ready session started with server timestamp | own teacher → `completed` | `session_started_at` + status |
| `completed` | Owner closes active session | terminal; no restart | `session_closed_at` + status |

## Invariants

- Login success does not create teaching attendance.
- QR identifies the active employee card; it does not grant authorization or cross-unit access.
- One schedule has at most one teaching attendance per date through the database unique constraint and transaction lock.
- A session cannot start without the linked teaching attendance and cannot restart after completion.
- `Hadir`, `Terlambat`, `Online`, and `Sedang Mengajar` are independent signals.
- All schedule/date/time decisions use backend `Asia/Jakarta` server time.
- Student roster/finalization is outside Step 04 and must not be represented as completed by this state machine.

## Audit Fields

`teaching_attendances` records `check_in_at`, status, `qr_credential_id`, employee/user/unit/period context, and audit actor/device metadata. Session records retain start/close timestamps and the foreign key to teaching attendance.
