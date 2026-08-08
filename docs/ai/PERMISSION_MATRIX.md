# PERMISSION MATRIX

Source of truth: PostgreSQL `permissions`, `role_has_permissions`, `model_has_roles`, dan `model_has_permissions` melalui Spatie Permission.

## Kontrak minimum

Seluruh 26 permission yang diminta tersedia: `dashboard.view`, `dashboard.manage`, `master.view`, `master.create`, `master.update`, `master.delete`, `academic.view`, `academic.manage`, `attendance.view`, `attendance.manage`, `lms.view`, `lms.manage`, `cbt.manage`, `grades.manage`, `report.view`, `report.export`, `portal.view`, `approval.manage`, `notification.manage`, `chat.manage`, `setting.manage`, `user.manage`, `permission.manage`, `role.manage`, `audit.view`, dan `activity.view`.

| Keluarga role | View | Manage | Report/Audit | Portal | Scope |
|---|---:|---:|---:|---:|---|
| Super Admin | Semua | Semua | Semua | Ya | Global |
| Yayasan | Dashboard/master/akademik | Sesuai workflow existing | Export + audit | Ya | Cross-unit read |
| Bidang/divisi | Dashboard/master/akademik/attendance/LMS | Akademik sesuai jabatan | Report + audit | Ya | Cross-unit/unit |
| Pimpinan sekolah | Dashboard/master/akademik/attendance/LMS | Akademik, approval, notification | Report + audit | Ya | Unit |
| TU/Operator | Master/akademik/attendance/LMS | CRUD operasional | Sesuai permission granular | Ya | Unit |
| Guru/Wali/Musyrif/BK | Akademik/attendance/LMS sendiri | Penugasan sendiri | Sesuai permission granular | Ya | Assignment |
| Orang Tua/Siswa/Alumni | Portal milik sendiri | Tidak diberi manage global | Export sesuai kontrak role | Ya | Linked/self |

Runtime PostgreSQL berisi **345 permission**. Permission granular lama tidak dihapus sehingga route, Gate, dan kontrak frontend tetap kompatibel.

