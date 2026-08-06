# LOG PERBAIKAN BUG (BUG FIX LOG) — SESI 8 + SESI 9 + SESI 10 + SESI 11

Tanggal: 2026-08-06  
Status Sesi 8: PASSED (GO TO SESSION 9)  
Status Sesi 9: DASHBOARD AUDIT & PERBAIKAN — SELESAI (lihat log Sesi 9 di bawah)  
Status Sesi 10: PARENT PORTAL (P0–P24) — SELESAI (lihat log Sesi 10 di bawah)  
Status Closure Sesi 10: **SELESAI — 5 failure pra-eksisting ditutup, 227 passed / 0 failed** (lihat log Closure di bawah)  
Status Sesi 11: **STUDENT PORTAL HARDENING — SELESAI, 237 passed / 0 failed** (lihat log Sesi 11 di bawah)

---

## LOG PERBAIKAN BUG — SESI 11 (STUDENT PORTAL SECURITY & CORRECTNESS)

| # | ISSUE ID | DESKRIPSI ISSUE | SEVERITY | CAUSE / ROOT CAUSE | RESOLUTION / FIX | STATUS | VERIFIKASI TEST |
|---|---|---|---|---|---|---|---|
| 1 | BUG-S11-01 | Kunci jawaban & pembahasan bank soal bocor ke siswa/ortu via `/api/lms/bank-soal*` (auth:sanctum) | Critical | `LmsBankSoalResource` selalu menyertakan `kunci_jawaban`/`pasangan_menjodohkan`/`pembahasan` | Redact key utk role Siswa/Orang Tua/Alumni; guru/staf tetap menerima kunci | FIXED | `StudentCbtSecurityHardeningTest::test_answer_key_not_leaked_to_student_or_parent` + `test_teacher_still_receives_answer_key` |
| 2 | BUG-S11-02 | Legacy `startSession` memakai fallback `Student::first()` utk non-Siswa | Critical | Resolusi siswa di controller tanpa verifikasi kepemilikan | Non-Siswa wajib staff + `siswa_id` eksplisit; fallback otomatis dihapus; + gate jadwal & `max_attempt` | FIXED | `test_legacy_start_session_rejects_non_staff_without_siswa_id` |
| 3 | BUG-S11-03 | `submitAnswers`/`finishSession` legacy melewati ownership utk non-Siswa | Critical | Cek ownership hanya dijalankan bila `hasRole('Siswa')` | `canAccessSession()` fail-closed utk semua: pemilik siswa ATAU staff (proktor); lainnya 403 | FIXED | `test_answers_cannot_be_submitted_to_foreign_session` |
| 4 | BUG-S11-04 | `/api/lms/ujian/{id}/results` membocorkan scoreboard semua siswa | High | `hasilUjian()` dipanggil tanpa guard | Staff-only (`isStaffUser`) | FIXED | `test_results_endpoint_is_staff_only` |
| 5 | BUG-S11-05 | Nilai final bocor saat finish walau `tampilkan_nilai_langsung=false` | High | `LmsUjianSesiResource` penuh dikirim di `finishSession`; `$showScore` tak terdefinisi di portal `finishExam` | Legacy `finishSession` & portal `finishExam` kini redact nilai sampai `tampilkan_nilai_langsung=true`; portal `$showScore` dibenahi | FIXED | `test_portal_finish_hides_score_until_published` (portal) + suite CBT |
| 6 | BUG-S11-06 | Timer ujian tidak ditegakkan pada save/submit | High | `saveJawabanSesi` tanpa cek deadline | Tolak simpan setelah `waktu_mulai + durasi_menit` | FIXED | `test_submit_after_timer_expiry_is_rejected` |
| 7 | BUG-S11-07 | Percobaan `proses` ganda via race (TOCTOU); tanpa unique constraint | Medium | Hanya index non-unique `(ujian_id, siswa_id)` | Partial unique index `(ujian_id, siswa_id) WHERE status='proses'` (PG/SQLite) + de-duplikasi data lama + `startSesiUjian` race-safe (catch unique violation → resume) | FIXED | `test_duplicate_proses_attempt_is_resumed_not_duplicated` + migrasi `2026_08_06_120000` |
| 8 | BUG-S11-08 | `gradeEssay` legacy dapat dipanggil pengguna mana pun | Medium | Tanpa guard role | Staff-only (`isStaffUser`) | FIXED | suite CBT (`grade-essay` guru tetap 200) |
| 9 | BUG-S11-09 | Siswa dapat menandatangani catatan guru sebagai Orang Tua | Medium | Validasi parent hanya dijalankan bila `$parent` ada | Wajib parent terhubung; siswa → 403 | FIXED | `test_sign_student_note_rejected_for_student` |
| 10 | BUG-S11-10 | Siswa dapat mengumpulkan tugas ke penugasan kelas lain | Medium | `submitAssignment` tanpa cek kelas/publikasi | Guard kelas (kelas_id/class_id siswa) + status publikasi | FIXED | `test_portal_submit_assignment_rejects_other_class` |
| 11 | BUG-S11-11 | Tautan "Notifikasi" di layout mengarah `/notifications` (mati utk siswa) | Low | Navigasi global tanpa branch role | Siswa/ortu → `/portal-siswa/informasi-sekolah` | FIXED | `npm run lint` + `npm run build` |
| 12 | BUG-S11-12 | Mock `DEFAULT_ACTIVITIES` di MutabaahWorkspace (UI menampilkan aktivitas palsu) | Low | Fallback hardcoded saat header mutabaah kosong | Dibuang; UI kini menampilkan data asli API (kosong bila belum ada agenda) | FIXED | `npm run lint` + `npm run build` |

---

## LOG PERBAIKAN BUG — CLOSURE SESI 10

| # | ISSUE ID | DESKRIPSI ISSUE | SEVERITY | CAUSE / ROOT CAUSE | RESOLUTION / FIX | STATUS | VERIFIKASI TEST |
|---|---|---|---|---|---|---|---|
| 1 | BUG-S10C-01 | Force-delete template terpakai gagal (test F1) | High | Fixture memakai kolom non-eksisten `date`; `supervisor_assignment_id` wajib kosong; **forceDelete tanpa route HTTP** | Rantai dependensi valid + route `DELETE /api/mutabaah/enterprise/{resource}/{id}/force` (routes/api.php:231) → `assertNotUsed()` 409 | FIXED | `MutabaahCrudFullExecutionTest::test_used_template_cannot_be_force_deleted` |
| 2 | BUG-S10C-02 | Fixture kelas memakai kolom salah (test F2/F4) | Medium | `Kelas::create` memakai `education_unit_id` (tidak fillable); kolom asli `unit_pendidikan_id` + wajib `tahun_ajaran_id`/`semester_id`/`jenjang`/`tingkat`; payload `kelas_id` menunjuk `tbl_kelas` bukan `classes` | Fixture mengikuti skema konvensi; payload memakai `SchoolClass` | FIXED | `test_tu_can_create_template_assignment_and_conflict_is_rejected`, `test_tahfizh_progress_merges_overlapping_verse_intervals_correctly` |
| 3 | BUG-S10C-03 | Fixture signature parent memakai kolom fiktif (test F3) | Medium | Kolom `date/status/notes_parent/student_id` tidak ada; asli `daily_header_id+parent_user_id+signature_status+comment+signed_at` (enum approved/clarification_requested/unable_to_verify) | Fixture signature mengikuti skema & enum asli + FK header | FIXED | `MutabaahCrudFullExecutionTest::test_parent_monitoring_reads_real_signatures` |
| 4 | BUG-S10C-04 | Ekspektasi status 403 vs 404 anak tak terhubung (test F5) | Low | Konvensi portal fail-closed (anti existence-leak): anak tak terhubung → 404; 403 hanya utk terhubung-belum-publikasi | Ekspektasi diselaraskan ke 404 dengan rasional terdokumentasi (bukan melemahkan assertion) | FIXED | `TahfizhCalculationAndOwnershipTest::test_parent_cannot_sign_note_for_unlinked_student` |
| 5 | BUG-S10C-05 | Upsert header mutabaah: entri kedua dalam sehari → 500 UNIQUE | High | `firstOrCreate(['activity_date' => 'YYYY-MM-DD'])` ≠ nilai tersimpan `'...00:00:00'` (SQLite) | `Carbon::parse($date)->startOfDay()` di `saveMutabaahStudent` & `MutabaahDailyService::header()` | FIXED | `MutabaahPortalGateTest::test_duplicate_daily_entry_is_upserted_to_same_header` |
| 6 | BUG-S10C-06 | Penulisan notifikasi gagal senyap (skema ganda legacy vs partitioned) | High | Penulis memakai kolom legacy (`user_id/type/message/is_read`) yang tidak ada di skema kanonik partitioned; tertutup try/catch | Satu konvensi kanonik `Notification::deliver()` mengisi partition key (AY+semester aktif + bulan); `unread` = `read_at IS NULL` | FIXED | `NotificationDualSchemaWriteTest` (3 test) |
| 7 | BUG-S10C-07 | Migration `fix_tbl_kelas_kode_unique_composite` tidak portabel ke PG | Medium | `having('cnt','>',1)` (alias tidak valid di HAVING PG) + `DROP INDEX` utk index milik UNIQUE CONSTRAINT | `havingRaw('count(*) > 1')` + `ALTER TABLE ... DROP CONSTRAINT IF EXISTS` | FIXED | Full `php artisan migrate --force` di PostgreSQL sukses & idempotent |
| 8 | BUG-S10C-08 | Fixture gender `'L'/'P'` melanggar CHECK PG `students_gender_check` | Medium | PG menegakkan `CHECK (gender IN ('male','female'))`; fixture memakai `'L'/'P'` (valid di SQLite tanpa CHECK) | 5 lokasi fixture diganti ke `male`/`female` (MC:166,442; TF:71,121,179) | FIXED | 5 target test di PG `sms_closure_testing`: 10 passed / 25 assertions |
| 9 | BUG-S10C-09 | `children` portal tanpa ORDER BY → urutan tidak deterministik lintas engine | Low | Tanpa ORDER BY: SQLite = urutan sisip, PG = acak → assertion `data.0`/`data.1` gagal di PG | `orderBy('created_at','asc')`; fixture test memakai `forceFill` created_at berbeda | FIXED | `StudentParentPortalChildSwitchingTest` di PG: PASS |
| 10 | BUG-S10C-10 | `MutabaahPortalAccessTest` merusak DB PG yang sudah termigrasi + FK user | Medium | `Schema::create` tanpa guard → `42P07 duplicate table`; user `make()` (tidak persist) → `23503 FK parents/students.user_id` | `hasTable` guard untuk skema minimal (+ tabel `users` minimal + kolom `gender`); user dibuat via `create` | FIXED | `MutabaahPortalAccessTest` di PG: PASS |
| 11 | BUG-S10C-11 | `EmployeeAttendanceService` tidak mengisi partition key `attendances` (PG) | High | Tabel partitioned PG mewajibkan `academic_year_id/semester_id/month`; service absensi login hanya mengisi `month` → `23502 Not null` | Resolve tahun ajaran + semester aktif (pola kanonik sama `Notification::deliver()`); null bila belum ada (kompatibel SQLite) | FIXED | `MultiPortalAuthTest` di SQLite PASS; PG tersisa batasan DDL (lihat 6c closure report) |

---

## LOG PERBAIKAN BUG & DISKONTINUITAS INTEGRASI — SESI 10 (PARENT PORTAL)

| # | ISSUE ID | DESKRIPSI ISSUE | SEVERITY | CAUSE / ROOT CAUSE | RESOLUTION / FIX | STATUS | VERIFIKASI TEST |
|---|---|---|---|---|---|---|---|
| 1 | BUG-S10-01 | `student_notes` skema legacy tidak kompatibel model Portal | Critical | Migration core `2026_07_21_030000` membuat `note` NOT NULL tanpa kolom portal; migration kaya `2026_08_02_100000` dilewati (`hasTable`) → kolom `title/content/visible_*` tidak ada di produksi | Migration rekonsiliasi idempotent `2026_08_06_100000_reconcile_student_notes_for_parent_portal`: tambah kolom portal + signature, longgarkan `note`, migrasi `note→content`, backfill | FIXED | `migrate --force` scratch SQLite; `StudentNote::create` di test schema |
| 2 | BUG-S10-02 | `saveMutabaahStudent` pakai `entry_date` (kolom salah) + NOT NULL `supervisor_assignment_id`/`template_id` | High | Kolom asli `activity_date`; insert header tanpa assignment → NOT NULL constraint | Tulis `activity_date`; isi seluruh kolom wajib dari assignment aktif + template | FIXED | `test_student_cannot_submit_mutabaah_without_active_assignment` |
| 3 | BUG-S10-03 | Siswa dapat membuat checklist mutabaah tanpa agenda supervisor aktif | High | Tidak ada gate assignment | Assignment aktif (status + rentang tanggal + unit) wajib; tanpa → 422 | FIXED | Sama dengan di atas (422 tanpa assignment, 200 dengan) |
| 4 | BUG-S10-04 | `signStudentNote` tidak mendeteksi perubahan isi & tidak persist hash | Medium | Tidak ada digest konten; status dihitung dari `now()` | `signature_content_hash` (SHA-256 `trim(content)`); status `signed`/`signed_updated` dihitung per fetch; persist `signed_by_user_id`/`signed_at` | FIXED | `test_parent_signature_detects_content_change_on_note` |
| 5 | BUG-S10-05 | `notifications()` hardcode kolom `user_id` tidak ada di skema legacy PG | High | Skema dual (modern `user_id` vs partitioned `notifiable_id`/`body`) | Guard `Schema::hasColumn` memilih jalur query valid; tambah child scope per `notifiable_type` | FIXED | `test_notifications_endpoint_is_stable_for_parent_without_records` |
| 6 | BUG-S10-06 | `dashboard()` mengembalikan kode status 440 (typo) | Medium | Salah ketik status code saat konteks anak invalid | Diseragamkan menjadi 404 | FIXED | `test_child_scoped_endpoints_reject_unlinked_child` |
| 7 | BUG-S10-07 | `examOverview` (CBT monitoring) tidak child-scoped untuk orang tua | Medium | Memakai `getAuthenticatedStudent` (identitas akun) → orang tua dapat 403/identitas keliru | Gunakan `getStudentContext` (child-scoped); start/save/finish tetap `role:Siswa` | FIXED | Lint + review route |
| 8 | BUG-S10-08 | Login parent-student tanpa batas percobaan | High | Route tanpa rate limiter → brute-force password/PIN | `throttle:10,1` pada `/auth/login/parent-student` & `/v2/auth/login/parent-student` | FIXED | `MultiPortalAuthTest` (regresi) |
| 9 | BUG-S10-09 | Child switcher: anak aktif tidak persisten & flash data anak lama | Medium | State hanya in-memory; data section lama tidak direset saat switch | Persist `?child=` (replace) + reset state data per switch; `selectTab` mempertahankan `child` | FIXED | `npm run lint` (0 error) + `npm run build` |

---

## LOG PERBAIKAN BUG & DISKONTINUITAS INTEGRASI — SESI 9 (DASHBOARD)

| # | ISSUE ID | DESKRIPSI ISSUE | SEVERITY | CAUSE / ROOT CAUSE | RESOLUTION / FIX | STATUS | VERIFIKASI TEST |
|---|---|---|---|---|---|---|---|
| 1 | BUG-S9-01 | Grup route `dashboard-pemantauan` tanpa middleware `can:` | Critical | Route group tidak memiliki permission guard, akses data pemantauan terbuka untuk user terautentikasi mana pun | Tambah `middleware('can:dashboard.pemantauan.lihat')` pada group; pastikan route read wajib permission lihat | FIXED | `DashboardRoleAccessTest::test_pemantauan_ringkasan_requires_pemantauan_permission` |
| 2 | BUG-S9-02 | `DashboardPemantauanController::pastikanHakAkses` hardcode role list yang mengkontradiksi permission map | High | `ROLE_AKSES = [Super Admin, Kepala Sekolah, Divisi Pendidikan, Guru]` memblokir Yayasan & Admin padahal seeder memberi `dashboard.pemantauan.lihat` | Ganti pemeriksaan role dengan pemeriksaan permission (`can:dashboard.pemantauan.lihat` / `.kelola`) | FIXED | Sama dengan di atas (Yayasan & Admin 200, Guru 403) |
| 3 | BUG-S9-03 | Fallback Admin merender `DashboardPage` yang memanggil `/foundation/dashboard` (403 untuk Admin) | High | MultiRoleDashboardPage tidak menangani Admin/Yayasan yang punya pemantauan permission | Fallback tanpa dashboard khusus kini `Navigate` ke `/dashboard/pemantauan` bila punya `dashboard.pemantauan.lihat`; tanpa permission tampil halaman "Akses Dashboard Tidak Tersedia" | FIXED | `npm run lint` (0 error) + `npm run build` |
| 4 | BUG-S9-04 | `/dashboard/pemantauan` frontend route tanpa permission gate | Medium | Sembarang user dapat membuka halaman MonitoringDashboardPage (batal data saat API 403) | Bungkus route dengan `<PermissionElement any={['dashboard.pemantauan.lihat']}>` | FIXED | `npm run build` |
| 5 | BUG-S9-05 | `tbl_kelas.unit_id` di scope foundation & kepsek dashboard | High | `Kelas::where('unit_id', ...)` memakai kolom yang tidak ada (kolom sebenarnya `unit_pendidikan_id`) | Ganti ke `unit_pendidikan_id`; hapus `orWhere('unit_id',...)`; scope siswa/orang tua ke unit terpilih | FIXED | `DashboardRoleAccessTest` (foundation & kepsek pass) |
| 6 | BUG-S9-06 | IDOR / scope leak `class_id` di Wali Kelas dashboard | High | `class_id` dari request diterima tanpa validasi kepemilikan | Filter hanya diterima bila masuk daftar `$allowedClassIds`; `selectedClass` dari homeroom classes | FIXED | `DashboardRoleAccessTest::test_wali_kelas_class_id_outside_scope_is_ignored` |
| 7 | BUG-S9-07 | Guru Tahfizh tanpa assignment menampilkan semua siswa | High | Fallback `Student::all()` saat tidak ada data setoran | Pakai `count($assignedStudentIds)` → tampil 0, bukan bocor data siswa | FIXED | `DashboardRoleAccessTest::test_guru_tahfizh_without_assignment_returns_zero` |
| 8 | BUG-S9-08 | `/portal-siswa` index merender dashboard GURU | Critical | Route index `/portal-siswa` semula `element: <TeacherStudentPortalDashboardPage />` | Ganti dengan `<StudentPortalPage section="ringkasan" />` | FIXED | `npm run build` |
| 9 | BUG-S9-09 | Waka Kesiswaan & Tata Usaha attendance/student note tidak di-scope ke unit | Medium | Query global tanpa filter unit | `StudentNote` + `rekap_prestasi_siswas` + attendance di-scope `whereIn('student_id', $studentIds)` per unit | FIXED | `DashboardRoleAccessTest` |
| 10 | BUG-S9-10 | `TeacherPortalController` unverified mutabaah count global | Medium | Count mutabaah tanpa filter supervisor assignment user | Scope ke `whereIn('supervisor_assignment_id', $assignmentIds)` milik employee user | FIXED | `TeacherPortalApiTest` (role Guru) |

---

## LOG PERBAIKAN BUG & DISKONTINUITAS INTEGRASI — SESI 8

| # | ISSUE ID | DESKRIPSI ISSUE | SEVERITY | CAUSE / ROOT CAUSE | RESOLUTION / FIX | STATUS | VERIFIKASI TEST |
|---|---|---|---|---|---|---|---|
| 1 | BUG-S8-01 | UUID Relation Type Mismatch | Critical | Foreign Key type inconsistency across legacy migrations | Aligned UUID primary keys and foreign keys in model relations and schema definitions | FIXED | `DatabaseRelationIntegrityTest` |
| 2 | BUG-S8-02 | Teacher Schedule Access Overflow | Critical | Teacher access policy lacked explicit schedule ownership filter | Enforced teacher employee ID verification in ClassScheduleService | FIXED | `TeacherPortalApiTest` |
| 3 | BUG-S8-03 | Parent Portal Child Switcher Sync Lag | High | Frontend cache key missing `child_id` query dependency | Added reactive query key dependency `[child_id, activeTab]` in ParentPortalPage | FIXED | `StudentParentPortalOwnershipTest` |
| 4 | BUG-S8-04 | CBT Answer Key Exposure in API Payload | High | Question bank resource included `correct_answer` field in student payload | Stripped `correct_answer` from student test submission endpoints | FIXED | `LmsSesi5AssignmentsAndCbtTest` |
| 5 | BUG-S8-05 | Photo/Avatar URL Storage Storage Double Prefix | Medium | Photo accessor concatenated `/storage/` twice on relative asset path | Sanitized `photo_url` accessor in Student and Employee models | FIXED | `StudentPhotoUrlTest` |
| 6 | BUG-S8-06 | PostgreSQL Group By Aggregation Error | High | Raw query select lists included unaggregated columns without Group By | Standardized `GROUP BY` column list to comply with PostgreSQL 17 strict SQL | FIXED | `DatabaseRelationIntegrityTest` |
| 7 | BUG-S8-07 | Mutabaah Parent Signature Sync Disconnect | Medium | Parent signature endpoint failed to invalidate mutabaah analytics cache | Added explicit cache tag/key invalidation on signature submission | FIXED | `MutabaahCrudFullExecutionTest` |
| 8 | BUG-S8-08 | Student Mutation Data Leak to Active Attendance | High | Mutation approval left active rombel assignment flag enabled | Set `is_active=false` on current class assignment upon mutation approval | FIXED | `StudentMutationTest` |

---

## SUMMARY LOG PERBAIKAN
- Total Bug Identified: 8
- Total Bug Fixed: 8 (100%)
- Remaining Open Bugs: 0
