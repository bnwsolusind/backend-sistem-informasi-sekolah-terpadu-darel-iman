# Penilaian LMS Flow & Specification — Sesi 6

## Overview
Modul Penilaian LMS (`student_grades`) mengelola perhitungaan nilai rekap per mata pelajaran, penggabungan bobot nilai tugas & CBT, serta penetapan status kelulusan KKM per siswa.

## Data Model & Source of Truth
- **ENTITY**: Rekap Penilaian LMS
- **TABLE**: `student_grades`
- **MODEL**: `App\Models\StudentGrade`
- **SOURCE**: `lms_pengumpulan_tugas` (Tugas) + `lms_ujian_sesi` (CBT UH, UTS, UAS)
- **OWNER**: Guru Pengampu Mata Pelajaran & Wali Kelas
- **UNIT SCOPE**: `EducationUnit` via `Student` & `Kelas`
- **TEACHER SCOPE**: Guru hanya dapat menilai kelas & mapel yang diampunya
- **CLASS/ROMBEL SCOPE**: `tbl_kelas.id` (Rombel Aktif)
- **STUDENT SCOPE**: Siswa hanya dapat melihat nilai akhir milik sendiri yang telah dipublikasikan
- **ACADEMIC YEAR**: `academic_years.id`
- **SEMESTER**: `semesters.id`
- **STATUS**: `draft` | `finalized` | `approved` | `published`
- **PERMISSION**: `pembelajaran.materi` / `pembelajaran.modul_ajar` / `sistem.master_data`
- **USED BY**: Web Dashboard (`LmsPenilaianPage.jsx`), Teacher Portal, Student Portal, Parent Portal

## Auto-Calculation Formula Engine
Rumus baku kalkulasi nilai akhir per mata pelajaran:
$$\text{Nilai Akhir} = \frac{(\text{Nilai Tugas} \times W_{\text{tugas}}) + (\text{CBT UH} \times W_{\text{uh}}) + (\text{CBT UTS} \times W_{\text{uts}}) + (\text{CBT UAS} \times W_{\text{uas}})}{W_{\text{total}}}$$

Secara default:
- $W_{\text{tugas}} = 20\%$
- $W_{\text{uh}} = 25\%$
- $W_{\text{uts}} = 25\%$
- $W_{\text{uas}} = 30\%$
- KKM Default: $75.0$
