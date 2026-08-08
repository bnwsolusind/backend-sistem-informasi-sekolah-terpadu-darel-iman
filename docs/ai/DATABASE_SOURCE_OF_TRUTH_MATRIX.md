# DATABASE SOURCE OF TRUTH MATRIX — SESI 13

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Prinsip ARCHITECTURE:
$$\text{PostgreSQL} \longrightarrow \text{Model} \longrightarrow \text{Repository} \longrightarrow \text{Service} \longrightarrow \text{API Endpoint} \longrightarrow \text{React Query / Axios} \longrightarrow \text{UI Component}$$

---

## 1. PIPELINE SOURCE OF TRUTH METRICS

| MODUL HALAMAN | MODEL POSTGRESQL | REPOSITORY / SERVICE | API ENDPOINT | REACT QUERY / SERVICE FRONTEND | STATUS PIPELINE |
|---|---|---|---|---|---|
| Dashboard Utama | `DashboardStat` / `Attendance` | `DashboardService` | `GET /api/dashboard/stats` | `useQuery('dashboard-stats')` | VERIFIED SOT |
| Yayasan / Foundation | `EducationUnit`, `Employee` | `FoundationDashboardService` | `GET /api/foundation/dashboard` | `managementDashboardService` | VERIFIED SOT |
| Master Unit & Jabatan | `EducationUnit`, `JobTitle` | `EducationUnitService` | `GET /api/master/education-units` | `educationUnitService` | VERIFIED SOT |
| Kepegawaian & Guru | `Employee`, `Teacher` | `EmployeeService` | `GET /api/employees` | `employeeService` | VERIFIED SOT |
| Data Siswa & Wali | `Student`, `Parent` | `StudentService` | `GET /api/students` | `studentService` | VERIFIED SOT |
| Kurikulum & Mapel | `Kurikulum`, `Subject` | `MasterKurikulumService` | `GET /api/academic/curriculums` | `masterKurikulumService` | VERIFIED SOT |
| Kelas & Jadwal | `Kelas`, `Schedule` | `KelasService`, `ScheduleService` | `GET /api/academic/kelas` | `kelasService` | VERIFIED SOT |
| Presensi Pembelajaran | `Attendance`, `LmsPresensi` | `AttendanceService` | `GET /api/lms/presensi` | `lmsPresensiService` | VERIFIED SOT |
| Absensi Gerbang & Ibadah | `GateAttendance`, `WorshipAttendance` | `GateAttendanceService` | `GET /api/attendance/gate` | `gateAttendanceService` | VERIFIED SOT |
| LMS Materi & Tugas | `LmsMateri`, `LmsPenugasan` | `LmsMateriService` | `GET /api/lms/materi` | `lmsMateriService` | VERIFIED SOT |
| Submission Tugas | `LmsPengumpulanTugas` | `LmsPenugasanService` | `GET /api/lms/pengumpulan-tugas` | `lmsPenugasanService` | VERIFIED SOT |
| CBT Bank Soal & Ujian | `LmsBankSoal`, `LmsUjian` | `LmsUjianRepository` | `GET /api/lms/ujian` | `lmsUjianService` | VERIFIED SOT |
| Nilai & Rapor | `StudentGrade`, `LmsRapor` | `RaporService` | `GET /api/academic/rapor` | `lmsRaporService` | VERIFIED SOT |
| Tahfizh & Doa | `TahfizhRecord`, `MasterDoa` | `TahfizhService` | `GET /api/tahfizh` | `tahfizhService` | VERIFIED SOT |
| Mutabaah Yaumiyah | `MutabaahRecord` | `MutabaahEnterpriseService` | `GET /api/mutabaah/enterprise` | `mutabaahService` | VERIFIED SOT |
| Mutasi & Kelulusan | `StudentMutation`, `Alumni` | `AlumniService` | `GET /api/alumni` | `alumniService` | VERIFIED SOT |
| Chat Role-Scoped | `ChatMessage` | `ChatService` | `GET /api/chat/messages` | `chatService` | VERIFIED SOT |
| Notifikasi Canonical | `Notification` | `NotificationRepository` | `GET /api/notifications` | `reportService.notifications` | VERIFIED SOT |

---

## 2. AUDIT PIPELINE DIRECTIVE

 Seluruh komponen UI membaca data langsung dari React Query / Axios response data.
 Tidak ada UI component yang mendefinisikan array bisnis lokal sebagai fallback data.
 Seluruh mutasi (Create, Update, Delete, Restore) melewati endpoint API RESTful dan memicu invalidasi query (`queryClient.invalidateQueries()`).
