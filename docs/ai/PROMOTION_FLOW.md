# Kenaikan Kelas (Class Promotion) Flow — Sesi 6

## Overview
Modul Kenaikan Kelas memproses perpindahan rombel/kelas siswa dari tingkat awal ke tingkat selanjutnya pada pergantian tahun ajaran.

## Standard Workflow
1. **Evaluasi Rapor Final**: Sistem memverifikasi kriteria kelulusan KKM pada Rapor Digital semester genap.
2. **Batch Class Assignment Update**:
   - `students.kelas_id` diperbarui ke `target_kelas_id`.
   - `students.class_id` legacy diperbarui secara konsisten.
3. **Idempotency & History Preservation**:
   - Histori pengerjaan tugas, presensi, dan rapor pada kelas/tahun ajaran lama tetap tersimpan dan terikat pada `semester_id` dan `tahun_ajaran_id` historis.
