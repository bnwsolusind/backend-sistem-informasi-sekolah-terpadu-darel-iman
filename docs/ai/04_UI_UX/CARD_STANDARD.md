# CARD STANDARD

Standar kartu. Bukti historis: `99_ARCHIVE/GLOBAL_CARD_STANDARD.md`, `99_ARCHIVE/CARD_STANDARD.md`.

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
- `loading` → `AppSkeleton variant="card"`; empty/null → `—`.
- Clickable: `cursor-pointer`, keyboard focus, Enter/Space, `aria-label`, chevron hint. TIDAK clickable jika tidak ada aksi.

## Design Tokens

- Radius **18px** (`rounded-[18px]`); light bg `#FFFFFF` border `#E2E8F0`; dark bg `#1B2433` border `#1E293B`; shadow soft XL `0 10px 30px -5px rgba(14,92,68,0.08)`.

## Struktur Card (11 slot wajib)

Icon · Title · Description/Subtitle · Value · Trend · Badge · Action · Hover · Loading (Skeleton) · Empty (`AppEmptyState`) · Error (`AppErrorState` + Retry).

## Aturan

- Card gap 16–24px, radius 18px, shadow soft.
- DILARANG membuat card sendiri per halaman.
- Hover: `-translate-y-0.5` + border accent + shadow — tanpa layout shift. Non-actionable: `cursor-default` tanpa hover transform.
- Dark mode: `dark:bg-[#1B2433]` token, bukan layout berbeda.

## Referensi

- Design tokens: `04_UI_UX/DESIGN_SYSTEM.md`
- Detail sumber: `99_ARCHIVE/GLOBAL_CARD_STANDARD.md`, `99_ARCHIVE/CARD_STANDARD.md`
