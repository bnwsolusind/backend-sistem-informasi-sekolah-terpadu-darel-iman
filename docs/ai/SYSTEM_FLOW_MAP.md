# SYSTEM FLOW MAP — SISTEM MANAJEMEN SEKOLAH TERPADU

> Addendum audit 2026-08-05: status dalam dokumen ini adalah hasil audit historis dan bukan bukti readiness produksi saat ini. Verifikasi tahap 1 di bawah menggantikan klaim status untuk Authentication, RBAC, Unit Scope, Menu, dan Route sampai audit per-modul selesai.

## Audit Tahap 1 — Authentication, RBAC, Unit Scope, Menu, dan Route

### MODULE: Authentication dan Authorization
- **ROLE**: Seluruh pengguna terautentikasi; Super Admin untuk impersonasi.
- **PERMISSION**: Sanctum `auth:sanctum`, Spatie `can:*`, serta `role:*`.
- **MENU**: Dashboard shell dan portal role terkait.
- **ROUTE**: `/masuk`, `/portal-orangtua`, `/portal-siswa`, `/dashboard/*`.
- **PAGE**: `LoginPage.jsx`, `DashboardLayout.jsx`, page portal lazy-loaded.
- **FORM**: Login admin, pegawai, QR, dan orang tua/siswa.
- **API**: `/api/auth/login*`, `/api/auth/profile`, `/api/auth/logout`, `/api/auth/impersonate`.
- **CONTROLLER**: `AuthController` dan `AuthService`.
- **SERVICE**: `AuthService`; frontend `authService` dan Zustand `authStore`.
- **MODEL**: `User`, Sanctum personal access token, Spatie Role/Permission.
- **TABLE**: `users`, `personal_access_tokens`, tabel Spatie role/permission.
- **RELATIONS**: `User -> roles/permissions`, `User -> Employee`.
- **OUTPUT**: Token, profil dengan role/permission, dashboard atau portal sesuai role.
- **STATUS**: `PARTIALLY FIXED`.

**Temuan dan perbaikan terverifikasi:**
- Guard route/sidebar kini menormalisasi spasi, underscore, dan tanda hubung pada role sebelum dibandingkan.
- Middleware read-only Yayasan kini memakai allowlist path eksplisit; endpoint yang hanya mengandung kata `profile` atau `notifications` tidak lagi memperoleh pengecualian mutasi.
- Scope multi-unit daftar pegawai dan kelas telah diperbaiki dan diuji dengan dua unit. Scope global untuk endpoint detail/mutasi dan modul lain tetap belum diverifikasi end-to-end.

Dokumen ini memetakan alur *End-to-End* (E2E) dari setiap modul dalam sistem mulai dari Role, Hak Akses (Permission), Menu Navigasi, Frontend Route & Page, API Service, Controller, Service/Repository, Model, Database Table, hingga Output Dashboard/Laporan.

---

## 1. MODUL MASTER DATA

### 1.1 Master Unit Pendidikan & Jenis Unit
- **ROLE**: Super Admin, Pengurus Yayasan (Read-Only), Tata Usaha
- **PERMISSION**: `unit.view`, `unit.create`, `unit.update`, `unit.delete`, `sistem.master_data`
- **MENU**: Master Data → Unit Pendidikan & Jenis Unit
- **ROUTE**: `/dashboard/students/unit-pendidikan`, `/dashboard/master-jenis-unit`
- **PAGE**: `EducationUnitsPage.jsx`, `MasterJenisUnitPendidikanPage.jsx`
- **FORM**: Form Dialog Unit Pendidikan / Jenis Unit
- **API**: `GET /api/v1/education-units`, `POST /api/v1/education-units`, `PUT /api/v1/education-units/{id}`, `DELETE /api/v1/education-units/{id}`
- **CONTROLLER**: `EducationUnitController.php`, `JenisUnitPendidikanController.php`
- **SERVICE**: `JenisUnitPendidikanService.php`, `AccessScopeService.php`
- **MODEL**: `EducationUnit.php`, `JenisUnitPendidikan.php`
- **TABLE**: `education_units`, `tbl_jenis_unit_pendidikan`
- **RELATIONS**: `JenisUnitPendidikan` (1-to-M) `EducationUnit` (1-to-M) `Student`, `Employee`, `Kelas`
- **OUTPUT**: Tabel Master Unit & Dropdown Relasional Lintas Modul
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 1.2 Master Tahun Ajaran & Semester
- **ROLE**: Super Admin, Waka Kurikulum, Tata Usaha
- **PERMISSION**: `pembelajaran.kurikulum.view`, `academic.curriculum.view`, `sistem.master_data`
- **MENU**: Master Data / Akademik → Pengaturan Akademik (Tahun Ajaran & Semester)
- **ROUTE**: `/dashboard/master-tahun-ajaran`, `/dashboard/master-modul-semester`
- **PAGE**: `MasterTahunAjaranPage.jsx`, `MasterModulSemesterPage.jsx`
- **FORM**: Modal Tambah/Edit Tahun Ajaran & Modul Semester
- **API**: `GET /api/v1/tahun-ajaran`, `POST /api/v1/tahun-ajaran`, `PUT /api/v1/tahun-ajaran/{id}`, `DELETE /api/v1/tahun-ajaran/{id}`
- **CONTROLLER**: `TahunAjaranController.php`, `ModulSemesterController.php`
- **SERVICE**: `TahunAjaranService.php`, `ModulSemesterService.php`
- **MODEL**: `AcademicYear.php`, `Semester.php`
- **TABLE**: `academic_years`, `semesters`
- **RELATIONS**: `AcademicYear` (1-to-M) `Semester` (1-to-M) `LmsJadwalPelajaran`, `LmsRapor`
- **OUTPUT**: Pengaturan Konteks Akademik Aktif Sistem
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 1.3 Master Kurikulum & Mata Pelajaran
- **ROLE**: Super Admin, Waka Kurikulum, Tata Usaha, Guru
- **PERMISSION**: `pembelajaran.kurikulum.view`, `academic.subject.view`, `academic.subject.create`, `academic.subject.update`
- **MENU**: Akademik & LMS → Master Kurikulum & Mata Pelajaran
- **ROUTE**: `/dashboard/master-kurikulum`, `/dashboard/master-subject`
- **PAGE**: `MasterKurikulumPage.jsx`, `MasterSubjectPage.jsx`
- **FORM**: Form Modal Kurikulum & Form Mapel Per Unit/Kurikulum
- **API**: `GET /api/v1/master-kurikulum`, `POST /api/v1/master-kurikulum`, `GET /api/v1/subjects`, `POST /api/v1/subjects`
- **CONTROLLER**: `MasterKurikulumController.php`, `SubjectController.php`
- **SERVICE**: `MasterKurikulumService.php`, `SubjectService.php`
- **MODEL**: `MasterKurikulum.php`, `Subject.php`
- **TABLE**: `tbl_master_kurikulum`, `subjects`
- **RELATIONS**: `MasterKurikulum` (1-to-M) `Subject` (1-to-M) `LmsJadwalPelajaran`, `LmsModulAjar`
- **OUTPUT**: Daftar Mapel Terstruktur Berdasarkan Kurikulum & Unit
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 1.4 Master Pegawai & Guru
- **ROLE**: Super Admin, Pengurus Yayasan (Read-Only), Kepala Sekolah, Tata Usaha
- **PERMISSION**: `employee.view`, `employee.create`, `employee.update`, `employee.export`, `kesiswaan.catatan_siswa`
- **MENU**: Master Data → Pegawai & Guru
- **ROUTE**: `/dashboard/employees`
- **PAGE**: `EmployeesPage.jsx`
- **FORM**: Modal Input/Edit Pegawai, Gelar, NIY, Status Kepegawaian, Role Account
- **API**: `GET /api/v1/employees`, `POST /api/v1/employees`, `PUT /api/v1/employees/{id}`, `DELETE /api/v1/employees/{id}`
- **CONTROLLER**: `EmployeeController.php`
- **SERVICE**: `EmployeeService.php`, `AccessScopeService.php`
- **MODEL**: `Employee.php`, `User.php`
- **TABLE**: `employees`, `users`
- **RELATIONS**: `User` (1-to-1) `Employee` (1-to-M) `LmsJadwalPelajaran`, `Kelas` (Wali Kelas)
- **OUTPUT**: Daftar Pegawai, Guru, Pembimbing, Musyrif Lintas Unit
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 1.5 Master Kelas & Rombel
- **ROLE**: Super Admin, Kepala Sekolah, Waka Kurikulum, Waka Kesiswaan, Tata Usaha
- **PERMISSION**: `kesiswaan.kelas_rombel`, `student.view`
- **MENU**: Master Data / Kesiswaan → Data Kelas & Rombel
- **ROUTE**: `/dashboard/students/kelas`
- **PAGE**: `MasterKelasPage.jsx`
- **FORM**: Modal Rombel, Tingkat, Kode, Kuota, Wali Kelas Dropdown
- **API**: `GET /api/v1/kelas`, `POST /api/v1/kelas`, `PUT /api/v1/kelas/{id}`, `DELETE /api/v1/kelas/{id}`
- **CONTROLLER**: `KelasController.php`
- **SERVICE**: `KelasService.php`, `AccessScopeService.php`
- **MODEL**: `Kelas.php`
- **TABLE**: `tbl_kelas`
- **RELATIONS**: `EducationUnit` (1-to-M) `Kelas` (1-to-M) `Student`, `LmsJadwalPelajaran`
- **OUTPUT**: Daftar Rombel Berdasarkan Unit & Tingkat
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

---

## 2. MODUL SISWA & ORANG TUA

### 2.1 Master Siswa & Orang Tua / Wali
- **ROLE**: Super Admin, Pengurus Yayasan (Read-Only), Kepala Sekolah, Waka Kesiswaan, Tata Usaha, Wali Kelas
- **PERMISSION**: `student.view`, `student.create`, `student.update`, `student.export`, `kesiswaan.data_lengkap_siswa`
- **MENU**: Master Data / Kesiswaan → Data Siswa & Data Orang Tua
- **ROUTE**: `/dashboard/students`, `/dashboard/parents`
- **PAGE**: `StudentsPage.jsx`, `ParentsPage.jsx`
- **FORM**: Form Multi-step Data Pribadi, NIS, NISN, Orang Tua/Wali Relasi, Alamat, Foto
- **API**: `GET /api/v1/students`, `POST /api/v1/students`, `PUT /api/v1/students/{id}`, `GET /api/v1/parents`
- **CONTROLLER**: `StudentController.php`, `ParentController.php`
- **SERVICE**: `StudentRepository.php`, `PortalStudentContextService.php`, `AccessScopeService.php`
- **MODEL**: `Student.php`, `ParentModel.php`
- **TABLE**: `students`, `parents`, `parent_student`
- **RELATIONS**: `ParentModel` (M-to-M via `parent_student`) `Student` (BelongsTo) `Kelas`, `EducationUnit`
- **OUTPUT**: Data Siswa Aktif, Hubungan Anak-Orang Tua Lintas Unit
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

---

## 3. MODUL PRESENSI & KEHADIRAN

### 3.1 Presensi Pembelajaran (Kelas & Mapel)
- **ROLE**: Super Admin, Kepala Sekolah, Waka Kurikulum, Guru, Wali Kelas
- **PERMISSION**: `lesson_attendance.view`, `lesson_attendance.view_own`, `lesson_attendance.create`, `lesson_attendance.update`, `lesson_attendance.finalize`
- **MENU**: Absensi → Presensi Pembelajaran
- **ROUTE**: `/absensi/dashboard-guru`, `/absensi/presensi`
- **PAGE**: `AttendanceWorkspacePage.jsx`
- **FORM**: Matriks Presensi Siswa Per Pertemuan (Hadir, Terlambat, Izin, Sakit, Alpha), Catatan
- **API**: `GET /api/v1/lms/presensi`, `POST /api/v1/lms/presensi`, `POST /api/v1/lms/presensi/finalize`
- **CONTROLLER**: `LmsPresensiController.php`, `AttendanceWorkflowController.php`
- **SERVICE**: `LmsPresensiService.php`, `AttendanceAccessService.php`
- **MODEL**: `LmsPresensi.php`, `LmsPresensiDetail.php`
- **TABLE**: `lms_presensi`, `lms_presensi_detail`
- **RELATIONS**: `LmsJadwalPelajaran` (1-to-M) `LmsPresensi` (1-to-M) `LmsPresensiDetail`
- **OUTPUT**: Jurnal Presensi Guru & Rekap Real-time Kehadiran Rombel
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 3.2 Absensi Gerbang & Absensi Ibadah
- **ROLE**: Super Admin, Tata Usaha, Musyrif, Pembimbing
- **PERMISSION**: `kehadiran.siswa.absensi_digital`, `gate_attendance.view`, `worship_attendance.view`, `worship_attendance.verify`
- **MENU**: Absensi → Absensi Gerbang & Presensi Ibadah Santri
- **ROUTE**: `/dashboard/absensi-gerbang`, `/dashboard/absensi-ibadah`
- **PAGE**: `GateAttendancePage.jsx`, `WorshipAttendancePage.jsx`
- **FORM**: Scanner QR/RFID/Barcode, Input Verifikasi Ibadah Santri
- **API**: `POST /api/v1/gate-attendance/scan`, `GET /api/v1/worship-attendance/sessions`
- **CONTROLLER**: `GateAttendanceController.php`, `WorshipAttendanceController.php`
- **SERVICE**: `GateAttendanceService.php`, `WorshipAttendanceService.php`
- **MODEL**: `StudentAttendance.php`, `WorshipAttendanceSession.php`
- **TABLE**: `student_attendances`, `worship_attendance_sessions`, `worship_attendance_records`
- **RELATIONS**: `Student` (1-to-M) `StudentAttendance`, `WorshipAttendanceRecord`
- **OUTPUT**: Log Presensi Harian Masuk/Pulang & Monitoring Ibadah Santri
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

---

## 4. MODUL AKADEMIK & LMS

### 4.1 CP, TP, Modul Ajar & Materi Pembelajaran
- **ROLE**: Super Admin, Waka Kurikulum, Guru Mata Pelajaran
- **PERMISSION**: `pembelajaran.materi`, `pembelajaran.kurikulum.view`, `teacher.material.view`, `teacher.material.create`
- **MENU**: Akademik & LMS → Perencanaan & Pembelajaran
- **ROUTE**: `/dashboard/akademik/perencanaan`, `/dashboard/akademik/pembelajaran`
- **PAGE**: `AcademicLmsContainerPage.jsx`, `LmsModulAjarPage.jsx`, `LmsMateriPage.jsx`
- **FORM**: Form Input CP/TP, Editor Modul Ajar, Upload Materi & Media Pembelajaran
- **API**: `GET /api/v1/lms/modul-ajar`, `POST /api/v1/lms/modul-ajar`, `GET /api/v1/lms/materi`, `POST /api/v1/lms/materi`
- **CONTROLLER**: `LmsModulAjarController.php`, `LmsMateriController.php`
- **SERVICE**: `LmsModulAjarService.php`, `LmsMateriService.php`
- **MODEL**: `LmsModulAjar.php`, `LmsMateri.php`
- **TABLE**: `lms_modul_ajar`, `lms_materi`
- **RELATIONS**: `Subject` (1-to-M) `LmsModulAjar` (1-to-M) `LmsMateri`
- **OUTPUT**: Perangkat Pembelajaran Guru & Repositori Materi Kelas
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 4.2 Penugasan & Pengumpulan Tugas
- **ROLE**: Super Admin, Guru Mata Pelajaran, Siswa, Orang Tua
- **PERMISSION**: `teacher.assignment.view`, `teacher.assignment.create`, `student.assignment.view`, `student.submission.create`
- **MENU**: Akademik & LMS → Tugas & Evaluasi / Portal Siswa → Tugas
- **ROUTE**: `/dashboard/akademik/evaluasi`, `/portal-siswa/tugas`
- **PAGE**: `AcademicLmsContainerPage.jsx`, `StudentPortalPage.jsx`
- **FORM**: Form Buat Tugas, Batas Waktu, Upload Jawaban Siswa, Form Penilaian Guru
- **API**: `GET /api/v1/lms/penugasan`, `POST /api/v1/lms/penugasan`, `POST /api/v1/lms/pengumpulan-tugas`
- **CONTROLLER**: `LmsPenugasanController.php`, `LmsPengumpulanTugasController.php`
- **SERVICE**: `LmsPenugasanService.php`, `LmsPengumpulanTugasService.php`
- **MODEL**: `LmsPenugasan.php`, `LmsPengumpulanTugas.php`
- **TABLE**: `lms_penugasan`, `lms_pengumpulan_tugas`
- **RELATIONS**: `LmsPenugasan` (1-to-M) `LmsPengumpulanTugas` (BelongsTo) `Student`
- **OUTPUT**: Rekap Pengumpulan Tugas & Nilai Tugas Siswa
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 4.3 Kisi-kisi, Bank Soal & CBT
- **ROLE**: Super Admin, Waka Kurikulum, Guru Mata Pelajaran, Siswa
- **PERMISSION**: `pembelajaran.kisi_kisi_ujian`, `pembelajaran.bank_soal`
- **MENU**: Akademik & LMS → Kisi-kisi & Bank Soal / Portal Siswa → Ujian CBT
- **ROUTE**: `/dashboard/akademik/evaluasi`, `/portal-siswa/ujian-cbt`
- **PAGE**: `LmsKisiKisiPage.jsx`, `LmsBankSoalPage.jsx`, `LmsUjianPage.jsx`
- **FORM**: Pembuat Kisi-kisi, Editor Bank Soal (PG/Essay), Ujian CBT Timer
- **API**: `GET /api/v1/lms/kisi-kisi`, `GET /api/v1/lms/bank-soal`, `POST /api/v1/lms/ujian`
- **CONTROLLER**: `LmsKisiKisiController.php`, `LmsBankSoalController.php`, `LmsUjianController.php`
- **SERVICE**: `LmsKisiKisiService.php`, `LmsBankSoalService.php`, `LmsUjianService.php`
- **MODEL**: `LmsKisiKisi.php`, `LmsBankSoal.php`, `LmsUjian.php`
- **TABLE**: `lms_kisi_kisi`, `lms_bank_soal`, `lms_ujian`
- **RELATIONS**: `Subject` (1-to-M) `LmsBankSoal` (1-to-M) `LmsUjian`
- **OUTPUT**: Bank Soal Terstandar & Hasil Ujian Otomatis CBT
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 4.4 Penilaian & Rapor Akademik
- **ROLE**: Super Admin, Kepala Sekolah, Waka Kurikulum, Guru, Wali Kelas
- **PERMISSION**: `academic.grade.view`, `academic.rapor.view`, `academic.rapor.publish`
- **MENU**: Akademik & LMS → Nilai & Rapor
- **ROUTE**: `/dashboard/akademik/nilai-rapor`
- **PAGE**: `LmsPenilaianPage.jsx`, `LmsRaporPage.jsx`
- **FORM**: Form Input Nilai Formatik/Sumatif, Catatan Wali Kelas, Cetak Rapor
- **API**: `GET /api/v1/lms/penilaian`, `POST /api/v1/lms/penilaian`, `GET /api/v1/lms/rapor`
- **CONTROLLER**: `LmsPenilaianController.php`, `LmsRaporController.php`
- **SERVICE**: `LmsPenilaianService.php`, `LmsRaporService.php`
- **MODEL**: `LmsPenilaian.php`, `LmsRapor.php`
- **TABLE**: `lms_penilaian`, `lms_rapor`
- **RELATIONS**: `Student` (1-to-M) `LmsPenilaian`, `LmsRapor`
- **OUTPUT**: Leger Nilai & Dokumen Rapor Cetak PDF
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

---

## 5. MODUL TAHFIZH & MUTABAAH

### 5.1 Tahfizh & Setoran Hafalan
- **ROLE**: Super Admin, Kepala Sekolah, Guru Tahfizh, Musyrif, Orang Tua, Siswa
- **PERMISSION**: `tahfizh.monitoring_target`, `tahfizh.input_setoran_harian`, `tahfizh.rekap_harian`
- **MENU**: Mutaba’ah / Tahfizh → Setoran & Monitoring Hafalan
- **ROUTE**: `/dashboard/tahfizh`, `/portal-siswa/tahfizh`
- **PAGE**: `TahfizhPage.jsx`, `StudentPortalPage.jsx`
- **FORM**: Input Surah, Ayat, Jumlah Baris, Nilai Kelancaran, Catatan Ustadz
- **API**: `GET /api/v1/tahfizh`, `POST /api/v1/tahfizh`, `GET /api/v1/master-quran/surah`
- **CONTROLLER**: `TahfizhController.php`, `MasterQuranSurahController.php`
- **SERVICE**: `GuruTahfizhDashboardService.php`
- **MODEL**: `TahfizhDeposit.php`, `MasterQuranSurah.php`
- **TABLE**: `tahfizh_deposits`, `tbl_master_quran_surahs`
- **RELATIONS**: `Student` (1-to-M) `TahfizhDeposit`
- **OUTPUT**: Progress Hafalan Juz/Surah & Graph Capaian Target
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 5.2 Mutabaah Yaumiyah & Enterprise Agenda
- **ROLE**: Super Admin, Kepala Sekolah, Tata Usaha, Guru, Wali Kelas, Musyrif, Orang Tua, Siswa
- **PERMISSION**: `mutabaah.view`, `mutabaah.daily.input`, `mutabaah.daily.finalize`, `mutabaah.parent.sign`
- **MENU**: Mutaba’ah → Dashboard Mutaba’ah, Rekap & Template Agenda
- **ROUTE**: `/dashboard/mutabaah`, `/dashboard/mutabaah/rekap`
- **PAGE**: `MutabaahPage.jsx`
- **FORM**: Checklist Agenda Yaumiyah (Sholat 5 Waktu, Dzikir, Tilawah, Bangun Subuh), Verifikasi Ortu
- **API**: `GET /api/v1/mutabaah/daily`, `POST /api/v1/mutabaah/daily`, `POST /api/v1/mutabaah/daily/finalize`
- **CONTROLLER**: `MutabaahDailyController.php`, `MutabaahEnterpriseController.php`
- **SERVICE**: `MutabaahDailyService.php`, `MutabaahEnterpriseService.php`, `MutabaahDataScope.php`
- **MODEL**: `MutabaahDailyRecord.php`, `MutabaahAgendaItem.php`
- **TABLE**: `mutabaah_daily_records`, `mutabaah_agenda_items`
- **RELATIONS**: `Student` (1-to-M) `MutabaahDailyRecord`
- **OUTPUT**: Rekap Mutabaah Harian/Mingguan & Skor Kedisiplinan Ibadah
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

---

## 6. MODUL KESISWAAN, MUTASI, KELULUSAN & ALUMNI

### 6.1 Catatan, Prestasi, Pelanggaran & BK
- **ROLE**: Super Admin, Waka Kesiswaan, Guru BK, Wali Kelas
- **PERMISSION**: `kesiswaan.catatan_siswa`, `kesiswaan.rekap_prestasi`, `bk.counseling.view`
- **MENU**: Kesiswaan → Catatan Siswa, Prestasi & Pelanggaran
- **ROUTE**: `/dashboard/students` (Tab Catatan), `/dashboard/guru-bk`
- **PAGE**: `StudentsPage.jsx`, `GuruBkDashboardPage.jsx`
- **FORM**: Form Pelanggaran/Poin, Form Prestasi, Catatan Konseling BK
- **API**: `GET /api/v1/student-notes`, `POST /api/v1/student-notes`
- **CONTROLLER**: `StudentNoteController.php`, `GuruBkDashboardController.php`
- **SERVICE**: `GuruBkDashboardService.php`
- **MODEL**: `StudentNote.php`
- **TABLE**: `student_notes`
- **RELATIONS**: `Student` (1-to-M) `StudentNote`
- **OUTPUT**: Track Record Behavior Siswa & Log Pembinaan BK
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 6.2 Mutasi Siswa, Kelulusan & Portal Alumni
- **ROLE**: Super Admin, Pengurus Yayasan (Read-Only), Kepala Sekolah, Waka Kesiswaan, Tata Usaha, Alumni
- **PERMISSION**: `kesiswaan.laporan_masuk_keluar`, `kesiswaan.kelulusan_per_tahun`, `kesiswaan.alumni_tujuan_lanjut`, `alumni.view`
- **MENU**: Kesiswaan / Dashboard Yayasan → Mutasi Siswa, Kelulusan & Portal Alumni
- **ROUTE**: `/dashboard/yayasan/mutasi-siswa`, `/dashboard/yayasan/kelulusan-alumni`, `/portal-alumni`
- **PAGE**: `FoundationMutationsPage.jsx`, `FoundationGraduationAlumniPage.jsx`, `AlumniPortalPage.jsx`
- **FORM**: Form Pengajuan Mutasi, Form Kelulusan Angkatan, Form Tracer Study Alumni
- **API**: `GET /api/v1/foundation/mutations`, `GET /api/v1/foundation/graduation`, `GET /api/v1/alumni`
- **CONTROLLER**: `StudentMutationController.php`, `AlumniController.php`
- **SERVICE**: `FoundationDashboardService.php`
- **MODEL**: `StudentMutation.php`, `Alumni.php`
- **TABLE**: `student_mutations`, `alumni`
- **RELATIONS**: `Student` (1-to-1) `Alumni`
- **OUTPUT**: Laporan Mutasi Siswa, Daftar Alumni & Tracer Study Perguruan Tinggi/Kerja
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

---

## 7. PORTAL KELUARGA (MULTI-ANAK) & SISWA

### 7.1 Portal Orang Tua (Multi-Anak Switcher & Chat Guru)
- **ROLE**: Orang Tua / Wali
- **PERMISSION**: `parent.portal.view`, `parent.child.view`, `chat.conversation.view`
- **MENU**: Sidebar Portal Orang Tua → Switcher Anak, Overview, Chat Guru
- **ROUTE**: `/portal-orangtua`
- **PAGE**: `ParentPortalPage.jsx`, `FloatingChatWidget.jsx`
- **FORM**: Child Selector Switcher, Form Chat Pesan ke Wali Kelas/Guru Mapel
- **API**: `GET /api/v1/parent/children`, `GET /api/v1/chat/conversations`, `POST /api/v1/chat/messages`
- **CONTROLLER**: `ParentPortalController.php`, `ChatGuruController.php`
- **SERVICE**: `PortalStudentContextService.php`
- **MODEL**: `ParentModel.php`, `Student.php`, `ChatMessage.php`
- **TABLE**: `parents`, `students`, `chat_messages`
- **RELATIONS**: `ParentModel` (HasMany) `Student` (Scope via `X-Child-Id` header)
- **OUTPUT**: Dashboard Terpadu Orang Tua untuk Pantau Nilai, Absensi, Mutabaah, & Chat
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 7.2 Portal Siswa
- **ROLE**: Siswa
- **PERMISSION**: `student.portal.view`, `student.profile.view`, `student.material.view`
- **MENU**: Sidebar Portal Siswa → Profil, Jadwal, Materi, Tugas, Nilai, Ujian CBT
- **ROUTE**: `/portal-siswa`, `/portal-siswa/profil`, `/portal-siswa/jadwal`, `/portal-siswa/materi`, `/portal-siswa/tugas`, `/portal-siswa/nilai`, `/portal-siswa/ujian-cbt`
- **PAGE**: `TeacherStudentPortalDashboardPage.jsx`, `StudentPortalPage.jsx`
- **FORM**: Upload Tugas, Kerjakan Ujian CBT, Isi Mutabaah Siswa
- **API**: `GET /api/v1/student/profile`, `GET /api/v1/student/schedules`, `GET /api/v1/student/materials`
- **CONTROLLER**: `StudentPortalController.php`
- **SERVICE**: `PortalStudentContextService.php`
- **MODEL**: `Student.php`
- **TABLE**: `students`
- **RELATIONS**: User login terhubung langsung ke ID Siswa
- **OUTPUT**: Workspace Mandiri Siswa
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

---

## 8. DASHBOARD MULTI-ROLE & LAPORAN LINTAS UNIT

### 8.1 Dashboard Yayasan, Kepala Sekolah, Divisi, Waka, TU, Guru, BK
- **ROLE**: Super Admin, Pengurus Yayasan, Kepala Sekolah, Divisi Pendidikan, Waka Kurikulum, Waka Kesiswaan, TU, Guru, BK
- **PERMISSION**: `dashboard.view`, `foundation.dashboard.view`, `divisi.monitoring`, `dashboard.kepala-sekolah.view`
- **MENU**: Dashboard → Executive Summary / Multi-Role View
- **ROUTE**: `/dashboard`, `/dashboard/yayasan`, `/dashboard/kepala-sekolah`, `/dashboard/divisi-pendidikan`
- **PAGE**: `MultiRoleDashboardPage.jsx`, `FoundationDashboardPage.jsx`, `KepalaSekolahDashboardPage.jsx`
- **FORM**: Filter Unit, Filter Tahun Ajaran, Filter Rombel
- **API**: `GET /api/v1/foundation/dashboard`, `GET /api/v1/dashboard/kepala-sekolah`
- **CONTROLLER**: `FoundationDashboardController.php`, `KepalaSekolahDashboardController.php`
- **SERVICE**: `FoundationDashboardService.php`, `KepalaSekolahDashboardService.php`
- **MODEL**: Aggregasi Lintas Model (`Student`, `Employee`, `EducationUnit`, `TahfizhDeposit`, `LmsPresensi`)
- **TABLE**: Aggregate queries across DB
- **RELATIONS**: Multi-tenant unit scoping
- **OUTPUT**: Visual KPI Widgets, Chart Kehadiran, Chart Tahfizh, Alert Sistem
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`

### 8.2 Laporan Lintas Unit (SDM, Siswa, Absensi, Akademik, Mutasi, Alumni)
- **ROLE**: Super Admin, Pengurus Yayasan, Kepala Sekolah, Divisi Pendidikan, Tata Usaha
- **PERMISSION**: `foundation.report.view`, `foundation.report.export`, `report.cross_unit.view`
- **MENU**: Laporan → Laporan SDM, Laporan Siswa, Laporan Absensi, Laporan Mutasi, Laporan Alumni
- **ROUTE**: `/dashboard/yayasan/laporan/sdm`, `/dashboard/yayasan/laporan/siswa`, `/dashboard/yayasan/laporan/lintas-unit`
- **PAGE**: `FoundationReportsPage.jsx`, `LaporanSdmPage.jsx`, `LaporanSiswaPage.jsx`
- **FORM**: Filter Tanggal, Unit, Status, Button Export PDF & Excel
- **API**: `GET /api/v1/foundation/reports/sdm`, `GET /api/v1/foundation/reports/export`
- **CONTROLLER**: `FoundationReportController.php`
- **SERVICE**: `FoundationDashboardService.php`
- **MODEL**: Aggregasi Lintas Model
- **TABLE**: Consolidated views
- **RELATIONS**: Cross-unit metrics
- **OUTPUT**: Laporan Ringkasan Executive & File Export Excel/PDF
- **STATUS**: `VERIFIED — NO CHANGE REQUIRED`
