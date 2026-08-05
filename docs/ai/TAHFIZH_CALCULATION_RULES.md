# Dokumen Aturan Perhitungan Tahfizh (TAHFIZH_CALCULATION_RULES.md)

Dokumen ini merinci algoritma matematika dan aturan bisnis untuk perhitungan ayat, baris, surah, dan juz.

```text
ENTITY: Tahfizh Calculation Rules
DOMAIN: Domain Service & TahfizhController
RULES: Distinct Verse Interval Merging, Murajaah Isolation, Repeat Submission Suppression
SOURCE OF TRUTH: QuranSurah (114 Surah, 6236 Ayat)
STATUS: VERIFIED — INTERVAL MERGING IMPLEMENTED & TESTED
```

## Algoritma Interval Merging (Ayat Unik)

Untuk setiap Surah yang disetorkan oleh siswa:
1. Ambil seluruh pasang ayat `[start, end]` yang berstatus setoran baru (*Ziyadah*).
2. Urutkan rentang berdasarkan `start` terkecil.
3. Gabungkan rentang yang tumpang tindih (*overlap*) atau berurutan:
   - Jika `next.start <= current.end + 1`, maka `current.end = max(current.end, next.end)`.
4. Jumlahkan total ayat dari rentang yang telah digabungkan.

### Contoh Kasus Overlap
- Setoran 1: Surah 1 (Al-Fatihah) Ayat 1–5 (5 Ayat)
- Setoran 2: Surah 1 (Al-Fatihah) Ayat 4–7 (4 Ayat)
- Perhitungan Tradisional: `5 + 4 = 9 Ayat` (Salah / Menggandakan)
- **Perhitungan Interval Merging**: Rentang digabung menjadi `[1, 7]` → `7 Ayat Unik` (Benar)

## Aturan Khusus
- **NEW MEMORIZATION (Ziyadah)**: Menambah ayat unik dan baris terhafal.
- **REPEAT SUBMISSION**: Tidak menambah total hafalan baru jika ayat sudah ada dalam interval terhafal.
- **MURAJAAH**: Hanya dicatat untuk evaluasi kualitas dan **TIDAK** menambah total hafalan baru.
- **OVERLAP RULE**: Ayat yang tumpang tindih digabungkan secara sistemis pada backend.
