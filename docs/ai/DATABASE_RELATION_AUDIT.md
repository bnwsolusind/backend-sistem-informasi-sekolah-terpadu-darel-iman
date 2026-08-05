# Database Relation Audit

## Tabel yang diverifikasi pada batch ini

| Table | Model | Primary key | Relasi/ketergantungan audit | Hasil |
| --- | --- | --- | --- | --- |
| `quran_surahs` | `QuranSurah` | bigint | Master surah dan detail Tahfizh | Tidak diubah |
| `doas` | `Doa` | unsigned integer | Master doa sinkronisasi | Tidak diubah |
| `jadwal_sholat_caches` | `JadwalSholatCache` | bigint | Master jadwal shalat | Tidak diubah |
| `qr_credentials` | `QrCredential` | UUID | User, siswa, pegawai | Tidak diubah; endpoint akses diperketat |
| `users`, `roles`, `permissions` | `User`, `Role`, `Permission` | UUID / bigint | Sanctum dan Spatie Permission | Tidak diubah; validasi password diperketat |

Tidak ada migration dibuat atau diubah. Perbaikan berasal dari route, service autentikasi, dan controller sehingga kompatibel dengan database yang telah ada.
