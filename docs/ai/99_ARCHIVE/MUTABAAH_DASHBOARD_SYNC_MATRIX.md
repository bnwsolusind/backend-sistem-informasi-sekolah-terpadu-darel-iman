# Dokumen Sinkronisasi Dashboard Mutabaah (MUTABAAH_DASHBOARD_SYNC_MATRIX.md)

Dokumen ini merinci matriks sinkronisasi data Mutabaah Yaumiyah ke berbagai peran dashboard dan portal.

| Role / View | Endpoint API | Metrik Utama | Akses CRUD | Filter Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Guru / Musyrif** | `/api/mutabaah/daily/*`, `/api/mutabaah/enterprise/*` | Spreadsheet Daily Entry, Total Good/Less/Not Done, Status Finalisasi | Full CRUD / Finalisasi | Supervisor Assignment Scope |
| **Wali Kelas** | `/api/dashboard/wali-kelas` | Persentase Pengisian Rombel, Catatan Belum Ditandatangani | Read-Only | Rombel Scope |
| **Kepala Sekolah** | `/api/dashboard/kepala-sekolah` | Rata-rata Skor Mutabaah per Kelas, Evaluasi Pembiasaan | Read-Only | Unit Scope |
| **Portal Orang Tua** | `/api/parent/mutabaah/*` | Checklist Ibadah Anak, Status Tanda Tangan Digital | Input & Sign | Parent-Child Scope |
| **Portal Siswa** | `/api/student/mutabaah/*` | Checklist Mandiri Ibadah Harian, Grafik Kedisiplinan | Input Checklist | Student Scope |
