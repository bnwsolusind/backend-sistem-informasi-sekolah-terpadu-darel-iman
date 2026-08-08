# PAGE LAYOUT & HIERARCHY STANDARD — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Page structure and layout hierarchy standards across Master Data, Executive, LMS, and Portal pages.

---

## 1. STANDARD PAGE LAYOUT STRUCTURE

Every management and reporting page follows a unified vertical layout hierarchy:

$$\text{Breadcrumb Navigation} \longrightarrow \text{Page Header} \longrightarrow \text{KPI Summary Grid} \longrightarrow \text{Filter Toolbar} \longrightarrow \text{Data Table / Card Grid} \longrightarrow \text{Pagination Controls}$$

```text
+-----------------------------------------------------------------------+
| Home > Master Data > Data Siswa                                       |
+-----------------------------------------------------------------------+
| [Icon] Data Siswa                                                     |
| Kelola data siswa pada unit dan periode aktif.                       |
| [Import XLSX] [Export XLSX] [+ Tambah Siswa]                          |
+-----------------------------------------------------------------------+
| [KPI 1: Total Siswa]  [KPI 2: Aktif]  [KPI 3: Mutasi]  [KPI 4: Alumni] |
+-----------------------------------------------------------------------+
| [Search...] | Unit Filter v | Status v | Active Chips: [SDIT x]       |
+-----------------------------------------------------------------------+
| TABLE DATA (PersonIdentityCell, Badges, Row Actions)                  |
+-----------------------------------------------------------------------+
| Showing 1-10 of 320 items                            < 1 2 3 ... 32 > |
+-----------------------------------------------------------------------+
```

---

## 2. MODULE LAYOUT ALIGNMENT

- **Master Data Pages**: Use `MasterDataPage` container with auto breadcrumbs.
- **Executive Dashboard**: Use `FoundationDashboardPage` grid container with high-impact metric cards.
- **Portal Pages**: Use `ParentPortalPage` / `StudentPortalPage` bottom navigation responsive containers.
