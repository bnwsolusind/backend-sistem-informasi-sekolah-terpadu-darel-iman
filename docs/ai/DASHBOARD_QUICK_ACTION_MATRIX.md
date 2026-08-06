# DASHBOARD QUICK ACTION MATRIX — SESI 9

Tanggal: 2026-08-06
Tujuan: daftar aksi cepat (quick action) yang tersedia di tiap dashboard + endpoint yang dipanggil, agar konsisten dan tidak ada tombol yang memanggil endpoint salah.

| Dashboard | Quick Action | Navigasi / Endpoint | Guard |
|---|---|---|---|
| Super Admin | Kelola Role & Permission, Kelola Unit, Kelola Pengguna | modul admin (route menu) | `dashboard.super-admin.view` |
| Foundation | Lihat Laporan (siswa, sdm, kelulusan, alumni, mutasi, lintas-unit), Unduh Export | `/api/foundation/laporan/*`, `/api/foundation/laporan/{type}/export` | `foundation.dashboard.view` |
| Kepala Sekolah | Ganti Unit Terpilih, Detail Kehadiran | `/api/dashboard/kepala-sekolah?unit_id=...` | `dashboard.kepala-sekolah.view` |
| Divisi Pendidikan | Detail Siswa/Guru/Laporan per unit | `/api/dashboard/divisi-pendidikan` (scope unitIds) | `dashboard.divisi-pendidikan.view` |
| Waka Kurikulum | Navigasi kurikulum/akademik | modul kurikulum | `dashboard.waka-kurikulum.view` |
| Waka Kesiswaan | Rekap Prestasi Siswa, Catatan Siswa | `/api/dashboard/waka-kesiswaan` | `dashboard.waka-kesiswaan.view` |
| Tata Usaha | Rekap Kehadiran Hari Ini | `/api/dashboard/tata-usaha` | `dashboard.tata-usaha.view` |
| Wali Kelas | Kelas Binaan, Detail Siswa | `/api/dashboard/wali-kelas?class_id=...` (hanya milik homeroom) | `dashboard.wali-kelas.view` |
| Guru Tahfizh | Input Setoran, Lihat Binaan | modul tahfizh (assignment milik user) | `dashboard.guru-tahfizh.view` |
| Guru BK | Catatan Pembinaan | `/api/dashboard/guru-bk` | `dashboard.guru-bk.view` |
| Operator | Operasional harian | `/api/dashboard/operator` | `dashboard.operator.view` |
| Pemantauan | Kelola Indikator, Laporan Bulanan, Pemantauan Divisi, Pengumuman, Rekap Prestasi | `/api/dashboard-pemantauan/*` (POST/PUT/DELETE) | `dashboard.pemantauan.kelola` (via `pastikanHakAkses(butuhKelola=true)`) + route `lihat` |
| Portal Guru | Jadwal, Kelas Ajar, Mutabaah, Catatan | `/api/teacher/dashboard` | `role:Guru|...` + `teacher.dashboard.view` |
| Portal Siswa | Ringkasan Pribadi | `/api/students/dashboard` | scoped per user |
| Portal Orang Tua | Ganti Anak (child switcher), Detail | `/api/portal/dashboard?child_id=...` | scoped per user |
| Portal Alumni | Profil & Data Sendiri | `/api/portal/alumni/dashboard`, `PUT /api/portal/alumni/profile` | scoped per user |

## Aturan
1. Tombol aksi hanya muncul bila user punya permission terkait (`PermissionElement`/`PermissionGuard`).
2. Admin (view-only) TIDAK menampilkan aksi tulis pemantauan karena tidak punya `dashboard.pemantauan.kelola`.
3. Tidak ada quick action yang memanggil endpoint di luar scope role (semua diuji di `DashboardRoleAccessTest`).
