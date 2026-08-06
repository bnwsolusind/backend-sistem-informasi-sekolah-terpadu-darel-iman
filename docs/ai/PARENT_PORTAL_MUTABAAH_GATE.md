# Parent Portal — Gate Agenda Mutabaah (Save Checklist Siswa)

## 1. Masalah

`saveMutabaahStudent()` (`POST /api/portal/mutabaah`, role Siswa) sebelumnya membuat header
`mutabaah_daily_headers` dengan `firstOrCreate(['student_id','entry_date'])`. Tiga masalah:

1. **Kolom `entry_date` tidak ada** — kolom asli adalah `activity_date` → query salah kolom.
2. **NOT NULL constraint**: skema mewajibkan `supervisor_assignment_id`, `template_id`,
   `education_unit_id`, `kelas_id`, `rombel_id`, `academic_year_id`, `semester_id`.
   Insert lama pasti gagal.
3. **Tanpa gate**: siswa bisa membuat checklist meski tidak ada agenda supervisor aktif.

## 2. Perbaikan (`...Controller.php` `saveMutabaahStudent`)

```
1. Resolusi siswa dari konteks anak (getStudentContext) → null = 404.
2. Cari assignment supervisor AKTIF untuk unit siswa pada tanggal tersebut:
     MutabaahSupervisorAssignment::active()->byDate($date)
        ->where('education_unit_id', $student->unit_id ?? $student->education_unit_id)
        ->orderBy('created_at','desc')->first()
   - scope active: status = RecordStatus::Active
   - scope byDate: start_date <= $date AND (end_date IS NULL OR end_date >= $date)
   - Tidak ada → 422 "Belum ada agenda mutabaah aktif untuk siswa ini."
3. Assignment harus memiliki template → tanpa template → 422.
4. firstOrCreate header dengan kunci (student_id, activity_date, template_id) dan mengisi
   seluruh kolom wajib dari assignment; total_items = count items template.
```

Status header awal: `draft` (enum `DailyStatus`).

## 3. Model & Enum yang Terlibat

- `MutabaahSupervisorAssignment` (`app/Models/MutabaahSupervisorAssignment.php`) —
  scope `active()`, `byDate($date)`, `byUnit()`, `byAcademicYear()`, `bySemester()`, `byRombel()`.
- `MutabaahTemplate` — relasi `items()` (`MutabaahTemplateItem`, `hasMany ... orderBy sort_order`).
- `MutabaahDailyHeader` — kolom kunci `activity_date` (cast date), status `DailyStatus`.

## 4. Pengujian

`StudentParentPortalChildSwitchingTest::test_student_cannot_submit_mutabaah_without_active_assignment`:

- tanpa assignment aktif → `POST /portal/mutabaah` → **422**;
- dengan assignment aktif (status active, rentang tanggal mencakup hari ini, template terpasang)
  → **200** dan `data.student_id` = siswa yang dimaksud.

## 5. CLOSURE SESI 10 — GATE EDGE CASES & BUG UPSERT

`backend/tests/Feature/MutabaahPortalGateTest.php` (5 test, PASS) memperluas cakupan gate:

| Test | Verifikasi |
|------|-----------|
| `test_student_cannot_submit_without_active_assignment` | tanpa assignment aktif → 422 |
| `test_student_cannot_submit_outside_assignment_period` | `end_date` kemarin → di luar periode → 422 |
| `test_student_cannot_submit_for_another_unit` | assignment unit lain → 422 |
| `test_linked_student_can_submit_with_valid_assignment` | assignment valid → 200 + header benar |
| `test_duplicate_daily_entry_is_upserted_to_same_header` | entri ganda → header sama (upsert) |

**Bug nyata ditemukan & diperbaiki**: `firstOrCreate(['activity_date' => $date])` membandingkan
string `'YYYY-MM-DD'` dengan nilai tersimpan `'YYYY-MM-DD 00:00:00'` (SQLite) → entri kedua dalam
sehari gagal `UNIQUE constraint (student_id, activity_date, template_id)` → **500**.
Perbaikan: `Carbon::parse($date)->startOfDay()` pada `saveMutabaahStudent()`
(`StudentParentPortalController`) dan `MutabaahDailyService::header()` agar nilai where & insert
terserialisasi identik (juga benar di PostgreSQL).
