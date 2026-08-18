Read docs/ai/README.md and INDEX.md first.

# TailGrids Dialog Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Dialog** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/dialog`, `@/components/tailgrids/core/overlay`, `@/components/tailgrids/core/button`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

Gunakan **Dialog** untuk notifikasi/konfirmasi **penyimpanan data baru** dan **perubahan data** (bukan untuk hapus — gunakan AlertDialog untuk aksi destruktif).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Backdrop, OverlayWrapper } from "@/components/tailgrids/core/overlay";
```

---

## Standard Dialog Preview

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Backdrop, OverlayWrapper } from "@/components/tailgrids/core/overlay";

export default function DialogPreview() {
  return (
    <OverlayWrapper>
      <Button>Open Dialog</Button>

      <Backdrop>
        <Dialog className="w-sm">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a basic dialog with a title, description, and a close
              button.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p>
              Dialogs are used to display content in a layer above the main
              page. They can be used to show information, ask a question, or
              collect input from the user.
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose autoFocus appearance="outline">
              Cancel
            </DialogClose>
            <Button>Confirm</Button>
          </DialogFooter>
        </Dialog>
      </Backdrop>
    </OverlayWrapper>
  );
}
```

---

## Template Konfirmasi Simpan Data Baru (Save Confirmation Dialog)

Gunakan template ini ketika pengguna menekan tombol **Simpan** pada form penambahan data baru.
Dialog ini menggunakan `isOpen` dan `onOpenChange` secara controlled dari state parent.

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";

export function KonfirmasiSimpanDialog({ isOpen, onOpenChange, onConfirm, isPending, itemName }) {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-sm"
      showCloseButton={false}
    >
      <DialogHeader>
        <DialogTitle>Konfirmasi Penyimpanan</DialogTitle>
        <DialogDescription>
          Apakah Anda yakin ingin menyimpan data {itemName || 'ini'} ke dalam sistem?
          Data yang disimpan akan langsung tersedia di sistem.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
          Data baru akan ditambahkan dan dapat dikelola setelah penyimpanan berhasil.
        </div>
      </DialogBody>
      <DialogFooter>
        <DialogClose autoFocus appearance="outline">
          Batal
        </DialogClose>
        <Button onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Simpan Data'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
```

---

## Template Konfirmasi Perubahan Data (Update Confirmation Dialog)

Gunakan template ini ketika pengguna menekan tombol **Simpan Perubahan** pada form edit data yang sudah ada.

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";

export function KonfirmasiPerubahanDialog({ isOpen, onOpenChange, onConfirm, isPending, itemName }) {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-sm"
      showCloseButton={false}
    >
      <DialogHeader>
        <DialogTitle>Konfirmasi Perubahan</DialogTitle>
        <DialogDescription>
          Apakah Anda yakin ingin menyimpan perubahan pada data {itemName || 'ini'}?
          Perubahan akan langsung diperbarui di server.
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-xs font-semibold text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
          Data yang sudah ada akan diperbarui dengan informasi terbaru yang Anda masukkan.
        </div>
      </DialogBody>
      <DialogFooter>
        <DialogClose autoFocus appearance="outline">
          Batal
        </DialogClose>
        <Button onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Memperbarui...' : 'Perbarui Data'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
```

---

## Pola Penggunaan di Page Component

Berikut contoh integrasi ke page yang memiliki form tambah/edit data:

```jsx
// State untuk konfirmasi dialog
const [showSaveConfirm, setShowSaveConfirm] = useState(false);

// Handler form submit — buka dialog konfirmasi dulu, bukan langsung mutasi
const handleFormSubmit = (e) => {
  e?.preventDefault();
  // Validasi form dulu
  if (!formData.name.trim()) { setFormAlert('Nama wajib diisi!'); return; }
  setFormAlert(null);
  setShowSaveConfirm(true); // Buka dialog konfirmasi
};

// Handler setelah user klik "Simpan" di dialog konfirmasi
const handleConfirmSave = () => {
  const payload = makePayload(formData);
  if (isEditMode && formData.id) {
    updateMutation.mutate({ id: formData.id, payload });
  } else {
    createMutation.mutate(payload);
  }
  setShowSaveConfirm(false);
};

// Render dialog konfirmasi
{showSaveConfirm && (
  isEditMode ? (
    <KonfirmasiPerubahanDialog
      isOpen={showSaveConfirm}
      onOpenChange={setShowSaveConfirm}
      onConfirm={handleConfirmSave}
      isPending={updateMutation.isPending}
      itemName={formData.name}
    />
  ) : (
    <KonfirmasiSimpanDialog
      isOpen={showSaveConfirm}
      onOpenChange={setShowSaveConfirm}
      onConfirm={handleConfirmSave}
      isPending={createMutation.isPending}
      itemName={formData.name}
    />
  )
)}
```

---

## Template Validasi Penghapusan Data (Controlled Backdrop + Dialog)

Gunakan template ini ketika mengonfirmasi aksi penghapusan data (aksi destruktif dengan state `Controlled` via `Backdrop`):

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { useState } from "react";

export function ValidasiHapusDialog({ isOpen, onOpenChange, onConfirm, isPending, itemName }) {
  return (
    <Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog>
        <DialogHeader>
          <DialogTitle>Apakah Anda yakin?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data{" "}
            <strong>{itemName || "tersebut"}</strong> secara permanen dari server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <DialogClose autoFocus appearance="outline" size="sm">
            Batal
          </DialogClose>
          <Button variant="danger" size="sm" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Menghapus..." : "Ya, Hapus Data"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Backdrop>
  );
}
```

---

## Controlled Overlay dengan Backdrop (Controlled State)

Gunakan pola ini ketika visibilitas dialog dikontrol secara eksplisit oleh state React (`useState`), seperti pada modal konfirmasi aksi khusus:

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { useState } from "react";

export default function ControlledOverlayWithBackdropPreview() {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div>
      <Button variant="danger" onClick={() => setShowModal(true)}>
        Delete Account
      </Button>

      <Backdrop isOpen={showModal} onOpenChange={setShowModal}>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all of your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <DialogClose autoFocus appearance="outline" size="sm">
              Cancel
            </DialogClose>
            <Button variant="danger" size="sm">
              Yes, Delete Account
            </Button>
          </DialogFooter>
        </Dialog>
      </Backdrop>
    </div>
  );
}
```

---

## Perbedaan Dialog vs AlertDialog

| Aspek | Dialog | AlertDialog |
|-------|--------|-------------|
| **Gunakan untuk** | Konfirmasi simpan, ubah, input data | Konfirmasi hapus, aksi destruktif |
| **isDismissable** | `true` (default) | `false` (default) |
| **Keyboard dismiss** | Bisa ditutup via Escape | Tidak bisa ditutup via Escape |
| **Tone** | Positif (emerald/amber) | Negatif (rose/merah) |
| **Tombol konfirmasi** | `variant="primary"` (default) | `variant="danger"` |
| **showCloseButton** | `true` atau `false` | Tidak ada (AlertDialog) |

---

## Catatan Penting

1. **Selalu validasi form dulu** sebelum menampilkan dialog konfirmasi.
2. **Dialog controlled**: Gunakan `isOpen` dan `onOpenChange` untuk kontrol programmatik.
3. **Tutup dialog setelah mutasi**: Panggil `setShowSaveConfirm(false)` setelah `mutate()`.
4. **Toast setelah berhasil**: Gunakan `pushToast()` di `onSuccess` mutation untuk notifikasi berhasil.
