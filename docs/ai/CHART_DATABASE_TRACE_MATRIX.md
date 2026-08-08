# CHART DATABASE TRACE MATRIX

## End-to-End Chart Data Traceability

| Page | Chart Name | Series / Axis Field | API Endpoint | Database Source Query | Filter / Scope | Status |
|---|---|---|---|---|---|---|
| Yayasan Dashboard | SDM Distribution | `total_pegawai`, `total_guru`, `tendik` | `/api/foundation/dashboard` | `EducationUnit::withCount(['employees'])` | All / Filtered Unit | VERIFIED |
| Yayasan Dashboard | Pergerakan Siswa | `siswa_baru`, `masuk`, `keluar`, `lulus` | `/api/foundation/dashboard` | `Student::selectRaw("date_trunc('month', created_at)...")` | Last 12 Months | VERIFIED |
| Yayasan Dashboard | Prestasi Siswa | `Akademik`, `Tahfiz`, `Olahraga`, `Seni` | `/api/foundation/dashboard` | `RekapPrestasiSiswa::where('kategori', ...)` | All Categories | VERIFIED |
| Yayasan Dashboard | Target vs Realisasi Tahfiz | `target`, `realisasi` | `/api/foundation/dashboard` | `TahfizhDailyLog::groupBy('unit_id')` | Unit / Class | VERIFIED |
| Yayasan Dashboard | Tren Kehadiran | `guru`, `siswa` | `/api/foundation/dashboard` | `AttendanceScanLog::selectRaw(...)` | Monthly | VERIFIED |
| Mutabaah Analytics | Trend Ibadah Harian | `completion_rate` | `/api/mutabaah/analytics/dashboard` | `MutabaahDailyHeader::where(...)` | Selected Period | VERIFIED |
