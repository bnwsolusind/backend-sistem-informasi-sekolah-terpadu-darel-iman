Read docs/ai/README.md and INDEX.md first.

# TailGrids Button Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Button** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/button`) serta standar **Soft Pastel Squircle Action Buttons & Floating Hover Tooltip** untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
```

### Supported Props:
- **`variant`**: `"primary"` | `"danger"` | `"success"` | `"ghost"` (default: `"primary"`)
- **`appearance`**: `"fill"` | `"outline"` (default: `"fill"`)
- **`size`**: `"xs"` | `"sm"` | `"md"` | `"lg"` (default: `"md"`)
- **`iconOnly`**: `boolean` (default: `false`)
- **`disabled`**: `boolean`
- **`pending`**: `boolean` (state loading/menunggu)

---

## 1. Button Appearances & Variants Preview (Fill & Outline)

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";

export default function ButtonAppearancesPreview() {
  return (
    <div className="space-y-10 lg:space-y-5">
      <div className="flex items-center justify-between gap-6 md:gap-11 flex-wrap">
        <p className="text-title-50">Fill:</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" appearance="fill">
            Primary
          </Button>
          <Button variant="danger" appearance="fill">
            Danger
          </Button>
          <Button variant="success" appearance="fill">
            Success
          </Button>
          <Button variant="ghost" appearance="fill">
            Ghost
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 md:gap-11 flex-wrap">
        <p className="text-title-50">Outline:</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" appearance="outline">
            Primary
          </Button>
          <Button variant="danger" appearance="outline">
            Danger
          </Button>
          <Button variant="success" appearance="outline">
            Success
          </Button>
          <Button variant="ghost" appearance="outline">
            Ghost
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 2. Button Sizes (Ukuran Tombol)

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";

export default function ButtonSizesPreview() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
```

---

## 3. Button States & Spinner Loading Preview

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import { Spinner } from "@/components/tailgrids/core/spinner";

export default function SpinnerButtonPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Disabled Button</Button>

      <Button disabled>
        <Spinner size="sm" />
        Loading...
      </Button>
    </div>
  );
}
```

---

## 4. Soft Pastel Squircle Action Button & Stationary Glowing Hover Tooltip System (Single-Row Benchmark)

Sistem tombol **Soft Pastel Squircle** menggunakan warna pastel lembut pada keadaan diam (*default state*), dan secara otomatis berubah menjadi warna solid yang menyala (*glowing vibrant color*), ikon berwarna putih murni, serta efek bayangan berpendar (*colored glow shadow*) saat di-hover **tanpa mengalami pergeseran tata letak (stationary fixed position)**.

> [!IMPORTANT]
> **Aturan Layout Stationary & Single-Row Toolbar Container**:
> 1. Tombol WAJIB berposisi tetap tanpa pergeseran posisi (hindari `hover:scale-105` atau `hover:scale-110` yang menyebabkan pergeseran layout). Gunakan `transition-colors duration-200`.
> 2. Seluruh tombol aksi dalam toolbar WAJIB dibungkus dalam container flex single-row: `flex items-center gap-2.5 flex-nowrap shrink-0 overflow-x-auto py-1` untuk menjamin seluruh tombol tetap berada dalam **1 baris horizontal**.

### Detailed Palette Color & Hover Effect Map:

1. **Import Data Button (Sky Blue)**:
   - Base: `bg-sky-100/90 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300`
   - Hover State: `hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-colors duration-200 hover:shadow-md hover:shadow-sky-500/30`
   - Icon: `<Upload1 className="size-5 transition-colors" />`

2. **Export Data Button (Amber / Orange)**:
   - Base: `bg-amber-100/90 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300`
   - Hover State: `hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-colors duration-200 hover:shadow-md hover:shadow-amber-500/30`
   - Icon: `<Download1 className="size-5 transition-colors" />`

3. **Tambah Data Button (Emerald Green)**:
   - Base: `bg-emerald-100/90 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300`
   - Hover State: `hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors duration-200 hover:shadow-md hover:shadow-emerald-600/30`
   - Icon: `<Plus className="size-5 transition-colors" />`

4. **Lihat Data Pop-up Button (Indigo)**:
   - Base: `bg-indigo-100/90 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300`
   - Hover State: `hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors duration-200 hover:shadow-md hover:shadow-indigo-600/30`
   - Icon: `<Eye className="size-5 transition-colors" />`

---

### Canonical Code Template (Stationary Fixed Layout Single Row):

```jsx
"use client";

import { Download1, Upload1, Plus, Eye } from "@tailgrids/icons";

export default function StationaryActionButtonsPreview() {
  return (
    <div className="flex items-center gap-2.5 flex-nowrap shrink-0 overflow-x-auto py-1">
      {/* Import Button (Soft Sky Blue -> Solid Sky Glowing Stationary Hover) */}
      <div className="group relative inline-flex">
        <button
          type="button"
          title="Import Data"
          aria-label="Import Data"
          className="flex size-10 items-center justify-center rounded-2xl bg-sky-100/90 text-sky-600 hover:bg-sky-500 hover:text-white dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-500 dark:hover:text-white transition-colors duration-200 hover:shadow-md hover:shadow-sky-500/30 cursor-pointer shadow-2xs"
          onClick={() => console.log('Import')}
        >
          <Upload1 className="size-5 transition-colors" />
        </button>
        <div className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
          <div className="absolute bottom-full left-1/2 -mb-1 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100" />
          Import Data
        </div>
      </div>

      {/* Export Button (Soft Amber -> Solid Amber Glowing Stationary Hover) */}
      <div className="group relative inline-flex">
        <button
          type="button"
          title="Export Data"
          aria-label="Export Data"
          className="flex size-10 items-center justify-center rounded-2xl bg-amber-100/90 text-amber-600 hover:bg-amber-500 hover:text-white dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-500 dark:hover:text-white transition-colors duration-200 hover:shadow-md hover:shadow-amber-500/30 cursor-pointer shadow-2xs"
          onClick={() => console.log('Export')}
        >
          <Download1 className="size-5 transition-colors" />
        </button>
        <div className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
          <div className="absolute bottom-full left-1/2 -mb-1 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100" />
          Export Data
        </div>
      </div>

      {/* Tambah Data Button (Soft Emerald -> Solid Emerald Glowing Stationary Hover) */}
      <div className="group relative inline-flex">
        <button
          type="button"
          title="Tambah Data"
          aria-label="Tambah Data"
          className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100/90 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white transition-colors duration-200 hover:shadow-md hover:shadow-emerald-600/30 cursor-pointer shadow-2xs"
          onClick={() => console.log('Tambah')}
        >
          <Plus className="size-5 transition-colors" />
        </button>
        <div className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
          <div className="absolute bottom-full left-1/2 -mb-1 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100" />
          Tambah Data
        </div>
      </div>

      {/* Lihat Pop-up Datatable Button (Soft Indigo -> Solid Indigo Glowing Stationary Hover) */}
      <div className="group relative inline-flex">
        <button
          type="button"
          title="Lihat Data Siswa (Pop-up)"
          aria-label="Lihat Data Siswa (Pop-up)"
          className="flex size-10 items-center justify-center rounded-2xl bg-indigo-100/90 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-colors duration-200 hover:shadow-md hover:shadow-indigo-600/30 cursor-pointer shadow-2xs"
          onClick={() => console.log('Pop-up')}
        >
          <Eye className="size-5 transition-colors" />
        </button>
        <div className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-xl dark:bg-slate-100 dark:text-slate-900">
          <div className="absolute bottom-full left-1/2 -mb-1 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-100" />
          Lihat Data Siswa (Pop-up)
        </div>
      </div>
    </div>
  );
}
```
