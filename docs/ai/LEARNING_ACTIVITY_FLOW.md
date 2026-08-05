# Dokumen Alur & Ownership Aktivitas Belajar

```text
ACTIVITY TYPE: Pendahuluan, Inti, Penutup, Diskusi, Kuis, Tugas, Presentasi, Refleksi, Eksperimen, Praktikum (Single source of truth via LmsAktivitasBelajarController@options)
PARENT: lms_modul_ajar (FK: modul_ajar_id)
TARGET: Kelas / Rombel terdaftar pada parent Modul Ajar (tbl_kelas.id)
OWNER: Guru pengampu pemilik Modul Ajar (LmsModulAjar.guru_id)
PUBLICATION FLOW: Aktivitas mengikuti status publikasi parent LmsModulAjar. Aktivitas berstatus 'draft' atau 'nonaktif' disembunyikan dari siswa.
STUDENT ACCESS: Read-only untuk aktivitas berstatus 'aktif' pada Modul Ajar yang dipublikasikan untuk kelas siswa.
STUDENT PROGRESS: Siswa memperbarui status penyelesaian aktivitas sendiri. Progress dicatat tanpa mengizinkan perubahan student_id oleh user lain.
PARENT ACCESS: Read-only monitoring progress belajar anak terhubung.
TEACHER MONITORING: Guru dapat melihat daftar aktivitas dan statistik ketercapaian per kelas penugasan.
CLOSE/ARCHIVE RULE: Aktivitas yang ditutup atau diarsipkan tetap menyimpan histori interaksi dan tidak dihapus.
DIFFERENCE FROM ASSIGNMENT:
  - Aktivitas Belajar: Pekerjaan/kegiatan interaksi belajar harian dalam kelas (membaca, menonton, refleksi, diskusi).
  - Penugasan Siswa (Assignments): Pekerjaan terstruktur yang memerlukan pengumpulan berkas/jawaban dan penilaian bobot nilai.
API:
  - GET /api/lms/aktivitas
  - POST /api/lms/aktivitas
  - GET /api/lms/aktivitas/{id}
  - PUT /api/lms/aktivitas/{id}
  - DELETE /api/lms/aktivitas/{id}
  - POST /api/lms/aktivitas/{id}/restore
  - GET /api/lms/aktivitas/stats
  - GET /api/lms/aktivitas/options
STATUS: VERIFIED — ACTIVITY OWNERSHIP FIXED
```