# CRITICAL FLOW MATRIX

## Scenario Acceptance Baseline

| Scenario | Chain | Current verdict | Blocking evidence |
|---|---|---|---|
| A Guru Mengajar | login → jadwal → scan QR guru → hadir mengajar → start → checklist/QR siswa → review → confirm → final → close | BLOCKED | QR guru masih login; teaching attendance missing; workspace memakai API save legacy yang tidak cocok schema |
| B Siswa Gerbang | scan student card → validate context → gate transaction → parent/dashboard update | PARTIAL/BLOCKED FOR QR | gate transaction + notification ada; credential, unit-terminal, period, enrollment validation belum lengkap |
| C QR Siswa Lesson | pilih jadwal → valid teacher attendance/session → scan → roll-call → review → final | PARTIAL/BLOCKED | QR identify/scan ada; teacher attendance prerequisite dan single token source missing |
| D Monitoring | scoped superior → online + teaching attendance + session + completion | BLOCKED | online source dan teaching attendance source missing; page hanya monitoring umum |

## Required Gate Conditions

| Action | Required conditions | Aktual |
|---|---|---|
| Scan teacher card | active credential, employee/teacher active, unit, period, own schedule, day/time, duplicate | belum ada endpoint |
| Start teaching session | valid teacher assignment + teaching attendance + schedule | hanya owner + draft/revised |
| Load roster | active enrollment in schedule rombel/period | active student + class/kelas match |
| Identify student QR | active credential + same unit/period/enrollment + context | active student + roster; credential lifecycle absent |
| Save draft | every submitted student in roster | ada |
| Finalize lesson attendance | teaching attendance valid + active session + full roster reviewed + confirmation | hanya owner/substitute + session status |
| Close session | owner + started, not already closed | owner check ada; state validation minimal |
| Monitor teacher | monitor permission + unit allowlist | endpoint belum ada |

## Final State Machine Freeze

```text
AUTHENTICATED/ONLINE
  -> SCAN TEACHER CARD
  -> TEACHING_ATTENDANCE_VALID
  -> SESSION_STARTED
  -> ROLL_CALL_DRAFT (checklist + optional student QR)
  -> REVIEWED
  -> CONFIRMED/FINAL
  -> SESSION_CLOSED
```

Tidak ada transisi otomatis dari `ONLINE` ke `TEACHING_ATTENDANCE_VALID`.
