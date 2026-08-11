# Button Standard Specification - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Standardized Core Component (`Button.jsx`)

---

## 1. Enterprise Design System Tokens

- **Primary Color**: `#0E5C44` (Sims Primary Green)
- **Secondary Color**: `#1E8E5A` (Sims Forest Green)
- **Accent Color**: `#3FBF75` (Sims Emerald Accent)
- **Danger Color**: `#DC2626` / `#E11D48` (Rose/Red Destructive)
- **Border Radius**: `12px` (`rounded-xl` for default/sm), `16px` (`rounded-2xl` for lg)
- **Typography**: Inter Font (`font-bold`, `font-black`)

---

## 2. Standard Button Variants & Usages

| Variant | Tailwind Styles | Primary Usage | Interactive States |
|---|---|---|---|
| **Primary** | `bg-[#0E5C44] text-white hover:bg-[#1E8E5A] shadow-md dark:bg-[#0E5C44]` | Main page actions, Save forms, Submit buttons | Scale `1.03` hover, translate `-0.5px`, glow shadow |
| **Secondary** | `bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-[#0E5C44]/30 dark:bg-[#111827]` | Secondary triggers, Filter buttons, Cancel forms | Scale `1.03` hover, soft border hover |
| **Ghost** | `text-slate-600 hover:bg-[#0E5C44]/10 hover:text-[#0E5C44] dark:text-slate-400 dark:hover:bg-[#3FBF75]/20` | Table row actions, Inline triggers, Header icons | Gentle highlight tint on hover |
| **Outline** | `border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 dark:border-slate-800` | Secondary page actions, Filter toggles | Subtle background shift on hover |
| **Danger** | `bg-rose-600 text-white hover:bg-rose-700 shadow-md` | Delete confirmation, Reject approval, Revoke permission | Destructive rose highlight on hover |
| **Success** | `bg-[#1E8E5A] text-white hover:bg-[#0E5C44] shadow-md` | Approve workflow, Complete step, Verify status | Emerald green highlight on hover |
| **Icon Left** | `inline-flex items-center gap-2` + Lucide icon on left | Standard action button with contextual visual cue | Standard variant states |
| **Icon Right** | `inline-flex items-center gap-2` + Lucide icon on right | Next step button, Download trigger, External link | Standard variant states |

---

## 3. Standard Button Sizes

| Size Token | Height (`h-*`) | Padding (`px-* py-*`) | Font Size | Border Radius |
|---|---|---|---|---|
| **sm** | `h-8` (32px) | `px-3 py-1` | `text-xs font-bold` | `rounded-lg` (8px) |
| **default** | `h-10` (40px) | `px-4 py-2` | `text-xs md:text-sm font-bold` | `rounded-xl` (12px) |
| **lg** | `h-12` (48px) | `px-6 py-3` | `text-base font-black` | `rounded-2xl` (16px) |
| **icon** | `h-9 w-9` (36px x 36px) | `p-0` | Icon size 16px | `rounded-xl` (12px) |

---

## 4. State Rules

1. **Loading State**: Displays standard Lucide `Loader2` spinner with `animate-spin`, disables pointer events (`pointer-events-none opacity-70`).
2. **Disabled State**: Applies `opacity-50 pointer-events-none cursor-not-allowed`.
3. **No Arbitrary Sizes**: All buttons in the application utilize the standard `<Button variant="..." size="...">` component.
