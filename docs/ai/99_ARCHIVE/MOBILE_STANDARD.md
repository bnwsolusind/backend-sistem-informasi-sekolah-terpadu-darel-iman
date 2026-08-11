# Mobile UX Standard Specification - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Mobile UX Standard Enforced

---

## 1. Core Mobile Enhancements

In accordance with Enterprise UX Principle #14:
> "Mobile bukan hanya responsive. Tambahkan Bottom Navigation, Floating Action Button (FAB), Bottom Sheet, Swipe Drawer, Touch Friendly."

---

## 2. Component Implementation Summary

1. **Bottom Navigation**: Sticky bottom navigation bar for quick role access (Dashboard, Portal, Absensi, Mutabaah, Profil).
2. **Floating Action Button (FAB)**: Multi-action speed dial FAB (`FAB.jsx`) floating at bottom right (`bottom-20 right-4`). Triggers Quick Add, Scan Gate Code, and Emergency Report.
3. **Bottom Sheet Modals**: All modals automatically snap into touch-friendly bottom sheets on viewports `<640px`.
4. **Swipe Drawer**: Slide-over drawer navigation with backdrop tap dismissal.
5. **Touch Targets**: All interactive elements (buttons, filter chips, table rows) feature minimum touch target dimensions of **44px x 44px**.

---

## 3. Verified Screen Sizes

- [x] **Desktop Ultra-Wide** (`1920px`)
- [x] **Laptop Standard** (`1366px`)
- [x] **Tablet Landscape** (`1024px`)
- [x] **Tablet Portrait** (`768px`)
- [x] **Mobile Large** (`390px` - iPhone 14/15/16)
- [x] **Mobile Compact** (`360px` - Android Standard)
