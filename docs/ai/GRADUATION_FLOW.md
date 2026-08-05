# Kelulusan (Graduation) Flow — Sesi 6

## Overview
Modul Kelulusan menangani penetapan status lulus bagi siswa tingkat akhir (misalnya Kelas 9 SMP atau Kelas 12 SMA/SMK).

## Flow & State Machine
1. **Penetapan Kelulusan**: Wali Kelas & Kepala Sekolah menyetujui kelulusan siswa.
2. **Status Transformation**:
   - `students.is_active` diubah dari `true` menjadi `false`.
   - `students.metadata->is_alumni` diset ke `true`.
   - `students.metadata->status_siswa` diset ke `'alumni'`.
   - `students.metadata->tahun_lulus` diset ke tahun berjalan (misal: `'2026'`).
3. **Data Integrity**: Tidak ada data siswa yang dihapus (*no deletion*). Seluruh catatan akademik, rapor, dan mutabaah tetap tersimpan secara utuh.
