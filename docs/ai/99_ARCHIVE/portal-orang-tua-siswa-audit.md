# Audit Portal Orang Tua & Siswa

Tanggal audit: 2 Agustus 2026

## Ringkasan

Audit dilakukan sebelum implementasi terhadap route API, controller portal, model LMS,
permission seeder, route React, service frontend, halaman portal, dan sidebar. Modul ini
memakai tabel serta relasi yang sudah ada; tidak dibuat migration atau tabel master baru.

| Kebutuhan | Sumber data existing | Hasil |
| --- | --- | --- |
| Profil, data pribadi, biodata, orang tua | `students`, `parents`, metadata siswa | Ditampilkan di kedua portal |
| Riwayat pendidikan | `students.metadata.riwayat_pendidikan` | Ditampilkan dengan empty state jujur |
| Pengumuman, agenda, berita, surat edaran | `pengumuman_sekolahs`, `data_tambahan.kategori` | Ditampilkan sebagai Informasi Sekolah |
| Daftar tugas, status, nilai, komentar guru | `lms_penugasan`, `lms_pengumpulan_tugas` | Ditampilkan dan disinkronkan |
| Materi, download, video, modul | `lms_materi`, `lms_media`, `lms_modul_ajar` | Ditampilkan berdasarkan kelas siswa |
| Kisi-kisi dan jadwal ujian | `lms_kisi_kisi`, `lms_ujian` | Sudah berjalan di portal siswa |
| Bank soal, latihan, try out | `lms_bank_soal`, `lms_ujian.jenis_ujian` | Dipakai melalui ruang ujian CBT |
| Hasil dan pembahasan | sesi/hasil ujian dan `lms_bank_soal.pembahasan` | Hasil tersedia; pembahasan mengikuti kebijakan publikasi ujian |
| Nilai dan komentar umum | `student_grades.notes`, `student_notes` | Ditampilkan di kedua portal |

## Temuan integrasi yang diperbaiki

- Query materi sebelumnya memakai `lms_materi.class_id`, padahal kelas berada pada
  relasi `lms_modul_ajar.kelas_id`.
- Pengumpulan tugas sebelumnya memakai nama kolom legacy (`student_id`,
  `jawaban_text`, `submitted_at`), padahal tabel aktif memakai `siswa_id`,
  `jawaban_teks`, dan `waktu_kumpul`.
- Pengumuman portal sebelumnya memfilter `is_active`; model aktif memakai
  `status_aktif`, periode `mulai_tampil`/`selesai_tampil`, dan target role.
- Sidebar portal sebelumnya hanya menampilkan Dashboard karena submenu penting
  dikomentari. Submenu role Orang Tua dan Siswa kini diaktifkan.

## Hak akses superadmin

`Super Admin` tetap memperoleh seluruh permission dari `RolePermissionSeeder`.
Pratinjau portal dilakukan melalui kontrol **Akses sebagai role** yang sudah ada pada
header, memilih **Orang Tua** atau **Siswa**. Cara ini mempertahankan tenant/data scope
role target dan lebih aman daripada membuka data anak secara global dari sesi admin.

## Batasan data

Riwayat pendidikan tidak dibuatkan tabel baru karena proyek sudah menyediakan metadata
siswa dan audit melarang duplikasi master. Informasi sekolah memakai kategori pada
`data_tambahan`; jika kategori belum diisi, UI menampilkannya sebagai Pengumuman.

## Audit Informasi Sekolah — 2 Agustus 2026

- Model konten yang tersedia hanya `PengumumanSekolah`; model `News`, `Event`,
  `Circular`, `AcademicCalendar`, dan `Gallery` tidak ditemukan. Jenis informasi
  tersebut tetap memakai `data_tambahan.tipe/kategori` pada sumber existing.
- Endpoint portal lama `/api/portal/announcements` dipertahankan. Endpoint agregasi
  non-breaking `/api/portal/school-information` dan `/summary` ditambahkan untuk
  filter server-side, pagination, count, dan section ringkasan.
- Scope backend mencakup status aktif, periode tayang, target role, unit pendidikan,
  kelas, serta ownership anak melalui resolver portal existing.
- Status baca, bookmark, dan acknowledgement disimpan per akun pada
  `users.metadata.portal_school_information`; tidak ada migration atau tabel konten baru.
- Lampiran hanya ditampilkan bila tersedia pada metadata sumber. Migrasi storage ke
  signed URL tidak dilakukan karena kontrak/path lampiran terkontrol belum tersedia.
- Rulebook UI individual yang dirujuk oleh `MODERN_SOFT_MODULE_REFACTOR_PROMPT.md`
  tidak tersedia di `docs/ai`; implementasi mengikuti dokumen aktual tersebut,
  `SIMSIT_UI_SYSTEM_PROMPT.md`, dan komponen/pola portal existing.
