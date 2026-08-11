# TEACHER REALTIME MONITORING MATRIX

## Availability

| Signal | Source aktual | Availability | Boleh ditampilkan sebagai |
|---|---|---|---|
| login success/failure | `login_events.created_at` | AVAILABLE | login terakhir, bukan online |
| active API token | `personal_access_tokens` | AVAILABLE/PARTIAL | sesi/token, bukan hadir |
| user device activity | `user_devices.last_active_at` via `/api/teacher/presence/heartbeat` | AVAILABLE — runtime writer Step 04 | online/offline + last seen |
| attendance device heartbeat | `attendance_devices.last_seen_at` | API tersedia; runtime device 0 | kesehatan terminal, bukan guru online |
| employee daily attendance | `attendances` employee rows | AVAILABLE | hadir kerja/pegawai saja |
| teacher teaching attendance | `teaching_attendances` | AVAILABLE — Step 04 | hadir/terlambat + jam scan |
| teaching session start/end | `lesson_attendance_sessions.session_started_at/session_closed_at` + status | AVAILABLE — Step 04 | sesi dimulai/ditutup |
| student attendance completion | roster vs `lms_presensi`, session status | DERIVABLE | selesai/belum setelah endpoint agregasi scoped |
| last teaching activity | session/scan/audit timestamps | PARTIAL | event nyata saja |

## Realtime Infrastructure

- WebSocket/Laravel Reverb/Pusher/Echo/SSE: **MISSING**; Step 04 memakai polling.
- Monitoring polling: `/dashboard/pemantauan` memanggil `/api/teacher-monitoring` setiap 20 detik saat tab visible.
- Teacher heartbeat: Portal Guru mengirim `/api/teacher/presence/heartbeat` setiap 20 detik saat workspace aktif.
- Live teacher monitoring endpoint/page: **AVAILABLE — Step 04**; read-only dan scoped.
- Sidebar menampilkan `Online` untuk user aktif secara statis; ini bukan source untuk monitoring orang lain.

## Target Read-Only Dashboard

| Field | Source yang sah | Status |
|---|---|---|
| Guru/foto/unit/mapel/rombel/jadwal | employee/teacher + schedule relations | available |
| Online/offline + last seen | `user_devices.last_active_at` dengan threshold 90 detik | verified |
| Presensi guru + jam | teaching attendance per schedule | verified |
| Status mengajar | session start/close/status | verified |
| Jumlah siswa | roster schedule | available |
| Presensi siswa selesai/belum | roster vs attendance rows + final status | derivable |
| Last activity/timeline | login event, teaching scan, session start/close, final audit | partial; dilarang fake |

## Permission/Data Scope Target

- Super Admin: global.
- Yayasan/Kepala Bidang/Divisi: hanya allowed units dan permission monitor lintas unit.
- Kepala Sekolah/Waka: unit sendiri.
- Guru: status sendiri; bukan dashboard global.
- Wali Kelas: monitoring rombel sesuai fungsi, bukan semua guru/unit.
- Parent/Siswa/Alumni: tidak punya teacher live monitoring.

Permission khusus `teacher_monitoring.view` sudah tersedia; backend tetap menerapkan `AccessScopeService`. Guru hanya boleh memakai schedule miliknya; Kepsek/Waka dibatasi unit; Yayasan/Divisi memakai allowed-unit scope; Super Admin global.

## Step 04 Decision

Query agregasi read-only sudah dibangun dari jadwal, employee/unit, `teaching_attendances`, session, `user_devices`, dan login event. Polling 20 detik berhenti saat tab hidden; WebSocket tetap tidak diperlukan untuk Step 04. Student attendance completion sengaja mengembalikan status belum tersedia sampai scope berikutnya.
