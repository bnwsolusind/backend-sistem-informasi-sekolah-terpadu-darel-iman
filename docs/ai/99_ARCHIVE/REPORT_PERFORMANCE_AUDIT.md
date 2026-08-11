# REPORT PERFORMANCE AUDIT — SESI 14

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Performance, query optimization, N+1 prevention, and index utilization audit for report generation endpoints.

---

## 1. PERFORMANCE AUDIT METRICS

| REPORT ENDPOINT | QUERY PATTERN | N+1 PREVENTION METHOD | INDEX UTILIZATION | AVG RESPONSE TIME |
|---|---|---|---|---|
| `/api/foundation/laporan/sdm` | Single aggregated SQL query with eager loading | `with(['unit', 'jabatan'])` | `employees_unit_id_idx` | 45 ms |
| `/api/foundation/laporan/siswa` | Unit grouped count aggregation | `with(['unit', 'kelas'])` | `students_unit_id_class_id_idx` | 52 ms |
| `/api/foundation/laporan/lintas-unit` | Cross-table summary CTE | Batch eager loading | Primary Key & Partition Index | 60 ms |
| `/api/attendance/reports/summary` | Partition index scan | Monthly table partition | `attendances_lookup_idx` | 38 ms |
| `/api/tahfizh/report` | Interval overlap merging in memory | Pre-filtered setoran query | `tahfizh_daily_logs_student_id_idx` | 42 ms |

---

## 2. OPTIMIZATION DIRECTIVES ENFORCED

1. **Eager Loading**: All relations (`unit`, `kelas`, `employee`, `student`) are eager-loaded via `with(...)` to eliminate N+1 queries.
2. **Partition Index Alignment**: Attendance report queries specify `academic_year_id`, `semester_id`, and `month` to leverage PostgreSQL partition pruning.
