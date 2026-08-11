# ATTENDANCE FLOW MATRIX

## Domain Separation

| Domain | Identity/context | Source of truth aktual | Status baseline |
|---|---|---|---|
| Absensi gerbang siswa | opaque student card + unit + tanggal + gate rule | `attendances` (`tipe_presensi=Siswa`) + active `qr_credentials` | AVAILABLE — Step 05 core |
| Kehadiran pegawai harian | employee + tanggal kerja | `attendances` (`Pegawai/Guru`) | AVAILABLE tetapi bukan kehadiran mengajar |
| Kehadiran guru mengajar | teacher + jadwal + periode + waktu scan | `teaching_attendances` | AVAILABLE — Step 04 |
| Sesi pembelajaran | schedule + date + teacher owner | `lesson_attendance_sessions` + `teaching_attendance_id` | AVAILABLE — Step 04 prerequisite |
| Presensi siswa per pelajaran | active teaching session + roster student | `lms_presensi` + `attendance_scan_logs` | AVAILABLE — Step 05 core |
| Presensi ibadah | worship template/session + student | `worship_attendance_sessions/details` | AVAILABLE dan terpisah |
| Online presence | user/device activity | `user_devices.last_active_at` via heartbeat + `login_events` | AVAILABLE — threshold server 90 detik |

## Flow Target vs Implementasi

| Tahap | Target final | Implementasi aktual | Gap |
|---|---|---|---|
| Login guru | auth saja, lalu resolve portal | unified login tidak menulis presensi | PASS — login/online tetap terpisah |
| Scan QR guru | resolve opaque card → employee/teacher → validasi jadwal | `TeachingAttendanceService::scan()` pada context schedule | PASS — QR teaching context tersedia |
| Hadir mengajar | transaksi jadwal tersendiri | `teaching_attendances`, unique schedule+date, transaction lock | PASS — `hadir/terlambat` |
| Mulai sesi | wajib setelah teaching attendance valid | session dibuat/diikat saat scan, start hanya owner + ready + time window | PASS — prerequisite hadir mengajar |
| Ambil roster | siswa aktif pada rombel/enrollment/periode | `studentsForSchedule()` cek class/kelas + aktif | enrollment table eksplisit masih belum tersedia |
| Checklist | per siswa, status aktual | backend selalu membuat seluruh roster dengan `belum_diverifikasi` | PASS — status unmarked tidak otomatis Alpha |
| QR siswa | bantu tandai hadir/terlambat dalam draft | stable `qr_credentials` + active session + roster resolver | PASS — tidak ada local-only write |
| Review | seluruh roster terlihat dan dapat diubah | UI checklist + rekomendasi izin/sakit terpisah | PASS — teacher tetap memilih status |
| Konfirmasi | tampil ringkasan sebelum save/finalize | draft/finalize terpisah; final menolak roster/status belum diisi | PASS pada backend contract |
| Save final | hanya setelah schedule + teacher attendance + session valid | owner + active teaching session bila linked + roster completeness + no unmarked | PASS — fail-closed untuk flow Step 05 |
| Sedang mengajar | session dimulai, bukan online | `teaching_session_status=active`, `session_started_at` | PASS — diagregasi monitoring |
| Tutup sesi | close timestamp | `teaching_session_status=completed`, `session_closed_at` | PASS — diagregasi monitoring |

## Database Trace

| Tabel/model | FK/konteks utama | Status field | Constraint/index penting |
|---|---|---|---|
| `attendances` / `Attendance` | student/employee, class, unit, year, semester, month | `status`, `tipe_presensi`, check-in/out | PostgreSQL partition `LIST(month)`; PK komposit; tidak ada unique student/employee+date; FK employee aktual tidak ada |
| `class_schedules` / `ClassSchedule` | kelas/class, employee/teacher, subject, year, semester | `is_active` | FK lengkap; `day_of_week` check; index period/day, class/day, employee/day |
| `teaching_attendances` / `TeachingAttendance` | `schedule_id`, `employee_id`, `user_id`, unit, year, semester | hadir/terlambat + check-in + audit | unique schedule+attendance_date; FK/index; QR raw token tidak disimpan |
| `lesson_attendance_sessions` / `LessonAttendanceSession` | `schedule_id`, `teaching_attendance_id` | draft/ready/active/completed + timestamps start/close/final | unique schedule+date, unique token hash, teaching attendance FK |
| `lms_presensi` / `LmsPresensi` | schedule, session, student | hadir/terlambat/izin/sakit/alpa/dispensasi/belum_diverifikasi secara aplikasi | unique schedule+student+date; FK schedule/session/student |
| `attendance_scan_logs` | lesson session, student, schedule, device | result/failure | index session+scanned_at; identifier di-hash |
| `worship_attendance_sessions/details` | template/supervisor dan student | opened/closed/verified; status ibadah | unique template+date dan session+student |

## Invariant Final (Freeze)

```text
ONLINE != HADIR MENGAJAR != SEDANG MENGAJAR
QR = IDENTITAS, BUKAN STATUS DAN BUKAN AUTHORIZATION
GATE ATTENDANCE != LESSON ATTENDANCE != WORSHIP ATTENDANCE
FINAL LESSON ATTENDANCE membutuhkan TEACHER ASSIGNMENT + SCHEDULE + TEACHING ATTENDANCE + ACTIVE SESSION + STUDENT ENROLLMENT
```

Step 04 mengimplementasikan prerequisite guru, session, dan presence. Step 05 sekarang memakai prerequisite tersebut untuk roster, checklist, QR siswa, review, dan finalisasi; sesi yang sudah `completed` tidak menerima capture/finalisasi baru.

Runtime verification 2026-08-11: targeted Gate + Step 05 regression `14 passed / 68 assertions`; authenticated browser flow login -> schedule -> QR -> review -> finalization passed at `1440` and `390` without document overflow. A soft-deleted `lms_presensi` roster row is restored inside the capture transaction before the schedule/student/date upsert, preserving the unique attendance invariant.
