# GLOBAL LAYOUT STANDARD

Sistem Manajemen Sekolah Terpadu — Struktur layout global.

## Struktur Dasar Halaman

```jsx
<AppPageLayout>
  <AppBreadcrumb />
  <AppPageHeader />
  <AppToolbar />
  ...konten...
</AppPageLayout>
```

## Components

### `<AppPageLayout />`
- Wrapper halaman: `space-y-6 pb-12`.
- Props: `breadcrumb` (array `{label, to?}` atau string), `breadcrumbLabel`, `hideBreadcrumb`, `className`.
- Wajib dipakai semua halaman. DILARANG membuat page wrapper berbeda per modul.

### `<AppBreadcrumb />`
- Home icon otomatis (`/dashboard`).
- Item terakhir (tanpa `to`) = halaman aktif.
- Props: `items`, `homeTo`, `className`.

### `<AppPageHeader />`
- `variant`: `brand` (gradient hijau, dashboard role) | `card` (putih, halaman master) | `default` (ringan).
- Props: `icon`, `title`, `description`, `actions`, `chips`, `eyebrow`, `className`.
- Role monitoring: action yang tidak diizinkan tidak dirender (guard di halaman pemanggil).

### `<PageContainer />`
- Maksimal `max-w-7xl`.

## Toolbar

```jsx
<AppToolbar>
  <AppSearch />
  <AppFilterBar>...</AppFilterBar>
</AppToolbar>
```

Standard: Search | Filter | Active Filter Chips | Reset | Import (jika diizinkan) | Export (jika diizinkan) | Refresh (hanya bila dibutuhkan). Aksi utama di kanan. Label ringkas + tooltip untuk penjelasan panjang.

## Responsive Layout

| Breakpoint | Perilaku |
|---|---|
| Desktop (≥1024) | Sidebar permanen, konten padding 24–32px |
| Laptop (1024–1279) | Sidebar collapsible/mini |
| Tablet (768–1023) | Drawer navigasi |
| Mobile (<768) | Bottom navigation + menu drawer, padding 16px |

## Aturan

- Tidak ada card berhimpitan (gap 16–24px).
- Tidak ada horizontal page scroll tak terduga.
- Dark mode: layout identik.
