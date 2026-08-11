# Drawer Standard Specification - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Standardized Core Component (`Drawer.jsx`, `KpiDetailDrawer.jsx`)

---

## 1. Specifications & Viewport Behaviors

- **Desktop Width**: Right slide-over panel (`w-full max-w-md md:max-w-lg lg:max-w-xl`).
- **Mobile Behavior**: Swipeable bottom sheet drawer (`w-full rounded-t-[20px] max-h-[90vh]`).
- **Overlay Animation**: `transition-transform duration-300 ease-in-out` (`translate-x-0` vs `translate-x-full`).
- **Backdrop**: `fixed inset-0 bg-slate-950/60 backdrop-blur-xs`.

---

## 2. Structural Features

1. **Header**: Title, Subtitle, and Close Trigger (`X` icon).
2. **Body**: Vertical scroll container (`overflow-y-auto max-h-[calc(100vh-140px)]`).
3. **Quick Actions**: Integrated action pills (Export PDF, Print, Edit Record).
4. **Data Tabs**: Tabbed detail switching (Ringkasan, History, Audit Logs).

---

## 3. Usage Matrix

- **Detail Inspection**: Sdm/Employee Details, Student Profile Detail, Unit Deep-dive.
- **KPI Drill-Down**: Sourced from KPI Cards to display PostgreSQL query items (`KpiDetailDrawer`).
- **Sidebar Drawer**: Mobile navigation overlay on mobile screen sizes.
