# REPORT ROLE SCOPE MATRIX — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Scoping and access permissions across all 11 system roles for reports and exports.

---

## 1. ROLE-BASED REPORT ACCESS PERMISSIONS

| ROLE | CROSS-UNIT REPORTS | UNIT-LEVEL REPORTS | CLASS/TEACHER REPORTS | SELF/CHILD REPORTS | EXPORT PDF/XLSX |
|---|---|---|---|---|---|
| Super Admin | FULL ACCESS | FULL ACCESS | FULL ACCESS | FULL ACCESS | ALLOWED |
| Pengurus Yayasan | FULL ACCESS | READ-ONLY | READ-ONLY | DENIED | ALLOWED |
| Divisi Pendidikan | READ-ONLY | READ-ONLY | READ-ONLY | DENIED | ALLOWED |
| Kepala Sekolah | DENIED | OWN UNIT ONLY | OWN UNIT ONLY | DENIED | ALLOWED (OWN UNIT) |
| TU (Tata Usaha) | DENIED | OWN UNIT ONLY | OWN UNIT ONLY | DENIED | ALLOWED (OWN UNIT) |
| Guru | DENIED | DENIED | ASSIGNED CLASSES | DENIED | ALLOWED (ASSIGNED) |
| Guru Tahfizh | DENIED | DENIED | ASSIGNED HALAQAH | DENIED | ALLOWED (HALAQAH) |
| Wali Kelas | DENIED | DENIED | HOMEROOM ROMBEL | DENIED | ALLOWED (HOMEROOM) |
| Operator | DENIED | OWN UNIT ENTRY | DENIED | DENIED | ALLOWED |
| Orang Tua | DENIED | DENIED | DENIED | LINKED CHILDREN ONLY | ALLOWED (CHILD) |
| Siswa | DENIED | DENIED | DENIED | SELF DATA ONLY | DENIED (SCREEN VIEW ONLY) |

---

## 2. SECURITY ENFORCEMENT RULES

1. **HTTP 403 Forbidden**: Access to reports outside role scope returns standard 403 error.
2. **Export Protection**: Export endpoints (`/export?format=pdf` & `/export?format=excel`) strictly enforce the same authorization gates as report view endpoints.
