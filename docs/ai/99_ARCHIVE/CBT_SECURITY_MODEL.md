# CBT Security & Anti-Cheating Model — Sesi 5

## Prinsip Keamanan Utama

| Vektor Serangan / Resiko | Mekanisme Proteksi & Hardening | Status Audit |
| :--- | :--- | :--- |
| **Session Hijacking / Identity Manipulation** | `siswa_id` wajib diekstrak dari akun yang terautentikasi (`auth()->user()->student->id`). Payload `siswa_id` dari client diabaikan untuk role Siswa. | **HARDENED** |
| **Answer Key Leakage (Inspeksi Browser / DevTools)** | Response JSON `startSession` secara ketat mengabaikan `kunci_jawaban` dan `pembahasan`. Pasangan kunci `menjodohkan` dipisah dan diacak. | **HARDENED** |
| **Tampering Sisa Waktu (Client Timer Alteration)** | Perhitungan durasi pengerjaan sepenuhnya *server-side* berbasis `now().diffInSeconds(waktu_mulai)`. Jika `elapsed >= durasi`, pengerjaan dibekukan. | **HARDENED** |
| **Jawaban Soal Kelas Lain / Injeksi Soal** | API `saveExamAnswers` memvalidasi `soal_id` terhadap daftar soal di `kisi_kisi_id` ujian yang bersangkutan. Soal di luar ujian ditolak. | **HARDENED** |
| **Percobaan Pengerjaan Berulang (Attempt Bypass)** | `startSession` memeriksa jumlah `LmsUjianSesi` terdaftar per siswa. Jika `count >= max_attempt`, pengerjaan baru ditolak (HTTP 422). | **HARDENED** |

## Audit & Verification Matrix
Seluruh proteksi di atas telah teruji dalam skenario otomatis `LmsSesi5AssignmentsAndCbtTest.php`.
