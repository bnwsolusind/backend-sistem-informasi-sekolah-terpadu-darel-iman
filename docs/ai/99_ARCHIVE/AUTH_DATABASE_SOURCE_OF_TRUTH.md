# AUTH DATABASE SOURCE OF TRUTH

## PostgreSQL Connection Verification

- **APP DATABASE DRIVER**: `pgsql`
- **POSTGRESQL VERSION**: `PostgreSQL 14.17 (Homebrew) on aarch64-apple-darwin23.6.0`
- **CURRENT DATABASE**: `erp_sekolah`
- **CURRENT SCHEMA**: `public`
- **SEARCH PATH**: `"$user", public`

## Tables Schema Audit

All critical auth tables are verified on PostgreSQL:

| Table Name | PostgreSQL Status | Column Mapping & PK |
| --- | --- | --- |
| `users` | VERIFIED | Primary Key: `id` (bigint auto-increment/uuid), `name`, `email`, `password`, `phone`, `is_active` (boolean native), `deleted_at` |
| `roles` | VERIFIED | Spatie permission roles table |
| `permissions` | VERIFIED | Spatie permission permissions table |
| `model_has_roles` | VERIFIED | Relation table connecting users to Spatie roles |
| `model_has_permissions` | VERIFIED | Relation table connecting users to direct Spatie permissions |
| `role_has_permissions` | VERIFIED | Relation table mapping roles to Spatie permissions |
| `personal_access_tokens` | VERIFIED | Sanctum bearer token authentication table |

## Password Hashing Contract

- Hashing driver: `Bcrypt` via Laravel `Hash` facade
- Model Cast: `password => hashed` on `User` model
- Verification: `Hash::check($inputPassword, $user->password)` strictly enforced across all 3 auth portals.
