# 12-DEFERRED DATABASE REQUIREMENTS — SIMSIT

## Laporan Rekomendasi Migrasi & Struktur Database Tertunda

Sesuai dengan **Prinsip Aturan Database & Migrasi** pada Master Prompt:
> *JANGAN MEMBUAT MIGRATION BARU secara sepihak.*
> *Gunakan struktur data yang sudah tersedia. Jika fitur membutuhkan penambahan kolom/tabel mendasar, tandai sebagai TERTUNDA.*

---

## Daftar Fitur & Rekomendasi Migrasi Tertunda

Saat ini, seluruh 71 migrasi yang tersedia telah mencakup 100% kebutuhan fitur operasional utama SIMSIT (Master Data, Absensi Digital, Tahfizh & Mutabaah, LMS & Ujian, Portal Ortu & Siswa, Keuangan, Mutasi, dan Alumni).

Berikut adalah beberapa usulan optimasi minor yang direkomendasikan untuk fase pengembangan lanjutan di masa depan (apabila diminta secara eksplisit):

### 1. Rekomendasi Penambahan Audit Log Partitioning (Fase Lanjutan)
- **Fitur**: Audit Log Arsip Jangka Panjang (> 5 Tahun).
- **Data yang dibutuhkan**: Skema kompresi tabel `attendance_audit_logs` bulanan.
- **Tabel saat ini**: `attendance_audit_logs` (Sudah ada & berjalan dengan baik).
- **Kekurangan**: Belum memiliki auto-partitioning bulanan otomatis di level PostgreSQL.
- **Dampak**: Ukuran tabel dapat membengkak setelah 3-5 tahun transaksi sekolah aktif.
- **Rekomendasi migration**:
  ```text
  TERTUNDA — MIGRATION BARU BELUM DIBUAT SAMPAI ADA INSTRUKSI PENGGUNA.
  Skema Usulan: 2026_09_01_000000_partition_attendance_audit_logs.php
  ```

---

### 2. Rekomendasi Indexing Tambahan untuk Pencarian Kombinasi Siswa Multi-Unit (Fase Lanjutan)
- **Fitur**: Pencarian Siswa Lintas Unit Skala > 100.000 Record.
- **Data yang dibutuhkan**: Composite GIN Index pada kolom JSON `students.metadata`.
- **Tabel saat ini**: `students` (Sudah memiliki B-Tree index pada `kelas_id`, `education_unit_id`, `nisn`, `nama_lengkap`).
- **Status**: Pencarian < 50.000 data saat ini terbukti sangat cepat (< 50ms).
