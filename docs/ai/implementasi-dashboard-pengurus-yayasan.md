# Implementasi Dashboard Pengurus Yayasan

Sistem Manajemen Sekolah Terpadu Dar el-Iman

## Deskripsi Arsitektur

Dashboard Pengurus Yayasan dibangun sebagai lapisan agregasi dan monitoring (Read-Only) di atas modul utama SIMSIT. 

```text
Backend Layer
  FoundationDashboardService.php (Agregasi Data Lintas Unit & Filtering)
        │
  FoundationDashboardController.php (Sanctum Auth & Permission Check)
        │
  GET /api/foundation/*

Frontend Layer
  DashboardLayout.jsx (Navigasi Sidebar Pengurus Yayasan)
        │
  FoundationGlobalFilterBar.jsx (Sync Query Parameter URL)
        │
  Pages:
    - /dashboard/yayasan (Dashboard Utama, KPI 12 Card, Chart Recharts, Summary Unit)
    - /dashboard/yayasan/unit-pendidikan (Grid & List Unit)
    - /dashboard/yayasan/unit-pendidikan/:id (Detail 8 Tab Unit)
    - /dashboard/yayasan/pegawai-guru (Data SDM Lintas Unit)
    - /dashboard/yayasan/siswa (Data Siswa Aktif)
    - /dashboard/yayasan/siswa-baru (Data Penerimaan Siswa Baru)
    - /dashboard/yayasan/mutasi-siswa (Data Mutasi & Berhenti)
    - /dashboard/yayasan/kelulusan-alumni (Data Tingkat Akhir, Lulus & Alumni)
    - /dashboard/yayasan/informasi-sekolah (Informasi, Pengumuman, Agenda, Prestasi)
    - /dashboard/yayasan/laporan (Export & Preview Laporan Lintas Unit)
```

## Prinsip Desain UI/UX
- Mengikuti standar **Modern Soft Enterprise** (`#0E5C44` Primary, soft shadows, rounded 18px cards).
- Menampilkan badge utama **`Mode Monitoring • Akses Hanya Lihat`**.
- Tidak menampilkan tombol aksi manipulasi data (Tambah, Edit, Hapus) kecuali pengguna memiliki izin khusus.
