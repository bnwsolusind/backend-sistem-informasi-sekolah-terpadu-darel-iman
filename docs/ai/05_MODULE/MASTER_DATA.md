# MODULE: MASTER DATA

Bukti historis: `99_ARCHIVE/MASTER_DATA_AUDIT.md`, `99_ARCHIVE/MASTER_DATA_DEPENDENCY_MAP.md`, `99_ARCHIVE/MASTER_LOOKUP_SOURCE_MATRIX.md`, `99_ARCHIVE/LOOKUP_ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/STUDENT_PARENT_RELATION_MAP.md`.

## Entitas Inti

| Domain | Entitas | Catatan |
|---|---|---|
| Unit | `education_units`, `unit_pendidikan` | Scope seluruh modul (EducationUnit Scope) |
| Pegawai | `employees` (+ `teachers`) | `job_titles`, `employee_units`; role via `users` |
| Siswa | `students` | `student_mutations`, `graduations`, `alumni` |
| Orang Tua | `parents` (+ pivot siswa) | Ownership multi-child via `student_parent`/`parentsPivot` |
| Lookup/Master | `lookups`, kategori referensi (status, agama, golongan, dll) | Dikonsumsi options API global |

## Aturan

- CRUD master memakai popup modal/drawer (FORM_STANDARD + MODAL_DRAWER_STANDARD), validasi Form Request backend sebagai otoritas.
- Dependent dropdown (Unit → Tahun Ajaran → Semester → Kelas → Siswa) dari options API, disable sampai parent terisi (`DEPENDENT_DROPDOWN_FLOW.md`).
- Lookup adalah satu sumber kategori; dilarang hardcode enum di frontend.
- Siswa & Pegawai form > 10 field → wizard/tab seksi (`Identitas`, `Akademik`, `Kontak`, `Dokumen`).

## Referensi

- Scope role: `03_AUTH/ROLE_PERMISSION.md`, `02_DATABASE/DATA_SCOPE.md`
- Detail arsip: `99_ARCHIVE/MASTER_DATA_*`, `99_ARCHIVE/LOOKUP_*`, `99_ARCHIVE/STUDENT_PARENT_RELATION_MAP.md`
