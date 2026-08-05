# Alur Presensi LMS & Workflow Pembelajaran

```text
Guru Login
→ Memilih Jadwal Pelajaran (ClassSchedule)
→ Membuka Pertemuan Pembelajaran (LessonAttendanceSession)
→ Sistem Mengambil Daftar Siswa Aktif Rombel
→ Guru Mengisi Presensi Pembelajaran (lms_presensi)
→ Backend Memvalidasi Penugasan Mengajar & Keanggotaan Siswa
→ Transaction Upsert ke lms_presensi
→ Hitung Rekap Kehadiran
→ Cache Invalidation (TanStack Query)
→ Sinkronisasi Otomatis ke Dashboard Guru, Wali Kelas, Kepsek, Portal Siswa, dan Portal Orang Tua
```

## Matrix Scoping Akses Presensi
- **Guru**: Mengisi dan melihat presensi pada jadwal penugasannya.
- **Wali Kelas**: Melihat dan memonitor presensi seluruh siswa di kelas/rombel tanggung jawabnya.
- **Kepala Sekolah**: Monitoring presensi unit sekolah aktif.
- **Yayasan**: Monitoring presensi lintas unit pendidikan.
- **Siswa**: Melihat riwayat presensi pembelajaran sendiri.
- **Orang Tua**: Melihat riwayat presensi pembelajaran anak terhubung.