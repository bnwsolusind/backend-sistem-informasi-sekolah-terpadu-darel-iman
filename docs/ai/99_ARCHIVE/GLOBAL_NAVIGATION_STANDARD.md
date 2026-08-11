# GLOBAL NAVIGATION STANDARD

Sistem Manajemen Sekolah Terpadu — Standar navigasi.

## Sidebar (Desktop)

Parent menu punya ID unik (bukan boolean global):

```
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

## Sidebar Accordion (fixed di SESSION 15.9x)

- Memilih "Master Data" → hanya Master Data yang expand.
- Dashboard Yayasan tidak ikut turun.
- Direct URL membuka parent yang benar (`openSection` auto-expand via `useEffect` pada `location.pathname`).
- Browser back/forward mempertahankan active state (`normalizePath` + `isSubActive`).

Logika inti di `web-dashboard/src/layouts/DashboardLayout.jsx`:
- `normalizePath(to)` — strip query + trailing slash.
- `isSubActive(to, siblings)` — cocok exact path ATAU prefix leaf group tanpa menabrak sibling yang lebih dalam.
- Leaf active pakai exact path; submenu group aktif bila salah satu child-nya aktif.

## Topbar

Standar (tidak padat):
- Global Search (modal) — `GlobalSearchModal`
- Notification Bell — `NotificationCenter` (unread counter)
- Theme switcher (light/dark)
- User menu
- Current context bila diperlukan

## Notification Center

`<NotificationCenter />` — self-contained (fetch via `reportService.notifications` + `notificationUnreadCount`, polling 60s, filter kategori, mark-read/mark-all-read). Satu instance di `DashboardLayout` (bell + drawer). Dibuka via bell atau event `window` `open-notification-center` (dipakai bottom nav mobile).

## Responsive Navigation

| Perangkat | Perilaku |
|---|---|
| Desktop | Sidebar permanen |
| Laptop | Collapsible / mini sidebar |
| Tablet | Drawer navigation |
| Mobile | Bottom Navigation + Menu Drawer |

## AppBottomNavigation (Mobile <768px)

```jsx
<AppBottomNavigation
  items={[{ to, label, icon, end, show }]}   // NavLink berbasis route
  actionCenter={{ icon: Plus, onClick, ariaLabel }}  // tombol tengah
  onOpenNotifications={() => window.dispatchEvent(new Event('open-notification-center'))}
/>
```

Menu menyesuaikan role — visibility berdasarkan `hasRole`/`can` di pemanggil, TIDAK dihardcode di komponen.
Contoh dasar: Beranda · Aktivitas/Data · [Aksi] · Notifikasi · Profil.

## Chat Badge Foundation

`FloatingChatWidget` (portal) + `NotificationCenter` kategori `chat`. Unread badge siap memakai `notificationUnreadCount`. Online/last-seen/typing hanya ditampilkan bila source API tersedia — dilarang fake status.
