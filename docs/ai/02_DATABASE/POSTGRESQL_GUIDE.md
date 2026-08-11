# POSTGRESQL GUIDE

Panduan verifikasi runtime PostgreSQL. Semua nilai status berasal dari laporan yang sudah diarsipkan.

## Identitas Koneksi (terverifikasi)

| Item | Nilai |
|---|---|
| Driver | `pgsql` |
| Versi | PostgreSQL 14.23 (Homebrew aarch64) |
| Database | `erp_sekolah` |
| Schema | `public` |
| Search path | `"$user", public` |

> Catatan: target produksi dinyatakan PostgreSQL 17; verifikasi runtime PG17 **pending** (environment note Sesi 16).

## Checklist Verifikasi

1. **Koneksi** — `php artisan migrate:status` / smoke query; re-koneksi & sinkronisasi database PASS (Sesi 14).
2. **Schema** — verifikasi tabel kritis (users, roles, permissions, pivot, personal_access_tokens, dst).
3. **Login** — 24/24 login lulus; verifikasi `POSTGRESQL_LOGIN_VERIFICATION`.
4. **API smoke** — endpoint kritis 200 OK (bukan 500) via `POSTGRESQL_*_SMOKE`.
5. **Migration** — `migrate:status` tanpa pending; 0 error SQLSTATE.
6. **Seeder** — dual-run aman; 0 idempotency error.

## Troubleshooting Umum

- **`column "user_id" does not exist` (500)** → memakai kolom legacy pada skema kanonik notifikasi. Wajib lewat `Notification::deliver()` / `Notification::userQuery()`.
- **FK/PK violation partition notifications** → penulisan tanpa partition key (`academic_year_id`, `semester_id`, `month`).
- **Login gagal** → cek `user->is_active`, profil portal (`hasPortalProfile`), dan hash password (bcrypt via `Hash::check`).
- **Scope bocor** → pastikan query memakai `AccessScopeService` / unit scope; jangan hardcode allowlist.

## Referensi

- Laporan detail: `99_ARCHIVE/POSTGRESQL_SOURCE_REPORT.md`, `99_ARCHIVE/POSTGRESQL_SCHEMA_VERIFICATION.md`, `99_ARCHIVE/POSTGRESQL_BOOTSTRAP_REPORT.md`, `99_ARCHIVE/POSTGRESQL_RECONNECT_REPORT.md`, `99_ARCHIVE/POSTGRESQL_AUTH_TEST_REPORT.md`, `99_ARCHIVE/POSTGRESQL_LOGIN_VERIFICATION.md`, `99_ARCHIVE/POSTGRESQL_API_SMOKE_REPORT.md`, `99_ARCHIVE/POSTGRESQL_CRITICAL_API_SMOKE.md`
- Auth: `03_AUTH/AUTHENTICATION.md`
