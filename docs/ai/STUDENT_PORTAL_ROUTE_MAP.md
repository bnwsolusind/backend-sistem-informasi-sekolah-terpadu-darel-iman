# STUDENT PORTAL — ROUTE MAP (SESI 11)

Peta lengkap rute Portal Siswa: backend (API) + frontend (route/komponen). Verifikasi terakhir: 2026-08-06.

## 1. BACKEND — Rute API `/api/portal/*`

Middleware group: `auth:sanctum` + `role:Orang Tua|Siswa` (routes/api.php:759).

| METHOD | PATH | CONTROLLER METHOD | ROLE | CATATAN SELF-SCOPE |
|---|---|---|---|---|
| GET | `/api/portal/dashboard` | `dashboard` | Orang Tua/Siswa | `getStudentContext` (parent child-switch aman) |
| GET | `/api/portal/children` | `children` | Orang Tua/Siswa | anak dari `parent_id`/`parentsPivot` milik user; siswa → dirinya sendiri |
| GET | `/api/portal/profile` | `profile` | Orang Tua/Siswa | profil user |
| GET | `/api/portal/schedules` | `schedules` | Orang Tua/Siswa | scoped student class |
| GET | `/api/portal/attendance` | `attendance` | Orang Tua/Siswa | scoped `student_id` |
| POST | `/api/portal/permissions` | `submitPermission` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/permissions` | `permissionsHistory` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/materials` | `materials` | Orang Tua/Siswa | scoped student class |
| GET | `/api/portal/assignments` | `assignments` | Orang Tua/Siswa | scoped `class_id` + `status=published` |
| POST | `/api/portal/assignments/{id}/submit` | `submitAssignment` | **Siswa** | self via `updateOrCreate(penugasan_id, siswa_id=self)`; + guard kelas & publikasi (baru S11) |
| GET | `/api/portal/grades` | `grades` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/tahfizh` | `tahfizh` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/mutabaah` | `mutabaah` | Orang Tua/Siswa | scoped student |
| POST | `/api/portal/mutabaah` | `saveMutabaahStudent` | **Siswa** | scoped; butuh assignment aktif |
| GET | `/api/portal/student-notes` | `studentNotes` | Orang Tua/Siswa | parent→`visible_to_parent`, siswa→`visible_to_student` |
| POST | `/api/portal/student-notes/{id}/sign` | `signStudentNote` | Orang Tua/Siswa | **hanya Orang Tua terhubung** (baru S11; siswa → 403) |
| GET | `/api/portal/achievements` | `achievements` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/announcements` | `announcements` | Orang Tua/Siswa | publikasi umum |
| GET | `/api/portal/school-information` | `schoolInformation` | Orang Tua/Siswa | publikasi umum |
| GET | `/api/portal/school-information/summary` | `schoolInformationSummary` | Orang Tua/Siswa | — |
| PATCH | `/api/portal/school-information/read-all` | `markAllSchoolInformationRead` | Orang Tua/Siswa | scoped student |
| PATCH | `/api/portal/school-information/{id}/state` | `updateSchoolInformationState` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/notifications` | `notifications` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/bills` | `bills` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/reports` | `reports` | Orang Tua/Siswa | hanya `published` |
| GET | `/api/portal/reports/{id}/download` | `downloadReport` | Orang Tua/Siswa | scoped + published |
| GET | `/api/portal/chat/contacts` | `chatContacts` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/chat/available-teachers` | `chatContacts` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/chat/{teacherUserId}` | `chatMessages` | Orang Tua/Siswa | scoped `student_id` |
| POST | `/api/portal/chat/{teacherUserId}` | `sendChatMessage` | Orang Tua/Siswa | scoped student |
| GET | `/api/portal/lms/exams` | `examOverview` | Orang Tua/Siswa | read-only; **tanpa kunci/soal** |
| GET | `/api/portal/exam-grids` | `examGrids` | Orang Tua/Siswa | kisi publik |
| GET | `/api/portal/results` | `results` | Orang Tua/Siswa | nilai di-redact bila `tampilkan_nilai_langsung=false` |
| POST | `/api/portal/lms/exams/{id}/start` | `startExam` | **Siswa** | `getAuthenticatedStudent` (auth-only, NO `student_id` request) |
| POST | `/api/portal/lms/exam-sessions/{sesiId}/answers` | `saveExamAnswers` | **Siswa** | ownership + allowlist soal kisi-kisi |

## 2. BACKEND — Rute CBT legacy `/api/lms/*` (di-hardening S11)

Middleware: `auth:sanctum` saja (routes/api.php:127) → **siapa pun yang login** bisa memanggil.
Hardening Sesi 11 menutup celah:

| METHOD | PATH | STATUS SEBELUM | STATUS SESUDAH S11 |
|---|---|---|---|
| GET/POST/... | `/api/lms/bank-soal*` | Kunci jawaban/pembahasan bocor ke siswa/ortu | `LmsBankSoalResource` redact `kunci_jawaban`/`pasangan_menjodohkan`/`pembahasan` utk role Siswa/Orang Tua/Alumni |
| POST | `/api/lms/ujian/{id}/start-session` | fallback `Student::first()` → sesi atas nama siswa sewenang-wenang; tanpa gate jadwal/attempt | non-Siswa wajib staff + `siswa_id` eksplisit; gate jadwal & `max_attempt`; tanpa fallback |
| POST | `/api/lms/ujian/sesi/{id}/submit-answers` | ownership dicek HANYA utk role Siswa | ownership fail-closed untuk semua (staff boleh proktor) |
| POST | `/api/lms/ujian/sesi/{id}/finish-session` | bocor `nilai_final` walau `tampilkan_nilai_langsung=false` | nilai di-redact sampai `tampilkan_nilai_langsung=true` |
| GET | `/api/lms/ujian/{id}/results` | seluruh scoreboard siswa bocor ke siapa pun | staff-only (403 utk lain) |
| POST | `/api/lms/ujian/jawaban/{id}/grade-essay` | siapa pun bisa menilai | staff-only |
| POST | `/api/lms/ujian/sesi/{id}/submit-answers` | timer tidak ditegakkan | `saveJawabanSesi` menolak setelah deadline (durasi_menit) |

## 3. FRONTEND — Route `/portal-siswa` (src/routes/index.jsx)

Satu shell `StudentPortalPage` + prop `section` (14 subroute, bukan title-swap generic).

| PATH | SECTION | KOMPONEN |
|---|---|---|
| `/portal-siswa` | `ringkasan` | `StudentPortalPage` |
| `/portal-siswa/profil` | `profile` | `StudentPortalPage` |
| `/portal-siswa/informasi-sekolah` | `announcements` | `StudentPortalPage` |
| `/portal-siswa/jadwal` | `schedules` | `StudentPortalPage` |
| `/portal-siswa/materi` | `materials` | `StudentPortalPage` |
| `/portal-siswa/tugas` | `assignments` | `StudentPortalPage` |
| `/portal-siswa/tahfizh` | `tahfizh` | `StudentPortalPage` |
| `/portal-siswa/nilai` | `grades` | `StudentPortalPage` |
| `/portal-siswa/komentar-guru` | `student-notes` | `StudentPortalPage` |
| `/portal-siswa/mutabaah` | `mutabaah` | `MutabaahWorkspace` |
| `/portal-siswa/absensi` | `attendance` | `StudentPortalPage` |
| `/portal-siswa/kisi-kisi` | `kisi` | `StudentPortalPage` |
| `/portal-siswa/ujian-cbt` | `ujian` | `StudentPortalPage` |
| `/portal-siswa/hasil` | `hasil` | `StudentPortalPage` |

Route `/portal-orangtua` → `ParentPortalPage`; alias `/portal/siswa` & `/portal/orangtua` juga terdaftar.

## 4. MASALAH FRONTEND TERKAIT (S11)

- Bell notifikasi di `DashboardLayout.jsx` memakai mock `notifikasiItems` (baris 552) untuk semua role → **mock data belum diganti API real** (lihat REMAINING_ISSUES).
- Tombol "Notifikasi" sebelumnya navigate `/notifications` (mati utk siswa) → **S11**: siswa/ortu diarahkan `/portal-siswa/informasi-sekolah`.
- `MutabaahWorkspace.jsx` mock `DEFAULT_ACTIVITIES` → **DIBUANG S11** (kini data asli dari API; checklist kosong bila belum ada agenda aktif).

## 5. VERIFIKASI

- Full suite: `246 passed / 947 assertions / 0 failure / 0 error` (baseline 227/878).
- Guard 6 filter critical: `25 passed / 100 assertions`.
- `StudentCbtSecurityHardeningTest` (baru): `11 passed / 38 assertions` (SQLite & PG 14).
- Portal group di PostgreSQL 14: `34 passed / 161 assertions` (seluruh endpoint portal HIJAU di PG).
