# SECURITY

Aturan kanonik keamanan & hardening akses. Bukti historis: `99_ARCHIVE/SECURITY_ACCESS_HARDENING_AUDIT.md`, `99_ARCHIVE/09-audit-security.md`, `99_ARCHIVE/HARDCODE_AUDIT.md`, `99_ARCHIVE/HARDCODED_ACCESS_AUDIT.md`.

## Aturan

1. **Auth**: semua endpoint bisnis di dalam `auth:sanctum`; token Sanctum bearer.
2. **Otorisasi**: Spatie `can:*`/`role:*` + middleware; Super Admin bypass `Gate::before`.
3. **Rate limit**: login parent/student `throttle:10,1` (anti brute-force).
4. **Ownership / IDOR prevention**:
   - Portal orang tua: anak harus terhubung (`parentStudentsQuery`); anak asing → 404 (fail-closed).
   - Portal siswa: data self-scope; `child_id` harus milik siswa login.
   - `markAsRead`/`markAllRead` notifikasi memakai `byUser(userId)` → tidak ada IDOR.
5. **Unit scope**: `AccessScopeService` diterapkan; Yayasan read-only pakai allowlist path eksplisit; endpoint berisi kata `profile`/`notifications` tidak boleh lolos pengecualian mutasi.
6. **Anti hardcode/mock**: dilarang array bisnis lokal, mock KPI, fake chart, dummy user, hardcoded access. Semua data dari PostgreSQL via service/repository.
7. **Password**: bcrypt hash, tidak pernah plaintext.
8. **Input**: validation via Form Request; parameterized bindings (query builder/ORM) — no SQL injection.
9. **Logout**: token dicabut.

## Step 02 Verification

- Login unified memakai throttle dan tidak lagi mempunyai credential hardcode atau fake session token di frontend.
- Gate attendance memakai permission middleware khusus untuk view/scan/config; unit scope backend fail-closed.
- Student portal hanya menerima role student pada frontend; parent tidak dapat membuka student workspace secara langsung.
- Student leave/sick mutation tidak diberi permission dan controller tidak memiliki role fallback untuk menghidupkannya kembali.
- Employee/kelas route memakai permission dan scope backend; teacher API tidak lagi mengizinkan role pimpinan/TU/admin umum.

## Temuan yang Sudah DIPERBAIKI

- Login parent/student tanpa rate limit → di-throttle.
- Middleware read-only Yayasan path terlalu longgar → allowlist eksplisit.
- Kode 440 (typo) pada child-scoped dashboard → diseragamkan 404.
- Potensi hardcoded access / mock → re-audit runtime bersih.

## Referensi

- Detail: `99_ARCHIVE/SECURITY_ACCESS_HARDENING_AUDIT.md`, `99_ARCHIVE/09-audit-security.md`, `99_ARCHIVE/HARDCODE_AUDIT.md`, `99_ARCHIVE/RUNTIME_HARDCODE_REAUDIT.md`, `99_ARCHIVE/HARDCODED_ACCESS_AUDIT.md`, `99_ARCHIVE/PRODUCTION_BUNDLE_MOCK_AUDIT.md`, `99_ARCHIVE/RUNTIME_MOCK_USAGE_MATRIX.md`, `99_ARCHIVE/SECURITY_ACCESS_HARDENING_AUDIT.md`
- Report keamanan per modul: `99_ARCHIVE/` (DASHBOARD_SECURITY_TEST_REPORT, REPORT_SECURITY_TEST_REPORT, STUDENT_PORTAL_SECURITY_TEST_REPORT, PARENT_PORTAL_SECURITY_REPORT, CHAT_SECURITY_TEST_REPORT, CBT_SECURITY_MODEL).
