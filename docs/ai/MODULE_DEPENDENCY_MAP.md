# MODULE DEPENDENCY MAP — SISTEM MANAJEMEN SEKOLAH TERPADU

Dokumen ini memetakan hierarki dan ketergantungan data antar-modul untuk memastikan integritas referensial dan urutan pengisian data master & transaksi.

---

## 1. ALUR MASTER DATA UTAMA

```mermaid
graph TD
    A[Jenis Unit Pendidikan] --> B[Unit Pendidikan]
    B --> C[Tahun Ajaran & Semester]
    B --> D[Pegawai & Guru]
    B --> E[Kelas & Rombel]
    C --> F[Master Kurikulum]
    F --> G[Mata Pelajaran]
    D & G & E --> H[Penugasan Guru & Jadwal Pelajaran]
    B --> I[Orang Tua / Wali]
    I & E --> J[Siswa Aktif]
```

### Urutan Pengisian (Seed / Input Master):
1. **Jenis Unit Pendidikan** (`tbl_jenis_unit_pendidikan`)
2. **Unit Pendidikan** (`education_units`)
3. **Tahun Ajaran & Semester** (`academic_years`, `semesters`)
4. **Master Kurikulum** (`tbl_master_kurikulum`)
5. **Mata Pelajaran** (`subjects`)
6. **Pegawai & Guru** (`employees`, `users`, `roles`)
7. **Kelas & Rombel** (`tbl_kelas`)
8. **Orang Tua / Wali & Siswa** (`parents`, `students`, `parent_student`)
9. **Penugasan & Jadwal Pelajaran** (`lms_jadwal_pelajaran`)

---

## 2. ALUR AKADEMIK & LMS

```mermaid
graph TD
    Jadwal[Jadwal Pelajaran] --> Presensi[Presensi Pembelajaran]
    Jadwal --> Perencanaan[CP & TP]
    Perencanaan --> ModulAjar[Modul Ajar & Materi]
    ModulAjar --> Tugas[Penugasan & Pengumpulan]
    ModulAjar --> Evaluasi[Kisi-kisi & Bank Soal]
    Evaluasi --> CBT[Ujian CBT]
    Tugas & CBT --> Penilaian[Buku Nilai Formatif/Sumatif]
    Penilaian --> Rapor[Dokumen Rapor & Leger]
    Rapor --> Promo[Kenaikan Kelas & Kelulusan]
```

---

## 3. ALUR TAHFIZH & MUTABAAH

```mermaid
graph TD
    Siswa[Siswa Aktif] --> Halqah[Penugasan Guru Tahfizh / Musyrif]
    Halqah --> Target[Target Hafalan Surah/Juz]
    Halqah & Target --> Setoran[Setoran Hafalan Harian]
    Setoran --> Murajaah[Rekap Murajaah & Kelancaran]
    Murajaah --> RekapTahfizh[Dashboard Tahfizh & Portal Ortu]
    
    Siswa --> Indikator[Template Agenda Mutabaah]
    Indikator --> Checklist[Input Mutabaah Yaumiyah]
    Checklist --> Verify[Tanda Tangan & Verifikasi Ortu]
    Verify --> RekapMutabaah[Dashboard & Rekap Nilai Karakter]
```

---

## 4. ALUR PRESENSI & KESISWAAN

```mermaid
graph TD
    Siswa[Siswa Aktif] --> Gerbang[Presensi Gerbang Scan QR/RFID]
    Siswa --> KelasPresensi[Presensi Pembelajaran Matriks Guru]
    Siswa --> Asrama[Presensi Ibadah Santri]
    Gerbang & KelasPresensi & Asrama --> RekapPresensi[Rekap Presensi & Dashboard Alert]
    
    Siswa --> Catatan[Catatan Siswa / Poin Pelanggaran & Prestasi]
    Catatan --> BK[Konseling BK & Pembinaan]
    Siswa --> Status[Proses Mutasi / Kelulusan]
    Status --> Alumni[Data Alumni & Tracer Study]
```

---

## 5. REKAPITULASI HIERARKI FOREIGN KEY

| Modul Anak | Foreign Key Primary | Modul Induk (Parent) | Syarat Deletion / Dependency |
|---|---|---|---|
| `education_units` | `jenis_unit_id` | `tbl_jenis_unit_pendidikan` | Restricted jika unit terpakai |
| `subjects` | `education_unit_id`, `kurikulum_id` | `education_units`, `tbl_master_kurikulum` | Soft delete |
| `employees` | `education_unit_id`, `user_id` | `education_units`, `users` | Soft delete |
| `tbl_kelas` | `education_unit_id`, `walikelas_id` | `education_units`, `employees` | Soft delete |
| `students` | `education_unit_id`, `kelas_id`, `parent_id` | `education_units`, `tbl_kelas`, `parents` | Soft delete |
| `lms_jadwal_pelajaran` | `education_unit_id`, `rombel_id`, `subject_id`, `teacher_id` | Unit, Kelas, Mapel, Guru | Cascade pada soft delete |
| `lms_presensi` | `jadwal_id`, `teacher_id` | `lms_jadwal_pelajaran`, `employees` | Finalisasi mengunci data |
| `tahfizh_deposits` | `student_id`, `teacher_id` | `students`, `employees` | Continuous log |
| `mutabaah_daily_records` | `student_id` | `students` | Unique per tanggal |
| `alumni` | `student_id` | `students` | Created on graduation |

STATUS DEPENDENCY: `VERIFIED — ALL PARENT-CHILD RELATIONS INTACT`
