# FLOW SYSTEM

Ringkasan alur End-to-End (E2E) sistem. Detail per modul ada di `05_MODULE/`.

## Alur Utama

```text
Authentication
→ Role / Permission (PostgreSQL Spatie)
→ Data Scope (unit / rombel / penugasan / anak)
→ Master Data (unit, tahun ajaran, kurikulum, pegawai, kelas, siswa, orang tua)
→ Akademik (kurikulum, mapel, kelas/jadwal, CP/TP, modul ajar)
→ LMS (materi, tugas, kisi-kisi, bank soal, CBT, penilaian, rapor)
→ Absensi (presensi pembelajaran, gerbang, ibadah)
→ Tahfizh (setoran, target, perhitungan, rekap)
→ Mutabaah (checklist yaumiyah, verifikasi, tanda tangan ortu)
→ Portal (guru, orang tua multi-child, siswa self-scope, alumni)
→ Reporting (laporan lintas unit, drill-down, export)
```

## Alur Role Penting

### Guru
```text
Login (NIY / No HP / Email) → Role Guru
→ Penugasan mengajar (ClassSchedule) → Modul Ajar → Materi/Media/Referensi
→ Aktivitas Belajar → Diskusi Kelas → Presensi LMS
→ Penilaian & Tugas → Rekap → Dashboard Guru / Wali Kelas
```
Scope: penugasan/jadwal/rombel sendiri.

### Wali Kelas
```text
Login → Role Wali Kelas → Rombel sendiri
→ Presensi rombel → Mutabaah siswa → Catatan siswa
→ Penilaian & Rapor → Persetujuan/verifikasi
```
Scope: rombel sendiri.

### Kepala Sekolah
```text
Login → Role Kepala Sekolah → Dashboard unit sendiri
→ Monitoring presensi, akademik, tahfizh, mutabaah → Approval operasional
```
Scope: unit sendiri saja (tidak boleh melihat unit lain).

### Pengurus / Ketua Yayasan
```text
Login → Role Yayasan → Dashboard lintas unit (read-only/report)
→ Filter: unit, jenjang, semester, tahun, rentang tanggal
→ Laporan lintas unit (SDM, siswa, absensi, mutasi, alumni) → Export PDF/Excel
```
Scope: lintas unit, read/monitoring.

### Orang Tua
```text
Login (No HP / NIK Ayah / NIK Ibu / NIS anak terhubung / email) → Role Orang Tua
→ Resolve household → Daftar anak terhubung (parent_student / students.parent_id)
→ Pilih anak aktif (?child= / X-Child-Id) → Profil, jadwal, absensi, nilai,
  tahfizh, mutabaah, catatan guru, chat guru
→ Verifikasi & tanda tangan mutabaah siswa
```
Multi-child: login via satu NIS/hubungan dapat resolve household dan switch seluruh anak terhubung; backend selalu memvalidasi ownership per request (fail-closed 404).

### Siswa
```text
Login (NIS) → Role Siswa → Portal siswa self-scope
→ Profil, jadwal, materi, tugas (submit), nilai, ujian CBT, mutabaah
```
Siswa tetap self-scope; tidak bisa mengakses data siswa lain.

## Ringkasan Flow Modul

| Modul | Alur |
|---|---|
| Master Data | Konfigurasi unit → tahun ajaran/semester → kurikulum → pegawai → kelas/rombel → siswa → orang tua |
| Akademik & LMS | Jadwal → CP/TP → Modul Ajar → Materi → Tugas → Pengumpulan → Kisi-kisi → Bank Soal → CBT → Penilaian → Rapor |
| Absensi | Presensi kelas (per pertemuan, finalize) · Absensi gerbang (QR/RFID) · Absensi ibadah (verifikasi) |
| Tahfizh | Unit → tahun/semester → guru tahfizh → halaqah → siswa → target hafalan → setoran harian → perhitungan ayat unik → evaluasi → rekap → dashboard/portal |
| Mutabaah | Konfigurasi indikator/template → penugasan pembimbing → input checklist harian → verifikasi musyrif (finalized) → tanda tangan ortu (parent_signed) → rekap/analytics |
| Portal | Portal guru (workspace mengajar) · Portal orang tua (multi-child + chat) · Portal siswa (self) · Portal alumni |
| Reporting | Filter unit/tanggal/status → aggregasi lintas model → KPI widget → drill-down → export PDF/XLSX/JSON/CSV |

## Referensi

- Detail E2E per modul (role/permission/menu/route/API/controller/service/model/table): `99_ARCHIVE/SYSTEM_FLOW_MAP.md`
- Scope data per role: `02_DATABASE/DATA_SCOPE.md`
- Role & permission: `03_AUTH/ROLE_PERMISSION.md`
