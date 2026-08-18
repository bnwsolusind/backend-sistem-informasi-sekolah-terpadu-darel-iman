Read docs/ai/README.md and INDEX.md first.

# TailGrids Alert Dialog Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Alert Dialog** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/alert-dialog`, `@/components/tailgrids/core/dialog`, `@/components/tailgrids/core/overlay`, `@/components/tailgrids/core/button`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { AlertDialog } from "@/components/tailgrids/core/alert-dialog";
import { Button } from "@/components/tailgrids/core/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { OverlayWrapper } from "@/components/tailgrids/core/overlay";
```

---

## Standard Code Preview (AlertDialogPreview)

```jsx
"use client";

import { AlertDialog } from "@/components/tailgrids/core/alert-dialog";
import { Button } from "@/components/tailgrids/core/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { OverlayWrapper } from "@/components/tailgrids/core/overlay";

export default function AlertDialogPreview() {
  return (
    <OverlayWrapper>
      <Button>Open Alert Dialog</Button>

      <AlertDialog>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose appearance="outline">Cancel</DialogClose>
          <Button>Continue</Button>
        </DialogFooter>
      </AlertDialog>
    </OverlayWrapper>
  );
}
```

---

## Template Tambah Penyimpanan (Add Storage Alert Dialog)

```jsx
"use client";

import { AlertDialog } from "@/components/tailgrids/core/alert-dialog";
import { Button } from "@/components/tailgrids/core/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { OverlayWrapper } from "@/components/tailgrids/core/overlay";

export function TambahPenyimpananAlertDialog({ isOpen, onOpenChange, onConfirm }) {
  return (
    <OverlayWrapper>
      <Button>Tambah Penyimpanan</Button>

      <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
        <DialogHeader>
          <DialogTitle>Konfirmasi Tambah Penyimpanan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menambahkan lokasi / data penyimpanan baru ini ke dalam sistem?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose appearance="outline">Batal</DialogClose>
          <Button onClick={onConfirm}>Simpan Penyimpanan</Button>
        </DialogFooter>
      </AlertDialog>
    </OverlayWrapper>
  );
}
```

---

## Template Ubah Penyimpanan (Edit Storage Alert Dialog)

```jsx
"use client";

import { AlertDialog } from "@/components/tailgrids/core/alert-dialog";
import { Button } from "@/components/tailgrids/core/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { OverlayWrapper } from "@/components/tailgrids/core/overlay";

export function UbahPenyimpananAlertDialog({ isOpen, onOpenChange, onConfirm }) {
  return (
    <OverlayWrapper>
      <Button appearance="outline">Ubah Penyimpanan</Button>

      <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
        <DialogHeader>
          <DialogTitle>Konfirmasi Ubah Penyimpanan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menyimpan perubahan pada data penyimpanan ini? Perubahan akan langsung diperbarui di server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose appearance="outline">Batal</DialogClose>
          <Button onClick={onConfirm}>Perbarui Penyimpanan</Button>
        </DialogFooter>
      </AlertDialog>
    </OverlayWrapper>
  );
}

---

## Standard Destructive Preview (AlertDialogDestructivePreview)

```jsx
"use client";

import { AlertDialog } from "@/components/tailgrids/core/alert-dialog";
import { Button } from "@/components/tailgrids/core/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { OverlayWrapper } from "@/components/tailgrids/core/overlay";

export default function AlertDialogDestructivePreview() {
  return (
    <OverlayWrapper>
      <Button variant="danger">Delete Account</Button>

      <AlertDialog>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action is
            permanent and all your data will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose appearance="outline" autoFocus>
            Cancel
          </DialogClose>
          <Button variant="danger" size="sm">
            Delete
          </Button>
        </DialogFooter>
      </AlertDialog>
    </OverlayWrapper>
  );
}
```

---

## Template Hapus Data / Hapus Penyimpanan (Delete Storage Alert Dialog)

```jsx
"use client";

import { AlertDialog } from "@/components/tailgrids/core/alert-dialog";
import { Button } from "@/components/tailgrids/core/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { OverlayWrapper } from "@/components/tailgrids/core/overlay";

export function HapusPenyimpananAlertDialog({ isOpen, onOpenChange, onConfirm }) {
  return (
    <OverlayWrapper>
      <Button variant="danger">Hapus Penyimpanan</Button>

      <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus Penyimpanan</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus data penyimpanan ini? Tindakan ini bersifat permanen dan data yang dihapus tidak dapat dikembalikan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose appearance="outline" autoFocus>
            Batal
          </DialogClose>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Hapus
          </Button>
        </DialogFooter>
      </AlertDialog>
    </OverlayWrapper>
  );
}
```

```
