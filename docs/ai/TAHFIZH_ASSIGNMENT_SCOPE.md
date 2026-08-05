# Dokumen Scope Penugasan Guru Tahfizh (TAHFIZH_ASSIGNMENT_SCOPE.md)

Dokumen ini menjelaskan aturan pembatasan hak akses Guru Tahfizh dan Musyrif dalam mengelola siswa binaan.

```text
ENTITY: Teacher Assignment & Halaqah Scope
TABLE: teachers, tbl_kelas, mutabaah_supervisor_assignments
MODEL: App\Models\Teacher, App\Models\Kelas, App\Models\MutabaahSupervisorAssignment
PARENT: Employee, EducationUnit
CHILD: Student
FOREIGN KEY: teacher_id, employee_id, class_id, student_id
OWNER: Guru Tahfizh / Musyrif
UNIT SCOPE: EducationUnit
TEACHER SCOPE: Strict Assignment Scope (teacherClassIds)
CLASS/ROMBEL SCOPE: Rombel Scope
STUDENT SCOPE: Siswa Binaan
ACADEMIC YEAR: AcademicYear aktif
SEMESTER: Semester aktif
PERMISSION: tahfizh.view, tahfizh.create, tahfizh.update
USED BY: TeacherPortalController, TahfizhController
STATUS: VERIFIED — STRICT DATA ISOLATION ENFORCED
```

## Aturan Keamanan Access Scope
1. Guru Tahfizh hanya diperbolehkan mencatat setoran dan melihat rekap siswa yang terdaftar dalam halaqah / rombel penugasannya.
2. Percobaan menginput/mengedit setoran siswa di luar binaan akan ditolak dengan respons API HTTP `403 Forbidden` / `404 Not Found`.
