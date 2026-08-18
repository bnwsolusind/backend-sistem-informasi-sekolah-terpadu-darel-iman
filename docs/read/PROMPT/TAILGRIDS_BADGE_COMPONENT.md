Read docs/ai/README.md and INDEX.md first.

# TailGrids Badge Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Badge** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/badge`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Check, CheckCircle1, InfoCircle, Xmark2x } from "@tailgrids/icons";
```

### Supported Props:
- **`color`**: `"primary"` | `"gray"` | `"error"` | `"warning"` | `"success"` | `"cyan"` | `"sky"` | `"blue"` | `"violet"` | `"purple"` | `"pink"` | `"rose"` | `"orange"` (default: `"primary"`)
- **`size`**: `"sm"` | `"md"` | `"lg"` (default: `"sm"`)
- **`prefixIcon`**: ReactNode (Ikon di sebelah kiri teks)
- **`suffixIcon`**: ReactNode (Ikon di sebelah kanan teks)

---

## 1. Badge Preview (Status Utama)

```jsx
"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Check, CheckCircle1, InfoCircle } from "@tailgrids/icons";

export default function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge prefixIcon={<CheckCircle1 />}>Verified</Badge>
      <Badge color="success" prefixIcon={<Check />}>
        Active
      </Badge>
      <Badge color="warning" prefixIcon={<InfoCircle />}>
        Pending
      </Badge>
    </div>
  );
}
```

---

## 2. Badge Color Variants

```jsx
"use client";

import { Badge } from "@/components/tailgrids/core/badge";

export default function BadgeColors() {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge color="primary">Primary</Badge>
      <Badge color="gray">Gray</Badge>
      <Badge color="error">Error</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="cyan">Cyan</Badge>
      <Badge color="sky">Sky</Badge>
      <Badge color="blue">Blue</Badge>
      <Badge color="violet">Violet</Badge>
      <Badge color="purple">Purple</Badge>
      <Badge color="pink">Pink</Badge>
      <Badge color="rose">Rose</Badge>
      <Badge color="orange">Orange</Badge>
    </div>
  );
}
```

---

## 3. Badge with Icons (Prefix & Suffix Icons)

```jsx
"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { Check, CheckCircle1, InfoCircle, Xmark2x } from "@tailgrids/icons";

export default function BadgeIcons() {
  return (
    <div className="flex items-center gap-4">
      <Badge prefixIcon={<Check />}>Verified</Badge>
      <Badge suffixIcon={<Xmark2x />}>Removable</Badge>
      <Badge color="success" prefixIcon={<CheckCircle1 />}>
        Active
      </Badge>
      <Badge color="warning" prefixIcon={<InfoCircle />}>
        Pending
      </Badge>
    </div>
  );
}
```

---

## 4. Badge Sizes (Ukuran Badge)

```jsx
"use client";

import { Badge } from "@/components/tailgrids/core/badge";

export default function BadgeSizes() {
  return (
    <div className="flex items-center gap-4">
      <Badge size="sm" color="primary">Small</Badge>
      <Badge size="md" color="primary">Medium</Badge>
      <Badge size="lg" color="primary">Large</Badge>
    </div>
  );
}
```
