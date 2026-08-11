# MODULE ACCESS MATRIX

Matriks baseline akses. `R` = read/monitor, `W` = transaksi sesuai permission, `OWN` = assignment/self, `UNIT` = unit sendiri, `XU` = allowed cross-unit. Backend tetap otoritas; role fallback yang tercantum di controller adalah temuan aktual, bukan pola yang direkomendasikan.

| Keluarga role | Dashboard | Master | Akademik/LMS | Gerbang | Presensi pembelajaran | Monitoring guru | Tahfizh/Mutabaah/Ibadah | Portal |
|---|---|---|---|---|---|---|---|---|
| Super Admin | R/W global | R/W | R/W | R/W | R/W | target global | R/W | Admin |
| Yayasan | R XU | R XU | R XU | R XU target | R XU target | target read XU | R XU | Yayasan |
| Bidang/divisi | R XU/allowed | R scoped | R/W sesuai jabatan | R scoped target | R scoped target | target read scoped | sesuai jabatan | Admin |
| Kepsek/Waka | R UNIT | R UNIT | R/W UNIT | R UNIT target | R UNIT target | target read UNIT | R UNIT | Admin |
| TU/Operator | R UNIT | R/W UNIT | operasional | scan/manage sesuai permission | tidak otomatis finalize | tidak otomatis | operasional | Admin |
| Guru mapel | R OWN | — | W OWN | — | W OWN | self only | sesuai assignment | Guru |
| Wali Kelas | R rombel | — | R rombel | R rombel | monitor/correct rombel; bukan semua mapel | scoped rombel | R rombel | Guru/Wali |
| Guru Tahfizh | R OWN | — | sesuai assignment | — | hanya bila punya jadwal mapel | self | W halaqah | Guru/Tahfizh |
| Guru BK | R layanan | — | catatan/layanan | — | R sesuai permission | self | — | Guru/BK |
| Musyrif | R binaan | — | — | — | hanya bila assignment mengajar valid | self | W binaan/ibadah | Musyrif |
| Orang Tua | R anak | — | R anak | R anak | R anak | — | R/sign anak | Orang Tua |
| Siswa | R self | — | aktivitas belajar self | R self | R self | — | aktivitas self sesuai rule | Siswa |
| Alumni | R self | — | terbatas | riwayat bila ada | riwayat bila ada | — | read bila kontrak | Alumni |

## Permission Attendance yang Ditemukan

- Gerbang baru: `student_attendance.daily.view|scan|create|update|verify|export`.
- Pembelajaran: `lesson_attendance.view|view_own|create|update|finalize|unlock|cancel|correct|export` dan capture `manual|qr_scan|barcode_scan|face_scan|fingerprint_scan|session.start|session.close|scan_logs.view`.
- Monitoring lama: `attendance.teacher.dashboard`, `attendance.homeroom.dashboard`, `dashboard.pemantauan.lihat`.
- Belum ada permission kanonik khusus `teaching_attendance.scan`, `teaching_attendance.view`, `attendance.monitor`, atau `attendance.monitor_all` yang memisahkan kehadiran mengajar dari presensi pegawai.

## Disposition Step 02

1. Gate attendance view/scan/config sekarang memiliki middleware permission khusus.
2. `AccessScopeService` memakai exact normalized role matching dan sentinel fail-closed untuk unit tanpa scope.
3. Route `/portal-guru` dan `/api/teacher/*` sekarang role-scoped; role pimpinan/TU/admin umum tidak menjadi teacher fallback.
4. Parent dan student workspace dipisahkan pada route guard dan menu.
5. Student leave/sick mutation tidak lagi diberi permission; transaksi tetap parent-controlled.
6. Wali Kelas substitute/finalize tetap menjadi gap bisnis yang harus diaudit terpisah; tidak diperluas pada Step 02.
