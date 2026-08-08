# SESI 12 — MANUAL ACCEPTANCE CHECKLIST (FRONTEND/INFRA — WAJIB DI LOKAL/STAGING)

> Backend sudah tervalidasi otomatis (267/1026 SQLite; 53/225 PG). Checklist berikut untuk hal yang
> hanya dapat dibuktikan dengan mata/operasional: UI bell, alur chat per role, dan scheduler cron.

## A. Notifikasi (bell staf)

- [ ] Login sebagai Guru/Wali Kelas/Admin/Tata Usaha → ikon lonceng menampilkan **data real**
      (bukan mock). Jika tidak ada notifikasi → drawer menampilkan empty state (bukan item palsu).
- [ ] Badge menunjukkan jumlah belum dibaca (maksimum tampil `9+`).
- [ ] Klik item notifikasi → item ditandai dibaca satu per satu; badge berkurang.
- [ ] Tombol "Tandai semua dibaca" → semua menjadi terbaca; badge hilang.
- [ ] Saat API gagal (offline/500) → drawer menampilkan pesan error, tidak hang/blank.
- [ ] Siswa/Orang Tua → section "Informasi Sekolah" di portal menampilkan informasi real dari API
      (tanpa data palsu); tombol "Saya Sudah Membaca"/simpan bekerja.

## B. Chat per role

- [ ] **Orang Tua / Siswa**: daftar kontak hanya berisi **wali kelas + guru mapel aktif** anak.
      Guru lain tidak muncul; akses manual ke guru lain → 404/403.
- [ ] **Guru**: daftar percakapan hanya siswa yang diajar (wali kelas / jadwal aktif).
      Siswa kelas lain tidak muncul; akses manual → 403/404.
- [ ] **Pegawai (employee chat)**: direktori hanya menampilkan pegawai **unit yang sama** + aktif.
      Pengguna non-staf (Orang Tua/Siswa) tidak dapat membuka `/employee/chat/*`.
- [ ] Mengirim pesan ke akun non-pegawai → ditolak (403/UI error).

## C. Auto-timeout CBT

- [ ] `php artisan schedule:list` menampilkan `cbt:auto-timeout` (every minute).
- [ ] Mulai ujian → biarkan melewati `durasi_menit` → jalankan `php artisan cbt:auto-timeout`
      → sesi berubah `timeout`; `php artisan cbt:auto-timeout` sekali lagi → `0` diproses (idempotent).
- [ ] Hasil ujian (monitoring guru) menampilkan sesi tersebut dengan status `timeout`,
      jawaban objektif ternilai, esai pending review.
- [ ] Cron produksi terpasang: `* * * * * php artisan schedule:run`.

## D. Build & lint

- [ ] `cd web-dashboard && npm install && npm run lint` → 0 error.
- [ ] `npm run build` → success.

## E. Catatan untuk auditor

- PG 17 runtime verification **PENDING** (hanya PG 14.23 tersedia lokal). Sama seperti Sesi 11.
- Tidak ada automated frontend test; perilaku UI bergantung checklist manual di atas.
