# Parent Portal — Tanda Tangan Digital Catatan Guru (Signature Digest)

## 1. Model Data

Kolom tanda tangan ditambahkan oleh migration rekonsiliasi
`2026_08_06_100000_reconcile_student_notes_for_parent_portal.php` ke tabel `student_notes`:

| Kolom | Tipe | Makna |
|-------|------|-------|
| `signed_by_user_id` | uuid nullable | user orang tua yang menandatangani |
| `signed_at` | timestampTz nullable | waktu tanda tangan |
| `signature_content_hash` | string(64) nullable | SHA-256 `trim(content)` saat ditandatangani |

Model `StudentNote` (`app/Models/StudentNote.php`):
- `fillable` mencakup ketiga kolom di atas.
- Cast `signed_at` → `datetime`.
- Helper `StudentNote::contentHash(?string $content): ?string` → `sha256(trim($content))` atau `null` bila konten kosong.

## 2. Siklus Hidup Status

```
unsigned  ──sign──▶  signed  ──isi diubah oleh guru──▶  signed_updated
                                                     (butuh tanda tangan ulang)
```

Dihitung di backend saat `studentNotes()` dipetakan (setiap respons):

| Status | Kondisi |
|--------|---------|
| `signed` | `signed_by_user_id != null && signed_at != null` dan `signature_content_hash == contentHash(content)` |
| `signed_updated` | `signed_*` terisi **dan** `signature_content_hash != contentHash(content)` (isi berubah setelah tanda tangan) |
| `unsigned` | belum ada tanda tangan |

Atribut tambahan per item respons: `signature_status`, `signature_stale` (boolean).

## 3. Endpoint Tanda Tangan

```
POST /api/portal/student-notes/{id}/sign   (role: Orang Tua|Siswa, child-scoped)
```

`signStudentNote()` (`...Controller.php`):
1. Resolusi siswa dari konteks anak (`getStudentContext`) → anak asing = 404.
2. Orang tua harus terhubung resmi dengan anak (`parentStudentsQuery`) → jika tidak, 403.
3. Catatan harus milik anak aktif → selain itu 404.
4. Catatan harus `visible_to_parent=true` → selain itu 403 ("belum dipublikasikan").
5. Simpan `follow_up` (dari `notes_parent` / `follow_up` / nilai lama), `signed_by_user_id`, `signed_at=now()`, dan **hash isi saat ini**.
6. Respons membawa `signature_status` dan `signature_was_stale` (true bila tanda tangan sebelumnya sudah menjadi stale sebelum ditimpa).

Idempoten: menandatangani ulang versi yang sama memproduksi hash yang sama → `signed`. Perubahan isi setelah tanda tangan membuat status `signed_updated` pada fetch berikutnya.

## 4. Pengujian

`StudentParentPortalChildSwitchingTest::test_parent_signature_detects_content_change_on_note`:
- tanda tangan awal → `signature_status = signed`;
- konten diubah → fetch ulang → `signed_updated`;
- catatan milik anak tak terhubung → `POST sign` → **404**.

## 5. CLOSURE SESI 10 — SEMANTIK & VERSIONING

`backend/tests/Feature/StudentParentPortalSignatureVersioningTest.php` (4 test, PASS):

| Test | Verifikasi |
|------|-----------|
| `test_signature_remains_valid_when_unrelated_metadata_changes` | perubahan metadata non-isi → tetap `signed` |
| `test_signature_becomes_outdated_when_note_content_changes` | isi berubah → `signed_updated` pada fetch |
| `test_parent_cannot_sign_outdated_document_version` | tanda-tangan ulang versi basi → `signature_was_stale=true` + hash = isi terkini |
| `test_parent_signature_is_idempotent` | tanda-tangan ulang versi sama → hash identik |

**Semantik respons `POST sign` disempurnakan**: status mengikuti state **SETELAH**
penandatanganan — karena hash kini cocok dengan isi terkini, respons selalu `signed`;
bila tanda tangan sebelumnya sudah basi, ditandai `signature_was_stale=true`
(`StudentParentPortalController.php:signStudentNote`). Status `signed_updated` tetap
dihitung per-fetch di `studentNotes()` saat isi berubah setelah tanda tangan.
