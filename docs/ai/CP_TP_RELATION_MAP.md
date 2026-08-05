# Peta Relasi CP dan TP dalam LMS

```text
Capaian Pembelajaran (lms_capaian_pembelajaran)
  ├── FK: kurikulum_id -> master_kurikulum.id
  ├── FK: mata_pelajaran_id -> subjects.id
  └── 1 : N -> Tujuan Pembelajaran (lms_tujuan_pembelajaran)
                 ├── FK: cp_id -> lms_capaian_pembelajaran.id
                 └── 1 : N -> Modul Ajar (lms_modul_ajar)
                                 ├── FK: tp_id -> lms_tujuan_pembelajaran.id
                                 ├── FK: guru_id -> employees.id
                                 └── FK: kelas_id -> tbl_kelas.id
```