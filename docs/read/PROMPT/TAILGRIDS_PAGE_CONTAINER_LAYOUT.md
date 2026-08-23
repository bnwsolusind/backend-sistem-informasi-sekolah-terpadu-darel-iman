# TailGrids Page Container, Card & Layout Integration Guideline

## Overview
Dokumen ini berisi panduan teknis kanonis untuk pengaturan **Container, Spacing (Margin & Padding), Card Layout, dan Datatable Spacing** pada Sistem Manajemen Sekolah Terpadu (SIMSIT). Semua halaman baru maupun halaman yang direfaktor **WAJIB** mengikuti standar layout ini untuk menjamin konsistensi visual di seluruh sistem.

---

## 1. Page Container & Layout Spacing Standard

### Canonical Container Wrapper
Setiap halaman dashboard dibungkus menggunakan komponen `PageContainer` dari `@/components/app/PageContainer`:

```jsx
import PageContainer from '@/components/app/PageContainer'

export default function ExamplePage() {
  return (
    <PageContainer className="space-y-6 pb-12">
      {/* Konten Halaman: KPI Grid, Cards Analytics, Datatable */}
    </PageContainer>
  )
}
```

### Aturan Spacing & Padding Page Container:
1. **Lebar Maksimal (`max-w-7xl`)**: Dikendalikan secara otomatis oleh `PageContainer` (`mx-auto w-full max-w-7xl`).
2. **Vertikal Spacing (`space-y-6 pb-12`)**:
   - Jarang antarelemen halaman: `space-y-6` (24px).
   - Padding bawah halaman: `pb-12` (48px) untuk menjamin ruang gulir yang nyaman di bagian bawah.
3. **Hindari Double Horizontal Padding**:
   - Karena layout utama (`DashboardLayout`) sudah menyediakan padding viewport horizontal (`px-4 sm:px-6 md:px-8 py-6`), **JANGAN** menambahkan `px-4` atau `py-6` langsung pada prop `className` dari `PageContainer`.

---

## 2. Card Container & Grid Layout System

### A. KPI Stats Grid Section
Gunakan `MasterStatsGrid` dan `MasterStatCard` dari `@/components/master-data`:

```jsx
<MasterStatsGrid columns={5}>
  <MasterStatCard icon={Users} label="Total Siswa" value={1250} subtitle="Total terdaftar" variant="success" />
  <MasterStatCard icon={GraduationCap} label="Siswa Aktif" value={1180} subtitle="94.4% dari total" variant="info" />
  <MasterStatCard icon={UserCheck} label="Siswa Alumni" value={45} subtitle="3.6% dari total" variant="warning" />
  <MasterStatCard icon={UserMinus} label="Mutasi Keluar" value={15} subtitle="1.2% dari total" variant="neutral" />
  <MasterStatCard icon={UserX} label="Siswa Non-Aktif" value={10} subtitle="0.8% dari total" variant="danger" />
</MasterStatsGrid>
```

### B. Standard Analytics Card (Recharts / Metrics Cards)
Gunakan komponen TailGrids `Card` dari `@/components/tailgrids/core/card`:

```jsx
<Card className="rounded-[18px] border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-[#1B2433]">
  <CardHeader className="pb-2">
    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center justify-between">
      <span>Siswa per Unit Pendidikan</span>
      <Badge color="emerald" size="sm">Distribution</Badge>
    </CardTitle>
    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
      Komposisi siswa berdasarkan unit sekolah Islam terpadu
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-2">
    {/* Body Konten / Chart */}
  </CardContent>
</Card>
```

### C. Multi-Column Grid Layout:
- **2 Kolom (Large Screens)**: `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">`
- **3 Kolom (Medium Screens)**: `<div className="grid grid-cols-1 md:grid-cols-3 gap-6">`

---

## 3. Datatable Card & Viewport Spacing Standard

Untuk kartu utama pembungkus Datatable:

```jsx
<div className="overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-[#1B2433]">
  {/* Toolbar Header 3-Baris Terstruktur */}
  <div className="p-4 sm:p-6 space-y-4 border-b border-slate-100 dark:border-slate-800/80">
    {/* Baris 1: Title & Action Buttons */}
    {/* Baris 2: Search input full-width (w-full) */}
    {/* Baris 3: Filter controls flex horizontal */}
  </div>

  {/* Viewport Tabel dengan Horizontal Padding */}
  <div className="px-4 sm:px-6 md:px-8 overflow-x-auto">
    <TableRoot fullBleed={false}>
      {/* TableHeader & TableBody */}
    </TableRoot>
  </div>

  {/* Footer Pagination Navigation */}
  <div className="w-full border-t border-slate-100 px-4 py-3.5 sm:px-6 md:px-8 dark:border-slate-800">
    <Pagination currentPage={page} totalPages={totalPages} sideLayout="full" onPageChange={setPage} />
  </div>
</div>
```

---

## 4. Check List Padding & Margin Sebelum Commit

- [x] Page dibungkus oleh `<PageContainer className="space-y-6 pb-12">`.
- [x] Tidak ada `px-4` atau `py-6` ganda pada prop root `PageContainer`.
- [x] Kartu menggunakan `rounded-[18px] border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-[#1B2433]`.
- [x] Tombol aksi toolbar Datatable TIDAK menggunakan `overflow-x-auto` (menggunakan `flex items-center gap-2.5 flex-nowrap shrink-0 py-1` agar posisinya tetap dan tidak dapat di-scroll).
- [x] Datatable viewport menggunakan `px-4 sm:px-6 md:px-8`.
- [x] Footer pagination menggunakan `px-4 py-3.5 sm:px-6 md:px-8`.
