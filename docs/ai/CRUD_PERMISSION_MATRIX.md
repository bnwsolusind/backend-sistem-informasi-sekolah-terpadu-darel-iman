# CRUD PERMISSION MATRIX

## Frontend Button & Backend Authorization Mapping

Action buttons (Tambah, Edit, Delete, Restore, Approve, Publish, Import, Export) check database-driven permissions via `PermissionGuard` and Spatie permissions.

| Action Button | Required Spatie Permission | Backend Controller Gate / Policy |
| --- | --- | --- |
| **Tambah Data** | `{module}.create` (e.g. `students.create`) | `$this->authorize('create', Model::class)` |
| **Edit / Update Data** | `{module}.update` (e.g. `students.update`) | `$this->authorize('update', $model)` |
| **Hapus Data / Soft Delete** | `{module}.delete` (e.g. `students.delete`) | `$this->authorize('delete', $model)` |
| **Restore Data** | `{module}.restore` / `sistem.master_data` | `$this->authorize('restore', $model)` |
| **Approve / Verifikasi** | `{module}.approve` / `{module}.verify` | `Gate::authorize('{module}.approve')` |
| **Publish Content** | `{module}.publish` | `Gate::authorize('{module}.publish')` |
| **Import Data** | `{module}.import` | `$this->authorize('create', Model::class)` |
| **Export Data** | `{module}.export` | `Gate::authorize('{module}.export')` |
