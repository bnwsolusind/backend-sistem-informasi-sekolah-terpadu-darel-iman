# Card Standard Specification - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Standardized Enterprise Card Architecture (`Card.jsx`, `StatCard.jsx`, `KpiCard.jsx`)

---

## 1. Enterprise Design System Tokens

- **Card Radius**: `18px` (`rounded-[18px]`)
- **Light Background**: `#FFFFFF` (`bg-white`)
- **Light Border**: `#E2E8F0` (`border-slate-200/80`)
- **Dark Background**: `#1B2433` (`dark:bg-[#1B2433]`)
- **Dark Border**: `#1E293B` (`dark:border-slate-800/80`)
- **Shadow**: Soft XL (`0 10px 30px -5px rgba(14, 92, 68, 0.08)`)

---

## 2. Card Component Elements Checklist

Every standard Card in the application incorporates the required 11 structural slots:

1. **Icon**: Lucide icon container (`h-9 w-9 rounded-xl` with curated theme background).
2. **Title**: Categorical header text (`text-xs font-bold text-slate-600 dark:text-slate-300`).
3. **Description / Subtitle**: Supporting contextual string (`text-[10px] text-slate-400`).
4. **Number / Value**: Primary metric display (`text-2xl font-black text-slate-900 dark:text-white`).
5. **Trend**: Dynamic percentage or growth indicator (`↑ 12%`, `↓ 3%`, `0`).
6. **Badge**: Categorical or status pill (`Badge` component).
7. **Action**: Click trigger or quick action link.
8. **Hover**: Smooth elevation shift (`hover:-translate-y-0.5 hover:border-[#3FBF75]/30 hover:shadow-lg`).
9. **Loading**: Integrated `Skeleton` placeholder state during query fetch.
10. **Empty**: Structured `EmptyState` component fallback when data payload is empty.
11. **Error**: Inline `ErrorState` card with Retry button on API failure.

---

## 3. Pointer & Interaction Rule

- **Actionable Cards**: Feature `cursor-pointer hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md`.
- **Non-Actionable Cards**: Strictly enforce `cursor-default` without hover transform or pointer pointer.
