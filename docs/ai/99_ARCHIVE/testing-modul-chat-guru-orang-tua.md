# CHECKLIST TESTING MODUL CHAT GURU & ORANG TUA

Daftar pengujian fungsionalitas dan verifikasi keamanan modul **Komunikasi Sekolah / Chat Guru**.

---

## 1. HAK AKSES & KEAMANAN (OWNERSHIP TEST)
- [x] **Orang Tua HANYA melihat anak miliknya**: Memilih anak mengganti konteks `student_id` secara tervalidasi di backend.
- [x] **IDOR Conversation Test**: Mencoba membuka `/api/portal/chat/{teacherId}` dengan `child_id` anak milik user lain mengembalikan error/404/403.
- [x] **Sender ID Spoofing Test**: Backend mengabaikan `sender_id` dari payload dan mewajibkan pengirim berasal dari `auth()->id()`.
- [x] **Wali Kelas Boundary Test**: Wali Kelas hanya dapat melihat orang tua dari siswa di rombel aktif yang diasuhnya.
- [x] **Guru Mapel Boundary Test**: Guru Mapel hanya dapat melihat orang tua dari siswa di rombel & kelas yang diajarnya sesuai `class_schedules`.

---

## 2. DYNAMIC CONTEXT & MULTI-CHILD
- [x] **Pergantian Anak**: Pergantian pilihan anak pada header portal orang tua membersihkan cache percakapan dan memperbarui daftar kontak guru yang relevan untuk anak baru.
- [x] **Pemisahan Chat antar Anak**: Pesan anak A tidak tercampur dengan pesan anak B meskipun gurunya sama.

---

## 3. UI STATE & AESTHETICS (MODERN SOFT)
- [x] **Empty State**: Tampil dengan ilustrasi dan teks penjelas apabila kontak guru belum ditentukan atau percakapan belum ada.
- [x] **Skeleton Loading**: Tampil saat berpindah kontak atau memuat daftar pesan.
- [x] **Error State**: Tampil tombol "Coba Lagi" jika terjadi kegagalan jaringan API.
- [x] **Badge Belum Dibaca**: Memperbarui unread count secara real-time saat pesan dibaca.
- [x] **Responsive Mobile Layout**: Master-detail toggle bekerja lancar di layar sm/md/lg.
