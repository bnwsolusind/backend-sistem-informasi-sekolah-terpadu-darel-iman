# STATUS BADGE COLOR & LABEL MATRIX — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Standardization of status badge colors, variants, and labels across all system domains.

---

## 1. STATUS BADGE COLOR MAPPING

| BUSINESS STATUS | BADGE VARIANT | LIGHT MODE STYLE | DARK MODE STYLE | USAGE EXAMPLES |
|---|---|---|---|---|
| Aktif / Verified / Passed | `primary` / `success` | `bg-[#0E5C44]/10 text-[#0E5C44]` | `dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]` | Siswa Aktif, Pegawai Aktif, Verified Prestasi, Pass CBT |
| Nonaktif / Inactive | `default` | `bg-slate-100 text-slate-700` | `dark:bg-slate-800 dark:text-slate-200` | User Nonaktif, Subject Inactive |
| Pending / Draft / Waiting | `warning` | `bg-amber-50 text-amber-700` | `dark:bg-amber-950/60 dark:text-amber-300` | Pending Approval, Draft Rapor, Esai CBT Pending |
| Rejected / Failed / Absent / Alpha | `danger` | `bg-rose-50 text-rose-700` | `dark:bg-rose-950/60 dark:text-rose-300` | Mutasi Rejected, Alpha Presensi, Fail CBT |
| Published / Processed / Info | `info` | `bg-sky-50 text-sky-700` | `dark:bg-sky-950/60 dark:text-sky-300` | Published Rapor, Info System |

---

## 2. CONSISTENCY DIRECTIVE

The same business status string across different pages (e.g. `Aktif` in Employee, Student, and Class pages) strictly uses identical badge variant mappings to maintain global visual predictability.
