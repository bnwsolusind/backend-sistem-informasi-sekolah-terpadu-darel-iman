# API FAILURE FALLBACK AUDIT

## Strict Anti-Fake Fallback Standard
The system strictly prohibits falling back to fake/demo business objects when an API request fails. 

### Audit Rules:
- ❌ **DISALLOWED**: `apiData || demoData`, `students || mockStudents`, `kpiValue || 100`
- ✅ **ALLOWED**: Render Error Component (`ReportErrorState`), empty state message (`Belum ada data`), or throw standard error notification with retry button.

### Failure Audit Results Matrix

| Page / Route | Tested API Failure Behavior | Observed UI Result | Fake Data Rendered? | Status |
|---|---|---|---|---|
| `/dashboard` | Simulate 500 / Network Error on `/api/foundation/dashboard` | Displays loading spinner -> error toast notification | NO | PASS |
| `/dashboard/teacher-workspace` | Simulate 500 / Network Error on `/api/teacher/dashboard` | Renders clean empty/error state for classes & schedules | NO | PASS |
| `/dashboard/students` | Simulate 500 / Network Error on `/api/foundation/students` | Displays error message "Gagal memuat data siswa" | NO | PASS |
| `/dashboard/attendance` | Simulate 500 / Network Error on `/api/attendance/logs` | Displays "Gagal memuat data presensi" with retry button | NO | PASS |
| `/portal/parent` | Simulate 500 / Network Error on `/api/portal/parent/overview` | Displays parent error alert | NO | PASS |
| `/portal/student` | Simulate 500 / Network Error on `/api/portal/student/overview` | Displays student error alert | NO | PASS |
