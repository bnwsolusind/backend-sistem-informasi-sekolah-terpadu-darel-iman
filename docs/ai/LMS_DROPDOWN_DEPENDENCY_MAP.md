# Peta Dependensi Dropdown LMS

```text
1. Dropdown Unit Pendidikan (EducationUnit)
   └── Menyaring Mata Pelajaran (Subject) & Kelas/Rombel (tbl_kelas)

2. Dropdown Mata Pelajaran (Subject)
   └── Menyaring Capaian Pembelajaran (CP) & Modul Ajar (LmsModulAjar)

3. Dropdown Capaian Pembelajaran (CP)
   └── Menyaring Tujuan Pembelajaran (TP)

4. Dropdown Modul Ajar (LmsModulAjar)
   └── Menyaring Materi Pembelajaran (LmsMateri), Referensi, Aktivitas, & Diskusi

5. Dropdown Materi Pembelajaran (LmsMateri)
   └── Menyaring Media Pembelajaran (LmsMedia)

6. Dropdown Jadwal Pelajaran (ClassSchedule)
   └── Menyaring Daftar Siswa Rombel untuk Presensi LMS (lms_presensi)
```