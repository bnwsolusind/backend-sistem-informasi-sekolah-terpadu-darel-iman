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
5. **Print & PDF Option Modal (`PrintOptionModal`)**: Gunakan `PrintOptionModal` dari `@/components/master-data` yang membungkus `@/components/tailgrids/core/dialog` untuk opsi **Cetak Langsung** (in-place via hidden iframe `printCleanTable`) dan **Unduh Berkas PDF** (`downloadPdfTable`).

---

## Template PrintOptionModal (Dialog Cetak & Unduh PDF)

```jsx
"use client";

import { PrintOptionModal } from "@/components/master-data";
import { printCleanTable, downloadPdfTable } from "@/utils/printHelper";

export default function MasterPagePreview() {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsPrintModalOpen(true)}>Cetak Data</Button>

      <PrintOptionModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Data Master"
        onPrint={() => {
          printCleanTable({
            title: 'Laporan Data Master',
            subtitle: 'Daftar Laporan Sekolah Islam Terpadu',
            headers: ['NO', 'KODE', 'NAMA', 'STATUS'],
            rows: listData.map((item, i) => [i + 1, item.code, item.name, item.status ? 'Aktif' : 'Nonaktif']),
          });
        }}
        onDownload={() => {
          downloadPdfTable({
            title: 'Laporan Data Master',
            subtitle: 'Daftar Laporan Sekolah Islam Terpadu',
            headers: ['NO', 'KODE', 'NAMA', 'STATUS'],
            rows: listData.map((item, i) => [i + 1, item.code, item.name, item.status ? 'Aktif' : 'Nonaktif']),
            filename: 'laporan_master.pdf',
          });
        }}
      />
    </>
  );
}
```

---

## Standard Benchmark Modal Form (Edit & Tambah Data) Style Guide

Benchmark Halaman Gold Standard: `http://localhost:5173/dashboard/akademik/perencanaan?tab=cp` (`MasterCapaianPembelajaranPage.jsx`) & `http://localhost:5173/dashboard/akademik/pembelajaran?tab=materi` (`LmsMateriPage.jsx`).

### Standard Structure & Aesthetics Rules

1. **Header Modal Gradient Soft Green**:
   - `DialogHeader` menggunakan background gradient `bg-gradient-to-r from-[#0E5C44] to-[#1E8E5A] -mx-6 -mt-6 p-5 text-white rounded-t-2xl flex items-center justify-between`
   - Ikon judul ditempatkan dalam kontainer backdrop blur: `p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20`
   - Typografi: `DialogTitle className="text-lg font-bold text-white"` dan `DialogDescription className="text-xs text-emerald-100 mt-0.5"`

2. **Body Form Input & Spacing**:
   - `DialogBody className="py-4 space-y-4 max-h-[75vh] overflow-y-auto"`
   - Text Label: `block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2`
   - Input / Select / Textarea Element: `w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E5C44] dark:text-slate-100 transition-colors`

3. **Footer Action Buttons**:
   - `DialogFooter className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800"`
   - Tombol Batal: `px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition`
   - Tombol Simpan / Submit: `inline-flex items-center gap-2 bg-[#0E5C44] hover:bg-[#1E8E5A] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50` dilengkapi ikon `<Sparkles className="w-4 h-4" />` / spinner `<RefreshCw className="w-4 h-4 animate-spin" />`

### Template Implementation (Standard Form Modal)

```jsx
<Dialog isOpen={modalOpen} onOpenChange={setModalOpen} className="max-w-2xl">
  <DialogHeader className="bg-gradient-to-r from-[#0E5C44] to-[#1E8E5A] -mx-6 -mt-6 p-5 text-white rounded-t-2xl">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <BookOpen className="w-5 h-5 text-emerald-200" />
        </div>
        <div>
          <DialogTitle className="text-lg font-bold text-white">
            {editingItem ? 'Edit Data' : 'Tambah Data Baru'}
          </DialogTitle>
          <DialogDescription className="text-xs text-emerald-100 mt-0.5">
            Lengkapi formulir di bawah ini dengan benar
          </DialogDescription>
        </div>
      </div>
    </div>
  </DialogHeader>

  <DialogBody className="py-4 space-y-4 max-h-[75vh] overflow-y-auto">
    <form id="form-data-master" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Nama Data <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E5C44] dark:text-slate-100 transition-colors"
        />
      </div>
    </form>
  </DialogBody>

  <DialogFooter className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
    <button
      type="button"
      onClick={() => setModalOpen(false)}
      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    >
      Batal
    </button>
    <button
      type="submit"
      form="form-data-master"
      disabled={formSubmitting}
      className="inline-flex items-center gap-2 bg-[#0E5C44] hover:bg-[#1E8E5A] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50"
    >
      {formSubmitting ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          {editingItem ? 'Simpan Perubahan' : 'Tambah Data'}
        </>
      )}
    </button>
  </DialogFooter>
</Dialog>
```

---

## Datatable Row Detail Modal & Action Buttons Pattern

Gunakan pola ini ketika pengguna mengklik baris data / nama item pada Datatable untuk menampilkan modal rincian detail lengkap berbasis `Dialog` dan `Backdrop` beserta tombol aksi (*Export Excel*, *Cetak Laporan*, *Tutup*) pada `DialogFooter`:

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { MasterStatusBadge } from "@/components/master-data";
import { Eye, FileSpreadsheet, Printer } from "lucide-react";

export function DatatableDetailModal({ selectedItem, onClose, onExport, onPrint }) {
  if (!selectedItem) return null;

  return (
    <Backdrop isOpen={Boolean(selectedItem)} onOpenChange={(open) => !open && onClose()}>
      <Dialog className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1B2433]">
        <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" />
              <span>Detail Data Siswa</span>
            </DialogTitle>
            <MasterStatusBadge status={selectedItem.aktif ? 'aktif' : 'nonaktif'} />
          </div>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Informasi profil lengkap dan status keaktifan data terdaftar.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 py-4 text-xs">
          {/* Detailed Info Grid */}
          <div className="grid grid-cols-2 gap-3.5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">NIS</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs">{selectedItem.nis || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Nama Siswa</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{selectedItem.nama || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Unit Pendidikan</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{selectedItem.unit || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Kelas / Rombel</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{selectedItem.kelas || '-'}</span>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {/* Soft Squircle Style Action Buttons in Modal */}
            <Button
              size="sm"
              variant="ghost"
              className="bg-amber-100/90 text-amber-600 hover:bg-amber-500 hover:text-white dark:bg-amber-950/60 dark:text-amber-300 font-semibold"
              onClick={() => onExport(selectedItem)}
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              Export Excel
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="bg-indigo-100/90 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
              onClick={() => onPrint(selectedItem)}
            >
              <Printer className="h-4 w-4 mr-1.5" />
              Cetak Laporan
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </Dialog>
    </Backdrop>
  );
}
```


```
