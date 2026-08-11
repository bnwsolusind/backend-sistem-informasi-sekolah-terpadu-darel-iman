# MODULE: DASHBOARD

Bukti historis: `99_ARCHIVE/DASHBOARD_ROLE_MATRIX.md`, `99_ARCHIVE/DASHBOARD_KPI_SOURCE_MAP.md`, `99_ARCHIVE/DASHBOARD_LAYOUT_RULEBOOK.md`, `99_ARCHIVE/DASHBOARD_WIDGET_MATRIX.md`, `99_ARCHIVE/DASHBOARD_QUICK_ACTION_MATRIX.md`.
Kontrak aktif role dashboard: `ROLE_DASHBOARD_STANDARD.md`.

## Dashboard Multi-Role

Satu layout, peran menentukan data/widget/KPI/permission/quick action — bukan layout berbeda.

| Role | Dashboard utama | Konten khas |
|---|---|---|
| Pengurus Yayasan | `/dashboard/yayasan` | Laporan lintas unit, SDM, keuangan, mutasi |
| Kepala Sekolah | `/dashboard/kepala-sekolah` | Presensi, akademik, rapor, tahfizh, mutabaah |
| Guru | `/portal-guru` | Jadwal hari ini, kelas diampu, presensi LMS, penilaian |
| Wali Kelas | `/dashboard/wali-kelas` | Rekap kelas, mutabaah kelas, catatan siswa |
| Musyrif | `/dashboard/musyrif` | Halaqah binaan, tahfizh, mutabaah |
| Siswa | `/portal-siswa` (ringkasan) | Jadwal, tugas, nilai, tahfizh self-scope |
| Orang Tua | `/portal-orangtua` (ringkasan) | Ringkasan anak (switcher multi-child) |

## Layout (LOCKED)

Urutan: TOPBAR → HERO → ROW 1 KPI → ROW 2 (ringkasan + 2 chart) → ROW 3 widget → ROW 4 table (2 kolom) → ROW 5 (quick action, activity, notification, calendar) → ROW 6 table full width. Grid per device di `04_UI_UX/LAYOUT_STANDARD.md`.

## Widget Source (Zero Mock)

KPI/chart dihitung real-time dari API → PostgreSQL (Zero Mock Policy). Filter aktif: academic year aktif + semester aktif + `whereNull('deleted_at')`.

Contoh sumber KPI: Siswa aktif (students), Pegawai (employees), Presensi (attendances/lms_presensi), Setoran tahfizh (tahfizh_daily_logs), Mutabaah (mutabaah_records), Rapor published (lms_rapors). Detail per widget: `99_ARCHIVE/DASHBOARD_KPI_SOURCE_MAP.md`, `99_ARCHIVE/CHART_DATABASE_TRACE_MATRIX.md`.

## Referensi

- Layout & widget: `04_UI_UX/LAYOUT_STANDARD.md`
- Role & scope: `03_AUTH/ROLE_PERMISSION.md`
- Detail arsip: `99_ARCHIVE/DASHBOARD_*`, `99_ARCHIVE/ROLE_DASHBOARD_MATRIX.md`
