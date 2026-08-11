# MODAL / DRAWER STANDARD

Standar popup. Bukti historis: `99_ARCHIVE/GLOBAL_MODAL_DRAWER_STANDARD.md`, `99_ARCHIVE/MODAL_STANDARD.md`, `99_ARCHIVE/DRAWER_STANDARD.md`, `99_ARCHIVE/UI_MODAL_DRAWER_STANDARD.md`.

## Canonical

- `<AppModal />` — modal sentral (desktop).
- `<AppDrawer />` — drawer (right / left / bottom).
- `<ConfirmDialog />` — konfirmasi global CRUD.
- `<DeleteDialog />` — konfirmasi hapus (ikon peringatan + pesan tetap).
- `<ExportDialog />` — export (format: Excel/PDF/JSON/CSV).
- `<ImportDialog />` — import (upload file + template download).

Semua popup memakai design yang sama. DILARANG membuat popup custom per page.

## Spesifikasi

| Komponen | Radius | Lebar | Animasi |
|---|---|---|---|
| Modal | `rounded-[20px]` | desktop max-w-4xl (XL) / max-w-lg (konfirmasi) | Fade Scale 0.25s |
| Drawer | `rounded-l-[20px]` (right) / `rounded-t-[20px]` (bottom) | `w-full max-w-md md:max-w-lg lg:max-w-xl` | Slide 0.3s |
| Backdrop | — | `fixed inset-0 bg-slate-950/60 backdrop-blur-xs` | — |

## Responsive

| Perangkat | Perilaku |
|---|---|
| Desktop | Modal / Drawer |
| Tablet | 90–94vw |
| Mobile | Bottom Sheet / Full-screen Sheet (`rounded-t-[20px]`) |

## Struktur

- Header Sticky (title + close `X`, `border-b`)
- Body Scrollable (`max-h-[75vh] overflow-y-auto p-6`)
- Footer Sticky (actions kanan, `border-t`)

## Global CRUD Confirmation

Teks konfirmasi tetap (tidak boleh diubah):

| Aksi | Teks |
|---|---|
| Tambah | "Tambahkan data ini?" |
| Edit | "Simpan perubahan data?" |
| Delete | "Hapus data ini?" |
| Import | "Import data yang dipilih?" |
| Export | "Export data sesuai filter saat ini?" |
| Approval | "Setujui tindakan ini?" |

Konfirmasi adalah UX layer — TIDAK mengubah logic CRUD existing.

## Aksesibilitas

- Modal: focus trap, Escape close, overlay click close.
- Body scroll lock saat popup terbuka.
- Focus ring terlihat; elemen interaktif punya accessible name.

## Referensi

- Detail sumber: `99_ARCHIVE/GLOBAL_MODAL_DRAWER_STANDARD.md`, `99_ARCHIVE/MODAL_STANDARD.md`, `99_ARCHIVE/DRAWER_STANDARD.md`, `99_ARCHIVE/UI_MODAL_DRAWER_STANDARD.md`
- CRUD popup matrix: `99_ARCHIVE/CRUD_POPUP_MATRIX.md`
