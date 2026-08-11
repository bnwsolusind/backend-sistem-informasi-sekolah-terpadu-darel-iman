# Modal Standard Specification - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Standardized Enterprise Component (`Modal.jsx`, `dialog.jsx`)

---

## 1. Specifications & Breakpoints

In accordance with Enterprise UX Principle #12:
- **Desktop Max Width**: `1000px` (`max-w-4xl`) for Modal XL, `560px` (`max-w-lg`) for Confirmation/Popup.
- **Tablet Width**: `90vw` adaptive viewport width with centered alignment.
- **Mobile Width**: Converts into **Bottom Sheet** modal (`w-full rounded-t-[20px] rounded-b-none animate-in slide-in-from-bottom`).
- **Border Radius**: `20px` (`rounded-[20px]`).
- **Backdrop**: `fixed inset-0 bg-slate-950/60 backdrop-blur-xs`.

---

## 2. Anatomy of Standard Modal

1. **Sticky Header**:
   - Title text (`text-base font-extrabold text-slate-900 dark:text-white`).
   - Close Button (`X` Lucide icon, keyboard `ESC` listener).
   - Bottom border line (`border-b border-slate-100 dark:border-slate-800`).
2. **Scrollable Body**:
   - `max-h-[75vh] overflow-y-auto p-6`.
   - Structured form fieldsets and sections.
3. **Sticky Footer**:
   - `flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:bg-slate-800/40`.
   - Primary action button on right, Cancel button on left.

---

## 3. Accessibility & Key Handlers

- [x] **Escape Key Listener**: Pressing `ESC` triggers `onClose()`.
- [x] **Focus Ring**: Focus trapped within active modal dialog.
- [x] **Backdrop Click**: Clicking outside modal card triggers `onClose()`.
