# Dokumen Alur Kerja Mutabaah Yaumiyah (MUTABAAH_FLOW.md)

Dokumen ini menjelaskan pengelolaan Mutabaah Yaumiyah (checklist ibadah harian), verifikasi pembimbing/musyrif, dan persetujuan orang tua.

```text
ENTITY: Mutabaah Yaumiyah Daily Header & Details
TABLE: mutabaah_daily_headers, mutabaah_daily_details, mutabaah_parent_signatures
MODEL: App\Models\MutabaahDailyHeader, App\Models\MutabaahDailyDetail, App\Models\MutabaahParentSignature
PARENT: Student, MutabaahTemplate, MutabaahSupervisorAssignment
CHILD: MutabaahDailyDetail, MutabaahActivityNote, MutabaahParentSignature
FOREIGN KEY: student_id, template_id, supervisor_assignment_id, education_unit_id, academic_year_id, semester_id
OWNER: Siswa / Musyrif / Pembimbing
UNIT SCOPE: EducationUnit Scope
TEACHER SCOPE: Supervisor Assignment Scope
CLASS/ROMBEL SCOPE: Rombel Scope
STUDENT SCOPE: Input Checklist Harian Siswa
ACADEMIC YEAR: AcademicYear aktif
SEMESTER: Semester aktif
PERMISSION: mutabaah.view, mutabaah.create, mutabaah.update, mutabaah.verify, mutabaah.export
USED BY: MutabaahDailySpreadsheet, MutabaahEnterprisePage, MutabaahAnalyticsPage, ParentPortalPage, StudentPortalPage
STATUS: VERIFIED — FULLY OPERATIONAL
```

## Alur Kerja Mutabaah

```text
Konfigurasi Master Indikator & Template Mutabaah
→ Penugasan Pembimbing / Musyrif
→ Input Checklist Harian (Siswa / Musyrif / Spreadsheet)
→ Verifikasi & Finalisasi Musyrif/Pembimbing (status: finalized)
→ Peninjauan & Tanda Tangan Orang Tua (status: parent_signed)
→ Rekap & Sinkronisasi Analytics Dashboard
```
