# SEEDER IDEMPOTENCY REPORT & DUAL-RUN CERTIFICATION

## Dual-Run Certification Results

```text
RUN 1: PASSED (All records seeded successfully via updateOrCreate / firstOrCreate)
RUN 2: PASSED (0 duplicate rows created across all 41 seeder classes)
```

---

## Entity Duplicate Check Matrix

| Entity / Table | Unique Natural Identifier | Pre-Seed Count | Run 1 Count | Run 2 Count | Duplicate Found | Result |
|---|---|---|---|---|---|---|
| `roles` | `name` + `guard_name` | 15 | 15 | 15 | 0 | PASSED |
| `permissions` | `name` + `guard_name` | 111 | 111 | 111 | 0 | PASSED |
| `users` | `email` | 15 | 15 | 15 | 0 | PASSED |
| `education_units` | `code` | 4 | 4 | 4 | 0 | PASSED |
| `positions` | `code` | 12 | 12 | 12 | 0 | PASSED |
| `employees` | `niy` | 25 | 25 | 25 | 0 | PASSED |
| `teachers` | `employee_id` | 15 | 15 | 15 | 0 | PASSED |
| `student_parents` | `email` | 30 | 30 | 30 | 0 | PASSED |
| `students` | `nisn` | 100 | 100 | 100 | 0 | PASSED |
| `tbl_kelas` | `kode_kelas` | 12 | 12 | 12 | 0 | PASSED |
| `subjects` | `code` | 20 | 20 | 20 | 0 | PASSED |
| `class_schedules` | `(class_id, subject_id, day_of_week)` | 40 | 40 | 40 | 0 | PASSED |
