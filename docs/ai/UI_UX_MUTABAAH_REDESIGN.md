# Laporan Redesign UI/UX Modern Modul Mutaba’ah (UI_UX_MUTABAAH_REDESIGN.md)

Dokumen ini merinci hasil perbaikan antarmuka (UI) dan pengalaman pengguna (UX) pada **8 Halaman Modul Mutaba’ah** agar berpenampilan modern, bersih, responsif, dan mudah digunakan sesuai standar *Modern Enterprise SaaS & Islamic Education Design System*.

---

## 1. Identitas Visual & Tokoh Desain
- **Primary**: `#0E5C44` (Deep Emerald)
- **Secondary**: `#1E8E5A` (Forest Green)
- **Accent**: `#3FBF75` (Mint Green)
- **Background**: `#F7F9FC` (Soft Cool Slate)
- **Card**: `#FFFFFF` (Shadow Soft `0 2px 10px rgba(0,0,0,0.04)`)
- **Typography**: Inter (Clean, Accessible, High Contrast)
- **Border Radii**: Cards `18px`, Inputs/Buttons `10px–12px`
- **Icons**: Lucide React Icons

---

## 2. Rangkuman Redesign per Halaman

### Halaman 1: Dashboard Mutaba’ah (`/dashboard/mutabaah`)
- **LAYOUT**: Header ringkas, 6 KPI Utama interaktif, Banner Alert "Perlu Perhatian Hari Ini", Grafik Tren Keterisian 30 Hari, Distribusi Status, Daftar Agenda Hari Ini, Unfilled Students Alert, Quick Actions Bar.
- **PRIMARY ACTION**: Quick Navigation Bar (+ Tambah Agenda, + Susun Template, + Assign Template, + Assign Pembimbing, + Rekap).
- **UX IMPROVEMENT**: Menghilangkan visual clutter dan menggantinya dengan informasi prioritas operasional.
- **STATUS**: `UI REDESIGNED`

### Halaman 2: Rekap Mutaba’ah (`/dashboard/mutabaah/rekap`)
- **LAYOUT**: Header Laporan Rekap, Filter 2-Tingkat (Utama + Drawer Lanjutan dengan Active Chips), Periode Tabs (Ringkasan, Per Siswa, Per Indikator, Per Pembimbing), Tabel Rekapitulasi Siswa, Student Detail Modal.
- **PRIMARY ACTION**: `Export Rekap (Excel/PDF)`.
- **UX IMPROVEMENT**: Penyaringan data bertingkat dengan indikator chip aktif, mencegah kepadatan form filter pada layar utama.
- **STATUS**: `UI REDESIGNED`

### Halaman 3: Target & Evaluasi (`/dashboard/mutabaah/target-evaluasi`)
- **LAYOUT**: Header Target & Evaluasi, 4 KPI Target, Visual Progress Bars %, Badge Status Target (`Tercapai` / `Perlu Bimbingan`), Interactive Evaluation Table, Step-Based Target Modal Form.
- **PRIMARY ACTION**: `+ Tambah Target Mutaba’ah`.
- **UX IMPROVEMENT**: Visualisasi persentase capaian riil vs target dengan indikator warna status intuitif.
- **STATUS**: `UI REDESIGNED`

### Halaman 4: Rincian Agenda TU (`/dashboard/mutabaah/rincian-agenda`)
- **LAYOUT**: Header Agenda TU, Toggle Kalender & Daftar, Status Cards Agenda, Agendas Table (Kode, Nama, Kategori, Tipe Input, Bobot, Status), Agenda CrudDrawer.
- **PRIMARY ACTION**: `+ Tambah Agenda`.
- **UX IMPROVEMENT**: Filter kategori instan, pencarian kata kunci, serta pengelolaan soft delete & restore.
- **STATUS**: `UI REDESIGNED`

### Halaman 5: Template Agenda (`/dashboard/mutabaah/template-agenda`)
- **LAYOUT**: Header Template Agenda, Template Cards/Table View, Template CrudDrawer, `TemplateItemsDrawer` (Indicator Builder dengan drag/sort order handles, bobot, target default, & paraf ortu toggle).
- **PRIMARY ACTION**: `+ Tambah Template`.
- **UX IMPROVEMENT**: Pembagian tanggung jawab antara pembuatan master header template dan penyusunan detail indikatornya.
- **STATUS**: `UI REDESIGNED`

### Halaman 6: Assign Template (`/dashboard/mutabaah/assign-template`)
- **LAYOUT**: Header Penugasan Template, Assignment Summary Cards, Assignment Table, Step-Based Assignment Form (Template → Periode → Scope Target → Options → Review) dengan peringatan bentrok periode.
- **PRIMARY ACTION**: `+ Assign Template`.
- **UX IMPROVEMENT**: Mencegah duplikasi atau bentrok periode penugasan template ke rombel secara otomatis.
- **STATUS**: `UI REDESIGNED`

### Halaman 7: Assign Pembimbing (`/dashboard/mutabaah/assign-pembimbing`)
- **LAYOUT**: Header Penugasan Pembimbing, Layout 2-Panel Desktop (Daftar Pembimbing | Detail Scope Penugasan), Supervisor Cards dengan Avatar & Kuota Siswa Binaan, Form Drawer dengan Permission Toggles (`can_input`, `can_edit`, `can_finalize`, `can_view_report`) & Validasi Unit Pesantren/Ma'had.
- **PRIMARY ACTION**: `+ Assign Pembimbing`.
- **UX IMPROVEMENT**: Mempermudah penugasan Musyrif/Musyrifah/Wali Kelas dan pembatasan otorisasi secara aman.
- **STATUS**: `UI REDESIGNED`

### Halaman 8: Monitoring Orang Tua (`/dashboard/mutabaah/monitoring-orang-tua`)
- **LAYOUT**: Header Monitoring Orang Tua, Read-only Parent Signature KPIs, Active Filter Status Paraf (`Sudah` / `Belum`), Parent Signatures Table, Audit Detail Modal dengan ISO8601 timestamp, User Identity, dan Security Metadata.
- **PRIMARY ACTION**: Read-only Status Filter & Search.
- **UX IMPROVEMENT**: Antarmuka khusus pemantauan tanpa tombol create/edit yang tidak relevan bagi peranan audit.
- **STATUS**: `UI REDESIGNED`

---

## 3. Status Akhir

```text
MUTABAAH UI/UX REDESIGN PASSED
```
