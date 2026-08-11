# MODULE: ABSENSI

Bukti historis: `99_ARCHIVE/LMS_ATTENDANCE_FLOW.md`, `99_ARCHIVE/EMPLOYEE_ATTENDANCE_SCHEMA_RECONCILIATION.md`, `99_ARCHIVE/TEACHING_SCHEDULE_ATTENDANCE_AUDIT.md`, `99_ARCHIVE/GRADE_SOURCE_MAP.md`.

## Domain Presensi (WAJIB TERPISAH)

| Domain | Tabel aktual | Pembuat data | Catatan |
|---|---|---|---|
| Absensi gerbang siswa | `attendances` (`tipe_presensi=Siswa`) | terminal/petugas | datang/pulang sekolah |
| Kehadiran pegawai harian | `attendances` (`Pegawai/Guru`) | flow pegawai | bukan bukti hadir mengajar |
| Kehadiran guru mengajar | `teaching_attendances` | `TeachingAttendanceService` + scan kartu guru per jadwal | **AVAILABLE — Step 04** |
| Presensi pembelajaran siswa | `lesson_attendance_sessions` + `lms_presensi` | guru jadwal | checklist utama + QR opsional |
| Presensi ibadah | `worship_attendance_sessions/details` | musyrif/pembimbing | domain mandiri |

## Skema `attendances` (partitioned, reconciled)

- `student_id` & `class_id` nullable (setelah reconciliation, DROP NOT NULL) — dipakai `employee_id` untuk presensi pegawai.
- `tipe_presensi VARCHAR(20) DEFAULT 'Siswa'`, `employee_id UUID NULL`, `unit_pendidikan_id UUID NULL`.
- Source of truth: log pegawai pakai `employee_id`; log siswa pakai `student_id`.

## Alur Presensi Pembelajaran

Step 04 + Step 05 flow: guru pilih jadwal → scan QR guru → teaching attendance valid → mulai sesi → ambil roster aktif → checklist/QR siswa → review → finalisasi → tutup sesi → sinkronisasi monitoring. Student QR hanya identitas opaque; status tetap ditulis guru ke `lms_presensi`.

Finalisasi Step 05 fail-closed terhadap active teaching session bila session Step 04 terhubung, roster aktif, seluruh student row, status unmarked, ownership, dan duplicate scan. Step 04 tetap fail-closed untuk QR, schedule, unit, period, time window, session ownership, dan session state. Detail status/gap berada di `ATTENDANCE_FLOW_MATRIX.md`.

## Invariant

- Online/login bukan hadir mengajar.
- Hadir mengajar bukan otomatis sedang mengajar; sesi harus dimulai.
- QR hanya identitas, bukan status dan bukan authorization.
- QR siswa membantu input; guru tetap review dan bertanggung jawab atas final.
- Guru Kelas/Mapel berasal dari assignment + schedule; Wali Kelas adalah assignment berbeda.

## Scope Akses

| Pelaku | Cakupan |
|---|---|
| Guru | Mengisi & melihat presensi pada jadwal penugasannya |
| Wali Kelas | Monitor presensi seluruh siswa di rombel |
| Kepala Sekolah | Monitoring unit sekolah aktif |
| Yayasan | Monitoring lintas unit |
| Siswa | Riwayat presensi sendiri |
| Orang Tua | Riwayat presensi anak terhubung |

## Referensi

- Baseline canonical: `05_MODULE/ATTENDANCE_FLOW_MATRIX.md`, `05_MODULE/QR_CARD_FLOW_MATRIX.md`, `05_MODULE/TEACHER_REALTIME_MONITORING_MATRIX.md`
- Detail arsip: `99_ARCHIVE/LMS_ATTENDANCE_FLOW.md`, `99_ARCHIVE/LMS_ATTENDANCE_SYNC_MATRIX.md`, `99_ARCHIVE/EMPLOYEE_ATTENDANCE_SCHEMA_RECONCILIATION.md`, `99_ARCHIVE/TEACHING_SCHEDULE_ATTENDANCE_AUDIT.md`
- Laporan presensi: `05_MODULE/LAPORAN.md`
