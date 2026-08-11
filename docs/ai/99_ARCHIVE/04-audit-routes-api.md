# 04-AUDIT ROUTES API — SIMSIT

## Pemetaan Route API Backend (682 Routes)

### Group Endpoint Utama Backend SIMSIT

1. **Autentikasi & Profile (`/api/v2/auth/*`, `/api/profile`)**:
   - `/login`, `/login/admin`, `/login/employee`, `/login/employee-qr`, `/login/parent-student`.
   - Management token Sanctum & update password / avatar.

2. **Dashboard Pemantauan Yayasan & Unit (`/api/foundation/*`)**:
   - Extended read-only endpoints: `/dashboard`, `/units`, `/employees`, `/teachers`, `/students`, `/mutations`, `/graduation`, `/alumni`, `/reports`, `/notifications`, `/profile`.
   - Dilindungi middleware `auth:sanctum` dan `EnsureFoundationReadOnly`.

3. **Absensi Digital & Gate (`/api/gate-attendance/*`, `/api/worship-attendance/*`)**:
   - Check-in/check-out QR & RFID, verifikasi musyrif, rekap harian, device integration endpoints.

4. **Tahfizh & Mutabaah (`/api/tahfizh/*`, `/api/mutabaah/*`, `/api/student/mutabaah/*`)**:
   - Setoran harian, log perkembangan, rekapitulasi juz/surah, spreadsheet mutabaah yaumiyyah, verifikasi guru.

5. **Akademik & LMS (`/api/lms/*`, `/api/academic-years`, `/api/subjects`, `/api/schedules`)**:
   - Kurikulum, CP, TP, Modul Ajar, Materi, Media, Referensi, Diskusi, Presensi Pembelajaran, Kisi-Kisi, Bank Soal, CBT Ujian, Rapor.

6. **Portal Ortu, Siswa & Guru (`/api/portal/*`, `/api/teacher/*`)**:
   - Parent/student ownership validation, chat wali kelas & guru mapel, jadwal, nilai, penugasan, presensi.

---

## Standarisasi Payload & Response API
- **Success (200/201)**:
  ```json
  {
    "success": true,
    "message": "Data berhasil dimuat.",
    "data": [],
    "meta": {}
  }
  ```
- **Validation Error (422)**:
  ```json
  {
    "success": false,
    "message": "Validasi gagal.",
    "errors": {}
  }
  ```
- **Forbidden (403)**:
  ```json
  {
    "success": false,
    "message": "Anda tidak memiliki hak akses."
  }
  ```
