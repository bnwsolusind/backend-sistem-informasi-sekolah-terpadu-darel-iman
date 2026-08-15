Read docs/ai/README.md and INDEX.md first.

# TailGrids Scroll Area Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Scroll Area** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/scroll-area`) untuk membuat kontainer data berbilah gulung kustom (seperti daftar pilihan dropdown, list data berukuran panjang, panel log, atau menu berulang) pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar
} from "@/components/tailgrids/core/scroll-area";
```

### Component Anatomy:
- **`<ScrollArea>`**: Kontainer utama pembungkus area scroll dengan posisi relatif.
- **`<ScrollAreaViewport>`**: Area viewport utama tempat elemen berulang ditaruh dengan kelimpahan konten (overflow).
- **`<ScrollBar>`**: Bilah penggulung (scrollbar) kustom dengan orientasi `"vertical"` atau `"horizontal"`.

---

## 1. Scroll Area Preview (List Data & Dropdown Items)

Gunakan `ScrollArea` jika elemen list atau field bertindak sebagai dropdown pilihan berukuran panjang:

```jsx
"use client";

import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollBar
} from "@/components/tailgrids/core/scroll-area";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export function ScrollAreaPreview() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border border-stroke-dark dark:border-dark-3 bg-background-50 dark:bg-dark-2">
      <ScrollAreaViewport className="p-4">
        <div className="mb-4 text-sm font-medium text-title-50">Tags</div>
        {tags.map(tag => (
          <div
            key={tag}
            className="text-sm py-2 border-b border-stroke-dark dark:border-dark-3 last:border-0 text-text-50"
          >
            {tag}
          </div>
        ))}
      </ScrollAreaViewport>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
```

---

## Catatan Penting

1. **Custom Scrollbar Styling**: `ScrollBar` secara otomatis menyesuaikan warna tema dark/light tanpa menggantikan scrollbar bawaan browser secara invasif.
2. **Viewport Overflow**: Selalu tentukan batasan tinggi (`h-72`, `max-h-60`, dsb.) pada `<ScrollArea>` agar `<ScrollAreaViewport>` dapat menggulung data dengan rapi.
