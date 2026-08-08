# MODULE COMPLETION MATRIX

| Domain | Source of truth | Endpoint/UI | Bukti |
|---|---|---|---|
| Auth, role, permission | PostgreSQL + Spatie | Admin/employee/parent/student | 24 role login; auth PG tests pass |
| Master unit & jenis unit | PostgreSQL | CRUD/options | 15 unit; critical API pass |
| Tahun ajaran & semester | PostgreSQL | CRUD/options/session | 2 tahun, 3 semester runtime |
| Pegawai, jabatan, guru | PostgreSQL | CRUD/import/export/detail | Critical API + scope tests pass |
| Orang tua & siswa | PostgreSQL | CRUD/portal/child switcher | Parent multi-child + self-scope pass |
| Kelas/rombel/mapel/kurikulum | PostgreSQL | CRUD/options/import/export | Schema + lookup tests pass |
| Jadwal & attendance | PostgreSQL/partisi | Workflow/approval/export | 12 partisi + API pass |
| LMS | PostgreSQL | Materi, tugas, submission, presensi, nilai | Critical API pass |
| CBT | PostgreSQL | Kisi, bank soal, ujian, timeout | Security/timeout/schema pass |
| Nilai & rapor | PostgreSQL | Rekap/finalisasi/publish/export | API and ownership tests pass |
| Tahfizh & mutabaah | PostgreSQL | Input, recap, approval, parent sign | FK class/rombel corrected; PG pass |
| Notification & chat | PostgreSQL | Bell/toast/timeline/chat | Scope + dual-schema tests pass |
| Foundation reports | PostgreSQL | Filter/drilldown/export | Reporting/export tests pass |
| Dashboard role | PostgreSQL services | Role-specific dashboard | Dashboard role/access tests pass |

Inventori: **704 route (698 API), 73 controller, 41 seeder, 130 page React, 112 komponen**. Tidak ada route atau kontrak API yang diubah pada penyempurnaan sesi ini.

