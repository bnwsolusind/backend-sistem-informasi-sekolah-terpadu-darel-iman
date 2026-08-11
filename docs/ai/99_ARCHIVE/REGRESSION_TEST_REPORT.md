# Laporan Pengujian Regresi Sesi 4, Sesi 5, & Sesi 6

## Ringkasan Pengujian

- **Tanggal Pengujian**: 5 Agustus 2026
- **Lingkup Audit Sesi 4**: Media Pembelajaran, Referensi Pembelajaran, Aktivitas Belajar, Diskusi Kelas, Presensi LMS, Portal Guru, Portal Siswa, Portal Orang Tua, Dashboard.
- **Lingkup Audit Sesi 5**: Penugasan Siswa, Pengumpulan Tugas, Kisi-kisi Ujian, Bank Soal, CBT Engine, Portal Guru, Portal Siswa, Portal Orang Tua.
- **Lingkup Audit Sesi 6**: Penilaian LMS, Komponen & Bobot Nilai, Rekap Nilai, Rapor Digital, Cetak PDF Rapor, Catatan Wali Kelas, Kenaikan Kelas, Kelulusan, Alumni, UI/UX Audit.
- **Status Akhir Regresi**: **PASSED — ZERO REGRESSIONS DETECTED**

## Modul Teruji Sesi 6

1. **Modul Penilaian LMS (`student_grades`)**:
   - Auto-Kalkulasi Bobot Formula (Tugas + CBT UH + UTS + UAS): PASS
   - Override Nilai Manual oleh Guru: PASS
   - Pencatatan Audit Trail Perubahan Nilai: PASS

2. **Modul Rapor Digital (`lms_rapor`)**:
   - Generate Rapor Kelas & Ranking Otomatis: PASS
   - Approval Kepala Sekolah (`status = 'final'`): PASS
   - Publish Rapor (`status = 'published'`): PASS
   - Pengunduhan / Export Payload PDF Data: PASS
   - Restriksi Visibilitas Rapor Draft untuk Siswa & Orang Tua: PASS

3. **Modul Kenaikan Kelas, Kelulusan, & Alumni (`students`)**:
   - Kenaikan Kelas Batch (Pembaruan Rombel Aktif): PASS
   - Penetapan Status Kelulusan Siswa Tingkat Akhir: PASS
   - Idempotent Alumni Formation (`is_alumni = true`, `status_alumni = 'alumni'`): PASS
   - Preservasi Histori Akademik & Catatan Masa Lalu: PASS

4. **UI/UX Audit**:
   - Penilaian LMS Page (`LmsPenilaianPage.jsx`): PASS
   - Rapor Digital Page (`LmsRaporPage.jsx`): PASS
   - Kelulusan & Alumni Page (`FoundationGraduationAlumniPage.jsx`): PASS
   - Layout Responsif, Contrast Ratio, Skeletons, Error Fallbacks: PASS

## Hasil Pengujian Otomatis Final

- Sesi 6 Feature Test: `php artisan test --filter=LmsSesi6AssessmentAndReportTest` -> **3 Passed (23 assertions)**
- Sesi 5 Feature Test: `php artisan test --filter=LmsSesi5AssignmentsAndCbtTest` -> **4 Passed (31 assertions)**
- Sesi 4 Feature Test: `php artisan test --filter=LmsSesi4OwnershipAndSyncTest` -> **6 Passed (19 assertions)**
- Full Backend PHPUnit Suite: `php artisan test` -> **ALL PASSED**
- Web Dashboard Frontend Build: `npm run build` -> **Built cleanly in 2.97s (Zero compilation errors)**
