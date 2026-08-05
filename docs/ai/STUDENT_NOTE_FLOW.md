# Dokumen Alur Catatan Siswa (STUDENT_NOTE_FLOW.md)

Dokumen ini merinci kategori catatan siswa, pengaturan visibilitas, dan isolasi catatan sensitif BK.

```text
ENTITY: Student Note
TABLE: student_notes
MODEL: App\Models\StudentNote
PARENT: Student (student_id), Teacher (teacher_id)
CHILD: -
FOREIGN KEY: student_id, teacher_id, education_unit_id, academic_year_id, semester_id
OWNER: Wali Kelas / Guru Mata Pelajaran / Guru BK
UNIT SCOPE: EducationUnit Scope
TEACHER SCOPE: Teacher Class Assignment Scope
CLASS/ROMBEL SCOPE: Rombel Scope
STUDENT SCOPE: Read-Only (jika visible_to_student = true)
ACADEMIC YEAR: AcademicYear aktif
SEMESTER: Semester aktif
PERMISSION: student-notes.view, student-notes.create, student-notes.update, student-notes.delete, student-notes.publish
USED BY: TeacherPortalController, StudentParentPortalController, WaliKelasDashboardController
STATUS: VERIFIED — ENHANCED WITH VISIBILITY CONTROLS
```

## Kategori Catatan
1. **Akademik**: Perkembangan belajar & hafalan.
2. **Perilaku & Kedisiplinan**: Kedisiplinan, kerapihan, kehadiran.
3. **Prestasi & Konseling**: Prestasi dan bimbingan umum.
4. **Konseling Sensitif (Guru BK)**: Diisolasi khusus untuk Guru BK dan Kepala Sekolah. Tidak tampil untuk guru umum atau portal jika ditandai privat.
