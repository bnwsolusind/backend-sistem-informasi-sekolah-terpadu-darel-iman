Read docs/ai/README.md and INDEX.md first.

# TailGrids Spinner Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Spinner** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/spinner`) untuk indikator loading pada tombol, kartu, dan proses asynchronous di Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import { Spinner } from "@/components/tailgrids/core/spinner";
```

### Supported Props:
- **`size`**: `"xs"` | `"sm"` | `"md"` | `"lg"` | `"xl"` (default: `"md"`)
  - `xs`: `size-3.5`
  - `sm`: `size-4`
  - `md`: `size-5`
  - `lg`: `size-6`
  - `xl`: `size-8`

---

## 1. Spinner Sizes Preview (Ukuran Spinner)

```jsx
"use client";

import { Spinner } from "@/components/tailgrids/core/spinner";

export default function SpinnerSizesPreview() {
  return (
    <div className="flex items-center gap-4 p-4 text-primary">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  );
}
```

---

## 2. Button Loading State Preview (Spinner di dalam Tombol)

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { useState } from "react";

export default function ButtonLoadingPreview() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4">
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            <span>Memuat data...</span>
          </>
        ) : (
          <span>Simpan Perubahan</span>
        )}
      </Button>
    </div>
  );
}
```

---

## Catatan Penting

1. **Warna Indikator**: Komponen `<Spinner>` menggunakan kelas `text-current`, sehingga warnanya otomatis mengikuti warna teks elemen induknya.
2. **Penggunaan pada Tombol**: Gunakan `size="sm"` untuk tombol ukuran standar (`md` / `sm`) dan `size="xs"` untuk tombol mini (`xs`).
