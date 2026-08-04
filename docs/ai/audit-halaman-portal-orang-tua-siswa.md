# Laporan Audit Halaman Portal Orang Tua & Siswa

Tanggal Audit: 2 Agustus 2026

## Ringkasan Audit 13 Halaman

Seluruh 13 halaman Portal Orang Tua & Siswa telah diaudit dan terintegrasi penuh dengan data modul utama Sistem Manajemen Sekolah Terpadu tanpa membuat migration baru, tanpa tabel portal ganda, tanpa CRUD duplikat, dan tanpa data hardcode.

| Halaman | Sumber Data | Model Utama | Relasi | Endpoint API | Web UI Workspace | Status | Tindakan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Profil & Biodata | Master Siswa, Orang Tua, Unit, Akademik | `Student`, `ParentModel`, `EducationUnit`, `ClassModel` | user, parent_id / pivot, kelas, unit | `/api/portal/profile`, `/api/portal/children` | `StudentProfileWorkspace.jsx` | Lengkap | Mode baca-saja, tab data pribadi, akademik, orang tua, riwayat |
| 2. Informasi Sekolah | Modul Pengumuman Sekolah | `PengumumanSekolah` | target_peran, unit, kelas | `/api/portal/school-information`, `/summary` | `SchoolInformationWorkspace.jsx` | Lengkap | Submenu pengumuman, agenda, berita, edaran; bookmark & read state |
| 3. Jadwal | Jadwal Pelajaran Akademik | `ClassSchedule`, `Subject`, `Employee` | class_id/kelas_id, subject, teacher | `/api/portal/schedules` | `ClassScheduleWorkspace.jsx` | Lengkap | KPI card, tab Hari Ini & Mingguan, timeline & search filter |
| 4. Materi | LMS Materi & Modul Ajar | `LmsMateri`, `LmsModulAjar`, `LmsMedia` | subject, guru, modul_ajar, media | `/api/portal/materials` | `MaterialsWorkspace.jsx` | Lengkap | Grid card materi, filter mapel/jenis, modal detail & download file |
| 5. Tugas | LMS Penugasan & Pengumpulan | `LmsPenugasan`, `LmsPengumpulanTugas` | class_id, subject, teacher, siswa_id | `/api/portal/assignments`, `/submit` | `AssignmentsWorkspace.jsx` | Lengkap | KPI status tugas, form pengumpulan siswa (teks & file), view ortu |
| 6. Tahfizh | Log Harian Tahfizh & Target | `TahfizhDailyLog`, `TahfizhTarget` | student_id, teacher, surah | `/api/portal/tahfizh` | `TahfizhWorkspace.jsx` | Lengkap | KPI total ayat & target, banner hafalan terakhir, riwayat detail |
| 7. Nilai | Nilai Siswa Akademik & LMS | `StudentGrade`, `Subject`, `LmsRapor` | student_id, subject, semester | `/api/portal/grades`, `/reports` | `GradesWorkspace.jsx` | Lengkap | KPI rata-rata & tuntas, card per mapel, predikat A-D, KKM |
| 8. Komentar Guru | Catatan Siswa & Komentar Guru | `StudentNote`, `LmsPengumpulanTugas` | student_id, teacher_id | `/api/portal/student-notes` | `TeacherCommentsWorkspace.jsx` | Lengkap | Filter kategori (akademik, tugas, perilaku, dll), visibilitas ortu/siswa |
| 9. Mutabaah | Mutabaah Daily Header & Details | `MutabaahDailyHeader`, `MutabaahDailyDetail` | student_id, entry_date | `/api/portal/mutabaah` | `MutabaahWorkspace.jsx` | Lengkap | KPI capaian %, checklist ibadah harian, simpan draft siswa |
| 10. Absensi | LMS Presensi & Student Permissions | `LmsPresensi`, `StudentAttendancePermission` | student_id, session_id | `/api/portal/attendance`, `/permissions` | `AttendanceWorkspace.jsx` | Lengkap | KPI presensi, tab presensi & izin/sakit, form modal pengajuan izin |
| 11. Kisi-kisi | LMS Kisi-kisi Ujian | `LmsKisiKisi`, `Subject` | kelas_id, subject, guru | `/api/portal/exam-grids` | `ExamGridsWorkspace.jsx` | Lengkap | Grid card kisi-kisi, modal detail CP, TP, level kognitif |
| 12. Ujian CBT | LMS Ujian, Sesi, Soal, Jawaban | `LmsUjian`, `LmsUjianSesi`, `LmsBankSoal` | kelas_id, kisi_kisi_id, siswa_id | `/api/portal/lms/exams`, `/start`, `/finish` | `CbtExamsWorkspace.jsx` | Lengkap | KPI status ujian, modal petunjuk, ruang pengerjaan CBT interaktif |
| 13. Hasil | Evaluasi Ujian, Tugas, & Rapor | `LmsUjianSesi`, `LmsPengumpulanTugas`, `LmsRapor` | student_id, ujian_id | `/api/portal/results`, `/reports` | `ExamResultsWorkspace.jsx` | Lengkap | KPI rata-rata & ketuntasan, tab kategori hasil, publikasi nilai |

## Kesimpulan Audit

1. **Integritas Database**: Tidak ada migration baru atau tabel baru. Seluruh data disajikan secara dinamis dari tabel modul utama.
2. **Access & Security**: Role Orang Tua dan Siswa dipisahkan dengan ketat. Orang Tua tidak diperbolehkan memulai ujian CBT atau mengirimkan tugas atas nama siswa.
3. **UI/UX Standard**: Seluruh workspace mengikuti pedoman **Modern Soft Enterprise** dengan ketersediaan KPI Card, Filter Bar, Detail Modal/Drawer, Empty State, Skeleton Loading, Error Retry, Dark Mode, dan Responsive Layout.
