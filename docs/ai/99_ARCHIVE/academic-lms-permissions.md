# Permission Akademik & LMS

Permission yang terverifikasi di `RolePermissionSeeder` dan guard sidebar:

| Permission | Area | Aksi/Endpoint |
|---|---|---|
| `sistem.master_data` | master akademik dan LMS umum | akses menu/page; backend tetap menjadi otoritas |
| `pembelajaran.kurikulum.view/create/edit/delete/restore/import/export` | Kurikulum | CRUD dan operasi khusus kurikulum |
| `pembelajaran.materi` | Materi | menu dan akses materi |
| `pembelajaran.kisi_kisi_ujian` | Kisi-kisi | menu kisi-kisi |
| `pembelajaran.bank_soal` | Bank Soal | menu bank soal |
| `pembelajaran.jadwal_pelajaran` | Jadwal | menu jadwal |
| `kesiswaan.kelas_rombel` | Kelas/Rombel | akses kelas dan rombel |
| `kesiswaan.penugasan_siswa` | Penugasan | akses menu penugasan |

`Super Admin` melewati filter menu frontend sesuai implementasi existing. Role lain memperoleh permission melalui `RolePermissionSeeder::syncPermissions`. Container tidak mengganti permission, policy, middleware, atau validasi endpoint. Siswa dan orang tua tetap diarahkan ke portal khusus; endpoint Laravel tetap wajib memvalidasi otorisasi walaupun tab tidak tampak.
