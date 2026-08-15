Read docs/ai/README.md and INDEX.md first.

# TailGrids Button Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Button** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/button`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

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

