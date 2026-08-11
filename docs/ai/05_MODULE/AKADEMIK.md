# MODULE: AKADEMIK

Bukti historis: `99_ARCHIVE/ACADEMIC_LMS_FLOW.md`, `99_ARCHIVE/CLASS_ROMBEL_FLOW.md`, `99_ARCHIVE/CP_TP_RELATION_MAP.md`, `99_ARCHIVE/GRADE_FINALIZATION_FLOW.md`, `99_ARCHIVE/REPORT_CARD_FLOW.md`, `99_ARCHIVE/PROMOTION_FLOW.md`, `99_ARCHIVE/GRADUATION_FLOW.md`.

## Alur Utama

```text
Unit → Tahun Ajaran & Semester → Kurikulum & CP/TP
→ Rombel/Kelas (wali kelas) → Mapel & Jadwal (ClassSchedule, penugasan mengajar)
→ Modul Ajar → Materi → Media → Referensi → Aktivitas → Diskusi → Presensi LMS
→ Penilaian (draft → finalized → approved → published rapor)
→ Kenaikan Kelas / Kelulusan / Alumni
```

## Entitas Inti

| Domain | Entitas |
|---|---|
| Kurikulum | `curriculums` (MasterKurikulum), `cp_atp` (CP/TP map) |
| Kelas | `classes` (rombongan), `class_schedules` (jadwal + penugasan mengajar) |
| Materi | `lms_modul_ajar`, `lms_materi`, `lms_media`, `lms_referensi`, `lms_aktivitas_belajar`, `lms_diskusi` |
| Presensi | `lms_presensi` (LessonAttendanceSession) |
| Nilai | `student_grades` (draft→finalized→approved), `lms_rapors` (published) |
| Mutasi | `student_mutations` (masuk/keluar/pindah) |
| Kelulusan | `graduations`, `alumni` |

## Alur Presensi Pembelajaran (LMS)

Guru pilih jadwal → buka pertemuan → sistem ambil siswa aktif rombel → isi `lms_presensi` → validasi penugasan mengajar & keanggotaan → upsert transaksi → hitung rekap → cache invalidation → sinkronisasi dashboard/portal.

## State Finalisasi Nilai (Locked)

`draft` → `finalized` (guru/waka) → `approved` (kepsek) → `published` (wali kelas/admin publish rapor). Finalized/approved/published terkunci dari manual override tanpa permission khusus; setiap perubahan/finalisasi/approval dicatat audit log.

## Scope Akses

Guru (jadwal penugasannya) · Wali Kelas (rombelnya) · Kepala Sekolah (unit) · Yayasan (lintas unit) · Siswa (self) · Orang Tua (anak terhubung).

## Referensi

- Detail arsip: `99_ARCHIVE/academic-lms-*`, `99_ARCHIVE/*_FLOW.md` (ASSESSMENT, CBT, REPORT_CARD, PROMOTION, GRADUATION, CP_TP, CLASS_ROMBEL)
- API: `06_API/API_CONTRACT.md`
