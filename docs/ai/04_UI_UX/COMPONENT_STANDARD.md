# COMPONENT STANDARD

Komponen canonical global (SATU sumber). Bukti historis: `99_ARCHIVE/GLOBAL_COMPONENT_CANONICAL_MAP.md`, `99_ARCHIVE/GLOBAL_COMPONENT_INVENTORY.md`, `99_ARCHIVE/UI_COMPONENT_STANDARD.md`.

## Aturan

1. Semua halaman WAJIB memakai komponen dari barrel `src/components/app`.
2. DILARANG membuat komponen duplikat baru per halaman.
3. Adapter lama hanya jembatan sementara — visual mengikuti canonical.
4. Primitives `components/ui/` (button, card, modal, drawer, dialog, tabs, badge, skeleton, pagination, empty-state, dropdown, tooltip, input, accordion, table, fab) DIREUSE, bukan duplikat.

## Canonical Components

| Kategori | Canonical | File |
|---|---|---|
| Page layout | `AppPageLayout` | `app/AppPageLayout.jsx` |
| Breadcrumb | `AppBreadcrumb` | `app/AppBreadcrumb.jsx` |
| Page header | `AppPageHeader` | `app/AppPageHeader.jsx` |
| Container | `PageContainer` | `app/PageContainer.jsx` |
| Bottom nav | `AppBottomNavigation` | `app/AppBottomNavigation.jsx` |
| Toolbar | `AppToolbar` | `app/AppToolbar.jsx` |
| Search | `AppSearch` | `app/AppSearch.jsx` |
| Filter bar | `AppFilterBar` | `app/AppFilterBar.jsx` |
| Button | `AppButton` / `IconButton` | `app/AppButton.jsx` / `app/IconButton.jsx` |
| Dropdown aksi | `ActionDropdown` | `app/ActionDropdown.jsx` |
| Card | `AppCard` / `SectionCard` | `app/AppCard.jsx` |
| KPI card | `KpiCard` | `app/KpiCard.jsx` |
| Summary card | `SummaryCard` | `app/SummaryCard.jsx` |
| Table | `AppDataTable` | `app/AppDataTable.jsx` |
| Pagination | `AppPagination` | `app/AppPagination.jsx` |
| Modal / Drawer | `AppModal` / `AppDrawer` | `app/AppModal.jsx` / `app/AppDrawer.jsx` |
| Tabs | `AppTabs` | `app/AppTabs.jsx` |
| Badge | `AppBadge` | `app/AppBadge.jsx` |
| State | `AppEmptyState` / `AppErrorState` / `AppSkeleton` | `app/` |
| Dialogs | `ConfirmDialog` / `DeleteDialog` / `ExportDialog` / `ImportDialog` | `app/` |
| Toast | `ToastProvider` + `useToast` | `app/ToastProvider.jsx` |
| Notification | `NotificationCenter` | `app/NotificationCenter.jsx` |
| Identity | `PersonAvatar` / `PersonIdentityCell` | `ui/` (re-export barrel) |

## Banned Names (duplikat TIDAK BOLEH dibuat)

`DashboardHeader`, `GuruHeader`, `YayasanHeader`, `PortalHeader`, `MutabaahHeader`, `StudentTable`, `TeacherTable`, `EmployeeTable`, `ReportTable`, `DashboardCard`, `InfoCard`, `SummaryBox`, `TableSearch`, `SearchInput` custom per page, toast custom per page.

## Matriks Konsistensi (ringkas)

| Slot | Canonical | Duplikat yang harus migrasi |
|---|---|---|
| Header | `AppPageHeader` | `DashboardHeader` (adapter ✅), `MasterPageHeader` (adapter ✅), `ReportHeader`, `MutabaahPageHeader` |
| KPI/Stat | `app/KpiCard`, `app/SummaryCard` | `dashboard/KpiCard` (adapter ✅), `StatCard`, `MasterStatCard`, `MutabaahKpiCard` |
| Table | `AppDataTable` | `common/DataTable`, `MasterDataTable`, `DataTableCard`, `<table>` mentah (48 halaman) |
| Modal/Drawer | `AppModal`/`AppDrawer` | `MasterFormModal`/`MasterDetailModal`, `KpiQuickViewModal`, `KpiDetailDrawer` |
| Search/Filter | `AppSearch`/`AppFilterBar` | `MasterSearchInput` (adapter ✅), `MasterFilterBar`, `DashboardFilter` |
| Badge | `AppBadge` | `MasterBadge`, `MasterStatusBadge`, `MutabaahStatusBadge` |
| State | `App*State` | `dashboard/EmptyState`, `dashboard/ErrorState`, `MasterLoadingState`, dll |
| Toast | `useToast` | SweetAlert `Swal.fire` (39 halaman, migrasi bertahap) |

## Verifikasi Anti-Mock

Tidak ada mock KPI / fake chart / dummy array / static user. KPI berasal dari API Laravel → PostgreSQL.

## Referensi

- Tokens: `04_UI_UX/DESIGN_SYSTEM.md`
- Detail inventory: `99_ARCHIVE/GLOBAL_COMPONENT_INVENTORY.md`, `99_ARCHIVE/UI_COMPONENT_REUSE_MATRIX.md`, `99_ARCHIVE/UI_COMPONENT_CONSISTENCY_MATRIX.md`, `99_ARCHIVE/UI_COMPLETION_MATRIX.md`
