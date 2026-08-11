# RESPONSIVE STANDARD

Standar responsif & PWA. Bukti historis: `99_ARCHIVE/GLOBAL_RESPONSIVE_STANDARD.md`, `99_ARCHIVE/UI_RESPONSIVE_STANDARD.md`, `99_ARCHIVE/MOBILE_STANDARD.md`.

## Breakpoint

| Breakpoint | Lebar | Perilaku |
|---|---|---|
| Desktop | ≥1280 | Layout penuh, sidebar permanen |
| Laptop | 1024–1279 | Sidebar collapsible/mini |
| Tablet | 768–1023 | Sidebar → drawer |
| Mobile | <768 | Bottom navigation + padding 16px |

## Target Verifikasi (Wajib Benar)

360px (mobile) · 390px (mobile) · 768px (tablet) · 1024px (laptop) · 1280px · 1440px (desktop).

KPI grid: Desktop 4–6 · Laptop 3–4 · Tablet 2 · Mobile 1–2.

## Rule

- **0 overlap** · **0 overflow** · **0 broken sidebar** · **0 text clipping** · **0 horizontal scroll**.
- DILARANG memaksa elemen penuh lebar di mobile bila merusak layout (pakai `md:` prefix).
- Mobile: bottom nav `md:hidden`, sidebar `hidden lg:block`.
- Touch target ≥ 44px, keyboard friendly.
- Konten tidak boleh "mendikte" layout; layout mengikuti breakpoint.

## Mobile Bottom Navigation

Tampil <768px, menu mengikuti role (lihat NAVIGATION_STANDARD / LAYOUT_STANDARD). Padding halaman mobile 16px.

## PWA Ready

- Meta viewport: `width=device-width, initial-scale=1, viewport-fit=cover`.
- Theme color `#0E5C44`; safe-area inset via env() untuk iOS.
- Manifest + Service Worker sesuai project setup (tidak dibahas detail di rulebook ini).

## Referensi

- Navigasi responsive: `04_UI_UX/NAVIGATION_STANDARD.md`
- Grid dashboard: `04_UI_UX/LAYOUT_STANDARD.md`
- Detail sumber: `99_ARCHIVE/GLOBAL_RESPONSIVE_STANDARD.md`, `99_ARCHIVE/RESPONSIVE_MATRIX.md`, `99_ARCHIVE/MOBILE_STANDARD.md`, `99_ARCHIVE/UI_RESPONSIVE_STANDARD.md`
