# Dashboard API Map

| Endpoint | Controller / service | Akses |
| --- | --- | --- |
| `GET /api/foundation/dashboard` | `FoundationDashboardController@index` → `FoundationDashboardService` | `foundation.dashboard.view` |
| `GET /api/teacher/dashboard` | `TeacherPortalController@dashboard` | Route portal guru |
| `GET /api/portal/dashboard` | `StudentParentPortalController@dashboard` | `Orang Tua` atau `Siswa` |
| `GET /api/dashboard-pemantauan/ringkasan` | `DashboardPemantauanController@ringkasan` | Role legacy, scope perlu diperkuat |

Kontrak foundation saat ini mengembalikan `kpis`, `charts`, `unit_summaries`, `recent_information`, dan konteks tahun ajaran/semester.
