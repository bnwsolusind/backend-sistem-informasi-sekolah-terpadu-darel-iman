# PROJECT OVERVIEW

Sistem Manajemen Sekolah Terpadu (SIMSIT) — aplikasi manajemen sekolah terpadu dengan dashboard web, portal orang tua/siswa, dan rencana mobile.

## Teknologi

| Layer | Stack |
|---|---|
| Backend | Laravel 12, PHP 8.3, PostgreSQL 17 (runtime PG14.23 Homebrew), Laravel Sanctum, Spatie Permission |
| Web Dashboard | React 19, Vite, Tailwind CSS, React Router, TanStack Query, TanStack Table, React Hook Form, Zustand, Lucide, Framer Motion, ApexCharts |
| Mobile | React Native / Expo (rencana) |
| Database | PostgreSQL, UUID primary key, soft delete, multi-unit, audit field |

## Arsitektur Utama

```text
PostgreSQL → Model → Repository → Service → API Endpoint → React Query/Axios → UI Component
```

## Hasil Audit Master Terakhir Tercatat (ringkas)

| Metrik | Nilai |
|---|---|
| Migration | 71 file, hierarkis |
| Model Eloquent | 91 |
| Route API aktif | 682 |
| Halaman frontend | 83–85 |
| Build frontend | Reported PASS (Vite) |
| Test backend | Reported 315 passed / 1115 assertions |
| Prinsip non-breaking | Reported dipertahankan; rerun diperlukan bila source berubah |

## Domain Modul

Dashboard pemantauan · Absensi digital · Tahfizh & Mutabaah · Akademik & LMS · Portal orang tua & siswa · Master data core · Mutasi/kelulusan/alumni · Informasi sekolah & chat.

## Prinsip Non-Breaking (MUST)

- CRUD, tabel, kolom, endpoint, payload, relasi, validasi, dan permission lama **tidak boleh dihapus/diganti** tanpa audit referensi + pengujian kompatibilitas.
- Migration production lama tidak diedit untuk perubahan skema baru; gunakan migration tambahan non-destruktif.
- Status audit harus berasal dari kode/pengujian, bukan asumsi.

## Referensi

- Arsitektur detail: `01_PROJECT/ARCHITECTURE.md`
- Alur sistem: `01_PROJECT/FLOW_SYSTEM.md`
- Peta modul: `01_PROJECT/MODULE_MAP.md`
- Status project: `08_REPORT/CURRENT_STATUS.md`
