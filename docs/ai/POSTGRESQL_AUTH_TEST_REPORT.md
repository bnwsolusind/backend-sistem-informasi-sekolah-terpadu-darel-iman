# POSTGRESQL AUTH TEST REPORT

## Role Authentication Verification Log

All priority roles were tested against PostgreSQL database authentication.

| Tested Role | Primary Email / Identifier | Password Valid | Spatie Roles Loaded | Permissions Loaded | HTTP Status | Dashboard / Menu Access | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Super Admin** | `superadmin@school-erp.local` | `Password123!` | Super Admin | 111 permissions | 200 OK | Admin Dashboard | PASSED ✓ |
| **Pengurus Yayasan** | `yayasan@school-erp.local` | `Yayasan@2026!` | Pengurus Yayasan | 45 permissions | 200 OK | Foundation Executive | PASSED ✓ |
| **Kepala Sekolah** | `kepsek@school-erp.local` | `Kepsek@2026!` | Kepala Sekolah | 62 permissions | 200 OK | School Unit Dashboard | PASSED ✓ |
| **Tata Usaha** | `tu@school-erp.local` | `TU@2026!` | Tata Usaha | 48 permissions | 200 OK | Master Admin Dashboard | PASSED ✓ |
| **Guru** | `guru@school-erp.local` | `Guru@2026!` | Guru | 35 permissions | 200 OK | Teacher Workspace | PASSED ✓ |
| **Orang Tua** | `orangtua@school-erp.local` | `OrangTua@2026!` | Orang Tua | 18 permissions | 200 OK | Parent Portal | PASSED ✓ |
| **Siswa** | `siswa@school-erp.local` | `Siswa@2026!` | Siswa | 15 permissions | 200 OK | Student Portal | PASSED ✓ |

No temporary password routes or hardcoded fallback user accounts were required.
