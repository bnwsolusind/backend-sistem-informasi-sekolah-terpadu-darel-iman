# NAVIGATION STANDARD

Standar navigasi. Bukti historis: `99_ARCHIVE/GLOBAL_NAVIGATION_STANDARD.md`, `99_ARCHIVE/academic-lms-menu-refactor.md`.

## Sidebar (Desktop)

Parent menu punya ID unik (bukan boolean global):

```text
dashboard
yayasan
master-data
akademik
portal-guru
portal-musyrif
absensi
tahfizh
mutabaah
rekap-data
pengaturan
```

Route group matching spesifik:
- Yayasan: `pathname === '/dashboard/yayasan'` ATAU `pathname.startsWith('/dashboard/yayasan/')`.
- DILARANG `pathname.startsWith('/dashboard')` untuk parent Yayasan.

## Sidebar Accordion

- Memilih "Master Data" → hanya Master Data yang expand; Dashboard Yayasan tidak ikut turun.
- Direct URL membuka parent yang benar (`openSection` auto-expand via `useEffect` pada `location.pathname`).
- Back/forward mempertahankan active state (`normalizePath` + `isSubActive`).
- Logika inti di `web-dashboard/src/layouts/DashboardLayout.jsx`:
  - `normalizePath(to)` — strip query + trailing slash.
  - `isSubActive(to, siblings)` — exact path ATAU prefix leaf group tanpa menabrak sibling lebih dalam.
  - Leaf active exact path; submenu group aktif bila salah satu child aktif.

## Topbar

Standar (tidak padat): Global Search (modal `GlobalSearchModal`) · Notification Bell (`NotificationCenter`, unread counter) · Theme switcher (light/dark) · User menu · Current context bila diperlukan.

## Notification Center

`<NotificationCenter />` self-contained: fetch `reportService.notifications` + `notificationUnreadCount`, polling 60s, filter kategori, mark-read/mark-all-read. Satu instance di `DashboardLayout` (bell + drawer); dibuka via bell atau event `window` `open-notification-center` (dipakai bottom nav mobile).

## Responsive Navigation

| Perangkat | Perilaku |
|---|---|
| Desktop (≥1024) | Sidebar permanen |
| Laptop | Collapsible / mini sidebar |
| Tablet | Drawer navigasi |
| Mobile (<768) | Bottom Navigation + Menu Drawer |

## AppBottomNavigation (Mobile <768px)

```jsx
<AppBottomNavigation
  items={[{ to, label, icon, end, show }]}
  actionCenter={{ icon: Plus, onClick, ariaLabel }}
  onOpenNotifications={() => window.dispatchEvent(new Event('open-notification-center'))}
/>
```

Menu menyesuaikan role — visibility berdasarkan `hasRole`/`can` di pemanggil, TIDAK dihardcode di komponen.

## Chat Badge Foundation

`FloatingChatWidget` (portal) + `NotificationCenter` kategori `chat`. Unread badge memakai `notificationUnreadCount`. Online/last-seen/typing hanya ditampilkan bila source API tersedia — dilarang fake status.

## Referensi

- Layout: `04_UI_UX/LAYOUT_STANDARD.md`
- Menu container akademik: `01_PROJECT/MODULE_MAP.md`
- Detail: `99_ARCHIVE/GLOBAL_NAVIGATION_STANDARD.md`, `99_ARCHIVE/academic-lms-menu-refactor.md`, `99_ARCHIVE/MENU_ROUTE_PAGE_MAP.md`
