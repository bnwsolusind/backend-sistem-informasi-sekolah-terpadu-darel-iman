# BROWSER RUNTIME DATA AUDIT

## Network Traceability Log

| Route | UI Section | Network Request | HTTP Status | Response Field | UI Value | Match Result |
|---|---|---|---|---|---|---|
| `/dashboard` | Total Unit KPI | `GET /api/foundation/dashboard` | 200 OK | `kpis.total_unit` | Matches DB count | MATCH |
| `/dashboard` | Total Pegawai KPI | `GET /api/foundation/dashboard` | 200 OK | `kpis.total_pegawai` | Matches DB count | MATCH |
| `/dashboard` | Total Guru KPI | `GET /api/foundation/dashboard` | 200 OK | `kpis.total_guru` | Matches DB count | MATCH |
| `/dashboard` | Total Siswa Aktif KPI | `GET /api/foundation/dashboard` | 200 OK | `kpis.total_siswa_aktif` | Matches DB count | MATCH |
| `/dashboard` | Siswa Baru KPI | `GET /api/foundation/dashboard` | 200 OK | `kpis.siswa_baru` | Matches DB count | MATCH |
| `/dashboard` | Mutasi Masuk KPI | `GET /api/foundation/dashboard` | 200 OK | `kpis.mutasi_masuk` | Matches DB count | MATCH |
| `/dashboard` | Mutasi Keluar KPI | `GET /api/foundation/dashboard` | 200 OK | `kpis.mutasi_keluar` | Matches DB count | MATCH |
| `/dashboard` | Siswa Lulus KPI | `GET /api/foundation/dashboard` | 200 OK | `kpis.siswa_lulus` | Matches DB count | MATCH |
| `/dashboard` | Monitoring Akademik | `GET /api/foundation/dashboard` | 200 OK | `monitoring_akademik` | Matches DB metrics | MATCH |
| `/dashboard` | Monitoring Ibadah | `GET /api/foundation/dashboard` | 200 OK | `monitoring_ibadah` | Matches DB metrics | MATCH |
| `/dashboard` | Unit Rankings | `GET /api/foundation/dashboard` | 200 OK | `unit_rankings` | Matches DB units | MATCH |
| `/dashboard` | Agenda Yayasan | `GET /api/foundation/dashboard` | 200 OK | `agenda_yayasan` | Matches DB announcements | MATCH |
| `/dashboard` | Aktivitas Terbaru | `GET /api/foundation/dashboard` | 200 OK | `recent_activities` | Matches DB scan logs | MATCH |
