# Dokumentasi AI SIMSIT

`docs/ai/` adalah single source of truth untuk aturan, arsitektur, alur, dan konteks kerja AI Sistem Manajemen Sekolah Terpadu (SIMSIT). Dokumentasi ini tidak menggantikan verifikasi kode atau test.

## Tujuan

1. Menyediakan satu dokumen kanonik untuk setiap domain.
2. Memisahkan aturan yang berlaku dari laporan historis dan instruksi eksekusi.
3. Mengurangi token dengan membaca hanya dokumen yang relevan.
4. Menjaga keputusan lintas session tetap dapat ditelusuri tanpa menjadikan report lama sebagai aturan baru.

## Aturan Penggunaan

- Baca `README.md` dan `INDEX.md` sebelum task apa pun.
- Dokumen canonical adalah sumber kebenaran untuk domain yang ditandainya.
- Jika ada konflik, urutan otoritasnya: canonical rulebook, canonical module contract, report aktif, prompt, lalu archive.
- `08_REPORT/` berisi status dan bukti historis; report tidak mengubah aturan canonical.
- `09_PROMPT/` berisi instruksi eksekusi; prompt tidak boleh override canonical docs.
- `99_ARCHIVE/` hanya untuk sejarah, audit lama, duplicate, superseded, dan walkthrough; jangan dipakai sebagai acuan utama.
- Jangan menyatakan PASS berdasarkan dokumentasi lama tanpa bukti verifikasi yang sesuai.

## Urutan Baca OpenCode

Sebelum coding, baca berurutan:

1. `01_PROJECT/` - overview, arsitektur, flow sistem, peta modul.
2. `02_DATABASE/` - rule, schema, migration, seeder, PostgreSQL, dan data scope.
3. `03_AUTH/` - authentication, login flow, role/permission, dan security.
4. `04_UI_UX/` - UI rulebook, design system, komponen, layout, dan responsive.
5. `05_MODULE/` - hanya modul yang terkait task.
6. `06_API/` - API contract, response, dan error.
7. `07_TESTING/` - test, regression, dan performance rule.

## CORE DOCS

Selalu baca:

- `README.md` dan `INDEX.md`.
- `01_PROJECT/PROJECT_OVERVIEW.md`, `01_PROJECT/ARCHITECTURE.md`, `01_PROJECT/FLOW_SYSTEM.md`.
- `02_DATABASE/DATABASE_RULEBOOK.md`.
- `03_AUTH/AUTHENTICATION.md`, `03_AUTH/ROLE_PERMISSION.md`.
- `04_UI_UX/UI_RULEBOOK.md`, `04_UI_UX/DESIGN_SYSTEM.md`, `04_UI_UX/COMPONENT_STANDARD.md`.
- `06_API/API_CONTRACT.md`.
- `07_TESTING/TEST_RULE.md`.

## Dokumen Wajib Berdasarkan Task

| Konteks | Tambahan wajib |
|---|---|
| Backend / database | `02_DATABASE/MIGRATION_RULE.md`, `02_DATABASE/SEEDER_RULE.md`, `02_DATABASE/DATABASE_SCHEMA.md`, `02_DATABASE/DATA_SCOPE.md` |
| PostgreSQL | `02_DATABASE/POSTGRESQL_GUIDE.md` |
| Authentication / login | `03_AUTH/LOGIN_FLOW.md`, `03_AUTH/SECURITY.md` |
| UI / frontend | `04_UI_UX/LAYOUT_STANDARD.md`, `04_UI_UX/RESPONSIVE_STANDARD.md`, dan standard komponen yang dipakai |
| Module | dokumen module terkait di `05_MODULE/` |
| API | `06_API/RESPONSE_STANDARD.md`, `06_API/ERROR_STANDARD.md` |
| Test / regression | `07_TESTING/REGRESSION_RULE.md`, `07_TESTING/PERFORMANCE_RULE.md` bila relevan |

## Hemat Token

- **CORE DOCS**: selalu baca.
- **MODULE DOCS**: baca sesuai task, bukan seluruh folder.
- **REPORTS**: baca hanya untuk status, bukti, atau issue historis yang diperlukan.
- **PROMPTS**: baca hanya saat menjalankan prompt yang relevan.
- **ARCHIVE**: jangan baca kecuali debugging historical issue atau menelusuri keputusan lama.

## Aturan Update Dokumentasi

- Rule berubah -> update canonical doc terkait terlebih dahulu, lalu catat di `08_REPORT/CHANGELOG.md`.
- Alur atau kontrak modul berubah -> update canonical module/API doc dan `INDEX.md` bila daftar dokumen berubah.
- Session baru -> ringkas di `08_REPORT/SESSION_HISTORY.md` dan update `08_REPORT/CURRENT_STATUS.md`; jangan menimpa rulebook dengan report.
- Prompt baru -> simpan di `09_PROMPT/` dan awali persis dengan: `Read docs/ai/README.md and INDEX.md first.`
- Dokumen yang digantikan -> pindahkan ke `99_ARCHIVE/`, jangan hapus permanen pada refactor dokumentasi.
- Link internal harus memakai path relatif yang benar setelah reorganisasi.
