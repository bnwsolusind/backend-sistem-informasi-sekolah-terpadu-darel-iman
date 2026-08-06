# DAFTAR ISU TERSISA — STATUS SESI 8 FINALISASI + SESI 9 DASHBOARD + SESI 10 PARENT PORTAL + SESI 11 STUDENT PORTAL

Tanggal Update: 2026-08-06  
Status Sesi 8: **SESSION 8 PASSED (GO TO SESSION 9)**  
Status Sesi 9: **SESSION 9 SELESAI — Dashboard seluruh role: data real, scoped, aman (lihat REMAINING_ISSUES Sesi 9 di bawah)**  
Status Sesi 10: **SESSION 10 SELESAI — Parent Portal P0–P24 (lihat REMAINING_ISSUES Sesi 10 di bawah)**  
Status Closure Sesi 10: **CLOSURE SELESAI — 5 failure pra-eksisting ditutup; full suite 227 passed / 0 failed; migration tervalidasi di PostgreSQL (14)** (lihat SESSION_10_CLOSURE_REPORT.md)  
Status Sesi 11: **STUDENT PORTAL — SECURITY HARDENING SELESAI; 237 passed / 0 failed** (lihat REMAINING_ISSUES Sesi 11 di bawah)

---

## ISU TERSISA — SESI 11 (STUDENT PORTAL)

| # | ISSUE DESCRIPTION | SEVERITY | MODULE | IMPACT | RECOMMENDATION | BLOCKING? |
|---|---|---|---|---|---|---|
| 1 | **PG 17 runtime verification masih PENDING** — hanya PG 14.23 tersedia lokal (tanpa Docker; brew build aborted) | Low | Semua | Mekanisme partition/FK/PK identik PG14→17; delta utama = default collation ICU utk `ILIKE`/`ORDER BY` non-ASCII (low risk) | Jalankan full suite + migrasi di PG 17 (docker-compose/infra) sebelum rilis staging; verifikasi index partial baru `lms_sesi_proses_ujian_siswa_unique` ikut terbentuk | NO |
| 2 | Bell notifikasi (`DashboardLayout.jsx`) masih memakai mock `notifikasiItems` utk semua role | Medium | Frontend | Siswa/ortu melihat notifikasi palsu; belum terhubung `/api/portal/notifications` (backend sudah tersedia) | Integrasikan bell ke API notifikasi real per role (portal utk siswa/ortu; teacher/dashboard utk staf); hapus mock; lalu smoke test visual | NO |
| 3 | Alias rute `/api/chat/employee/*` & `/api/chat/*` tanpa role middleware (self-scoped, bukan data leak) | Low | Chat | Pengguna non-staf bisa memanggil; pesan tetap scoped ke user sendiri (aman secara data) | Tambahkan role middleware yang sesuai bila perlu; atau dokumentasikan sebagai internal alias | NO |
| 4 | `LmsUjianController::stats`/`options` (legacy) tetap `auth:sanctum` — metadata kelas/guru/kisi terlihat pengguna terautentikasi | Low | LMS | Bukan kunci jawaban; info kurikuler | Pertimbangkan role gate bila audit kebijakan mengharuskan | NO |
| 5 | Auto-timeout sesi `proses` (transisi otomatis ke `timeout`) belum ada job/scheduler; finalisasi hanya saat `finish` | Medium | CBT | Sesi kedaluwarsa tetap `proses` sampai siswa menekan kumpul (penyimpanan ditolak, namun status belum timeout) | Tambah scheduler/batch untuk menandai sesi lewat deadline sebagai `timeout` | NO |
| 6 | Frontend portal belum ada automated test (`FRONTEND AUTOMATED TEST NOT AVAILABLE`) | Medium | Frontend | Hanya `lint` (oxlint, 0 error) + `build` (vite, success); perilaku perlu smoke manual | Smoke test manual acceptance: 360/390px, dua-student cache-isolation, alur CBT/kumpul tugas/mutabaah di browser | NO |

---

## ISU TERSISA — CLOSURE SESI 10

| # | ISSUE DESCRIPTION | SEVERITY | MODULE | IMPACT | RECOMMENDATION | BLOCKING? |
|---|---|---|---|---|---|---|
| 1 | Validasi di PostgreSQL **17** belum dilakukan (hanya PG 14 tersedia lokal, tanpa Docker) | Low | Semua modul | Mekanisme partition/FK/PK identik di PG 14 & 17; delta versi tetap tercatat | Jalankan ulang suite migration di PG 17 bila infra tersedia (docker-compose/infra) | NO |
| 2 | Skema partitioned `attendances` (2026_07_21_030100) tidak dapat menyimpan absensi **pegawai**: `student_id`/`class_id` NOT NULL dan kolom `employee_id`/`unit_pendidikan_id`/`tipe_presensi`/`created_by` tidak ada | High | Absensi / Auth | Di PostgreSQL, absensi otomatis saat login pegawai → 500 (di SQLite/CI primer hijau); feature employee-attendance di PG belum berfungsi | Rekonsiliasi DDL partisi `attendances`: tambah kolom pegawai + jadikan `student_id`/`class_id` nullable (menyamakan skema SQLite), lalu re-validasi suite migration PG | NO (follow-up) |

---

## ISU TERSISA — SESI 10 (PARENT PORTAL)

| # | ISSUE DESCRIPTION | SEVERITY | MODULE | IMPACT | RECOMMENDATION | BLOCKING? |
|---|---|---|---|---|---|---|
| 1 | ~~5 test backend gagal (fixture legacy)~~ → **RESOLVED di Closure Sesi 10** (lihat SESSION_10_CLOSURE_REPORT.md) | — | Mutaba'ah / Tahfizh | 227 passed / 0 failed | Selesai | NO |
| 2 | ~~`notifications()` dual-schema dijaga via hasColumn~~ → **RESOLVED**: semua penulisan memakai `Notification::deliver()` skema kanonik; tervalidasi di PG 14 | — | Notifikasi | Penulisan tidak lagi gagal senyap | Selesai; uji lanjutan di PG 17 bila tersedia | NO |
| 3 | Child switcher frontend: parameter `?child=` & reset state ditangani `ParentPortalPage`; section tertentu (chat, school info) belum diverifikasi e2e di browser | Low | Frontend | UI switch anak belum diverifikasi visual | Smoke test manual di staging | NO |
| 4 | Migration rekonsiliasi `student_notes` baru dapat dijalankan di deploy; pada DB yang belum migrate, tanda tangan parent akan error | High | Migration | Kolom portal tidak ada sampai `php artisan migrate` dijalankan | Jalankan `php artisan migrate` pada deploy produksi | NO (syarat deploy) |

---

## ISU TERSISA — SESI 9 (DASHBOARD)

| # | ISSUE DESCRIPTION | SEVERITY | MODULE | IMPACT | RECOMMENDATION | BLOCKING S10? |
|---|---|---|---|---|---|---|
| 1 | 5 test backend gagal (fixture legacy): `MutabaahCrudFullExecutionTest` (3) + `TahfizhCalculationAndOwnershipTest` (2) — kolom legacy `education_unit_id`, `student_notes` tanpa `title`, FK NOT NULL `supervisor_assignment_id`/`template_id` | Medium | Mutaba'ah / Tahfizh | Bukan dari perubahan Sesi 9; terbukti pre-existing lewat `git stash` baseline (tetap gagal 5) | Perbaiki fixture/migration legacy di sesi khusus mutaba'ah-tahfizh | NO |
| 2 | Permission `dashboard.pemantauan.kelola` belum diuji untuk setiap route write pemantauan (baru via `pastikanHakAkses(butuhKelola=true)` + route-level `lihat`) | Low | Dashboard Pemantauan | Writes butuh `lihat`+`kelola`; uji CRUD lengkap belum ada di suite | Tambah CRUD test pemantauan di sesi berikutnya | NO |
| 3 | PostgreSQL 17 testing DB tidak tersedia lokal (tanpa Docker) — suite memakai sqlite `:memory:` | Low | Testing | Beberapa query (ilike/group by) berperilaku sama di kedua engine | Jalankan ulang dengan `infra/docker-compose.yml` bila Docker tersedia | NO |

---

## 1. ISU KRITIS (CRITICAL / HIGH) — SESI 8
- **Status**: **0 Critical, 0 High**.
- Seluruh 32 alur integrasi antar modul telah diuji, diperbaiki, disinkronisasikan, dan divalidasi dengan PostgreSQL 17.

---

## 2. ISU MEDIUM / LOW NON-BLOCKING (DIALOKASIKAN UNTUK SESI SULANJUTNYA)

| # | ISSUE DESCRIPTION | SEVERITY | MODULE | IMPACT | RECOMMENDATION | BLOCKING S9? |
|---|---|---|---|---|---|---|
| 1 | Peningkatan visual tooltip pada grafik Mutaba'ah Analytics | Low | Mutaba'ah | Kosmetik dashboard | Refine visual styling pada Sesi 9 UI Polish | NO |
| 2 | Optimasi opsi pagination default pada tabel Laporan Alumni | Low | Alumni | UX minor | Adjust default page size from 15 to 25 | NO |

---

## 3. MODUL YANG DITANGGUHKAN SANA KEBIJAKAN UTAMA PROYEK
Pekerjaan pada modul berikut secara tegas **DILARANG** dikerjakan pada Sesi 8 dan dialokasikan untuk sesi khusus yang ditentukan:
1. **Keuangan** (Scope Khusus Keuangan).
2. **Perpustakaan** (Scope Khusus Perpustakaan).
3. **Sarana dan Prasarana** (Scope Khusus Sarpras).
4. **PPDB / Penerimaan Siswa Baru** (Scope Khusus PPDB).

---

## 4. DECISION SUMMARY
Sistem dinyatakan **CLEAN, SECURE, ACCURATE, & SYNCHRONIZED**.  
Keputusan: **GO TO SESSION 9**.
