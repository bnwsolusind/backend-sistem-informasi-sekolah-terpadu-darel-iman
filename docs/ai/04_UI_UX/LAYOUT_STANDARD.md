# LAYOUT STANDARD

Struktur layout global. Bukti historis: `99_ARCHIVE/GLOBAL_LAYOUT_STANDARD.md`, `99_ARCHIVE/UI_PAGE_LAYOUT_STANDARD.md`, `99_ARCHIVE/DASHBOARD_LAYOUT_RULEBOOK.md`.

## Struktur Dasar Halaman

```jsx
<AppPageLayout>
  <AppBreadcrumb />
  <AppPageHeader />
  <AppToolbar />
  ...konten...
</AppPageLayout>
```

Hierarki: Breadcrumb → Page Header → KPI Summary Grid → Filter Toolbar → Data Table/Card Grid → Pagination.

- `AppPageLayout`: wrapper `space-y-6 pb-12`; wajib semua halaman. DILARANG page wrapper berbeda per modul.
- `AppBreadcrumb`: Home icon otomatis (`/dashboard`); item terakhir tanpa `to` = halaman aktif.
- `AppPageHeader`: `variant` `brand` (gradient hijau, dashboard) | `card` (putih, master) | `default`. Props: icon, title, description, actions, chips, eyebrow. Role monitoring: aksi tak diizinkan tidak dirender.
- `PageContainer`: max `max-w-7xl`.
- Toolbar: Search | Filter | Active Filter Chips | Reset | Import (jika diizinkan) | Export | Refresh (bila perlu). Aksi utama di kanan; label ringkas + tooltip.

## Dashboard Layout (LOCKED)

Urutan tetap: **TOPBAR** → **HERO** (judul, subtitle, quick action, filter tahun/unit/semester) → **ROW 1 KPI** → **ROW 2 (3 card: ringkasan + 2 chart)** → **ROW 3 Widget** → **ROW 4 Table (2 kolom)** → **ROW 5 (Quick Action, Recent Activity, Notification, Calendar)** → **ROW 6 Data Table full width**.

| Row | Desktop | Laptop | Tablet | Mobile |
|---|---|---|---|---|
| KPI | 8 card | 4 | 2 | 1 |
| Row 2 | 3 kolom | 2 | 2 | 1 |
| Row 3 Widget | 3 kolom | 2 | 2 | 1 |
| Row 4 Table | 2 kolom | 2 | 1 | 1 |
| Row 5 | 4 kolom | 2 | 2 | 1 |
| Row 6 | full width | full | full | full |

JANGAN membuat layout dashboard baru, memindahkan hero/KPI/chart, atau mengubah ukuran card acak. Perbedaan antar role hanya data/widget/KPI/permission/quick action, bukan layout.

## Card & Widget Dashboard

- Card: `AppCard` (radius mengikuti template, padding/shadow/border konsisten).
- KPI Card: Icon → Title → Value → Trend → Mini Sparkline → Footer.
- Chart Card: Header (title/filter/action) → Body (chart) → Footer.
- Table Card: Header → Toolbar (search/filter/export) → `AppDataTable` → Footer (pagination).
- Quick Action: berupa card (grid desktop/tablet; horizontal scroll mobile), bukan floating button.
- Notification Card: 5 data terbaru + tombol "Lihat Semua".
- Recent Activity: timeline (avatar, status, jam).
- Profile: header (avatar, role, unit, status online).

## Bottom Navigation

Desktop/Laptop: tidak ada. **Tablet & Mobile: WAJIB.** Item per role:

| Role | Item |
|---|---|
| Umum | Beranda · Modul · [Aksi] · Notifikasi · Profil |
| Guru | Beranda · Jadwal · SCAN · Notifikasi · Profil |
| Siswa | Beranda · Jadwal · Tugas · Notifikasi · Profil |
| Orang Tua | Beranda · Anak · Aktivitas · Notifikasi · Profil |

## Dark Mode & Responsive

- Dark mode: layout IDENTIK, hanya warna berubah.
- Responsive: desktop 1920+, laptop 1366, tablet 768, smartphone 390.

## Referensi

- Komponen canonical: `04_UI_UX/COMPONENT_STANDARD.md`
- Navigasi: `04_UI_UX/NAVIGATION_STANDARD.md`
- Detail dashboard: `05_MODULE/DASHBOARD.md`, `99_ARCHIVE/DASHBOARD_LAYOUT_RULEBOOK.md`
