# Bank Soal (Question Bank) Flow & Security Specification — Sesi 5

## Overview
Modul Bank Soal (`lms_bank_soal`) menyimpan butir-butir soal evaluasi pembelajaran.

## Tipe Soal & Kunci Jawaban
- `pg`: Pilihan Ganda (opsi_a s/d opsi_e, kunci_jawaban = 'A'/'B'/'C'/'D'/'E').
- `benar_salah`: Benar / Salah (kunci_jawaban = 'benar'/'salah').
- `menjodohkan`: Menjodohkan Pasangan (kunci_jawaban = JSON String pasangan kiri & kanan).
- `isian`: Isian Singkat (kunci_jawaban = teks pencocokan persis/case-insensitive).
- `esai`: Uraian / Esai (kunci_jawaban = rubrik penilaian / null, dinilai manual oleh Guru).

## Key Leakage Prevention (Keamanan Utama)
1. **Omission in Student Payload**: Saat endpoint CBT `startSession` dipanggil oleh Siswa, `kunci_jawaban` dan `pembahasan` ditiadakan dari response JSON.
2. **Randomization**: Opsi pilihan ganda (`opsi`) dan opsi menjodohkan kanan diacak (*shuffled*) jika opsi `acak_jawaban = true` pada ujian.
3. **Poin Calculation**: Setiap butir soal memiliki bobot `poin` yang digunakan oleh kalkulasi nilai otomatis (*auto-scoring engine*).
