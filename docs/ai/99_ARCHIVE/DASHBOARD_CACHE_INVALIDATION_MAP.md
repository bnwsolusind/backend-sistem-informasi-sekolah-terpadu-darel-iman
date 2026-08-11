# DASHBOARD CACHE INVALIDATION MAP — SESI 9

Tanggal: 2026-08-06
Tujuan: memetakan titik cache/aggregate dashboard dan kapan harus invalidasi agar KPI tidak basi. Berfokus pada komponen yang menulis data yang menjadi sumber KPI dashboard.

## 1. Sumber data TULIS → Baca Dashboard

| Aksi Tulis | Sumber Data | Dashboard yang Terpengaruh | Invalidation |
|---|---|---|---|
| Simpan `attendances` | `attendances` | Pemantauan, Kepsek, TU (kehadiran hari ini/7 hari/donut) | Invalidate query cache/aggregate kehadiran pada submit attendance |
| Simpan `tahfizh_records` (setoran) | `tahfizh_records` | Pemantauan (bar tahfizh), Guru Tahfizh | Invalidate tahfizh aggregate setelah simpan/update setoran |
| Simpan `mutabaah_daily_headers` / verifikasi | `mutabaah_daily_headers` | Portal Guru (count belum diverifikasi) | Invalidate count mutabaah milik supervisor user |
| Simpan `student_notes` | `student_notes` | Waka Kesiswaan, Portal Guru | Invalidate catatan siswa per unit/kelas |
| Simpan `rekap_prestasi_siswas` | `rekap_prestasi_siswas` | Waka Kesiswaan, Pemantauan | Invalidate rekap prestasi |
| Simpan `pengumuman_sekolahs` | `pengumuman_sekolahs` | Pemantauan | Invalidate pengumuman list |
| Simpan `indikator_kinerja_utama` | `indikator_kinerja_utama` | Pemantauan | Invalidate KPI |
| Simpan `pemantauan_divisis` | `pemantauan_divisis` | Pemantauan | Invalidate daftar pemantauan divisi |
| Mutasi siswa (pindah kelas/unit) | `students` | Semua dashboard (total siswa, kelas, kehadiran) | Set `is_active=false` assignment lama (BUG-S8-08); invalidate siswa |
| Update profil/status siswa | `students` | Semua dashboard | Invalidate per unit |

## 2. Mekanisme yang Dipakai
- Frontend: query key reaktif (cth `[child_id, activeTab]` untuk parent portal, BUG-S8-03) sehingga pergantian scope langsung memuat ulang data.
- Backend: aggregate dihitung langsung dari DB per request (tanpa cache stale) pada service dashboard; `Schema::hasTable()` menjaga fallback deterministik.
- Route guard berbasis permission (bukan cache) — cache tidak pernah menyimpan data lintas-user.

## 3. Aturan
1. Tidak ada cache global yang membocorkan data antar user — setiap dashboard query scoped per request.
2. Setiap aksi tulis di atas memicu refresh pada halaman terkait (invalidate/refetch) sebelum rendering berikutnya.
3. Verifikasi sync: lihat DASHBOARD_SYNC_TEST_MATRIX.md.
