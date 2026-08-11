# RESPONSE STANDARD

Standar envelope sukses. Bukti historis: `99_ARCHIVE/CROSS_MODULE_API_CONTRACT.md`, `99_ARCHIVE/OPTIONS_API_CONTRACT.md`, `99_ARCHIVE/NOTIFICATION_API_CONTRACT.md`.

## Envelope Sukses (Resource/List)

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 15,
    "total": 100,
    "last_page": 7
  }
}
```

- List: `data` = array + `meta` (pagination Laravel). Detail: `data` = object resource.
- Options: envelope `{ status, message, data: [{ value, label, meta }] }` (lihat `06_API/API_CONTRACT.md`).
- Notifikasi: `data` = list notifikasi + `unread_count` (lihat `99_ARCHIVE/NOTIFICATION_API_CONTRACT.md`).

## Meta Pagination (Laravel)

`page` · `limit` (per_page) · `total` · `last_page`. Frontend `AppPagination` membaca `meta` ini.

## Format Field

- Tanggal `YYYY-MM-DD`; datetime ISO-8601 timezone Asia/Jakarta.
- UUID v4 lowercase hyphenated.
- Nullable field → eksplisit `null`, bukan key hilang.
- Data pribadi tidak pernah dikirim: hash password, token, identitas finansial.
- Redaction security: kunci jawaban/pembahasan (role Siswa/Ortu/Alumni), nilai final sebelum `tampilkan_nilai_langsung=true`.

## Zero Mock Policy

Seluruh payload dihitung real-time dari PostgreSQL. Filter global `whereNull('deleted_at')`; periode akademik aktif (`academic_year_id` + `semester_id`).

## Referensi

- Detail arsip: `99_ARCHIVE/CROSS_MODULE_API_CONTRACT.md`, `99_ARCHIVE/OPTIONS_API_CONTRACT.md`, `99_ARCHIVE/NOTIFICATION_API_CONTRACT.md`
