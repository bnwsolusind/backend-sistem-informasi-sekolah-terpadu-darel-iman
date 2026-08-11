# MODULE: PORTAL SISWA

Bukti historis: `99_ARCHIVE/STUDENT_PORTAL_ROUTE_MAP.md`, `99_ARCHIVE/STUDENT_PORTAL_SECURITY_TEST_REPORT.md`, `99_ARCHIVE/CBT_SECURITY_MODEL.md`.

## Route & Section (14 subroute, shell `StudentPortalPage`)

| PATH | SECTION |
|---|---|
| `/portal-siswa` | ringkasan |
| `/portal-siswa/profil` | profile |
| `/portal-siswa/informasi-sekolah` | announcements |
| `/portal-siswa/jadwal` | schedules |
| `/portal-siswa/materi` | materials |
| `/portal-siswa/tugas` | assignments |
| `/portal-siswa/tahfizh` | tahfizh |
| `/portal-siswa/nilai` | grades |
| `/portal-siswa/komentar-guru` | student-notes |
| `/portal-siswa/mutabaah` | mutabaah (MutabaahWorkspace) |
| `/portal-siswa/absensi` | attendance |
| `/portal-siswa/kisi-kisi` | kisi |
| `/portal-siswa/ujian-cbt` | ujian |
| `/portal-siswa/hasil` | hasil |

Route `/portal-siswa` shell + alias `/portal/siswa`.

## Self-Scope & Security

- Semua data scoped student auth (tidak ada `student_id` dari request kecuali via `getAuthenticatedStudent`).
- Profil siswa dapat membaca `/api/portal/attendance-qr`; server mengembalikan credential kartu opaque stabil dan QR tidak memuat data pribadi.
- CBT: redact kunci/pembahasan; timer ditegakkan; nilai di-redact sampai `tampilkan_nilai_langsung=true`.
- Submit tugas: self via `updateOrCreate(penugasan_id, siswa_id=self)` + guard kelas & publikasi.
- Mutabaah: save self + butuh assignment aktif; tanda tangan catatan siswa = 403 untuk siswa.
- Input checklist mutabaah tanpa agenda aktif → daftar kosong (tanpa mock).

## Transaction Boundary (Freeze)

Siswa boleh menjalankan aktivitas akademik self-scope seperti submit tugas dan CBT. Siswa tidak boleh membuat izin/sakit, laporan rumah, approval/signature parent, mengubah absensi, data administrasi, atau nilai. Baseline route/permission izin siswa masih bertentangan dan dicatat sebagai P0; jangan dianggap kontrak final.

## Referensi

- Detail rute API: `99_ARCHIVE/STUDENT_PORTAL_ROUTE_MAP.md`
- Chat: `05_MODULE/CHAT.md`
