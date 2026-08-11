# Audit Integrasi Portal Orang Tua & Siswa

Tanggal audit: 2 Agustus 2026

Portal memakai data modul utama sebagai lapisan akses dan agregasi. Tidak ada migration,
tabel portal baru, CRUD duplikat, atau data production hardcode yang ditambahkan.
Dokumen rujukan `MODERN_SOFT_MODULE_REFACTOR.md` tidak tersedia; implementasi mengikuti
`MODERN_SOFT_MODULE_REFACTOR_PROMPT.md` dan `SIMSIT_UI_SYSTEM_PROMPT.md` yang tersedia.

| Fitur Portal | Sumber Data Lama | Tabel | Model | Relasi | API Lama | Status Integrasi | Tindakan |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Profil siswa | Master siswa | `students`, `parents`, `student_parents` | `Student`, `ParentModel` | user, parent langsung/pivot, kelas, unit | `/api/portal/profile` | Terintegrasi | Ownership langsung dan pivot disatukan |
| Pilihan anak | Master siswa/orang tua | `students`, `student_parents` | `Student`, `ParentModel` | parent langsung dan many-to-many | `/api/portal/children` | Terintegrasi | Hanya anak aktif milik user yang dikembalikan |
| Dashboard | Akademik, LMS, informasi | tabel modul terkait | model modul terkait | siswa, kelas, unit | `/api/portal/dashboard` | Terintegrasi | Dipakai web dan mobile tanpa mock |
| Materi | Materi Pembelajaran | `lms_materi`, `lms_modul_ajar`, `lms_media` | `LmsMateri` | modul, kelas, subject, media | `/api/portal/materials` | Terintegrasi | Hanya status published dan kelas siswa |
| Tugas | Penugasan LMS | `lms_penugasan`, `lms_pengumpulan_tugas` | `LmsPenugasan` | subject, teacher, submission siswa | `/api/portal/assignments` | Terintegrasi | Mobile memakai pengumpulan API nyata |
| Nilai | Penilaian/Rapor | `student_grades`, `lms_rapor` | `StudentGrade`, `LmsRapor` | siswa, subject, semester | `/api/portal/grades`, `/api/portal/reports` | Terintegrasi | Rapor dibatasi status published |
| Kisi-kisi/CBT | Kisi-kisi, bank soal, ujian | `lms_kisi_kisi`, `lms_bank_soal`, `lms_ujian` | model LMS ujian | kelas, subject, sesi siswa | `/api/portal/lms/exams` | Terintegrasi | Sesi selalu memakai siswa login |
| Informasi sekolah | Pengumuman pemantauan | `pengumuman_sekolahs` | `PengumumanSekolah` | target role dan periode tayang | `/api/portal/announcements` | Sebagian Terintegrasi | Unit/kelas belum berupa kolom khusus; memakai target existing |
| Komunikasi | Pesan portal existing | `portal_messages` | `PortalMessage` | siswa, parent, guru terkait | `/api/portal/chat/*` | Terintegrasi | Kontak guru dibatasi konteks anak |
| Mobile portal | Endpoint portal existing | tidak ada tabel baru | tidak ada model baru | token login dan child context | endpoint `/api/portal/*` | Terintegrasi | Mock orang tua/siswa diganti API nyata |
| Perpustakaan digital | Belum ditemukan sumber lengkap | — | — | — | — | Struktur Data Belum Tersedia | TERTUNDA — STRUKTUR DATABASE BELUM TERSEDIA |

## Hasil sinkronisasi

- Modul lama: Master Siswa, Akademik, LMS, Presensi, Tahfizh, Mutabaah, Pengumuman, Notifikasi, dan Rapor.
- Relasi diperbaiki: orang tua ke anak melalui `students.parent_id` dan pivot `student_parents`.
- Endpoint agregasi: seluruh endpoint `/api/portal/*` yang sudah tersedia digunakan kembali.
- Permission/ownership: role portal, siswa login, dan anak yang benar-benar tertaut ke orang tua.
- UI: halaman web portal existing dan layar mobile berbasis API, dengan loading, error, empty, serta refresh state.

## Tidak dibuat

- Migration baru: tidak ada.
- Tabel baru: tidak ada.
- CRUD duplikat: tidak ada.
- Data hardcode portal mobile: tidak ada.

## Validasi

- Backend: `MultiPortalAuthTest` lulus 5 test/20 assertion.
- Ownership: `StudentParentPortalOwnershipTest` memverifikasi anak pivot dan penolakan siswa lain.
- Frontend web: build Vite berhasil.
- Mobile: layar portal lolos kompilasi; pemeriksaan proyek masih menemukan error lama pada `TeacherPortalScreen.tsx` (`tracking` bukan properti style React Native), tidak diubah karena Portal Guru di luar cakupan.
