# Rapor Digital Flow & Specification — Sesi 6

## Overview
Modul Rapor Digital (`lms_rapor`) merangkum akumulasi prestasi akademik, kehadiran, peringkat kelas, dan catatan wali kelas untuk diterbitkan kepada siswa dan orang tua.

## Data Model & Specification
- **TABLE**: `lms_rapor`
- **MODEL**: `App\Models\LmsRapor`
- **FOREIGN KEYS**: `siswa_id`, `kelas_id`, `semester_id`, `tahun_ajaran_id`, `guru_wali_id`
- **AGGREGATED FIELDS**:
  - `total_nilai`: Total penjumlahan `final_score` seluruh mapel.
  - `rata_rata`: Rata-rata nilai akhir.
  - `peringkat_kelas`: Ranking otomatis dalam rombel.
  - `total_hadir`, `total_izin`, `total_sakit`, `total_alpha`: Agregasi otomatis dari `lms_presensi`.
  - `catatan_wali_kelas`: Catatan perkembangan akademik dan karakter dari Wali Kelas.

## PDF Export Structure
Endpoint `/api/lms/rapor/{id}/pdf` menyediakan payload JSON terstruktur yang berisi:
1. `school_info`: Nama Sekolah, NPSN, Alamat, Nama & NIP Kepala Sekolah.
2. `rapor`: Record utama `LmsRapor`.
3. `siswa` & `kelas`: Identitas lengkap dan Rombel.
4. `grades`: Daftar rincian nilai per mata pelajaran, nilai KKM, huruf mutu, dan catatan mapel.
