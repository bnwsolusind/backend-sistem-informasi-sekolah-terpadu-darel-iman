# ERROR STANDARD

Standar error codes. Bukti historis: `99_ARCHIVE/CROSS_MODULE_API_CONTRACT.md`, `99_ARCHIVE/SECURITY_ACCESS_HARDENING_AUDIT.md`, `99_ARCHIVE/HARDCODED_ACCESS_AUDIT.md`, `99_ARCHIVE/POSTGRESQL_API_SMOKE_REPORT.md`.

## Envelope Error

```json
{ "success": false, "message": "...", "error_code": "..." }
```

| HTTP | `error_code` | Kapan |
|---|---|---|
| 401 | `UNAUTHENTICATED` | Tidak/belum autentikasi |
| 403 | `FORBIDDEN` | Autentikasi tapi tidak punya scope/role (fail-closed) |
| 404 | `NOT_FOUND` | Resource tidak ditemukan / konteks tidak dikenal |
| 422 | `VALIDATION_FAILED` | Validasi Form Request gagal → `errors: { field: [msg] }` |
| 500 | `SERVER_ERROR` | Internal server error |

## Aturan Fail-Closed

- Konteks (siswa/pegawai/unit) dibaca dari **auth**, bukan request — tidak dikenal → 404/403 (bukan throw, bukan fallback record sewenang-wenang).
- Role di luar daftar izin pada route middleware → 403.
- Penerima non-aktif / non-pegawai pada chat employee → 403.
- Nilai ujian/CBT: response tidak membocorkan data sebelum gate (`tampilkan_nilai_langsung`).

## Aturan Opsional (Endpoint Options)

Endpoints options memeriksa role & unit permission; melanggar scope → **HTTP 403** (tidak menyajikan data kosong palsu). Sensitive data (hash password, token, finansial) tidak pernah masuk payload.

## Client Handling

Frontend: 401 → redirect login; 403 → sembunyikan aksi + `AppErrorState`; 404 → `AppEmptyState`; 422 → tampilkan `errors` per field di form; 500 → `AppErrorState` + Retry. Format konsisten dipakai `api.js`/services.

## Referensi

- Detail arsip: `99_ARCHIVE/CROSS_MODULE_API_CONTRACT.md`, `99_ARCHIVE/SECURITY_ACCESS_HARDENING_AUDIT.md`, `99_ARCHIVE/HARDCODED_ACCESS_AUDIT.md`
