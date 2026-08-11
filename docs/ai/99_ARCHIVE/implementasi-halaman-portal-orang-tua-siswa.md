# Dokumentasi Implementasi Halaman Portal Orang Tua & Siswa

Dokumen ini mencatat detail teknis dan struktur implementasi 13 halaman **Portal Orang Tua & Siswa** di Sistem Manajemen Sekolah Terpadu.

## 1. Arsitektur Komponen Frontend

Seluruh workspace portal berada pada direktori `web-dashboard/src/components/portal/`:

- `StudentProfileWorkspace.jsx`: Menampilkan biodata pribadi, akademik, orang tua, riwayat pendidikan, dan kartu QR siswa.
- `SchoolInformationWorkspace.jsx`: Pengumuman, agenda, berita, surat edaran, bookmark, dan status baca.
- `ClassScheduleWorkspace.jsx`: Jadwal pelajaran harian dan mingguan dengan filter hari dan pencarian mapel/guru.
- `MaterialsWorkspace.jsx`: Daftar materi & modul pembelajaran berstatus published dengan preview media dan download link.
- `AssignmentsWorkspace.jsx`: Monitoring penugasan, status pengumpulan, nilai guru, dan modal pengumpulan tugas siswa (teks & file).
- `TahfizhWorkspace.jsx`: Target hafalan semester, indikator progress %, hafalan terakhir, dan riwayat setoran.
- `GradesWorkspace.jsx`: Ringkasan nilai akhir per mata pelajaran, predikat A-D, indikator KKM tuntas/remedial.
- `TeacherCommentsWorkspace.jsx`: Catatan dan komentar guru terkelompok berdasarkan kategori (akademik, tugas, perilaku, dll).
- `MutabaahWorkspace.jsx`: Checklist harian ibadah siswa, kalkulasi persentase capaian, dan aksi simpan mandiri siswa.
- `AttendanceWorkspace.jsx`: Presensi pembelajaran, rekap statistik kehadiran, dan modal pengajuan izin/sakit siswa dengan bukti lampiran.
- `ExamGridsWorkspace.jsx`: Kisi-kisi ujian published dengan detail CP, TP, level kognitif, dan distribusi soal.
- `CbtExamsWorkspace.jsx`: Overview ujian CBT, modal instruksi, dan ruang pengerjaan CBT interaktif (timer, auto-save, auto-submit).
- `ExamResultsWorkspace.jsx`: Rekapitulasi hasil evaluasi CBT, nilai tugas, dan pengunduhan rapor PDF resmi.

## 2. Arsitektur Agregasi Backend

- `PortalStudentContextService.php`: Service sentral di `app/Services/PortalStudentContextService.php` yang mengelola:
  - Pembacaan header `X-Child-Id` / `child_id` untuk pergantian anak aktif (Orang Tua).
  - Pembacaan relasi pivot `student_parents` dan `parent_id`.
  - Pembacaan konteks akademik aktif (Tahun Ajaran & Semester).
- `StudentParentPortalController.php`: Controller utama di `app/Http/Controllers/Api/V1/StudentParentPortalController.php` yang melayani seluruh endpoint `/api/portal/*`.

## 3. Batasan Hak Akses (Authorization)

1. **Role Siswa**: Memiliki akses penuh baca & aksi mandiri (mengumpulkan tugas, mengisi checklist mutabaah, mengajukan izin, dan mengerjakan CBT).
2. **Role Orang Tua**: Memiliki akses baca penuh untuk anak yang terhubung, memilih anak aktif (Child Switcher), mengajukan izin/sakit atas nama anak, dan mengirim chat ke guru pengampu. Dilarang mengerjakan CBT atau mengirim tugas siswa.
