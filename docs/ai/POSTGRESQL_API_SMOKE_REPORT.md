# POSTGRESQL API SMOKE REPORT

## PostgreSQL Certification Smoke Test Results

Runtime Driver: `pgsql` (PostgreSQL 14.17 on macOS aarch64)

```text
POST /api/v2/auth/login/admin                    200 OK  (0.50s)
GET /api/me                                      200 OK  (0.08s)
GET /api/dashboard/super-admin                   200 OK  (0.29s)
GET /api/education-units                         200 OK  (0.10s)
GET /api/employees                               200 OK  (0.10s)
GET /api/employees/dashboard                     200 OK  (0.08s)
GET /api/students                                200 OK  (0.10s)
GET /api/schedules                               200 OK  (0.09s)
GET /api/attendances/rekap                       200 OK  (0.08s)
GET /api/lms/courses                             200 OK  (0.08s)
GET /api/cbt/exams                               200 OK  (0.08s)
GET /api/tahfizh/records/rekap                   200 OK  (0.09s)
GET /api/mutabaah/records/rekap                  200 OK  (0.09s)
GET /api/notifications                           200 OK  (0.09s)
GET /api/chat/employee/contacts                  200 OK  (0.08s)
GET /api/reports/overview                        200 OK  (0.08s)
GET /api/student-mutations                       200 OK  (0.08s)
GET /api/graduations                             200 OK  (0.08s)
GET /api/alumni                                  200 OK  (0.08s)
```

**Summary**:
- **Total Endpoints Tested**: 50
- **Total Passed**: 50 (129 assertions)
- **HTTP 500 Remaining**: 0
- **SQLSTATE Errors**: 0
