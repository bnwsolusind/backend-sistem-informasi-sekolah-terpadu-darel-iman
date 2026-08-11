# MODULE: PORTAL ORANG TUA

Bukti historis: `99_ARCHIVE/PARENT_PORTAL_CHILD_OWNERSHIP_MODEL.md`, `99_ARCHIVE/PARENT_PORTAL_CHILD_SWITCHER_UX.md`, `99_ARCHIVE/PARENT_PORTAL_AUTH_FLOW.md`, `99_ARCHIVE/PARENT_PORTAL_MUTABAAH_GATE.md`, `99_ARCHIVE/PARENT_PORTAL_NOTIFICATIONS_SCOPE.md`, `99_ARCHIVE/PARENT_PORTAL_SIGNATURE_DIGEST.md`, `99_ARCHIVE/STUDENT_PARENT_RELATION_MAP.md`.

## Auth & Ownership

- Login orang tua via No. HP, NIK Ayah, NIK Ibu, NIS anak terhubung, atau email (sumber identitas lihat `03_AUTH/AUTHENTICATION.md`).
- **Multi-child**: satu orang tua bisa punya banyak anak; login melalui satu NIS anak terhubung me-resolve household, lalu seluruh data portal di-scope per student melalui `parent_id`/`parentsPivot` milik user (`getStudentContext` child-switch aman).
- Siswa login → dirinya sendiri. Endpoint portal dipakai bersama role `Orang Tua|Siswa` (routes/api.php:759).
- Fail-closed: anak tidak terkait → 404/403 sesuai kontrak endpoint; tidak pernah fallback ke anak lain.

## Menu (per child aktif)

Ringkasan (dashboard) · Profil · Informasi Sekolah (umum) · Jadwal · Materi · Tugas (lihat; submit hanya siswa) · Tahfizh · Nilai · Komentar Guru (`visible_to_parent`) · Mutabaah (lihat + tanda tangan) · Absensi · Kisi-kisi · CBT (read-only, tanpa kunci) · Hasil (nilai di-redact bila `tampilkan_nilai_langsung=false`) · Chat guru (hanya wali/guru mapel aktif kelas anak).

## Gate & Tanda Tangan

- Mutabaah: orang tua meninjau & tanda tangan checklist (`mutabaah_parent_signatures`); signature system digest.
- Student notes: tanda tangan hanya orang tua terhubung (`POST /api/portal/student-notes/{id}/sign`; siswa → 403).
- Notifikasi & bill scoped per student.
- Profil anak dapat membaca QR kartu siswa melalui `/api/portal/attendance-qr`; endpoint memakai child context ownership dan hanya mengembalikan token opaque stabil, tanpa NIS/NISN/nama di payload QR.

## Controlled Transactions

Orang tua dapat mengajukan izin/sakit, laporan kegiatan rumah/mutabaah rumah sesuai rule, signature/approval, chat, dan switch anak. Transaksi tersebut tidak boleh didelegasikan ke role Siswa. Route parent tidak boleh bergantung pada membuka workspace siswa sebagai pengganti portal parent.

## Route

`/portal-orangtua` → `ParentPortalPage` (alias `/portal/orangtua`). Child switcher UX: `99_ARCHIVE/PARENT_PORTAL_CHILD_SWITCHER_UX.md`.

## Referensi

- Detail arsip: `99_ARCHIVE/PARENT_PORTAL_*`, `99_ARCHIVE/PARENT_NOTE_APPROVAL_FLOW.md`, `99_ARCHIVE/STUDENT_PARENT_RELATION_MAP.md`
- Chat: `05_MODULE/CHAT.md`
