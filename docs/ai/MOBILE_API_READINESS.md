# MOBILE API READINESS — SISTEM MANAJEMEN SEKOLAH TERPADU

Dokumen ini memverifikasi kesiapan API backend Laravel 12 untuk dikonsumsi oleh aplikasi mobile (`mobile-app` React Native / Flutter / Android Native).

---

## 1. EVALUASI KESIAPAN MOBILE GATE

```text
STATUS KESIAPAN MOBILE: READY FOR MOBILE DEVELOPMENT
```

### Kriteria Kesiapan Terverifikasi:
- **API Response Structure Standard**: Semua endpoint V1 mengembalikan format JSON standar `{ success: true, message, data, meta }`.
- **Stateless Authentication**: Mendukung Laravel Sanctum Bearer Token via HTTP Header `Authorization: Bearer <token>`.
- **Multi-Context Header**: Supporting `X-Child-Id` header untuk Portal Orang Tua Multi-Anak tanpa ketergantungan pada browser session.
- **Pagination Format**: Standar Laravel JSON resource pagination (`current_page`, `last_page`, `per_page`, `total`).
- **Error Handlers**: Handling 401 Unauthorized, 403 Forbidden, 422 Unprocessable Entity, & 404 Not Found konsisten.

---

## 2. KATALOG ENDPOINT UNTUK APLIKASI MOBILE

### 2.1 Autentikasi & Profile
- `POST /api/v1/auth/login` (Login Username/Password)
- `POST /api/v1/auth/employee-login` (Login NIY / Token QR Pegawai)
- `GET /api/v1/auth/me` (Profile, Roles, Permissions)
- `POST /api/v1/auth/logout`

### 2.2 Portal Orang Tua (Parent App)
- `GET /api/v1/parent/children` (Daftar Anak Terhubung)
- `GET /api/v1/parent/dashboard` (Header: `X-Child-Id`)
- `GET /api/v1/parent/attendance` (Rekap Kehadiran Anak)
- `POST /api/v1/parent/permission` (Pengajuan Izin/Sakit Anak)
- `GET /api/v1/parent/tahfizh` (Progress Hafalan Anak)
- `GET /api/v1/parent/mutabaah` (Checklist & Sign Mutabaah Anak)
- `GET /api/v1/parent/grades` (Buku Nilai & Rapor Anak)
- `GET /api/v1/chat/conversations` (List Chat Guru)
- `POST /api/v1/chat/messages` (Kirim Pesan ke Guru)

### 2.3 Portal Siswa (Student App)
- `GET /api/v1/student/profile` (Biodata Siswa)
- `GET /api/v1/student/schedules` (Jadwal Pelajaran Siswa)
- `GET /api/v1/student/materials` (Materi Pembelajaran)
- `GET /api/v1/student/assignments` (Tugas Siswa)
- `POST /api/v1/student/submissions` (Upload Pengumpulan Tugas)
- `GET /api/v1/student/tahfizh` (Hafalan Saya)
- `GET /api/v1/student/mutabaah` (Input Mutabaah Saya)
- `GET /api/v1/student/grades` (Nilai Saya)

### 2.4 Portal Guru & Absensi (Teacher / Staff App)
- `GET /api/v1/teacher/dashboard` (Ringkasan Guru)
- `GET /api/v1/teacher/schedules` (Jadwal Mengajar Hari Ini)
- `GET /api/v1/lms/presensi` (Matriks Presensi Pembelajaran)
- `POST /api/v1/lms/presensi` (Input Presensi Kelas)
- `POST /api/v1/lms/presensi/finalize` (Finalisasi Presensi)
- `POST /api/v1/gate-attendance/scan` (Scanner QR/Barcode/RFID Gerbang)
- `POST /api/v1/tahfizh` (Input Setoran Hafalan Siswa)
- `GET /api/v1/worship-attendance/sessions` (Presensi Ibadah Asrama)
- `POST /api/v1/worship-attendance/records` (Verify Presensi Ibadah)

STATUS MOBILE READINESS: `READY FOR MOBILE APP INTEGRATION`
