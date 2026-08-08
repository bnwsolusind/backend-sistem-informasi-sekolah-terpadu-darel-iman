# ROLE MATRIX

Tanggal sertifikasi: 2026-08-08  
Source of truth: PostgreSQL `roles`, Spatie Permission. Alias historis tetap dipertahankan agar kontrak API tidak berubah.

| # | Role kanonik | Scope data | Template akses |
|---:|---|---|---|
| 1 | Super Admin | Global, seluruh unit | Seluruh permission |
| 2 | Ketua Yayasan | Lintas unit, read/report | Foundation |
| 3 | Pengurus Yayasan | Lintas unit, read/report | Foundation |
| 4 | Sekretaris Yayasan | Lintas unit, read/report | Foundation |
| 5 | Bendahara Yayasan | Lintas unit, read/report | Foundation |
| 6 | Kepala Bidang Pendidikan | Lintas unit pendidikan | Divisi Pendidikan |
| 7 | Divisi Kurikulum | Lintas unit akademik | Waka Kurikulum |
| 8 | Divisi Kesiswaan | Lintas unit kesiswaan | Waka Kesiswaan |
| 9 | Divisi Bahasa | Lintas unit pendidikan | Divisi Pendidikan |
| 10 | Divisi Program Khusus | Lintas unit pendidikan | Divisi Pendidikan |
| 11 | Kepala Sekolah | Unit sendiri | Kepala Sekolah |
| 12 | Wakil Kepala Sekolah | Unit sendiri | Waka Kurikulum |
| 13 | Wakil Kurikulum | Unit/akademik sendiri | Waka Kurikulum |
| 14 | Wakil Kesiswaan | Unit/kesiswaan sendiri | Waka Kesiswaan |
| 15 | Tata Usaha | Unit sendiri | Tata Usaha |
| 16 | Operator | Unit sendiri | Tata Usaha/Operator |
| 17 | Guru | Penugasan/jadwal/rombel sendiri | Guru |
| 18 | Guru Tahfizh | Penugasan/tahfizh sendiri | Guru Tahfizh |
| 19 | Guru BK | Siswa layanan sendiri | Guru BK |
| 20 | Wali Kelas | Rombel sendiri | Wali Kelas |
| 21 | Musyrif | Kelompok binaan sendiri | Musyrif |
| 22 | Orang Tua | Anak tertaut | Parent portal |
| 23 | Siswa | Data sendiri | Student portal |
| 24 | Alumni | Data sendiri | Alumni portal |

Hasil PostgreSQL: **24/24 role kanonik tersedia**, tidak ada role hilang. Runtime mengambil role melalui relasi Spatie/database; array pada seeder hanya merupakan bootstrap idempotent.

