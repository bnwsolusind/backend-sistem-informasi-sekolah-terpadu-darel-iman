# RESPONSIVE BREAKPOINT STANDARD — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Viewport breakpoints, mobile sidebar collapse, grid adaptation, and mobile table behaviors.

---

## 1. TARGET VIEWPORT BREAKPOINTS

| BREAKPOINT ALIAS | VIEWPORT WIDTH | TARGET DEVICE | LAYOUT ADAPTATION |
|---|---|---|---|
| Mobile Small | `360px` | Small Smartphones (Galaxy S8) | Sidebar overlay, 2-col KPI grid, full-screen modals, horizontal scroll table |
| Mobile Medium | `390px` | Modern Smartphones (iPhone 14) | Sidebar overlay, 2-col KPI grid, stacked form controls |
| Tablet Portrait | `768px` | iPads & Tablets | Collapsible sidebar toggle, 2-col to 3-col KPI cards |
| Tablet Landscape / Laptop | `1024px` | Laptops (MacBook Air) | Persistent sidebar, full grid dashboard, inline filter bars |
| Desktop Large | `1440px` | Large Monitors / Displays | Max-width content wrapper, full 4-col KPI cards, multi-pane drawers |

---

## 2. MOBILE OVERFLOW PREVENTION

- Main layout container enforces `overflow-x-hidden`.
- Tables isolate horizontal scrolling inside `.overflow-x-auto` wrapper containers.
- Action buttons in mobile cards wrap into flex containers without breaking boundary walls.
