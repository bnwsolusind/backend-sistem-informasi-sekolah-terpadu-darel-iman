# REPORT DRILL-DOWN MATRIX — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Specification of interactive drill-down actions from high-level KPIs to granular list views.

---

## 1. KPI TO DRILL-DOWN MODAL/DRAWER SPECIFICATION

| REPORT PAGE | KPI CARD / CHART METRIC | INTERACTIVE TRIGGER | DRILL-DOWN TARGET | DRILL-DOWN DATA PAYLOAD |
|---|---|---|---|---|
| Laporan SDM | Total Pegawai Aktif | Click Card | Drawer List Pegawai | `GET /api/foundation/laporan/sdm/detail/{id}` |
| Laporan Siswa | Total Siswa Per Unit | Click Bar Chart | Modal List Siswa Unit | `GET /api/foundation/laporan/siswa/detail/{id}` |
| Laporan Presensi Siswa | Rekap Alpha Rombel | Click KPI / Cell | Drawer List Siswa Alpha | `GET /api/attendance/reports/summary?status=Alpha` |
| Laporan Presensi Pegawai | Rekap Presensi Staf | Click Bar Chart | Detail Logs Presensi Pegawai | `GET /api/attendance/reports/summary?type=Employee` |
| Laporan Mutasi | Siswa Mutasi Masuk/Keluar | Click Status Card | Modal Detail Mutasi Siswa | `GET /api/foundation/laporan/mutasi/detail/{id}` |
| Laporan Kelulusan | Siswa Lulus Final | Click KPI Card | Modal Detail Kelulusan Siswa | `GET /api/foundation/laporan/kelulusan/detail/{id}` |
| Laporan Alumni | Alumni Per Angkatan | Click Bar Chart | Modal List Alumni | `GET /api/foundation/laporan/alumni/detail/{id}` |
| Laporan Tahfizh | Target Belum Tercapai | Click KPI Card | Drawer List Siswa Target Pending | `GET /api/tahfizh/report?status=pending` |
| Laporan Mutaba'ah | Rekap Belum Mengisi | Click KPI / Chart | Drawer List Siswa Incomplete | `GET /api/mutabaah/analytics/recap?status=incomplete` |
| Laporan Lintas Unit | Perbandingan Kehadiran | Click Unit Row | Drawer Summary Unit | `GET /api/foundation/laporan/lintas-unit` |

---

## 2. DRILL-DOWN UX REQUIREMENTS

- **Avatar Rendering**: All drill-down modals/drawers rendering individuals incorporate `<PersonAvatar />`.
- **Search & Pagination**: Server-side pagination and search input provided in all drill-down drawers.
- **Filter Retention**: Drill-down modal retains active page filters (unit, period, date range).
