# SEEDER RULE

Aturan kanonik seeder. Bukti historis: `99_ARCHIVE/03-audit-seeders.md`, `99_ARCHIVE/SEEDER_SAFETY_AUDIT.md`, `99_ARCHIVE/SEEDER_DEPENDENCY_MAP.md`, `99_ARCHIVE/SEEDER_IDEMPOTENCY_REPORT.md`.

## Aturan

1. **Seeder wajib idempotent** — dapat dijalankan berulang kali tanpa duplikasi/error.
2. Role/permission di-bootstrap melalui seeder (`RolePermissionSeeder::syncPermissions`) — array di seeder hanya bootstrap idempotent; runtime mengambil role/permission dari PostgreSQL Spatie.
3. Urutan eksekusi mengikuti dependency map (master → relasi → data transaksional).
4. Password seed disimpan sebagai hash (bukan plaintext); `must_change_password=true` untuk akun bootstrap.
5. Seeder tidak boleh merusak data produksi; jalankan aman terhadap dual-run (idempotency certified).

## Status Baseline Terakhir Tercatat

- Seeder idempotency error: 0 pada report terakhir.
- 24/24 role kanonik tercatat tersedia dari seeder + PostgreSQL.
- 345 permission tercatat di runtime (granular lama tidak dihapus agar kontrak tetap kompatibel).

## Referensi

- Detail: `99_ARCHIVE/03-audit-seeders.md`, `99_ARCHIVE/SEEDER_SAFETY_AUDIT.md`, `99_ARCHIVE/SEEDER_DEPENDENCY_MAP.md`, `99_ARCHIVE/SEEDER_IDEMPOTENCY_REPORT.md`
- Akun fixture login: `03_AUTH/AUTHENTICATION.md` (login matrix)
