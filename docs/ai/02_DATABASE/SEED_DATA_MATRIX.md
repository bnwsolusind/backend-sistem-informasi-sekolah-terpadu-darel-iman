# SEED DATA MATRIX

Baseline kebutuhan demo dan coverage PostgreSQL 2026-08-11.

| Dependency | Seeder/source | Runtime | Coverage |
|---|---|---:|---|
| 24 role kanonik + alias | `RolePermissionSeeder`, `DefaultRoleUserSeeder` | 62 role / 345 permission | AVAILABLE, seeder idempotent |
| users | beberapa seeder | 57 | AVAILABLE |
| employees | dummy + default role | 31 | AVAILABLE |
| teachers | `TeacherSeeder` | 5 | AVAILABLE |
| students + parent relation | dummy/default/parent | 32 | AVAILABLE |
| academic year + semester | academic seeders | tersedia | AVAILABLE |
| kelas/rombel | `KelasSeeder` | tersedia | AVAILABLE |
| teaching assignment/schedule | `JadwalPelajaranSeeder`, `PresensiPembelajaranSeeder` | 18 | AVAILABLE |
| employee QR/card credential | `Step04DemoSeeder` | 1 active employee card | AVAILABLE — Step 04 demo |
| student QR/card credential | tidak ada seeder | 0 active | MISSING |
| gate student attendance | `AttendanceSeeder` | 15 | AVAILABLE sample |
| employee daily attendance | `AttendanceSeeder` | 5 | AVAILABLE, bukan teaching attendance |
| teaching attendance per schedule | migration + runtime `TeachingAttendanceService` | 1 demo row | AVAILABLE — Step 04 |
| lesson sessions | `PresensiPembelajaranSeeder` + Step 04 runtime | 1 Step 04 session (plus existing samples) | AVAILABLE — Step 04 ready/active/completed |
| lesson attendance rows | LMS/presensi seeder | 35 | AVAILABLE sample |
| QR/RFID scan log | tidak ada demo scan | 0 | MISSING |
| attendance terminal/device | tidak ada seeder | 0 | MISSING |
| login events | runtime auth | 63 | AVAILABLE |
| user presence device | `TeachingAttendanceService::heartbeat()` | runtime writer available; seeded count remains runtime-driven | AVAILABLE — Step 04 |
| worship sessions | `WorshipAttendanceSeeder` | 16 | AVAILABLE |

## Step 02 Seeder Notes

- Demo users, employee links, teacher links, parent/student links, dan test NISN direkonsiliasi oleh `DefaultRoleUserSeeder` pada local/testing.
- Seeder tidak membuat ulang relasi Super Admin sebagai Student/Parent dan aman dijalankan ulang.
- QR credentials, teaching attendance per schedule, device/presence, dan scan log tetap intentionally missing; tidak ditutup dengan mock pada Step 02.

## Minimal Demo Graph per Scenario

### A — Guru Mengajar

`User(Guru) → Employee(active) → EducationUnit → ClassSchedule(active period/day/time) → opaque employee card(hash only) → TeachingAttendance(schedule) → LessonAttendanceSession → roster → lms_presensi`.

Step 04 covers through teaching attendance/session. Roster/student attendance remains a later scope and is not faked.

### B — Siswa Gerbang

`Student(active) → unit → active enrollment/rombel → opaque student card → gate rule → Attendance → parent relation → notification`.

Sample attendance tersedia, tetapi QR credential dan enrollment validation belum terhubung.

### C — QR Siswa Pembelajaran

`Schedule owner → active teaching attendance → active lesson session → roster → student card → scan log → draft roll-call → review → final`.

Sample lesson rows tersedia; card/scan log/teaching prerequisite belum tersedia.

### D — Monitoring

`monitor user + teacher_monitoring.view + allowed unit scope → teacher/schedule → teaching attendance → session → user_devices/login activity source`.

Source teaching attendance dan heartbeat tersedia; student completion remains explicitly unavailable until its own scope is implemented.

## Seeder Safety Contract

- Tetap idempotent (`updateOrCreate`/`firstOrCreate`).
- Jangan hardcode frontend untuk menutup seed gap.
- Raw QR token hanya boleh dihasilkan saat seeding/local demo secara aman; DB hanya menyimpan hash.
- Jangan seed fake timeline. Event monitoring harus berasal dari record yang benar-benar dibuat.
- Dual-run `Step04DemoSeeder` verified: schedule and active QR IDs remain stable; it does not duplicate the demo graph.
