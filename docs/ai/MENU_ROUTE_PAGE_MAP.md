# MENU ROUTE PAGE MAP — SISTEM MANAJEMEN SEKOLAH TERPADU

Dokumen ini memetakan konsistensi 100% antara Nama Menu Sidebar, Frontend Route, React Page Component, Page Title, API Endpoint, dan Guard Permission.

---

## 1. PEMETAAN MENU NAVIGASI DENGAN ROUTE & KOMPONEN

| Label Menu Sidebar | Frontend Route Path | React Page Component | Guard / Condition | Main API Endpoint |
|---|---|---|---|---|
| Dashboard Utama | `/dashboard` | `MultiRoleDashboardPage.jsx` | `can('dashboard.view')` | `GET /api/v1/auth/me` |
| Dashboard Yayasan | `/dashboard/yayasan` | `FoundationDashboardPage.jsx` | `isFoundationUser` | `GET /api/v1/foundation/dashboard` |
| Unit Pendidikan | `/dashboard/yayasan/unit-pendidikan` | `FoundationUnitsPage.jsx` | `can('foundation.unit.view')` | `GET /api/v1/foundation/units` |
| Pegawai & Guru | `/dashboard/yayasan/pegawai-guru` | `FoundationEmployeesPage.jsx` | `can('foundation.employee.view')` | `GET /api/v1/foundation/employees` |
| Data Siswa (Yayasan) | `/dashboard/yayasan/siswa` | `FoundationStudentsPage.jsx` | `can('foundation.student.view')` | `GET /api/v1/foundation/students` |
| Siswa Baru | `/dashboard/yayasan/siswa-baru` | `FoundationNewStudentsPage.jsx` | `can('foundation.student_new.view')` | `GET /api/v1/foundation/new-students` |
| Mutasi Siswa | `/dashboard/yayasan/mutasi-siswa` | `FoundationMutationsPage.jsx` | `can('foundation.student_mutation.view')` | `GET /api/v1/foundation/mutations` |
| Kelulusan & Alumni | `/dashboard/yayasan/kelulusan-alumni` | `FoundationGraduationAlumniPage.jsx` | `can('foundation.graduation.view')` | `GET /api/v1/foundation/graduation` |
| Master Unit Pendidikan | `/dashboard/students/unit-pendidikan` | `EducationUnitsPage.jsx` | `can('sistem.master_data')` | `GET /api/v1/education-units` |
| Master Jenis Unit | `/dashboard/master-jenis-unit` | `MasterJenisUnitPendidikanPage.jsx` | `can('sistem.master_data')` | `GET /api/v1/jenis-unit-pendidikan` |
| Master Jabatan | `/dashboard/master-jabatan` | `MasterJabatanPage.jsx` | `can('sistem.master_data')` | `GET /api/v1/jabatans` |
| Master Pegawai | `/dashboard/employees` | `EmployeesPage.jsx` | `can('employee.view')` | `GET /api/v1/employees` |
| Master Siswa | `/dashboard/students` | `StudentsPage.jsx` | `can('kesiswaan.data_lengkap_siswa')` | `GET /api/v1/students` |
| Master Kelas & Rombel | `/dashboard/students/kelas` | `MasterKelasPage.jsx` | `can('kesiswaan.kelas_rombel')` | `GET /api/v1/kelas` |
| Al-Qur'an Surah | `/dashboard/master-quran-surah` | `MasterQuranSurahPage.jsx` | `can('sistem.master_data')` | `GET /api/v1/master-quran/surah` |
| Sholat & Dzikir | `/dashboard/master-jadwal-sholat` | `MasterJadwalSholatPage.jsx` | `can('sistem.master_data')` | `GET /api/v1/master-jadwal-sholat` |
| Pengaturan Akademik | `/dashboard/akademik/pengaturan` | `AcademicLmsContainerPage.jsx` | `can('pembelajaran.kurikulum.view')` | `GET /api/v1/tahun-ajaran` |
| Perencanaan LMS | `/dashboard/akademik/perencanaan` | `AcademicLmsContainerPage.jsx` | `can('pembelajaran.kurikulum.view')` | `GET /api/v1/lms/cp` |
| Pembelajaran LMS | `/dashboard/akademik/pembelajaran` | `AcademicLmsContainerPage.jsx` | `can('pembelajaran.materi')` | `GET /api/v1/lms/materi` |
| Tugas & Evaluasi | `/dashboard/akademik/evaluasi` | `AcademicLmsContainerPage.jsx` | `can('kesiswaan.penugasan_siswa')` | `GET /api/v1/lms/penugasan` |
| Nilai & Rapor | `/dashboard/akademik/nilai-rapor` | `AcademicLmsContainerPage.jsx` | `can('academic.rapor.view')` | `GET /api/v1/lms/rapor` |
| Portal Guru | `/portal-guru` | `TeacherStudentPortalDashboardPage.jsx` | `hasRole('Guru', 'Guru Tahfizh', 'Wali Kelas')` | `GET /api/v1/teacher/dashboard` |
| Workspace Pembelajaran | `/portal-guru/workspace` | `TeacherTeachingWorkspacePage.jsx` | `hasRole('Guru', 'Guru Tahfizh')` | `GET /api/v1/teacher/schedules` |
| Chat Pegawai & Ortu | `/dashboard/chat-pegawai` | `EmployeeChatPage.jsx` | `can('chat.conversation.view')` | `GET /api/v1/chat/conversations` |
| Portal Orang Tua | `/portal-orangtua` | `ParentPortalPage.jsx` | `hasRole('Orang Tua', 'Orangtua', 'Wali Murid')` | `GET /api/v1/parent/children` |
| Portal Siswa | `/portal-siswa` | `StudentPortalPage.jsx` | `hasRole('Siswa', 'student')` | `GET /api/v1/student/profile` |
| Dashboard Wali Kelas | `/absensi/dashboard-wali-kelas` | `AttendanceWorkspacePage.jsx` | `hasRole('Wali Kelas')` | `GET /api/v1/homeroom/summary` |
| Presensi Pembelajaran | `/absensi/presensi` | `AttendanceWorkspacePage.jsx` | `can('lesson_attendance.view')` | `GET /api/v1/lms/presensi` |
| Absensi Gerbang | `/dashboard/absensi-gerbang` | `GateAttendancePage.jsx` | `can('kehadiran.siswa.monitoring')` | `GET /api/v1/gate-attendance/logs` |
| Absensi Ibadah Santri | `/dashboard/absensi-ibadah` | `WorshipAttendancePage.jsx` | `can('worship_attendance.view')` | `GET /api/v1/worship-attendance/sessions` |
| Dashboard Mutabaah | `/dashboard/mutabaah` | `MutabaahPage.jsx` | `can('mutabaah.view')` | `GET /api/v1/mutabaah/daily` |
| Rekap Mutabaah | `/dashboard/mutabaah/rekap` | `MutabaahPage.jsx` | `can('mutabaah.recap.view')` | `GET /api/v1/mutabaah/recap` |
| Setoran Tahfizh | `/dashboard/tahfizh` | `TahfizhPage.jsx` | `can('tahfizh.monitoring_target')` | `GET /api/v1/tahfizh` |
| Portal Alumni | `/portal-alumni` | `AlumniPortalPage.jsx` | `hasRole('Alumni', 'alumni')` | `GET /api/v1/alumni/profile` |
| Master Hak Akses | `/dashboard/hak-akses` | `MasterHakAksesPage.jsx` | `can('sistem.hak_akses')` | `GET /api/v1/roles` |
| Profil Sekolah | `/dashboard/pengaturan` | `PengaturanPage.jsx` | `can('sistem.pengaturan')` | `GET /api/v1/settings` |

STATUS MAP: `VERIFIED & SYNCHRONIZED (100% MATCH)`
