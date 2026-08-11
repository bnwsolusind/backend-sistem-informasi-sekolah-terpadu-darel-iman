# GLOBAL CARD STANDARD

Sistem Manajemen Sekolah Terpadu — Standar kartu.

## Canonical

| Komponen | Fungsi | File |
|---|---|---|
| `<AppCard />` | Kartu konten standar (header + icon + actions + body) | `app/AppCard.jsx` |
| `<SectionCard />` | Alias semantic kartu bagian halaman | `app/AppCard.jsx` |
| `<KpiCard />` | KPI card (icon, label, value, trend, badge, sparkline, drilldown) | `app/KpiCard.jsx` |
| `<SummaryCard />` | Ringkasan horizontal (icon, title, value, description) | `app/SummaryCard.jsx` |

## KPI Card Structure

```
┌──────────────────────────┐
│ [icon]            ┌────┐ │
│ TITLE             │ 12 │ │
│ 1.240        [badge]    │
│ ─────────────────────── │
│ ↑ 12%  dari periode     │
└──────────────────────────┘
```

- `colorScheme`: emerald / blue / violet / amber / rose / indigo (+ slate di SummaryCard).
- `trend`: up (emerald, ArrowUpRight), down (rose, ArrowDownRight), neutral (Minus).
- `sparkline`: mini chart SVG inline (tanpa dependency).
- `loading` → `AppSkeleton variant="card"`.
- `empty`/null value → `—`.
- Clickable: `cursor-pointer`, keyboard focus, Enter/Space, `aria-label`, chevron hint.
- TIDAK clickable jika tidak ada aksi.

## Aturan

- Card gap 16–24px, radius 18px, shadow soft.
- DILARANG membuat card sendiri per halaman.
- Hover: `-translate-y-0.5` + border accent + shadow — tanpa layout shift.
- Dark mode: `dark:bg-[#1B2433]` token, bukan layout berbeda.
