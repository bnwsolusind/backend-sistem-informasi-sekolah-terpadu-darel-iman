# BROWSER MCP ACCEPTANCE & CHECKLIST — SESI 13.5

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Browser automation test checklist for master data lookups and dependent dropdowns.

---

## 1. MANUAL & AUTOMATED BROWSER TEST CHECKLIST

| TEST SCENARIO | PROCEDURE | EXPECTED RESULT | NETWORK VERIFICATION | STATUS |
|---|---|---|---|---|
| Unit Switcher (Header) | Click Unit Dropdown in Header | Option list updates dynamically from `/api/education-units` | `GET /api/education-units 200 OK` | PASS |
| Form Siswa (Master) | Select Unit $\rightarrow$ Select Tahun Ajaran $\rightarrow$ Select Kelas $\rightarrow$ Select Rombel | Options list cascade updates; child values reset on parent change | `GET /api/kelas/options?unit_id=... 200 OK` | PASS |
| Form Pegawai & Guru | Open Employee Form $\rightarrow$ Select Unit & Jabatan | Jabatan & Unit list fetched from database options | `GET /api/jabatan/options 200 OK` | PASS |
| Form Modul Ajar (LMS) | Select Kurikulum $\rightarrow$ Select Mapel $\rightarrow$ Select CP $\rightarrow$ Select TP | CP and TP options filtered strictly by selected subject & curriculum | `GET /api/lms/modul-ajar/options 200 OK` | PASS |
| Form Mutaba'ah | Select Template $\rightarrow$ Select Indikator $\rightarrow$ Select Mentor | Indicators & mentors loaded from enterprise options API | `GET /api/mutabaah/enterprise/options 200 OK` | PASS |
| Form Tahfizh | Select Surah $\rightarrow$ Select Ayat Range $\rightarrow$ Select Student | Surah list loaded from 114 surahs database table | `GET /api/quran/surahs 200 OK` | PASS |
| Child Switcher (Parent Portal) | Log in as Parent $\rightarrow$ Click Child Switcher | Options update dynamically with linked children | `GET /api/portal/children 200 OK` | PASS |

---

## 2. NETWORK AUDIT SUMMARY

- **Network Requests for Options**: Verified API endpoints return HTTP 200 with standard options contract.
- **Data Isolation**: Query keys include `[unit_id, academic_year_id, role]`, preventing stale cache leakage across users or units.
