# Dokumen Alur & Moderasi Diskusi Kelas

```text
TOPIC OWNER: Guru pengampu pemilik Modul Ajar (LmsModulAjar.guru_id)
PARENT: lms_modul_ajar (FK: modul_ajar_id)
TARGET CLASS/ROMBEL: Kelas siswa terdaftar pada parent Modul Ajar (LmsModulAjar.kelas_id)
STUDENT ACCESS:
  - Melihat topik diskusi kelas sendiri.
  - Mengirim komentar dengan user_id terotentikasi.
  - Membalas komentar utama/parent comment.
COMMENT OWNERSHIP: Komentar diikat ke user_id pengirim. Siswa hanya dapat mengedit/menghapus komentar milik sendiri selama topik belum ditutup.
REPLY STRUCTURE: Hierarkis 2-tier (Komentar Utama -> Balasan Komentar via parent_id).
MODERATION:
  - Guru dapat menyematkan topik (is_pinned).
  - Guru dapat menutup/membuka topik (is_closed).
  - Guru dapat menghapus komentar bermasalah.
  - Guru/Sistem menandai balasan sebagai solusi (is_solution).
OPEN/CLOSE RULE: Diskusi yang ditutup (is_closed = true) menolak penambahan komentar baru (HTTP 422).
SOFT DELETE: Model LmsDiskusi dan LmsDiskusiKomentar menggunakan SoftDeletes.
SECURITY: Sanitasi isi konten dari skrip XSS berbahaya, rate-limiting posting komentar.
AUDIT LOG: Setiap aksi pembuatan, pembaharuan, moderasi, dan penghapusan diskusi/komentar dicatat dalam log audit.
API:
  - GET /api/lms/diskusi
  - POST /api/lms/diskusi
  - GET /api/lms/diskusi/{id}
  - PUT /api/lms/diskusi/{id}
  - DELETE /api/lms/diskusi/{id}
  - POST /api/lms/diskusi/{id}/toggle-pin
  - POST /api/lms/diskusi/{id}/toggle-close
  - POST /api/lms/diskusi/{id}/komentar
  - DELETE /api/lms/diskusi/{diskusiId}/komentar/{komentarId}
  - GET /api/lms/diskusi/stats
  - GET /api/lms/diskusi/options
STATUS: VERIFIED — DISCUSSION OWNERSHIP FIXED
```