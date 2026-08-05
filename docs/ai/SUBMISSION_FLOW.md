# Pengumpulan Tugas (Submission) Flow & Security Specification — Sesi 5

## Overview
Modul Pengumpulan Tugas (`lms_pengumpulan_tugas`) mengelola seluruh pengumpulan jawaban tugas oleh siswa dan penilaian oleh guru.

## Database Schema & Constraints
- **Tabel Utama**: `lms_pengumpulan_tugas`
- **Constraint Unik**: `UNIQUE(['penugasan_id', 'siswa_id'])` (Satu siswa hanya memiliki 1 record pengumpulan per tugas; pengumpulan ulang akan meng-update record yang ada).
- **Status Lifecyle**:
  - `belum` (Default awal sebelum dikumpulkan)
  - `dikumpulkan` (Siswa sudah mengumpulkan jawaban sebelum deadline)
  - `terlambat` (Siswa mengumpulkan setelah deadline dengan izin keterlambatan)
  - `dinilai` (Guru sudah memberikan nilai)
  - `revisi` (Guru meminta siswa memperbaiki jawaban)

## Flow Pengumpulan & Penilaian
1. **Pengumpulan oleh Siswa**:
   - Siswa mengirim payload (`jawaban_teks`, `file_path`, `url_link`).
   - Sistem mencatat `waktu_kumpul = now()`.
   - Sistem memvalidasi apakah pengerjaan terlambat:
     - Jika `waktu_kumpul > penugasan.deadline`:
       - Jika `penugasan.izin_kumpul_terlambat = true` -> Status set `terlambat`.
       - Jika `penugasan.izin_kumpul_terlambat = false` -> Rejection HTTP 422.
2. **Penilaian oleh Guru**:
   - Guru menginput `nilai_guru` (0 - 100) dan `catatan_guru`.
   - Repository mencatat `waktu_dinilai = now()` dan `dinilai_oleh = employee.id` dari user yang login.
   - Status pengumpulan diperbarui menjadi `dinilai`.

## Security Rules
- **Student Authorization**: Siswa hanya dapat mengumpulkan/memperbarui tugas milik identitas dirinya sendiri (`siswa_id == auth()->user()->student->id`).
- **Grading Authorization**: `dinilai_oleh` diambil dari relasi Employee user login. Pengumpulan hanya dapat dinilai oleh Guru atau Admin Sekolah.
- **XSS & URL Protection**: Seluruh `url_link` divalidasi dan disanitasi untuk mencegah XSS.
