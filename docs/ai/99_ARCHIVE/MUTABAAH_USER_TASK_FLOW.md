# Alur Pengguna Berdasarkan Peran Modul Mutaba’ah (MUTABAAH_USER_TASK_FLOW.md)

Dokumen ini merinci skenario alur kerja pengguna nyata (Task-Based Workflows) untuk peranan Tata Usaha, Pembimbing/Musyrif, Wali Kelas, dan Kepala Sekolah.

---

## 1. Task Flow Tata Usaha (TU / Operator)

```text
USER: Tata Usaha / Operator Sekolah
GOAL: Menyiapkan master indikator, template harian, menetapkan penugasan ke rombel, dan menugaskan pembimbing.
START PAGE: /dashboard/mutabaah
STEPS:
1. Buka Rincian Agenda TU (/dashboard/mutabaah/rincian-agenda) → Klik "+ Tambah Agenda" → Isi Kode, Nama, Kategori, Tipe Input, dan Bobot → Simpan.
2. Buka Template Agenda (/dashboard/mutabaah/template-agenda) → Klik "+ Tambah Template" → Isi Kode, Nama, Unit, dan Semester → Simpan.
3. Klik ikon "Susun Agenda" pada template → Pilih agenda indikator yang baru dibuat → Atur bobot, target default, dan paraf ortu → Simpan.
4. Buka Assign Template (/dashboard/mutabaah/assign-template) → Klik "+ Assign Template" → Pilih Template, Unit, Rombel, dan Tanggal Mulai → Simpan (Sistem memvalidasi tidak ada bentrok periode).
5. Buka Assign Pembimbing (/dashboard/mutabaah/assign-pembimbing) → Klik "+ Assign Pembimbing" → Pilih Musyrif/Wali Kelas, Rombel, dan Otorisasi → Simpan.
EXPECTED RESULT: Seluruh template dan pembimbing aktif terpasang ke rombel tanpa terjadi kesalahan konfigurasi.
FRICTION FOUND: -
IMPROVEMENT: Ditambahkan sub-navigasi kontekstual horizontal untuk perpindahan cepat antar tahap konfigurasi.
STATUS: VERIFIED
```

---

## 2. Task Flow Pembimbing / Musyrif

```text
USER: Musyrif / Pembimbing Mutaba'ah
GOAL: Memantau keterisian pembiasaan harian santri binaan dan mengevaluasi pencapaian target.
START PAGE: /dashboard/mutabaah
STEPS:
1. Login sebagai Musyrif → Buka Dashboard Mutaba’ah → Lihat ringkasan KPI "Terisi Hari Ini" dan "Perlu Evaluasi".
2. Buka Target & Evaluasi (/dashboard/mutabaah/target-evaluasi) → Filter Rombel binaan.
3. Tinjau bar indikator realisasi % vs target → Siswa dengan capaian <75% ditandai badge "Perlu Bimbingan".
4. Klik "Detail Evaluasi" pada siswa → Tinjau rincian indikator yang belum dilaksanakan → Catat saran pembimbingan.
EXPECTED RESULT: Pembimbing langsung menemukan santri yang membutuhkan perhatian khusus secara presisi.
STATUS: VERIFIED
```

---

## 3. Task Flow Wali Kelas

```text
USER: Wali Kelas
GOAL: Mengevaluasi rekapitulasi kelas dan memantau status paraf digital dari orang tua siswa.
START PAGE: /dashboard/mutabaah/rekap
STEPS:
1. Buka Rekap Mutaba’ah (/dashboard/mutabaah/rekap) → Filter Kelas & Semester aktif.
2. Klik tab "Per Siswa" → Tinjau keterisian harian dan persentase capaian target seluruh siswa di kelasnya.
3. Buka Monitoring Orang Tua (/dashboard/mutabaah/monitoring-orang-tua) → Filter status "Belum Menandatangani".
4. Klik "Audit Detail" pada siswa terkait untuk mengetahui riwayat tanggal pengiriman dan komentar orang tua.
5. Klik "Export Rekap" untuk mengunduh laporan PDF/Excel rekap kelas.
EXPECTED RESULT: Laporan rekap kelas terunduh lengkap dengan status verifikasi wali murid.
STATUS: VERIFIED
```

---

## 4. Task Flow Kepala Sekolah & Manajemen

```text
USER: Kepala Sekolah / Divisi Pendidikan
GOAL: Memantau keterisian Mutaba’ah lintas unit dan memastikan program pembiasaan karakter berjalan efektif.
START PAGE: /dashboard/mutabaah
STEPS:
1. Buka Dashboard Mutaba’ah → Tinjau KPI Total Siswa Dipantau & Persentase Realisasi Baik.
2. Tinjau Grafik Tren Keterisian 30 Hari dan Distribusi Status Pembiasaan.
3. Klik Banner "Perlu Perhatian Hari Ini" untuk memfilter unit atau rombel dengan keterisian terendah.
4. Buka Target & Evaluasi untuk memastikan evaluasi periodik telah dilaksanakan oleh tim pembimbing.
EXPECTED RESULT: Manajemen sekolah memiliki visibilitas penuh terhadap efektivitas program Mutaba'ah.
STATUS: VERIFIED
```
