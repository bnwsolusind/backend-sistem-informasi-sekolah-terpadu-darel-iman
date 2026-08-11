# MODULE: PORTAL GURU

Bukti historis: `99_ARCHIVE/PROMPT_1_FOUNDATION_REPORT.md`, `99_ARCHIVE/ACADEMIC_LMS_FLOW.md`, `99_ARCHIVE/LMS_ATTENDANCE_FLOW.md`, `99_ARCHIVE/GRADE_FINALIZATION_FLOW.md`, `99_ARCHIVE/STUDENT_NOTE_FLOW.md`, `99_ARCHIVE/CHAT_ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/academic-lms-*`.

## Scope

Workspace guru untuk aktivitas mengajar; semua data terbatas pada penugasan mengajar (ClassSchedule) + rombel wali kelas (homeroom) + halaqah binaan (musyrif). Step 04 menambahkan teaching attendance/session tanpa mengubah login menjadi presensi.

## Menu / Kemampuan

| Area | Kemampuan |
|---|---|
| Dashboard Guru | Jadwal hari ini, kelas diampu, statistik presensi & penilaian |
| Jadwal | Jadwal penugasan mengajar (ClassSchedule) |
| Teaching attendance | Scan QR kartu guru pada jadwal sendiri; status `hadir`/`terlambat` dari server time |
| Teaching session | `Siap Mengajar` → `Sedang Mengajar` → `Selesai Mengajar`; start hanya setelah scan valid |
| Presence | Heartbeat perangkat terpisah dari attendance/session |
| Presensi | Buka pertemuan pembelajaran, isi `lms_presensi`, rekap |
| Materi & Penugasan | Modul ajar, materi, media, referensi, aktivitas, diskusi, penugasan |
| Penilaian | Input nilai, auto-calculate, finalisasi (draft→finalized) |
| Tahfizh | Setoran siswa binaan halaqah (guru tahfizh) |
| Mutabaah | Verifikasi & finalisasi checklist (pembimbing/musyrif) |
| Catatan Siswa | `student_notes` — `visible_to_parent` / `visible_to_student` |
| Chat | Kontak siswa hanya kelas wali/jadwal aktif (`isAssignedToStudent`); chat pegawai antar-pegawai unit sama |

## Middleware & Route

`/api/teacher/*` (TeacherPortalController, auth + teacher portal). Scope fail-closed: tidak dikenal → 404/403.

## Step 04 Endpoint

| Method | Endpoint | Permission/context |
|---|---|---|
| GET | `/api/teacher/step04/schedules` | teacher role; schedule sendiri + periode/hari aktif |
| POST | `/api/teacher/teaching-attendance/scan` | `teaching_attendance.scan`; QR active + schedule owner/time window |
| POST | `/api/teacher/teaching-sessions/{session}/start` | `teaching_session.start`; attendance `hadir/terlambat` dan session ready |
| POST | `/api/teacher/teaching-sessions/{session}/close` | `teaching_session.close`; owner dan active session |
| POST | `/api/teacher/presence/heartbeat` | `teacher_presence.heartbeat`; update `user_devices.last_active_at` |

Session completed tidak dapat dimulai ulang. Student roster/finalization bukan bagian Step 04.

## Referensi

- Ownership chat: `99_ARCHIVE/CHAT_ROLE_SCOPE_MATRIX.md`
- Presensi: `05_MODULE/ABSENSI.md` · Nilai: `05_MODULE/AKADEMIK.md` · Tahfizh: `05_MODULE/TAHFIZH.md` · Mutabaah: `05_MODULE/MUTABAAH.md`
