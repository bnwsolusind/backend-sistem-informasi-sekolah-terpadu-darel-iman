Read docs/ai/README.md and INDEX.md first.

# TailGrids Select Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Select** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/select`) untuk form dropdown pilihan single dan multiple selection pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  Select,
  SelectContent,
  SelectDescription,
  SelectErrorMessage,
  SelectHeader,
  SelectIndicator,
  SelectItem,
  SelectLabel,
  SelectSection,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/tailgrids/core/select";
import { useState } from "react";
```

### Supported Components & Props:
- **`<Select>`**: Root container (`selectionMode="single" | "multiple"`, `value`, `onChange`, `isRequired`, `isInvalid`, `name`).
- **`<SelectLabel>`**: Label judul field select.
- **`<SelectTrigger>`**: Tombol pemicu dropdown select.
- **`<SelectValue>`**: Elemen penampil nilai pilihan aktif (atau `placeholder`).
- **`<SelectIndicator>`**: Ikon penanda dropdown (default: `<ChevronDown />`).
- **`<SelectContent>`**: Popover kontainer item daftar pilihan.
- **`<SelectItem>`**: Elemen pilihan individual.
- **`<SelectDescription>`**: Teks petunjuk di bawah select.
- **`<SelectErrorMessage>`**: Teks pesan error saat `isInvalid` bernilai `true`.

---

## 1. Single Select Preview (Pilihan Tunggal Unit Sekolah)

```jsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/tailgrids/core/select";
import { useState } from "react";

export default function SingleSelectPreview() {
  const [selectedUnit, setSelectedUnit] = useState<string>("sd");

  return (
    <div className="w-full max-w-sm p-4">
      <Select value={selectedUnit} onChange={setSelectedUnit}>
        <SelectLabel>Pilih Unit Pendidikan</SelectLabel>
        <SelectTrigger>
          <SelectValue placeholder="Pilih unit..." />
        </SelectTrigger>

        <SelectContent>
          <SelectItem id="tk">Unit TK (Taman Kanak-kanak)</SelectItem>
          <SelectItem id="sd">Unit SD (Sekolah Dasar)</SelectItem>
          <SelectItem id="smp">Unit SMP (Sekolah Menengah Pertama)</SelectItem>
          <SelectItem id="sma">Unit SMA (Sekolah Menengah Atas)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

## 2. Multiple Select Preview (Pilihan Ganda Role/Hak Akses)

```jsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/tailgrids/core/select";
import { useState } from "react";

export default function MultipleSelectPreview() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["guru", "walikelas"]);

  return (
    <div className="w-full max-w-sm p-4">
      <Select
        selectionMode="multiple"
        value={selectedRoles}
        onChange={setSelectedRoles}
      >
        <SelectLabel>Pilih Role Pegawai</SelectLabel>
        <SelectTrigger>
          <SelectValue placeholder="Pilih role..." />
        </SelectTrigger>

        <SelectContent>
          <SelectItem id="admin">Administrator Sekolah</SelectItem>
          <SelectItem id="guru">Guru Pengajar</SelectItem>
          <SelectItem id="walikelas">Wali Kelas</SelectItem>
          <SelectItem id="tahfizh">Pembimbing Tahfizh</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

## Catatan Penting

1. **ID Unik pada SelectItem**: Setiap `<SelectItem>` wajib memiliki prop `id` unik.
2. **Multiple Selection**: Tambahkan `selectionMode="multiple"` pada `<Select>` dan kelola state berupa array string.
3. **Validasi Error**: Gunakan `isInvalid` bersama `<SelectErrorMessage>` untuk menampilkan pesan validasi form.
