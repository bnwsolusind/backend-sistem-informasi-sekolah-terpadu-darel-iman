# Dokumentasi AI SIMSIT

Folder ini menyimpan hasil audit dan keputusan implementasi agar perubahan berbantuan AI tetap dapat ditelusuri. Baca dokumen audit CRUD dan relasi sebelum mengubah backend, lalu route mapping dan menu refactor sebelum mengubah navigasi.

## Dokumen

- `AUDIT_SEBULUM_BUAT_MODUL_BARU.md`: aturan audit database dan integrasi.
- `MODERN_SOFT_MODULE_REFACTOR_PROMPT.md`: acuan UI/UX Modern Soft.
- `academic-lms-menu-refactor.md`: struktur menu/container yang diterapkan.
- `academic-lms-crud-audit.md`: hasil pemeriksaan 22 area akademik/LMS.
- `academic-lms-route-mapping.md`: kompatibilitas route web dan API.
- `academic-lms-data-relations.md`: tabel, model, dan foreign key aktual.
- `academic-lms-permissions.md`: permission yang ditemukan di kode.
- `academic-lms-test-checklist.md`: hasil dan checklist pengujian.
- `academic-lms-change-log.md`: daftar perubahan implementasi.

## Aturan perubahan

CRUD, tabel, kolom, endpoint, payload, relasi, validasi, dan permission lama tidak boleh dihapus atau diganti tanpa audit referensi dan pengujian kompatibilitas. Migration production lama tidak diedit untuk perubahan skema baru; gunakan migration tambahan non-destruktif. Status audit harus berasal dari kode atau pengujian, bukan asumsi.
