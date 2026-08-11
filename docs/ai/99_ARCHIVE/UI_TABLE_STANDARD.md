# DATA TABLE STANDARDIZATION — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Standardization of data table headers, sorting, row identity, badges, row actions, and responsive card views.

---

## 1. TABLE SPECIFICATION MATRIX

| ITEM | SPECIFICATION | DESIGN CLASS / COMPONENT |
|---|---|---|
| Toolbar Container | Responsive Search & Filter Bar | `bg-slate-50 border-slate-200/80 dark:bg-slate-900/60` |
| Table Header | Sticky top header with sort indicators | `bg-slate-100/80 font-bold uppercase text-[11px]` |
| Person Row Identity | Avatar + Name + Subtitle | `<PersonIdentityCell />` |
| Status Badge | Standardized pill badges | `<Badge variant="success|warning|danger" />` |
| Row Actions | Tooltip-wrapped icon buttons | `Eye`, `Pencil`, `Trash2`, `RotateCcw` |
| Pagination Controls | Per-page selection & page jump buttons | `<Pagination />` |
| Empty State | Centered Inbox icon with helper text | `<DataTable />` Empty row fallback |
| Loading State | Animated pulse skeleton rows | `<Skeleton />` 5-row pulse loader |

---

## 2. MOBILE TABLE BREAKPOINT RULE

On screens `< 768px` (mobile viewport), complex data tables collapse into responsive cards or maintain an isolated horizontal scroll container (`overflow-x-auto`) to prevent main document horizontal overflow.
