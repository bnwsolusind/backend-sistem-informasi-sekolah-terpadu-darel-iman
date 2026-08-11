# GLOBAL COMPONENT CANONICAL MAP

Sistem Manajemen Sekolah Terpadu — Peta komponen canonical (SATU sumber).

Semua komponen global hidup di `web-dashboard/src/components/app/` dan di-export ulang lewat barrel `src/components/app/index.jsx`.

## Aturan

1. Semua halaman WAJIB memakai komponen dari barrel `src/components/app`.
2. DILARANG membuat komponen duplikat baru (Header/Table/Card/Modal/Search/Badge per halaman).
3. Adapter lama hanya jembatan sementara — visual mengikuti canonical.

## Canonical Components

| Kategori | Canonical | File | Delegasi / Adapter existing |
|---|---|---|---|
| Page layout | `AppPageLayout` | `app/AppPageLayout.jsx` | — |
| Breadcrumb | `AppBreadcrumb` | `app/AppBreadcrumb.jsx` | dipakai `AppPageLayout` |
| Page header | `AppPageHeader` | `app/AppPageHeader.jsx` | `DashboardHeader`, `MasterPageHeader` |
| Container | `PageContainer` | `app/PageContainer.jsx` | — |
| Bottom nav | `AppBottomNavigation` | `app/AppBottomNavigation.jsx` | bottom nav `DashboardLayout` |
| Toolbar | `AppToolbar` | `app/AppToolbar.jsx` | — |
| Search | `AppSearch` | `app/AppSearch.jsx` | `MasterSearchInput` |
| Filter bar | `AppFilterBar` | `app/AppFilterBar.jsx` | — |
| Button | `AppButton` | `app/AppButton.jsx` | — |
| Icon button | `IconButton` | `app/IconButton.jsx` | — |
| Dropdown aksi | `ActionDropdown` | `app/ActionDropdown.jsx` | — |
| Card | `AppCard` / `SectionCard` | `app/AppCard.jsx` | — |
| KPI card | `KpiCard` | `app/KpiCard.jsx` | `dashboard/KpiCard`, `components/StatCard` |
| Summary card | `SummaryCard` | `app/SummaryCard.jsx` | `MasterStatCard` |
| Table | `AppDataTable` | `app/AppDataTable.jsx` | — |
| Pagination | `AppPagination` | `app/AppPagination.jsx` | — |
| Modal | `AppModal` | `app/AppModal.jsx` | — |
| Drawer | `AppDrawer` | `app/AppDrawer.jsx` | — |
| Tabs | `AppTabs` | `app/AppTabs.jsx` | — |
| Badge | `AppBadge` | `app/AppBadge.jsx` | — |
| Empty state | `AppEmptyState` | `app/AppEmptyState.jsx` | — |
| Error state | `AppErrorState` | `app/AppErrorState.jsx` | — |
| Skeleton | `AppSkeleton` | `app/AppSkeleton.jsx` | — |
| Confirm dialog | `ConfirmDialog` | `app/ConfirmDialog.jsx` | — |
| Delete dialog | `DeleteDialog` | `app/DeleteDialog.jsx` | — |
| Export dialog | `ExportDialog` | `app/ExportDialog.jsx` | — |
| Import dialog | `ImportDialog` | `app/ImportDialog.jsx` | — |
| Toast | `ToastProvider` + `useToast` | `app/ToastProvider.jsx` | — |
| Notification center | `NotificationCenter` | `app/NotificationCenter.jsx` | — |
| Avatar | `PersonAvatar` | `ui/PersonAvatar.jsx` | re-export barrel |
| Identity cell | `PersonIdentityCell` | `ui/PersonIdentityCell.jsx` | re-export barrel |

## Primitives (`components/ui/`) yang DIREUSE (bukan duplikat)

`button`, `card`, `modal`, `drawer`, `dialog`, `tabs`, `badge`, `skeleton`, `pagination`, `empty-state`, `dropdown`, `tooltip`, `input`, `accordion`, `table`, `fab` — base primitives yang dipakai canonical components.

## Strategy Migrasi

1. ✅ Inventory (GLOBAL_COMPONENT_INVENTORY.md)
2. ✅ Canonical ditentukan & dibangun (`components/app`)
3. ✅ Canonical diperbaiki (KpiCard sparkline/subtitle, SummaryCard colorScheme, dll)
4. ✅ Shared layout dimigrasi (`DashboardLayout` sidebar/topbar/notification/bottom-nav)
5. ✅ Header/KPI/Stat card diadaptasi (DashboardHeader, MasterPageHeader, StatCard, MasterStatCard)
6. ⏳ Shared card/button/table/modal per modul (Prompt 2+): `ReportHeader`, `MasterDataTable`, `MasterFilterBar`, `DataTableCard`, `Swal` → `useToast`/`ConfirmDialog`
7. ⏳ Hapus duplikat yang tidak terpakai setelah semua reference aman

## Banned Names (duplikat TIDAK BOLEH dibuat lagi)

`DashboardHeader`, `GuruHeader`, `YayasanHeader`, `PortalHeader`, `MutabaahHeader`, `StudentTable`, `TeacherTable`, `EmployeeTable`, `ReportTable`, `DashboardCard`, `InfoCard`, `SummaryBox`, `TableSearch`, `SearchInput` custom per page, toast custom per page.
