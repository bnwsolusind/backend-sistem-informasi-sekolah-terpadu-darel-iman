# Dokumen Target Tahfizh (TAHFIZH_TARGET_FLOW.md)

Dokumen ini merinci hirarki penetapan target Tahfizh, validasi ayat/juz, dan perhitungan persentase pencapaian.

```text
ENTITY: Memorization Target
TABLE: memorization_targets
MODEL: App\Models\MemorizationTarget
PARENT: AcademicYear, Semester, Class, Student
CHILD: -
FOREIGN KEY: academic_year_id, semester_id, class_id, student_id
OWNER: Unit Pendidikan / Guru Tahfizh
UNIT SCOPE: EducationUnit Scope
TEACHER SCOPE: Teacher Assignment Scope
CLASS/ROMBEL SCOPE: Rombel Scope
STUDENT SCOPE: Individual Student Target
ACADEMIC YEAR: AcademicYear aktif
SEMESTER: Semester aktif
PERMISSION: tahfizh-targets.view, tahfizh-targets.create, tahfizh-targets.update, tahfizh-targets.delete
USED BY: Dashboard Guru Tahfizh, Dashboard Kepala Sekolah, Portal Orang Tua, Portal Siswa
STATUS: VERIFIED — NO CHANGE REQUIRED
```

## Prioritas Evaluasi Target

```text
Target Individual Siswa
→ Target Halaqah / Rombel
→ Target Kelas
→ Target Jenjang
→ Target Unit Pendidikan
```

## Aturan Perhitungan Target
- Total target dinyatakan dalam baris atau jumlah ayat unik (1 Juz ≈ 20 halaman / 300 baris / ~200 ayat tergantung surah).
- Capaian persentase = `(Total Ayat Unik Terhafal / Total Ayat Target) * 100%`.
