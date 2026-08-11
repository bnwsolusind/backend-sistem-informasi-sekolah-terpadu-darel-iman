# Table Standard Specification - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Standardized Core Component (`DataTable.jsx`, `table.jsx`)

---

## 1. Core Architecture Specifications

All data tables across Master Data, Akademik, LMS, Absensi, Mutabaah, and Laporan follow a unified design pattern:

- **Sticky Header**: `sticky top-0 z-10 bg-slate-50 dark:bg-slate-900` ensures headers stay visible during vertical scrolling.
- **Sticky Action Column**: `sticky right-0 z-10 bg-white dark:bg-[#1B2433]` prevents action buttons from disappearing off-screen.
- **Responsive Wrapper**: Enclosed in `w-full overflow-x-auto` to handle narrow mobile viewports.
- **Typography & Spacing**: Headers (`text-[11px] font-extrabold uppercase text-slate-500`), Cells (`text-xs font-semibold text-slate-700`).

---

## 2. Standard Table Row Elements

| Element Slot | Implementation Pattern | Code Example |
|---|---|---|
| **Avatar Cell** | `PersonAvatar` or `PersonIdentityCell` | `<PersonAvatar name={row.name} avatarUrl={row.avatar} size="sm" />` |
| **Primary Title** | Bold text line (`text-xs font-extrabold text-slate-900`) | `<span className="font-bold text-slate-900">{row.nama}</span>` |
| **Subtitle** | Secondary text line (`text-[10px] text-slate-400`) | `<span className="text-[10px] text-slate-400">{row.nisn}</span>` |
| **Status Badge** | Color-coded `Badge` pill | `<Badge variant="success">Aktif</Badge>` |
| **Tooltip Trigger** | Native `title` or `Tooltip` component | `<span title={row.full_address}>{row.short_address}</span>` |
| **Dropdown Action** | `Dropdown` component with Edit, Detail, Delete triggers | `<Dropdown items={actionItems} />` |
| **Pagination** | `Pagination` bar with page size selector and item counts | `<Pagination page={1} totalPages={5} onPageChange={...} />` |
| **Filter & Search** | Integrated top filter bar with real-time input | `<input placeholder="Cari..." onChange={...} />` |

---

## 3. Empty & Loading States

- **Loading State**: Displays 5 rows of `Skeleton` table rows with matching column widths.
- **Empty State**: Displays `EmptyState` component with illustration, clear explanation, and "Tambah Data" primary action button.
