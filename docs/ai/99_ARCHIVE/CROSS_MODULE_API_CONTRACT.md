# CROSS MODULE API CONTRACT — SIMSIT

Tanggal Update: 2026-08-06  
Status Sesi: Sesi 8 Finalization Passed  

---

## SPESIFIKASI API CONTRACT TERSTANDAR

```json
{
  "SUCCESS_RESPONSE": {
    "success": true,
    "message": "Data retrieved successfully",
    "data": {},
    "meta": {
      "page": 1,
      "limit": 15,
      "total": 100,
      "last_page": 7
    }
  },
  "ERROR_401": {
    "success": false,
    "message": "Unauthenticated access",
    "error_code": "UNAUTHENTICATED"
  },
  "ERROR_403": {
    "success": false,
    "message": "Unauthorized access for requested scope or role",
    "error_code": "FORBIDDEN"
  },
  "ERROR_404": {
    "success": false,
    "message": "Resource not found",
    "error_code": "NOT_FOUND"
  },
  "ERROR_422": {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "field_name": ["The field_name field is required."]
    }
  },
  "ERROR_500": {
    "success": false,
    "message": "Internal server error",
    "error_code": "SERVER_ERROR"
  },
  "DATE_FORMAT": "YYYY-MM-DD",
  "TIMEZONE": "Asia/Jakarta (UTC+07:00)",
  "UUID_FORMAT": "v4 RFC 4122 Standard (36 characters lower-case hyphenated)",
  "PHOTO_FIELD": "photo_url (URL string pointing to public storage or base64 fallback)",
  "NULL_HANDLING": "Explicit null value for nullable fields, no missing keys in object schemas",
  "STATUS_ENUM": ["aktif", "non_aktif", "mutasi_keluar", "mutasi_masuk", "lulus", "alumni"]
}
```
