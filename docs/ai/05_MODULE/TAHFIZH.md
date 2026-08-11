# MODULE: TAHFIZH

Bukti historis: `99_ARCHIVE/TAHFIZH_FLOW.md`, `99_ARCHIVE/TAHFIZH_CALCULATION_RULES.md`, `99_ARCHIVE/TAHFIZH_TARGET_FLOW.md`, `99_ARCHIVE/TAHFIZH_ASSIGNMENT_SCOPE.md`, `99_ARCHIVE/MURAJAAH_FLOW.md`.

## Entitas & Scope

```text
ENTITY: Tahfizh Daily Log & Deposit
TABLE: tahfizh_daily_logs, memorization_deposits
MODEL: App\Models\TahfizhDailyLog, App\Models\TahfizhRecord
OWNER: Guru Tahfizh / Musyrif Binaan
SCOPE: EducationUnit; teacher strict (halaqah/rombel binaan)
PERMISSION: tahfizh.view, tahfizh.create, tahfizh.update, tahfizh.delete, tahfizh.grade
SOURCE OF TRUTH: QuranSurah (114 surah, 6236 ayat)
```

## Alur Operasional

```text
Unit → Tahun Ajaran & Semester → Guru Tahfizh/Musyrif → Halaqah/Kelompok Binaan
→ Siswa Binaan → Target Hafalan Aktif → Setoran Harian (Ziyadah)
→ Perhitungan Unik Ayat (Distinct Interval Merging)
→ Evaluasi Kualitas (Kelancaran, Tajwid, Makhraj)
→ Rekap (Harian/Mingguan/Bulanan/Semester) → Dashboard & Portal Sync
```

## Aturan Perhitungan (Last Recorded Verification)

- **Interval Merging**: pasang ayat `[start,end]` status ziyadah diurutkan per surah; gabungkan overlap/berurutan (`next.start <= current.end + 1` → merge); jumlahkan ayat unik. Rule ini tercatat diverifikasi pada audit historis.
- **Ziyadah** menambah ayat & baris terhafal; **REPEAT SUBMISSION** tidak menambah total; **MURAJAAH** hanya evaluasi kualitas, tidak menambah hafalan baru.
- Overlap tidak menggandakan jumlah (misal setoran 1–5 + 4–7 = 7 ayat unik, bukan 9).

## Kebijakan Akses

1. Guru Tahfizh: input & lihat setoran siswa binaannya saja.
2. Wali Kelas: rekap hafalan rombel yang diampu.
3. Orang Tua / Siswa: read-only terhadap data sendiri/anak.

## Referensi

- Detail arsip: `99_ARCHIVE/TAHFIZH_*`, `99_ARCHIVE/MURAJAAH_FLOW.md`, `99_ARCHIVE/TAHFIZH_DASHBOARD_SYNC_MATRIX.md`
