# BUG FIX LOG & RECONCILIATION AUDIT

## Reconciled Issues & Corrective Fixes

| Issue ID | Affected Component | Root Cause | Corrective Action | Verification | Status |
|---|---|---|---|---|---|
| **FIX-001** | `DataDummyPegawaiSeeder.php` | Deletion of `EmployeeTeaching` records during seeder re-run (`delete()`) | Refactored to non-destructive `updateOrCreate()` guard using `employee_id` and `metadata->subject_id` | Seeder dual-run execution | FIXED |
| **FIX-002** | `MasterJabatanSeeder.php` | Legacy position code migration | Re-linked existing employees to official position IDs before legacy record removal | Employee FK integrity check | FIXED |
| **FIX-003** | `.env` PostgreSQL connection config | App host socket vs TCP loopback binding | Standardized `.env` for PostgreSQL host configuration and socket compatibility | Connection test via Laravel DB manager | FIXED |
| **FIX-004** | `DefaultRoleUserSeeder.php` | Potential duplicate user seeding | Enforced `updateOrCreate()` natural key matching on `email` | User count verification | FIXED |
| **FIX-005** | Spatie Roles & Permissions | Spatie role cache stagnation | Added automatic execution of `permission:cache-reset` post-seed | Permission resolution test | FIXED |
