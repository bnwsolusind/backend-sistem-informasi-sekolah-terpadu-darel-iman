# Pemetaan Hak Akses & Permission Pengurus Yayasan

Sistem Manajemen Sekolah Terpadu — Spatie Laravel Permission

## Permission Resmi Role Pengurus Yayasan

Role `pengurus_yayasan` / `Yayasan` / `Ketua Yayasan` / `ketua_yayasan` / `sekretaris_yayasan` / `bendahara_yayasan` diberikan permission khusus monitoring:

```text
foundation.dashboard.view
foundation.unit.view
foundation.employee.view
foundation.teacher.view
foundation.student.view
foundation.student_new.view
foundation.student_mutation.view
foundation.graduation.view
foundation.alumni.view
foundation.information.view
foundation.report.view
foundation.report.export
foundation.notification.view
foundation.notification.read
foundation.notification.read_all
foundation.profile.view
foundation.profile.update
foundation.profile.change_password
```

## Matrix Izin Aksi (Action Matrix)

| Modul / Domain | Read / View | Create | Update | Delete | Approve | Import | Export |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard Yayasan | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Master Unit Pendidikan | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Pegawai & Guru | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Data Siswa | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Siswa Baru | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Mutasi Siswa | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Kelulusan & Alumni | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Informasi Sekolah | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Laporan Lintas Unit | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Notifikasi Pribadi | Ya | Tidak | Ya (Tandai dibaca) | Tidak | Tidak | Tidak | Tidak |
| Profil Pribadi | Ya | Tidak | Ya (Data diizinkan) | Tidak | Tidak | Tidak | Tidak |

> **Catatan Proteksi**: Request HTTP dengan metode `POST`, `PUT`, `PATCH`, `DELETE` untuk data operasional akan ditolak otomatis oleh `EnsureFoundationReadOnly` middleware dengan respon `403 Forbidden`.
