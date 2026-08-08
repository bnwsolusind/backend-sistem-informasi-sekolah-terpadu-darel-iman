# ROLE SCOPE MATRIX

## Backend Query Scoping Rules

| Role Name | Access Scope Boundary | Database Clause / Scope Strategy |
| --- | --- | --- |
| **Super Admin** | Unlimited | No `unit_id` or `employee_id` filter applied |
| **Pengurus Yayasan** | Cross-unit read-only | `whereIn('education_unit_id', $allowedUnitIds)` |
| **Divisi Pendidikan** | Multi-unit academic | `whereIn('education_unit_id', $allowedUnitIds)` |
| **Kepala Sekolah** | Single Education Unit | `where('education_unit_id', $user->employee->education_unit_id)` |
| **Tata Usaha / Operator** | Single Education Unit | `where('education_unit_id', $user->employee->education_unit_id)` |
| **Guru** | Assigned Classes & Subjects | `whereIn('class_id', $teacherClassIds)` & subject relation |
| **Wali Kelas** | Assigned Rombel / Class | `where('class_id', $homeroomClassId)` |
| **Guru Tahfizh** | Assigned Halaqah / Student Group | `whereIn('student_id', $halaqahStudentIds)` |
| **Musyrif** | Assigned Musyrif Student Group | `whereIn('student_id', $musyrifStudentIds)` |
| **Orang Tua** | Connected Children | `whereIn('student_id', $parentStudentIds)` via `parent_student` table |
| **Siswa** | Self Account | `where('student_id', $userStudentId)` or `where('user_id', $user->id)` |
