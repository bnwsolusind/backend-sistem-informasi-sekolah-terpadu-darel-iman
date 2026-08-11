# CBT Online Examination Engine Flow — Sesi 5

## Overview
Modul CBT (`lms_ujian`, `lms_ujian_sesi`, `lms_jawaban_siswa`) menangani pengerjaan ujian online siswa secara interaktif dan real-time.

## CBT Lifecycle & Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Siswa
    participant Portal as Student Portal
    participant API as CBT Controller
    participant Engine as CBT Service Engine
    actor Guru

    Siswa->>Portal: Buka Ujian Online
    Portal->>API: POST /api/lms/ujian/{id}/start-session
    API->>Engine: mulaiSesi(ujianId, siswaId)
    Engine-->>API: Data Sesi + Soal (Tanpa Kunci Jawaban)
    API-->>Portal: Response CBT Engine
    
    loop Pengerjaan Ujian Real-time
        Siswa->>Portal: Pilih / Ketik Jawaban
        Portal->>API: POST /api/lms/ujian/sesi/{sesiId}/submit-answers
        API->>Engine: simpanJawaban(sesiId, jawabanArray)
        Engine-->>API: Status Tersimpan
    end

    Siswa->>Portal: Klik Selesaikan Ujian / Timer Expiry
    Portal->>API: POST /api/lms/ujian/sesi/{sesiId}/finish-session
    API->>Engine: selesaikanSesi(sesiId)
    Note over Engine: Auto Scoring PG, Isian, Menjodohkan, Benar/Salah
    Engine-->>API: Sesi Selesai (Nila Raw & Nilai Final)
    API-->>Portal: Summary Hasil Ujian

    opt Penilaian Esai Manual
        Guru->>API: POST /api/lms/ujian/jawaban/{jawabanId}/grade-essay
        API->>Engine: nilaiEssay(jawabanId, poin)
        Note over Engine: Rekalkulasi Nilai Final Sesi
    end
```

## Fitur & Aturan CBT
1. **Server-Side Timer**: `sisa_waktu_detik` dihitung di server dari `waktu_mulai + durasi_menit`.
2. **Attempt Enforcement**: `max_attempt` diperiksa sebelum sesi baru dibuat.
3. **Auto Scoring**:
   - PG: `jawaban_dipilih === kunci_jawaban` -> `poin_didapat = soal.poin`.
   - Benar/Salah: `jawaban_dipilih === kunci_jawaban` -> `poin_didapat = soal.poin`.
   - Menjodohkan: `json_encode(jawaban) === json_encode(kunci)` -> `poin_didapat = soal.poin`.
   - Isian: Case-insensitive string match -> `poin_didapat = soal.poin`.
   - Esai: Penilaian manual guru via `gradeEssay`. Nilai final otomatis direkalkulasi.
