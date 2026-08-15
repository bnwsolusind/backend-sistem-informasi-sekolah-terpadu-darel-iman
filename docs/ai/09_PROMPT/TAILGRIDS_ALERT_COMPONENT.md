Read docs/ai/README.md and INDEX.md first.

# TailGrids Alert Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Alert** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/alert`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle
} from "@/components/tailgrids/core/alert";
```

### Component Structure
- **`<Alert status="default | success | warning | error | info">`**: Wrapper utama alert.
- **`<AlertIndicator />`**: Menampilkan ikon otomatis berdasarkan `status` (Default/Info: InfoCircle, Success: CheckCircle1, Warning: InfoTriangle, Error: Xmark).
- **`<AlertContent>`**: Container untuk judul dan deskripsi.
- **`<AlertTitle>`**: Judul alert (secara bawaan menggunakan Heading level 4).
- **`<AlertDescription>`**: Teks deskripsi / pesan detail alert.

---

## Standard Code Template (Alert Variants Preview)

```jsx
"use client";

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle
} from "@/components/tailgrids/core/alert";

export default function AlertVariantsPreview() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Alert>
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Default</AlertTitle>
          <AlertDescription>
            This is a default alert. It provides general information to the
            user.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert status="success">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your changes have been saved successfully.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert status="warning">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Your subscription will expire in 3 days. Please renew to continue.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert status="error">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem processing your request. Please try again.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert status="info">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            A new software update is available. See what&apos;s new.
          </AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  );
}
```

---

## Status Variants & Usage Matrix

| Status | Properti `status` | Warna & Visual | Penggunaan Utama |
|---|---|---|---|
| **Default** | *(omitted)* / `default` | Netral / Gray | Informasi umum / standar |
| **Success** | `status="success"` | Hijau | Konfirmasi aksi berhasil (simpan, update, hapus) |
| **Warning** | `status="warning"` | Kuning / Oranye | Peringatan batas waktu, tindakan perhatian |
| **Error** | `status="error"` | Merah | Pesan gagal, validasi error, kendala sistem |
| **Info** | `status="info"` | Biru | Informasi pembaharuan, tip, petunjuk |
