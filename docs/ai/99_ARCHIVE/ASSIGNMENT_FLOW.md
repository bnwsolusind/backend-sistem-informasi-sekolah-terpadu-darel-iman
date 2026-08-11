# Penugasan Siswa Flow & Security Specification — Sesi 5

## Overview
Modul Penugasan Siswa (`lms_penugasan`) mengelola seluruh tugas mandiri, PR, proyek, dan latihan dari Guru untuk Rombongan Belajar (Rombel/Kelas) tertentu.

## Source of Truth & Models
- **Tabel Utama**: `lms_penugasan`
- **Relasi Entitas**:
  - `mata_pelajaran_id` -> `subjects.id` (FK)
  - `kelas_id` -> `tbl_kelas.id` (FK Rombel Aktif)
  - `guru_id` -> `employees.id` (FK Guru Pengampu)
  - `semester_id` -> `semesters.id` (FK)
  - `tahun_ajaran_id` -> `academic_years.id` (FK)
  - `modul_ajar_id` -> `lms_modul_ajar.id` (FK Opsional)

## Flow Penugasan
1. **Pembuatan Penugasan (Guru / Kurikulum)**:
   - Guru membuat penugasan melalui `POST /api/lms/penugasan`.
   - Mengisi judul, deskripsi, instruksi, tipe (`individu`/`kelompok`), jenis (`tugas`, `proyek`, `quiz`, `latihan`), nilai maksimal, bobot %, deadline, dan izin keterlambatan (`izin_kumpul_terlambat`).
   - Penugasan secara default disimpan dalam status Draft (`is_published: false`).
2. **Publikasi Penugasan**:
   - Guru mempublikasikan tugas melalui `POST /api/lms/penugasan/{id}/toggle-publish`.
   - Tugas yang terpublikasi (`is_published: true`) otomatis muncul di Portal Siswa dan Portal Orang Tua.
3. **Pengerjaan & Pengumpulan**:
   - Siswa melihat tugas di kelasnya melalui `GET /api/portal/assignments`.
   - Siswa mengumpulkan jawaban teks, link URL, atau lampiran file via `POST /api/lms/pengumpulan-tugas` atau `POST /api/portal/assignments/{id}/submit`.
4. **Penilaian oleh Guru**:
   - Guru memeriksa pengumpulan tugas di `GET /api/lms/pengumpulan-tugas` atau `GET /api/teacher/submissions`.
   - Guru menginput nilai (`nilai_guru`) dan catatan (`catatan_guru`) via `PUT /api/lms/pengumpulan-tugas/{id}` atau `POST /api/lms/penugasan/{id}/nilai`.
   - Field `waktu_dinilai` dan `dinilai_oleh` terisi otomatis dengan timestamp dan Employee ID Guru.

## Security & Scoping
- **Teacher Scope**: Guru hanya dapat membuat dan memperbarui penugasan untuk rombel dan mata pelajaran yang diampunya.
- **Student Scope**: Siswa hanya dapat melihat tugas yang berstatus `is_published: true` di `kelas_id` tempat siswa terdaftar.
- **Late Policy Enforcement**: Jika `now() > deadline` dan `izin_kumpul_terlambat = false`, pengumpulan tugas ditolak dengan pesan error yang jelas.
