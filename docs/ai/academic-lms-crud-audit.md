# Audit CRUD Akademik & LMS

Status didasarkan pada page/service/route/controller/model yang ditemukan. `—` berarti kemampuan tersebut tidak ditemukan sebagai kontrak modul, bukan dinyatakan rusak. Build frontend tidak membuktikan koneksi database runtime.

| Modul | List | Create | Detail | Update | Delete | Filter | Import | Export | Permission | Status | Catatan |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Tahun Ajaran | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | sistem.master_data | STABIL | stats, dropdown, set aktif, restore |
| Semester | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | options, stats, duplicate, toggle status |
| Kurikulum | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | pembelajaran.kurikulum.* | STABIL | restore tersedia |
| Kelas/Rombel | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | kesiswaan.kelas_rombel | STABIL | options, stats, siswa, restore |
| Mata Pelajaran | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | sistem.master_data | STABIL | bulk status/delete, restore |
| Jadwal Pelajaran | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | pembelajaran.jadwal_pelajaran | STABIL | API resource schedules |
| Capaian Pembelajaran | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | dropdown, stats, restore |
| Tujuan Pembelajaran | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | options, stats, restore |
| Modul Ajar | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | sistem.master_data | STABIL | publish, duplicate, revisions, PDF |
| Materi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | pembelajaran.materi | STABIL | options, stats, restore |
| Media | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | reorder tersedia |
| Referensi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | options, stats, restore |
| Aktivitas Belajar | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | options, stats, restore |
| Diskusi Kelas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | komentar, pin, close |
| Penugasan | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | kesiswaan.penugasan_siswa | STABIL | publish dan grading |
| Pengumpulan Tugas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | options, stats, restore |
| Kisi-kisi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | pembelajaran.kisi_kisi_ujian | STABIL | duplicate, restore |
| Bank Soal | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | pembelajaran.bank_soal | STABIL | duplicate, restore |
| CBT | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | session, submit, results, essay grading |
| Penilaian LMS | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | sistem.master_data | STABIL | calculate-auto |
| Rapor Digital/PDF | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | PDF | sistem.master_data | STABIL | generate class dan export PDF |

Tidak ditemukan kegagalan kontrak yang aman untuk diperbaiki tanpa mengganggu perubahan backend pengguna yang sedang berlangsung. Karena itu sinkronisasi pada tahap ini hanya menghubungkan seluruh page lama ke container baru.
