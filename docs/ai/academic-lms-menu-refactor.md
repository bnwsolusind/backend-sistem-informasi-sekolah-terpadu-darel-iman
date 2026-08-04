# Refactor Menu Akademik & LMS

## Hasil

Sidebar 21 entri diringkas menjadi enam entri: Dashboard Akademik, Pengaturan Akademik, Perencanaan Pembelajaran, Pembelajaran, Tugas & Evaluasi, serta Nilai & Rapor. Tidak ada page CRUD, endpoint, atau route lama yang dihapus.

| Container | Tab | Route |
|---|---|---|
| Pengaturan Akademik | Tahun Ajaran, Semester, Kurikulum, Kelas & Rombel, Mata Pelajaran, Jadwal | `/dashboard/akademik/pengaturan?tab=...` |
| Perencanaan | CP, TP, Modul Ajar | `/dashboard/akademik/perencanaan?tab=...` |
| Pembelajaran | Materi, Media, Referensi, Aktivitas, Diskusi | `/dashboard/akademik/pembelajaran?tab=...` |
| Tugas & Evaluasi | Penugasan, Pengumpulan, Kisi-kisi, Bank Soal, CBT | `/dashboard/akademik/evaluasi?tab=...` |
| Nilai & Rapor | Buku Nilai, Rekap Nilai, Rapor Digital | `/dashboard/akademik/nilai-rapor?tab=...` |

Tab disimpan pada query URL sehingga refresh, back, forward, dan deep link tetap bekerja. Query parameter selain `tab` dipertahankan saat tab berpindah. Container merender page CRUD lama, sehingga dampak backend nihil. Route lama dipertahankan sebagai kompatibilitas bagi bookmark, notifikasi, dan tautan internal lama.
