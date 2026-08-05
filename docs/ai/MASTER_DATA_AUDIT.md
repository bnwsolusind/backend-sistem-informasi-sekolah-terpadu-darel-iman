# MASTER DATA AUDIT — SESSION 2

## Temuan 2026-08-05

TEMUAN: CRUD siswa mengirim dan menyimpan `class_id` legacy, bukan `kelas_id` aktif.
SEVERITY: Critical
MODUL: Siswa dan Kelas/Rombel
ROLE: Role dengan `kesiswaan.data_lengkap_siswa`
ROUTE: `/dashboard/students`, `/api/students`
TABLE: `students`, `tbl_kelas`
REPRODUKSI: Buat siswa dengan pilihan kelas; `students.kelas_id` sebelumnya null sehingga jadwal/presensi aktif tidak dapat memakai relasi.
AKAR MASALAH: Form, request validation, controller, repository, dan dashboard masih mengarah ke `classes`/`class_id` legacy.
PERBAIKAN: Kontrak aktif dialihkan ke `kelas_id -> tbl_kelas.id`; dropdown memakai `/api/kelas`; class assignment tervalidasi terhadap unit siswa.
TEST: `StudentUnitScopeAccessTest` PASS termasuk create kelas aktif dan penolakan kelas lintas unit.
STATUS: RELATION FIXED.

TEMUAN: Halaman siswa memiliki fallback daftar demo dan preview/import sukses palsu.
SEVERITY: High
MODUL: Siswa
AKAR MASALAH: Data statis dipakai saat API kosong dan import tidak memiliki endpoint backend.
PERBAIKAN: Daftar kosong kini tetap kosong; aksi import tidak memproses file/menampilkan sukses tanpa endpoint.
STATUS: UI STATE FIXED; import siswa BLOCKED BY DEPENDENCY.

TEMUAN: CRUD parent dan attach/detach pivot belum terdaftar pada route API internal.
SEVERITY: High
MODUL: Orang Tua/Wali
AKAR MASALAH: Model/pivot tersedia, namun controller/route internal tidak ditemukan.
STATUS: BLOCKED BY DEPENDENCY.