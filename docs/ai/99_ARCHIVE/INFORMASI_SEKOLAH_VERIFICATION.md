# INFORMASI SEKOLAH — VERIFIKASI VISIBILITAS & TARGETING (SESI 12)

Dokumen ini memverifikasi modul "Informasi Sekolah" di portal siswa & orang tua terhadap persyaratan
Sesi 12: draft tidak tampil, publish tampil, expired tidak tampil, target unit/role/kelas benar,
scope portal benar, dan read receipt benar.

## 1. Kontrak Endpoint

| Endpoint | Metode | Controller |
|---|---|---|
| `/api/portal/school-information` | GET | `StudentParentPortalController::schoolInformation` |
| `/api/portal/school-information/summary` | GET | `StudentParentPortalController::schoolInformationSummary` |
| `/api/portal/school-information/{id}/state` | PATCH | `updateSchoolInformationState` (read/bookmark/unbookmark/acknowledge) |
| `/api/portal/school-information/read-all` | PATCH | `markAllSchoolInformationRead` |

Semua endpoint child-scoped via `getStudentContext` (Siswa: identitas sendiri; Orang Tua: `child_id`/`X-Child-Id` → anak terhubung resmi; anak tidak terhubung → 404).

## 2. Rule Visibilitas (intisari `schoolInformationQuery`)

```php
PengumumanSekolah::query()
    ->where('status_aktif', true)                       // DRAFT tidak tampil
    ->where('mulai_tampil', '<=', now())                // belum mulai tidak tampil
    ->whereNull('selesai_tampil')->orWhere('selesai_tampil', '>=', now())  // EXPIRED tidak tampil
    ->target_peran: null ATAU JSON contains role user    // TARGET ROLE (JSONB)
    ->data_tambahan->education_unit_id: null ATAU is_public=true ATAU IN unit siswa   // TARGET UNIT
    ->data_tambahan->class_id: null ATAU IN kelas siswa  // TARGET KELAS
```

| SYARAT | HASIL |
|---|---|
| `status_aktif=false` (draft) | TIDAK tampil |
| `status_aktif=true`, mulai <= now, belum selesai (publish) | TAMPIL |
| `mulai_tampil > now` | TIDAK tampil |
| `selesai_tampil < now` | TIDAK tampil |
| `target_peran = ['Guru']` dibuka oleh Siswa | TIDAK tampil |
| `target_peran = null` atau memuat role pengguna | TAMPIL |
| `data_tambahan.education_unit_id` = unit lain | TIDAK tampil |
| `data_tambahan.education_unit_id` = unit siswa | TAMPIL |
| `data_tambahan.is_public = true` (unit lain) | TAMPIL |
| `data_tambahan.class_id` = kelas lain | TIDAK tampil |
| `data_tambahan.class_id` = kelas siswa | TAMPIL |
| Orang Tua membuka item ditargetkan `['Orang Tua']` | TAMPIL |
| Siswa membuka item ditargetkan `['Orang Tua']` | TIDAK tampil |
| Orang Tua memilih anak tidak terhubung | 404 (fail-closed) |

## 3. Read Receipt

Status `read`/`bookmark`/`acknowledge` disimpan per-user di `users.metadata.portal_school_information`
(per item `id` → timestamp). `mapSchoolInformation` memetakan ke `is_read`/`is_bookmarked`/
`acknowledged_at`; `summary.unread_count` = jumlah item belum dibaca. State hanya dapat diubah untuk
item yang lolos `schoolInformationQuery` (scope anak) → tidak bisa menandai milik anak lain.

## 4. Catatan Skema (penting untuk fixture/operasional)

- Kolom unit siswa yang dipakai query adalah `students.unit_id` (ditambahkan
  `2026_07_27_100011`); **bukan** `education_unit_id` (kolom tersebut tidak ada di tabel `students`,
  atribut `education_unit_id` pada model selalu null — fallback `unit_id` sudah menangani).
- Kolom kelas siswa: `class_id` (core) / `kelas_id` (relasi `tbl_kelas`, `2026_08_01_000001`).
- `target_peran` & `data_tambahan` = `jsonb` di PostgreSQL → query `->`/`->>`/`whereJsonContains` tervalidasi.

## 5. Test — `SchoolInformationVisibilityTest` (11 test / 24 assertion)

| Test | Verifikasi |
|---|---|
| `published_and_active_information_is_visible` | Publish tampil |
| `draft_is_not_visible` | Draft (`status_aktif=false`) tidak tampil |
| `not_yet_started_is_not_visible` | `mulai_tampil` di masa depan tidak tampil |
| `expired_is_not_visible` | `selesai_tampil` lewat tidak tampil |
| `role_targeting_is_enforced` | Target role Guru/Umum/Siswa terhadap pengguna Siswa |
| `unit_targeting_is_enforced` | Unit lain tidak tampil; unit sendiri tampil; `is_public` tampil |
| `class_targeting_is_enforced` | Kelas lain tidak tampil; kelas sendiri tampil |
| `parent_portal_sees_linked_child_scope_information` | Orang tua (child-linked) melihat item target Orang Tua |
| `student_does_not_sees_parent_targeted_information` | Siswa tidak melihat item target Orang Tua |
| `parent_cannot_read_information_for_unlinked_child` | Anak tidak terhubung → 404 |
| `read_receipt_tracks_read_state_and_unread_count` | Mark-read menurunkan `unread_count` dan `is_read=true` |

**Hasil:** lulus 11/24 di **SQLite** dan **PostgreSQL 14** (bagian guard group S12: 64 passed / 249 assertions di PG) →
kompatibilitas JSONB query terbukti di runtime, bukan sekadar baca kode.
