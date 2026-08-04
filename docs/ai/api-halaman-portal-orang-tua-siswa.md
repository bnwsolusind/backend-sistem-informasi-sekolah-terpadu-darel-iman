# Dokumentasi API Portal Orang Tua & Siswa

Gunakan dokumentasi ini sebagai referensi integrasi endpoint API backend `/api/portal/*`.

## Endpoint Utama

| Method | Endpoint | Peran | Deskripsi |
| --- | --- | --- | --- |
| `GET` | `/api/portal/children` | Orang Tua | Mendapatkan daftar anak yang terhubung dengan akun orang tua |
| `GET` | `/api/portal/profile` | Orang Tua / Siswa | Mendapatkan biodata dan profil lengkap siswa aktif |
| `GET` | `/api/portal/dashboard` | Orang Tua / Siswa | Ringkasan statistik KPI dashboard portal |
| `GET` | `/api/portal/school-information` | Orang Tua / Siswa | Daftar pengumuman, agenda, berita, dan surat edaran |
| `GET` | `/api/portal/school-information/summary` | Orang Tua / Siswa | Ringkasan statistik dan agenda mendatang |
| `GET` | `/api/portal/schedules` | Orang Tua / Siswa | Jadwal pelajaran harian dan mingguan |
| `GET` | `/api/portal/materials` | Orang Tua / Siswa | Materi dan modul pembelajaran published |
| `GET` | `/api/portal/assignments` | Orang Tua / Siswa | Daftar tugas dan status pengumpulan |
| `POST` | `/api/portal/assignments/{id}/submit` | Siswa | Pengumpulan jawaban teks dan file tugas |
| `GET` | `/api/portal/tahfizh` | Orang Tua / Siswa | Riwayat setoran hafalan Al-Qur'an |
| `GET` | `/api/portal/grades` | Orang Tua / Siswa | Nilai mata pelajaran berstatus published |
| `GET` | `/api/portal/student-notes` | Orang Tua / Siswa | Komentar dan catatan perkembangan siswa oleh guru |
| `GET` | `/api/portal/mutabaah` | Orang Tua / Siswa | Checklist mutabaah harian siswa |
| `POST` | `/api/portal/mutabaah` | Siswa | Memperbarui checklist mutabaah mandiri |
| `GET` | `/api/portal/attendance` | Orang Tua / Siswa | Riwayat presensi sekolah & pembelajaran |
| `GET` | `/api/portal/permissions` | Orang Tua / Siswa | Riwayat pengajuan izin / sakit |
| `POST` | `/api/portal/permissions` | Orang Tua / Siswa | Mengirimkan pengajuan izin / sakit siswa |
| `GET` | `/api/portal/exam-grids` | Orang Tua / Siswa | Kisi-kisi ujian published |
| `GET` | `/api/portal/lms/exams` | Orang Tua / Siswa | Overview ujian CBT kelas siswa |
| `POST` | `/api/portal/lms/exams/{id}/start` | Siswa | Memulai sesi ujian CBT |
| `POST` | `/api/portal/lms/exam-sessions/{sesiId}/answers` | Siswa | Menyimpan jawaban otomatis sesi CBT |
| `POST` | `/api/portal/lms/exam-sessions/{sesiId}/finish` | Siswa | Mengumpulkan dan memfinalisasi sesi CBT |
| `GET` | `/api/portal/results` | Orang Tua / Siswa | Ringkasan hasil CBT, tugas, dan evaluasi |
| `GET` | `/api/portal/reports` | Orang Tua / Siswa | Daftar rapor semester published |
| `GET` | `/api/portal/reports/{id}/download` | Orang Tua / Siswa | Unduh PDF rapor resmi |
| `GET` | `/api/portal/chat/contacts` | Orang Tua / Siswa | Kontak guru pengampu siswa |
| `GET` | `/api/portal/chat/{teacherUserId}` | Orang Tua / Siswa | Riwayat percakapan dengan guru |
| `POST` | `/api/portal/chat/{teacherUserId}` | Orang Tua / Siswa | Mengirimkan pesan ke guru |

## Header Spesifik Orang Tua

Saat melakukan HTTP request sebagai akun **Orang Tua**, tambahkan HTTP Header:

```http
X-Child-Id: <student_uuid_aktif>
```

Backend secara otomatis memvalidasi bahwa `student_uuid_aktif` terhubung dengan akun `user_id` orang tua yang login.
