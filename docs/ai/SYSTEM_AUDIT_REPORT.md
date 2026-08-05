# System Audit Report

Tanggal: 4 Agustus 2026

## Ringkasan

Audit dan perbaikan langsung pada batch ini mencakup autentikasi, permission master data ibadah, QR credential, dashboard yayasan, laporan ringkas yayasan, route guard frontend, serta akses data siswa berbasis role dan unit pendidikan.

| Metrik | Jumlah |
| --- | ---: |
| Modul/area diaudit | 7 |
| Modul/area diperbaiki | 7 |
| Migration tambahan | 0 |
| Endpoint publik tulis yang ditutup | 16 |
| Test akses regresi | 9 |
| Duplikasi route yang dipertahankan untuk kompatibilitas | 6 |

## Status Modul

| Modul | Status | Catatan |
| --- | --- | --- |
| Authentication | FIXED | Fallback password lintas akun dihapus. |
| QR Credential | FIXED | Pembuatan dan pencabutan dibatasi oleh `sistem.master_data`. |
| Master Al-Qur'an / Doa / Jadwal Shalat | FIXED | Operasi tulis memerlukan Sanctum dan permission; runtime fallback data statis dihapus. |
| Dashboard dan Laporan Yayasan | FIXED | Data agregat dan ekspor dilindungi permission yayasan; preview laporan memakai database. |
| Permission Guard Frontend | FIXED | Bypass untuk role staf dihapus. |
| Data Siswa | FIXED | CRUD dan dashboard memerlukan permission kesiswaan.data_lengkap_siswa; pengguna unit hanya dapat mengakses unitnya. |
| Modul di luar scope | NOT AUDITED | Keuangan, perpustakaan, sarana prasarana, dan PPDB tidak diubah. |

## Risiko tersisa

Audit menyeluruh seluruh CRUD, model, API, dan scope unit belum dapat dinyatakan selesai hanya dari batch ini. Rincian risiko terdapat pada `REMAINING_ISSUES.md`.
