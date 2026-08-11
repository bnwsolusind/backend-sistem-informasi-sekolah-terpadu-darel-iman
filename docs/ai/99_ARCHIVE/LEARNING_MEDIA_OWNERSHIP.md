# Dokumen Kepemilikan & Hak Akses Media Pembelajaran

```text
MEDIA TABLE: lms_media
MEDIA MODEL: App\Models\LmsMedia
PARENT TABLE: lms_materi
PARENT MODEL: App\Models\LmsMateri
FOREIGN KEY: materi_id
RELATION TYPE: BelongsTo (LmsMedia -> LmsMateri) & HasMany (LmsMateri -> LmsMedia)
OWNER SOURCE: LmsMateri.guru_id (FK ke employees.id) -> Employee.user_id
TEACHER ASSIGNMENT CHECK: Validasi bahwa guru_id pada parent LmsMateri sesuai dengan employee_id dari user yang terotentikasi.
UNIT SCOPE: Evaluasi unit_pendidikan_id dari employee dan modul_ajar.
SUBJECT SCOPE: Evaluasi mata_pelajaran_id dari parent LmsMateri.
CLASS/ROMBEL SCOPE: Evaluasi kelas_id dari LmsModulAjar parent.
ACADEMIC YEAR SCOPE: Evaluasi tahun_ajaran_id dari LmsModulAjar parent.
SEMESTER SCOPE: Evaluasi semester_id dari LmsModulAjar parent.
PUBLICATION RULE: Media hanya tampil untuk siswa/orang tua apabila parent LmsMateri.is_published === true dan LmsModulAjar.status === 'published'.
FILE STORAGE: Storage disk 'public' path 'media_files/'. File terlindungi dari path traversal, hanya ekstensi aman (pdf, video, audio, ppt, word, image) yang diizinkan hingga maksimal 50MB.
DELETE RULE: Menghapus record lms_media secara fisik dan menghapus file fisik di storage.
ROLE ACCESS:
  - Guru Pemilik: View, Create, Update, Delete, Reorder.
  - Guru Lain: Ditolak (403 Forbidden).
  - Waka Kurikulum / Kepsek: View monitoring.
  - Siswa Target: Read-only untuk media yang dipublikasikan pada kelas terdaftar.
  - Orang Tua: Read-only untuk media yang dipublikasikan pada kelas anak terhubung.
  - Yayasan: Read-only monitoring.
API:
  - GET /api/lms/media (List & filter by materi_id, tipe_file, search)
  - GET /api/lms/media/{id} (Detail media)
  - POST /api/lms/media (Upload & simpan media baru)
  - PUT /api/lms/media/{id} (Update media/file)
  - DELETE /api/lms/media/{id} (Hapus media & file)
  - POST /api/lms/media/reorder (Urutkan posisi media)
  - GET /api/lms/media/stats (Statistik media)
  - GET /api/lms/media/options (Opsi materi parent)
STATUS: VERIFIED — MEDIA OWNERSHIP FIXED
```