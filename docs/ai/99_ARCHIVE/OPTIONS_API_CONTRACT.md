# OPTIONS API CONTRACT — SESI 13.5

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Standardization of API options payloads, pagination, search, and error responses.

---

## 1. STANDARD OPTIONS PAYLOAD FORMAT

Seluruh endpoint options menyajikan payload JSON seragam dengan struktur `status`, `message`, dan `data`:

```json
{
  "status": "success",
  "message": "Data opsi master berhasil dimuat.",
  "data": [
    {
      "value": "9b1deb4d-3b7d-4169-8650-2c776b92a2a0",
      "label": "1 A — SDIT Test Unit",
      "meta": {
        "unit_id": "8a1deb4d-3b7d-4169-8650-2c776b92a111",
        "academic_year_id": "7a1deb4d-3b7d-4169-8650-2c776b92a000",
        "kode_kelas": "KLS-1A",
        "kapasitas": 30
      }
    }
  ]
}
```

---

## 2. COMMON QUERY PARAMETERS

Seluruh options endpoint mendukung query parameters baku:
- `search` (string, ILIKE search)
- `unit_id` (uuid, Unit Scoping)
- `academic_year_id` (uuid, Period Scoping)
- `semester_id` (uuid, Semester Scoping)
- `class_id` (uuid, Class Scoping)
- `subject_id` (uuid, Subject Scoping)
- `cp_id` (uuid, CP Scoping)
- `per_page` (integer, default 50)
- `page` (integer, default 1)

---

## 3. SECURITY & DATA REDACTION RULES

- **Data Sensitif Dikeluarkan**: Hash password, token auth, dan identitas finansial tidak dimasukkan dalam payload meta options.
- **Scope Enforced**: Endpoint options memeriksa role & unit permission pengguna terautentikasi (HTTP 403 jika melanggar scope).
