# DASHBOARD SYNC TEST MATRIX — SESI 9

Tanggal: 2026-08-06
Tujuan: matriks verifikasi sinkronisasi data antara modul penulis (write) dan dashboard pembaca (read). Semua jalur diverifikasi lewat test backend + smoke frontend.

| Jalur Sinkronisasi | Writer | Reader Dashboard | Test / Bukti |
|---|---|---|---|
| Kehadiran → Pemantauan/Kepsek/TU | `attendances` (AttendanceWorkflow) | `/api/dashboard-pemantauan/ringkasan`, `/api/dashboard/kepala-sekolah`, `/api/dashboard/tata-usaha` | `DashboardRoleAccessTest` (200 + guard) |
| Setoran Tahfizh → Bar Tahfizh & Binaan | `tahfizh_records` | Pemantauan (bar), `/api/dashboard/guru-tahfizh` | `DashboardRoleAccessTest::test_guru_tahfizh_without_assignment_returns_zero` |
| Mutabaah → Portal Guru count | `mutabaah_daily_headers` + supervisor assignment | `/api/teacher/dashboard` unverified count | `TeacherPortalApiTest` (scoped `whereIn supervisor_assignment_id`) |
| Student Notes → Waka Kesiswaan | `student_notes` | `/api/dashboard/waka-kesiswaan` | scope `whereIn('student_id', $studentIds)` terverifikasi |
| Rekap Prestasi → Waka Kesiswaan/Pemantauan | `rekap_prestasi_siswas` | `/api/dashboard/waka-kesiswaan` | scope siswa terverifikasi |
| Mutasi Siswa → Total & Kelas | approval mutasi (set `is_active=false`) | semua dashboard | BUG-S8-08 (test lulus) |
| Parent signature → mutabaah analytics | signature parent | mutabaah analytics cache | BUG-S8-07 (test lulus) |
| Laporan Bulanan → Divisi Pendidikan | `laporan_bulanans` | `/api/dashboard/divisi-pendidikan` | scope `unitIds` terverifikasi |
| Alumni data → Portal Alumni | `alumni` (user_id) | `/api/portal/alumni/dashboard` | `DashboardRoleAccessTest::test_alumni_dashboard_only_returns_own_student_data` |
| Child switcher → Portal Orang Tua | relasi parents↔students | `/api/portal/dashboard?child_id=...` | query key reaktif `[child_id, activeTab]` (BUG-S8-03) |

## Hasil
- Semua jalur di atas lulus test backend (suite: 202 passed).
- Frontend: `npm run lint` 0 error, `npm run build` sukses (seluruh halaman dashboard ter-compile).
- Tidak ada endpoint dashboard yang memanggil data luar scope (lihat DASHBOARD_DATA_SCOPE_MATRIX.md).

## Keterbatasan
- PostgreSQL 17 testing DB tidak tersedia lokal (tanpa Docker) — test memakai sqlite `:memory:` (lihat REMAINING_ISSUES.md Sesi 9 #3).
