# REPORT BROWSER ACCEPTANCE & CHECKLIST — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: E2E browser automation test checklist for reports, drill-downs, and PDF/XLSX exports.

---

## 1. BROWSER E2E TEST CHECKLIST

| TEST SCENARIO | ROLE / ROUTE | PROCEDURE | EXPECTED RESULT | NETWORK RESPONSE | STATUS |
|---|---|---|---|---|---|
| Executive SDM Report | Pengurus Yayasan (`/foundation/laporan/sdm`) | Open page, filter unit, click employee card | Drawer detail loads employee metadata & avatar | `GET /api/foundation/laporan/sdm 200 OK` | PASS |
| Cross-Unit Report | Pengurus Yayasan (`/foundation/laporan/lintas-unit`) | Open page, select academic year filter | Cross-unit comparison cards & table refresh | `GET /api/foundation/laporan/lintas-unit 200 OK` | PASS |
| PDF Export | Pengurus Yayasan (`/foundation/laporan/sdm`) | Click Export PDF | PDF file downloaded with landscape header | `Content-Type: application/pdf 200 OK` | PASS |
| Excel Export | Pengurus Yayasan (`/foundation/laporan/sdm`) | Click Export XLSX | Spreadsheet downloaded with header & data | `Content-Type: application/vnd.openxmlformats... 200 OK` | PASS |
| Unit Scoped Report | Kepala Sekolah (`/kepala-sekolah`) | Access SDM report | Returns own unit data only; cross-unit restricted | `GET /api/employees 200 OK` (Scoped) | PASS |
| Student Attendance Report | Wali Kelas (`/absensi/laporan`) | Filter date range & class | Table shows attendance stats without holidays | `GET /api/attendance/reports/summary 200 OK` | PASS |
| Tahfizh Report | Guru Tahfizh (`/guru-tahfizh`) | Open setoran recap | Merged verse intervals, no duplicate counting | `GET /api/tahfizh/report 200 OK` | PASS |
| Child Portal Report | Orang Tua (`/parent-portal`) | Select child & download report | Child report PDF generated safely | `GET /api/portal/reports/{id}/download 200 OK` | PASS |

---

## 2. RESPONSIVE BREAKPOINT CHECKS

- **360px & 390px (Mobile)**: Filters collapse into drawer, KPI cards render in 2-column grid, tables use horizontal scroll containers with sticky headers, avatars render proportionally.
- **768px & 1024px (Tablet/Desktop)**: Full grid layouts with responsive charts and action buttons visible.
