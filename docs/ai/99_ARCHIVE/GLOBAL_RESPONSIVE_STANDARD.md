# GLOBAL RESPONSIVE STANDARD

Sistem Manajemen Sekolah Terpadu — Standar responsif.

## Breakpoints

| Breakpoint | Layout |
|---|---|
| 1440 / 1280 | Desktop full |
| 1024 | Laptop (collapsible/mini sidebar) |
| 768 | Tablet (drawer navigasi) |
| 390 / 360 | Mobile (bottom navigation) |

## Responsive Grid (KPI)

| Layar | Kolom |
|---|---|
| Desktop (≥1024) | 4–6 KPI cards |
| Laptop (1024–1279) | 3–4 |
| Tablet (768–1023) | 2 |
| Mobile (<768) | 1–2 (card pendek) |

Gunakan CSS Grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` / `minmax`. Dilarang fixed-width card.

## Table

| Layar | Perilaku |
|---|---|
| Desktop | Full table |
| Tablet | Compact table |
| Mobile | Card-list representation |

## Filter

| Layar | Perilaku |
|---|---|
| Desktop | Inline |
| Tablet | Wrap / compact |
| Mobile | Button Filter → Drawer / Bottom Sheet |

## Target Verifikasi

- 0 card overlap
- 0 button overlap
- 0 modal overflow
- 0 broken sidebar
- 0 text clipping
- 0 unexpected horizontal page scroll

## Pengecekan

`AppBottomNavigation` hanya tampil di `md:hidden` (<768px).
`FAB` mobile hanya untuk role yang diizinkan (guard permission di pemanggil).
