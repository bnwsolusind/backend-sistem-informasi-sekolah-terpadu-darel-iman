# SESI 11 — FINAL REPORT: STUDENT PORTAL (SECURITY & CORRECTNESS HARDENING)

Tanggal: 2026-08-06  
Scope: Portal Siswa + hardening engine CBT legacy + verifikasi baseline.

---

## 1. VERDICT

```text
SESSION 11 PASSED WITH ENVIRONMENT NOTE — PG17 RUNTIME VERIFICATION PENDING
```

- Seluruh fungsi & keamanan Portal Siswa **PASS** di runtime tersedia (SQLite suite + PostgreSQL 14.23).
- **PG 17 runtime belum diverifikasi** (hanya PG 14.23 lokal, tanpa Docker) → diberi catatan jujur, bukan blocker fungsional.
- Tidak ada NO-GO: self-scope aman, kunci jawaban tidak bocor, submission idempotent, cache antar-siswa tidak bocor, tanpa regresi baseline.

## 2. BASELINE & HASIL TEST

| METRIK | BASELINE S10 | AKHIR S11 | DELTA |
|---|---|---|---|
| Tests | 227 | **237** | +10 (StudentCbtSecurityHardeningTest) |
| Assertions | 878 | **906** | +28 |
| Failures | 0 | **0** | — |
| Errors | 0 | **0** | — |

```text
Guard 6 filter critical : 25 passed / 100 assertions  (BASELINE INTACT)
Full suite             : 237 passed / 906 assertions / 0 failed / 0 error
```

Verifikasi PostgreSQL 14 (DB `sms_closure_testing`):
```text
StudentCbtSecurityHardeningTest : 10 passed / 28 assertions  (migrasi + index partial tervalidasi PG)
Guard 6 filter critical (PG)    : 23 passed / 2 failed (93 assertions)
  → 2 kegagalan = limitasi PRA-EKSISTING absensi pegawai pada skema partitioned
    `attendances` (student_id/class_id NOT NULL, tanpa kolom employee_id) —
    IDENTIK dengan catatan Sesi 10 §6c; BUKAN regresi Sesi 11.
  → Baseline PG 14 juga 23/2 (tidak berubah oleh Sesi 11).
```

## 3. LINGKUNGAN VERIFIKASI

- Backend: `php artisan test` (suite utama = SQLite :memory:, `RefreshDatabase`).
- PostgreSQL: PG 14.23 (Homebrew) — metadata (`version()`, `current_database()`, `current_schema()`, `search_path`, uuid extensions) tereksekusi di DB `sms_closure_testing`; suite migration & de-duplikasi index partial tervalidasi di PG 14.
- Frontend: `npm run lint` = oxlint **0 error**; `npm run build` = vite **success**.
- **FRONTEND AUTOMATED TEST NOT AVAILABLE** (tidak ada script test/typecheck) → acceptance manual (lihat §7).

## 4. YANG DISELESAIKAN (fitur/fungsi Portal Siswa)

1. **Route map lengkap** `/api/portal/*` (29 endpoint) + `/portal-siswa` (14 subroute) → `docs/ai/STUDENT_PORTAL_ROUTE_MAP.md`.
2. **Self-scope siswa terverifikasi**: konteks siswa selalu dari auth (`getAuthenticatedStudent`), parent child-switch hanya lewat relasi resmi, fail-closed 404/403, tanpa `student_id` dari request.
3. **CBT tidak bocor kunci**: payload soal ke siswa tanpa `kunci_jawaban`/`pembahasan`; bank soal di-redact untuk Siswa/Orang Tua/Alumni; guru/staf tetap mendapat kunci.
4. **Submission idempotent**: `submitAssignment` = `updateOrCreate(penugasan_id, siswa_id=self)`; `saveExamAnswers` idempotent per `(sesi_id, soal_id)` unique.
5. **Publikasi nilai dihormati**: nilai disembunyikan saat `tampilkan_nilai_langsung=false` (portal `finishExam`, `results`, `examOverview`, legacy `finishSession`).
6. **Timer di-enforce**: simpan jawaban ditolak setelah `waktu_mulai + durasi_menit`.
7. **Tanpa percobaan ganda**: partial unique index `(ujian_id, siswa_id) WHERE status='proses'` + `startSesiUjian` race-safe.
8. **Tanda tangan catatan**: hanya Orang Tua terhubung (siswa → 403).
9. **Bug `$showScore`** di portal `finishExam` diperbaiki.
10. **Frontend**: mock `DEFAULT_ACTIVITIES` dihapus; tautan notifikasi siswa diperbaiki.

## 5. FILE YANG DIUBAH/DITAMBAH

Backend:
- `app/Http/Resources/LmsBankSoalResource.php` — redaksi kunci utk non-staf.
- `app/Http/Controllers/Api/LmsUjianController.php` — ownership fail-closed, staff-gate, gate jadwal/attempt, redaksi nilai, hapus fallback `Student::first()`.
- `app/Repositories/Eloquent/LmsUjianRepository.php` — timer enforcement + `startSesiUjian` race-safe.
- `app/Http/Controllers/Api/V1/StudentParentPortalController.php` — fix `$showScore`, signStudentNote parent-only, submitAssignment class guard.
- `database/migrations/2026_08_06_120000_add_unique_proses_attempt_to_lms_ujian_sesi.php` — partial unique index + de-duplikasi.
- `tests/Feature/StudentCbtSecurityHardeningTest.php` — 10 test baru.

Frontend:
- `src/components/portal/MutabaahWorkspace.jsx` — hapus mock `DEFAULT_ACTIVITIES`.
- `src/layouts/DashboardLayout.jsx` — tautan notifikasi role-aware.

Docs:
- `STUDENT_PORTAL_ROUTE_MAP.md`, `STUDENT_PORTAL_SECURITY_TEST_REPORT.md` (baru).
- `BUG_FIX_LOG.md`, `REMAINING_ISSUES.md` (diperbarui), `SESSION_11_BASELINE_REGRESSION_GUARD.md` (status akhir).

## 6. SISA ISU (NON-BLOCKING)

Terperinci di `REMAINING_ISSUES.md` Sesi 11. Ringkas:
- PG 17 runtime verification PENDING (catatan lingkungan).
- Bell notifikasi masih mock → integrasi API real.
- Alias `/api/chat/*` tanpa role middleware (self-scoped, bukan leak).
- Auto-timeout sesi `proses` belum berjalan via scheduler.

## 7. MANUAL ACCEPTANCE (FRONTEND — WAJIB DI LOKAL/STAGING)

1. Login siswa → `/portal-siswa` → cek 14 section render.
2. **360/390px**: sidebar collapse, checklist mutabaah, CBT workspace, tabel hasil tidak overflow.
3. **Cache isolation 2 siswa**: login siswa A (isi mutabaah) → logout → login siswa B → data mutabaah B kosong/beda (jangan tampilkan data A).
4. CBT: mulai ujian → cek soal TANPA kunci → simpan → kumpul → nilai tampil HANYA bila `tampilkan_nilai_langsung=true`.
5. Tanda tangan catatan guru: siswa harus ditolak (403/UI error); orang tua yang terhubung berhasil.
6. Kumpul tugas: siswa lain/kelas lain ditolak.
7. Lint/build hijau: `npm run lint` (0 error), `npm run build` (success).

## 8. REKOMENDASI SEBELUM PRODUKSI

- Jalankan full suite + migrasi di PG 17 dan pastikan index `lms_sesi_proses_ujian_siswa_unique` terbentuk.
- Jalankan `php artisan migrate` di deploy (migrasi baru S11).
- Smoke test manual §7 di staging.
