# 05-AUDIT ROLE PERMISSION — SIMSIT

## Matriks Matang Hak Akses & Scope Data SIMSIT

### 1. Tingkatan Akses (Access Hierarchy)
1. **Kelola (Full Operational)**: Tambah, lihat, edit, verifikasi, finalisasi, hapus (dengan approval), dan export data.
2. **Monitoring (Read-Only / Agregat)**: Melihat dashboard, tren statistik, detail, dan laporan tanpa mengubah transaksi.
3. **Akses Pribadi (Self / Ownership Scope)**: Hanya mengakses data diri sendiri, kelas yang diampu, atau anak terhubung.

---

## Tabel Hak Akses Modul Utama per Role

| Role | Dashboard | Master Data | Absensi Digital | Tahfizh & Mutabaah | LMS & Akademik | Finance / Rapor | Approval / System |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Kelola | Kelola | Kelola | Kelola | Kelola | Kelola | Global Bypass & All Grants |
| **Yayasan / Pengurus** | Monitoring | Monitoring | Monitoring | Monitoring | Monitoring | Monitoring | Read-Only Protected |
| **Kepala Sekolah** | Monitoring | Monitoring Unit | Kelola Unit | Monitoring Unit | Monitoring Unit | Monitoring Unit | Approval Unit |
| **Divisi Pendidikan** | Monitoring | View Scope | View Scope | View Scope | Kelola Kurikulum | View Scope | - |
| **Tata Usaha (TU)** | View | Kelola Unit | Kelola Absensi | View | Kelola Akademik | Kelola Tagihan | - |
| **Guru / Wali Kelas** | View | View | Presensi Mapel | Presensi Rombel | Kelola Materi/Tugas | View Nilai | - |
| **Guru Tahfizh** | View | View | - | Kelola Setoran | - | - | - |
| **Orang Tua / Siswa** | Akses Pribadi | - | View Self | View Self | View Self | View Self | - |

---

## Mekanisme Keamanan Scope Data & IDOR Protection

1. **Super Admin Bypass (`Gate::before`)**:
   ```php
   Gate::before(function ($user, $ability) {
       return $user->hasRole('Super Admin') ? true : null;
   });
   ```

2. **Parent-Student Ownership Filter**:
   - API Ortu (`/api/portal/*`) memverifikasi relasi `student_parent_pivot` untuk mencegah pemanggilan data anak lain (IDOR Protection).

3. **Foundation Read-Only Guard**:
   - Middleware `EnsureFoundationReadOnly` menolak aksi `POST`, `PUT`, `PATCH`, `DELETE` dari role Pengurus Yayasan pada endpoint operasional.
