# POSTGRESQL SOURCE REPORT

Runtime yang diverifikasi:

- Driver Laravel: `pgsql`
- Engine: **PostgreSQL 17.10**, 64-bit
- Database runtime: `school_management`
- Database certification: `school_management_testing`
- Migrasi: seluruh file tercatat, tidak ada pending
- Partisi attendance: 12 bulan
- Seeder: replay idempotent lulus

| Data | PostgreSQL runtime |
|---|---:|
| Unit pendidikan | 15 |
| Tahun ajaran | 2 |
| Semester | 3 |
| Pegawai | 30 |
| Orang tua | 5 |
| Siswa/alumni | 32 |
| Role total (kanonik + alias compatibility) | 62 |
| Permission | 345 |

Source-of-truth master dan operasional diakses melalui Eloquent/query PostgreSQL. Static array seeder hanya bootstrap deterministik; runtime option/role/permission berasal dari endpoint dan tabel database. Audit mock/hardcode produksi terdokumentasi pada `PRODUCTION_BUNDLE_MOCK_AUDIT.md`, `RUNTIME_MOCK_USAGE_MATRIX.md`, dan `DATABASE_SOURCE_OF_TRUTH_MATRIX.md`.

