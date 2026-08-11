# Parent Portal — Model Kepemilikan Anak (Child Ownership)

Dokumen ini menjelaskan bagaimana Portal Orang Tua menentukan **anak mana yang boleh diakses** orang tua, dan bagaimana **konteks anak aktif** diresolusi di setiap request. Berlaku untuk sesi 10 (P0–P24 Parent Portal).

## 1. Sumber Relasi

Seorang orang tua (`parents`) dapat terhubung ke siswa melalui **dua jalur** yang setara (semua diperhitungkan):

| Jalur | Tabel | Kolom | Model |
|-------|-------|-------|-------|
| Relasi langsung | `students` | `students.parent_id` → `parents.id` | `Student` |
| Pivot | `student_parents` | `student_id` + `parent_id` | `StudentParent` |

Resolver di backend (`StudentParentPortalController::parentStudentsQuery`, `app/Http/Controllers/Api/V1/StudentParentPortalController.php:47`):

```php
Student::query()->where(function ($query) use ($parent) {
    $query->where('parent_id', $parent->id)
        ->orWhereHas('parentsPivot', fn ($pivot) => $pivot->whereKey($parent->id));
});
```

Pivot `student_parents` memiliki kolom tambahan `relationship_type`, `is_primary`, dan `metadata` untuk menandai peran wali (guardian/ayah/ibu) dan wali utama.

## 2. Resolusi Konteks Anak per Request

`getStudentContext()` (`...Controller.php:65`) menentukan siswa aktif dengan urutan prioritas:

1. **Eksplisit**: header `X-Child-Id` → query `child_id` → body `child_id`.
   - Untuk **Orang Tua**: hanya anak dari `parentStudentsQuery` (harus terhubung) + `is_active=true`. Anak tak terhubung → `null` → 404.
   - Untuk **Siswa**: `child_id` harus milik siswa yang login (via `user_id`).
2. **Implisit** (tanpa `child_id`):
   - Siswa login → siswa miliknya.
   - Orang tua → **anak pertama** dari daftar anak terhubung.

Semua endpoint child-scoped meneruskan `null` menjadi **404** (`success:false, message:'Data siswa tidak ditemukan.'`).

> Catatan perbaikan sesi 10: `dashboard()` sebelumnya mengembalikan kode **440** (typo) pada jalur yang sama — diseragamkan menjadi **404**.

## 3. Matriks Enkapsulasi per Endpoint

Semua endpoint `/api/portal/*` (kecuali `children` dan `notifications`) memakai `getStudentContext`. Endpoint child-scoped:

`profile`, `schedules`, `attendance`, `permissions` (GET/POST), `materials`, `assignments`,
`grades`, `tahfizh`, `mutabaah` (GET/POST), `student-notes`, `achievements`,
`announcements`, `school-information`, `bills`, `reports`, `exam-grids`, `results`,
`lms/exams` (overview), `lms/exams/{id}/start` (role Siswa), `lms/exam-sessions/...` (role Siswa).

Endpoint **tidak child-scoped** (berlaku untuk akun):
`children` (daftar anak), `notifications` (scoped ke user + anak yang sedang aktif).

## 4. Model Keamanan

- **Stateless**: tidak ada sesi server / cookie "anak aktif". Pemilihan anak disimpan client-side (URL `?child=`) dan **selalu divalidasi ulang** di setiap request oleh `parentStudentsQuery`.
- **Fail-closed**: anak tak terhubung tidak pernah "lolos diam-diam" — mengarah ke 404.
- **Isi data ter-scope**: seluruh query data (jadwal, kehadiran, nilai, izin, catatan guru, mutabaah, CBT) memfilter `where student_id = <anak aktif>`.

## 5. Diverifikasi oleh Pengujian

`backend/tests/Feature/StudentParentPortalChildSwitchingTest.php`:

- `test_parent_can_switch_context_between_linked_children` — switch A↔B via `?child_id=` dan `X-Child-Id`, daftar `children` hanya berisi anak terhubung.
- `test_child_scoped_endpoints_reject_unlinked_child` — 13 endpoint child-scoped → **404** untuk anak tak terhubung.
- `test_submit_permission_scopes_record_to_selected_child` — izin tersimpan ke `student_id` anak terpilih; riwayat ter-filter per anak; anak asing → 404.

`backend/tests/Feature/StudentParentPortalOwnershipTest.php` (eksisting): anak via pivot saja terdeteksi; anak tanpa relasi → 404.
