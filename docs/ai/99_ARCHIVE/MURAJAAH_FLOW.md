# Dokumen Alur Kerja Murajaah (MURAJAAH_FLOW.md)

Dokumen ini merinci alur perekaman murajaah (pengulangan hafalan), peninjauan kelancaran, serta unggah audio murajaah.

```text
ENTITY: Murajaah Record
TABLE: tahfizh_daily_logs
MODEL: App\Models\TahfizhDailyLog
PARENT: Student, Teacher
CHILD: Audio File Attachment (tahfizh_audio/)
FOREIGN KEY: student_id, teacher_id
OWNER: Siswa / Orang Tua / Guru Tahfizh
UNIT SCOPE: EducationUnit Scope
TEACHER SCOPE: Teacher Assignment Scope
STUDENT SCOPE: Read-Only / Input Audio & Catatan Murajaah Mandiri
ACADEMIC YEAR: AcademicYear aktif
SEMESTER: Semester aktif
PERMISSION: murajaah.view, murajaah.create, murajaah.update
USED BY: TahfizhPage, TeacherPortalPage, ParentPortalPage, StudentPortalPage
STATUS: VERIFIED — NO CHANGE REQUIRED
```

## Alur Perekaman & Verifikasi Murajaah

```text
Orang Tua / Siswa Mengunggah Audio Murajaah / Input Teks
→ Guru Tahfizh Meninjau Rekaman & Kelancaran
→ Evaluasi Kualitas (Kelancaran / Ketepatan / Tajwid)
→ Catatan Rekomendasi Pengulangan (jika perlu)
→ Tampil di Rekap Murajaah Mingguan
```

## Pengecekan Penting
- Perekaman Murajaah disimpan pada field `murajaah_text`, `murajaah_lembar`, dan `audio_url`.
- Murajaah tidak menambah hitungan hafalan baru (*total_ayats_memorized*).
