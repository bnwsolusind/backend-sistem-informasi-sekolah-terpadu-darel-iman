# CBT AUTO-TIMEOUT — TEST REPORT (SESI 12)

`tests/Feature/CbtAutoTimeoutTest.php` — 9 test / 36 assertion.

## Tujuan
Buktikan: (1) sesi lewat deadline otomatis bertransisi `timeout`; (2) sesi yang belum lewat deadline
tidak tersentuh; (3) proses idempotent; (4) objektif ternilai, esai pending, kunci tidak bocor;
(5) hasil akhir menyertakan status `timeout`; (6) bug Carbon negatif `diffInSeconds` tertutup.

## Rincian Test

| Test | Inti |
|---|---|
| `test_expired_processing_exam_is_auto_submitted` | Sesi `proses` yang lewat deadline → `autoSubmitExpiredSessions` transisi ke `timeout`, `waktu_selesai` terisi, hitungan `expired`/`submitted` benar |
| `test_timeout_job_is_idempotent` | Jalankan dua kali → run kedua tidak memproses ulang (claim atomik) |
| `test_manual_submit_and_timeout_do_not_duplicate` | `finalizeSesiUjian` + auto-timeout tidak menggandakan penilaian |
| `test_objective_answers_are_graded_once` | Jawaban objektif dinilai sekali (benar/salah/kosong, skor) — jalur ini menulis `durasi_aktual_detik` (regresi BUG-S12-02: `abs()`; gagal di PG tanpa fix) |
| `test_essay_answers_remain_pending` | Jawaban esai tetap pending review manual, tidak dinilai otomatis |
| `test_non_expired_attempt_is_not_touched` | Sesi yang belum lewat deadline tidak tersentuh (`expired=0`) |
| `test_finished_attempt_is_not_touched` | Sesi `selesai` tidak diproses ulang oleh auto-timeout |
| `test_timeout_event_does_not_expose_answer_keys` | Output tidak mengandung `kunci_jawaban` (kunci tidak bocor) |
| `test_command_reports_counts_without_soal_details` | Command `cbt:auto-timeout` melaporkan ringkasan tanpa detail soal |

## Hasil

```text
SQLite (suite) : CbtAutoTimeoutTest 9 passed / 36 assertions
PostgreSQL 14  : CbtAutoTimeoutTest 9 passed / 36 assertions  (bagian guard group 53/225)
```

## Catatan Kualitas

- Fixture memakai konteks akademik nyata (AcademicYear aktif + Semester aktif) karena penulisan
  notifikasi/CBT mengikuti pola kanonik.
- `test_objective_answers_are_graded_once` menulis `durasi_aktual_detik` (unsigned) — di PG, tanpa
  `abs()`, Carbon 3 `diffInSeconds` negatif memicu overflow; jadi seluruh suite ini menjamin
  BUG-S12-02 tidak kembali.
