# ENTERPRISE DESIGN SYSTEM V2

Sistem Manajemen Sekolah Terpadu — Design tokens global (SATU standar).

## Color Tokens

| Token | Hex | Pemakaian |
|---|---|---|
| `--primary` | `#0E5C44` | Brand, tombol primary, link, teks utama |
| `--secondary` | `#1E8E5A` | Gradien header, hover |
| `--accent` | `#3FBF75` | Highlight, focus ring, dark-mode accent |
| `--success` | `#22C55E` | Status sukses |
| `--warning` | `#F59E0B` | Peringatan |
| `--danger` | `#EF4444` | Hapus/error |
| `--info` | `#3B82F6` | Informasi |
| `--background` | `#F7F9FC` | Latar halaman |
| `--surface` | `#FFFFFF` | Kartu |
| `--dark-bg` | `#0F172A` | Latar dark |
| `--dark-surface` | `#1B2433` | Kartu dark |

## Typography

| Elemen | Ukuran | Berat |
|---|---|---|
| Page Title | 28–32px (text-2xl–3xl) | 800 |
| Section Title | 18–22px | 600–700 |
| Card Title | 14–16px | 600 |
| Body | 14px | 400–500 |
| Caption | 12px | 400 |
| Table | 13–14px | 400–500 |

Font: Inter. DILARANG ukuran font acak antar halaman.

## Spacing

| Konteks | Nilai |
|---|---|
| Page padding desktop | 24–32px |
| Page padding tablet | 20–24px |
| Page padding mobile | 16px |
| Section gap | 24px |
| Card gap | 16–24px |
| Form field gap | 16px |
| Button gap | 8–12px |

## Radius

| Elemen | Radius |
|---|---|
| Card | 18px |
| Modal | 20px |
| Input | 10–12px (AppSearch 12px, master control 14px lama) |
| Button | 10–12px |
| Badge | pill (999px) |

## Shadow

Soft enterprise shadow (`shadow-sm`, `shadow-xs`). Hover pakai `-translate-y-0.5` + `shadow-md` + border accent — TIDAK mengubah footprint layout. DILARANG `transform: scale()` untuk hover card yang menyebabkan page bergeser.

## Dark Mode

Layout identik antara light/dark — hanya token berubah. Tema disimpan di `localStorage.theme`, diterapkan sebelum React render (`main.jsx`).

## Accessibility (WCAG 2.1 AA target)

- Focus ring terlihat (`focus-visible:ring-3`)
- Icon button wajib `aria-label` / tooltip (IconButton)
- Modal: focus trap (ui/modal)
- Kontras: teks slate-900 di white, slate-300/400 di dark surface
- Keyboard: elemen clickable punya `role="button"` + Enter/Space (KpiCard, SummaryCard)

## Performance

- Tanpa animasi berat
- Tanpa provider duplikat
- Skeleton, bukan full-screen spinner terus-menerus
- Component kecil (tidak ada large inline array di canonical)
