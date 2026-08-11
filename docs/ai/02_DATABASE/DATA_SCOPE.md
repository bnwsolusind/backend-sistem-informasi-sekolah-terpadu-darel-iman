# DATA SCOPE

Scope data per role (kanonik). Bukti historis: `99_ARCHIVE/ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/DASHBOARD_DATA_SCOPE_MATRIX.md`, `99_ARCHIVE/LOOKUP_ROLE_SCOPE_MATRIX.md`.

## Matriks Scope Query Backend

| Role | Batas scope | Strategi query |
|---|---|---|
| Super Admin | Unlimited | tanpa filter `unit_id`/`employee_id` |
| Ketua/Pengurus Yayasan | Cross-unit read-only | `whereIn('education_unit_id', $allowedUnitIds)` |
| Sekretaris/Bendahara Yayasan | Cross-unit read-only | `whereIn(...)` |
| Kepala Bidang Pendidikan | Multi-unit akademik | `whereIn('education_unit_id', $allowedUnitIds)` |
| Divisi Kurikulum | Multi-unit akademik | scope divisi akademik |
| Divisi Kesiswaan | Multi-unit kesiswaan | scope divisi kesiswaan |
| Kepala Sekolah | Unit sendiri | `where('education_unit_id', $user->employee->education_unit_id)` |
| Wakil Kepala Sekolah | Unit sendiri | scope unit |
| Wakil Kurikulum | Unit/akademik sendiri | scope unit akademik |
| Wakil Kesiswaan | Unit/kesiswaan sendiri | scope unit kesiswaan |
| Tata Usaha / Operator | Unit sendiri | `where('education_unit_id', ...)` |
| Guru | Penugasan/jadwal/rombel sendiri | `whereIn('class_id', $teacherClassIds)` + relasi subject |
| Guru Tahfizh | Halaqah/grup sendiri | `whereIn('student_id', $halaqahStudentIds)` |
| Guru BK | Siswa layanan sendiri | scope layanan BK |
| Wali Kelas | Rombel sendiri | `where('class_id', $homeroomClassId)` |
| Musyrif | Kelompok binaan sendiri | `whereIn('student_id', $musyrifStudentIds)` |
| Orang Tua | Anak terhubung | `whereIn('student_id', $parentStudentIds)` via `parent_student` |
| Siswa | Self | `where('student_id', $userStudentId)` / `where('user_id', $user->id)` |
| Alumni | Data sendiri | scope self |

## Step 04 Teaching Monitoring Scope

| Context | Scope rule |
|---|---|
| Guru QR/attendance/session | `employee_id` harus merupakan employee user; `schedule.employee_id` harus sama; periode, unit, hari, dan time window divalidasi server |
| Heartbeat | Hanya membuat/update `user_devices` untuk authenticated user dan `device_id` yang dikirim; tidak membuat attendance |
| Kepsek/Waka | Monitoring employee/schedule pada unit yang dapat diakses |
| Yayasan/Divisi | Monitoring lintas unit hanya pada `accessibleEducationUnits()`; bukan write action |
| Super Admin | Global monitoring |

`TeacherMonitoringService` meng-query jadwal aktif pada tanggal server, lalu menggabungkan teaching attendance, session, device presence, dan login event. Student attendance completion tidak diisi dari mock dan tetap belum tersedia pada Step 04.

## Aturan Scope

- Backend adalah otoritas scope; frontend guard hanya UX.
- Unit scope untuk daftar terverifikasi (pegawai, kelas) dengan dua unit; endpoint detail/mutasi wajib scope global yang konsisten.
- Endpoint options/lookup memeriksa role & unit permission (403 jika melanggar); frontend tidak boleh memanggil lookup master dari portal tanpa permission.
- Portal orang tua: konteks anak di-resolve per request (`X-Child-Id`/`child_id`) dan divalidasi ulang (fail-closed 404). Lihat `05_MODULE/PORTAL_ORANG_TUA.md`.
- Step 02: employee dan kelas list/detail/mutasi memakai `AccessScopeService`; role matching harus exact setelah normalisasi, bukan substring.

## Referensi

- Detail: `99_ARCHIVE/ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/DASHBOARD_DATA_SCOPE_MATRIX.md`, `99_ARCHIVE/LOOKUP_ROLE_SCOPE_MATRIX.md`, `99_ARCHIVE/ROLE_FLOW_MATRIX.md`
- Role & permission: `03_AUTH/ROLE_PERMISSION.md`
