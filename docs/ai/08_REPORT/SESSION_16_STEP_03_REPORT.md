# PRA-SESI 16 STEP 03 REPORT

Tanggal: 2026-08-11

## Scope

Audit role dashboard, portal workspace, default redirect, child route guard,
real PostgreSQL KPI/source mapping, quick action, and forbidden route behavior.
QR attendance, teacher realtime monitoring, and broad refactor tetap deferred.

## Changes

- Operator dipisahkan dari default route Tata Usaha: `/dashboard/operator`.
- Operator dashboard sekarang memakai KPI, kelas aktif, dan chart density dari
  query database; fallback angka dan activity log sintetis dihapus.
- Dashboard child routes utama memakai permission guard; descendants Yayasan
  berada di bawah `foundation.dashboard.view`.
- Generic `/dashboard/tahfizh` hanya menerima permission yang dapat membaca
  kelas; Guru Tahfizh, Wali Kelas, dan Musyrif memakai teacher workspace scoped.
- Musyrif tidak lagi menampilkan angka fallback ketika data kosong.
- Divisi, TU, Kepala Sekolah, dan context dashboard diselaraskan dengan kolom
  PostgreSQL aktual, termasuk `laporan_bulanans.status_validasi` dan
  `academic_years.name`.
- Portal siswa tidak lagi menampilkan tombol submit izin atau save Mutabaah yang
  akan ditolak oleh backend; transaksi izin tetap parent-controlled.
- Floating employee chat hanya aktif jika permission chat tersedia.
- Canonical contract baru: `05_MODULE/ROLE_DASHBOARD_STANDARD.md`.

## Verification

| Check | Result |
|---|---|
| `DashboardRoleAccessTest` | 8 passed / 46 assertions |
| Attendance regression | `AttendanceWorkflowTest` 9 passed / 43 assertions; `MutabaahPortalGateTest` 5 passed / 12 assertions |
| PHP syntax dashboard services | PASS |
| Frontend lint | PASS, 0 errors; warning-only baseline |
| Frontend build | PASS, Vite 8.2.1 / 3291 modules |
| `git diff --check` | PASS |
| 13-account browser matrix | All expected redirects/content; 0 backend failures; 0 console errors |
| Negative route browser smoke | 7 cases pass, including parent/student separation, Student permission-create route, Operator route, and Tahfizh workspace |
| Responsive browser smoke | 1440x900 desktop + four 390x844 mobile role samples pass without horizontal overflow |

## Findings Remaining

- Musyrif masih memakai endpoint Guru Tahfizh karena endpoint kelompok binaan
  khusus Musyrif belum tersedia; data kosong sekarang tampil sebagai empty state.
- Detail/drill-down dan beberapa report action Yayasan belum seluruhnya selesai.
- Workspace Guru masih memiliki fallback bisnis lama di area teaching attendance;
  source teaching attendance per jadwal tetap missing.
- Full PHPUnit suite belum selesai: timeout sebelumnya pada 63/384 dengan
  failures master-data/subject yang terpisah.
- QR teaching attendance dan live/near-live monitoring tetap deferred.

## Verdict

**PASS WITH FINDINGS** untuk Step 03. Step 04 belum dimulai.
