# Log Perbaikan Bug Sesi 4, Sesi 5, & Sesi 6

## Daftar Bug Diperbaiki Sesi 4

### Bug 1: Error 403 / "Gagal Memuat Data" pada Presensi LMS Page
- **TEMUAN**: Halaman `LmsPresensiPage.jsx` gagal memuat data saat diakses oleh Guru atau Wali Kelas dengan error `"Terjadi kesalahan saat mengunduh data presensi pembelajaran"`.
- **SEVERITY**: High
- **MODUL**: Presensi LMS (`LmsPresensiController.php`)
- **AKAR MASALAH**:
  1. `LmsPresensiController@options` mensyaratkan role `Super Admin` sahaja (`abort_unless(request()->user()->hasRole('Super Admin'), 403);`), menyebabkan Guru & Wali Kelas ditolak HTTP 403 saat membuka halaman presensi.
  2. `LmsPresensiController@stats` mensyaratkan param `jadwal_pelajaran_id` terisi untuk Guru, sehingga pemanggilan statistik awal tanpa filter menghasilkan HTTP 403.
- **PERBAIKAN**:
  1. Memperbarui `LmsPresensiController@options` agar mengizinkan role Guru, Wali Kelas, Waka Kurikulum, Kepsek, Yayasan, dan user dengan permission `lesson_attendance.view`/`create`.
  2. Mengizinkan filter opsional `$employeeId` di `LmsPresensiRepository@getOptions` untuk membatasi opsi jadwal khusus guru yang login.
  3. Memperbarui `LmsPresensiController@stats` agar secara otomatis mengambil presensi untuk seluruh jadwal milik guru jika `jadwal_pelajaran_id` kosong.
- **FILE DIUBAH**:
  - `backend/app/Http/Controllers/Api/V1/LmsPresensiController.php`
  - `backend/app/Services/LmsPresensiService.php`
  - `backend/app/Repositories/Contracts/LmsPresensiRepositoryInterface.php`
  - `backend/app/Repositories/Eloquent/LmsPresensiRepository.php`
- **STATUS**: RESOLVED

---

### Bug 2: Penolakan Akses View Media & Referensi Pembelajaran untuk Role Siswa/Orang Tua
- **TEMUAN**: Endpoint `/api/lms/media` dan `/api/lms/referensi` menolak permintaan dari role `Siswa` dan `Orang Tua` dengan status 403 Forbidden.
- **SEVERITY**: Medium
- **MODUL**: Media & Referensi LMS (`LmsMediaController.php` & `LmsReferensiController.php`)
- **AKAR MASALAH**: `authorizeView` hanya memeriksa role `Guru` dan permission internal `pembelajaran.materi` tanpa memasukkan role `Siswa` dan `Orang Tua`.
- **PERBAIKAN**: Menambahkan role `Siswa`, `siswa`, `student`, `Orang Tua`, `orang_tua`, `parent` pada `authorizeView` di kedua controller.
- **FILE DIUBAH**:
  - `backend/app/Http/Controllers/Api/V1/LmsMediaController.php`
  - `backend/app/Http/Controllers/Api/V1/LmsReferensiController.php`
- **STATUS**: RESOLVED

---

### Bug 3: Potensi Eksekusi URL Skrip Berbahaya pada Referensi Pembelajaran
- **TEMUAN**: Input URL referensi menerima skema `javascript:` yang berpotensi XSS saat diklik di frontend.
- **SEVERITY**: Medium
- **MODUL**: Referensi LMS (`SimpanReferensiRequest.php` & `UbahReferensiRequest.php`)
- **AKAR MASALAH**: Aturan validasi `url` standar Laravel tidak secara otomatis menolak skema `javascript:` atau `data:`.
- **PERBAIKAN**: Menambahkan closure validasi kustom untuk menolak skema `javascript:`, `data:`, dan `vbscript:`.
- **FILE DIUBAH**:
  - `backend/app/Http/Requests/V1/SimpanReferensiRequest.php`
  - `backend/app/Http/Requests/V1/UbahReferensiRequest.php`
- **STATUS**: RESOLVED

---

## Daftar Bug Diperbaiki Sesi 5

### Bug 4: Integrity Constraint Violation `dinilai_oleh` pada Pengumpulan & Penugasan Tugas
- **TEMUAN**: Pengisian `dinilai_oleh` saat Guru memberikan nilai tugas menghasilkan error `SQLSTATE[23000]: Foreign key constraint failed` di SQLite/PostgreSQL.
- **SEVERITY**: High
- **MODUL**: Pengumpulan Tugas & Penugasan (`LmsPengumpulanTugasRepository.php` & `LmsPenugasanRepository.php`)
- **AKAR MASALAH**: Kolom `dinilai_oleh` memiliki FK ke `employees.id`, namun repository menetapkan `Auth::id()` yang bernilai `users.id`.
- **PERBAIKAN**: Mengubah penentuan `dinilai_oleh` untuk mencari `Employee` yang terhubung dengan `user_id` user yang sedang terautentikasi (`Employee::where('user_id', Auth::id())->first()?->id`).
- **FILE DIUBAH**:
  - `backend/app/Repositories/Eloquent/LmsPengumpulanTugasRepository.php`
  - `backend/app/Repositories/Eloquent/LmsPenugasanRepository.php`
- **STATUS**: RESOLVED

---

### Bug 5: Potensi Hijacking Sesi CBT Ujian oleh Client (`siswa_id` Arbitrari)
- **TEMUAN**: Endpoint `POST /api/lms/ujian/{id}/start-session` menerima `siswa_id` langsung dari payload client tanpa memverifikasi apakah akun yang login adalah milik siswa tersebut.
- **SEVERITY**: Critical
- **MODUL**: CBT Engine (`LmsUjianController.php`)
- **AKAR MASALAH**: Controller tidak memaksa pencocokan identitas siswa untuk pengguna ber-role `Siswa`.
- **PERBAIKAN**: Memperbarui `LmsUjianController@startSession`, `submitAnswers`, dan `finishSession` agar pengguna ber-role `Siswa` selalu menggunakan `Student::where('user_id', $user->id)->first()->id` dan menolak akses jika ID sesi tidak sesuai.
- **FILE DIUBAH**:
  - `backend/app/Http/Controllers/Api/LmsUjianController.php`
- **STATUS**: RESOLVED

---

## Daftar Bug Diperbaiki Sesi 6

### Bug 6: Referensi Kolom `name` pada Query Siswa Rapor Repository
- **TEMUAN**: Query pencarian dan seleksi siswa pada `LmsRaporRepository` menggunakan `name` padahal nama kolom di tabel `students` adalah `full_name`.
- **SEVERITY**: Medium
- **MODUL**: Rapor Digital (`LmsRaporRepository.php`)
- **AKAR MASALAH**: Ketidaksesuaian nama atribut `name` vs `full_name` pada query database Eloquent.
- **PERBAIKAN**: Mengubah pencarian dan seleksi menjadi `full_name` di `LmsRaporRepository.php`.
- **FILE DIUBAH**:
  - `backend/app/Repositories/Eloquent/LmsRaporRepository.php`
- **STATUS**: RESOLVED

---

### Bug 7: Ketersediaan Endpoint Approval & Publish Rapor Digital
- **TEMUAN**: Endpoint untuk `approve` dan `publish` Rapor Digital belum terdaftar di `routes/api.php`, menyebabkan pemanggilan HTTP POST menghasilkan 404 / 405.
- **SEVERITY**: High
- **MODUL**: Rapor Digital (`LmsRaporController.php` & `routes/api.php`)
- **AKAR MASALAH**: Route controller belum diregister ke dalam grup `lms`.
- **PERBAIKAN**: Menambahkan method `approve` dan `publish` di `LmsRaporController.php` serta meregister routenya di `routes/api.php`.
- **FILE DIUBAH**:
  - `backend/app/Http/Controllers/Api/V1/LmsRaporController.php`
  - `backend/routes/api.php`
- **STATUS**: RESOLVED

---

### Bug 8: Penyesuaian Query Filter `status_rapor` Portal Siswa & Orang Tua
- **TEMUAN**: Portal siswa & orang tua hanya mengecek status `'published'`, menyebabkan rapor dengan nilai status Bahasa Indonesia (`'diterbitkan'`) tidak muncul.
- **SEVERITY**: Low
- **MODUL**: Student & Parent Portal (`StudentParentPortalController.php`)
- **AKAR MASALAH**: Filter status menggunakan string tunggal.
- **PERBAIKAN**: Mengubah query filter menggunakan `whereIn('status_rapor', ['published', 'diterbitkan'])`.
- **FILE DIUBAH**:
  - `backend/app/Http/Controllers/Api/V1/StudentParentPortalController.php`
- **STATUS**: RESOLVED
