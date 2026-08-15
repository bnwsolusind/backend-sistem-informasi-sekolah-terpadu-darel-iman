Read docs/ai/README.md and INDEX.md first.

# TailGrids Pagination Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Pagination** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/pagination`) untuk membuat navigasi halaman data berukuran besar (datatable, list siswa, tagihan, dsb) pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { Pagination } from "@/components/tailgrids/core/pagination";
import { useState } from "react";
```

### Supported Props:
- **`currentPage`**: `number` (halaman yang sedang aktif, 1-indexed)
- **`totalPages`**: `number` (jumlah total halaman)
- **`onPageChange`**: `(page: number) => void` (callback saat pengguna berpindah halaman)
- **`variant`**: `"default"` | `"compact"` (default: `"default"`) — Tampilan tombol berjarak atau rapat menyatu border.
- **`sideLayout`**: `"full"` | `"label"` | `"icon"` (default: `"full"`) — Mode teks/ikon tombol Previous & Next.

---

## 1. Standard Pagination Preview (Variant Default, SideLayout Full)

```jsx
"use client";

import { Pagination } from "@/components/tailgrids/core/pagination";
import { useState } from "react";

export default function PaginationDefaultPreview() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="w-full max-w-lg p-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        variant="default"
        sideLayout="full"
      />
    </div>
  );
}
```

---

## 2. Compact Pagination Preview (Variant Compact)

Gunakan variasi compact untuk tabel dengan ruang terbatas (seperti footer card atau widget mini):

```jsx
"use client";

import { Pagination } from "@/components/tailgrids/core/pagination";
import { useState } from "react";

export default function PaginationCompactPreview() {
  const [currentPage, setCurrentPage] = useState(2);
  const totalPages = 8;

  return (
    <div className="w-full max-w-md p-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        variant="compact"
        sideLayout="icon"
      />
    </div>
  );
}
```

---

## Catatan Penting

1. **Integrated Ellipsis & Mobile View**: Komponent `Pagination` secara otomatis menyembunyikan nomor halaman berlebih dan menggantinya dengan `...`, serta beralih ke format ringkas `Page X of Y` pada layar seluler.
2. **State Sync**: Selalu hubungkan `currentPage` dan `onPageChange` dengan state React (`useState`) atau URL search params (misal `?page=1`).
