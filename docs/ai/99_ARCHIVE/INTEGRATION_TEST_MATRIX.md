# Matriks Pengujian Integrasi Sesi 4, Sesi 5, & Sesi 6

## Ringkasan Skenario Pengujian Sesi 4

### Skenario 1: Media Pembelajaran via Parent Materi
- **Precondition**: Guru A dan Guru B terdaftar pada Unit A dengan Modul Ajar dan Materi masing-masing.
- **Actor**: Guru A.
- **Action**: Membuat Media pada Materi milik Guru A -> Berhasil. Mencoba membuat Media pada Materi milik Guru B -> HTTP 403.
- **Expected Database**: Record `lms_media` tersimpan dengan `materi_id` milik Guru A.
- **Expected API**: Response status 201 untuk Materi milik sendiri, status 403 untuk Materi milik Guru B.
- **Security Expectation**: Penolakan tegas manipulasi ownership lintas guru.

### Skenario 2: Safe URL & File Upload Referensi Pembelajaran
- **Precondition**: Guru A login dan membuka Form Referensi.
- **Actor**: Guru A.
- **Action**: Memasukkan URL `javascript:alert('xss')` -> Ditolak validasi (HTTP 422). Memasukkan URL valid `https://example.com/ref` -> Berhasil (HTTP 201).
- **Expected Database**: Hanya URL valid tersimpan.
- **Security Expectation**: Pencegahan eksekusi skrip XSS via URL referensi.

---

## Ringkasan Skenario Pengujian Sesi 5

### Skenario 6: Penugasan Siswa & Publikasi
- **Precondition**: Guru A mengampu Matematika Kelas 7A.
- **Actor**: Guru A.
- **Action**: Guru A membuat Penugasan (Draft) -> Toggle Publish -> Status berubah menjadi `is_published: true`.
- **Expected Database**: Record `lms_penugasan` tersimpan dengan `is_published = true`.
- **Security Expectation**: Hanya Guru pengampu/Admin yang dapat mengubah status publikasi tugas.

### Skenario 9: CBT Engine Security, No Key Leakage, Timer, & Auto Scoring
- **Precondition**: Sesi Ujian CBT dipublikasikan untuk Kelas 7A.
- **Actor**: Siswa 1 & Guru A.
- **Action**: Siswa 1 memanggil `startSession` -> Sesi dimulai. Memeriksa payload JSON -> Kunci jawaban ditiadakan. Siswa 1 mengirim jawaban PG & Esai -> `finishSession` -> System auto-score PG. Guru A menilai Esai -> Nilai final direkalkulasi secara instan.
- **Expected Database**: `lms_ujian_sesi` terbarui menjadi status `selesai` dengan `nilai_final` tepat.
- **Security Expectation**: Perlindungan 100% terhadap bocornya kunci jawaban ke browser siswa.

---

## Ringkasan Skenario Pengujian Sesi 6

### Skenario 10: Auto-Calculation Penilaian LMS
- **Precondition**: Nilai Tugas (`lms_pengumpulan_tugas`) dan Sesi CBT (`lms_ujian_sesi`) siswa tersedia.
- **Actor**: Guru / Waka Kurikulum.
- **Action**: Memanggil `POST /api/lms/penilaian/calculate-auto` -> Sistem mengkalkulasi bobot (Tugas 20%, UH 25%, UTS 25%, UAS 30%).
- **Expected Database**: Record `student_grades` terisi dengan `final_score`, `grade_letter`, dan `is_passed`.
- **Security Expectation**: Perhitungan nilai akhir 100% konsisten dan akurat.

### Skenario 11: Auto-Generate Rapor Digital & Ranking Kelas
- **Precondition**: Rekap `student_grades` siswa satu kelas tersedia.
- **Actor**: Wali Kelas.
- **Action**: Memanggil `POST /api/lms/rapor/generate-class` -> Rapor dibuat, peringkat kelas diurutkan dari `rata_rata` tertinggi.
- **Expected Database**: Record `lms_rapor` terisi dengan `peringkat_kelas` tepat.
- **Security Expectation**: Konsistensi akumulasi nilai dan ranking dalam rombel.

### Skenario 12: Approval & Publishing Rapor Digital
- **Precondition**: Rapor berstatus `draft`.
- **Actor**: Kepala Sekolah & Wali Kelas.
- **Action**: Approve Rapor -> Status `final`. Publish Rapor -> Status `published`.
- **Expected Database**: `status_rapor` = 'published', `tanggal_terbit` = now().
- **Security Expectation**: Siswa & Orang Tua hanya dapat melihat rapor berstatus `published`.

### Skenario 13: Kenaikan Kelas & Kelulusan Alumni
- **Precondition**: Siswa aktif di kelas asal.
- **Actor**: Guru / Waka Kesiswaan.
- **Action**: Proses kenaikan kelas -> Kelas siswa diperbarui. Proses kelulusan -> `is_active` = false, `is_alumni` = true, status alumni terdaftar.
- **Expected Database**: Record `Student` terintegrasi dengan direktori Alumni tanpa menghapus histori lama.
- **Security Expectation**: Preservasi histori akademik dan kemudahan penelusuran tamatan.

---

## Hasil Aktual Pengujian Automated Test Suite

- Feature Test Sesi 6: `php artisan test --filter=LmsSesi6AssessmentAndReportTest`
  - Result: **3 Passed (23 assertions)**
- Feature Test Sesi 5: `php artisan test --filter=LmsSesi5AssignmentsAndCbtTest`
  - Result: **4 Passed (31 assertions)**
- Feature Test Sesi 4: `php artisan test --filter=LmsSesi4OwnershipAndSyncTest`
  - Result: **6 Passed (19 assertions)**
- Web Dashboard Frontend Build: `npm run build`
  - Result: **Built cleanly in 2.97s (Zero errors)**
