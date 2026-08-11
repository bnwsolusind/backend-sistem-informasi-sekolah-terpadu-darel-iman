# CLASS ROMBEL FLOW

```text
UNIT PENDIDIKAN
-> TAHUN AJARAN
-> SEMESTER
-> tbl_kelas (Kelas/Rombel aktif)
-> WALI KELAS (employees.wali_kelas_id)
-> students.kelas_id
-> Jadwal/Presensi/Akademik/Portal
```

SOURCE OF TRUTH: `Kelas` dengan tabel `tbl_kelas`. Tidak ada model atau tabel Rombel terpisah. Tabel legacy `classes` dan `students.class_id` dipertahankan hanya untuk kompatibilitas lama.

ATURAN TERVERIFIKASI:
- Create/update siswa menyimpan `kelas_id`, bukan `class_id` legacy.
- Kelas yang dipilih wajib berasal dari `unit_pendidikan_id` sama dengan `students.unit_id`.
- Akun Unit A yang mengirim kelas Unit B menerima 403.
- List kelas Unit B tidak terlihat oleh user Unit A.

HISTORY: Tidak ditemukan tabel riwayat penempatan siswa–kelas/rombel pada audit ini.

STATUS: RELATION FIXED untuk penempatan aktif; riwayat pemindahan dan pengelolaan rombel terpisah adalah BLOCKED BY DEPENDENCY karena struktur tidak tersedia.