# Kisi-kisi Ujian (Exam Blueprint) Flow & Specification — Sesi 5

## Overview
Modul Kisi-kisi Ujian (`lms_kisi_kisi`) berfungsi sebagai cetak biru (blueprint) akademik pembuatan soal dan pelaksanaan ujian online / CBT.

## Relasi Akademik & Data Model
- **Tabel Utama**: `lms_kisi_kisi`
- **Relasi Parent**:
  - `kurikulum_id` -> `master_kurikulum.id`
  - `mata_pelajaran_id` -> `subjects.id`
  - `cp_id` -> `lms_capaian_pembelajaran.id`
  - `tp_id` -> `lms_tujuan_pembelajaran.id`
  - `kelas_id` -> `tbl_kelas.id`
  - `guru_id` -> `employees.id`

## Metrik Blueprint & Distribusi
- **Jenis Ujian**: `UH` (Ujian Harian), `PTS`/`UTS`, `PAS`/`UAS`, `CBT`, `Remedial`.
- **Level Kognitif**: Taxonomy Bloom (C1 - C6: Mengingat, Memahami, Menerapkan, Menganalisis, Mengevaluasi, Mencipta).
- **Distribusi Bobot JSON**: `{"pg": 60, "isian": 20, "esai": 20}`.

## Standard Workflow
1. **Pembuatan Kisi-kisi**: Guru/Wakakur menyusun kisi-kisi berbasis CP dan TP.
2. **Asosiasi Bank Soal**: Butir soal di `lms_bank_soal` dibuat dengan mengacu pada `kisi_kisi_id`.
3. **Pengikatan Sesi Ujian**: Sesi pengerjaan CBT (`lms_ujian`) dibuat berdasarkan `kisi_kisi_id`.
4. **Duplikasi Kisi-kisi**: Fitur `POST /api/lms/kisi-kisi/{id}/duplicate` memungkinkan penyalinan cetak biru untuk semester/tahun ajaran berikutnya.
