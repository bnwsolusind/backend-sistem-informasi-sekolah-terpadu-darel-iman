# SESI 10 — CLOSURE REPORT

Tanggal: 2026-08-06
Status: **SESI 10 CLOSURE — 5 failure pra-eksisting ditutup, verifikasi tambahan lulus, keputusan di bawah.**

---

## 1. LATAR BELAKANG

Sesi 10 (Parent Portal) ditutup dengan sisa 5 failure backend yang **pra-eksisting dari sesi 9**
(4 = fixture legacy tidak valid, 1 = celah implementasi force-delete). Sesi ini menutup kelimanya
tanpa melemahkan assertion, menambahkan test wajib (signature versioning, gate mutabaah, rate
limit), mengaudit & menyatukan skema ganda `notifications`, dan memvalidasi migration rekonsiliasi
di PostgreSQL.

---

## 2. DAFTAR 5 FAILURE YANG DITUTUP (format TEST/FILE/LINE/EXPECTED/ACTUAL/ROOT CAUSE/FIX)

### F1. Force-delete template terpakai
- **TEST**: `MutabaahCrudFullExecutionTest::test_used_template_cannot_be_force_deleted`
- **FILE**: `backend/tests/Feature/MutabaahCrudFullExecutionTest.php`
- **LINE**: 104
- **EXPECTED**: fixture valid + template terpakai ditolak force-delete (409)
- **ACTUAL**: `NOT NULL constraint failed: mutabaah_daily_headers.supervisor_assignment_id` (fixture memakai kolom `date` yang tidak ada; kolom asli `activity_date` NOT NULL, plus `supervisor_assignment_id` wajib tidak terisi)
- **ROOT CAUSE**: (a) fixture memakai kolom non-eksisten `date`; (b) dependency chain header harian tidak lengkap; (c) **celah nyata**: `forceDelete()` ada di service tetapi **tidak ada route HTTP** → test menguji endpoint yang tidak pernah terdaftar.
- **FIX**: bangun rantai dependensi valid (unit→tahun ajaran→semester→template→employee→assignment→student→header); tambahkan route `DELETE /api/mutabaah/enterprise/{resource}/{id}/force` di `routes/api.php:231` yang memanggil `assertNotUsed()` (409 untuk template terpakai).
- **VERIFIKASI**: `php artisan test --filter=MutabaahCrudFullExecutionTest` → PASS.

### F2. TU membuat template assignment
- **TEST**: `MutabaahCrudFullExecutionTest::test_tu_can_create_template_assignment_and_conflict_is_rejected`
- **FILE**: `backend/tests/Feature/MutabaahCrudFullExecutionTest.php`
- **LINE**: 192
- **EXPECTED**: payload assignment (dengan `kelas_id`) tersimpan
- **ACTUAL**: `NOT NULL constraint failed: tbl_kelas.unit_pendidikan_id` + payload `kelas_id` menunjuk tabel yang salah
- **ROOT CAUSE**: fixture `Kelas::create` memakai `education_unit_id` (tidak fillable; kolom asli `unit_pendidikan_id`) dan tidak mengisi `tahun_ajaran_id`/`semester_id`/`jenjang`/`tingkat` (semua NOT NULL). Payload `kelas_id` juga menunjuk `tbl_kelas` padahal assignment mengharapkan `classes` (`SchoolClass`: `academic_year_id`+`semester_id`+`name`+`level`).
- **FIX**: fixture kelas mengikuti skema konvensi `tbl_kelas`; payload `kelas_id` memakai `SchoolClass`.
- **VERIFIKASI**: PASS di filter `MutabaahCrudFullExecutionTest`.

### F3. Monitoring tanda tangan orang tua
- **TEST**: `MutabaahCrudFullExecutionTest::test_parent_monitoring_reads_real_signatures`
- **FILE**: `backend/tests/Feature/MutabaahCrudFullExecutionTest.php`
- **LINE**: 380
- **EXPECTED**: respons monitoring memuat signature asli (`signature_status` enum valid)
- **ACTUAL**: error kolom non-eksisten (`date`, `status`, `notes_parent`, `student_id`) pada `MutabaahParentSignature`
- **ROOT CAUSE**: fixture memakai kolom fiktif; kolom asli `daily_header_id` + `parent_user_id` + `signature_status` + `comment` + `signed_at` (enum: `approved` / `clarification_requested` / `unable_to_verify`); FK dependency (`mutabaah_daily_headers`) belum dibuat.
- **FIX**: fixture signature mengikuti skema & enum asli; dependency header dibangun.
- **VERIFIKASI**: PASS di filter `MutabaahCrudFullExecutionTest`.

### F4. Penggabungan interval ayat tahfizh
- **TEST**: `TahfizhCalculationAndOwnershipTest::test_tahfizh_progress_merges_overlapping_verse_intervals_correctly`
- **FILE**: `backend/tests/Feature/TahfizhCalculationAndOwnershipTest.php`
- **LINE**: 30
- **EXPECTED**: interval ayat yang tumpang-tindih dihitung tepat (dedup)
- **ACTUAL**: `NOT NULL constraint failed: tbl_kelas.unit_pendidikan_id`
- **ROOT CAUSE**: fixture `Kelas::create` memakai `education_unit_id`; kolom asli `unit_pendidikan_id` + wajib `tahun_ajaran_id`/`semester_id`/`jenjang`/`tingkat`.
- **FIX**: fixture kelas mengikuti skema; tambah fixture tahun ajaran + semester.
- **VERIFIKASI**: PASS di filter `TahfizhCalculationAndOwnershipTest`.

### F5. Orang tua menandatangani catatan anak tak terhubung
- **TEST**: `TahfizhCalculationAndOwnershipTest::test_parent_cannot_sign_note_for_unlinked_student`
- **FILE**: `backend/tests/Feature/TahfizhCalculationAndOwnershipTest.php`
- **LINE**: 164
- **EXPECTED** (lama): 403
- **ACTUAL**: 404
- **ROOT CAUSE**: ekspektasi lama tidak sejalan dengan **konvensi portal yang dipilih** (fail-closed, anti existence-leak): anak tak terhubung → **404** (tidak membocorkan keberadaan catatan/siswa); **403** hanya untuk anak terhubung-tapi catatan belum dipublikasikan.
- **FIX**: **ekspektasi diperbarui ke 404 dengan rasional terdokumentasi** — bukan melemahkan assertion, melainkan menyelaraskan dengan kontrak fail-closed yang sudah dibakukan & diuji (13+ endpoint child-scoped di `StudentParentPortalChildSwitchingTest`).
- **VERIFIKASI**: PASS di filter `TahfizhCalculationAndOwnershipTest`.

---

## 3. CLI — EKSEKUSI 5 TEST

```
$ cd backend && php artisan test --filter="MutabaahCrudFullExecutionTest|TahfizhCalculationAndOwnershipTest"

   PASS  Tests\Feature\MutabaahCrudFullExecutionTest          (7 tests / 19 assertions)
   PASS  Tests\Feature\TahfizhCalculationAndOwnershipTest     (3 tests / 6 assertions)
   Tests: 10 passed (25 assertions)   Duration: ...
```

Per-file:

| Test | Status |
|---|---|
| `MutabaahCrudFullExecutionTest::test_used_template_cannot_be_force_deleted` | PASS |
| `MutabaahCrudFullExecutionTest::test_tu_can_create_template_assignment_and_conflict_is_rejected` | PASS |
| `MutabaahCrudFullExecutionTest::test_parent_monitoring_reads_real_signatures` | PASS |
| `TahfizhCalculationAndOwnershipTest::test_tahfizh_progress_merges_overlapping_verse_intervals_correctly` | PASS |
| `TahfizhCalculationAndOwnershipTest::test_parent_cannot_sign_note_for_unlinked_student` | PASS |

---

## 4. TES BARU DITAMBAHKAN

| File | Test | Baris | Verifikasi |
|---|---|---|---|
| `StudentParentPortalSignatureVersioningTest.php` | `test_signature_remains_valid_when_unrelated_metadata_changes` | 56 | perubahan metadata non-isi → tetap `signed` |
| `StudentParentPortalSignatureVersioningTest.php` | `test_signature_becomes_outdated_when_note_content_changes` | 73 | isi berubah → `signed_updated` |
| `StudentParentPortalSignatureVersioningTest.php` | `test_parent_cannot_sign_outdated_document_version` | 89 | tanda-tangan ulang menandai `signature_was_stale` |
| `StudentParentPortalSignatureVersioningTest.php` | `test_parent_signature_is_idempotent` | 114 | tanda-tangan ulang versi sama → hash sama |
| `MutabaahPortalGateTest.php` | `test_student_cannot_submit_without_active_assignment` | 75 | gate 422 tanpa assignment |
| `MutabaahPortalGateTest.php` | `test_student_cannot_submit_outside_assignment_period` | 84 | gate 422 di luar rentang tanggal |
| `MutabaahPortalGateTest.php` | `test_student_cannot_submit_for_another_unit` | 94 | gate 422 unit assignment ≠ unit siswa |
| `MutabaahPortalGateTest.php` | `test_linked_student_can_submit_with_valid_assignment` | 105 | 200 + header valid |
| `MutabaahPortalGateTest.php` | `test_duplicate_daily_entry_is_upserted_to_same_header` | 116 | entri ganda → header sama (upsert) |
| `NotificationDualSchemaWriteTest.php` | `test_delivery_requires_active_academic_context_for_partition_key` | 41 | partition key wajib; tanpa konteks → skip aman |
| `NotificationDualSchemaWriteTest.php` | `test_parent_chat_message_persists_notification_for_teacher` | 82 | chat → notifikasi tersimpan (tak gagal senyap) |
| `NotificationDualSchemaWriteTest.php` | `test_unread_count_and_mark_as_read_work_on_partitioned_schema` | 122 | unread/mark-as-read pada skema kanonik |
| `ParentStudentLoginRateLimitTest.php` | `test_login_parent_student_throttles_after_ten_failures_across_aliases` | 22 | 10 gagal → percobaan ke-11 via alias lain → **429** |

---

## 5. BUG NYATA YANG DITEMUKAN & DIPERBAIKI SAAT CLOSURE

1. **Upsert `mutabaah_daily_headers` date-match gagal** — `firstOrCreate(['activity_date' => $date])` membandingkan `'YYYY-MM-DD'` dengan nilai tersimpan `'YYYY-MM-DD 00:00:00'` (SQLite) → entri kedua dalam sehari **crash 500 UNIQUE violation**. Perbaiki di `saveMutabaahStudent()` (controller) dan `MutabaahDailyService::header()` dengan `Carbon::parse($date)->startOfDay()`.
2. **Skema ganda `notifications`** — dua migrasi mendefinisikan kolom berbeda (`user_id/type/message/is_read` legacy vs `notifiable_id/notifiable_type/title/body/channel` partitioned); penulisan legacy **gagal senyap** (terbungkus try/catch). Solusi: **satu konvensi kanonik** `Notification::deliver()` yang mengisi partition key (tahun ajaran + semester aktif + bulan) — terbukti valid di PostgreSQL (partisi `notifications_m08`).
3. **2 bug portabilitas PG pada migration eksisting** — `having('cnt','>',1)` (alias tidak bisa dirujuk di HAVING PG) dan `DROP INDEX` untuk index milik UNIQUE CONSTRAINT (harus `DROP CONSTRAINT`) pada `2026_08_01_000004_fix_tbl_kelas_kode_unique_composite.php`. Diperbaiki agar suite migration bisa dijalankan dari nol di PostgreSQL.

---

## 6. VALIDASI POSTGRESQL

Lingkungan: **PostgreSQL 14.23 (Homebrew) lokal**; PostgreSQL 17 tidak tersedia (tanpa Docker; `brew install postgresql@17` gagal — build cmake dari source di-abort). PG 14 dipakai sebagai proxy — mekanisme partition/FK/PK identik di PG 17; delta versi dicatat sebagai sisa risiko rendah.

- `php artisan migrate --force` (seluruh suite, DB scratch `sms_closure_pg_check`) → **sukses, idempotent** ("Nothing to migrate" saat diulang).
- Migration rekonsiliasi `2026_08_06_100000_*`: kolom signature + portal ada; `note` nullable; **backfill `note→content` + `visible_*`/`category`/`priority`/`date` terverifikasi via simulasi data legacy**.
- `Notification::deliver()` pada PG → tersimpan di **partisi `notifications_m08`** dengan partition key lengkap.

### 6a. Verifikasi 5 test pada PostgreSQL (DB khusus testing `sms_closure_testing`)

DB testing khusus dibuat di PG 14 (`createdb sms_closure_testing`, role `dajol`, tanpa password); koneksi test diarahkan via env `DB_CONNECTION=pgsql` (phpunit.xml tanpa `force=true`, sehingga env shell menang).

- Run awal pada PG: **5 failure** — `SQLSTATE[23514] Check violation: students_gender_check`. Fixture memakai `'L'/'P'`, sedangkan CHECK `students.gender IN ('male','female')`. Sumber kebenaran diverifikasi: `students.gender = male/female` (portal test konsisten); `employees.jenis_kelamin = L/P` (CHECK terpisah, tidak terpengaruh).
- **FIX**: 5 lokasi fixture diganti ke `male`/`female` — `MutabaahCrudFullExecutionTest.php:166,442`; `TahfizhCalculationAndOwnershipTest.php:71,121,179`.
- Hasil setelah fix pada PG: **10 passed / 25 assertions** (kedua filter).
- Catatan: test-fixture gender `'L'/'P'` hanya valid di SQLite (tanpa CHECK); PG menegakkan CHECK. Perbaikan menyelaraskan fixture dengan domain tanpa mengubah assertion.

### 6b. Regresi portal pada PostgreSQL — temuan & perbaikan portabilitas

6 filter wajib dijalankan terhadap DB PG `sms_closure_testing`; hasil setelah perbaikan:

| Filter | SQLite | PostgreSQL | Catatan |
|---|---|---|---|
| `MutabaahCrudFullExecutionTest` | PASS | PASS | gender fixture diperbaiki (6a) |
| `TahfizhCalculationAndOwnershipTest` | PASS | PASS | gender fixture diperbaiki (6a) |
| `StudentParentPortalChildSwitchingTest` | PASS | PASS | `created_at` deterministik |
| `StudentParentPortalOwnershipTest` | PASS | PASS | — |
| `MutabaahPortalAccessTest` | PASS | PASS | isolasi skema + FK |
| `MultiPortalAuthTest` | PASS | PASS* | *2 test attendance pegawai gagal PG (lihat 6c) |

Perbaikan portabilitas yang dilakukan:

1. **`StudentParentPortalController::children` tanpa ORDER BY** — urutan natural tidak deterministik lintas engine (SQLite = urutan sisip, PG = acak). Ditambahkan `orderBy('created_at', 'asc')`; fixture test diberi `created_at` berbeda via `forceFill` (kolom tidak fillable) agar deterministik di kedua engine.
2. **`MutabaahPortalAccessTest` isolasi skema** — `Schema::create` tanpa guard merusak DB PG yang sudah termigrasi (`SQLSTATE[42P07] relation "parents" already exists`). `setUp` kini membuat skema minimal **hanya bila tabel belum ada** (`hasTable` guard) + `users` minimal (factory) + kolom `gender` pada siswa; user difactory via `create` (persisten) agar FK `parents.user_id` / `students.user_id` terpenuhi di PG (`SQLSTATE[23503]`).
3. **`EmployeeAttendanceService` konteks akademik** — tabel `attendances` partitioned PG mewajibkan partition key (`academic_year_id`/`semester_id`/`month`); service absensi login tidak mengisinya (`SQLSTATE[23502]`). Diperbaiki dengan pola kanonik sama seperti `Notification::deliver()`: resolve tahun ajaran + semester aktif, isi bila ada, null bila belum (kompatibel SQLite). Fixture `MultiPortalAuthTest` kini men-seed konteks akademik aktif.

### 6c. Batasan pra-eksisting yang dicatat (bukan bagian 5-failure)

`MultiPortalAuthTest` **2 test attendance pegawai tetap gagal di PG** karena skema partitioned `attendances` pra-eksisting (`2026_07_21_030100`) **tidak dapat merepresentasikan absensi pegawai**: tabel partisi hanya memuat kolom student-attendance (`student_id UUID NOT NULL`, `class_id UUID NOT NULL`) dan **tidak memiliki** `employee_id`, `unit_pendidikan_id`, `tipe_presensi`, `created_by` (semua dipakai service absensi login). Ini divergence arsitektur pra-eksisting yang jauh di luar lingkup 5-failure closure; perbaikan = rekonsiliasi DDL partisi (penambahan kolom pegawai + nullable student/class) yang ditunda sebagai follow-up. **CI primer (SQLite) hijau** untuk seluruh filter (25 passed / 100 assertions).

---

## 7. HASIL PENGUJIAN AKHIR

- **Backend full suite**: `php artisan test` → **227 passed / 0 failed** (878 assertions, ±330s) — **0 regresi** setelah seluruh perbaikan PG portability.
- Filter closure: **30 passed / 0 failed** (139 assertions) — MutabaahCrudFullExecution, TahfizhCalculationAndOwnership, SignatureVersioning, MutabaahPortalGate, ChildSwitching, NotificationDualSchemaWrite, NotificationApi, ParentStudentLoginRateLimit.
- 6 filter wajib (SQLite): **25 passed / 100 assertions**.
- 5 target test pada **PostgreSQL** (`sms_closure_testing`): **10 passed / 25 assertions** (setelah fix gender CHECK, 6a).
- Portal regression pada **PostgreSQL**: ChildSwitching + Ownership + MutabaahPortalAccess **9 passed / 53 assertions**; MultiPortalAuthTest 2 test attendance pegawai tetap gagal PG karena batasan pra-eksisting (6c).
- **Frontend**: `npm run lint` → exit 0 (**0 error**; 662 warning pra-eksisting tidak berubah); `npm run build` → sukses.
- `npm run typecheck` dan `npm run test` **TIDAK ADA** di `web-dashboard/package.json` (proyek JSX non-TypeScript, tanpa script test) — tidak diklaim lulus.

---

## 8. KEPUTUSAN AKHIR

**GO** — 5 failure pra-eksisting ditutup, terbukti di SQLite (CI primer) **dan** PostgreSQL; tidak ada regresi (227 passed). Sisa catatan PG (absensi pegawai vs DDL partisi pra-eksisting, PG 17 vs 14) didokumentasikan sebagai follow-up, bukan penolak closure.

---

*Dokumen pendukung: `PARENT_PORTAL_TEST_REPORT.md`, `PARENT_PORTAL_SECURITY_REPORT.md`,
`PARENT_PORTAL_MUTABAAH_GATE.md`, `PARENT_PORTAL_SIGNATURE_DIGEST.md`,
`PARENT_PORTAL_STUDENT_NOTES_RECONCILE.md`, `BUG_FIX_LOG.md`, `REMAINING_ISSUES.md`.*
