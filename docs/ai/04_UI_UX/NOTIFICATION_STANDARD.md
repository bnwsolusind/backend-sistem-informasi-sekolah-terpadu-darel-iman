# NOTIFICATION STANDARD

Standar notifikasi & realtime. Bukti historis: `99_ARCHIVE/NOTIFICATION_STANDARD.md`, `99_ARCHIVE/NOTIFICATION_SOURCE_OF_TRUTH.md`.

## Canonical

- `<NotificationCenter />` — bell + drawer notifikasi (self-contained, polling 60s).
- `<ToastProvider />` + `useToast()` — feedback inline (success/error/info/warning).
- `<AppBadge />` — unread counter di bell/bottom nav.

## Bell & Drawer

```
Bell icon ──► Drawer (right, mobile: bottom sheet)
  [unread badge]
  ┌──────────────┐
  │ Search + Filter (semua/chat/absensi/mutabaah/tahfizh/pelanggaran) │
  │ Mark all read · Clear all (jika diizinkan)                         │
  ├──────────────┤
  │ [avatar] Judul                  [icon status] │
  │ Pesan singkat                               │
  │ waktu · relatif                            │
  ├──────────────┤
  │ Lihat Semua → /dashboard/notifications      │
  └──────────────┘
```

## Behavior

- Unread badge dari `notificationUnreadCount`; polling 60s.
- Mark read: klik item / mark-all-read; state sinkron dengan backend.
- Filter kategori sesuai data kategori notifikasi.
- Loading skeleton, empty state, error state wajib.
- Klik item → navigasi target jika ada `link`.

## Toast Feedback (Feedback Layer)

| Jenis | Warna | Ikon |
|---|---|---|
| success | Emerald | CheckCircle |
| error | Rose | XCircle |
| info | Sky | Info |
| warning | Amber | AlertTriangle |

Toast singkat (3–5s), auto-dismiss, posisi top-right (desktop) / bottom sheet (mobile), keyboard accessible.

## Event & Integrasi

- `open-notification-center` CustomEvent dipakai bottom nav mobile (dari `AppBottomNavigation`).
- Integrasi `FloatingChatWidget` via kategori `chat`.

## Referensi

- Detail sumber: `99_ARCHIVE/NOTIFICATION_STANDARD.md`, `99_ARCHIVE/NOTIFICATION_SOURCE_OF_TRUTH.md`, `99_ARCHIVE/NOTIFICATION_ICON_STATUS_MAPPING.md`
- API notifikasi: `06_API/API_CONTRACT.md`
