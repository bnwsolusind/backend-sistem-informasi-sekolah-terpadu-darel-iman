# MODAL & DRAWER SPECIFICATION STANDARD — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Usage rules, radii, backdrops, and mobile behaviors for overlay modals and side drawers.

---

## 1. OVERLAY COMPONENT DIRECTIVES

| COMPONENT | OVERLAY TYPE | BORDER RADIUS | USE CASE | ANIMATION |
|---|---|---|---|---|
| Modal (`<Modal />`) | Centered Dialog | `rounded-[20px]` | Confirmations, small forms, quick view detail | Fade Scale (`0.25s`) |
| Drawer (`<Drawer />`) | Side Panel Overlay | `rounded-l-[20px]` (right) / `rounded-t-[20px]` (bottom) | Long CRUD forms, drill-down list, builder UI | Slide In (`0.3s`) |

---

## 2. MANDATORY OVERLAY FEATURES

1. **Backdrop Blur**: `bg-slate-950/60 backdrop-blur-xs` overlay prevents background distractions.
2. **Scroll Isolation**: Body scroll locks when modal/drawer is open (`max-h-[75vh] overflow-y-auto` for content body).
3. **Sticky Action Footer**: Action buttons stay fixed at bottom of modal/drawer container.
