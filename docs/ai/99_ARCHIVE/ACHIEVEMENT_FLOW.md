# Dokumen Alur Kerja Prestasi Siswa (ACHIEVEMENT_FLOW.md)

Dokumen ini merinci alur pengajuan, pengunggahan bukti, verifikasi, dan penyajian prestasi siswa.

```text
ENTITY: Student Achievement Record
TABLE: rekap_prestasi_siswa
MODEL: App\Models\RekapPrestasiSiswa
PARENT: Student (student_id), EducationUnit
CHILD: File Attachment (bukti_prestasi)
FOREIGN KEY: student_id, education_unit_id, academic_year_id, semester_id
OWNER: Kesiswaan / Wali Kelas / Admin
UNIT SCOPE: EducationUnit Scope
TEACHER SCOPE: Homeroom / Teacher Scope
STUDENT SCOPE: Read-Only Prestasi Terverifikasi Siswa
ACADEMIC YEAR: AcademicYear aktif
SEMESTER: Semester aktif
PERMISSION: achievements.view, achievements.create, achievements.update, achievements.delete, achievements.verify, achievements.export
USED BY: DashboardPemantauanController, StudentParentPortalController, FoundationDashboardController
STATUS: VERIFIED — FULLY OPERATIONAL
```

## Alur Verifikasi Prestasi

```text
Pengajuan Prestasi (Siswa / Wali Kelas / Guru)
→ Unggah Berkas / Sertifikat Bukti
→ Status "Draft" / "Pending"
→ Peninjauan oleh Kesiswaan / Kepala Sekolah
→ Disetujui (Status "Verified") / Ditolak dengan Alasan
→ Masuk Rekap Resmi & Tampil di Dashboard / Portal
```

## Tingkat Prestasi
- Sekolah, Kecamatan, Kabupaten/Kota, Provinsi, Nasional, Internasional.
