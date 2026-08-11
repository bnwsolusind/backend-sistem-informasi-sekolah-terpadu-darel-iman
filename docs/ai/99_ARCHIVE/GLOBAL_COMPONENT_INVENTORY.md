# GLOBAL COMPONENT INVENTORY

Sistem Manajemen Sekolah Terpadu — Audit komponen global frontend (`web-dashboard/src`).

Audit date: SESSION 15.95 (Prompt 1). Scope: `web-dashboard/src`. Backend tidak disentuh.

## Ringkasan

| Metrik | Nilai |
|---|---|
| Total halaman (`pages/*.jsx`) | 83 |
| Halaman memakai `<table>` mentah | 48 |
| Halaman memakai SweetAlert (`Swal`) | 39 (245 pemakaian) |
| Halaman memakai `common/DataTable` | 2 |
| Direktori komponen shared | `components/app`, `components/ui`, `components/dashboard`, `components/master-data`, `components/reports`, `components/mutabaah`, `components/common`, `components/crud`, `components/portal` |

## DUPLICATE COMPONENTS FOUND

### 1. Page Header

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `DashboardHeader` | `components/dashboard/DashboardHeader.jsx` | 14 | Header brand gradient dashboard role | `AppPageHeader` (brand) | ✅ adapter → `AppPageHeader variant="brand"` |
| `MasterPageHeader` | `components/master-data/index.jsx` | 31 | Header halaman master (brand/card) | `AppPageHeader` | ✅ adapter → `AppPageHeader` |
| `ReportHeader` | `components/reports/ReportHeader.jsx` | 6 | Header laporan | `AppPageHeader` | ⏳ migrasi modul (Prompt 2+) |
| `MutabaahPageHeader` | `components/mutabaah/MutabaahPageHeader.jsx` | 0 (tidak dipakai page) | Header mutabaah | `AppPageHeader` | ⏳ hapus setelah migrasi / jadikan adapter |

### 2. KPI / Stat / Summary Card

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `KpiCard` (dashboard) | `components/dashboard/KpiCard.jsx` | 14 | KPI card | `app/KpiCard` | ✅ adapter → `app/KpiCard` |
| `StatCard` | `components/StatCard.jsx` | 1 | KPI card superadmin (DashboardPage) | `app/KpiCard` | ✅ adapter → `app/KpiCard` |
| `MasterStatCard` | `components/master-data/index.jsx` | 144 pemakaian | Stat ringkas halaman master | `app/SummaryCard` | ✅ adapter → `app/SummaryCard` |
| `KpiCardGrid` | `components/dashboard/KpiCardGrid.jsx` | 14 | Grid KPI | CSS grid | ✅ dipakai; konsisten |
| `MutabaahKpiCard` | `components/mutabaah/MutabaahKpiCard.jsx` | 0 | KPI mutabaah | `app/KpiCard` | ⏳ migrasi modul |

### 3. Table

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `AppDataTable` | `components/app/AppDataTable.jsx` | canonical | Tabel standar (search/filter/pagination/state) | — | ✅ canonical |
| `DataTable` | `components/common/DataTable.jsx` | 2 | Tabel | `app/AppDataTable` | ⏳ migrasi |
| `MasterDataTable` | `components/master-data/index.jsx` | 32 | Card tabel master | `app/AppDataTable` | ⏳ migrasi |
| `DataTableCard` | `components/dashboard/DataTableCard.jsx` | 10 | Card tabel dashboard | `app/AppDataTable` | ⏳ migrasi |
| `<table>` mentah | 48 halaman | — | Tabel inline | `app/AppDataTable` | ⏳ migrasi bertahap |

### 4. Modal / Drawer / Dialog

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `AppModal` / `AppDrawer` | `components/app/` | canonical | Modal/drawer standar | — | ✅ canonical |
| `ui/modal`, `ui/drawer`, `ui/dialog` | `components/ui/` | primitives | Base shadcn-like | `AppModal`/`AppDrawer` | ✅ reuse (dipakai AppModal) |
| `MasterFormModal` / `MasterDetailModal` / `MasterDeleteDialog` | `components/master-data/index.jsx` | 24 | CRUD popup master | `AppModal`/`ConfirmDialog` | ⏳ migrasi |
| `KpiQuickViewModal` | `components/KpiQuickViewModal.jsx` | 10 | Quick view KPI | `AppModal` | ⏳ migrasi |
| `KpiDetailDrawer` | `components/KpiDetailDrawer.jsx` | 8 | Detail KPI drawer | `AppDrawer` | ⏳ migrasi |

### 5. Search / Filter / Toolbar

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `AppSearch` / `AppFilterBar` / `AppToolbar` | `components/app/` | canonical | Search/filter/toolbar | — | ✅ canonical |
| `MasterSearchInput` | `components/master-data/index.jsx` | 27 | Search master | `app/AppSearch` | ✅ adapter → `app/AppSearch` |
| `MasterFilterBar` | `components/master-data/index.jsx` | 27 | Filter master | `app/AppFilterBar` | ⏳ migrasi |
| `MasterFilterSelect` | `components/master-data/index.jsx` | 71 | Select filter | `ui/input`/select | ⏳ migrasi |
| `DashboardFilter` | `components/dashboard/DashboardFilter.jsx` | 13 | Filter dashboard | `app/AppFilterBar` | ⏳ migrasi |
| `GlobalSearchModal` | `components/GlobalSearchModal.jsx` | 1 | Global search | — | ✅ reuse (unik) |

### 6. Status / Badge

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `AppBadge` | `components/app/AppBadge.jsx` | canonical | Badge standar | — | ✅ canonical |
| `MasterBadge` / `MasterStatusBadge` | `components/master-data/index.jsx` | 55 | Badge status master | `app/AppBadge` | ⏳ migrasi |
| `MutabaahStatusBadge` | `components/mutabaah/` | 0 | Badge mutabaah | `app/AppBadge` | ⏳ migrasi |

### 7. State Komponen (Empty / Loading / Error)

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `AppEmptyState` / `AppErrorState` / `AppSkeleton` | `components/app/` | canonical | Empty/error/loading | — | ✅ canonical |
| `dashboard/EmptyState` | `components/dashboard/EmptyState.jsx` | 0 | Empty | `app/AppEmptyState` | ⏳ hapus |
| `dashboard/ErrorState` | `components/dashboard/ErrorState.jsx` | 14 | Error | `app/AppErrorState` | ⏳ migrasi |
| `dashboard/SkeletonDashboard` | `components/dashboard/SkeletonDashboard.jsx` | 14 | Skeleton | `app/AppSkeleton` | ⏳ migrasi |
| `MasterLoadingState` / `MasterEmptyState` / `MasterErrorState` | `components/master-data/index.jsx` | 65 | State master | `app/App*State` | ⏳ migrasi |
| `RouteErrorElement` / `ModalErrorBoundary` | `components/common/` | — | Error boundary | — | ✅ reuse (unik) |

### 8. Toast / Notification

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `ToastProvider` + `useToast` | `components/app/ToastProvider.jsx` | — (baru) | Toast global | — | ✅ canonical (baru dibuat) |
| `NotificationCenter` | `components/app/NotificationCenter.jsx` | 1 (DashboardLayout) | Bell + drawer notifikasi | — | ✅ canonical |
| SweetAlert (`Swal.fire`) | 39 halaman | 245 | Alert/toast | `useToast` + `ConfirmDialog` | ⏳ migrasi bertahap |

### 9. Identity

| COMPONENT | FILE | FILES USING | FUNCTION | DUPLICATE WITH | ACTION |
|---|---|---|---|---|---|
| `PersonAvatar` | `components/ui/PersonAvatar.jsx` | — | Avatar orang | — | ✅ canonical (re-export app) |
| `PersonIdentityCell` | `components/ui/PersonIdentityCell.jsx` | — | Avatar + nama + identifier | — | ✅ canonical (re-export app) |

### 10. KPI Detil / Tabel Data Dashboard Lain

`ChartCard` (9), `QuickActionCard` (8), `DetailModal` (1), `TrendIndicator` (0), `ActivityFeed` (0), `AlertPanel` (0), `PermissionGuard` (0) — sebagian tidak dipakai langsung oleh page. Kandidat migrasi/hapus di Prompt 2.

## MOCK / HARDCODE BUSINESS DATA

| Temuan | Status |
|---|---|
| `components/StatCard.jsx` — map ikon/warna per judul | ✅ presentasi, bukan data bisnis; tetap dijadikan adapter |
| `components/jabatan/JabatanImportModal.jsx:59` `sampleData` | ✅ template download import (fitur nyata, bukan data di layar) |
| Mock KPI / fake chart / dummy array / static user | ✅ TIDAK ADA |

Tidak ada data palsu yang ditambahkan. Semua KPI berasal dari API Laravel → PostgreSQL.
