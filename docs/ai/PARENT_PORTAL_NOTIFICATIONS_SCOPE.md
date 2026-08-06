# Parent Portal — Skema Notifikasi & Scoping (Dual Schema)

## 1. Masalah

Tabel `notifications` memiliki **dua varian skema** di dalam codebase:

| Varian | Kolom kunci | Asal |
|--------|-------------|------|
| Modern (SQLite/test) | `user_id`, `is_read`, `title`, `message` | migration `2026_07_27_*` |
| Legacy partitioned (PG) | `notifiable_id`, `notifiable_type`, `body`, `channel`, `sent_at`, `academic_year_id`, `semester_id`, `month` | migration `2026_07_21_030100` (khusus pgsql) |

`NotificationController` memakai `byUser()` (`user_id OR notifiable_id`) + pencarian
`message`/`body`, dan terbukti stabil di pengujian (`NotificationApiTest`).

Sebelum sesi 10, `StudentParentPortalController::notifications()` **hanya** menulis
`where('user_id', ...)` — kolom yang tidak ada di skema legacy → potensi error di PG.

## 2. Perbaikan (`...Controller.php` `notifications()`)

Query dibuat **toleran terhadap kedua skema**:

```php
if (Schema::hasColumn('notifications', 'user_id')) {
    $query->where('user_id', $user->id);
} else {
    $query->where(fn ($q) => $q
        ->where('notifiable_type', User::class)
        ->orWhere('notifiable_type', 'user')
        ->orWhere('notifiable_type', 'App\Models\User'));
    $query->where('notifiable_id', $user->id);
}
```

**Child scope** (jika ada konteks anak aktif): notifikasi bertipe `Student` hanya
ditampilkan bila `notifiable_id` = anak aktif; notifikasi tipe lain (akun/user) tetap
muncul.

```php
$query->where(function ($q) use ($student) {
    $q->where('notifiable_type', '!=', Student::class)
      ->orWhere('notifiable_id', $student->id);
});
```

Urutan: `orderByDesc('created_at')`, paginate 20.

## 3. Kompatibilitas

- `Schema::hasColumn` menjalankan pemeriksaan per-request (di-cache engine) — biaya kecil,
  dipakai untuk memilih jalur query yang valid pada engine berjalan.
- Endpoint tetap `200` meski tidak ada baris notifikasi (diuji).

## 4. Pengujian

`StudentParentPortalChildSwitchingTest::test_notifications_endpoint_is_stable_for_parent_without_records`
— memastikan guard skema + child scope tidak crash dan mengembalikan `success:true`.
