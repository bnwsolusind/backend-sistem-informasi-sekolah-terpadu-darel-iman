# UI COMPONENT STANDARDIZATION MATRIX — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Standardization guidelines for core reusable UI components across all modules.

---

## 1. CORE COMPONENT STANDARDS

| COMPONENT NAME | FILE PATH | PURPOSE | DESIGN SYSTEM RULE | AUDIT STATUS |
|---|---|---|---|---|
| PageHeader | `components/master-data/index.jsx` | Standard header with icon, title, description, and actions | Uses `#0E5C44` brand styling with Lucide Icon | VERIFIED |
| KpiCard | `components/ui/card.jsx` / `StatCard.jsx` | High-level metric display card | `rounded-[18px]`, hover shadow, skeleton fallback | VERIFIED |
| DataTable | `components/common/DataTable.jsx` | TanStack table with search, sorting, and pagination | Light/Dark responsive toolbar, sticky header | VERIFIED |
| PersonAvatar | `components/ui/PersonAvatar.jsx` | Individual avatar with foto resolution & initials fallback | Gradient tones based on name hash | VERIFIED |
| PersonIdentityCell | `components/ui/PersonIdentityCell.jsx` | Table row identity cell (Avatar + Name + Subtitle) | Unified 2-line vertical identity wrap | VERIFIED |
| Modal | `components/ui/modal.jsx` | Overlay dialog for forms and confirmation | `rounded-[20px]`, Backdrop blur, Esc/X close | VERIFIED |
| Drawer | `components/ui/drawer.jsx` | Side panel drawer for complex forms & details | `w-full max-w-md`, smooth slide animation | VERIFIED |
| Badge | `components/ui/badge.jsx` | Status indicator pills | Pill shape, brand HSL/Tailwind colors | VERIFIED |
| EmptyState | `components/ui/empty-state.jsx` | Informative empty data container | Icon + Title + Description + Optional action | VERIFIED |
| ErrorState | `components/common/RouteErrorElement.jsx` | Error handling container with retry trigger | Explanatory message + Retry button action | VERIFIED |

---

## 2. INTERACTION & ACCESSIBILITY RULES

1. **Hover & Focus**: Interactive buttons and card links feature smooth scale/border transitions (`transition-all duration-200 focus-visible:ring-2`).
2. **Keyboard Esc Handler**: Modals and Drawers listen for key presses to close cleanly.
