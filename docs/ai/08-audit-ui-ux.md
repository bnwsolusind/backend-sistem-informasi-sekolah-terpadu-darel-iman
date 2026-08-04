# 08-AUDIT UI/UX — SIMSIT

## Standar Desain Modern Soft Enterprise SIMSIT

Sistem Antarmuka **SIMSIT** menerapkan pedoman `MODERN_SOFT_MODULE_REFACTOR_PROMPT.md` dan `SIMSIT_UI_SYSTEM_PROMPT.md` secara konsisten di seluruh halaman `/web-dashboard`.

### Komponen Standar Reusable

1. **PageHeader**:
   - Memiliki judul halaman, deskripsi singkat, breadcrumb kontekstual, dan area quick action (Tambah Data, Export CSV/Excel, Filter).

2. **KpiCard**:
   - Menampilkan metrik utama dengan ikon Lucide React yang relevan, persentase perubahan, serta latar belakang soft gradient (violet, emerald, amber, sky).

3. **DataTable**:
   - Dilengkapi fungsi sorting, pagination, search input dengan debounce, status badge berwarna harmonis, serta pengubahan otomatis ke Card View pada layar mobile/responsive.

4. **StatusBadge**:
   - Menggunakan varian warna tercurasi:
     - `HADIR` / `AKTIF` / `DISETUJUI`: Soft Green / Emerald
     - `TERLAMBAT` / `PENDING`: Soft Yellow / Amber
     - `IZIN` / `SAKIT`: Soft Blue / Sky
     - `ALPHA` / `NONAKTIF` / `DITOLAK`: Soft Red / Rose

5. **Loading, Empty, & Error State**:
   - Loading: Skeleton animation yang halus.
   - Empty: Komponen `EmptyState` dengan ilustrasi/ikon kontekstual dan tombol reset filter.
   - Error: Alert box ramah pengguna dengan opsional tombol *Try Again*.

---

## Audit Responsive & Dark Mode
- Desktop (>= 1280px): Grid multi-kolom dengan sidebar lengkap dan quick summary drawer.
- Tablet (768px - 1024px): Layout adaptif 2-kolom dengan drawer collapsible.
- Mobile (< 768px): Responsive single column, bottom sheet filter drawer, dan card view pengganti tabel horizontal.
