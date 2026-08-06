# Migration Rekonsiliasi — `student_notes` untuk Portal Orang Tua

Migration: `backend/database/migrations/2026_08_06_100000_reconcile_student_notes_for_parent_portal.php`

## Latar Belakang

Tabel `student_notes` dibuat dua kali dengan skema berbeda:

1. **Core** (`2026_07_21_030000_create_school_erp_core_tables.php`) — skema legacy:
   `id, student_id, teacher_id, note (TEXT NOT NULL), metadata, softDeletesTz, timestampsTz`.
2. **Kaya** (`2026_08_02_100000_create_student_notes_table.php`) — hanya dibuat **jika tabel
   belum ada** (`if (! Schema::hasTable('student_notes'))`), sehingga **tidak berjalan** di
   basis data yang sudah punya tabel dari migration core (mis. Postgres produksi).

Akibatnya model `StudentNote` (kolom `title`, `content`, `visible_to_parent`, dsb.)
tidak cocok dengan skema aktual → query Portal Orang Tua "Catatan Guru / Tanda Tangan" error.

## Perilaku Migration (idempotent, aman dijalankan berulang)

| Langkah | Detail |
|---------|--------|
| 1. Guard | Jika tabel tidak ada → `return` |
| 2. Tambah kolom (hanya yang hilang) | `education_unit_id`, `academic_year_id`, `semester_id` (uuid nullable); `date` (date), `category`, `title`, `content`, `priority`, `follow_up`, `attachment_path`; `visible_to_parent`, `visible_to_student` (boolean); `signed_by_user_id`, `signed_at` (timestampTz), `signature_content_hash` |
| 3. Longgarkan `note` | `note` → `nullable()` agar insert Eloquent (yang menulis `content`) tidak gagal NOT NULL di DB legacy |
| 4. Migrasi data | `note` → `content` bila `content` kosong (`update ['content' => DB::raw('note')]`) |
| 5. Backfill ringan | `visible_to_parent`/`visible_to_student` → true, `category` → 'Akademik', `priority` → 'medium', `date` → `COALESCE(created_at, CURRENT_TIMESTAMP)` bila null |

`down()` tidak menghapus kolom (satu arah; aman).

## Verifikasi

- `php artisan migrate --force` pada scratch SQLite baru → seluruh migration sukses,
  termasuk `2026_08_06_100000_*` (94ms).
- In-memory test schema (RefreshDatabase) yang mengeksekusi seluruh migration dari nol
  terbukti kompatibel: `StudentNote::create` (tanpa `note`) berhasil setelah kolom dilonggarkan
  (diverifikasi oleh `StudentParentPortalChildSwitchingTest`).
- **PostgreSQL (Closure Sesi 10)**: seluruh suite migration sukses & idempotent pada
  PostgreSQL 14 lokal (PG 17 tidak tersedia; proxy). Kolom rekonsiliasi terverifikasi ada
  (`title`, `content`, `visible_*`, `signed_by_user_id`, `signature_content_hash`, dst.),
  `note` nullable, dan **backfill `note→content` + `visible_*`/`category`/`priority`/`date`
  diuji via simulasi baris legacy** (lihat `SESSION_10_CLOSURE_REPORT.md` §6).

## Catatan Deploy

Jalankan `php artisan migrate` sebelum menayangkan fitur tanda tangan Portal Orang Tua.
Migration ini aman untuk Postgres, MySQL, dan SQLite (Laravel 12 native `change()`).
Catatan: untuk menjalankan seluruh suite migration dari nol di PostgreSQL, dua bug portabilitas
pada `2026_08_01_000004_fix_tbl_kelas_kode_unique_composite.php` (HAVING alias + DROP CONSTRAINT)
telah diperbaiki.
