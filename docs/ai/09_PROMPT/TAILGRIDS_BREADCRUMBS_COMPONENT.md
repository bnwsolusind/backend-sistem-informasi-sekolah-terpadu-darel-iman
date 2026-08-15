Read docs/ai/README.md and INDEX.md first.

# TailGrids Breadcrumbs Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Breadcrumbs** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/breadcrumbs`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";
import { Home, ThreeDCube1 } from "@tailgrids/icons";
```

### Supported Props:
- **`items`**: Array of `{ href: string; label: string; icon?: React.ReactNode }`
- **`dividerType`**: `"slash"` | `"chevron"` | `"dot"` (default: `"slash"`)
- **`activeHref`**: string (optional URL penanda item aktif)

---

## 1. Breadcrumbs with Icon Preview (Penggunaan Utama)

```jsx
"use client";

import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";
import { Home, ThreeDCube1 } from "@tailgrids/icons";

export default function BreadcrumbsWithIconPreview() {
  return (
    <Breadcrumbs
      items={[
        { href: "#", label: "Home", icon: <Home /> },
        { href: "#", label: "Products", icon: <ThreeDCube1 /> },
        { href: "#", label: "Laptop" }
      ]}
    />
  );
}
```

---

## 2. Breadcrumbs Divider Variants (Slash, Chevron, & Dot)

```jsx
"use client";

import { Breadcrumbs } from "@/components/tailgrids/core/breadcrumbs";
import { Home, ThreeDCube1 } from "@tailgrids/icons";

export default function BreadcrumbsDividersPreview() {
  return (
    <div className="flex flex-col gap-4">
      {/* Slash Divider (Bawaan / Default) */}
      <Breadcrumbs
        dividerType="slash"
        items={[
          { href: "/dashboard", label: "Home", icon: <Home /> },
          { href: "/dashboard/master", label: "Master Data" },
          { href: "/dashboard/master/unit-pendidikan", label: "Unit Pendidikan" }
        ]}
      />

      {/* Chevron Divider */}
      <Breadcrumbs
        dividerType="chevron"
        items={[
          { href: "/dashboard", label: "Home", icon: <Home /> },
          { href: "/dashboard/akademik", label: "Akademik", icon: <ThreeDCube1 /> },
          { href: "/dashboard/akademik/mapel", label: "Mata Pelajaran" }
        ]}
      />

      {/* Dot Divider */}
      <Breadcrumbs
        dividerType="dot"
        items={[
          { href: "/dashboard", label: "Home", icon: <Home /> },
          { href: "/dashboard/settings", label: "Pengaturan" },
          { href: "/dashboard/settings/hak-akses", label: "Hak Akses" }
        ]}
      />
    </div>
  );
}
```
