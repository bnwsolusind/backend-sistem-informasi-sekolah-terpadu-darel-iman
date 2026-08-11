# Change Log Akademik & LMS

| File | Jenis Perubahan | Alasan | Risiko | Hasil Pengujian |
|---|---|---|---|---|
| `web-dashboard/src/components/akademik/AcademicModuleContainer.jsx` | Baru | header dan tab URL reusable | Rendah | Build berhasil |
| `web-dashboard/src/pages/AcademicLmsContainerPage.jsx` | Baru | memetakan 21 CRUD lama ke 5 container | Sedang: page lama belum semuanya mengenali prop embedded | Build berhasil |
| `web-dashboard/src/routes/index.jsx` | Tambah route | route dashboard dan container baru | Rendah; route lama dipertahankan | Build berhasil |
| `web-dashboard/src/layouts/DashboardLayout.jsx` | Ringkas sidebar dan normalisasi active path | 21 entri menjadi 6; query tab tetap aktif | Rendah; permission existing tetap dipakai | Build dan lint berhasil |
| `docs/ai/README.md` | Sinkronisasi indeks | dokumentasi audit/refactor | Rendah | Dibaca manual |
| `docs/ai/academic-lms-*.md` | Baru | audit, mapping, relasi, permission, test | Rendah | Berdasarkan scan kode |

Tidak ada controller, request, resource, service, repository, model, seeder, migration, tabel, atau endpoint yang diubah pada refactor ini.

Validasi akhir: 153 route LMS terdaftar dan 25 test backend (88 assertion) lulus untuk integritas relasi, Modul Ajar, serta Tujuan Pembelajaran.

## Penyelarasan UI Pengaturan Akademik

| File | Perubahan | Dampak CRUD | Pengujian |
|---|---|---|---|
| `MasterSubjectPage.jsx` | mode embedded, breadcrumb, card/filter dark mode | Tidak ada | Build dan lint |
| `MasterSchedulePage.jsx` | mode embedded, KPI style, action button, tabel responsive dan dark mode | Tidak ada | Build dan lint |
| `MasterCapaianPembelajaranPage.jsx` | mode embedded, KPI/filter master, filter relasional kurikulum-mapel, tabel responsive, action standard | Tidak ada | Build dan lint |
| `MasterTujuanPembelajaranPage.jsx` | mode embedded, KPI/master controls, tabel responsive, status dan action standard | Tidak ada | Build dan lint |
| `LmsModulAjarPage.jsx` | mode embedded, hero/KPI master, tabel responsive | Tidak ada | Build dan lint |
