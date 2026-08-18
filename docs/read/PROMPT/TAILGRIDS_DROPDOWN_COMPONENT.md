Read docs/ai/README.md and INDEX.md first.

# TailGrids Dropdown Menu Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Dropdown Menu** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/dropdown`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

Gunakan **DropdownMenu** untuk menu aksi pada baris tabel (table row action menu), tombol opsi titik tiga (meatballs menu), dan menu kontekstual lainnya.

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/tailgrids/core/dropdown";
import { Copy4, MenuMeatballs1, Pencil1, Trash1 } from "@tailgrids/icons";
```

---

## Standard Code Preview (DropdownWithIconsPreview)

```jsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/tailgrids/core/dropdown";
import { Copy4, MenuMeatballs1, Pencil1, Trash1 } from "@tailgrids/icons";

export default function DropdownWithIconsPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-3 border text-title-50 rounded-full hover:bg-background-soft-50">
        <MenuMeatballs1 />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1.5 border">
        <DropdownMenuItem>
          <Pencil1 className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy4 className="size-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1.5 my-1.5" />
        <DropdownMenuItem>
          <Trash1 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Template Action Menu Tabel (Row Action Dropdown)

Gunakan template ini untuk tombol kolom **AKSI** pada setiap baris tabel data:

```jsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/tailgrids/core/dropdown";
import { Eye, MenuMeatballs1, Pencil1, Trash1 } from "@tailgrids/icons";

export function TableRowActionDropdown({ onView, onEdit, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu Aksi"
        className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <MenuMeatballs1 className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1.5 border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 min-w-36 shadow-lg rounded-xl">
        {onView && (
          <DropdownMenuItem onAction={onView} className="cursor-pointer font-medium text-xs">
            <Eye className="size-4 text-sky-500" />
            <span>Lihat Data</span>
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onAction={onEdit} className="cursor-pointer font-medium text-xs">
            <Pencil1 className="size-4 text-amber-500" />
            <span>Edit Data</span>
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            {(onView || onEdit) && <DropdownMenuSeparator className="-mx-1.5 my-1" />}
            <DropdownMenuItem onAction={onDelete} className="cursor-pointer font-medium text-xs text-rose-600">
              <Trash1 className="size-4 text-rose-500" />
              <span>Hapus Data</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Standard Code Preview (DropdownCustomPreview - User Dropdown)

Gunakan pola ini untuk menampilkan dropdown profil pengguna pada header / topbar aplikasi:

```jsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/tailgrids/core/dropdown";
import {
  ChevronDown,
  CreditCard,
  Exit,
  Gear1,
  UserCircle1
} from "@tailgrids/icons";

export default function DropdownCustomPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full border border-base-200 bg-background-50 px-4 py-2 text-sm font-medium text-title-50 shadow-sm transition-all hover:bg-background-soft-50 focus-visible:bg-background-soft-50">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-tr from-white-100 to-button-primary-background text-[10px] lowercase text-white-100">
          jd
        </div>
        John Doe
        <ChevronDown className="size-4 text-text-200 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 min-h-30 p-1.5">
        <DropdownMenuSection>
          <DropdownMenuHeader>Account</DropdownMenuHeader>
          <DropdownMenuItem className="cursor-pointer gap-2.5 py-2">
            <UserCircle1 className="size-5" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2.5 py-2">
            <Gear1 className="size-5" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2.5 py-2">
            <CreditCard className="size-5" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuSection>
        <DropdownMenuSeparator className="-mx-1.5 my-1" />
        <DropdownMenuItem className="cursor-pointer gap-2.5 py-2 text-alert-danger-button-text focus:text-alert-danger-title focus:bg-alert-danger-background">
          <Exit className="size-5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Catatan Penting

1. **Menu Item Action**: Gunakan prop `onAction={handler}` pada `DropdownMenuItem` untuk menangkap klik item menu (karena didukung oleh `react-aria-components`).
2. **Icons**: Gunakan `@tailgrids/icons` seperti `MenuMeatballs1`, `Pencil1`, `Trash1`, `Copy4`, `Eye`, `UserCircle1`, `Gear1`, `CreditCard`, `Exit`, `ChevronDown`.
3. **Pemisah Item**: Gunakan `<DropdownMenuSeparator className="-mx-1.5 my-1.5" />` untuk memberikan garis pemisah sebelum aksi destruktif (seperti `Log out` atau `Hapus`).
