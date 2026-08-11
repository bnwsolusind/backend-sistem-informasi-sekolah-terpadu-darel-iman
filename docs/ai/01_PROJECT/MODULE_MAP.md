# MODULE MAP

Peta modul, menu, dan route utama. Detail flow per modul: `05_MODULE/`.

## Struktur Menu Utama (Sidebar)

```text
dashboard
yayasan
master-data
akademik (container: pengaturan / perencanaan / pembelajaran / evaluasi / nilai-rapor)
portal-guru
portal-musyrif
absensi
tahfizh
mutabaah
rekap-data
pengaturan
```

## Container Akademik & LMS (sidebar 21 → 6)

| Container | Tab | Route |
|---|---|---|
| Pengaturan Akademik | Tahun Ajaran, Semester, Kurikulum, Kelas & Rombel, Mapel, Jadwal | `/dashboard/akademik/pengaturan?tab=...` |
| Perencanaan | CP, TP, Modul Ajar | `/dashboard/akademik/perencanaan?tab=...` |
| Pembelajaran | Materi, Media, Referensi, Aktivitas, Diskusi | `/dashboard/akademik/pembelajaran?tab=...` |
| Tugas & Evaluasi | Penugasan, Pengumpulan, Kisi-kisi, Bank Soal, CBT | `/dashboard/akademik/evaluasi?tab=...` |
| Nilai & Rapor | Buku Nilai, Rekap Nilai, Rapor Digital | `/dashboard/akademik/nilai-rapor?tab=...` |

Route lama tetap terdaftar (kompatibilitas bookmark/notifikasi). Tab disimpan di query URL; refresh/back/deep link tetap bekerja.

## Route Portal

| Portal | Route |
|---|---|
| Admin/Staf | `/dashboard/*` |
| Portal Orang Tua | `/portal-orangtua` |
| Portal Siswa | `/portal-siswa`, `/portal-siswa/profil|jadwal|materi|tugas|nilai|ujian-cbt` |
| Portal Alumni | `/portal-alumni` |
| Login | `/masuk`, `/portal-orangtua`, `/portal-siswa` |

## Dependensi Modul (ringkas)

- Master data unit/tahun ajaran/semester → dipakai semua modul (scope + periode aktif).
- Kurikulum → mapel → jadwal → modul ajar → materi → tugas → penilaian.
- Siswa → rombel → presensi, tahfizh, mutabaah, rapor.
- Orang tua ↔ siswa via `parent_student` + `students.parent_id` → portal orang tua.
- Semua dashboard/laporan membaca dari service/repository PostgreSQL (tanpa hardcode).

## Referensi

- Detail menu/route/permission: `99_ARCHIVE/MENU_ROUTE_PAGE_MAP.md`, `99_ARCHIVE/MODULE_DEPENDENCY_MAP.md`
- Detail relasi data akademik/LMS: `99_ARCHIVE/academic-lms-data-relations.md`
