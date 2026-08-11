# DATABASE RULEBOOK

Aturan kanonik untuk perubahan database. Prompt `09_PROMPT/AUDIT_SEBULUM_BUAT_MODUL_BARU.md` dan report `99_ARCHIVE/DATABASE_SOURCE_OF_TRUTH_MATRIX.md` hanya menjadi konteks; aturan aktif berada di dokumen ini.

## Pipeline Sumber Data

```text
PostgreSQL → Model → Repository → Service → API Endpoint → React Query/Axios → UI Component
```

PostgreSQL adalah satu-satunya sumber data. Dilarang mock/hardcode data bisnis di frontend.

## Non-Breaking Rule (MASTER)

JANGAN mengubah tanpa audit + pengujian kompatibilitas:

- CRUD modul yang berjalan
- Endpoint / route / nama route lama
- Struktur response API lama, request frontend lama
- Komponen UI, service frontend, state management lama
- Role, permission, hak akses lama
- Nama tabel/kolom lama yang masih dipakai
- Struktur data produksi dan relasi yang benar
- Migration lama yang sudah dijalankan

Modul baru harus menyesuaikan struktur proyek, bukan memaksa proyek lama berubah.

## Audit Sebelum Modul Baru

Sebelum membuat migration/model/controller/seeder baru, audit:

```text
database/migrations/
database/seeders/
database/factories/
app/Models/
app/Http/Controllers/
app/Http/Requests/
app/Http/Resources/
app/Services/
app/Repositories/
routes/
tests/
web-dashboard/
mobile-app/
```

Cari: tabel/model/foreign key/relasi induk/master data/seeder/endpoint yang sudah tersedia, trait UUID, trait audit, pola soft delete.

## Standar Teknis

- Primary key: UUID.
- Soft delete pada entitas inti.
- Multi-unit pendidikan (`education_unit_id`) + konteks `academic_year_id`/`semester_id` untuk data akademik.
- Foreign key + index dibuat di PostgreSQL.
- Relasi akademik memakai master yang sudah ada; jangan buat tabel master duplikat atau FK dengan nama berbeda.
- Seeder idempotent.
- Test integritas relasi wajib.

## Aturan Mutasi

- Setiap mutasi lewat endpoint RESTful dan memicu invalidasi query frontend.
- UI tidak menulis data; hanya presentasi.

## Referensi

- Schema: `02_DATABASE/DATABASE_SCHEMA.md`
- Migration: `02_DATABASE/MIGRATION_RULE.md`
- Seeder: `02_DATABASE/SEEDER_RULE.md`
- Scope data: `02_DATABASE/DATA_SCOPE.md`
- Prompt lengkap audit: `09_PROMPT/AUDIT_SEBULUM_BUAT_MODUL_BARU.md`
