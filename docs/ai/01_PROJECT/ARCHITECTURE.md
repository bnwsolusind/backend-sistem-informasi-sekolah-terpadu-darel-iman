# ARCHITECTURE

## Pipeline Source of Truth

```text
PostgreSQL → Model → Repository → Service → API Endpoint → React Query / Axios → UI Component
```

Setiap modul mengikuti pipeline ini. Data hanya berasal dari PostgreSQL (tidak ada mock/hardcode bisnis).

## Verifikasi Pipeline per Domain

| Domain | Service | API utama | Frontend service |
|---|---|---|---|
| Dashboard utama | `DashboardService` | `GET /api/dashboard/stats` | `useQuery('dashboard-stats')` |
| Yayasan/Foundation | `FoundationDashboardService` | `GET /api/foundation/dashboard` | `managementDashboardService` |
| Master unit & jabatan | `EducationUnitService` | `GET /api/master/education-units` | `educationUnitService` |
| Kepegawaian & guru | `EmployeeService` | `GET /api/employees` | `employeeService` |
| Siswa & wali | `StudentService` | `GET /api/students` | `studentService` |
| Kurikulum & mapel | `MasterKurikulumService` | `GET /api/academic/curriculums` | `masterKurikulumService` |
| Kelas & jadwal | `KelasService` / `ScheduleService` | `GET /api/academic/kelas` | `kelasService` |
| Presensi pembelajaran | `AttendanceService` | `GET /api/lms/presensi` | `lmsPresensiService` |
| Absensi gerbang & ibadah | `GateAttendanceService` | `GET /api/attendance/gate` | `gateAttendanceService` |
| LMS materi & tugas | `LmsMateriService` | `GET /api/lms/materi` | `lmsMateriService` |
| Submission tugas | `LmsPenugasanService` | `GET /api/lms/pengumpulan-tugas` | `lmsPenugasanService` |
| CBT | `LmsUjianRepository` | `GET /api/lms/ujian` | `lmsUjianService` |
| Nilai & rapor | `RaporService` | `GET /api/academic/rapor` | `lmsRaporService` |
| Tahfizh & doa | `TahfizhService` | `GET /api/tahfizh` | `tahfizhService` |
| Mutabaah | `MutabaahEnterpriseService` | `GET /api/mutabaah/enterprise` | `mutabaahService` |
| Mutasi & kelulusan | `AlumniService` | `GET /api/alumni` | `alumniService` |
| Chat role-scoped | `ChatService` | `GET /api/chat/messages` | `chatService` |
| Notifikasi canonical | `NotificationRepository` | `GET /api/notifications` | `reportService.notifications` |

## Aturan Arsitektur

- UI membaca data langsung dari React Query/Axios response; dilarang array bisnis lokal sebagai fallback.
- Semua mutasi (create/update/delete/restore) melalui endpoint RESTful dan memicu `queryClient.invalidateQueries()`.
- Backend adalah otoritas scope/permission; frontend guard hanyalah UX layer.
- Eager loading (`with()`) diwajibkan untuk mencegah N+1.
- UI component hanya presentasi; tidak boleh menulis data.

## Referensi

- Scope data per role: `02_DATABASE/DATA_SCOPE.md`
- Kontrak API: `06_API/API_CONTRACT.md`
