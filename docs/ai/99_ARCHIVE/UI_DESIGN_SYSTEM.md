# MASTER UI/UX DESIGN SYSTEM — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Unified design system specification, color palette, typography, radii, shadows, and icon library.

---

## 1. COLOR PALETTE SYSTEM

| TOKEN ROLE | COLOR NAME | LIGHT MODE VALUE | DARK MODE VALUE | USAGE |
|---|---|---|---|---|
| Primary | Deep Forest Emerald | `#0E5C44` | `#3FBF75` | Primary buttons, active nav links, headers, brand accents |
| Secondary | Leaf Green | `#1E8E5A` | `#1E8E5A` | Secondary actions, badges, interactive toggles |
| Accent | Mint Emerald | `#3FBF75` | `#3FBF75` | Focus rings, highlight borders, subtle glows |
| Background | Ice Slate BG | `#F7F9FC` | `#0F172A` | Global page background container |
| Surface / Card | Clean White | `#FFFFFF` | `#1B2433` | Cards, table containers, dropdown menus |
| Border | Soft Border | `rgba(226, 232, 240, 0.8)` | `rgba(51, 65, 85, 0.8)` | Card borders, table dividers, input borders |
| Text Primary | Deep Charcoal | `#0F172A` | `#F8FAFC` | Main headings, body text, table row titles |
| Text Muted | Slate Neutral | `#64748B` | `#94A3B8` | Subtitles, labels, metadata, timestamps |

---

## 2. TYPOGRAPHY & SPACING TOKENS

- **Primary Font Family**: `Inter, system-ui, -apple-system, sans-serif`
- **Headings**: `font-black` / `font-extrabold` tracking tight
- **Body Text**: `font-normal` / `font-medium` leading relaxed
- **Card Border Radius**: `rounded-[18px]`
- **Modal Border Radius**: `rounded-[20px]`
- **Control / Input Radius**: `rounded-[14px]`
- **Badge Radius**: `rounded-full`

---

## 3. ICONOGRAPHY STANDARD

- **Standard Library**: `Lucide Icons` (`lucide-react`)
- **Icon Sizing**: `h-4 w-4` (inline/buttons), `h-5 w-5` (headers/badges), `h-6 w-6` (KPI cards)
- **Tooltip Enforcement**: All icon-only action buttons require accessible tooltip wraps.
