# REPORT EXPORT MATRIX — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Specification and validation of PDF and XLSX export engines across all enterprise reports.

---

## 1. EXPORT ENGINE & FORMAT SPECIFICATION

| REPORT TYPE | EXPORT ENDPOINT | PDF ENGINE | EXCEL ENGINE | ORIENTATION | CONTENT-TYPE |
|---|---|---|---|---|---|
| Laporan SDM | `/api/foundation/laporan/sdm/export` | DomPDF (`reports.pdf.generic`) | Laravel-Excel | Landscape | `application/pdf` / `.xlsx` |
| Laporan Siswa | `/api/foundation/laporan/siswa/export` | DomPDF (`reports.pdf.generic`) | Laravel-Excel | Landscape | `application/pdf` / `.xlsx` |
| Laporan Mutasi | `/api/foundation/laporan/mutasi/export` | DomPDF (`reports.pdf.generic`) | Laravel-Excel | Landscape | `application/pdf` / `.xlsx` |
| Laporan Kelulusan | `/api/foundation/laporan/kelulusan/export` | DomPDF (`reports.pdf.generic`) | Laravel-Excel | Landscape | `application/pdf` / `.xlsx` |
| Laporan Alumni | `/api/foundation/laporan/alumni/export` | DomPDF (`reports.pdf.generic`) | Laravel-Excel | Landscape | `application/pdf` / `.xlsx` |
| Laporan Lintas Unit | `/api/foundation/laporan/lintas-unit/export` | DomPDF (`reports.pdf.generic`) | Laravel-Excel | Landscape | `application/pdf` / `.xlsx` |
| Laporan Presensi | `/api/attendance/reports/export` | DomPDF (`reports.pdf.generic`) | Laravel-Excel | Landscape | `application/pdf` / `.xlsx` |
| Laporan Portal | `/api/portal/reports/{id}/download` | DomPDF | Laravel-Excel | Portrait | `application/pdf` / `.xlsx` |

---

## 2. EXPORT QUALITY DIRECTIVES

1. **Backend Driven**: Export generation reads strictly from backend database service queries (never from DOM/HTML scraping).
2. **Filter Matching**: Active page filters (`unit_id`, `academic_year_id`, `date_range`) are passed directly to export services.
3. **Formula Injection Defense**: Text cells starting with `=`, `+`, `-`, `@` are sanitized in Excel exports.
