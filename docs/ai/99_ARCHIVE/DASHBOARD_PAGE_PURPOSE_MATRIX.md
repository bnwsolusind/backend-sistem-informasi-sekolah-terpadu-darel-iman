# DASHBOARD PAGE PURPOSE MATRIX — SESI 9

Tanggal: 2026-08-06
Tujuan: mendokumentasikan TUJUAN tiap halaman dashboard per role agar tidak ada dashboard generik/duplikat, dan konsisten dengan data yang disajikan.

| Halaman (Frontend) | Role Target | Tujuan Utama | Data Utama yang Ditampilkan |
|---|---|---|---|
| `SuperAdminDashboardPage` | Super Admin | Pemantauan teknis & konfigurasi sistem: kesehatan data, ringkasan seluruh unit | Ringkasan sistem, unit, total siswa/guru, status integrasi |
| `FoundationDashboardPage` | Yayasan, Ketua Yayasan, Pengurus Yayasan | Tinjauan lintas unit & laporan strategis yayasan | Statistik siswa/guru lintas unit, kelas, rombel, alumni, laporan bulanan |
| `KepalaSekolahDashboardPage` | Kepala Sekolah | Kinerja sekolah & unit terpilih; hadir harian | Statistik kehadiran, tren 7 hari, siswa/guru, kelas per unit |
| `DivisiPendidikanDashboardPage` | Divisi Pendidikan | Pemantauan pendidikan per unit (scope `unitIds`) | Siswa, guru, laporan bulanan per unit |
| `WakaKurikulumDashboardPage` | Waka Kurikulum, Wakil Kepala Sekolah | Ringkasan kurikulum & akademik | Kelas, siswa, distribusi akademik per unit |
| `WakaKesiswaanDashboardPage` | Waka Kesiswaan | Pembinaan siswa & kedisiplinan | Catatan siswa (student notes), rekap prestasi, mutasi per unit |
| `TataUsahaDashboardPage` | TU/Tata Usaha | Administrasi & kehadiran | Kehadiran hari ini, siswa, pegawai per unit |
| `WaliKelasDashboardPage` | Wali Kelas | Kelas binaan sendiri (homeroom only) | Statistik kelas binaan, siswa, kehadiran; `class_id` luar scope diabaikan |
| `GuruTahfizhDashboardPage` | Guru Tahfizh, Musyrif, Musyrifah | Binaan hafalan & setoran | Siswa binaan (assignment), setoran tahfizh, target |
| `GuruBkDashboardPage` | Guru BK | Konseling & pembinaan karakter | Siswa, catatan pembinaan per unit |
| `OperatorDashboardPage` | Operator | Operasional data harian | Siswa & pegawai per unit |
| `MonitoringDashboardPage` | Admin, Yayasan, Kepala Sekolah, Divisi Pendidikan, Super Admin | Dashboard Pemantauan strategis (dashboard default `/api/dashboard`) | Kartu statistik, donut kehadiran, bar tahfizh, indikator kinerja, pemantauan divisi, pengumuman |
| `TeacherStudentPortalDashboardPage` (`/portal-guru`) | Guru, Guru PAI, Pembimbing, dll | Portal guru: jadwal, kelas ajar, LMS, mutabaah | Jadwal mengajar, kelas ajar, catatan siswa, tahfizh |
| `StudentPortalPage` (`/portal-siswa`) | Siswa | Portal siswa: ringkasan pribadi | Jadwal, tugas, nilai, kehadiran pribadi |
| `ParentPortalPage` (`/portal-orangtua`) | Orang Tua/Wali | Portal orang tua: pantau anak | Data anak (switcher child), kehadiran, nilai, catatan |
| `AlumniPortalPage` (`/portal/alumni`) | Alumni | Portal alumni: profil & data sendiri | Data alumni milik user saja (scope `user_id`) |

## Aturan yang Dijamin (Anti-duplikasi / anti-generik)
1. Setiap role punya halaman target yang jelas; resolver `MultiRoleDashboardPage` tidak pernah melempar ke dashboard generik kecuali halaman Pemantauan untuk Admin/Yayasan (memang dashboardnya).
2. TIDAK ada dashboard generik dengan KPI palsu — semua KPI diambil dari data real backend (lihat DASHBOARD_KPI_SOURCE_MAP.md).
3. `/portal-siswa` index = `StudentPortalPage section="ringkasan"` (perbaikan BUG-S9-08; sebelumnya merender dashboard guru).
4. Guru Tahfizh tanpa assignment menampilkan 0 binaan, bukan seluruh siswa (BUG-S9-07).
