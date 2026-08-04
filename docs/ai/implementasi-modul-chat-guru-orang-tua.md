# DOKUMEN IMPLEMENTASI MODUL CHAT GURU & ORANG TUA (KOMUNIKASI SEKOLAH)

Modul **Komunikasi Sekolah / Chat Guru** menyediakan sarana komunikasi terpadu dua arah antara Orang Tua/Wali Murid dengan Guru Wali Kelas dan Guru Mata Pelajaran.

---

## 1. ALUR PENGGUNAAN (FLOW)

### A. Orang Tua (Multi-Anak)
1. Orang tua melakukan login ke portal.
2. Sistem mendeteksi daftar anak yang terhubung melalui relasi `parent_id` atau pivot `student_parents`.
3. Orang tua memilih **Anak Aktif** via header selector.
4. Menu **Chat Guru** memuat daftar kontak resmi:
   - **Wali Kelas**: Diambil dari `tbl_kelas.wali_kelas_id` kelas anak aktif.
   - **Guru Mapel**: Diambil dari jadwal pelajaran aktif `class_schedules` kelas anak.
5. Memilih kontak guru akan membuka obrolan langsung yang terikat dengan `student_id`.
6. Pengiriman pesan memicu pembaruan `portal_messages` dan mengirimkan notifikasi ke guru penerima.

### B. Guru (Wali Kelas & Guru Mapel)
1. Guru login ke portal/dashboard guru.
2. Mengakses tab **Komunikasi Orang Tua**.
3. Sistem mengambil seluruh percakapan di mana guru menjadi penerima atau pengirim pesan.
4. Percakapan dikelompokkan per kombinasi `(student_id, parent_user_id)`.
5. Guru dapat membaca, menyaring (Semua, Wali Kelas, Guru Mapel, Belum Dibaca), dan membalas pesan orang tua siswa.

---

## 2. KOMPONEN DAN FILE UTAMA

### Backend:
- `backend/app/Models/PortalMessage.php`: Model Eloquent percakapan.
- `backend/app/Http/Controllers/Api/V1/StudentParentPortalController.php`: API endpoint untuk portal orang tua (`chatContacts`, `chatMessages`, `sendChatMessage`).
- `backend/app/Http/Controllers/Api/V1/TeacherPortalController.php`: API endpoint untuk portal guru (`chatConversations`, `chatMessages`, `sendChatMessage`).
- `backend/routes/api.php`: Pendaftaran rute API `/api/portal/chat/*`, `/api/teacher/chat/*`, dan `/api/chat/*`.
- `backend/database/seeders/RolePermissionSeeder.php`: Seeder permission Spatie untuk hak akses chat.

### Frontend Web Dashboard:
- `web-dashboard/src/components/portal/ChatGuruWorkspace.jsx`: Komponen UI/UX percakapan terpadu (Modern Soft Standard).
- `web-dashboard/src/pages/ParentPortalPage.jsx`: Integrasi modul chat di portal orang tua.
- `web-dashboard/src/pages/TeacherTeachingWorkspacePage.jsx`: Integrasi modul chat di workspace guru.
- `web-dashboard/src/layouts/DashboardLayout.jsx`: Submenu navigasi sidebar.
- `web-dashboard/src/services/familyPortalService.js`: Service API frontend.

### Mobile App:
- `mobile-app/src/screens/ChatScreen.tsx`: Layar chat React Native Expo.
- `mobile-app/src/services/mobileApiService.ts`: Service API mobile app.
