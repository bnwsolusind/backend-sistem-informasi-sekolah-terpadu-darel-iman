Read docs/ai/README.md and INDEX.md first.

# TailGrids Table & Master Data Table Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan teknis dan prompt kanonis integrasi komponen **Table & AppDataTable** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/table`, `@/components/tailgrids/core/pagination`, `@/components/tailgrids/core/button`, `@/components/tailgrids/core/dropdown`) untuk seluruh halaman master data pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

> [!IMPORTANT]
> **Gold Standard Benchmark Page**: Implementasi kanonis utama yang dijadikan patokan style Datatable seluruh sistem adalah **Unit Pendidikan Page** (`web-dashboard/src/pages/EducationUnitsPage.jsx` / `http://localhost:5173/dashboard/students/unit-pendidikan`). Semua pembuatan dan refactoring datatable WAJIB mengikuti standar komponen, layout toolbar, warna squircle button, micro-animation, dan struktur pagination pada halaman tersebut.

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/tailgrids/core/dropdown";
import { Pagination } from "@/components/tailgrids/core/pagination";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from "@/components/tailgrids/core/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/tailgrids/core/hover-card";
import { ArrowBothDirectionHorizontal2, ChevronDown, Download1, MenuMeatballs1, Plus, RefreshCcw, Upload1 } from "@tailgrids/icons";
import AppDataTable from "@/components/app/AppDataTable";
import ActionDropdown from "@/components/app/ActionDropdown";
```

---

## Standard Layout & Rules Architecture

### 1. Card Container & Padding Rules
- **Page Container Wrapper**: `<PageContainer className="space-y-6 pb-12">` (Dokumentasi lengkap di [TAILGRIDS_PAGE_CONTAINER_LAYOUT.md](file:///Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/docs/read/PROMPT/TAILGRIDS_PAGE_CONTAINER_LAYOUT.md)).
- **Outer Card Container**: `overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1B2433]`
- **Table Viewport Margin/Padding**: `px-4 sm:px-6 md:px-8` (Menjamin isi tabel tidak langsung menempel pada border kartu).
- **`fullBleed` Setting**: `fullBleed={false}` pada `TableRoot`.

### 2. Toolbar Header Structure (Layout 3-Baris Terstruktur & Lapang)
Toolbar utama `AppDataTable` terdiri dari susunan baris terstruktur yang sangat lapang:

- **Baris 1 (Header Judul & Action Buttons Utama)**:
  - **Kiri**: `title` (Nama Master Data, misal `"Data Jabatan"`) & `description` (Keterangan singkat, misal `"Daftar jabatan sesuai pencarian, cakupan unit, dan filter yang dipilih."`).
  - **Kanan**: Tombol aksi ikonik squircle soft pastel dengan tooltip melayang (`Import` [Sky Blue], `Export` [Amber/Orange], `Tambah Data` [Emerald/Green]).
- **Baris 2 (Input Pencarian Memanjang Full Width)**:
  - Input pencarian `AppSearch` memanjang penuh (`w-full`) di atas baris filter sehingga pengguna dapat mengetik kata kunci dengan sangat nyaman.
- **Baris 3 (Filter Controls Flex Horizontal)**:
  - Seluruh dropdown filter (*Kategori/Satuan Kerja*, *Level*, *Unit Sekolah*, *Status*, *Cakupan Terhapus*, *Per Halaman: 5, 10, 15, 25, 50, 100*, dan tombol *Reset*) tersusun rapi secara horizontal dalam 1 baris penuh tanpa berhimpitan.

### 3. Action Buttons & Floating Tooltip Animations (Soft Pastel Squircle Buttons)
Tombol aksi di bagian kanan atas toolbar menggunakan container squircle pastel lembut (`rounded-2xl size-10 flex items-center justify-center`) dengan stroke icon berwarna terang dan micro-animation:
- `transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer`

**Warna Standar Aksi**:
- **Import (Sky Blue)**: `bg-sky-100/90 text-sky-500 hover:bg-sky-200/90 dark:bg-sky-950/50 dark:text-sky-400` dengan ikon `<Upload1 className="size-5" />`
- **Export (Amber/Orange)**: `bg-amber-100/90 text-amber-600 hover:bg-amber-200/90 dark:bg-amber-950/50 dark:text-amber-400` dengan ikon `<Download1 className="size-5" />`
- **Tambah Data (Emerald/Green)**: `bg-emerald-100/90 text-emerald-600 hover:bg-emerald-200/90 dark:bg-emerald-950/50 dark:text-emerald-400` dengan ikon `<Plus className="size-5" />`

**Pattern Tooltip Popup Melayang**:
```jsx
<div className="group relative inline-flex">
  <button
    type="button"
    title="Import Data"
    aria-label="Import Data"
    className="flex size-10 items-center justify-center rounded-2xl bg-sky-100/90 text-sky-500 hover:bg-sky-200/90 dark:bg-sky-950/50 dark:text-sky-400 dark:hover:bg-sky-900/70 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
    onClick={onImportClick}
  >
    <Upload1 className="size-5" />
  </button>
  <div className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
    <div className="absolute bottom-full left-1/2 -mb-1 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100" />
    Import Data
  </div>
</div>
```

### 4. Filter Controls & Per-Page Select (Baris 2 Toolbar)
Select dropdown filter pada baris 2 toolbar mengikuti style `rounded-xl` dengan ikon `ChevronDown` atau menggunakan `MasterFilterSelect`.

**Dropdown Filter Status / Kategori**:
```jsx
<div className="relative">
  <select
    value={selectedFilter}
    onChange={e => setSelectedFilter(e.target.value)}
    className="h-10 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 focus:border-[#0E5C44] focus:outline-none focus:ring-2 focus:ring-[#0E5C44]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
  >
    <option value="">Semua Status</option>
    <option value="aktif">Aktif</option>
    <option value="nonaktif">Nonaktif</option>
  </select>
  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
</div>
```

**Dropdown Sortir Jumlah Data per Halaman (`perPage`: 5, 10, 15, 25, 50, 100)**:
Seluruh datatable WAJIB menyediakan opsi pilihan jumlah baris per halaman (5, 10, 15, 25, 50, 100).
```jsx
{/* Menggunakan MasterFilterSelect */}
<MasterFilterSelect
  value={perPage}
  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }}
  aria-label="Tampilkan per halaman"
>
  <option value={5}>5 per Halaman</option>
  <option value={10}>10 per Halaman</option>
  <option value={15}>15 per Halaman</option>
  <option value={25}>25 per Halaman</option>
  <option value={50}>50 per Halaman</option>
  <option value={100}>100 per Halaman</option>
</MasterFilterSelect>

{/* Atau menggunakan Native Select dengan ChevronDown */}
<div className="relative">
  <select
    value={perPage}
    onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
    aria-label="Tampilkan per halaman"
    className="h-10 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 focus:border-[#0E5C44] focus:outline-none focus:ring-2 focus:ring-[#0E5C44]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
  >
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={15}>15</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
  </select>
  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
</div>
```

### 5. Micro-Animations & Interaktivitas Datatable
- **Header Tabel (`TableHeader` & `TableHead`)**:
  - Soft cool grey background bar: `bg-slate-100/90 dark:bg-slate-800/90 border-y border-slate-200/90 dark:border-slate-800` pada setiap elemen `<TableHead>`
  - Typography cell (`TableHead`): `text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200`
- **Baris Tabel (`TableRow`)**:
  - `transition-all duration-200 hover:bg-slate-50/90 dark:hover:bg-slate-800/50 hover:shadow-xs`
  - Style saat terpilih (selected): `data-state="selected"` (`bg-emerald-50/30 dark:bg-emerald-950/20`)
- **Header Sort Button (Klik Header untuk Sortir Ascending/Descending)**:
  - `transition-all duration-150 active:scale-95 cursor-pointer hover:text-slate-900 dark:hover:text-white`
  - Ikon Sort: `<ArrowBothDirectionHorizontal2 className={`h-3 w-3 shrink-0 transition-transform duration-200 ${sortKey === key ? 'text-emerald-600 dark:text-emerald-400 rotate-180' : 'text-slate-400'}`} />`
- **Interactive Data Hover Card (`HoverCard`)**:
  - Digunakan pada kolom identitas utama (misal nama siswa / NIS / nama unit) dengan membungkus cell menggunakan `<HoverCard>` dan `<HoverCardContent className="w-72 p-4 border ...">` untuk menampilkan popover rincian data secara otomatis ketika kursor diarahkan (hover) ke baris data tersebut (Lihat [TAILGRIDS_HOVERCARD_COMPONENT.md](file:///Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/docs/read/PROMPT/TAILGRIDS_HOVERCARD_COMPONENT.md)).

### 6. Mobile Card Fallback (`renderMobileCard`)
- Pada layar mobile (`< md`), tabel desktop tersembunyi secara otomatis dan digantikan oleh tampilan card berbasis `renderMobileCard`.

### 7. Pagination Footer Navigasi Halaman
- Diatur di bagian paling bawah tabel dengan pembungkus border-t dan padding seragam:
```jsx
<div className="w-full border-t border-slate-100 px-4 py-3.5 sm:px-6 md:px-8 dark:border-slate-800">
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    sideLayout="full"
    onPageChange={setPage}
  />
</div>
```

---

## Canonical Code Example (Full Pattern Canonical - Benchmark Unit Pendidikan)

Berikut adalah contoh lengkap penggunaan `AppDataTable` yang mengambil patokan style dari **`EducationUnitsPage.jsx`**:

```jsx
"use client";

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, GraduationCap, MapPin, Plus, RefreshCcw, UsersRound } from 'lucide-react'
import { Download1, Upload1 } from '@tailgrids/icons'
import AppDataTable from '@/components/app/AppDataTable'
import ActionDropdown from '@/components/app/ActionDropdown'
import { MasterStatusBadge } from '@/components/master-data'
import { Button } from '@/components/tailgrids/core/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/tailgrids/core/hover-card'

export default function MasterDataPageBenchmark() {
  const [search, setSearch] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

  // Demo Query / Service integration
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['master-data', page, perPage, search, selectedTypeFilter, selectedStatusFilter],
    queryFn: () => fetchMasterData({ page, perPage, search, selectedTypeFilter, selectedStatusFilter }),
  })

  const rawList = data?.data || []
  const paginationInfo = {
    total: data?.total ?? rawList.length,
    last_page: data?.last_page ?? 1,
    current_page: data?.current_page ?? page,
    per_page: data?.per_page ?? perPage,
  }

  const hasActiveFilters = !!(search || selectedTypeFilter || selectedStatusFilter)

  const resetFilters = () => {
    setSearch('')
    setSelectedTypeFilter('')
    setSelectedStatusFilter('')
    setPage(1)
  }

  // Column definitions
  const columns = [
    {
      key: 'name',
      label: 'Nama Master Data',
      render: (row) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white font-black text-xs">
            {row.code || 'MD'}
          </span>
          <span className="min-w-0 flex-1">
            <HoverCard>
              <HoverCardTrigger
                onClick={(e) => { e.preventDefault(); openDetail(row) }}
                className="inline-block max-w-full truncate text-[13px] font-extrabold text-slate-900 dark:text-white border-b border-dashed border-slate-400/60 hover:border-[#0E5C44] transition-colors cursor-pointer"
              >
                {row.name}
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-3.5 bg-white dark:bg-[#1B2433] rounded-xl border shadow-xl">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{row.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">Kode: {row.code}</p>
              </HoverCardContent>
            </HoverCard>
            <small className="block text-[10px] text-slate-400">{row.sub_text || '—'}</small>
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      className: 'hidden md:table-cell',
      render: (row) => (
        <span className="inline-flex rounded-lg border border-emerald-600 bg-emerald-800 px-2 py-1 text-[9px] font-bold text-white">
          {row.category || '—'}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      className: 'hidden sm:table-cell text-center',
      render: (row) => <MasterStatusBadge active={row.is_active} inactiveLabel="Nonaktif" />,
    },
  ]

  // Mobile card renderer fallback
  const renderMobileCard = ({ row, onView, onEdit, onDelete }) => (
    <div className="rounded-[18px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-extrabold text-slate-900 dark:text-white">{row.name}</p>
          <p className="text-[10px] font-semibold text-slate-400">{row.code}</p>
        </div>
        <MasterStatusBadge active={row.is_active} inactiveLabel="Nonaktif" />
      </div>
      <div className="mt-3 flex justify-end">
        <ActionDropdown onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  )

  return (
    <AppDataTable
      title="Data Master"
      description="Kelola data master secara terstruktur dan terpadu."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Import Button */}
          <div className="group relative inline-flex">
            <button
              type="button"
              title="Import Data"
              className="flex size-10 items-center justify-center rounded-2xl bg-sky-100/90 text-sky-500 hover:bg-sky-200/90 dark:bg-sky-950/50 dark:text-sky-400 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => handleImport()}
            >
              <Upload1 className="size-5" />
            </button>
            <div className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
              <div className="absolute bottom-full left-1/2 -mb-1 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100" />
              Import Data
            </div>
          </div>

          {/* Export Button */}
          <div className="group relative inline-flex">
            <button
              type="button"
              title="Export Data"
              className="flex size-10 items-center justify-center rounded-2xl bg-amber-100/90 text-amber-600 hover:bg-amber-200/90 dark:bg-amber-950/50 dark:text-amber-400 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => handleExport()}
            >
              <Download1 className="size-5" />
            </button>
            <div className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
              <div className="absolute bottom-full left-1/2 -mb-1 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100" />
              Export Data
            </div>
          </div>

          {/* Tambah Button */}
          <div className="group relative inline-flex">
            <button
              type="button"
              title="Tambah Data Baru"
              className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100/90 text-emerald-600 hover:bg-emerald-200/90 dark:bg-emerald-950/50 dark:text-emerald-400 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => handleCreate()}
            >
              <Plus className="size-5" />
            </button>
            <div className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
              <div className="absolute bottom-full left-1/2 -mb-1 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100" />
              Tambah Data
            </div>
          </div>
        </div>
      }
      columns={columns}
      data={rawList}
      keyField="id"
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      serverControlled
      search={search}
      onSearchChange={val => { setSearch(val); setPage(1) }}
      searchPlaceholder="Cari data master..."
      filters={
        <div className="flex flex-wrap items-center gap-2">
          {/* Kategori filter */}
          <div className="relative">
            <select
              value={selectedTypeFilter}
              onChange={e => { setSelectedTypeFilter(e.target.value); setPage(1) }}
              className="h-10 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 focus:border-[#0E5C44] focus:outline-none focus:ring-2 focus:ring-[#0E5C44]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">Semua Kategori</option>
              <option value="kat1">Kategori 1</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={selectedStatusFilter}
              onChange={e => { setSelectedStatusFilter(e.target.value); setPage(1) }}
              className="h-10 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 focus:border-[#0E5C44] focus:outline-none focus:ring-2 focus:ring-[#0E5C44]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Per Page filter */}
          <div className="relative">
            <select
              value={perPage}
              onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
              className="h-10 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 focus:border-[#0E5C44] focus:outline-none focus:ring-2 focus:ring-[#0E5C44]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <Button variant="ghost" appearance="outline" size="xs" onClick={resetFilters}>
              <RefreshCcw />
              <span>Reset</span>
            </Button>
          )}
        </div>
      }
      onView={row => handleView(row)}
      onEdit={row => handleEdit(row)}
      onDelete={row => handleDelete(row)}
      renderMobileCard={renderMobileCard}
      showPagination
      page={paginationInfo.current_page}
      totalPages={paginationInfo.last_page}
      totalItems={paginationInfo.total}
      itemsPerPage={paginationInfo.per_page}
      onPageChange={p => setPage(p)}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={resetFilters}
    />
  )
}
```

---

## 8. Multi-Format Import/Export (.csv, .xls, .xlsx), Template Download & Print Standard

Seluruh modul master data dan laporan pada sistem WAJIB mendukung fitur **Import, Export (.csv, .xls, .xlsx), Unduh Template, dan Cetak Datatable** dengan ketentuan berikut:

### 1. Soft Pastel Squircle Toolbar Action Buttons (Row 1 Header)
Tombol aksi toolbar terdiri dari susunan squircle pastel dengan tooltip melayang:
1. **Impor Data (`Upload1` - Sky Blue)**: `bg-[#E0F2FE] text-[#0284C7] hover:bg-[#BAE6FD]`
2. **Ekspor Data (`Download1` - Amber/Orange)**: `bg-[#FEF3C7] text-[#D97706] hover:bg-[#FDE68A]` (Mendukung format `.xlsx`, `.xls`, `.csv`)
3. **Unduh Template (`FileSpreadsheet` - Violet/Purple)**: `bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE]` (Mendukung format `.xlsx`, `.csv`)
4. **Segarkan Data (`RefreshCcw` - Sky/Cyan)**: `bg-[#E0F2FE] text-[#0284C7] hover:bg-[#BAE6FD]`
5. **Cetak Datatable (`Printer` - Indigo)**: `bg-[#E0E7FF] text-[#4338CA] hover:bg-[#C7D2FE]`
6. **Tambah Data Baru (`Plus` - Emerald/Green)**: `bg-[#D1FAE5] text-[#059669] hover:bg-[#A7F3D0]`

### 2. Standard Pure-JS Exporter Helper (.csv, .xls, .xlsx)
```javascript
// Exporter CSV dengan UTF-8 BOM agar rapi di Microsoft Excel
export function downloadCsvFile(filename, headers, rows) {
  const escape = (val) => `"${String(val ?? '').replaceAll('"', '""')}"`
  const headerRow = headers.map(escape).join(',')
  const dataRows = rows.map((row) => row.map(escape).join(','))
  const content = `\uFEFF${[headerRow, ...dataRows].join('\n')}`
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Exporter Excel (.xlsx / .xls) menggunakan SpreadsheetML XML murni
export function downloadXmlSpreadsheet(filename, headers, rows) {
  const escapeXml = (str) =>
    String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<?mso-application progid="Excel.Sheet"?>\n`
  xml += `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n`
  xml += ` xmlns:o="urn:schemas-microsoft-com:office:office"\n`
  xml += ` xmlns:x="urn:schemas-microsoft-com:office:excel"\n`
  xml += ` xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n`
  xml += ` <Styles>\n`
  xml += `  <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0E5C44" ss:Pattern="Solid"/></Style>\n`
  xml += ` </Styles>\n`
  xml += ` <Worksheet ss:Name="Data">\n`
  xml += `  <Table>\n`
  xml += `   <Row>\n`
  headers.forEach((h) => {
    xml += `    <Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>\n`
  })
  xml += `   </Row>\n`
  rows.forEach((row) => {
    xml += `   <Row>\n`
    row.forEach((cell) => {
      xml += `    <Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>\n`
    })
    xml += `   </Row>\n`
  })
  xml += `  </Table>\n`
  xml += ` </Worksheet>\n`
  xml += `</Workbook>`

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
```

### 3. TailGrids Print & PDF Modal (`PrintOptionModal`) & In-Place Print Standard
Saat tombol **Cetak Data** (`Printer` - Indigo) diklik, seluruh modul WAJIB menampilkan modal konfirmasi berbasis **TailGrids UI Library** (`PrintOptionModal` dari `@/components/master-data`) dengan 2 opsi utama:
1. **🖨️ Cetak Langsung (Print)**: Menjalankan `printCleanTable()` secara in-place via hidden iframe (`#simsit-print-iframe`) **TANPA membuka tab/halaman baru (`window.open` DILARANG)**.
2. **📄 Unduh Berkas PDF (.pdf)**: Menjalankan `downloadPdfTable()` atau service backend untuk mengunduh laporan murni dalam format berkas `.pdf`.

```javascript
// @/utils/printHelper.js - Standard In-Place Print & PDF Downloader
export function printCleanTable({ title, subtitle = '', headers = [], rows = [] }) {
  let iframe = document.getElementById('simsit-print-iframe')
  if (iframe) document.body.removeChild(iframe)

  iframe = document.createElement('iframe')
  iframe.id = 'simsit-print-iframe'
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0px'
  iframe.style.height = '0px'
  iframe.style.border = 'none'
  iframe.style.zIndex = '-9999'
  document.body.appendChild(iframe)

  const headerHtml = headers.map((h) => `<th>${h}</th>`).join('')
  const rowsHtml = rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? '-'}</td>`).join('')}</tr>`).join('')
  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const doc = iframe.contentWindow.document
  doc.open()
  doc.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page { size: A4 landscape; margin: 12mm 15mm; }
        body { font-family: 'Inter', system-ui, sans-serif; font-size: 9.5pt; color: #0f172a; margin: 0; padding: 12px; }
        .print-header { border-bottom: 2.5px solid #0e5c44; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
        .print-brand { font-size: 8pt; font-weight: 800; color: #0e5c44; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
        .print-title { font-size: 16pt; font-weight: 800; color: #0e5c44; margin: 0; line-height: 1.2; }
        .print-subtitle { font-size: 9pt; color: #64748b; margin: 4px 0 0 0; font-weight: 500; }
        .print-meta { font-size: 8.5pt; color: #475569; font-weight: 600; text-align: right; line-height: 1.4; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { background-color: #f1f5f9; color: #0f172a; font-size: 8.5pt; font-weight: 700; text-transform: uppercase; padding: 8px 10px; border: 1px solid #cbd5e1; text-align: left; }
        td { padding: 7px 10px; font-size: 9pt; border: 1px solid #e2e8f0; color: #334155; vertical-align: middle; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .print-footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 8pt; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="print-header">
        <div>
          <div class="print-brand">Sistem Informasi Sekolah Terpadu (SIMSIT)</div>
          <h1 class="print-title">${title}</h1>
          ${subtitle ? `<p class="print-subtitle">${subtitle}</p>` : ''}
        </div>
        <div class="print-meta">
          <div>Tanggal Cetak: ${currentDate}</div>
          <div>Total Record: ${rows.length} Data</div>
        </div>
      </div>
      <table>
        <thead><tr>${headerHtml}</tr></thead>
        <tbody>${rowsHtml || '<tr><td colspan="' + headers.length + '" style="text-align:center;">Tidak ada data.</td></tr>'}</tbody>
      </table>
      <div class="print-footer">
        <span>Dokumen Laporan Resmi — Akademik SIMSIT</span>
        <span>Laporan Cetak Murni</span>
      </div>
    </body>
    </html>
  `)
  doc.close()

  setTimeout(() => {
    iframe.contentWindow.focus()
    iframe.contentWindow.print()
  }, 250)
}

export function downloadPdfTable({ title, subtitle = '', headers = [], rows = [], filename }) {
  const safeFilename = filename || `Laporan_${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
  printCleanTable({
    title,
    subtitle: subtitle ? `${subtitle} (Berkas PDF)` : 'Berkas PDF Laporan Resmi',
    headers,
    rows,
  })
}
```

### 4. TailGrids Print Option Modal Integration Standard
```jsx
import { PrintOptionModal } from '@/components/master-data'
import { printCleanTable, downloadPdfTable } from '@/utils/printHelper'

const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

// Di Toolbar Button:
<SquircleActionButton variant="view" icon={Printer} label="Cetak Data" onClick={() => setIsPrintModalOpen(true)} />

// Di dalam render JSX:
<PrintOptionModal
  isOpen={isPrintModalOpen}
  onClose={() => setIsPrintModalOpen(false)}
  title="[Nama Modul]"
  onPrint={() => {
    printCleanTable({
      title: 'Laporan [Nama Modul]',
      subtitle: 'Daftar Data Sekolah Islam Terpadu',
      headers: ['NO', 'KODE', 'NAMA', 'STATUS'],
      rows: listData.map((item, i) => [i + 1, item.code, item.name, item.status ? 'Aktif' : 'Nonaktif']),
    })
  }}
  onDownload={() => {
    downloadPdfTable({
      title: 'Laporan [Nama Modul]',
      subtitle: 'Daftar Data Sekolah Islam Terpadu',
      headers: ['NO', 'KODE', 'NAMA', 'STATUS'],
      rows: listData.map((item, i) => [i + 1, item.code, item.name, item.status ? 'Aktif' : 'Nonaktif']),
      filename: 'laporan_modul.pdf',
    })
  }}
/>
```

---

### 4. Datatable Row Click Detail Modal & Action Buttons Standard

Saat pengguna mengeklik baris data / nama item pada Datatable (atau memilih *"Lihat Detail"* dari `ActionDropdown`), Datatable menyediakan opsi pemanggilan modal rincian berbasis **TailGrids UI Library** (`Dialog` & `Backdrop` dari `@/components/tailgrids/core/dialog` dan `@/components/tailgrids/core/overlay`).

**Aturan Action Buttons di dalam Modal**:
- Di dalam `DialogFooter`, tampilkan kembali tombol-tombol aksi utama dari kolom aksi (misal **Export Excel** [Soft Amber Squircle Button], **Cetak Laporan** [Soft Indigo Squircle Button], dan **Tutup** [Ghost Button]) dengan style tombol kanonis dari `TAILGRIDS_BUTTON_COMPONENT.md`.

```jsx
// State Modal Detail:
const [selectedItemModal, setSelectedItemModal] = useState(null)

// Pada cell identitas / nama:
<TableCell className="cursor-pointer" onClick={() => setSelectedItemModal(row)}>
  <PersonIdentityCell name={row.name} subtitle={row.code} />
</TableCell>

// Pada ActionDropdown extraItems:
extraItems={[
  {
    label: 'Lihat Detail',
    icon: <Eye className="h-4 w-4 text-sky-600" />,
    onClick: () => setSelectedItemModal(row),
  },
  {
    label: 'Export Data',
    icon: <FileSpreadsheet className="h-4 w-4 text-emerald-600" />,
    onClick: () => handleExportCsv(row),
  },
]}

// Render Dialog Detail Modal:
{selectedItemModal && (
  <Backdrop isOpen={Boolean(selectedItemModal)} onOpenChange={(open) => !open && setSelectedItemModal(null)}>
    <Dialog className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1B2433]">
      <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-emerald-600" />
            <span>Detail Data</span>
          </DialogTitle>
          <MasterStatusBadge status={selectedItemModal.is_active ? 'aktif' : 'nonaktif'} />
        </div>
        <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Informasi profil lengkap dan rincian data terdaftar.
        </DialogDescription>
      </DialogHeader>

      <DialogBody className="space-y-4 py-4 text-xs">
        {/* Rincian data grid */}
      </DialogBody>

      <DialogFooter className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {/* Action Column Buttons inside Modal using TailGrids & Soft Squircle Style */}
          <Button
            size="sm"
            variant="ghost"
            className="bg-amber-100/90 text-amber-600 hover:bg-amber-500 hover:text-white dark:bg-amber-950/60 dark:text-amber-300 font-semibold"
            onClick={() => handleExportCsv(selectedItemModal)}
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Export Excel
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="bg-indigo-100/90 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
            onClick={() => { setSelectedItemModal(null); setIsPrintModalOpen(true); }}
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Cetak Laporan
          </Button>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setSelectedItemModal(null)}>
          Tutup
        </Button>
      </DialogFooter>
    </Dialog>
  </Backdrop>
)}
```


```
