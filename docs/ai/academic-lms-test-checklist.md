# Checklist Pengujian Akademik & LMS

## Otomatis yang dijalankan

- [x] `npm run build` berhasil (Vite, 3145 modul ditransformasi).
- [x] Seluruh import page container dapat di-resolve oleh bundler.
- [x] Route container dan query tab lolos build produksi.
- [x] Route lama tetap terdaftar; tidak ada penghapusan route.
- [x] Laravel mendaftarkan 153 route `api/lms`.
- [x] 25 test backend lulus (88 assertion): integritas relasi, Modul Ajar API, dan Tujuan Pembelajaran API.
- [x] Lint selesai tanpa error; warning existing tetap tercatat oleh oxlint.
- [x] Tidak ada migration atau skema yang diubah.

## Perlu uji integrasi dengan pengguna/database berisi data

- [ ] Navigasi tiap tab, refresh, back, forward, dan deep link.
- [ ] Filter, search, debounce, pagination, loading, empty, retry.
- [ ] Create, detail, update, delete/restore tiap modul.
- [ ] Import/export/duplicate/publish/archive yang tersedia.
- [ ] Matriks role dan permission frontend/backend.
- [ ] Dropdown CP berdasarkan mapel; TP berdasarkan CP; Modul Ajar berdasarkan TP.
- [ ] Penugasan → pengumpulan → nilai; kisi-kisi → bank soal → CBT.
- [ ] Preview, unduh, cetak, dan publikasi rapor/PDF.
- [ ] Responsive mobile/tablet/desktop, dark mode, modal/drawer.
- [ ] Audit log dan notifikasi/deep link lama.

Pengujian database destruktif (`migrate:fresh`, wipe, reset) tidak dijalankan.
