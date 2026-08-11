# MIGRATION RULE

Aturan kanonik migration. Bukti historis: `99_ARCHIVE/01-audit-migrations.md`, `99_ARCHIVE/MIGRATION_SAFETY_AUDIT.md`, `99_ARCHIVE/MIGRATION_STATUS_MATRIX.md`.

## Aturan

1. **Jangan edit migration yang sudah dijalankan di production.** Perubahan skema baru = migration tambahan non-destruktif.
2. **Add-only / non-breaking**: menambah kolom/tabel/index diperbolehkan; menghapus/mengganti nama kolom yang dipakai TIDAK boleh tanpa audit referensi.
3. Urutan migration tersusun hierarkis (induk sebelum anak) agar build dari database kosong berjalan.
4. Foreign key + index PostgreSQL wajib didefinisikan di migration.
5. Gunakan UUID sebagai primary key dan pola soft delete sesuai standar.
6. Setiap migration baru wajib diuji: (a) dijalankan pada database existing, (b) dibangun dari database kosong.
7. Perubahan cascade yang berisiko (mis. CP/TP) memakai `restrict`, bukan hapus induk.

## Status Baseline Terakhir Tercatat

- 71 migration terdaftar dan tersusun hierarkis.
- Migration koreksi LMS CP/TP: `2026_08_01_000002_fix_lms_cp_tp_cascade_to_restrict.php`.
- Pending migration: 0 pada report terakhir. Tidak ada SQLSTATE schema error pada report tersebut; rerun diperlukan bila database/source berubah.

## Referensi

- Detail audit migration: `99_ARCHIVE/01-audit-migrations.md`, `99_ARCHIVE/MIGRATION_SAFETY_AUDIT.md`, `99_ARCHIVE/MIGRATION_STATUS_MATRIX.md`, `99_ARCHIVE/MIGRATION_PENDING_MATRIX.md`
- Rulebook database: `02_DATABASE/DATABASE_RULEBOOK.md`
