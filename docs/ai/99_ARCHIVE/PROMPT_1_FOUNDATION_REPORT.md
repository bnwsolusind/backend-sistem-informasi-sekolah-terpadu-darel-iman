# PROMPT 1 — GLOBAL FOUNDATION REPORT

Sistem Manajemen Sekolah Terpadu — Session 15.95, Prompt 1.
Refactor FONDASI GLOBAL UI/UX (non-breaking). Backend tidak diubah.

## Status

```
GLOBAL UI FOUNDATION PASSED — ENTERPRISE DESIGN SYSTEM & CANONICAL COMPONENTS READY
```

## Audit

```
COMPONENTS AUDITED:         24 kelompok (header, kpi, table, modal, search, filter,
                            badge, state, toast, identity, navigation)
DUPLICATE COMPONENTS FOUND: 17 (DashboardHeader, MasterPageHeader, ReportHeader,
                            dashboard/KpiCard, StatCard, MasterStatCard, StatCardGrid,
                            MasterDataTable, DataTable, DataTableCard, <table> mentah x48,
                            MasterSearchInput, MasterFilterBar, DashboardFilter, Swal x39,
                            dashboard/EmptyState/ErrorState/Skeleton, Mutabaah*)
CANONICAL COMPONENTS:       30 di src/components/app (barrel index.jsx)
```

## Canonical Components

```
PAGE LAYOUT:   AppPageLayout + AppBreadcrumb + PageContainer
PAGE HEADER:   AppPageHeader (brand | card | default)
TOOLBAR:       AppToolbar + AppFilterBar + AppSearch
BUTTON:        AppButton (+ IconButton) — 8 variant, loading, focus, disabled
CARD:          AppCard / SectionCard
KPI:           KpiCard (icon, value, trend, badge, sparkline, drilldown)
TABLE:         AppDataTable (search, filter, pagination, sort, state, sticky, responsive)
MODAL:         AppModal
DRAWER:        AppDrawer (right/left/bottom)
BADGE:         AppBadge
SEARCH:        AppSearch
FILTER:        AppFilterBar
EMPTY:         AppEmptyState
LOADING:       AppSkeleton
ERROR:         AppErrorState
TOAST:         ToastProvider + useToast (dipasang di App.jsx)
CONFIRM:       ConfirmDialog / DeleteDialog / ExportDialog / ImportDialog
TABS:          AppTabs
BOTTOM NAV:    AppBottomNavigation
NOTIFICATION:  NotificationCenter (bell + drawer, polling 60s, kategori)
```

## Sidebar / Route Active

```
SIDEBAR ROOT CAUSE FOUND:  parent aktif memakai pathname.startsWith('/dashboard')
                          sehingga Yayasan ikut aktif saat di Master Data;
                          accordion tidak otomatis membuka parent saat direct URL.
SIDEBAR FIXED:             normalizePath() + isSubActive(to, siblings) — match spesifik
                          per group route; single openSection auto-expand pada
                          location.pathname; leaf aktif = exact path.
ROUTE ACTIVE FIXED:        ya — Yayasan vs Master Data tidak bentrok;
                          back/forward mempertahankan state.
```

## Topbar / Notification / Chat

```
TOPBAR:              Global Search (GlobalSearchModal) + NotificationCenter + theme + user
NOTIFICATION FOUNDATION: NotificationCenter self-contained; 1 instance; kategori CRUD,
                     Approval, Chat, Absensi, Akademik, LMS, Tahfizh, Mutabaah,
                     Pengumuman, System; open via window event; empty state bila kosong.
CHAT BADGE FOUNDATION: kategori 'chat' di NotificationCenter + FloatingChatWidget;
                     unread badge dari notificationUnreadCount; online/typing hanya
                     bila source API tersedia (tidak ada fake status).
```

## Responsive

```
DESKTOP:  Sidebar permanen, grid KPI 4-6 kolom
LAPTOP:   Collapsible/mini sidebar, 3-4 kolom
TABLET:   Drawer navigasi, 2 kolom, modal 90-94vw
MOBILE:   AppBottomNavigation (md:hidden) + menu drawer, 1-2 kolom, bottom sheet
```

## Data Rule

```
MOCK FOUND:                    0 (hanya template import JabatanImportModal, fitur nyata)
HARDCODE BUSINESS DATA FOUND:  0 (map ikon/warna StatCard = presentasi, bukan data bisnis)
```

## Quality

```
FRONTEND LINT:  PASS (0 error; 492 warning pre-existing, bukan dari prompt ini)
FRONTEND BUILD: PASS (vite build ✓)
BROWSER:        /masuk boot OK, 0 console error, 0 request failed
                (halaman ber-auth tidak bisa di-test headless — kredensial dokumen
                 ditolak backend lokal 401)
```

## Files Changed (session ini)

Dibuat baru:
```
web-dashboard/src/components/app/AppCard.jsx          (+ SectionCard)
web-dashboard/src/components/app/AppTabs.jsx
web-dashboard/src/components/app/AppBreadcrumb.jsx
web-dashboard/src/components/app/IconButton.jsx
web-dashboard/src/components/app/ToastProvider.jsx    (+ useToast)
web-dashboard/src/components/app/AppBottomNavigation.jsx
docs/ai/GLOBAL_COMPONENT_INVENTORY.md
docs/ai/GLOBAL_COMPONENT_CANONICAL_MAP.md
docs/ai/ENTERPRISE_DESIGN_SYSTEM_V2.md
docs/ai/GLOBAL_LAYOUT_STANDARD.md
docs/ai/GLOBAL_BUTTON_STANDARD.md
docs/ai/GLOBAL_CARD_STANDARD.md
docs/ai/GLOBAL_TABLE_STANDARD.md
docs/ai/GLOBAL_MODAL_DRAWER_STANDARD.md
docs/ai/GLOBAL_RESPONSIVE_STANDARD.md
docs/ai/GLOBAL_NAVIGATION_STANDARD.md
docs/ai/PROMPT_1_FOUNDATION_REPORT.md
```

Diubah (adapter/migrasi foundation):
```
web-dashboard/src/App.jsx                               (mount ToastProvider)
web-dashboard/src/components/app/index.jsx              (barrel + export baru)
web-dashboard/src/components/app/AppPageLayout.jsx      (AppBreadcrumb)
web-dashboard/src/components/app/KpiCard.jsx            (sparkline, subtitle)
web-dashboard/src/components/app/SummaryCard.jsx        (colorScheme)
web-dashboard/src/layouts/DashboardLayout.jsx           (bottom nav → AppBottomNavigation,
                                                         NotificationCenter tunggal,
                                                         sidebar fix)
web-dashboard/src/components/StatCard.jsx               (adapter → KpiCard)
web-dashboard/src/components/dashboard/DashboardHeader.jsx  (adapter → AppPageHeader brand)
web-dashboard/src/components/dashboard/KpiCard.jsx      (adapter → app KpiCard)
web-dashboard/src/components/master-data/index.jsx      (MasterPageHeader → AppPageHeader,
                                                         MasterStatCard → SummaryCard,
                                                         MasterSearchInput → AppSearch)
```

## Duplicates

```
DUPLICATES REMOVED:     0 file dihapus (semua adapter non-breaking; penghapusan
                        menunggu migrasi reference selesai di Prompt 2+)
DUPLICATES REMAINING:   ReportHeader (6), MasterDataTable (32), MasterFilterBar (27),
                        DataTableCard (10), dashboard/ErrorState (14),
                        dashboard/SkeletonDashboard (14), Swal (39 halaman),
                        <table> mentah (48 halaman), Mutabaah* (0 usage),
                        dashboard/EmptyState (0 usage) — migrasi per modul di Prompt 2+
```

## Remaining Foundation Issues

1. Migrasi per modul (Prompt 2 dst): ReportHeader, MasterDataTable/FilterBar, DataTableCard, dashboard ErrorState/Skeleton, 48 tabel mentah.
2. Migrasi SweetAlert (245 pemakaian) → `useToast` + `ConfirmDialog` bertahap.
3. `DashboardPage` superadmin belum 100% memakai AppPageLayout (masih `components/StatCard` adapter — visual sudah canonical).
4. Hapus komponen mati (`dashboard/EmptyState`, `MutabaahPageHeader/KpiCard/StatusBadge`) setelah semua reference aman.
5. E2E lint: 492 warning pre-existing (exhaustive-deps, unused imports) — cleanup bertahap di luar scope Prompt 1.

## Kesimpulan

Fondasi global stabil: satu design system, satu component system, satu layout system,
sidebar tidak bentrok, canonical siap dipakai. Silakan lanjut ke PROMPT 2.
