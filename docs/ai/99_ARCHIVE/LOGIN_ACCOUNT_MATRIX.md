# LOGIN ACCOUNT MATRIX

Seluruh akun berada di PostgreSQL dan password tersimpan sebagai hash. Nilai password fixture berasal dari environment/default seeder, tidak disimpan plaintext di kolom database. `must_change_password=true` diset untuk akun bootstrap.

| Role | Email fixture | Identifier tambahan | Portal | Relasi |
|---|---|---|---|---|
| Super Admin | superadmin@school-erp.local | Email/HP | Admin | Global |
| Ketua Yayasan | role.ketua.yayasan@school-erp.local | TEST-NIY-02/HP | Employee | Pegawai + unit/periode |
| Pengurus Yayasan | role.pengurus.yayasan@school-erp.local | TEST-NIY-03/HP | Employee | Pegawai + unit/periode |
| Sekretaris Yayasan | role.sekretaris.yayasan@school-erp.local | TEST-NIY-04/HP | Employee | Pegawai + unit/periode |
| Bendahara Yayasan | role.bendahara.yayasan@school-erp.local | TEST-NIY-05/HP | Employee | Pegawai + unit/periode |
| Kepala Bidang Pendidikan | kepala.bidang.pendidikan@school-erp.local | TEST-NIY-06/HP | Employee | Pegawai + unit/periode |
| Divisi Kurikulum | divisi.kurikulum@school-erp.local | TEST-NIY-07/HP | Employee | Pegawai + unit/periode |
| Divisi Kesiswaan | divisi.kesiswaan@school-erp.local | TEST-NIY-08/HP | Employee | Pegawai + unit/periode |
| Divisi Bahasa | divisi.bahasa@school-erp.local | TEST-NIY-09/HP | Employee | Pegawai + unit/periode |
| Divisi Program Khusus | divisi.program.khusus@school-erp.local | TEST-NIY-10/HP | Employee | Pegawai + unit/periode |
| Kepala Sekolah | kepsek@school-erp.local | TEST-NIY-11/HP | Employee | Pegawai + unit/periode |
| Wakil Kepala Sekolah | wakil.kepala.sekolah@school-erp.local | TEST-NIY-12/HP | Employee | Pegawai + unit/periode |
| Wakil Kurikulum | wakil.kurikulum@school-erp.local | TEST-NIY-13/HP | Employee | Pegawai + unit/periode |
| Wakil Kesiswaan | wakil.kesiswaan@school-erp.local | TEST-NIY-14/HP | Employee | Pegawai + unit/periode |
| Tata Usaha | tu@school-erp.local | TEST-NIY-15/HP | Employee | Pegawai + unit/periode |
| Operator | operator@school-erp.local | TEST-NIY-16/HP | Employee | Pegawai + unit/periode |
| Guru | guru@school-erp.local | TEST-NIY-17/HP | Employee | Penugasan sendiri |
| Guru Tahfizh | guru.tahfizh@school-erp.local | TEST-NIY-18/HP | Employee | Penugasan sendiri |
| Guru BK | guru.bk@school-erp.local | TEST-NIY-19/HP | Employee | Penugasan sendiri |
| Wali Kelas | wali.kelas@school-erp.local | TEST-NIY-20/HP | Employee | Rombel sendiri |
| Musyrif | musyrif@school-erp.local | TEST-NIY-21/HP | Employee | Kelompok sendiri |
| Orang Tua | orangtua@school-erp.local | HP/NIK ayah/NIK ibu/email | Parent | 2 anak tertaut |
| Siswa | siswa@school-erp.local | TEST-NIS-023/email/HP | Student | Self |
| Alumni | alumni@school-erp.local | TEST-NIS-024/email/HP | Student/Alumni | Self |

`AuthService` + `AuthIdentifierResolver` menjadi satu jalur autentikasi. Verifikasi PostgreSQL: **24/24 login lulus** (23 sekaligus + parent retest setelah rekonsiliasi relasi), tanpa mapping akun di controller/frontend.

