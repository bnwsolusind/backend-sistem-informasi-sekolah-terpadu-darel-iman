# API Dashboard Pengurus Yayasan

## Base Path: `/api/foundation`

Semua endpoint menggunakan proteksi `auth:sanctum` dan validasi permission `foundation.*`.

### Endpoint List

1. `GET /api/foundation/dashboard`
   - Response: `kpis`, `charts` (sdm distribution & student movements), `unit_summaries`, `recent_information`.
2. `GET /api/foundation/units`
   - Query: `academic_year_id`, `jenis_unit_id`, `status`, `search`.
3. `GET /api/foundation/units/{id}`
   - Response: Detail unit beserta agregasi SDM, siswa, mutasi, kelulusan, alumni, dan informasi.
4. `GET /api/foundation/employees`
   - Query: `unit_id`, `jabatan_id`, `status_pegawai`, `jenis_kelamin`, `search`.
5. `GET /api/foundation/students`
   - Query: `unit_id`, `academic_year_id`, `kelas_id`, `gender`, `search`.
6. `GET /api/foundation/new-students`
   - Query: `academic_year_id`, `unit_id`.
7. `GET /api/foundation/student-mutations`
   - Query: `academic_year_id`, `unit_id`, `type`.
8. `GET /api/foundation/graduations`
   - Query: `academic_year_id`, `unit_id`.
9. `GET /api/foundation/alumni`
   - Query: `unit_id`, `tahun_lulus`, `search`.
10. `GET /api/foundation/information`
    - Query: `unit_id`, `kategori`, `search`.
11. `GET /api/foundation/reports`
    - Query: `type`, `academic_year_id`, `unit_id`, `format`.
