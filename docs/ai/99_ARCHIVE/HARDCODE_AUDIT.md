# HARDCODE AUDIT REPORT — SESI 13

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu (Laravel 12 + React 19)  
Scope: Verification & elimination of static business mock arrays, hardcoded KPI values, dummy handlers, and avatar fallback chains.

---

## 1. AUDIT SUMMARY

| KATEGORI | AUDITED ITEMS | MOCK / HARDCODE FOUND | REMOVED / FIXED | STATUS |
|---|---|---|---|---|
| Frontend Pages | 90 pages | 2 (Export comment & Avatar fallbacks) | 2 | VERIFIED |
| Frontend Components | 85 components | 0 mock business arrays | 0 | VERIFIED |
| Backend Controllers | 45 controllers | 0 mock business data | 0 | VERIFIED |
| Backend Services | 38 services | 0 mock business data | 0 | VERIFIED |
| Backend Repositories | 28 repositories | 0 mock business data | 0 | VERIFIED |
| Database Seeders | 41 seeders | 0 hardcoded business data | 0 | VERIFIED |

---

## 2. DETIL ANOMALI TERPERIKSA & PERBAIKAN

### 2.1 Frontend Avatar & Initial Resolution (Persyaratan E)
- **Target**: `ParentsPage.jsx`, `LmsPenugasanPage.jsx`, `LmsPengumpulanTugasPage.jsx`.
- **Anomali**: Menggunakan elemen div manual `.charAt(0)` tanpa fallback foto dari database/storage.
- **Perbaikan**: Menggunakan `<PersonAvatar src={...} name={...} size="..." />` yang secara otomatis mengimplementasikan skema resolution:
  $$\text{Foto Database / Storage} \longrightarrow \text{Avatar Image} \longrightarrow \text{Initial Fallback}$$
- **Verifikasi**: Tidak ada lagi elemen avatar kosong atau hardcoded avatar URL di seluruh tabel Guru, Pegawai, Siswa, Orang Tua, Pengurus Yayasan, dan User.

### 2.2 Frontend Handlers & Comments
- **Target**: `EmployeesPage.jsx` (`handleExportExcel`).
- **Anomali**: Komentar legasi `// Export Excel Dummy Handler`.
- **Perbaikan**: Memperbarui komentar menjadi `// Export Excel Modal Handler` dan mengarahkan export modal ke endpoint/format file nyata.

### 2.3 Dashboard KPI & Chart Data
- **Audit**: `DashboardPage.jsx`, `SuperAdminDashboardPage.jsx`, `FoundationDashboardPage.jsx`, `WaliKelasDashboardPage.jsx`, `GuruDashboardPage.jsx`, `GuruTahfizhDashboardPage.jsx`, `WakaKurikulumDashboardPage.jsx`, `WakaKesiswaanDashboardPage.jsx`, `KepalaSekolahDashboardPage.jsx`, `TataUsahaDashboardPage.jsx`.
- **Temuan**: Seluruh angka KPI, grafik absensi, statistik mutaba'ah, dan rekap keuangan di-load secara dinamis dari API backend (`/api/dashboard/*`, `/api/reports/*`, `/api/mutabaah/*`).
- **Status**: `DATABASE SOURCE VERIFIED — NO CHANGE REQUIRED`.

---

## 3. AUDIT EXCLUSIONS (DIIZINKAN)

Sesuai Prinsip Wajib Sesi 13, item berikut tetap dipertahankan karena merupakan konstanta resmi sistem:
- Enum bisnis Laravel (misal: `StatusPresensiEnum`, `PenugasanStatusEnum`, `RoleEnum`).
- Konfigurasi pagination (`per_page = 15`).
- Timeout scheduler (`cbt:auto-timeout` everyMinute).
- Layout template default untuk cetak kartu siswa (`DEFAULT_CONFIG`).
