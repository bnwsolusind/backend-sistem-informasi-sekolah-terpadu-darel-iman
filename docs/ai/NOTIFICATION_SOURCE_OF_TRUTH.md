# NOTIFICATION — SINGLE SOURCE OF TRUTH

Dokumen ini menjawab pertanyaan arsitektur modul notifikasi (Sesi 12): **siapa yang menulis, kolom apa
yang dipakai, dan bagaimana API membaca** — sehingga bell/layout/portal konsisten dan tidak pernah
"gagal senyap" karena ketidakcocokan skema.

## 1. Masalah yang Dilindungi

Tabel `notifications` memiliki **dua skema** yang hidup berdampingan tergantung mesin:

| | Skema KANONIK (PostgreSQL — partitioned) | Skema LEGACY (SQLite/dev) |
|---|---|---|
| PK | `id + academic_year_id + semester_id + month` | `id` |
| Penerima | `notifiable_id` + `notifiable_type` | `user_id` |
| Isi | `title` + `body` | `message` (accessor memetakan `body`) |
| Jenis | `channel` | `type` |
| Dibaca | `read_at` (NULL = belum dibaca) | `is_read` + `read_at` |

Kesalahan memilih kolom = `column "user_id" does not exist` di PG (500), atau menulis tanpa partition
key = pelanggaran FK/PK di PG (500). Sebelum Sesi 12, beberapa jalur masih memakai kolom legacy secara
hardcode dan tertutup try/catch (gagal senyap).

## 2. Sumber Kebenaran (Kode)

### 2.1 Deteksi skema — di-cache static
`App\Models\Notification::usesCanonicalSchema(): bool` — mengecek keberadaan kolom `user_id` **satu
kali per proses** (static cache), bukan per request.

```php
// app/Models/Notification.php:49
public static function usesCanonicalSchema(): bool
```

### 2.2 Penulisan — SATU jalur kanonik
`Notification::deliver(string $userId, string $title, string $body, string $channel, array $metadata = []): ?self`
- Selalu menulis ke skema **kanonik partitioned**: mengisi `academic_year_id` + `semester_id`
  (tahun ajaran & semester aktif) + `month = now()->month`.
- Tidak ada konteks akademik aktif → kembali `null` (aman, tidak pernah throw).
- `unread` didefinisikan sebagai `read_at IS NULL`.

Call site produksi (contoh): pesan portal chat, pemberitahuan aktivitas terpadu.

### 2.3 Pembacaan — builder bersama
`Notification::userQuery(string $userId, array $filters = []): Builder`
Filter yang didukung: `search` (title/body, dan `message` di legacy; `ilike` di pgsql),
`type` (memetakan ke `channel` di kanonik, `type` di legacy), `is_read` (read/unread/all).
Digunakan oleh seluruh API:
- `Api\V1\NotificationController::index` (dashboard/umum, auth:sanctum)
- `TeacherPortalController::notifications`
- `StudentParentPortalController::notifications`

`scopeByUser` (schema-aware: kanonik → `notifiable_id`, legacy → `user_id`) dipakai `userQuery`.

## 3. Model Peristiwa (Events) — Status Saat Ini

Saat ini **penulisan terpusat pada `Notification::deliver()`**; pemicu "peristiwa" adalah call site
di service/controller yang memanggil `deliver()` (tidak ada kelas `Events/Listeners` terpisah).
Ini sudah cukup untuk: (a) bell staf membaca data real, (b) portal siswa/ortu membaca data real.

> Catatan scope: refactor penuh ke sistem `Events/Listeners` (mis. `MessageSent`, `AssignmentSubmitted`)
> di luar lingkup Sesi 12 dan **tidak wajib** untuk kebenaran data — seluruh jalur sudah lewat satu
> penulis yang konsisten dengan partition key. Bila tim menetapkan kebutuhan event-driven, tambahkan
> listener yang memanggil `Notification::deliver()` (jangan buat jalur tulis kedua).

## 4. Kontrak API

### GET `/api/notifications` (auth:sanctum)
Query params: `search`, `type` (channel/type), `is_read` (`true|false|all`), `per_page` (1–100, default 20).
Response: `{ data: [...] }` paginasi Laravel; item memakai accessor `message` (fallback ke `body`)
dan `read_at`. Urutan: `latest()`.

### GET `/api/teacher/notifications` & GET `/api/portal/notifications`
Memakai `userQuery` yang sama; portal siswa/ortu di-scope via `getStudentContext` → `userQuery(userId)`.

## 5. Frontend

- `DashboardLayout.jsx` (staf, semua role): `reportService.notifications({ per_page: 50 })`,
  `notificationUnreadCount()`, `markNotificationRead(id)`, `markAllNotificationsRead()` — **tanpa mock**.
- Portal siswa/ortu: section **Informasi Sekolah** (school-information API) + invalidasi query key
  `['notifications']` setelah update state (SchoolInformationWorkspace).

## 6. Perlindungan Regresi

- `NotificationDualSchemaWriteTest` — menulis via `deliver()` pada kedua representasi (assert create sukses, kolom kanonik terisi, `message` accessor, `unread` = read_at NULL).
- `NotificationApiScopeTest` — index scoped per user (tidak bocor antar user), filter search/type/is_read bekerja, paginasi stabil.
- `NotificationApiTest` — endpoint dashboard tidak 500 di PG (fixture memakai AcademicYear/Semester nyata).
