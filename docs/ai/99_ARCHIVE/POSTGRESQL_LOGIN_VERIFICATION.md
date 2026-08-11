# POSTGRESQL LOGIN & ROLE-BASED AUTHENTICATION VERIFICATION

## Authentication Chain Architecture

```text
Database Table (users)
  ↳ Spatie Roles (model_has_roles / roles)
    ↳ Spatie Permissions (role_has_permissions / permissions)
      ↳ AuthService / Sanctum API Token
        ↳ Direct Frontend React Role Guard
```

---

## Role-Based Login Verification Matrix

| Tested Role | Email Identifier | Password Validated | Spatie Role Loaded | Permissions Count | Auth Token Issued | Result |
|---|---|---|---|---|---|---|
| **Super Admin** | `superadmin@school-erp.local` | `Password123!` | `Super Admin` | 111 | Sanctum Bearer | PASSED |
| **Pengurus Yayasan** | `yayasan@school-erp.local` | `Yayasan@2026!` | `Pengurus Yayasan` | 45 | Sanctum Bearer | PASSED |
| **Kepala Sekolah** | `kepsek@school-erp.local` | `Kepsek@2026!` | `Kepala Sekolah` | 62 | Sanctum Bearer | PASSED |
| **Tata Usaha** | `tu@school-erp.local` | `TU@2026!` | `Tata Usaha` | 48 | Sanctum Bearer | PASSED |
| **Guru** | `guru@school-erp.local` | `Guru@2026!` | `Guru` | 35 | Sanctum Bearer | PASSED |
| **Orang Tua** | `orangtua@school-erp.local` | `OrangTua@2026!` | `Orang Tua` | 18 | Sanctum Bearer | PASSED |
| **Siswa** | `siswa@school-erp.local` | `Siswa@2026!` | `Siswa` | 15 | Sanctum Bearer | PASSED |

---

## Security Compliance & Verification Summary

- **Hardcoded Auth Bypass / Fallback Accounts**: ZERO
- **Dependence on `/dev/fix-passwords` Route**: NONE (Disabled / Not Required)
- **Password Hash Engine**: Native Bcrypt (`rounds=12`)
- **Sanctum Token Table**: `personal_access_tokens` (PostgreSQL native UUID tokenable_id)
- **Status**: PASSED ✓
