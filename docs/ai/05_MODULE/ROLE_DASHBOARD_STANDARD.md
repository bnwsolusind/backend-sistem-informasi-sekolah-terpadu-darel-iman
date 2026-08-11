# ROLE DASHBOARD STANDARD

Status: CANONICAL. Berlaku setelah Pra-Sesi 16 Step 03 (2026-08-11).

Dashboard adalah workspace berbasis role. Layout boleh dipakai bersama, tetapi
route, permission, data scope, KPI, quick action, dan endpoint tetap mengikuti
kontrak role. Backend adalah otoritas terakhir; guard frontend hanya mencegah
UX yang jelas-jelas tidak sesuai.

## Contract

- Default redirect harus berupa route allow-listed dan stabil terhadap alias role.
- Dashboard child route wajib memakai `RouteRole` atau `PermissionElement` yang
  sesuai endpoint-nya.
- KPI, chart, table, dan context hanya boleh berasal dari PostgreSQL melalui API.
- Nilai kosong boleh ditampilkan sebagai `0` atau empty state; angka bisnis
  sintetis, kota default, tahun ajaran default, dan activity log buatan dilarang.
- Quick action yang membutuhkan scope berbeda harus menuju workspace scoped atau
  tidak dirender. Redirect ke halaman generic yang akan menghasilkan `403` tidak
  dianggap sebagai aksi yang valid.
- Data lintas unit, unit sendiri, rombel, assignment, kelompok binaan, anak,
  dan self-scope wajib ditegakkan ulang di backend.

## Role Matrix

| Role | Default workspace | Scope | Primary source | Status |
|---|---|---|---|---|
| Super Admin | `/dashboard` | Global | `/api/dashboard/super-admin` | VERIFIED |
| Admin | `/dashboard/pemantauan` | Operasional monitoring | `/api/dashboard-pemantauan/ringkasan` | VERIFIED |
| Yayasan | `/dashboard/yayasan` | Cross-unit read/report | `/api/foundation/dashboard` | PARTIAL: detail/report action audit remains |
| Divisi Pendidikan | `/dashboard/divisi-pendidikan` | Unit pendidikan yang diizinkan | `/api/dashboard/divisi-pendidikan` | VERIFIED |
| Kepala Sekolah | `/dashboard/kepala-sekolah` | Unit employee | `/api/dashboard/kepala-sekolah` | VERIFIED |
| Tata Usaha | `/dashboard/tata-usaha` | Unit employee | `/api/dashboard/tata-usaha` | VERIFIED |
| Operator | `/dashboard/operator` | Unit employee | `/api/dashboard/operator` | VERIFIED |
| Guru | `/portal-guru` | Jadwal, assignment, dan siswa sendiri | `/api/teacher/dashboard` | VERIFIED |
| Wali Kelas | `/dashboard/wali-kelas` | Rombel sendiri | `/api/dashboard/wali-kelas` | VERIFIED |
| Guru Tahfizh | `/dashboard/guru-tahfizh` | Halaqah/assignment sendiri | `/api/dashboard/guru-tahfizh` | VERIFIED |
| Musyrif | `/dashboard/musyrif` | Kelompok binaan sendiri | Tahfizh dashboard API | PARTIAL: endpoint khusus musyrif belum ada |
| Orang Tua | `/portal-orangtua` | Anak terhubung | `/api/portal/*` | VERIFIED |
| Siswa | `/portal-siswa` | Self | `/api/portal/*` | VERIFIED |

## Route Rules

- `/dashboard/tahfizh` adalah halaman generic yang hanya boleh dibuka dengan
  `kesiswaan.kelas_rombel`, `academic.schedule.view`, atau `sistem.master_data`.
- Guru Tahfizh, Wali Kelas, dan Musyrif menggunakan
  `/portal-guru/workspace?tab=tahfizh` untuk aksi tahfizh yang teacher-scoped.
- Parent tidak boleh masuk ke `/portal-siswa/*`; Student tidak boleh masuk ke
  `/portal-orangtua`.
- Operator tidak memakai default route Tata Usaha.
- Route foundation descendants berada di bawah guard
  `foundation.dashboard.view`; endpoint report tetap memeriksa permission report.
- Portal read-only tidak boleh menampilkan tombol mutasi yang backend-nya akan
  menolak request. Parent-controlled permission/absence transaction tetap milik
  Orang Tua.

## Acceptance

Role dashboard dinyatakan lulus bila login redirect, dashboard content, API
response, menu visibility, forbidden route, quick action, logout, dan console
browser memenuhi kontrak tanpa `4xx/5xx`, mock business value, atau blank shell.

QR attendance dan teacher realtime monitoring bukan bagian contract Step 03 dan
tetap deferred sesuai canonical attendance flow.
