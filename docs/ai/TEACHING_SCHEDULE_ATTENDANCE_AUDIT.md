# Teaching, Schedule, and Attendance Audit - Session 3

## Verified active flow

```text
Employee (employees.unit_id)
  + Kelas (tbl_kelas.unit_pendidikan_id, tahun_ajaran_id, semester_id)
  + Subject (subjects.unit_pendidikan_id or global)
  -> ClassSchedule (class_schedules)
  -> LessonAttendanceSession / LmsPresensi
```

`class_schedules.kelas_id` and `class_schedules.employee_id` are the active
references. `class_id` and `teacher_id` remain readable only for legacy
compatibility. New active flows must use Kelas and Employee.

## Fixed controls

| Area | Finding | Change | Evidence |
| --- | --- | --- | --- |
| Schedule API scope | `/api/schedules` used global queries after authentication. | Reads, options, detail, update, and delete are scoped to the caller's employee unit. | `ScheduleScopeAndConflictTest` proves Unit A cannot list, show, or update a Unit B schedule. |
| Schedule mutations | Create/update accepted unrelated class, teacher, subject, year, and semester IDs. | Backend checks permission, class unit, active employee unit, subject unit/global applicability, and semester-year relationship. | `ScheduleScopeAndConflictTest` covers invalid academic context. |
| Schedule overlap | Conflict check must reject a collision for the same teacher OR the same class. | Existing OR semantics were retained; only the boundary controls were added. | `ScheduleScopeAndConflictTest` rejects an overlapping schedule. |
| Homeroom attendance | Homeroom lookup read `students.class_id` only. | Lookup now includes active `students.kelas_id` and retains legacy `class_id` compatibility. | `AttendanceActiveKelasAccessTest` proves an active Kelas student is in the homeroom scope. |

## Authorization contract

- `GET /api/schedules`, `GET /api/schedules-options`, and `GET /api/schedules/{id}` require a schedule-view permission, unless the user is an explicit all-unit monitoring role.
- `POST`, `PUT`, and `DELETE /api/schedules` require the matching `academic.schedule.*` permission; Super Admin remains the administrative bypass.
- Non-all-unit users see only schedules whose active `Kelas` belongs to their employee unit.
- Foundation roles can view across units but remain subject to the existing read-only middleware for mutations.
- Learning attendance continues to enforce teacher ownership through `AttendanceAccessService`; existing workflow tests cover another teacher attempting to use a schedule.

## Test evidence

Executed from `backend/`:

```text
php artisan test --filter='(ScheduleScopeAndConflictTest|AttendanceActiveKelasAccessTest|AttendanceWorkflowTest|GateAttendanceTest)'

15 passed, 62 assertions
```

No migration, destructive database command, route removal, or frontend contract change was made in this session.

## Remaining limits

- `employee_teachings` exists but uses legacy `classroom_id` and has no discovered API route or UI contract. It is not treated as the active source of teaching assignments.
- Legacy-only schedules without `kelas_id` cannot be fully unit-scoped from the active Kelas relation. They remain supported for compatibility and require a controlled data migration before the legacy fields can be retired.
- The focused tests do not constitute a full backend suite or browser E2E verification.