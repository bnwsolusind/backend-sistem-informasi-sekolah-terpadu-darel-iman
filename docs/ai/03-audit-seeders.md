# 03-AUDIT SEEDERS — SIMSIT

## Audit Idempotensi & Keamanan Seeder Backend

### Seeder Kunci Sistem

1. `RolePermissionSeeder.php`:
   - Menggunakan `Permission::firstOrCreate()` dan `Role::firstOrCreate()`.
   - Menjamin seluruh role terdaftar (`Super Admin`, `Yayasan`, `Kepala Sekolah`, `Divisi Pendidikan`, `TU`, `Guru`, `Musyrif / Musyrifah`, dll).
   - Super Admin diberikan seluruh permission via `$superAdmin->syncPermissions(Permission::all())`.

2. `DefaultRoleUserSeeder.php`:
   - Membuat akun default untuk keperluan testing dan instalasi awal secara idempotent via `User::firstOrCreate()`.
   - Seluruh akun default memiliki password aman dan single role terverifikasi.

3. `MasterJenisUnitPendidikanSeeder.php` & `EducationUnitSeeder.php`:
   - Memasukkan data jenjang TK, SD, SMP, SMA, SMK, Pondok Pesantren secara aman tanpa membuat duplikasi data saat dijalankan ulang.

4. `MasterJabatanSeeder.php`:
   - Menyimpan jabatan fungsional dan struktural beserta hirarki atasan (`atasan_pegawai_id`).

5. `AttendancePermissionSeeder.php` & `MutabaahEnterpriseSeeder.php`:
   - Menyiapkan template indikator mutabaah yaumiyyah dan konfigurasi absensi secara idempotent.

---

## Aturan Keamanan Production Seeding
- Menghindari perintah `DB::statement('TRUNCATE ...')` pada environment production.
- Melindungi `DatabaseSeeder.php` agar data transaksi asli tidak terhapus secara tidak sengaja.
- `SuperAdminAccessMatrixTest` memverifikasi bahwa eksekusi seeder ulang secara dinamis tetap menjaga integritas permission Super Admin.
