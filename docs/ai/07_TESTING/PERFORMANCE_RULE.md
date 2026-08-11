# PERFORMANCE RULE

Aturan performa backend & frontend. Bukti historis: `99_ARCHIVE/SESSION_16_FINAL_REPORT.md`, `99_ARCHIVE/REPORT_PERFORMANCE_AUDIT.md`, `99_ARCHIVE/DASHBOARD_CACHE_INVALIDATION_MAP.md`.

## Backend

- **Eager Loading**: wajib memakai `with()` untuk relasi yang ditampilkan; report terakhir menyatakan 100% dan zero N+1 pattern.
- **Index**: foreign keys, `unit_id`, `school_year_id`, status & soft-delete ter-index.
- **Period filter**: semua query akademik memfilter `academic_year_id` + `semester_id` aktif.
- **Soft delete**: `whereNull('deleted_at')` global (laporan & list).
- Query besar (laporan lintas unit) memakai service aggregation (`CrossUnitReportService` dll), bukan loop query di controller.

## Frontend

- **TanStack Query**: `staleTime` + `gcTime` dikonfigurasi; cache invalidation terpetakan (`DASHBOARD_CACHE_INVALIDATION_MAP.md`).
- **Code splitting**: lazy route components + vendor chunks terpisah (react, query, chart, form, misc).
- **Bundle**: report terakhir menyatakan build PASSED 2.46s, 3.248 modules, output `dist/assets/`.
- Chart: ApexCharts (lazy-loaded; tidak menunda first paint).

## Target Audit

- Report terakhir mencatat 682 route API / 142 controller-service ter-audit eager loading 100%.
- Report terakhir mencatat 85 halaman / 311 komponen frontend; 0 lint errors; build bersih.

## Referensi

- Detail arsip: `99_ARCHIVE/SESSION_16_FINAL_REPORT.md`, `99_ARCHIVE/REPORT_PERFORMANCE_AUDIT.md`, `99_ARCHIVE/DASHBOARD_CACHE_INVALIDATION_MAP.md`
