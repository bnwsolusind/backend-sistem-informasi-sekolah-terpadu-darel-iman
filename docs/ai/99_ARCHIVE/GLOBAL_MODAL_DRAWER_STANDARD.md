# GLOBAL MODAL / DRAWER STANDARD

Sistem Manajemen Sekolah Terpadu — Standar popup.

## Canonical

- `<AppModal />` — modal sentral (desktop).
- `<AppDrawer />` — drawer (right / left / bottom).
- `<ConfirmDialog />` — konfirmasi global CRUD.
- `<DeleteDialog />` — konfirmasi hapus (ikon peringatan + pesan tetap).
- `<ExportDialog />` — export (format: Excel/PDF/JSON/CSV).
- `<ImportDialog />` — import (upload file + template download).

Semua popup memakai design yang sama. DILARANG membuat popup custom per page.

## Responsive

| Perangkat | Perilaku |
|---|---|
| Desktop | Modal / Drawer |
| Tablet | 90–94vw |
| Mobile | Bottom Sheet / Full-screen Sheet |

## Struktur

- Header Sticky
- Body Scrollable
- Footer Sticky

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
- Focus ring terlihat.
- Element interaktif punya accessible name.
