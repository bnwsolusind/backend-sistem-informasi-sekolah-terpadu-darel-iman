# DASHBOARD KPI SOURCE MAP — SESI 9

Tanggal: 2026-08-06
Tujuan: memetakan SETIAP KPI yang tampil di dashboard ke sumber data backend yang REAL. Tidak ada hardcode/mock/`apiValue || 120`.

| KPI | Halaman | Sumber Backend (Service/Method) | Query/Source |
|---|---|---|---|
| Total Siswa | Semua dashboard | `Student::where('is_active', true)` (+ scope unit) | `students` (unit_id, kelas_id, nis, nisn, gender, is_active, status) |
| Total Guru/Pegawai | Semua dashboard | `Employee` (wajib `niy`) (+ scope unit) | `employees` via `unit_id` |
| Kehadiran Hari Ini | Kepsek/TU/Pemantauan | `attendances` whereDate `attendance_date` hari ini | status: late/absent/present |
| Tren Kehadiran 7 Hari | Kepsek | attendance trend 7 hari `whereIn('student_id', pluck(studentQuery))` | `attendances` |
| Statistik Keterlambatan/Ketidakhadiran | Pemantauan | `DB::table('attendances')->where('status','late'|'absent')` | `attendances` |
| Donut Chart Hadir/Terlambat/Tidak Hadir | Pemantauan | `$hadirHariIni - $terlambat - $tidakHadir` (max 0) | `attendances` |
| Bar Tahfizh per Kelas (7 hari) | Pemantauan | `tahfizh_records` join `classes` SUM(line_count) whereBetween | `tahfizh_records` |
| Indikator Kinerja Utama | Pemantauan | `IndikatorKinerjaUtama::query()` | `indikator_kinerja_utama` |
| Pemantauan Divisi | Pemantauan | `PemantauanDivisi::query()` + search | `pemantauan_divisis` |
| Pengumuman Sekolah | Pemantauan | `PengumumanSekolah::query()` | `pengumuman_sekolahs` |
| Rekap Prestasi Siswa | Waka Kesiswaan / Pemantauan | `RekapPrestasiSiswa` scoped `whereIn('student_id', $studentIds)` | `rekap_prestasi_siswas` |
| Catatan Siswa (Student Notes) | Waka Kesiswaan | `StudentNote` scoped `whereIn('student_id', $studentIds)` | `student_notes` (kolom `content`, TIDAK ada `title`) |
| Siswa Binaan Tahfizh | Guru Tahfizh | `count($assignedStudentIds)` (assignment aktif) | `mutabaah/tahfizh` assignment; tanpa data → 0 |
| Kelas Binaan (Homeroom) | Wali Kelas | `$homeroomClasses` dari relasi wali kelas | `tbl_kelas` (kolom `unit_pendidikan_id`) |
| Statistik Kelas per Unit | Kepsek/Divisi | `Kelas::where('unit_pendidikan_id', $unitIds)` | `tbl_kelas` |
| Mutabaah belum diverifikasi | Portal Guru | `MutabaahSupervisorAssignment::active()->whereIn('supervisor_assignment_id', $assignmentIds)` | scoped ke employee user |
| Data Alumni Pribadi | Alumni | `AlumniPortalController` scope `user_id` | `alumni` |
| Data Anak (Parent) | Orang Tua | `StudentParentPortalController` scope relasi orang tua-anak | `students` ↔ parents |
| Laporan Bulanan per Unit | Divisi Pendidikan | `laporan bulanan` scoped `unitIds` | `laporan_bulanans` |

## Aturan Anti-Mock / Anti-Salah-Saji
1. DILARANG: `apiValue || 120`, hardcode, mock, fallback `Student::all()`, tampilkan `0` saat request gagal. Semua sudah dihapus/divalidasi di Sesi 9 (lihat BUG_FIX_LOG BUG-S9-05 s.d. BUG-S9-07, BUG-S9-09, BUG-S9-10).
2. Bila tabel belum ada, service memakai `Schema::hasTable(...)` untuk fallback deterministik ke 0/collection kosong (bukan angka acak).
3. Scope data selalu dikunci ke unit/kelas/assignment milik user — tidak pernah agregat global untuk dashboard scoped (lihat DASHBOARD_DATA_SCOPE_MATRIX.md).
