Read docs/ai/README.md and INDEX.md first.

# TailGrids Sidebar Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Sidebar** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/sidebar`, `@/components/tailgrids/core/sheet`, `@/components/tailgrids/core/tooltip`, `@/components/tailgrids/core/select`, `@/components/tailgrids/core/checkbox`) untuk tata letak navigasi samping (collapsible sidebar, responsive mobile drawer sheet) dan pengaturan sidebar (Header & Sidebar Settings) pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from "@/components/tailgrids/core/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/tailgrids/core/select";
import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { Label } from "@/components/tailgrids/core/label";
import { Button } from "@/components/tailgrids/core/button";
import { Book1, Home3, Setting1, User1 } from "@tailgrids/icons";
```

---

## 1. Standard Sidebar Layout Preview

```jsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from "@/components/tailgrids/core/sidebar";
import { Book1, Home3, Setting1, User1 } from "@tailgrids/icons";

export default function SidebarLayoutPreview({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 border-b border-base-200">
          <h3 className="font-semibold text-title-50">SIMSIT Dashboard</h3>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Beranda">
                <Home3 className="size-4" />
                <span>Beranda</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Data Pegawai">
                <User1 className="size-4" />
                <span>Data Pegawai</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Akademik">
                <Book1 className="size-4" />
                <span>Akademik</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-base-200">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Pengaturan">
                <Setting1 className="size-4" />
                <span>Pengaturan</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-medium">Dashboard Utama</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

## 2. Pengaturan Sidebar & Header (Sidebar Settings Integration)

```jsx
"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/tailgrids/core/select";
import { Checkbox } from "@/components/tailgrids/core/checkbox";
import { Label } from "@/components/tailgrids/core/label";
import { Button } from "@/components/tailgrids/core/button";
import { Save, RotateCcw } from "lucide-react";

export function SidebarSettingsForm({ settings, onSave, onReset }: any) {
  const [form, setForm] = useState(settings);

  const update = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gaya Header */}
        <Select value={form.header_style || "light"} onChange={(v) => update("header_style", String(v))}>
          <SelectLabel>Gaya Header</SelectLabel>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih gaya header..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="light">Terang</SelectItem>
            <SelectItem id="solid">Warna Solid</SelectItem>
            <SelectItem id="transparent">Transparan</SelectItem>
          </SelectContent>
        </Select>

        {/* Gaya Sidebar */}
        <Select value={form.sidebar_style || "gradient"} onChange={(v) => update("sidebar_style", String(v))}>
          <SelectLabel>Gaya Sidebar</SelectLabel>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih gaya sidebar..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="gradient">Gradasi</SelectItem>
            <SelectItem id="solid">Warna Solid</SelectItem>
            <SelectItem id="light">Terang</SelectItem>
          </SelectContent>
        </Select>

        {/* Posisi Sidebar */}
        <Select value={form.sidebar_position || "left"} onChange={(v) => update("sidebar_position", String(v))}>
          <SelectLabel>Posisi Sidebar</SelectLabel>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih posisi sidebar..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem id="left">Kiri</SelectItem>
            <SelectItem id="right">Kanan</SelectItem>
          </SelectContent>
        </Select>

        {/* Checkbox Options */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
            <Checkbox
              id="header_sticky"
              checked={Boolean(form.header_sticky)}
              onChange={(e) => update("header_sticky", e.target.checked)}
            />
            <Label htmlFor="header_sticky" className="cursor-pointer text-xs font-bold">
              Header tetap di atas (Sticky Header)
            </Label>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
            <Checkbox
              id="sidebar_collapsed"
              checked={Boolean(form.sidebar_collapsed)}
              onChange={(e) => update("sidebar_collapsed", e.target.checked)}
            />
            <Label htmlFor="sidebar_collapsed" className="cursor-pointer text-xs font-bold">
              Sidebar mengecil secara default (Collapsed)
            </Label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="primary" appearance="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button type="submit" variant="primary" appearance="fill" size="sm">
          <Save className="h-4 w-4" /> Simpan Pengaturan
        </Button>
      </div>
    </form>
  );
}
```

---

## Catatan Penting

1. **SidebarProvider**: Selalu bungkus seluruh layout aplikasi/dashboard dengan `<SidebarProvider>`.
2. **Responsive Mobile**: Komponen `Sidebar` otomatis beralih menjadi drawer modal pada perangkat seluler via `<Sheet>`.
3. **Pengaturan Sidebar**: Form Pengaturan Sidebar menggunakan komponen TailGrids UI Core (`Select`, `Checkbox`, `Label`, `Button`) dan tersambung dengan `usePengaturanStore`.
4. **Keyboard Shortcut**: Gunakan `Ctrl+B` / `Cmd+B` untuk melakukan toggle collapse/expand sidebar secara global.
