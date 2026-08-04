# 09-AUDIT SECURITY — SIMSIT

## Laporan Audit Keamanan Sistem SIMSIT

### 1. Autentikasi & Token Management
- Sanctum Personal Access Token digunakan untuk API stateless backend.
- Token Kadaluarsa & Revokasi terintegrasi pada Logout dan session timeout.
- Password hashing menggunakan bcrypt standar Laravel.

---

## 2. IDOR (Insecure Direct Object Reference) Protection
- Direct parameters seperti `student_id`, `parent_id`, `employee_id`, `assignment_id` pada endpoint `/api/portal/*` dan `/api/teacher/*` selalu divalidasi terhadap context pengguna yang terautentikasi (`$request->user()`).
- Endpoint Orang Tua secara ketat memverifikasi ownership anak pada tabel pivot `student_parent_pivot`.

---

## 3. Modul Khusus Keamanan (CBT & Chat)

### CBT Ujian Keamanan
- Kunci jawaban ujian (`correct_answer`) TIDAK DIKIRIMKAN pada payload soal ujian siswa.
- Waktu ujian selalu menggunakan server-side timestamp (`now()`) untuk mencegah kecurangan manipulasi jam di browser klien.
- Attempt ujian diproteksi per siswa untuk mencegah submit ulang ujian yang sudah diselesaikan.

### Modul Chat Ortu–Guru
- Verifikasi participant dilakukan sebelum membuka thread obrolan.
- Akses attachment dan media terenkripsi dan terotorisasi.

---

## 4. Mass Assignment & Upload Safety
- Model Eloquent mendefinisikan `$fillable` secara eksplisit, mencegah overriding field sensitif seperti `is_admin` atau `role`.
- Mime-type upload file divalidasi pada Form Request (hanya mengizinkan `pdf`, `docx`, `jpg`, `png` dengan batasan ukuran `max:5120`).
