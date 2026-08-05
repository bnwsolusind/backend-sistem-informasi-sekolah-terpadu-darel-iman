# Matriks Peran dan Permission LMS Sesi 4

| Permission Name | Super Admin | Guru | Wali Kelas | Kepsek / Waka | Siswa | Orang Tua | Yayasan |
|---|---|---|---|---|---|---|---|
| `pembelajaran.materi` | Full | Own Scope | Read Rombel | Read Unit | Read Published | Read Child | Monitoring |
| `teacher.material.view` | Full | Own Scope | Read Rombel | Read Unit | Read Published | Read Child | Monitoring |
| `teacher.material.create` | Full | Own Scope | Denied | Denied | Denied | Denied | Denied |
| `teacher.material.update` | Full | Own Scope | Denied | Denied | Denied | Denied | Denied |
| `teacher.material.delete` | Full | Own Scope | Denied | Denied | Denied | Denied | Denied |
| `lesson_attendance.view` | Full | Own Scope | Read Rombel | Read Unit | Read Self | Read Child | Monitoring |
| `lesson_attendance.create` | Full | Own Scope | Denied | Denied | Denied | Denied | Denied |
| `lesson_attendance.update` | Full | Own Scope | Denied | Denied | Denied | Denied | Denied |
