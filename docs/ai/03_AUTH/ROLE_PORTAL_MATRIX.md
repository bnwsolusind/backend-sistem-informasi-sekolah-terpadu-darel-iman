# ROLE PORTAL MATRIX

Canonical setelah Pra-Sesi 16 Step 02. Portal adalah workspace; permission menentukan aksi dan data scope menentukan record yang boleh dilihat. Status `VERIFIED` berarti route/source dan acceptance yang disebutkan sudah diverifikasi.

## Portal Aktual

| Portal/workspace | Route utama | Guard aktual | Status |
|---|---|---|---|
| Admin/operasional | `/dashboard/*`, default `/dashboard/pemantauan` | token + role/permission per halaman/API | VERIFIED FOR STEP 03 |
| Yayasan | `/dashboard/yayasan/*` | parent route + API `foundation.dashboard.view` | PARTIAL: detail/report action audit remains |
| Guru | `/portal-guru`, `/portal-guru/workspace` | teacher role guard + API teacher role allowlist | VERIFIED FOR STEP 02 |
| Orang Tua | `/portal-orangtua` | role parent | VERIFIED |
| Siswa | `/portal-siswa/*` | role student only | VERIFIED FOR STEP 02 |
| Alumni | `/portal-alumni`, `/portal/alumni` | Alumni/Super Admin | VERIFIED |
| Musyrif | `/dashboard/musyrif` + `/portal-guru/workspace?tab=tahfizh` | role/menu + teacher-scoped API | PARTIAL: endpoint khusus musyrif belum ada |

## Role Kanonik dan Default Workspace

| Role kanonik | Workspace target | Scope target | Kondisi aktual |
|---|---|---|---|
| Super Admin | Admin | global | tersedia |
| Ketua Yayasan | Yayasan | cross-unit read/report | tersedia |
| Pengurus Yayasan | Yayasan | cross-unit read/report | tersedia |
| Sekretaris Yayasan | Yayasan | cross-unit read/report | tersedia |
| Bendahara Yayasan | Yayasan | cross-unit read/report | tersedia |
| Kepala Bidang Pendidikan | Admin/monitoring pendidikan | allowed units | route dashboard khusus belum eksplisit |
| Divisi Kurikulum | Admin/akademik | allowed units akademik | memakai workspace bersama |
| Divisi Kesiswaan | Admin/kesiswaan | allowed units kesiswaan | memakai workspace bersama |
| Divisi Bahasa | Admin/pendidikan | allowed units | memakai workspace bersama |
| Divisi Program Khusus | Admin/pendidikan | allowed units | memakai workspace bersama |
| Kepala Sekolah | Admin/monitoring unit | unit sendiri | route `/dashboard/kepala-sekolah` tersedia |
| Wakil Kepala Sekolah | Admin/monitoring unit | unit sendiri | memakai workspace bersama |
| Wakil Kurikulum | Admin/akademik | unit akademik | route khusus tersedia |
| Wakil Kesiswaan | Admin/kesiswaan | unit kesiswaan | route khusus tersedia |
| Tata Usaha | Admin/operasional | unit sendiri | route khusus tersedia |
| Operator | Admin/operasional | unit sendiri | route khusus tersedia |
| Guru | Portal Guru | assignment/jadwal sendiri | tersedia, guard frontend belum role-scoped |
| Guru Tahfizh | Portal Guru/Tahfizh | halaqah/assignment sendiri | dashboard khusus tersedia |
| Guru BK | Portal Guru/BK | siswa layanan sendiri | dashboard khusus tersedia |
| Wali Kelas | Portal Guru/Wali Kelas | rombel sendiri | tersedia; bukan otomatis guru semua mapel |
| Musyrif | Portal Musyrif | kelompok binaan sendiri | tersedia |
| Orang Tua | Portal Orang Tua | anak terhubung | tersedia; tidak masuk ke student workspace |
| Siswa | Portal Siswa | self | tersedia |
| Alumni | Portal Alumni | self | tersedia |

## Alias dan Gap Terminologi

- Runtime seed memuat 62 role karena alias legacy; 24 role di atas adalah role kanonik.
- `Admin`, `Yayasan`, `Divisi Pendidikan`, `Guru Mata Pelajaran`, `Guru PAI`, `Pembimbing`, dan `Musyrifah` adalah alias/role compatibility, bukan penambahan portal baru.
- Role generik `Pegawai` dan role literal `Guru Kelas` tidak ada pada daftar 24 kanonik. Pegawai diwakili relasi `Employee` + jabatan/role. Konsep guru kelas aktual harus memakai `ClassSchedule`; `Wali Kelas` tetap assignment `wali_kelas_id` yang berbeda.
- Login Step 02 memakai satu UI `/masuk`; `/masuk-keluarga` hanya redirect compatibility. Unified API mengembalikan default portal dan workspace chooser bila identifier ambigu.

## Source Evidence

`DefaultRoleUserSeeder` · `RolePermissionSeeder` · `web-dashboard/src/routes/index.jsx` · `web-dashboard/src/layouts/DashboardLayout.jsx` · `AuthService`.
