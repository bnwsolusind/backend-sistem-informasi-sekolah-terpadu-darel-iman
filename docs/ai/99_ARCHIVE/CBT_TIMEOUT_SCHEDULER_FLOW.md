# CBT AUTO-TIMEOUT — SCHEDULER FLOW (SESI 12)

## 1. Masalah

Sesi ujian CBT yang dibiarkan oleh siswa melewati `waktu_mulai + durasi_menit` tetap berstatus
`proses` sampai siswa menekan "kumpul". Penulisan jawaban memang sudah ditolak setelah deadline
(enforced sejak Sesi 11), tetapi **status sesi tidak pernah bertransisi otomatis** → monitoring,
hasil, dan kapasitas attempt menunggu aksi manual siswa.

## 2. Solusi

Scheduler berjalan setiap menit dan men-submit otomatis sesi yang sudah lewat batas waktu,
dengan transisi status `proses → timeout`.

## 3. Alur

```text
cron: * * * * * php artisan schedule:run
            │
            └─► Schedule::command('cbt:auto-timeout')->everyMinute()   (routes/console.php)
                  │
                  └─► CbtAutoTimeout::handle(LmsUjianRepository $repo)
                        │  --limit=100 (default)
                        ▼
                        LmsUjianRepository::autoSubmitExpiredSessions($limit)
                        │
                        ├─ 1) Pilih sesi kandidat:
                        │      status='proses'  AND  waktu_mulai NOT NULL
                        │      AND  ujian.durasi_menit > 0
                        │      AND  now() > waktu_mulai + durasi_menit*60
                        │      → take($limit)
                        │
                        ├─ 2) Per sesi — CLAIM atomik:
                        │      UPDATE lms_ujian_sesi
                        │        SET status='timeout', waktu_selesai=now()
                        │      WHERE id = ? AND status='proses'
                        │      (affected=0 → skipped; sesi diambil runner lain / sudah final)
                        │
                        └─ 3) gradeAndFinalize($sesi, 'timeout')
                              ├─ nilai objektif (benar/salah/kosong, total poin, max poin)
                              ├─ esai: tetap pending (dinilai manual) — tidak bocor kunci
                              └─ simpan nilai_akhir, skor, durasi_aktual_detik, status='timeout'
```

## 4. Idempotensi & Keamanan

- **Claim atomik** `WHERE status='proses'` → dua runner/dua cron yang bertabrakan tidak memproses
  sesi yang sama dua kali (affected=0 → skip).
- `finalizeSesiUjian` idempotent: sesi berstatus `selesai`/`timeout` **tidak** diproses ulang.
- **Kunci jawaban tidak pernah dibocorkan**: objek `LmsBankSoal` dimuat dan dinilai di dalam server;
  payload tidak dikembalikan ke klien.
- Deadline dihitung dari `waktu_mulai` (bukan `updated_at`) → adil terhadap sesi yang lama tidak aktif.

## 5. File

| File | Peran |
|---|---|
| `app/Repositories/Eloquent/LmsUjianRepository.php:292` | `autoSubmitExpiredSessions($limit)` |
| `app/Repositories/Eloquent/LmsUjianRepository.php:344` | `gradeAndFinalize($sesi, $status)` (private, dipakai finalize manual & auto-timeout) |
| `app/Repositories/Eloquent/LmsUjianRepository.php:263` | `finalizeSesiUjian` — idempotent, validasi status |
| `app/Repositories/Eloquent/LmsUjianRepository.php:477` | `getHasilUjian` — kini menyertakan status `timeout` |
| `app/Console/Commands/CbtAutoTimeout.php` | Command `cbt:auto-timeout {--limit=100}` |
| `routes/console.php` | `Schedule::command('cbt:auto-timeout')->everyMinute()` |

## 6. Operasional

```bash
php artisan schedule:list                    # verifikasi terdaftar
php artisan cbt:auto-timeout                 # jalankan manual (uji)
php artisan cbt:auto-timeout --limit=500     # batch lebih besar
```

Deploy wajib menjalankan scheduler (`php artisan schedule:work`, atau cron `schedule:run`).
