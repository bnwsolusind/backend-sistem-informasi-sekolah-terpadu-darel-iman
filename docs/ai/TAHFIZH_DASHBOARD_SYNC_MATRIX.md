# Dokumen Sinkronisasi Dashboard Tahfizh (TAHFIZH_DASHBOARD_SYNC_MATRIX.md)

Dokumen ini merinci matriks sinkronisasi data Tahfizh ke berbagai peran dashboard dan portal.

| Role / View | Endpoint API | Metrik Utama | Akses CRUD | Filter Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Guru Tahfizh** | `/api/dashboard/guru-tahfizh`, `/api/tahfizh/*` | Total Siswa Binaan, Setoran Hari Ini, Murajaah Hari Ini, Belum Setor | Full CRUD (Siswa Binaan) | Teacher Assignment Scope |
| **Wali Kelas** | `/api/dashboard/wali-kelas` | Rekap Capaian Rombel, Persentase Target Rombel | Read-Only | Rombel Scope |
| **Kepala Sekolah** | `/api/dashboard/kepala-sekolah` | Capaian per Kelas, Siswa Belum Mencapai Target | Read-Only | Unit Scope |
| **Divisi Pendidikan / Yayasan** | `/api/foundation/dashboard`, `/api/foundation/reports` | Rekap Agregat Lintas Unit, Total Ayat/Surah Terhafal | Read-Only | Foundation Scope |
| **Portal Orang Tua** | `/api/portal/tahfizh` | Target Aktif Anak, Setoran Terbaru, Audio Murajaah | Read-Only (Audio Upload) | Parent-Child Scope |
| **Portal Siswa** | `/api/portal/tahfizh` | Target Pribadi, Riwayat Setoran, Capaian % | Read-Only | Student Scope |
