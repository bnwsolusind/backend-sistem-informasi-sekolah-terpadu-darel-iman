# Permission Dashboard Pengurus Yayasan

## Daftar Permission

- `foundation.dashboard.view`
- `foundation.unit.view`
- `foundation.employee.view`
- `foundation.teacher.view`
- `foundation.student.view`
- `foundation.student_new.view`
- `foundation.student_mutation.view`
- `foundation.graduation.view`
- `foundation.alumni.view`
- `foundation.information.view`
- `foundation.report.view`
- `foundation.report.export`

## Mapping Role

- `Ketua Yayasan`, `Yayasan`, `Super Admin`: Memiliki seluruh permission `foundation.*`.
- `sekretaris_yayasan`: Memiliki permission monitoring dan laporan.
- `bendahara_yayasan`: Memiliki permission dashboard, unit, dan laporan SDM/Siswa.
- `pengurus_yayasan`: Memiliki permission monitoring umum.
