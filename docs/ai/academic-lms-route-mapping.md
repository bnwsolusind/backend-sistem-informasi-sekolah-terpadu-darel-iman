# Mapping Route Akademik & LMS

Semua route lama tetap terdaftar di `web-dashboard/src/routes/index.jsx`.

| Modul | Route Lama | Route Baru | API Endpoint | Komponen | Kompatibilitas |
|---|---|---|---|---|---|
| Tahun Ajaran | `/dashboard/master-tahun-ajaran` | `/dashboard/akademik/pengaturan?tab=tahun-ajaran` | `/api/v1/tahun-ajaran` | `MasterTahunAjaranPage` | Dipertahankan |
| Semester | `/dashboard/master-modul-semester` | `...?tab=semester` | `/api/v1/modul-semester` | `MasterModulSemesterPage` | Dipertahankan |
| Kurikulum | `/dashboard/master-kurikulum` | `...?tab=kurikulum` | `/api/v1/kurikulum` | `MasterKurikulumPage` | Dipertahankan |
| Kelas/Rombel | `/dashboard/students/rombel` | `...?tab=kelas-rombel` | `/api/kelas` | `MasterKelasPage` | Dipertahankan |
| Mata Pelajaran | `/dashboard/master-subjects` | `...?tab=mata-pelajaran` | `/api/v1/subjects` | `MasterSubjectPage` | Dipertahankan |
| Jadwal | `/dashboard/jadwal-pelajaran` | `...?tab=jadwal` | `/api/schedules` | `MasterSchedulePage` | Dipertahankan |
| CP | `/dashboard/lms/capaian-pembelajaran` | `/dashboard/akademik/perencanaan?tab=cp` | `/api/lms/capaian-pembelajaran` | `MasterCapaianPembelajaranPage` | Dipertahankan |
| TP | `/dashboard/lms/tujuan-pembelajaran` | `...?tab=tp` | `/api/lms/tujuan-pembelajaran` | `MasterTujuanPembelajaranPage` | Dipertahankan |
| Modul Ajar | `/dashboard/lms/modul-ajar` | `...?tab=modul-ajar` | `/api/lms/modul-ajar` | `LmsModulAjarPage` | Dipertahankan |
| Materi/Media/Referensi | `/dashboard/lms/{modul}` | `/dashboard/akademik/pembelajaran?tab={modul}` | `/api/lms/{modul}` | Page LMS terkait | Dipertahankan |
| Aktivitas/Diskusi | `/dashboard/lms/{modul}` | `/dashboard/akademik/pembelajaran?tab={modul}` | `/api/lms/{modul}` | Page LMS terkait | Dipertahankan |
| Penugasan/Pengumpulan | `/dashboard/lms/{modul}` | `/dashboard/akademik/evaluasi?tab={modul}` | `/api/lms/{modul}` | Page LMS terkait | Dipertahankan |
| Kisi-kisi/Bank Soal/CBT | `/dashboard/lms/{modul}` | `/dashboard/akademik/evaluasi?tab={modul}` | `/api/lms/{modul}` | Page LMS terkait | Dipertahankan |
| Penilaian | `/dashboard/lms/penilaian` | `/dashboard/akademik/nilai-rapor?tab=buku-nilai` | `/api/lms/penilaian` | `LmsPenilaianPage` | Dipertahankan |
| Rapor | `/dashboard/lms/rapor` | `...?tab=rapor` | `/api/lms/rapor` | `LmsRaporPage` | Dipertahankan |
