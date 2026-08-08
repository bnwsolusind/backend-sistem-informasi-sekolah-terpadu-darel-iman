# NOTIFICATION — API CONTRACT (SESI 12)

Kontrak API notifikasi lintas kanal. Seluruh endpoint membaca via
`Notification::userQuery(userId, filters)` dan selalu **self-scoped** (`byUser`).

## 1. Dashboard / Staff (`/api/notifications`, `auth:sanctum`)

| Metode | Path | Aksi |
|---|---|---|
| GET | `/api/notifications` | Daftar notifikasi user (search/type/is_read/per_page 1–100, default 20; urut `latest`) |
| GET | `/api/notifications/unread-count` | `{ status, unread_count }` (dari DB: `read_at IS NULL`) |
| POST | `/api/notifications/{id}/read` | Tandai satu (owner-only; user lain → 404) |
| POST | `/api/notifications/mark-all-read` | Tandai semua milik user (`byUser()->unread()->update`) |
| GET | `/api/foundation/notifications` | Alias Yayasan → `NotificationController::index` |
| GET | `/api/foundation/notifications/unread-count` | Alias Yayasan |
| POST | `/api/foundation/notifications/read-all` | Alias Yayasan → `markAllRead` |
| POST | `/api/foundation/notifications/{id}/read` | Alias Yayasan → `markAsRead` |

## 2. Portal Guru (`/api/teacher/notifications`, role staf)

GET `/api/teacher/notifications` → `TeacherPortalController::notifications`
(`userQuery($request->user()->id, ...)`, paginate 20).

## 3. Portal Orang Tua / Siswa (`/api/portal/notifications`, role Orang Tua|Siswa)

GET `/api/portal/notifications` → `StudentParentPortalController::notifications`
- `byUser(userId)` (skema kanonik → `notifiable_id`, legacy → `user_id`);
- child scope defensif: notifikasi bertipe `Student` hanya tampil bila `notifiable_id = siswa konteks`;
- paginate 20, urut `created_at desc`.

## 4. Item Shape (kanonik partitioned)

```json
{
  "id": "uuid",
  "academic_year_id": "uuid",
  "semester_id": "uuid",
  "month": 8,
  "notifiable_id": "uuid",
  "notifiable_type": "App\\Models\\User",
  "title": "...",
  "body": "...",
  "channel": "system|chat|assignment|...",
  "metadata": {},
  "read_at": null,
  "message": "..."  // accessor → body (kompatibilitas skema legacy)
}
```

## 5. Filter

| Param | Semantik |
|---|---|
| `search` | `title`/`body` (legacy juga `message`); `ilike` di pgsql |
| `type` | kanonik → `channel`; legacy → `type` |
| `is_read` | `true` (read_at NOT NULL) / `false` (read_at NULL) / `all` |
| `per_page` | 1–100 (dibatasi) |

## 6. Keamanan

- Semua endpoint di dalam grup `auth:sanctum`.
- `markAsRead`/`markAllRead`/`unreadCount` memakai `byUser(user->id)` → **tidak ada IDOR** (notifikasi
  user lain → 404/0). Diverifikasi `NotificationApiScopeTest` di SQLite & PG.
