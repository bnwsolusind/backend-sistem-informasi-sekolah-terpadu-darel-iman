# SESI 12 — FINAL REPORT: NOTIFIKASI REAL + CHAT ROLE-SCOPED + AUTO-TIMEOUT CBT

Tanggal: 2026-08-07  
Scope: (1) bell notifikasi real (hapus mock) dengan API single source-of-truth, (2) role/ownership
scoping modul chat (portal, guru, pegawai), (3) scheduler auto-timeout sesi CBT yang masih `proses`
melewati batas waktu.

---

## 1. VERDICT

```text
SESSION 12 PASSED WITH ENVIRONMENT NOTE — PG17 RUNTIME VERIFICATION PENDING
```

- Seluruh fungsi Sesi 12 **PASS** di runtime tersedia (SQLite suite + PostgreSQL 14.23).
- **PG 17 runtime belum diverifikasi** (hanya PG 14.23 lokal, tanpa Docker) → catatan jujur, bukan blocker fungsional.
- Tidak ada NO-GO: bell membaca data real, chat di-scope per role/ownership, sesi CBT timeout otomatis,
  tanpa regresi baseline S11.

## 2. BASELINE & HASIL TEST

| METRIK | BASELINE S11 | AKHIR S12 | DELTA |
|---|---|---|---|
| Tests | 246 | **278** | +32 |
| Assertions | 947 | **1050** | +103 |
| Failures | 0 | **0** | — |
| Errors | 0 | **0** | — |

```text
Guard 6 filter critical : 25 passed / 100 assertions  (BASELINE INTACT)
Full suite (SQLite)     : 278 passed / 1050 assertions / 0 failed / 0 error
Test baru S12 (SQLite)  : 37 passed / 128 assertions
  (ChatAccessScopeTest 8/18, NotificationApiScopeTest 5/26,
   CbtAutoTimeoutTest 9/36, NotificationApiTest 1/6, NotificationDualSchemaWriteTest 3/18,
   SchoolInformationVisibilityTest 11/24 — ditambahkan saat final verification Sesi 12)
```

Verifikasi PostgreSQL 14 (DB `sms_closure_testing`):
```text
Guard group S12 (PG)            : 64 passed / 249 assertions
  (Chat|NotifScope|CbtTimeout|NotificationDualSchema|NotificationApi|SchoolInformationVisibility|
   Portal isolation|CBT security|Parent portal)
MultiPortalAuthTest (PG)        : 4 passed / 2 failed (15 assertions)
  → 2 kegagalan = limitasi PRA-EKSISTING absensi pegawai pada skema partitioned
    `attendances` (`attendances_m08`): student_id/class_id NOT NULL tanpa kolom employee_id —
    IDENTIK dengan catatan Sesi 10/11; BUKAN regresi Sesi 12.
Frontend (web-dashboard)        : lint 0 error / build success
```

## 3. LINGKUNGAN VERIFIKASI

- Backend: `php artisan test` (suite utama = SQLite :memory:, `RefreshDatabase`).
- PostgreSQL: PG 14.23 (Homebrew) — suite migrasi + 26 test S12 tervalidasi di DB `sms_closure_testing`.
- Frontend: setelah `npm install` (binding native `@rolldown`/`@oxlint` tersedia),
  `npm run lint` = **0 error** dan `npm run build` = **success** (sebelumnya terblokir oleh
  `Cannot find module '@rolldown/binding-darwin-universal'` — bukan error kode).
- **FRONTEND AUTOMATED TEST NOT AVAILABLE** (tidak ada script test/typecheck) → acceptance manual (lihat §7).

## 4. YANG DISELESAIKAN

### 4.1 Notifikasi — sumber kebenaran tunggal + bell real
1. `Notification::usesCanonicalSchema()` — deteksi skema (kanonik partitioned vs legacy user-scoped)
   **di-cache static** (bukan `Schema::hasColumn()` per request) → `docs/ai/NOTIFICATION_SOURCE_OF_TRUTH.md`.
2. `Notification::userQuery($userId, $filters)` — builder bersama filter `search`/`type`/`is_read`,
   sumber kebenaran tunggal untuk semua kanal API (dashboard, portal guru, portal wali/siswa).
3. `scopeByUser` **schema-aware** (kanonik → `notifiable_id`, legacy → `user_id`); perbaiki bug PG
   `column user_id does not exist` (BUG-S12-01).
4. `NotificationController::index` + `TeacherPortalController::notifications` (sebelumnya query
   langsung kolom `user_id` → gagal di PG) + `StudentParentPortalController::notifications` semua
   memakai `userQuery`.
5. Frontend `DashboardLayout.jsx`: **mock `notifikasiItems` dihapus** → API real
   (`reportService.notifications`, unread count, mark-all-read, mark-single-read), badge `9+`,
   drawer dengan loading/error/empty state. Portal siswa/ortu memakai section "Informasi Sekolah"
   berbasis data real (bukan bell mock).

### 4.2 Chat — role & ownership scope
6. Role middleware ditambahkan pada alias `/api/chat/*` (portal + staf) dan `/api/employee/chat/*`
   (staf) — BUG-S12-05 (sebelumnya tanpa guard role; self-scoped tetapi dapat dipanggil non-staf).
7. `EmployeeChatController::employeeContacts` **di-scope ke unit requester** + hanya user aktif;
   parameter `unit_id` dihapus (anti eksplorasi unit lain) — BUG-S12-06.
8. `sendEmployeeMessage` menolak penerima non-pegawai aktif (403) — BUG-S12-07.
9. Portal chat: `isValidTeacherContact()` — kontak guru terbatas **wali kelas** atau **guru mapel
   pada jadwal aktif kelas siswa** — BUG-S12-08 (sebelumnya guru mana pun dapat dihubungi).
10. Chat guru: `isAssignedToStudent()` — siswa terbatas wali kelas (homeroom) atau kelas yang diajar
    (jadwal aktif) — BUG-S12-09.
11. Matrix akses lengkap di `docs/ai/CHAT_ROLE_SCOPE_MATRIX.md`.

### 4.3 CBT — auto-timeout scheduler
12. `LmsUjianRepository::autoSubmitExpiredSessions($limit)` — sesi `proses` dengan
    `waktu_mulai + durasi_menit*60 < now` di-claim atomik (`proses→timeout`, `waktu_selesai=now`)
    → idempotent antar runner; objektif dinilai, esai dibiarkan pending manual, kunci tidak bocor.
13. `finalizeSesiUjian` di-refactor → private `gradeAndFinalize($sesi, $status)`; finalisasi idempotent
    (sesi `selesai`/`timeout` tidak diproses ulang). `getHasilUjian` kini menyertakan status `timeout`.
14. Command `php artisan cbt:auto-timeout` (`--limit=100`) + scheduler
    `Schedule::command('cbt:auto-timeout')->everyMinute()` di `routes/console.php`.
15. Alur + test report di `docs/ai/CBT_TIMEOUT_SCHEDULER_FLOW.md` & `CBT_TIMEOUT_TEST_REPORT.md`.

### 4.4 Informasi Sekolah (verifikasi khusus — ditambahkan saat closure)
19. **Verifikasi visibilitas & targeting** lewat test baru `SchoolInformationVisibilityTest` (11/24,
    lulus SQLite & PG 14): draft (`status_aktif=false`) tidak tampil, publish tampil, belum-mulai
    (`mulai_tampil > now`) tidak tampil, kadaluarsa (`selesai_tampil < now`) tidak tampil,
    target role (JSONB `target_peran`), target unit (`data_tambahan->education_unit_id` +
    `is_public`), target kelas (`data_tambahan->class_id`), portal orang tua (child-scoped) &
    siswa, read receipt (`is_read`/`unread_count`). Kompatibilitas query JSONB di PG 14 terbukti.

### 4.5 Bug laten PostgreSQL yang diperbaiki (bukan sekadar test)
20. BUG-S12-02 (Critical): Carbon 3 `diffInSeconds()` menghasilkan nilai **negatif** → `abs()` diterapkan
    sebelum ditulis ke `durasi_aktual_detik` (unsignedInteger). Tanpa fix ini, **seluruh finalisasi** sesi
    CBT (normal maupun timeout) gagal di PG dengan error tipe integer unsigned.
21. BUG-S12-04: fixture `NotificationApiTest` memakai UUID all-zero → melanggar FK PostgreSQL
    (partitioned); diganti AcademicYear/Semester nyata.
22. BUG-S12-11: fixture `NotificationDualSchemaWriteTest` memakai konteks akademik/pegawai yang tidak
    valid (wali kelas tidak terhubung) → diperbaiki agar menulis via jalur nyata.

## 5. FILE YANG DIUBAH/DITAMBAH

Backend:
- `app/Models/Notification.php` — `usesCanonicalSchema()` (cached), `userQuery()`, `scopeByUser` schema-aware.
- `app/Http/Controllers/Api/V1/NotificationController.php` — index memakai `userQuery`.
- `app/Http/Controllers/Api/V1/TeacherPortalController.php` — `notifications()` via `userQuery`; `isAssignedToStudent()`; guard `chatMessages`/`sendChatMessage`.
- `app/Http/Controllers/Api/V1/StudentParentPortalController.php` — `isValidTeacherContact()`; guard `chatMessages`/`sendChatMessage`; `notifications()` via `userQuery`.
- `app/Http/Controllers/Api/V1/EmployeeChatController.php` — unit-scope contacts + is_active; validasi penerima employee (403).
- `backend/routes/api.php` — role middleware alias `/api/chat/*` & `/api/employee/chat/*`.
- `app/Repositories/Eloquent/LmsUjianRepository.php` — `autoSubmitExpiredSessions()`, `gradeAndFinalize()`, finalize idempotent, `abs()` durasi, `getHasilUjian` status `timeout`.
- `app/Console/Commands/CbtAutoTimeout.php` — baru (command scheduler).
- `routes/console.php` — `Schedule::command('cbt:auto-timeout')->everyMinute()`.
- Tests: `ChatAccessScopeTest.php`, `NotificationApiScopeTest.php`, `CbtAutoTimeoutTest.php`,
  `SchoolInformationVisibilityTest.php` (baru);
  `NotificationApiTest.php`, `NotificationDualSchemaWriteTest.php` (fixture diperbaiki).

Frontend:
- `src/layouts/DashboardLayout.jsx` — hapus mock; bell real (list/unread/mark-read/mark-all + state loading/error/empty).
- `src/services/reportService.js` — endpoint notifikasi (sudah ada sejak S10; dipakai bell).

Docs: seluruh file `SESSION_12_*` + `NOTIFICATION_SOURCE_OF_TRUTH.md`, `NOTIFICATION_API_CONTRACT.md`,
`CHAT_ROLE_SCOPE_MATRIX.md`, `CHAT_SECURITY_TEST_REPORT.md`, `INFORMASI_SEKOLAH_VERIFICATION.md`,
`CBT_TIMEOUT_SCHEDULER_FLOW.md`, `CBT_TIMEOUT_TEST_REPORT.md`, update `BUG_FIX_LOG.md`, `REMAINING_ISSUES.md`.

## 6. SISA ISU (NON-BLOCKING)

Terperinci di `REMAINING_ISSUES.md` Sesi 12. Ringkas:
- PG 17 runtime verification PENDING (catatan lingkungan).
- Absensi pegawai pada skema partitioned `attendances` di PG (pra-eksisting sejak S10) — rekomendasi rekonsiliasi DDL.
- Belum ada automated test frontend (lint/build hijau; perilaku perlu smoke manual).
- Penulisan notifikasi memakai satu jalur `Notification::deliver()` (source of truth); sistem
  Events/Listeners penuh di luar scope (dokumentasi §3 NOTIFICATION_SOURCE_OF_TRUTH.md).

## 7. MANUAL ACCEPTANCE (FRONTEND — WAJIB DI LOKAL/STAGING)

1. Login staf → klik lonceng → drawer menampilkan notifikasi **data real** (bukan mock); badge jumlah
   belum dibaca; tombol "Tandai semua dibaca" mengecilkan badge; klik item menandai satu per satu.
2. Login guru → chat hanya menampilkan siswa yang diajar (wali kelas/jadwal aktif); siswa kelas lain 404/403.
3. Login orang tua/siswa → chat hanya menampilkan wali kelas + guru mapel aktif; guru lain tidak muncul.
4. Login pegawai → direktori chat hanya menampilkan pegawai **unit yang sama**; kirim ke non-pegawai ditolak.
5. CBT: biarkan sesi lewat batas waktu → jalankan `php artisan cbt:auto-timeout` → status sesi menjadi
   `timeout`, objektif ternilai, esai pending review, hasil tampil sebagai timeout.
6. Scheduler: verifikasi `cbt:auto-timeout` terdaftar di `php artisan schedule:list`.
7. Lint/build hijau: `npm run lint` (0 error), `npm run build` (success).

## 8. REKOMENDASI SEBELUM PRODUKSI

- Jalankan full suite + migrasi di PG 17.
- Jalankan `php artisan migrate` di deploy (tidak ada migrasi baru S12, tetapi pastikan skema S11 terpasang).
- `php artisan schedule:work` (atau cron `* * * * * php artisan schedule:run`) agar auto-timeout berjalan.
- Smoke test manual §7 di staging.
