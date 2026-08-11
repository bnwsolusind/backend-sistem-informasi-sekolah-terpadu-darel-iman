# Parent Portal — Laporan Keamanan (Sesi 10)

## Ringkasan

Audit keamanan Portal Orang Tua & Siswa. Temuan diperbaiki pada sesi 10; sisa merupakan
kondisi yang sudah aman dan dijaga.

| # | Temuan | Severity | Status | Perbaikan |
|---|--------|----------|--------|-----------|
| 1 | Login parent-student tanpa batas percobaan (brute-force password/PIN) | High | **DIPERBAIKI** | `throttle:10,1` pada `/auth/login/parent-student` & `/v2/auth/login/parent-student` |
| 2 | `dashboard()` mengembalikan kode status **440** (typo) saat konteks anak invalid | Medium | **DIPERBAIKI** | diseragamkan menjadi **404** |
| 3 | `saveMutabaahStudent` menyimpan header tanpa gate assignment aktif + kolom `entry_date` keliru | High | **DIPERBAIKI** | gate assignment aktif + `activity_date` + isi seluruh kolom wajib |
| 4 | `notifications()` menulis `user_id` yang tidak ada di skema legacy PG | High | **DIPERBAIKI** | guard `Schema::hasColumn` + child scope |
| 5 | Tanda tangan catatan tidak mendeteksi perubahan isi (tanpa hash) | Medium | **DIPERBAIKI** | `signature_content_hash` (SHA-256) + status `signed/signed_updated` |
| 6 | `student_notes` skema legacy: `note` NOT NULL, kolom portal tidak ada | High | **DIPERBAIKI** | migration rekonsiliasi idempotent `2026_08_06_100000_*` |
| 7 | Resolusi konteks anak (X-Child-Id / child_id / fallback) | — | **DIVALIDASI** | anak tak terhubung → 404 di 13+ endpoint child-scoped |
| 8 | CBT monitoring dapat diakses orang tua (read-only) | — | **DIPERKETAT** | `examOverview` kini child-scoped; start/save/finish tetap `role:Siswa` |
| 9 | Akun tanpa profil portal (orang tua/siswa) | — | **AMAN** | `hasPortalProfile` menolak sebelum verifikasi password |
| 10 | Akun nonaktif | — | **AMAN** | `is_active` dicek sebelum token diterbitkan |
| 11 | Logout | — | **AMAN** | token saat ini dicabut |
| 12 | State "anak aktif" | — | **AMAN** | stateless, divalidasi ulang per request (fail-closed) |

## 2. Perilaku Fail-Closed pada Konteks Anak

Semua endpoint child-scoped mengembalikan **404** untuk anak yang tidak terhubung
(daripada melanjutkan dengan data kosong). Diverifikasi untuk: `profile`, `schedules`,
`attendance`, `grades`, `materials`, `assignments`, `tahfizh`, `mutabaah`,
`student-notes`, `reports`, `dashboard`, `permissions`, `exam-grids`.

## 3. Enkapsulasi Aksi (Role)

Orang tua hanya dapat **memantau**; aksi siswa diproteksi tambahan `role:Siswa`:
`POST /assignments/{id}/submit`, `POST /mutabaah`, `POST /lms/exams/{id}/start`,
`POST /lms/exam-sessions/{sesiId}/answers`.

## 4. Verifikasi

- `backend/tests/Feature/StudentParentPortalChildSwitchingTest.php` — 6 test / 44 assertion, semua pass.
- `backend/tests/Feature/StudentParentPortalOwnershipTest.php` — pass.
- Full suite backend: **209 passed, 5 failed** (5 failure adalah bug fixture pra-eksisting
  sesi 9: NOT NULL pada `mutabaah_daily_headers.*` dan `tbl_kelas.unit_pendidikan_id`, bukan
  regresi).
- Frontend: `npm run lint` 0 error; `npm run build` sukses.

## 5. CLOSURE SESI 10 — SIKLUS HIDUP KEAMANAN

- **Full suite kini 227 passed / 0 failed** — 5 failure pra-eksisting ditutup
  (lihat `SESSION_10_CLOSURE_REPORT.md`).
- **Rate limit diverifikasi dengan test**: `ParentStudentLoginRateLimitTest` — 10 percobaan
  gagal login portal ditoleransi, percobaan ke-11 (lewat alias `/api/v2/...`) → **429**
  (kedua alias berbagi satu kunci throttle domain+IP).
- **Notifikasi tidak lagi gagal senyap**: seluruh penulisan memakai `Notification::deliver()`
  pada skema kanonik partitioned; tanpa konteks akademik aktif notifikasi dilewati dengan aman
  (bukan exception tertutup). Diverifikasi di `NotificationDualSchemaWriteTest`.
- Konvensi fail-closed konsisten: anak tak terhubung → **404**; 403 hanya untuk anak terhubung
  tapi konten belum dipublikasikan (diperbarui pada `test_parent_cannot_sign_note_for_unlinked_student`).
