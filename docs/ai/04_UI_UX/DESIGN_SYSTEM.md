# DESIGN SYSTEM

Design tokens global (SATU standar). Bukti historis: `99_ARCHIVE/ENTERPRISE_DESIGN_SYSTEM_V2.md`, `99_ARCHIVE/UI_DESIGN_SYSTEM.md` (Sesi 15), `99_ARCHIVE/AI_RULEBOOK.md`.

## Warna

| Token | Hex | Pemakaian |
|---|---|---|
| Primary | `#0E5C44` | Brand, tombol primary, link, teks utama |
| Secondary | `#1E8E5A` | Gradien header, hover |
| Accent | `#3FBF75` | Highlight, focus ring, dark-mode accent |
| Success | `#22C55E` | Status sukses |
| Warning | `#F59E0B` | Peringatan |
| Danger | `#EF4444` | Hapus/error |
| Info | `#3B82F6` | Informasi |
| Background Light | `#F7F9FC` | Latar halaman |
| Surface / Card | `#FFFFFF` | Kartu |
| Dark Background | `#0F172A` | Latar dark |
| Dark Surface | `#1B2433` | Kartu dark |
| Text Primary | `#0F172A` (light) / `#F8FAFC` (dark) | Heading & body |
| Text Muted | `#64748B` (light) / `#94A3B8` (dark) | Subtitle, label |
| Border | `rgba(226,232,240,0.8)` (light) / `rgba(51,65,85,0.8)` (dark) | Border card/input |

Dark mode: primary tetap hijau; chart mengikuti tema; kontras tinggi.

## Tipografi

- Font: `Inter, system-ui, -apple-system, sans-serif`. DILARANG ukuran font acak antar halaman.
- Page Title 28–32px (text-2xl–3xl) weight 800 · Section Title 18–22px 600–700 · Card Title 14–16px 600 · Body 14px 400–500 · Caption 12px · Table 13–14px.
- Heading: `font-black`/`font-extrabold` tracking tight. Body: `font-normal`/`font-medium` leading relaxed.

## Radius

| Elemen | Radius |
|---|---|
| Card | **18px** (`rounded-[18px]`) |
| Modal | **20px** (`rounded-[20px]`) |
| Input/Control | 10–14px |
| Button | 10–12px |
| Badge | pill (`rounded-full`) |

## Shadow & Spacing

- Shadow: soft enterprise (`shadow-sm`/`shadow-xs`). Hover: `-translate-y-0.5` + `shadow-md` + border accent — tanpa layout shift. DILARANG `transform: scale()` hover card yang menggeser halaman.
- Spacing: page padding desktop 24–32px · tablet 20–24px · mobile 16px · section gap 24px · card gap 16–24px · form field gap 16px · button gap 8–12px.

## Ikon & Chart

- Ikon: **Lucide** (`lucide-react`). Ukuran: `h-4 w-4` inline, `h-5 w-5` header/badge, `h-6 w-6` KPI.
- Chart: ApexCharts (animated loading).
- Animasi: Framer Motion (preset global; reduced motion tetap berfungsi).

## Dark Mode

Layout identik light/dark; hanya token berubah. Tema disimpan `localStorage.theme`, diterapkan sebelum React render (`main.jsx`).

## Accessibility (target WCAG 2.1 AA)

- Focus ring terlihat (`focus-visible:ring-3`).
- Icon button wajib `aria-label`/tooltip.
- Modal: focus trap; Escape close.
- Kontras: teks slate-900 di white, slate-300/400 di dark surface.
- Keyboard: elemen clickable punya `role="button"` + Enter/Space.

## Referensi

- Aturan global: `04_UI_UX/UI_RULEBOOK.md`
- Detail sumber: `99_ARCHIVE/ENTERPRISE_DESIGN_SYSTEM_V2.md`, `99_ARCHIVE/UI_DESIGN_SYSTEM.md`, `99_ARCHIVE/AI_RULEBOOK.md`
