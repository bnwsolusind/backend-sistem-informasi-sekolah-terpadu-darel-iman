# BUG REGISTER — PRA-SESI 16 STEP 05

Status: Step 05 verification 2026-08-11. Temuan yang sudah diperbaiki diberi disposition; temuan deferred tetap menjadi blocker/gap untuk scope berikutnya.

## P0

| ID | Temuan | Evidence/root cause | Dampak |
|---|---|---|---|
| P0-01 | Gate attendance/config tidak punya permission middleware khusus | **FIXED Step 02**: route memakai permission view/scan/config dan controller unit scope fail-closed | regression covered; residual flow business rule tetap terpisah |
| P0-02 | Siswa dapat membuat transaksi izin/sakit | **FIXED Step 02**: permission student mutation dicabut dan controller tidak memakai role fallback | parent-controlled transaction enforced |

## P1

| ID | Temuan | Evidence/root cause | Dampak |
|---|---|---|---|
| P1-01 | Login pegawai/guru otomatis dianggap hadir | **FIXED Step 02**: password/QR/unified login tidak memanggil attendance writer | online/login tidak lagi tercampur dengan attendance |
| P1-02 | Evaluasi sesi mengajar dari login memakai kolom jadwal yang tidak ada | **FIXED/MITIGATED Step 04**: login tetap auth-only; teaching evaluation memakai service/session Step 04 dan kolom aktual | legacy roster evaluation tetap di luar scope |
| P1-03 | QR guru belum mencatat kehadiran mengajar per jadwal | **FIXED Step 04**: `/api/teacher/teaching-attendance/scan` memakai active `qr_credentials`, schedule owner, unit, period, day/time, transaction lock, dan unique schedule/date | Step04 QR attendance verified |
| P1-04 | Workspace Guru menyimpan ke API legacy yang tidak cocok schema | **MITIGATED Step 04**: panel teaching attendance/session memakai endpoint Step 04; legacy roster/finalization path masih terpisah dan belum menjadi Step04 PASS claim | QR/session path tidak lagi bergantung pada legacy attendance writer |
| P1-05 | Finalize presensi siswa tidak memerlukan teaching attendance/session aktif/roster lengkap | **FIXED Step 05**: linked Step 04 session wajib active; final menolak roster/status unmarked dan tetap scoped owner | targeted roster/finalization regression pass; enrollment table eksplisit masih deferred |
| P1-06 | Gate QR tidak resolve `qr_credentials` dan tidak validasi period/enrollment/unit terminal secara fail-closed | **FIXED Step 05 core**: stable student QR → active `qr_credentials`, unit terminal/user scope, IN/OUT sequence, transaction/advisory duplicate guard | gate/QR regression pass; academic period tidak relevan untuk gate |
| P1-07 | Login masih dua UI dan redirect employee selalu `/dashboard` | **FIXED Step 02**: `/masuk` unified, family alias redirects, role resolver returns default portal | explicit workspace chooser remains for ambiguous identity |
| P1-08 | Backend runtime timezone UTC, kontrak Asia/Jakarta | **FIXED Step 04**: `config/app.php` dan attendance config memakai `Asia/Jakarta`; schedule/late/presence memakai server time | time window dan timestamp aligned |
| P1-09 | Portal Guru frontend tidak role-guarded; API teacher allowlist terlalu lebar | **FIXED Step 02**: frontend teacher guard and narrowed teacher API role allowlist | module-specific permission audit remains |
| P1-10 | Dashboard Divisi/TU/Kepala memakai nama kolom PostgreSQL yang tidak aktual | **FIXED Step 03**: `laporan_bulanans` memakai `id_tahun_ajaran/id_semester/status_validasi`; student dashboard memakai `birth_date/parent_id`; announcement/context payload aligned | targeted dashboard test and browser UAT pass |
| P1-11 | Operator default portal mengarah ke dashboard Tata Usaha | **FIXED Step 03**: frontend/backend resolver memakai `/dashboard/operator`; payload KPI Operator aligned to real unit-scoped counts | route and browser negative smoke pass |

## Step 02 Runtime Findings Resolved

- Teacher dashboard KPI used `nilai`, `teacher_id`, `date`, `user_id`, and `is_active` against canonical PostgreSQL columns. The read-only dashboard path now uses `nilai_guru`, `guru_id`, `record_date`, `Notification::userQuery()`, and `status_aktif`; `TeacherPortalApiTest` passes 6/6.
- Shared layout no longer fetches `/education-units` for portal roles without unit permission.
- Student users no longer initialize the employee chat widget or call `/employee/chat/conversations`.
- `GuruDashboardPage` now imports the existing `DetailModal`; browser Guru portal renders without a runtime exception.

## Step 03 Runtime Findings Resolved

- Dashboard child routes now fail closed through permission guards; Foundation descendants are nested below `foundation.dashboard.view`.
- Generic Tahfizh route now requires class/schedule/master permission. Guru Tahfizh, Wali Kelas, and Musyrif quick actions use the teacher workspace instead of an unscoped class lookup.
- Operator dashboard no longer contains fallback business numbers or synthetic activity rows.
- Musyrif KPI fallback values and student portal mutation controls that backend rejects were removed.
- Floating employee chat no longer initializes for roles without `chat.conversation.view`.

## P2

| ID | Temuan | Evidence/root cause | Dampak |
|---|---|---|---|
| P2-01 | Live monitoring guru belum ada | **FIXED Step 04**: `/api/teacher-monitoring` + `TeacherMonitoringService` + read-only panel; polling 20 detik | Kepsek/Yayasan browser UAT melihat 1 real teacher row |
| P2-02 | Presence infrastructure hanya partial | **FIXED Step 04 untuk Guru**: heartbeat menulis `user_devices.last_active_at`, threshold 90 detik; websocket/SSE tetap tidak diperlukan | online/offline punya source runtime yang terpisah |
| P2-03 | QR memiliki beberapa source/token/fallback | **Teacher context fixed Step 04; student context fixed Step 05**: stable HMAC student token + active credential; legacy lesson fallback retained only for compatibility | teacher/student QR context consistent |
| P2-04 | Demo QR kosong | **FIXED Step 04 untuk employee card**: 1 active employee QR, 1 demo schedule, 1 teaching attendance/session; student/device scenarios tetap terpisah | demo Guru/monitoring available |
| P2-05 | Workspace Guru berisi fallback bisnis dan local scan fallback | **Step04 panel uses server/API state**; legacy roster controls masih memiliki debt dan tidak boleh dijadikan bukti Step04 data integrity | scope next: legacy roster/finalization cleanup |
| P2-06 | Parent dan student navigation bercampur | parent diizinkan route siswa dan diarahkan ke beberapa halaman siswa | portal contract membingungkan |
| P2-07 | `showSession()` menolak session tanpa sample attendance | access ditentukan dari first attendance row | draft kosong tidak dapat dilihat walau owner sah |
| P2-08 | Duplicate gate attendance tidak dilindungi unique DB constraint | **MITIGATED Step 05**: transaction lock + PostgreSQL advisory key + duplicate service response; historical schema still lacks a DB unique constraint | targeted duplicate pass; migration/index decision remains deferred for existing partition data |
| P2-09 | Musyrif belum memiliki endpoint kelompok binaan khusus | Dashboard masih membaca endpoint Guru Tahfizh | scope Musyrif belum lengkap; empty state sudah fail-safe |
| P2-10 | Topbar tanggal UI pernah berbeda dari `server_time` monitoring | **FIXED Step 04 follow-up**: hardcode dihapus; Portal Guru/Monitoring mengambil `server_time` dan memformat `Asia/Jakarta` | browser verified `Selasa, 11 Agustus 2026` untuk server `2026-08-11T18:27:18+07:00` |

## P3

| ID | Temuan | Evidence/root cause | Dampak |
|---|---|---|---|
| P3-01 | Workspace attendance memakai modal/table/button custom, bukan seluruhnya canonical component/action `⋮` | `TeacherTeachingWorkspacePage.jsx` | inkonsistensi UI; bukan blocker data |
| P3-02 | Status awal siswa di UI lama jatuh ke `Alpha`, bukan `Belum Dipilih` | fallback `attendanceData[id]?.status || 'Alpha'` | risiko human error sebelum review |

## Test Gaps

- Tidak ada negative test gate untuk Parent/Siswa/user tanpa permission.
- **FIXED Step 04**: test teacher card → schedule teaching attendance, invalid/other teacher, cross-unit, outside-time-window, duplicate, session state, heartbeat, monitoring scope.
- Tidak ada test bahwa login tidak mencatat attendance.
- Tidak ada test finalize ditolak tanpa teacher teaching attendance dan active session.
- **FIXED Step 05**: targeted test membuktikan roster dilengkapi `belum_diverifikasi` dan finalisasi ditolak sebelum semua status dipilih.
- **FIXED Step 05**: targeted test membuktikan student QR stable, gate IN/OUT duplicate, lesson QR roster, dan parent child-scoped opaque QR.
- **FIXED Step 05**: linked lesson capture/finalization ditolak bila teaching session Step 04 belum active atau sudah completed.
- Tidak ada test PostgreSQL untuk endpoint `/api/teacher/attendance` legacy.
- Legacy tests/fixtures outside the Step 02 targeted set still require isolation where they assume old module schemas or old auth/attendance behavior; do not delete them without a contract decision.
- Full PHPUnit suite and combined regression command remain incomplete due timeout; do not convert this into a full-suite PASS claim.
- Browser Step 04 verified Guru flow, Kepsek/Yayasan monitoring, and responsive `1440/1024/768/390` with zero console errors and no document overflow; table-local horizontal scroll at tablet remains intentional.
