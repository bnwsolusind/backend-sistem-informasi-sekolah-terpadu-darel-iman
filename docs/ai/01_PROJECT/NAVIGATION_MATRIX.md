# NAVIGATION MATRIX

## Entry dan Redirect

| Entry | UI aktual | Redirect aktual | Target |
|---|---|---|---|
| `/masuk` | unified identifier login | role resolver → default portal | satu UI |
| `/masuk-keluarga` | compatibility alias | redirect `/masuk` | tidak ada UI login kedua |
| `/auth`, `/authentication` | alias LoginPage | role resolver → default portal | alias compatibility saja |
| QR employee login | API tanpa UI utama | portal employee + token | pisahkan dari card teaching scan |

## Workspace Navigation

| Workspace | Route | Guard frontend | Catatan |
|---|---|---|---|
| Admin | `/dashboard` → `/dashboard/pemantauan` | token + `dashboard.pemantauan.lihat` | MultiRoleDashboard tetap menjadi compatibility entry |
| Yayasan | `/dashboard/yayasan/*` | `foundation.dashboard.view` pada parent route + API permission | API wajib tetap final authority |
| Guru | `/portal-guru/*` | teacher role + permission | API/backend tetap final authority |
| Orang Tua | `/portal-orangtua` | parent roles | sesuai target |
| Siswa | `/portal-siswa/*` | siswa roles only | parent tidak masuk student workspace |
| Alumni | `/portal-alumni` | Alumni/Super Admin | sesuai target |
| Absensi | `/absensi/*` | sebagian role route; banyak child token-only | API permission tidak seragam |
| Monitoring | `/dashboard/pemantauan` | `dashboard.pemantauan.lihat` | bukan live monitoring guru |

Default role dashboard, scope, dan quick-action contract berada di
`05_MODULE/ROLE_DASHBOARD_STANDARD.md`.

## Menu Contract Freeze

- Desktop: sidebar; tablet: drawer; mobile: bottom navigation + drawer.
- Portal/workspace memakai core modules yang sama; jangan copy CRUD per role.
- Table action memakai menu `⋮` sesuai permission, bukan deretan tombol.
- Form mobile memakai bottom sheet; detail memakai drawer/modal; aksi kritis memakai confirmation.
- Breakpoint verifikasi: 360, 390, 768, 1024, 1280, 1440.

## Navigation Findings

1. Route `/absensi` dan legacy module children masih memerlukan audit lanjutan di luar Step 02.
2. Wildcard `/absensi/*` merender workspace generik; tetap perlu audit fail-closed agar typo tidak membuka halaman yang keliru.
3. Tidak ada route live monitoring guru yang memenuhi field baseline; ini tetap deferred.
