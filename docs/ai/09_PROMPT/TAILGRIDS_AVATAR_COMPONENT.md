Read docs/ai/README.md and INDEX.md first.

# TailGrids Avatar Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Avatar** (termasuk Avatar Group, Count, Status Indicator, dan Sizes untuk Profil User) berbasis **TailGrids UI Library** (`@/components/tailgrids/core/avatar`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from "@/components/tailgrids/core/avatar";
```

### Supported Props & Sizes:
- **`size`**: `"xs"` | `"sm"` | `"md"` | `"lg"` | `"xl"` | `"xxl"` (default: `"md"`)
- **`status`** (pada `AvatarBadge`): `"online"` (hijau) | `"offline"` (merah) | `"busy"` (kuning)

---

## 1. Avatar Group with Count (Preview)

```jsx
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from "@/components/tailgrids/core/avatar";
import { teamMembersGroup } from "./data";

export default function AvatarGroupWithCountPreview() {
  return (
    <AvatarGroup aria-label="Team members">
      {teamMembersGroup.map((member, index) => (
        <Avatar key={index} size="md">
          <AvatarImage src={member.src} alt={member.alt} />
          <AvatarFallback>
            {member.alt
              .split(" ")
              .map(name => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>5+</AvatarGroupCount>
    </AvatarGroup>
  );
}
```

---

## 2. Avatar Status Indicator (Preview)

```jsx
"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from "@/components/tailgrids/core/avatar";
import { teamMembersWithStatus } from "./data";

export default function AvatarStatusIndicatorPreview() {
  return (
    <div className="flex items-center justify-center gap-10 w-full p-4">
      {teamMembersWithStatus.map(member => (
        <Avatar key={member.id} size="lg">
          <AvatarImage src={member.src} alt={member.alt} />
          <AvatarFallback>{member.fallback}</AvatarFallback>
          {member.status !== "none" && <AvatarBadge status={member.status} />}
        </Avatar>
      ))}
    </div>
  );
}
```

---

## 3. Avatar Sizes untuk Tampilan Profil User (Preview)

```jsx
"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from "@/components/tailgrids/core/avatar";

export default function AvatarSizesProfilePreview() {
  return (
    <div className="flex items-center justify-center gap-6 w-full p-4">
      {/* Profil Kecil (Tabel / Navbar) */}
      <Avatar size="sm">
        <AvatarImage src="/images/avatar/user-1.jpg" alt="Ahmad Syarif" />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>

      {/* Profil Sedang (Card / List) */}
      <Avatar size="md">
        <AvatarImage src="/images/avatar/user-2.jpg" alt="Budi Santoso" />
        <AvatarFallback>BS</AvatarFallback>
        <AvatarBadge status="online" />
      </Avatar>

      {/* Profil Besar (Sidebar Profile / Header) */}
      <Avatar size="lg">
        <AvatarImage src="/images/avatar/user-3.jpg" alt="Citra Dewi" />
        <AvatarFallback>CD</AvatarFallback>
        <AvatarBadge status="busy" />
      </Avatar>

      {/* Profil Extra Large (Halaman Detail Profil User) */}
      <Avatar size="xl">
        <AvatarImage src="/images/avatar/user-4.jpg" alt="Doni Pratama" />
        <AvatarFallback>DP</AvatarFallback>
      </Avatar>

      {/* Profil XXL (Halaman Pengaturan / Master Profile Header) */}
      <Avatar size="xxl">
        <AvatarImage src="/images/avatar/user-5.jpg" alt="Eka Putri" />
        <AvatarFallback>EP</AvatarFallback>
        <AvatarBadge status="online" ping />
      </Avatar>
    </div>
  );
}
```
