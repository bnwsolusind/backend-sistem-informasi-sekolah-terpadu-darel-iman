# Matriks Sinkronisasi Presensi LMS

```text
SOURCE EVENT: Input / update presensi pembelajaran kelas oleh Guru/Admin.
SOURCE TABLE: lms_presensi (dengan FK ke class_schedules & students).
SOURCE SERVICE: App\Services\LmsPresensiService & App\Repositories\Eloquent\LmsPresensiRepository.
STATUS MAPPING:
  - hadir -> Hadir (Badge: emerald)
  - izin -> Izin (Badge: indigo)
  - sakit -> Sakit (Badge: sky)
  - alpa / alpha / absen -> Alpa (Badge: rose)
  - terlambat -> Terlambat (Badge: amber)
UNIT FILTER: Filter berdasarkan education_unit_id dari ClassSchedule / Student.
ACADEMIC YEAR FILTER: Filter berdasarkan academic_year_id dari ClassSchedule.
SEMESTER FILTER: Filter berdasarkan semester_id dari ClassSchedule (Opsi A — Relasi via ClassSchedule).
CLASS/ROMBEL FILTER: Filter berdasarkan kelas_id dari ClassSchedule / Student.
TEACHER FILTER: Filter berdasarkan employee_id dari ClassSchedule.
STUDENT FILTER: Filter berdasarkan siswa_id dari lms_presensi.
CACHE KEY: Automatic cache invalidation pada TanStack Query (`lesson-attendance-sessions`, `lms-presensi`, `dashboard-stats`).
CACHE INVALIDATION: Dilakukan setelah submit/update presensi tunggal maupun bulk.
DASHBOARD GURU: Menampilkan rekap kehadiran hari ini per jadwal penugasan mengajar.
DASHBOARD WALI KELAS: Menampilkan rekap presensi seluruh siswa pada rombel tanggung jawabnya.
DASHBOARD KEPALA SEKOLAH: Menampilkan ringkasan kehadiran unit sekolah aktif.
DASHBOARD YAYASAN: Menampilkan agregat presensi lintas unit pendidikan.
PORTAL SISWA: Menampilkan riwayat presensi pembelajaran pribadi siswa yang bersangkutan.
PORTAL ORANG TUA: Menampilkan riwayat presensi pembelajaran hanya untuk anak terhubung.
REPORT: Rekap harian, mingguan, dan bulanan presensi pembelajaran per mata pelajaran.
STATUS: VERIFIED — LMS ATTENDANCE SYNC FIXED
```