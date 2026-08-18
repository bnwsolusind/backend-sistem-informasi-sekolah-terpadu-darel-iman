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
- **Outer Container**: `overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1B2433]`
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

### 4. Filter Controls (Baris 2 Toolbar)
Select dropdown filter pada baris 2 toolbar mengikuti style rounded-xl dengan ikon `ChevronDown`:
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

### 5. Micro-Animations & Interaktivitas Datatable
- **Baris Tabel (`TableRow`)**:
  - `transition-all duration-200 hover:bg-slate-50/90 dark:hover:bg-slate-800/50 hover:shadow-xs`
  - Style saat terpilih (selected): `data-state="selected"` (`bg-emerald-50/30 dark:bg-emerald-950/20`)
- **Header Sort Button**:
  - `transition-all duration-150 active:scale-95 cursor-pointer hover:text-slate-900 dark:hover:text-white`
  - Ikon Sort: `<ArrowBothDirectionHorizontal2 className="h-3 w-3 shrink-0 transition-transform duration-200" />`
- **Interactive Data Hover Card (`HoverCard`)**:
  - Digunakan pada kolom utama (misal nama unit/siswa) untuk menampilkan tooltip rincian data ketika cursor di-hover.

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
