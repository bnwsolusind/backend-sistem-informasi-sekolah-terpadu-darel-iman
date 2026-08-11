# AUDIT MODUL CHAT GURU & ORANG TUA (KOMUNIKASI SEKOLAH)

Dokumen ini berisi hasil audit menyeluruh terhadap struktur basis data, model, relasi, backend, API, frontend web dashboard, mobile app, dan permission untuk modul **Komunikasi Sekolah / Chat Guru**.

---

## 1. TABEL AUDIT FITUR & STRUKTUR DATA

| Fitur | Database | Model | Relasi | Backend | API | Web | Mobile | Permission | Status | Tindakan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Percakapan & Pesan** | `portal_messages` | `PortalMessage` | `sender()`, `recipient()`, `student()` | `StudentParentPortalController`, `TeacherPortalController` | `/api/portal/chat/*`, `/api/teacher/chat/*`, `/api/chat/*` | `ChatGuruWorkspace.jsx` | `ChatScreen.tsx` | `chat.conversation.*`, `chat.message.*` | Lengkap dan Berfungsi | Dihubungkan ke controller & frontend workspace |
| **Relasi Wali Kelas** | `tbl_kelas` (`wali_kelas_id`) | `Kelas` | `waliKelas()` | `StudentParentPortalController@chatContacts` | `/api/portal/chat/contacts` | `ChatGuruWorkspace.jsx` | `ChatScreen.tsx` | `chat.homeroom.view` | Lengkap dan Berfungsi | Diagregasi otomatis dari `tbl_kelas.wali_kelas_id` |
| **Relasi Guru Mapel** | `class_schedules` | `ClassSchedule` | `employee()`, `teacher()`, `subject()` | `StudentParentPortalController@chatContacts` | `/api/portal/chat/contacts` | `ChatGuruWorkspace.jsx` | `ChatScreen.tsx` | `chat.subject_teacher.view` | Lengkap dan Berfungsi | Diagregasi dari `class_schedules` aktif |
| **Konteks Multi-Anak** | `student_parents` | `ParentModel` | `students()`, `parentsPivot()` | `StudentParentPortalController@getStudentContext` | Query `child_id` / Header `X-Child-Id` | Selector Anak di Header Chat | Selector Child Chips | `parent.child.view` | Lengkap dan Berfungsi | Ownership validation terikat `user_id` ortu |
| **Konteks Multi-Unit** | `education_units` | `Student` | `educationUnit()` | Filter scope `education_unit_id` | Termasuk di payload API | Badge unit di Header Chat | Badge Unit | `parent.portal.view` | Lengkap dan Berfungsi | Mengikuti unit pendidikan anak aktif |
| **Notifikasi Pesan** | `notifications` | `Notification` | `user()` | Triggered on `sendChatMessage` | `/api/portal/notifications` | Toast & Badge Belum Dibaca | Push / Badge Count | `parent.notification.view` | Lengkap dan Berfungsi | Dipicu otomatis saat pengiriman pesan |

---

## 2. TEMFindings AUDIT TEKNIS

1. **Non-Breaking Schema**:
   - Berhasil memanfaatkan tabel `portal_messages` (migration `2026_08_02_120000_create_portal_messages_table.php`) tanpa membuat migration baru atau mengubah skema lama.
   - Relasi wali kelas bersumber dari `tbl_kelas.wali_kelas_id` -> `Employee` -> `User`.
   - Relasi guru mata pelajaran bersumber dari `class_schedules` -> `Employee` / `Teacher` -> `Subject` & `User`.

2. **Authorization & Security**:
   - `sender_user_id` secara ketat ditentukan dari `auth()->id()` pada backend (mencegah impersonasi pengirim).
   - Validasi hubungan orang tua dengan anak (`parentStudentsQuery` dan `getStudentContext`) mencegah IDOR dan kebocoran percakapan anak lain.

3. **User Experience (Modern Soft Standard)**:
   - UI/UX mengacu pada `MODERN_SOFT_MODULE_REFACTOR_PROMPT.md` dengan soft gradient, dark mode, chip filter (Semua, Wali Kelas, Guru Mapel, Belum Dibaca, Arsip), category pills, responsive desktop & mobile.
