# Dashboard Role Matrix

| Role | Route Utama | Scope Access | Permission / Guard | Status |
| --- | --- | --- | --- | --- |
| Super Admin | `/dashboard` | Seluruh Sistem | `Super Admin` / `dashboard.super-admin.view` | COMPLETED |
| Yayasan / Pengurus Yayasan | `/dashboard/yayasan` | Lintas Unit (View-Only) | `foundation.dashboard.view` | COMPLETED |
| Kepala Sekolah | `/dashboard/kepala-sekolah` | Unit Penugasan | `dashboard.kepala-sekolah.view` | COMPLETED |
| Divisi Pendidikan | `/dashboard/divisi-pendidikan` | Unit Monitoring | `dashboard.divisi-pendidikan.view` | COMPLETED |
| Waka Kurikulum | `/dashboard/waka-kurikulum` | Unit Penugasan | `dashboard.waka-kurikulum.view` | COMPLETED |
| Waka Kesiswaan | `/dashboard/waka-kesiswaan` | Unit Penugasan | `dashboard.waka-kesiswaan.view` | COMPLETED |
| Tata Usaha | `/dashboard/tata-usaha` | Unit Penugasan | `dashboard.tata-usaha.view` | COMPLETED |
| Guru | `/portal-guru` | Penugasan Guru | `teacher.dashboard.view` | API INTEGRATED |
| Wali Kelas | `/absensi/dashboard-wali-kelas` | Rombel Wali Kelas | `homeroom_attendance.dashboard` | VERIFIED — NO CHANGE REQUIRED |
| Guru Tahfizh | `/dashboard/guru-tahfizh` | Santri Binaan | `dashboard.guru-tahfizh.view` | COMPLETED |
| Guru BK | `/dashboard/guru-bk` | Catatan Terproteksi | `dashboard.guru-bk.view` | COMPLETED |
| Operator | `/dashboard/operator` | Unit Penugasan | `dashboard.operator.view` | COMPLETED |
| Orang Tua | `/portal-orangtua` | Anak Terkait | `parent.portal.view` | API INTEGRATED |
| Siswa | `/portal-siswa` | Diri Sendiri | `student.portal.view` | API INTEGRATED |
| Alumni | `/portal/alumni` | Data Pribadi | `portal.alumni.dashboard.view` | PENDING SESSION 2 |
