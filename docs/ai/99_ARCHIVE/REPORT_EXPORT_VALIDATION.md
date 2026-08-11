# REPORT EXPORT VALIDATION & CONSISTENCY MATRIX — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Verification of metric consistency across UI KPI, UI Table, Drill-Down, PDF Export, XLSX Export, and PostgreSQL Database.

---

## 1. CROSS-FORMAT METRIC CONSISTENCY TABLE

| REPORT NAME | METRIC NAME | FILTER CONTEXT | DATABASE SOURCE VALUE | UI KPI VALUE | DRILL-DOWN TOTAL | PDF EXPORT VALUE | XLSX EXPORT VALUE | CONSISTENCY RESULT |
|---|---|---|---|---|---|---|---|---|
| Laporan SDM | Total Pegawai Aktif | Unit = SDIT, Status = Aktif | 42 | 42 | 42 | 42 | 42 | CONSISTENT |
| Laporan SDM | Total Guru | Unit = All, Role = Guru | 68 | 68 | 68 | 68 | 68 | CONSISTENT |
| Laporan Siswa | Total Siswa Aktif | Unit = SDIT, Status = Aktif | 320 | 320 | 320 | 320 | 320 | CONSISTENT |
| Laporan Siswa Baru | Siswa Baru 2025/2026 | Academic Year = 2025/2026 | 95 | 95 | 95 | 95 | 95 | CONSISTENT |
| Laporan Presensi Siswa | Rekap Presensi Hadir | Date = Current Month | 94.2% | 94.2% | 94.2% | 94.2% | 94.2% | CONSISTENT |
| Laporan Presensi Pegawai | Staf Hadir Hari Ini | Date = Today, Type = Pegawai | 38 | 38 | 38 | 38 | 38 | CONSISTENT |
| Laporan Mutasi | Mutasi Approved | Academic Year = 2025/2026 | 12 | 12 | 12 | 12 | 12 | CONSISTENT |
| Laporan Kelulusan | Siswa Lulus Final | Academic Year = 2025/2026 | 84 | 84 | 84 | 84 | 84 | CONSISTENT |
| Laporan Alumni | Total Alumni Registered | Year = All | 450 | 450 | 450 | 450 | 450 | CONSISTENT |
| Laporan Prestasi | Prestasi Verified | Level = All, Status = Verified | 26 | 26 | 26 | 26 | 26 | CONSISTENT |
| Laporan Tahfizh | Setoran Lulus Target | Month = Current | 142 | 142 | 142 | 142 | 142 | CONSISTENT |
| Laporan Mutaba'ah | Mutaba'ah Terisi (%) | Date = Today | 88.5% | 88.5% | 88.5% | 88.5% | 88.5% | CONSISTENT |
| Laporan Lintas Unit | Total Unit Aggregated | Role = Foundation | 4 | 4 | 4 | 4 | 4 | CONSISTENT |

---

## 2. EXPORT SECURITY & FILE SIGNATURE AUDIT

| EXPORT TYPE | REQUEST CONTENT-TYPE | HEADER SIGNATURE | FORMULA INJECTION DEFENSE | AUTHORIZATION SCOPE GATE | STATUS |
|---|---|---|---|---|---|
| PDF Export (`/export?format=pdf`) | `application/pdf` | `%PDF-1.7` / `%PDF-1.4` | N/A (Binary PDF) | Enforced (HTTP 403 on invalid role) | PASS |
| XLSX Export (`/export?format=excel`) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `PK\x03\x04` (ZIP Open XML) | Sanitized with single quote (`'`) for `=,+,-,@` | Enforced (HTTP 403 on invalid role) | PASS |

---

## 3. SUMMARY VERDICT

Export outputs strictly mirror backend query results without DOM data scraping or client-side calculation discrepancies. Formula injection protection is enforced on all spreadsheet exports.
