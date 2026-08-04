# Implementasi Fitur & Modul Role Pengurus Yayasan

Sistem Manajemen Sekolah Terpadu — Mode Monitoring Eksekutif Yayasan

## Ringkasan Perubahan

Perbaikan dan penyempurnaan alur sistem untuk role `pengurus_yayasan` telah diselesaikan secara menyeluruh tanpa mengubah struktur database (tidak ada migration baru, tidak ada tabel baru, tidak ada model duplikat).

## Komponen & Perubahan Utama

1. **Middleware Read-Only (`EnsureFoundationReadOnly.php`)**:
   - Berada di `/backend/app/Http/Middleware/EnsureFoundationReadOnly.php`.
   - Mengontrol seluruh request mutasi data (`POST`, `PUT`, `PATCH`, `DELETE`) dari pengguna dengan role monitoring yayasan.
   - Mengembalikan respon HTTP `403 Forbidden` dengan pesan JSON yang jelas apabila pengguna mencoba mengubah data operasional.
   - Pengecualian hanya diberikan pada pembaruan foto & data profil pribadi (`/foundation/profile*`) serta penandaan notifikasi pribadi (`/foundation/notifications*`).

2. **Redirect Login Otomatis (`MultiRoleDashboardPage.jsx`)**:
   - Memeriksa role pengguna saat mengakses `/dashboard`.
   - Pengguna dengan role `pengurus_yayasan`, `Yayasan`, `Ketua Yayasan`, atau permission `foundation.dashboard.view` secara otomatis diarahkan ke `/dashboard/yayasan`.

3. **Struktur Sidebar Yayasan (`DashboardLayout.jsx`)**:
   - Dikembangkan khusus untuk role Yayasan:
     - **Dashboard Yayasan** (`/dashboard/yayasan`)
     - **Monitoring**: Unit Pendidikan, Pegawai & Guru, Data Siswa, Siswa Baru, Mutasi Siswa, Kelulusan & Alumni, Informasi Sekolah
     - **Laporan**: Laporan SDM, Laporan Siswa, Laporan Mutasi, Laporan Kelulusan, Laporan Alumni, Laporan Lintas Unit
     - **Akun**: Notifikasi, Profil

4. **Dashboard Eksekutif Yayasan (`DashboardPage.jsx`)**:
   - Banner Hero dengan Badge *"Mode Monitoring Eksekutif Yayasan"*.
   - Baris Filter Global Lintas Unit (Tahun Ajaran, Semester, Unit Pendidikan, Jenis Unit, Kota/Kabupaten, Status Unit, Periode).
   - Grid 12 KPI Stat Card dengan fungsi navigasi klik ke halaman relevan.

5. **Proteksi Read-Only Halaman Monitoring**:
   - Seluruh halaman monitoring (Unit Pendidikan, Pegawai & Guru, Data Siswa, Siswa Baru, Mutasi Siswa, Kelulusan & Alumni, Informasi Sekolah, Laporan) menyajikan tampilan Read-Only tanpa tombol aksi penambahan, pengubahan, atau penghapusan data.
