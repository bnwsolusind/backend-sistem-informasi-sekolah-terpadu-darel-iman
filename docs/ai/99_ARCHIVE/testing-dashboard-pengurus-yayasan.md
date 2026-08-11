# Testing Dashboard Pengurus Yayasan

## Checklist Uji Coba

1. [x] Akses route `/dashboard/yayasan` dengan role `Yayasan` / `Ketua Yayasan`.
2. [x] Verifikasi kemunculan badge **`Mode Monitoring • Akses Hanya Lihat`**.
3. [x] Verifikasi 12 KPI card menampilkan angka agregasi aktual dari database.
4. [x] Filter global (Tahun Ajaran, Semester, Unit Pendidikan, Status) memutakhirkan KPI dan tabel.
5. [x] Sinkronisasi query parameter URL saat filter diubah.
6. [x] Navigasi dari KPI card ke detail halaman terkait.
7. [x] Pengujian responsive pada desktop, tablet, dan mobile.
8. [x] Linting & build frontend tanpa error.
