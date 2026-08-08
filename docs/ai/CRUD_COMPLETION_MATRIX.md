# CRUD COMPLETION MATRIX

| Area | Create/Edit/Delete | Detail | Import/Export | Approval/Finalize | Feedback |
|---|---|---|---|---|---|
| Unit/Jenis Unit | Ya | Ya | Export | Delete approval | Global dialog/toast |
| Pegawai/Jabatan/Guru | Ya | Ya | Import/export | Role assignment | Global dialog/toast |
| Orang Tua/Siswa | Ya | Ya | Import/export/card | Mutation/approval | Global dialog/toast |
| Tahun/Semester/Kelas/Mapel/Kurikulum | Ya | Ya | Import/export | Activate/finalize | Global dialog/toast |
| Jadwal/Attendance | Ya | Ya | Export | Verify/correct/finalize | Notification + audit |
| LMS/CBT | Ya | Ya | Import/export | Publish/timeout/finalize | Notification + audit |
| Nilai/Rapor | Ya | Ya | PDF/Excel | Finalize/publish | Notification + audit |
| Tahfizh/Mutabaah | Ya | Ya | Import/export | Finalize/reopen/sign | Activity timeline |
| Foundation report | Read workflow | Drilldown | PDF/Excel | Read-only scope | Export notification |
| Notification/Chat | Create/update/read | Thread/detail | Attachment | Read/archive | Bell/toast/timeline |

Operasi destruktif dan state-changing memakai komponen dialog/modal global yang sudah ada; route dan payload tetap dipertahankan. Audit detail per endpoint tersedia pada `CRUD_PERMISSION_MATRIX.md`, `MODULE_DATABASE_TRACE_MATRIX.md`, dan `REPORT_EXPORT_MATRIX.md`.

