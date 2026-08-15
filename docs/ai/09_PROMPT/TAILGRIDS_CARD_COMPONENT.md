Read docs/ai/README.md and INDEX.md first.

# TailGrids Card Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Card** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/card`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/tailgrids/core/card";
import { Phone } from "@tailgrids/icons";
```

### Component Anatomy:
- **`<Card>`**: Wrapper utama kartu (`flex flex-col gap-3 rounded-2xl`).
- **`<CardHeader>`**: Header kartu untuk penempatan judul, ikon, dan deskripsi.
- **`<CardTitle>`**: Teks judul kartu (`text-xl md:text-2xl font-semibold`).
- **`<CardDescription>`**: Deskripsi singkat di bawah judul (`text-base text-text-100`).
- **`<CardAction>`**: Area tombol/opsi aksi tambahan di pojok kanan atas header (`absolute top-5 right-5`).
- **`<CardContent>`**: Body konten utama kartu (`px-5 text-text-100`).
- **`<CardFooter>`**: Bagian bawah kartu untuk tombol aksi atau informasi footer (`px-5 pb-5`).

---

## 1. Card Responsiveness Preview (Preview Card Responsif)

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/tailgrids/core/card";
import { Phone } from "@tailgrids/icons";

export default function CardResponsivenessPreview() {
  return (
    <Card className="w-full max-w-full md:max-w-md bg-background-50 gap-y-9">
      <CardHeader className="px-7 pt-8 text-center">
        <span className="size-16 mx-auto flex items-center justify-center rounded-full bg-primary-50">
          <Phone className="text-xl text-primary-500" />
        </span>
        <CardTitle className="mt-7">Fully Responsive</CardTitle>
        <CardDescription className="mt-3">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the{" "}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-7 pt-0">
        <Button className="w-full">Visit Now</Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 2. Card Standard Preview (Dengan Content & Action)

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/tailgrids/core/card";

export default function CardStandardPreview() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Judul Card</CardTitle>
        <CardDescription>Deskripsi ringkas mengenai konten kartu di sini.</CardDescription>
        <CardAction>
          <button type="button" className="text-xs text-primary-500 font-semibold hover:underline">
            Opsi
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-100">
          Ini adalah isi konten utama dari kartu TailGrids UI. Dapat diisi dengan grafik, tabel ringkas, atau informasi detail.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Aksi Utama</Button>
      </CardFooter>
    </Card>
  );
}
```
