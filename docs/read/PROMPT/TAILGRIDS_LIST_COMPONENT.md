Read docs/ai/README.md and INDEX.md first.

# TailGrids List Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **List** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/list`) untuk menyajikan daftar item terstruktur, menu navigasi vertikal/horizontal, user avatar list, input list (checkbox & radio), serta icon list pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  AvatarStatus
} from "@/components/tailgrids/core/avatar";
import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { Label } from "@/components/tailgrids/core/label";
import { List } from "@/components/tailgrids/core/list";
import { RadioInput } from "@/components/tailgrids/core/radio-input";
import { CheckCircle1 } from "@tailgrids/icons";
```

### Supported Props & Attributes:
- **`direction`**: `"vertical"` | `"horizontal"` (default: `"vertical"`)
- **`hideDividers`**: `boolean` (default: `false`) — Menyembunyikan garis pemisah antar item `li`.
- **`data-active="true"`**: Attribute pada `li` untuk menandai item aktif/terpilih (mengubah warna latar menjadi `primary-50` dan teks menjadi `primary-500`).
- **`data-type="count"`**: Attribute pada `span` di dalam `li` untuk menampilkan badge jumlah/counter di sebelah kanan (`ml-auto`).

---

## 1. List Vertical Preview (Vertical List Standar)

```jsx
"use client";

import { List } from "@/components/tailgrids/core/list";

export default function ListVerticalPreview() {
  return (
    <List direction="vertical">
      <li>Dashboard</li>
      <li>Settings</li>
      <li>Profile</li>
      <li>Logout</li>
    </List>
  );
}
```

---

## 2. List With Active State Preview (List dengan State Aktif)

```jsx
"use client";

import { List } from "@/components/tailgrids/core/list";

export default function ListWithActiveStatePreview() {
  return (
    <List>
      <li>Dashboard</li>
      <li data-active="true">Settings</li>
      <li>Profile</li>
    </List>
  );
}
```

---

## 3. List Users Preview (Daftar Pengguna dengan Avatar & Status)

```jsx
"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  AvatarStatus
} from "@/components/tailgrids/core/avatar";
import { List } from "@/components/tailgrids/core/list";

const users = [
  {
    name: "Musharof Chowdhury",
    email: "chowdhury@pimjo.com",
    avatar: "/docs/images/avatar/avatar-1.webp",
    status: "online"
  },
  {
    name: "Johurul Haque",
    email: "haque@pimjo.com",
    avatar: "/docs/images/avatar/avatar-2.webp",
    status: "busy"
  },
  {
    name: "Niaj Morshed",
    email: "morshed@pimjo.com",
    avatar: "/docs/images/avatar/avatar-3.webp",
    status: "offline"
  },
  {
    name: "Ahmed Tusar",
    email: "tusar@pimjo.com",
    avatar: "/docs/images/avatar/avatar-4.webp",
    status: "online"
  }
] as const;

export default function ListUsersPreview() {
  return (
    <List className="max-w-70">
      {users.map((user, index) => (
        <li key={index}>
          <figure className="flex justify-start items-center gap-2 w-full">
            <Avatar size="md">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              <AvatarBadge status={user.status as AvatarStatus} />
            </Avatar>
            <figcaption>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </figcaption>
          </figure>
        </li>
      ))}
    </List>
  );
}
```

---

## 4. List With Inputs Preview (Daftar dengan Checkbox & Radio Input)

```jsx
"use client";

import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { Label } from "@/components/tailgrids/core/label";
import { List } from "@/components/tailgrids/core/list";
import { RadioInput } from "@/components/tailgrids/core/radio-input";

export default function ListWithInputsPreview() {
  const features = [
    "Complete documentation work.",
    "Add new template to TailAdmin.",
    "Try to make Meku.dev featureful",
    "Review Sera UI pr's",
    "Review TailAdmin pr's"
  ];

  return (
    <div className="flex w-full justify-center gap-6">
      {/* Checkbox List */}
      <List className="max-w-70">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Checkbox id={`list-${index}`} />

            <Label
              htmlFor={`list-${index}`}
              className="cursor-pointer select-none"
            >
              {feature}
            </Label>
          </li>
        ))}
      </List>

      {/* Radio List */}
      <List className="max-w-70">
        {features.map((feature, index) => (
          <li key={index}>
            <Label className="group flex w-full cursor-pointer items-center gap-3 select-none">
              <RadioInput name="example-list" value={`feature-${index}`} />
              <span>{feature}</span>
            </Label>
          </li>
        ))}
      </List>
    </div>
  );
}
```

---

## 5. List With Icons Preview (Daftar dengan Ikon Checklist)

```jsx
"use client";

import { List } from "@/components/tailgrids/core/list";
import { CheckCircle1 } from "@tailgrids/icons";

export default function ListWithIconsPreview() {
  const features = [
    "Complete documentation work.",
    "Add new template to TailAdmin.",
    "Try to make Meku.dev featureful",
    "Review Sera UI pr's",
    "Review TailAdmin pr's"
  ];

  return (
    <List className="max-w-70">
      {features.map((feature, index) => (
        <li key={index}>
          <CheckCircle1 className="size-5 text-primary-500!" />
          {feature}
        </li>
      ))}
    </List>
  );
}
```

---

## Catatan Penting

1. **Penggunaan Item `<li>`**: Seluruh elemen turunan langsung dalam `<List>` wajib menggunakan tag `<li>`.
2. **Item Aktif**: Tambahkan atribut `data-active="true"` pada elemen `<li>` untuk memberikan indikasi visual item yang sedang aktif.
3. **User List dengan Avatar**: Gabungkan `List` dengan `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge` untuk daftar pengguna, murid, atau staf.
4. **Input List (Checkbox & RadioInput)**: Bungkus `<RadioInput>` atau `<Checkbox>` dalam `<li>` bersama `<Label>` untuk form pilihan daftar interaktif.
5. **Counter / Badge Kanan**: Gunakan `<span data-type="count">` untuk membuat elemen rata kanan (`ml-auto`) di dalam baris `<li>`.
6. **Dividers**: Secara default (`hideDividers={false}`), komponen `List` memberikan garis pemisah antar item (`divide-y` untuk vertikal dan `divide-x` untuk horizontal). Set `hideDividers` ke `true` jika ingin tampilan bersih tanpa divider border.
