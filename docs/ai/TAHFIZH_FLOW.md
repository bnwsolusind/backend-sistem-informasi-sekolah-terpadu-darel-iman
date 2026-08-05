# Dokumen Alur Kerja & Entitas Tahfizh (TAHFIZH_FLOW.md)

Dokumen ini merinci alur operasional, entitas data, ownership, dan scope unit untuk modul Tahfizh Al-Qur'an.

```text
ENTITY: Tahfizh Daily Log & Deposit
TABLE: tahfizh_daily_logs, memorization_deposits
MODEL: App\Models\TahfizhDailyLog, App\Models\TahfizhRecord
PARENT: Student (student_id), Teacher (teacher_id), Kelas (class_id)
CHILD: -
FOREIGN KEY: student_id, teacher_id, class_id, academic_year_id, semester_id
OWNER: Guru Tahfizh / Musyrif Binaan
UNIT SCOPE: EducationUnit (education_unit_id)
TEACHER SCOPE: Strict (Guru hanya mengelola siswa binaan dalam halaqah/rombelnya)
CLASS/ROMBEL SCOPE: Strict (Filtered by class_id/kelas_id)
STUDENT SCOPE: Read-only pada portal siswa
ACADEMIC YEAR: AcademicYear aktif
SEMESTER: Semester aktif
PERMISSION: tahfizh.view, tahfizh.create, tahfizh.update, tahfizh.delete, tahfizh.grade
USED BY: Dashboard Guru Tahfizh, Dashboard Wali Kelas, Dashboard Kepala Sekolah, Portal Orang Tua, Portal Siswa
STATUS: VERIFIED — FULLY SYNCHRONIZED
```

## Alur Operasional Tahfizh

```text
Unit Pendidikan
→ Tahun Ajaran & Semester
→ Guru Tahfizh / Musyrif
→ Halaqah / Kelompok Binaan
→ Siswa Binaan
→ Target Hafalan Aktif
→ Setoran Harian (Ziyadah)
→ Perhitungan Unik Ayat (Distinct Interval Merging)
→ Evaluasi Kualitas (Kelancaran, Tajwid, Makhraj)
→ Rekap Tahfizh (Harian, Mingguan, Bulanan, Semester)
→ Dashboard & Portal Sync
```

## Kebijakan Akses & Keamanan
1. **Guru Tahfizh**: Hanya dapat melihat dan menginput setoran siswa binaannya.
2. **Wali Kelas**: Melihat rekap hafalan siswa pada rombel yang diampu.
3. **Orang Tua / Siswa**: Akses *read-only* terhadap data hafalan anak/dirinya sendiri.
