# Dashboard Widget Matrix

| Dashboard | Widget | API / data source | Scope | Status |
| --- | --- | --- | --- | --- |
| Yayasan | KPI unit, SDM, siswa, kelas, rombel, alumni | `/foundation/dashboard` | Filter unit | API INTEGRATED |
| Yayasan | Distribusi SDM, pergerakan siswa | `FoundationDashboardService` | Filter unit | API INTEGRATED |
| Yayasan | Ringkasan unit, informasi terbaru | `/foundation/dashboard` | Filter unit / publikasi aktif | API INTEGRATED |
| Guru | Jadwal, siswa, tugas tertunda, tahfizh, notifikasi | `/teacher/dashboard` | Penugasan guru | API INTEGRATED |
| Orang Tua/Siswa | Jadwal, tugas, nilai, tahfizh, mutabaah | `/portal/dashboard` | Anak terkait / diri sendiri | API INTEGRATED |

Widget yang tidak memiliki sumber API tidak menampilkan nilai pengganti. Widget tersebut tetap tercatat sebagai kebutuhan implementasi lanjutan.
