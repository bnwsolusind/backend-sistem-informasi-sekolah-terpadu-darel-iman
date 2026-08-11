# Relasi Data Akademik & LMS

## Rantai utama yang ditemukan

| Domain | Tabel / Model | Foreign key penting | Endpoint |
|---|---|---|---|
| Periode | `academic_years` / `AcademicYear`, `semesters` / `Semester` | `semesters.academic_year_id` | `tahun-ajaran`, `modul-semester` |
| Kurikulum | `master_kurikulum` / `MasterKurikulum` | unit dan tahun ajaran sesuai migration | `kurikulum` |
| Mapel | `subjects` / `Subject` | `kurikulum_id` | `subjects` |
| Kelas/Jadwal | `tbl_kelas` / `Kelas`, `class_schedules` / `ClassSchedule` | unit, tahun, semester, subject, teacher, kelas | `kelas`, `schedules` |
| CP | `lms_capaian_pembelajaran` / `CapaianPembelajaran` | subject, curriculum, unit, tahun | `lms/capaian-pembelajaran` |
| TP | `lms_tujuan_pembelajaran` / `TujuanPembelajaran` | `capaian_pembelajaran_id` | `lms/tujuan-pembelajaran` |
| Modul Ajar | `lms_modul_ajar` / `LmsModulAjar` | subject, semester; pivot `lms_modul_ajar_cp` dan `lms_modul_ajar_tp` | `lms/modul-ajar` |
| Konten | `lms_materi`, `lms_media`, `lms_referensi` | modul/materi sesuai migration masing-masing | `lms/materi`, `media`, `referensi` |
| Aktivitas | `lms_aktivitas_belajar`, `lms_diskusi`, `lms_diskusi_komentar` | materi/modul/diskusi | `lms/aktivitas`, `diskusi` |
| Tugas | `lms_penugasan`, `lms_pengumpulan_tugas` | `penugasan_id`, student, subject/kelas | `lms/penugasan`, `pengumpulan-tugas` |
| Evaluasi | `lms_kisi_kisi`, `lms_bank_soal`, `lms_ujian`, `lms_ujian_sesi`, `lms_jawaban_siswa` | CP/TP, kisi-kisi, ujian, student | `lms/kisi-kisi`, `bank-soal`, `ujian` |
| Nilai/Rapor | penilaian LMS dan `lms_rapor` / `LmsRapor` | student, kelas, semester, tahun | `lms/penilaian`, `rapor` |

Migration koreksi `2026_08_01_000002_fix_lms_cp_tp_cascade_to_restrict.php` mempertahankan data induk CP/TP dengan delete restrict. Container tidak membuat relasi baru dan tetap memakai options/dropdown backend yang ada.
