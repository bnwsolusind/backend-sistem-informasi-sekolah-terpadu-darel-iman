Read docs/ai/README.md and INDEX.md first.

# TailGrids Checkbox Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Checkbox** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/checkbox` & `@/components/tailgrids/core/label`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { Label } from "@/components/tailgrids/core/label";
import { useId } from "react";
```

### Supported Props:
- **`size`**: `"sm"` | `"md"` (default: `"sm"`)
- **`disabled`**: `boolean`
- **`checked`** / **`defaultChecked`**: `boolean`
- **`onChange`**: `(e: ChangeEvent<HTMLInputElement>) => void`

---

## 1. Checkbox Preview (Penggunaan Standar dengan Label)

```jsx
"use client";

import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { Label } from "@/components/tailgrids/core/label";
import { useId } from "react";

export default function CheckboxPreview() {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} size="md" />
      <Label htmlFor={id}>Checkbox</Label>
    </div>
  );
}
```

---

## 2. Checkbox Sizes & States (Ukuran & Status Checked/Disabled)

```jsx
"use client";

import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { Label } from "@/components/tailgrids/core/label";
import { useId } from "react";

export default function CheckboxSizesAndStatesPreview() {
  const id1 = useId();
  const id2 = useId();
  const id3 = useId();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox id={id1} size="sm" defaultChecked />
        <Label htmlFor={id1}>Checkbox Small (Checked)</Label>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox id={id2} size="md" defaultChecked />
        <Label htmlFor={id2}>Checkbox Medium (Checked)</Label>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox id={id3} size="md" disabled />
        <Label htmlFor={id3} className="opacity-50">Checkbox Disabled</Label>
      </div>
    </div>
  );
}
```
