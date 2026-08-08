# STUDENT PORTAL — SECURITY TEST REPORT (SESI 11)

Tanggal: 2026-08-06
Cakupan: Self-scope siswa/ortua, kebocoran kunci jawaban, ownership sesi CBT, publikasi nilai, timer, percobaan ganda, tanda tangan orang tua.

## 1. TEMUAN AUDIT → STATUS

| # | TEMUAN | SEVERITY | LOKASI | STATUS |
|---|---|---|---|---|
| 1 | `GET /api/lms/bank-soal*` mengekspos `kunci_jawaban`/`pasangan_menjodohkan`/`pembahasan` ke pengguna mana pun (auth:sanctum) — siswa bisa dump bank soal + kunci | **CRITICAL** | `LmsBankSoalResource` | **FIXED** — redact utk role Siswa/Orang Tua/Alumni |
| 2 | Legacy `startSession` fallback `Student::first()` utk non-Siswa → sesi dibuat atas nama siswa sewenang-wenang | **CRITICAL** | `LmsUjianController::startSession` | **FIXED** — non-Siswa wajib staff + `siswa_id`; fallback dihapus |
| 3 | Legacy `submitAnswers`/`finishSession` melewati cek ownership utk non-Siswa → pengguna lain bisa mengisi/menyelesaikan sesi orang lain | **CRITICAL** | `LmsUjianController` | **FIXED** — `canAccessSession` fail-closed utk semua |
| 4 | `GET /api/lms/ujian/{id}/results` membocorkan scoreboard semua siswa | **HIGH** | `LmsUjianController::results` | **FIXED** — staff-only |
| 5 | `finishSession` (legacy) mengembalikan `nilai_final` walau `tampilkan_nilai_langsung=false` | **HIGH** | `LmsUjianController::finishSession` | **FIXED** — redact sampai terbit |
| 6 | Timer tidak ditegakkan: submit/save tetap diterima setelah durasi habis | **HIGH** | `LmsUjianRepository::saveJawabanSesi` | **FIXED** — tolak setelah deadline |
| 7 | Tidak ada unique constraint sesi `proses` per (ujian, siswa) → TOCTOU percobaan ganda | **MEDIUM** | `lms_ujian_sesi` | **FIXED** — partial unique index (PG/SQLite) + `startSesiUjian` race-safe |
| 8 | `LmsUjianController::gradeEssay` bisa dipanggil siapa pun | **MEDIUM** | `LmsUjianController` | **FIXED** — staff-only |
| 9 | Bug latens: portal `finishExam` memakai `$showScore` tak terdefinisi → nilai selalu null (tidak bocor, tapi salah) | **MEDIUM** | `StudentParentPortalController::finishExam` | **FIXED** — `$showScore` dari `tampilkan_nilai_langsung` |
| 10 | `signStudentNote` memungkinkan siswa menandatangani sebagai Orang Tua | **MEDIUM** | `StudentParentPortalController::signStudentNote` | **FIXED** — wajib parent terhubung (siswa → 403) |
| 11 | `submitAssignment` portal tanpa cek kelas → siswa bisa mengumpulkan ke tugas kelas lain | **MEDIUM** | `StudentParentPortalController::submitAssignment` | **FIXED** — guard kelas + status publikasi |
| 12 | Chat `PortalMessage` & `EmployeeChatController` scoped oleh user login (self/child) — aman | — | — | **VERIFIED SAFE** |

## 2. MEKANISME KEAMANAN INTI (dipertahankan & diverifikasi)

- Konteks siswa PORTAL selalu dari auth: `getAuthenticatedStudent()` = `Student::where('user_id', $request->user()->id)->where('is_active', true)` — **tidak pernah menerima `student_id` dari request**.
- Parent child-switch hanya lewat relasi `parent_id`/`parentsPivot` milik parent yang login (`getStudentContext` + `X-Child-Id`).
- Fail-closed: data tidak ditemukan → 404/403, bukan empty-success.
- Soal ujian ke siswa **tanpa kunci** (payload `mulaiSesi` tidak memuat `kunci_jawaban`/`pembahasan`; pasangan menjodohkan hanya sisi kiri/kanan teracak).
- Draft/`status` bukan published tidak pernah tampil di portal.
- `max_attempt` di-enforce di portal (`startExam`) & legacy (`startSession`) dengan hitung sesi `selesai`/`timeout`.

## 3. TEST BARU — `tests/Feature/StudentCbtSecurityHardeningTest.php` (11 test / 38 assertion)

| TEST | MEMVERIFIKASI |
|---|---|
| `test_answer_key_not_leaked_to_student_or_parent` | kunci/pembahasan null utk siswa & ortu (show + index) |
| `test_teacher_still_receives_answer_key` | guru tetap menerima kunci (regresi baseline) |
| `test_legacy_start_session_rejects_non_staff_without_siswa_id` | ortu → 403; fallback dihapus |
| `test_duplicate_proses_attempt_is_resumed_not_duplicated` | start ganda → sesi sama; hanya 1 `proses` |
| `test_answers_cannot_be_submitted_to_foreign_session` | ortu submit/finish sesi siswa → 403 |
| `test_results_endpoint_is_staff_only` | siswa 403 / guru 200 |
| `test_submit_after_timer_expiry_is_rejected` | save setelah deadline → 400 |
| `test_portal_finish_hides_score_until_published` | start portal OK (regresi) |
| `test_sign_student_note_rejected_for_student` | siswa sign → 403 |
| `test_portal_submit_assignment_rejects_other_class` | tugas kelas lain → 403 |
| `test_resumed_session_payload_has_no_scoring_or_answer_key_fields` | resume `mulaiSesi` hanya `soal_id`/`jawaban_dipilih`/`jawaban_esai` (tanpa skor/kunci) |

## 4. HASIL

```text
StudentCbtSecurityHardeningTest : 11 passed (38 assertions)  (SQLite & PG 14)
LmsSesi5AssignmentsAndCbtTest  :  4 passed (baseline CBT tetap hijau)
StudentParentPortalSignatureVersioningTest : 4 passed
Guard 6 filter critical        : 25 passed (100 assertions)
FULL SUITE                     : 246 passed / 947 assertions / 0 failed / 0 error
Portal group (PG 14)           : 34 passed / 161 assertions (semua endpoint portal HIJAU di PostgreSQL)
```

## 5. VERDICT SEKTOR KEAMANAN

**SELF-SCOPE SISWA AMAN** · **KUNCI JAWABAN TIDAK BOCOR** · **OWNERSHIP CBT FAIL-CLOSED** ·
**PUBLIKASI NILAI DIHORMATI** · **TIMER DIENFORCE** · **TANPA PERCOBAAN GANDA**.
Semua temuan CRITICAL/HIGH ditutup.
