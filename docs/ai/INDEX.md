# INDEX — CANONICAL DOCS

Daftar source of truth `docs/ai/`. Dokumen di `08_REPORT/`, `09_PROMPT/`, dan `99_ARCHIVE/` tidak boleh mengoverride canonical rulebook.

## Canonical Per Domain

| DOMAIN | SINGLE SOURCE OF TRUTH |
|---|---|
| Project architecture | `01_PROJECT/ARCHITECTURE.md` |
| System flow | `01_PROJECT/FLOW_SYSTEM.md` |
| Critical role/attendance flow | `01_PROJECT/CRITICAL_FLOW_MATRIX.md` |
| Navigation matrix | `01_PROJECT/NAVIGATION_MATRIX.md` |
| Database rules | `02_DATABASE/DATABASE_RULEBOOK.md` |
| Database schema | `02_DATABASE/DATABASE_SCHEMA.md` |
| Demo seed coverage | `02_DATABASE/SEED_DATA_MATRIX.md` |
| Authentication | `03_AUTH/AUTHENTICATION.md` |
| Role and permission | `03_AUTH/ROLE_PERMISSION.md` |
| Role/portal matrix | `03_AUTH/ROLE_PORTAL_MATRIX.md` |
| Module access matrix | `03_AUTH/MODULE_ACCESS_MATRIX.md` |
| UI/UX global rules | `04_UI_UX/UI_RULEBOOK.md` |
| Design tokens | `04_UI_UX/DESIGN_SYSTEM.md` |
| Reusable components | `04_UI_UX/COMPONENT_STANDARD.md` |
| Responsive behavior | `04_UI_UX/RESPONSIVE_STANDARD.md` |
| Module behavior | matching file in `05_MODULE/` |
| Attendance domain/flow | `05_MODULE/ATTENDANCE_FLOW_MATRIX.md` |
| QR card flow | `05_MODULE/QR_CARD_FLOW_MATRIX.md` |
| Teaching session flow | `05_MODULE/TEACHING_SESSION_FLOW_MATRIX.md` |
| Teacher realtime monitoring | `05_MODULE/TEACHER_REALTIME_MONITORING_MATRIX.md` |
| API contract | `06_API/API_CONTRACT.md` |
| API response | `06_API/RESPONSE_STANDARD.md` |
| API errors | `06_API/ERROR_STANDARD.md` |
| Test rules | `07_TESTING/TEST_RULE.md` |

## Navigation Docs

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| Documentation guide | `README.md` | CANONICAL | 2026-08-10 | Tujuan, hirarki otoritas, dan urutan baca |
| Canonical index | `INDEX.md` | CANONICAL | 2026-08-10 | Daftar source of truth per domain |

## 01_PROJECT

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| Project overview | `01_PROJECT/PROJECT_OVERVIEW.md` | CANONICAL | 2026-08-10 | Ringkasan proyek, teknologi, hasil audit master |
| Architecture | `01_PROJECT/ARCHITECTURE.md` | CANONICAL | 2026-08-10 | Pipeline PostgreSQL → Model → Repository → Service → API → UI |
| Flow system | `01_PROJECT/FLOW_SYSTEM.md` | CANONICAL | 2026-08-10 | Alur E2E utama + alur per role |
| Module map | `01_PROJECT/MODULE_MAP.md` | CANONICAL | 2026-08-10 | Peta modul, menu, route utama |
| Critical flow matrix | `01_PROJECT/CRITICAL_FLOW_MATRIX.md` | CANONICAL | 2026-08-11 | Invariant dan acceptance flow guru/QR/monitoring |
| Navigation matrix | `01_PROJECT/NAVIGATION_MATRIX.md` | CANONICAL | 2026-08-11 | Entry, redirect, portal, guard, dan navigation contract |

## 02_DATABASE

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| Database rulebook | `02_DATABASE/DATABASE_RULEBOOK.md` | CANONICAL | 2026-08-10 | Aturan database, non-breaking, audit sebelum modul baru |
| Database schema | `02_DATABASE/DATABASE_SCHEMA.md` | CANONICAL | 2026-08-10 | Tabel/model/relasi inti |
| Migration rule | `02_DATABASE/MIGRATION_RULE.md` | CANONICAL | 2026-08-10 | Aturan migration (non-destruktif, add-only) |
| Seeder rule | `02_DATABASE/SEEDER_RULE.md` | CANONICAL | 2026-08-10 | Aturan seeder (idempotent, bootstrap roles) |
| PostgreSQL guide | `02_DATABASE/POSTGRESQL_GUIDE.md` | CANONICAL | 2026-08-10 | Verifikasi koneksi/skema PG, checklist runtime |
| Data scope | `02_DATABASE/DATA_SCOPE.md` | CANONICAL | 2026-08-11 | Scope query per role |
| Seed data matrix | `02_DATABASE/SEED_DATA_MATRIX.md` | CANONICAL | 2026-08-11 | Coverage runtime dan graph demo QR/attendance/monitoring |

## 03_AUTH

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| Authentication | `03_AUTH/AUTHENTICATION.md` | CANONICAL | 2026-08-11 | Sumber identitas, hashing, token, tabel auth |
| Login flow | `03_AUTH/LOGIN_FLOW.md` | CANONICAL | 2026-08-11 | Alur unified login employee/parent/student + multi-child |
| Role & permission | `03_AUTH/ROLE_PERMISSION.md` | CANONICAL | 2026-08-11 | 24 role kanonik, permission, scope, sidebar |
| Security | `03_AUTH/SECURITY.md` | CANONICAL | 2026-08-11 | Hardening akses, rate limit, IDOR prevention |
| Role portal matrix | `03_AUTH/ROLE_PORTAL_MATRIX.md` | CANONICAL | 2026-08-11 | Role kanonik, alias, workspace, dan scope |
| Module access matrix | `03_AUTH/MODULE_ACCESS_MATRIX.md` | CANONICAL | 2026-08-11 | Permission action vs data scope per keluarga role |

## 04_UI_UX

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| UI rulebook | `04_UI_UX/UI_RULEBOOK.md` | CANONICAL | 2026-08-10 | Master UI lock + aturan global UI |
| Design system | `04_UI_UX/DESIGN_SYSTEM.md` | CANONICAL | 2026-08-10 | Token warna, tipografi, radius, shadow, ikon |
| Component standard | `04_UI_UX/COMPONENT_STANDARD.md` | CANONICAL | 2026-08-10 | Komponen canonical, no duplicate, banned names |
| Layout standard | `04_UI_UX/LAYOUT_STANDARD.md` | CANONICAL | 2026-08-10 | Struktur halaman, dashboard layout |
| Navigation standard | `04_UI_UX/NAVIGATION_STANDARD.md` | CANONICAL | 2026-08-10 | Sidebar, topbar, bottom nav |
| Button standard | `04_UI_UX/BUTTON_STANDARD.md` | CANONICAL | 2026-08-10 | AppButton variants/state |
| Card standard | `04_UI_UX/CARD_STANDARD.md` | CANONICAL | 2026-08-10 | AppCard/KpiCard/SummaryCard |
| Table standard | `04_UI_UX/TABLE_STANDARD.md` | CANONICAL | 2026-08-10 | AppDataTable columns/state/responsive |
| Form standard | `04_UI_UX/FORM_STANDARD.md` | CANONICAL | 2026-08-10 | Input, validasi, wizard |
| Modal/drawer standard | `04_UI_UX/MODAL_DRAWER_STANDARD.md` | CANONICAL | 2026-08-10 | AppModal/AppDrawer/dialog, konfirmasi CRUD |
| Responsive standard | `04_UI_UX/RESPONSIVE_STANDARD.md` | CANONICAL | 2026-08-10 | Breakpoints, grid, tabel, filter mobile |
| Notification standard | `04_UI_UX/NOTIFICATION_STANDARD.md` | CANONICAL | 2026-08-10 | Feedback channel, bell, toast |
| Status badge standard | `04_UI_UX/STATUS_BADGE_STANDARD.md` | CANONICAL | 2026-08-10 | Mapping status bisnis → badge variant |

## 05_MODULE

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| Dashboard | `05_MODULE/DASHBOARD.md` | CANONICAL | 2026-08-10 | Dashboard multi-role, widget, KPI source |
| Role dashboard standard | `05_MODULE/ROLE_DASHBOARD_STANDARD.md` | CANONICAL | 2026-08-11 | Default workspace, scope, route guard, KPI, quick action |
| Master data | `05_MODULE/MASTER_DATA.md` | CANONICAL | 2026-08-10 | Unit, pegawai, siswa, orang tua, lookup |
| Akademik | `05_MODULE/AKADEMIK.md` | CANONICAL | 2026-08-10 | Kurikulum, mapel, kelas/jadwal, CP/TP, rapor |
| LMS | `05_MODULE/LMS.md` | CANONICAL | 2026-08-10 | Materi, tugas, kisi-kisi, bank soal, CBT, penilaian |
| Absensi | `05_MODULE/ABSENSI.md` | CANONICAL | 2026-08-10 | Presensi pembelajaran, gerbang, ibadah |
| Attendance flow matrix | `05_MODULE/ATTENDANCE_FLOW_MATRIX.md` | CANONICAL | 2026-08-11 | Domain, state, table, prerequisite, dan gap aktual |
| QR card flow matrix | `05_MODULE/QR_CARD_FLOW_MATRIX.md` | CANONICAL | 2026-08-11 | QR siswa/guru, context, security, dan runtime coverage |
| Teacher realtime monitoring | `05_MODULE/TEACHER_REALTIME_MONITORING_MATRIX.md` | CANONICAL | 2026-08-11 | Signal online/attendance/session dan strategi near-realtime |
| Tahfizh | `05_MODULE/TAHFIZH.md` | CANONICAL | 2026-08-10 | Setoran, target, perhitungan ayat, murajaah |
| Mutabaah | `05_MODULE/MUTABAAH.md` | CANONICAL | 2026-08-10 | Checklist yaumiyah, verifikasi, tanda tangan ortu |
| Portal guru | `05_MODULE/PORTAL_GURU.md` | CANONICAL | 2026-08-10 | Workspace guru, presensi, penilaian |
| Portal orang tua | `05_MODULE/PORTAL_ORANG_TUA.md` | CANONICAL | 2026-08-10 | Multi-child, ownership, switcher, chat |
| Portal siswa | `05_MODULE/PORTAL_SISWA.md` | CANONICAL | 2026-08-10 | Workspace siswa self-scope |
| Laporan | `05_MODULE/LAPORAN.md` | CANONICAL | 2026-08-10 | Laporan lintas unit, drill-down, export |
| Chat | `05_MODULE/CHAT.md` | CANONICAL | 2026-08-10 | Chat role-scoped, ownership |

## 06_API

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| API contract | `06_API/API_CONTRACT.md` | CANONICAL | 2026-08-11 | Kontrak endpoint per domain |
| Response standard | `06_API/RESPONSE_STANDARD.md` | CANONICAL | 2026-08-10 | Envelope success, meta, options |
| Error standard | `06_API/ERROR_STANDARD.md` | CANONICAL | 2026-08-10 | Error codes 401/403/404/422/500 |

## 07_TESTING

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| Test rule | `07_TESTING/TEST_RULE.md` | CANONICAL | 2026-08-10 | Aturan & baseline test |
| Regression rule | `07_TESTING/REGRESSION_RULE.md` | CANONICAL | 2026-08-10 | Baseline guard, non-breaking |
| Performance rule | `07_TESTING/PERFORMANCE_RULE.md` | CANONICAL | 2026-08-10 | N+1, index, bundle, cache |

## 08_REPORT

Dokumen report aktif bukan source of truth. Baca hanya bila status atau bukti diperlukan.

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| Changelog | `08_REPORT/CHANGELOG.md` | ACTIVE | 2026-08-11 | Catatan perubahan dokumentasi/aturan |
| Current status | `08_REPORT/CURRENT_STATUS.md` | ACTIVE | 2026-08-11 | Kondisi project sekarang |
| Session history | `08_REPORT/SESSION_HISTORY.md` | ACTIVE | 2026-08-11 | Ringkasan session 1–16 |
| Documentation audit | `08_REPORT/DOCUMENTATION_AUDIT.md` | REPORT | 2026-08-10 | Inventory, duplicate, status, dan keputusan archive |
| Bug register | `08_REPORT/BUG_REGISTER.md` | ACTIVE | 2026-08-11 | P0–P3 Pra-Sesi 16 Step 01 dan test gaps |
| Step 03 report | `08_REPORT/SESSION_16_STEP_03_REPORT.md` | ACTIVE | 2026-08-11 | Bukti audit role dashboard dan portal workspace |
| Step 04 report | `08_REPORT/SESSION_16_STEP_04_REPORT.md` | ACTIVE | 2026-08-11 | Bukti QR teacher attendance, teaching session, presence, dan monitoring |
| Step 05 report | `08_REPORT/SESSION_16_STEP_05_REPORT.md` | ACTIVE | 2026-08-11 | Bukti student QR/card, gate attendance, lesson roster/QR/finalization, dan portal scope |

## 09_PROMPT

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| UI master prompt | `09_PROMPT/SIMSIT_UI_SYSTEM_PROMPT.md` | PROMPT | 2026-08-10 | Instruksi eksekusi design system |
| Module refactor prompt | `09_PROMPT/MODERN_SOFT_MODULE_REFACTOR_PROMPT.md` | PROMPT | 2026-08-10 | Template refactor UI modul |
| New module prompt | `09_PROMPT/AUDIT_SEBULUM_BUAT_MODUL_BARU.md` | PROMPT | 2026-08-10 | Audit sebelum modul baru |
| Module refactor contoh | `09_PROMPT/CONTOH_PROMPT_MODUL_REFACTOR.md` | PROMPT | 2026-08-10 | Contoh prompt refactor modul |

## 99_ARCHIVE

| TOPIC | FILE | STATUS | LAST UPDATED | PURPOSE |
|---|---|---|---|---|
| Historical documents | `99_ARCHIVE/` | ARCHIVE | 2026-08-10 | 273 report, audit, duplicate, superseded rule, dan walkthrough; bukan source of truth |
