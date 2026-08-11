# MODULE: MUTABAAH

Bukti historis: `99_ARCHIVE/MUTABAAH_FLOW.md`, `99_ARCHIVE/MUTABAAH_INDICATOR_MODEL.md`, `99_ARCHIVE/MUTABAAH_USER_TASK_FLOW.md`, `99_ARCHIVE/PARENT_NOTE_APPROVAL_FLOW.md`, `99_ARCHIVE/PARENT_PORTAL_MUTABAAH_GATE.md`.

## Entitas & Scope

```text
ENTITY: Mutabaah Yaumiyah Daily Header & Details
TABLE: mutabaah_daily_headers, mutabaah_daily_details, mutabaah_parent_signatures,
       mutabaah_categories, mutabaah_agenda_items, mutabaah_templates, mutabaah_template_items
PARENT: Student, MutabaahTemplate, MutabaahSupervisorAssignment
OWNER: Siswa / Musyrif / Pembimbing
SCOPE: EducationUnit · Teacher (Supervisor Assignment) · Class/Rombel · Student (input checklist harian)
PERMISSION: mutabaah.view, mutabaah.create, mutabaah.update, mutabaah.verify, mutabaah.export
STATUS: Reported operational pada audit historis; verifikasi ulang diperlukan bila source berubah.
```

## Alur Kerja

```text
Konfigurasi Master Indikator & Template Mutabaah
→ Penugasan Pembimbing / Musyrif
→ Input Checklist Harian (Siswa / Musyrif / Spreadsheet)
→ Verifikasi & Finalisasi Musyrif/Pembimbing (status: finalized)
→ Peninjauan & Tanda Tangan Orang Tua (status: parent_signed)
→ Rekap & Sinkronisasi Analytics Dashboard
```

## Tipe Input Indikator

`status/checklist` (good, less, not_done, na) · `yes_no` · `number/target` · `duration` (menit) · `pages` (lembar) · `verses` (ayat) · `text` (catatan).

## Akses

- Master indikator/template: Administrator / Tim Kesiswaan / Tim Al-Qur'an (permission `mutabaah-indicators.*`).
- Input checklist: Siswa (self) / Musyrif; verifikasi & finalisasi: Musyrif/Pembimbing.
- Tanda tangan orang tua: hanya orang tua terhubung; sistem digest signature (`PARENT_PORTAL_SIGNATURE_DIGEST.md`).
- Portal: siswa lihat checklist sendiri; orang tua lihat & tanda tangan anak; analytics dashboard untuk pembina.

## Referensi

- Detail arsip: `99_ARCHIVE/MUTABAAH_*`, `99_ARCHIVE/PARENT_NOTE_APPROVAL_FLOW.md`, `99_ARCHIVE/PARENT_PORTAL_MUTABAAH_GATE.md`
