# UI COMPONENT REUSE MATRIX — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Reuse matrix mapping primary UI components to active pages across system modules.

---

## 1. COMPONENT REUSE MAPPING MATRIX

| COMPONENT | COMPONENT SOURCE FILE | USAGE IN MASTER DATA | USAGE IN YAYASAN / REPORTS | USAGE IN LMS & PORTALS | REUSE RATIO |
|---|---|---|---|---|---|
| MasterPageHeader | `components/master-data/index.jsx` | 13 Pages | 8 Report Pages | 6 LMS Pages | 27 Pages |
| PersonAvatar | `components/ui/PersonAvatar.jsx` | Employees, Students, Parents | Foundation Reports, SDM Detail | LMS Submissions, Portals, Tahfizh | 35 Pages |
| PersonIdentityCell | `components/ui/PersonIdentityCell.jsx` | Employees, Students | SDM & Student Reports | Portals & Tahfizh Lists | 24 Pages |
| DataTable | `components/common/DataTable.jsx` | 13 Master Pages | All Table Reports | LMS Material/Assignment Lists | 25 Pages |
| KpiDetailDrawer | `components/KpiDetailDrawer.jsx` | Dashboard Stats | Executive Reports | LMS & Attendance Analytics | 18 Pages |
| Modal | `components/ui/modal.jsx` | CRUD Create/Edit Modals | Report Drill-down Detail | Quiz & Task Submissions | 40 Pages |
| Drawer | `components/ui/drawer.jsx` | Complex Form Entry | Filter Drawers | Mutaba'ah & Tahfizh Detail | 22 Pages |
| Badge | `components/ui/badge.jsx` | All Status Tables | Report Summary Badges | LMS & CBT Status Pill | All Pages |
| EmptyState | `components/ui/empty-state.jsx` | Empty Data Tables | Filter Empty Fallbacks | Portal Activity Fallback | 30 Pages |
| RouteErrorElement | `components/common/RouteErrorElement.jsx` | Error Boundary | Report Error Boundary | System Global Error Boundary | All Routes |

---

## 2. CONSOLIDATION BENEFITS

Centralized UI component usage eliminates duplicate code blocks, enforces single-point maintenance, and ensures visual consistency when design system tokens are updated.
