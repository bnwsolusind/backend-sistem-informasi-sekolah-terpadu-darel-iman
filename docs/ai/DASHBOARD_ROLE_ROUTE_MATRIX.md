# DASHBOARD ROLE → ROUTE MATRIX — SESI 9

Tanggal: 2026-08-06
Scope: Pemetaan role aktual DB → halaman dashboard frontend → endpoint API → permission guard.

Sumber:
- `web-dashboard/src/pages/MultiRoleDashboardPage.jsx` (resolver role → route)
- `backend/routes/api.php` (middleware `can:` per route, diverifikasi via `php artisan route:list -v`)
- `backend/database/seeders/RolePermissionSeeder.php` (blok `dashboardAccessMap`)

## 1. Matriks Resolver `MultiRoleDashboardPage` (Prioritas urutan)

| # | Prioritas | Kondisi | Tujuan (Frontend Route) |
|---|---|---|---|
| 1 | Super Admin | role `Super Admin` / `super_admin` | `/dashboard/super-admin` (render `SuperAdminDashboardPage`) |
| 2 | Foundation | role Yayasan/Ketua Yayasan/Pengurus Yayasan/sekretaris/bendahara ATAU permission `foundation.dashboard.view` | `/dashboard/yayasan` |
| 3 | Siswa | role `Siswa`/`siswa`/`student` | `/portal-siswa` (index → `StudentPortalPage section="ringkasan"`) |
| 4 | Orang Tua | role `Orang Tua`/`Orangtua`/`Wali Murid`/`orang_tua`/`parent` | `/portal-orangtua` |
| 5 | Role dashboard khusus | tabel `roleDashboardRoutes` di bawah | per role |
| 6 | Admin / pemantauan | permission `dashboard.pemantauan.lihat` | `/dashboard/pemantauan` |
| 7 | Tanpa akses | tidak ada role/permission cocok | halaman "Akses Dashboard Tidak Tersedia" |

## 2. Tabel `roleDashboardRoutes` (role → route)

| Role aktual DB (dan varian) | Frontend Route |
|---|---|
| `Guru`, `Guru Mata Pelajaran`, `Guru PAI`, `Pembimbing` | `/portal-guru` |
| `Wali Kelas`, `walas`, `wali_kelas` | `/dashboard/wali-kelas` |
| `Guru Tahfizh`, `Musyrif`, `Musyrifah`, `Musyrif / Musyrifah`, `guru_tahfizh` | `/dashboard/guru-tahfizh` |
| `Kepala Sekolah`, `kepala_sekolah`, `kepsek` | `/dashboard/kepala-sekolah` |
| `Divisi Pendidikan`, `divisi_pendidikan` | `/dashboard/divisi-pendidikan` |
| `Waka Kurikulum`, `waka_kurikulum`, `Wakil Kepala Sekolah` | `/dashboard/waka-kurikulum` |
| `Waka Kesiswaan`, `waka_kesiswaan` | `/dashboard/waka-kesiswaan` |
| `Tata Usaha`, `TU`, `tu`, `tata_usaha` | `/dashboard/tata-usaha` |
| `Guru BK`, `guru_bk` | `/dashboard/guru-bk` |
| `Operator`, `operator` | `/dashboard/operator` |
| `Alumni`, `alumni` | `/portal/alumni` |

Normalisasi: `normalizeRole` = lowercase + hapus spasi/underscore/hyphen (cth `Musyrif / Musyrifah` ↔ `musyrifmusyrifah`).

## 3. Matriks Frontend Route → Endpoint API → Permission

| Frontend Route | Halaman | Endpoint API (GET) | Backend Guard (route) | Permission |
|---|---|---|---|---|
| `/dashboard/super-admin` | SuperAdminDashboardPage | `/api/dashboard/super-admin` | `api|auth:sanctum|can:dashboard.super-admin.view` | `dashboard.super-admin.view` |
| `/dashboard/yayasan` | FoundationDashboardPage | `/api/foundation/dashboard` | `api|auth:sanctum|can:foundation.dashboard.view` | `foundation.dashboard.view` |
| `/dashboard/kepala-sekolah` | KepalaSekolahDashboardPage | `/api/dashboard/kepala-sekolah` | `can:dashboard.kepala-sekolah.view` | `dashboard.kepala-sekolah.view` |
| `/dashboard/divisi-pendidikan` | DivisiPendidikanDashboardPage | `/api/dashboard/divisi-pendidikan` | `can:dashboard.divisi-pendidikan.view` | `dashboard.divisi-pendidikan.view` |
| `/dashboard/waka-kurikulum` | WakaKurikulumDashboardPage | `/api/dashboard/waka-kurikulum` | `can:dashboard.waka-kurikulum.view` | `dashboard.waka-kurikulum.view` |
| `/dashboard/waka-kesiswaan` | WakaKesiswaanDashboardPage | `/api/dashboard/waka-kesiswaan` | `can:dashboard.waka-kesiswaan.view` | `dashboard.waka-kesiswaan.view` |
| `/dashboard/tata-usaha` | TataUsahaDashboardPage | `/api/dashboard/tata-usaha` | `can:dashboard.tata-usaha.view` | `dashboard.tata-usaha.view` |
| `/dashboard/wali-kelas` | WaliKelasDashboardPage | `/api/dashboard/wali-kelas` | `can:dashboard.wali-kelas.view` | `dashboard.wali-kelas.view` |
| `/dashboard/guru-tahfizh` | GuruTahfizhDashboardPage | `/api/dashboard/guru-tahfizh` | `can:dashboard.guru-tahfizh.view` | `dashboard.guru-tahfizh.view` |
| `/dashboard/guru-bk` | GuruBkDashboardPage | `/api/dashboard/guru-bk` | `can:dashboard.guru-bk.view` | `dashboard.guru-bk.view` |
| `/dashboard/operator` | OperatorDashboardPage | `/api/dashboard/operator` | `can:dashboard.operator.view` | `dashboard.operator.view` |
| `/dashboard/pemantauan` | MonitoringDashboardPage | `/api/dashboard-pemantauan/ringkasan` | `can:dashboard.pemantauan.lihat` | `dashboard.pemantauan.lihat` |
| `/dashboard` (ringkasan) | Admin/Pemantauan | `/api/dashboard` → `DashboardPemantauanController@ringkasan` | `can:dashboard.pemantauan.lihat` | `dashboard.pemantauan.lihat` |
| `/portal-guru` | TeacherStudentPortalDashboardPage | `/api/teacher/dashboard` | `role:Guru|...` | `teacher.dashboard.view` |
| `/portal-siswa` | StudentPortalPage | `/api/students/dashboard` | `role:Siswa|Super Admin` | scoped per user |
| `/portal-orangtua` | ParentPortalPage | `/api/portal/dashboard` | `role:Orang Tua|...` | scoped per user |
| `/portal/alumni` | AlumniPortalPage | `/api/portal/alumni/dashboard` | `role:Alumni|Super Admin` | scoped per user |

## 4. Permission per Role (hasil seeder `RolePermissionSeeder`, diverifikasi via tinker)

| Role | Permission Dashboard |
|---|---|
| `Super Admin` | semua permission |
| `Admin` | `dashboard.view`, `dashboard.pemantauan.lihat` |
| `Yayasan`, `Pengurus Yayasan`, `Ketua Yayasan` | `dashboard.view`, `dashboard.pemantauan.lihat`, `dashboard.pemantauan.kelola`, `foundation.dashboard.view` |
| `Kepala Sekolah` / `kepsek` | `dashboard.kepala-sekolah.view` (+pemantauan lihat/kelola) |
| `Divisi Pendidikan` | `dashboard.divisi-pendidikan.view` (+pemantauan lihat/kelola) |
| `Waka Kurikulum`, `Wakil Kepala Sekolah` | `dashboard.waka-kurikulum.view` |
| `Waka Kesiswaan` | `dashboard.waka-kesiswaan.view` |
| `Tata Usaha`, `TU`, `tu` | `dashboard.tata-usaha.view` |
| `Operator` | `dashboard.operator.view` |
| `Wali Kelas` | `dashboard.wali-kelas.view` |
| `Guru Tahfizh`, `Musyrif`, `Musyrifah` | `dashboard.guru-tahfizh.view` |
| `Guru BK` | `dashboard.guru-bk.view` |
| `Guru`, `Guru PAI`, `Pembimbing`, dll | `teacher.dashboard.view` |
| Semua | `dashboard.view` (default) |

## 5. Catatan Penting
- `Admin` TIDAK diberi permission Super Admin — hanya `dashboard.view` + `dashboard.pemantauan.lihat` (view-only, bukan `kelola`).
- Route `/api/dashboard` TIDAK ada route terpisah "ringkasan"; yang ada hanyalah `/api/dashboard` → `dashboard.pemantauan.lihat`.
- Grup `/api/dashboard-pemantauan/*` diberi `can:dashboard.pemantauan.lihat` pada SESI 9 (sebelumnya tanpa guard — BUG-S9-01).
- `DashboardPemantauanController::pastikanHakAkses` kini berbasis permission (BUG-S9-02), write routes menuntut `dashboard.pemantauan.kelola`.
