# Security and Access Hardening Audit

Tanggal audit: 4 Agustus 2026.

## Scope yang diaudit dan diperbaiki

| Modul | Temuan | Perbaikan | Status |
| --- | --- | --- | --- |
| Autentikasi | Password bootstrap untuk akun lain dapat diterima oleh fallback `verifyPassword`. | Fallback dihapus; hanya hash password milik akun yang dapat digunakan. | FIXED |
| Master Al-Qur'an, doa, jadwal shalat | Endpoint tulis, sinkronisasi, dan hapus dapat dipanggil tanpa token. | Aksi tulis memerlukan Sanctum dan `sistem.master_data`; endpoint baca tetap kompatibel. | FIXED |
| QR credential | Pengguna terautentikasi mana pun dapat membuat atau mencabut QR siswa/pegawai. | Endpoint dikelompokkan ke permission `sistem.master_data`. | FIXED |
| Dashboard yayasan | Semua pengguna bertoken dapat membaca data agregat lintas unit. | Endpoint dashboard memerlukan `foundation.dashboard.view`; laporan memerlukan permission laporan yang sesuai. | FIXED |
| Laporan ringkas yayasan | Respons berisi preview dan total statis. | Preview kini dihitung dari ringkasan unit yang berasal dari database. | FIXED |
| Guard frontend | Guard permission membypass pemeriksaan bagi banyak role staf. | Bypass dihapus; hanya Super Admin atau permission yang diberikan yang lolos. | FIXED |
| Fallback frontend master ibadah | Layanan master dapat menampilkan data bawaan atau data langsung dari pihak ketiga saat API sekolah gagal. | Fallback runtime dihapus; UI kini memunculkan error/empty state dari API sekolah. | FIXED |

## Dependency map

```text
Master Al-Qur'an / Doa / Jadwal Shalat
→ web-dashboard routes
→ equranService
→ /api/equran, /api/doa, /api/shalat
→ EQuranController
→ QuranSurah / Doa / JadwalSholatCache
→ sistem.master_data

Dashboard Yayasan
→ dashboard/yayasan routes
→ Foundation dashboard and report pages
→ /api/foundation/*
→ FoundationDashboardController / FoundationReportController
→ FoundationDashboardService / report services
→ foundation.dashboard.view / foundation.report.*
```

## Test coverage

`AccessControlHardeningTest` verifies unauthenticated mutations, forbidden master and QR access for Guru, blocked foundation access for Guru, and rejection of a password belonging to another bootstrap account.

## Remaining risks

- Public read endpoints remain intentionally available for public widgets; write actions are protected.
- Route-level protection is now enforced for the audited APIs. Other module endpoints need the same endpoint-by-endpoint audit before being claimed verified.
