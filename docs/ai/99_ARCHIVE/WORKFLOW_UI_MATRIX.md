# Workflow UI Matrix - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Verified (Guided Flow Standard Enforced)

---

## 1. Overview & Principle

In accordance with Enterprise UX Principle #4 & #16:
> "UI mengikuti Flow Sistem. User selalu mengetahui lokasi berada, pekerjaan yang sedang dilakukan, dan langkah berikutnya. Flow Sistem: MASTER DATA -> AKADEMIK -> LMS -> TRANSAKSI -> MONITORING -> PORTAL -> LAPORAN."

Every major workspace incorporates the `WorkflowStepBar` component to visually guide users step-by-step through their domain tasks with explicit "Langkah Berikutnya" action triggers.

---

## 2. Module Workflow Specifications

### A. Guru Workflow
`Dashboard` -> `Jadwal Hari Ini` -> `Presensi Pembelajaran` -> `Materi Ajar` -> `Aktivitas Belajar` -> `Diskusi` -> `Tugas & Ujian` -> `Nilai & Rapor` -> `Selesai`

### B. Guru Tahfizh / Musyrif Workflow
`Dashboard` -> `Daftar Santri Binaan` -> `Presensi Ibadah / Sholat` -> `Setoran Hafalan (Surah/Baris)` -> `Murajaah Harian` -> `Mutabaah Yaumiyah` -> `Rekap Target` -> `Selesai`

### C. Wali Kelas Workflow
`Dashboard Homeroom` -> `Presensi Harian Rombel` -> `Verifikasi Izin / Sakit` -> `Koreksi Kehadiran` -> `Monitoring Mutabaah` -> `Tindak Lanjut Siswa` -> `Rapor Kelas` -> `Selesai`

### D. Siswa Workflow
`Portal Ringkasan` -> `Jadwal Pelajaran` -> `Materi & Video` -> `Pengerjaan Tugas` -> `Simulasi Ujian CBT` -> `Mutabaah Yaumiyah` -> `Rapor & Nilai` -> `Selesai`

### E. Orang Tua Workflow
`Portal Ringkasan` -> `Kehadiran Anak` -> `Pemantauan Mutabaah` -> `Setoran Tahfizh` -> `Chat Guru / Walas` -> `Nilai & Rapor` -> `Selesai`

### F. Master Data & Management Workflow
`Master Data` -> `Akademik & Kurikulum` -> `LMS & Modul` -> `Transaksi & Presensi` -> `Monitoring Operasional` -> `Portal Civitas` -> `Laporan Executif`

---

## 3. Workflow Implementation Matrix

| Module / Domain | Guided Step Bar | Next Step Trigger | Breadcrumb Indicator | Contextual Help |
|---|---|---|---|---|
| Guru Workspace | Enabled | Yes (Next Tab/Page) | Active (`/portal-guru/workspace`) | Tooltip & Guidelines |
| Academic LMS | Enabled | Yes (Next Stage) | Active (`/dashboard/akademik/*`) | Tooltip & Guidelines |
| Attendance Workspace | Enabled | Yes (Next Verification) | Active (`/absensi/*`) | Tooltip & Guidelines |
| Tahfizh Workspace | Enabled | Yes (Next Recitation) | Active (`/dashboard/tahfizh`) | Tooltip & Guidelines |
| Mutabaah Workspace | Enabled | Yes (Next Evaluation) | Active (`/dashboard/mutabaah`) | Tooltip & Guidelines |
| Student Portal | Enabled | Yes (Next Assignment) | Active (`/portal-siswa/*`) | Tooltip & Guidelines |
| Parent Portal | Enabled | Yes (Next Monitoring) | Active (`/portal-orangtua/*`) | Tooltip & Guidelines |
