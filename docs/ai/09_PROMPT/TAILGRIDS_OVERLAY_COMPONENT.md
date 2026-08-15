Read docs/ai/README.md and INDEX.md first.

# TailGrids Overlay (OverlayWrapper, Backdrop) Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Overlay** (`OverlayWrapper`, `Backdrop`) berbasis **TailGrids UI Library** (`@/components/tailgrids/core/overlay`) untuk membalut komponen modal, dialog, popover, dan backdrop overlay pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

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
import { Popover, PopoverArrow } from "@/components/tailgrids/core/popover";
import { useState } from "react";
```

### Supported Components & Props:
- **`<OverlayWrapper>`**: Wrapper trigger dialog / popover berbasis React Aria Components `DialogTrigger`.
- **`<Backdrop>`**: Layer modal overlay penutup latar belakang berbasis `ModalOverlay` dengan efek `backdrop-blur-sm` & `bg-black/50`.
  - **`isDismissable`**: `boolean` (default: `true`) — Mengizinkan modal tertutup saat area luar diklik.
  - **`isOpen`**: `boolean` — State kontrol visibilitas modal untuk controlled component.
  - **`onOpenChange`**: `(isOpen: boolean) => void` — Callback saat status buka/tutup modal berubah.

---

## 1. Basic Overlay Preview (Uncontrolled Dialog dengan OverlayWrapper & Backdrop)

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

## 2. Overlay Wrapper dengan Popover (PopoverPreview)

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import { OverlayWrapper } from "@/components/tailgrids/core/overlay";
import { Popover, PopoverArrow } from "@/components/tailgrids/core/popover";

export default function PopoverPreview() {
  return (
    <OverlayWrapper>
      <Button appearance="outline">Open Popover</Button>

      <Popover>
        <h2 className="text-lg font-semibold">Popover Title</h2>
        <p className="text-sm text-muted-foreground">
          This is a popover with heading and description.
        </p>
        <PopoverArrow />
      </Popover>
    </OverlayWrapper>
  );
}
```

---

## 3. Controlled Overlay dengan Backdrop (Controlled State with isOpen & onOpenChange)

Gunakan pola ini ketika visibilitas modal dikontrol secara eksplisit oleh state React (`useState`), seperti pada aksi hapus akun/data destruktif:

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

## Catatan Penting

1. **Uncontrolled vs Controlled Overlay**:
   - Untuk modal/popover sederhana, gunakan `<OverlayWrapper>` yang secara otomatis menghubungkan tombol trigger dengan `<Backdrop>` / `<Popover>`.
   - Untuk dialog yang membutuhkan kontrol state khusus (misal membuka modal dari handler async atau konfirmasi tindakan), gunakan `<Backdrop isOpen={showModal} onOpenChange={setShowModal}>`.
2. **Backdrop Dismiss**: Secara default `isDismissable` bernilai `true`. Untuk mencegah pengguna menutup modal dengan mengklik area gelap di luar modal, tambahkan `isDismissable={false}` pada `<Backdrop>`.
3. **Integrasi Popover**: Gunakan `<OverlayWrapper>` bersama `<Popover>` dan `<PopoverArrow>` untuk membuat Floating Popover UI.
