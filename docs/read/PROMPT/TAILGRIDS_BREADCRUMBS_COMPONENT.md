# TailGrids Breadcrumbs Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Breadcrumbs** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/breadcrumbs`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT), mengikuti benchmark gold standard dari halaman **Dashboard Wali Kelas** (`http://localhost:5173/absensi/dashboard-wali-kelas`).

---

## Canonical Imports & Component Anatomy

```jsx
import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";
```

### Supported Props:
- **`items`**: Array of `{ href?: string; to?: string; label: string; icon?: React.ReactNode }`
- **`dividerType`**: `"chevron"` | `"slash"` | `"dot"` (default: `"chevron"`)
- **`homeTo`**: string | null (default: `"/dashboard"` - menampilkan item awal **Beranda** dengan ikon Home)
- **`className`**: string (optional utility classes)

---

## Gold Standard Breadcrumb Design (`http://localhost:5173/absensi/dashboard-wali-kelas`)

Gaya standar Breadcrumbs SIMSIT memiliki ciri khas:
1. **Ikon Beranda di Awal**: Secara otomatis menyertakan item `Beranda` dengan ikon `Home` (`Home className="size-3.5"`).
2. **Pemisah Chevron halus**: Menggunakan `ChevronRight` berwarna `text-slate-300 dark:text-slate-600` (`size-3.5`).
3. **Hyperlink Single-Page App**: Menggunakan `Link` dari `react-router-dom` dengan efek hover warna hijau khas SIMSIT (`hover:text-[#0E5C44] dark:hover:text-[#3FBF75]`).
4. **Highlight Item Aktif**: Item terakhir (halaman yang sedang dibuka) tebal tanpa hyperlink (`font-bold text-slate-800 dark:text-slate-200`).
5. **Responsif & Safe Truncate**: Mendukung teks panjang dengan pemangkasan otomatis (`truncate max-w-[200px] sm:max-w-xs`).

---

## 1. Penggunaan Utama pada Halaman Dashboard & Form

```jsx
import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";

export default function StandardPageHeader() {
  return (
    <div className="print:hidden">
      <Breadcrumbs
        items={[
          { href: "/absensi", label: "Absensi" },
          { label: "Dashboard Wali Kelas" }
        ]}
      />
    </div>
  );
}
```

---

## 2. Penggunaan pada Halaman Master Data & Tahfizh

```jsx
import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";

export default function TahfizhPageHeader() {
  return (
    <div className="print:hidden">
      <Breadcrumbs
        dividerType="chevron"
        items={[
          { href: "/dashboard/tahfizh", label: "Tahfizh & Murajaah" },
          { label: "Setoran Harian" }
        ]}
      />
    </div>
  );
}
```

---

## 3. Divider Variants (Chevron, Slash, & Dot)

```jsx
import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";

export default function BreadcrumbsDividersExample() {
  return (
    <div className="flex flex-col gap-4">
      {/* Chevron Divider (Gold Standard SIMSIT) */}
      <Breadcrumbs
        dividerType="chevron"
        items={[
          { href: "/dashboard/akademik", label: "Akademik" },
          { label: "Mata Pelajaran" }
        ]}
      />

      {/* Slash Divider */}
      <Breadcrumbs
        dividerType="slash"
        items={[
          { href: "/dashboard/master", label: "Master Data" },
          { label: "Unit Pendidikan" }
        ]}
      />

      {/* Dot Divider */}
      <Breadcrumbs
        dividerType="dot"
        items={[
          { href: "/dashboard/settings", label: "Pengaturan" },
          { label: "Hak Akses" }
        ]}
      />
    </div>
  );
}
```
