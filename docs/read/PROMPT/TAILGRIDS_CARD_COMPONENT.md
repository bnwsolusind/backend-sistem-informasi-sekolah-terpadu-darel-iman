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

---

## 3. Interactive KPI Tinted Card Standard (Absensi Gerbang & Absensi Pembelajaran)

Gunakan pola kartu **KPI Soft Pastel Tinted Card** berbasis `motion.button` untuk menampilkan ringkasan data statistik dengan umpan balik visual interaktif dan warna pastel lembut yang seragam.

```jsx
import { motion } from 'framer-motion'
import { UserCheck, Clock, ShieldCheck, AlertTriangle } from 'lucide-react'

// Palet Warna Pastel Resmi KPI Card:
const KpiCardPastelStyles = {
  emerald: {
    card: 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-200 dark:border-emerald-950/50 dark:bg-emerald-950/20',
    title: 'text-emerald-700 dark:text-emerald-400',
    icon: 'text-emerald-500',
    val: 'text-emerald-600 dark:text-emerald-300',
    sub: 'text-emerald-600/70 dark:text-emerald-400/70',
  },
  amber: {
    card: 'border-amber-100 bg-amber-50/50 hover:border-amber-200 dark:border-amber-950/50 dark:bg-amber-950/20',
    title: 'text-amber-700 dark:text-amber-400',
    icon: 'text-amber-500',
    val: 'text-amber-600 dark:text-amber-300',
    sub: 'text-amber-600/70 dark:text-amber-400/70',
  },
  blue: {
    card: 'border-blue-100 bg-blue-50/50 hover:border-blue-200 dark:border-blue-950/50 dark:bg-blue-950/20',
    title: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-500',
    val: 'text-blue-600 dark:text-blue-300',
    sub: 'text-blue-600/70 dark:text-blue-400/70',
  },
  purple: {
    card: 'border-purple-100 bg-purple-50/50 hover:border-purple-200 dark:border-purple-950/50 dark:bg-purple-950/20',
    title: 'text-purple-700 dark:text-purple-400',
    icon: 'text-purple-500',
    val: 'text-purple-600 dark:text-purple-300',
    sub: 'text-purple-600/70 dark:text-purple-400/70',
  },
}

export function KpiTintedCard({ label, value, subtext, icon: Icon, tone = 'emerald', onClick }) {
  const t = KpiCardPastelStyles[tone] || KpiCardPastelStyles.emerald

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`text-left rounded-2xl border ${t.card} p-5 shadow-xs transition-all hover:shadow-md cursor-pointer group`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold ${t.title}`}>{label}</p>
        <Icon className={`h-4 w-4 ${t.icon} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </div>
      <p className={`mt-2 text-3xl font-extrabold ${t.val}`}>{value ?? 0}</p>
      {subtext && (
        <p className={`mt-1.5 text-[10px] font-bold ${t.sub} flex items-center gap-0.5`}>
          {subtext}
        </p>
      )}
    </motion.button>
  )
}
```

---

## 4. Page Container & Card Layout Spacing Standard

Gunakan `PageContainer` (`@/components/app/PageContainer`) dengan padding dan margin terstandarisasi untuk membungkus kartu-kartu pada halaman:

```jsx
<PageContainer className="space-y-6 pb-12">
  {/* KPI Grid */}
  <MasterStatsGrid columns={5}>...</MasterStatsGrid>

  {/* Analytics Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card className="rounded-[18px] border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-[#1B2433]">...</Card>
    <Card className="rounded-[18px] border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-[#1B2433]">...</Card>
  </div>
</PageContainer>
```
Dokumentasi lengkap mengenai aturan margin & padding kontainer tersedia pada [TAILGRIDS_PAGE_CONTAINER_LAYOUT.md](file:///Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/docs/read/PROMPT/TAILGRIDS_PAGE_CONTAINER_LAYOUT.md).

