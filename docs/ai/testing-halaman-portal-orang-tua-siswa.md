# Checklist & Dokumentasi Pengujian Portal Orang Tua & Siswa

Dokumen ini berisi panduan dan checklist verifikasi pengujian 13 halaman **Portal Orang Tua & Siswa**.

## 1. Automated Testing (Backend)

Menjalankan pengujian fitur portal backend Laravel:

```bash
cd backend
php artisan test --filter=Portal
```

Item Pengujian Automated Backend:

1. `MultiPortalAuthTest`: Verifikasi otentikasi role `Orang Tua` dan `Siswa`.
2. `StudentParentPortalOwnershipTest`:
   - Verifikasi orang tua hanya dapat mengakses data anak yang terhubung.
   - Penolakan otorisasi (403/404) jika orang tua mencoba mengakses `child_id` siswa lain.
   - Verifikasi CBT tidak dapat dimulai oleh akun orang tua.
   - Verifikasi materi draft, tugas draft, dan kisi-kisi draft disembunyikan.

## 2. Automated Testing (Frontend Web)

Menjalankan pemeriksaan lint & typecheck frontend:

```bash
cd web-dashboard
npm run lint
```

Menjalankan build produksi web dashboard:

```bash
cd web-dashboard
npm run build
```

## 3. Manual Verification Checklist

| Skenario Pengujian | Hasil Diharapkan | Status |
| --- | --- | --- |
| Login akun Siswa -> Buka Portal | Dialihkan ke `/portal-siswa`, seluruh 13 halaman dapat diakses | LULUS |
| Login akun Orang Tua -> Buka Portal | Dialihkan ke `/portal-orangtua`, pemilih anak aktif (Child Switcher) tampil di banner | LULUS |
| Orang Tua ganti Anak Aktif | Seluruh data pada 13 halaman portal berubah sesuai anak yang dipilih | LULUS |
| Siswa buka Ujian CBT | Dapat melihat daftar ujian, instruksi, dan memulai ruang CBT | LULUS |
| Orang Tua buka Ujian CBT | Dapat melihat daftar ujian, tombol "Mulai Ujian" disembunyikan / dilarang | LULUS |
| Siswa kumpulkan Tugas | Form jawaban teks & upload lampiran file berfungsi | LULUS |
| Siswa simpan Mutabaah | Checklist harian tersimpan dan memperbarui statistik capaian | LULUS |
| Ajukan Izin / Sakit | Modal pengajuan izin mengirimkan data & lampiran bukti ke backend | LULUS |
| Unduh Rapor PDF | PDF Rapor resmi dapat terunduh dan tergenerate dari server | LULUS |
| Responsive Layout & Dark Mode | Tampilan adaptif pada layar HP, tablet, dan desktop; warna dark mode harmonis | LULUS |
