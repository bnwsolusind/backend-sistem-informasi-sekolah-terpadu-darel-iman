# DOCUMENTATION AUDIT

Audit inventory dan konsolidasi dokumentasi AI. Scope hanya `docs/ai/`; source code aplikasi, database, dependency, dan generated directory tidak disentuh.

## Inventory Count

Baseline note: repository `HEAD` contains 250 tracked Markdown paths, while the shared worktree already contained 328 Markdown files at the start of this documentation pass. The worktree baseline is used below because pre-existing user changes are preserved.

| METRIC | RESULT |
|---|---:|
| TOTAL MD FILES BEFORE | 328 (273 archive + 54 active/canonical/prompt + `.agent.md`) |
| TOTAL MD FILES AFTER | 329 (audit report ini ditambahkan; tidak ada file Markdown yang dihapus) |
| ARCHIVE FILES | 273 |
| DOMAIN CANONICAL FILES | 45 |
| ACTIVE REPORT FILES | 4 |
| PROMPT FILES | 4 |
| ROOT GUIDE FILES | 2 (`README.md`, `INDEX.md`) |
| AGENT CONFIG | 1 (`.agent.md`, bukan source of truth) |
| DELETED DOCS | 0 |

## Inventory Matrix

Inventory dilakukan terhadap setiap Markdown. Arsip dikelompokkan berdasarkan tujuan canonical agar report ini tetap hemat token; seluruh file tetap dipertahankan di `99_ARCHIVE/`.

| FILE SET / TOPIC | TYPE | STATUS | DUPLICATE WITH | OUTDATED / CONFLICT | DECISION |
|---|---|---|---|---|---|
| `README.md`, `INDEX.md` | RULEBOOK / NAVIGATION | CANONICAL | Old root README | Tidak ada | KEEP as entry point |
| `01_PROJECT/*.md` | ARCHITECTURE / FLOW / MODULE MAP | CANONICAL | `SYSTEM_FLOW_MAP.md`, `SYSTEM_INTEGRATION_MAP.md`, `MODULE_DEPENDENCY_MAP.md`, `MENU_ROUTE_PAGE_MAP.md` | Detail lama dan report audit | MERGE stable rules; archive details |
| `02_DATABASE/*.md` | DATABASE RULE / SCHEMA / MIGRATION / SEEDER / POSTGRESQL / DATA SCOPE | CANONICAL | `01-audit-migrations.md`, `DATABASE_SOURCE_OF_TRUTH_MATRIX.md`, `MIGRATION_*`, `SEEDER_*`, `POSTGRESQL_*`, `ROLE_SCOPE_MATRIX.md` | Bootstrap report dan angka lama | KEEP canonical; archive evidence |
| `03_AUTH/*.md` | AUTH / LOGIN / ROLE / SECURITY | CANONICAL | `AUTH_*`, `LOGIN_ACCOUNT_MATRIX.md`, `ROLE_*`, `PERMISSION_*`, `SECURITY_*` | Role counts and login evidence vary by session | KEEP canonical; archive historical evidence |
| `04_UI_UX/*.md` | UI/UX RULEBOOK / DESIGN SYSTEM / COMPONENT STANDARD | CANONICAL | `AI_RULEBOOK.md`, `ENTERPRISE_DESIGN_SYSTEM_V2.md`, `GLOBAL_*_STANDARD.md`, `UI_*_STANDARD.md`, component matrices | Multiple radius, component, and motion variants | MERGE active tokens/rules; archive every superseded source |
| `05_MODULE/*.md` | MODULE CONTRACT / FLOW | CANONICAL | `*_FLOW.md`, `*_MATRIX.md`, `academic-lms-*`, dashboard/portal/module audits | Session-specific implementation and acceptance detail | KEEP concise module contract; archive details |
| `06_API/*.md` | API CONTRACT / RESPONSE / ERROR | CANONICAL | `CROSS_MODULE_API_CONTRACT.md`, `OPTIONS_API_CONTRACT.md`, `NOTIFICATION_API_CONTRACT.md`, `API_*` | Endpoint snapshots are time-bound | KEEP canonical; archive snapshots |
| `07_TESTING/*.md` | TEST / REGRESSION / PERFORMANCE RULE | CANONICAL | `10-audit-testing.md`, `*_TEST_REPORT.md`, `INTEGRATION_TEST_MATRIX.md`, `SESSION_*_REGRESSION*` | Test results are historical evidence | KEEP rules; archive evidence |
| `08_REPORT/*.md` | REPORT / CHANGELOG / STATUS / HISTORY | ACTIVE REPORT | Session and audit reports in archive | Must not override rules | KEEP, read only when needed |
| `09_PROMPT/*.md` | PROMPT | PROMPT | Archived prompt and implementation walkthroughs | Old paths and old rulebook names | KEEP separate; prompt starts with README/INDEX instruction |
| `99_ARCHIVE/*.md` | REPORT / AUDIT / OLD RULE / MATRIX / WALKTHROUGH | ARCHIVE | All active canonical domains as listed above | Historical, duplicate, superseded, or environment-specific | KEEP archive; never source of truth |
| `.agent.md` | AGENT CONFIG | ACTIVE CONFIG | None | Not a rulebook or report | KEEP outside canonical index |

## Duplicate Groups and Merge Decisions

| DUPLICATE GROUP | MERGE INTO | KEEP | ARCHIVE |
|---|---|---|---|
| `AI_RULEBOOK.md`, `ENTERPRISE_DESIGN_SYSTEM_V2.md`, `UI_DESIGN_SYSTEM.md`, `GLOBAL_*_STANDARD.md`, `UI_*_STANDARD.md` | `04_UI_UX/UI_RULEBOOK.md`, `DESIGN_SYSTEM.md`, component standards | Canonical token and behavior docs | All original files in `99_ARCHIVE/` |
| `POSTGRESQL_SOURCE_REPORT.md`, `POSTGRESQL_SCHEMA_VERIFICATION.md`, `POSTGRESQL_BOOTSTRAP_REPORT.md`, `POSTGRESQL_RECONNECT_REPORT.md`, `POSTGRESQL_AUTH_TEST_REPORT.md`, `POSTGRESQL_LOGIN_VERIFICATION.md`, `POSTGRESQL_API_SMOKE_REPORT.md`, `POSTGRESQL_CRITICAL_API_SMOKE.md` | `02_DATABASE/POSTGRESQL_GUIDE.md` | Stable checklist and troubleshooting | Runtime reports and bootstrap evidence |
| `SYSTEM_FLOW_MAP.md`, `SYSTEM_INTEGRATION_MAP.md`, `ACADEMIC_LMS_FLOW.md`, `LMS_ATTENDANCE_FLOW.md`, and module flow files | `01_PROJECT/FLOW_SYSTEM.md` plus matching `05_MODULE/*.md` | Short E2E flow and module contract | Long flow maps and session walkthroughs |
| `ROLE_MATRIX.md`, `ROLE_FLOW_MATRIX.md`, `ROLE_PERMISSION_MATRIX.md`, `PERMISSION_MATRIX.md`, `ROLE_SCOPE_MATRIX.md`, `ROLE_PERMISSION_DATABASE_MATRIX.md`, `SIDEBAR_PERMISSION_MATRIX.md`, `CRUD_PERMISSION_MATRIX.md` | `03_AUTH/ROLE_PERMISSION.md` and `02_DATABASE/DATA_SCOPE.md` | PostgreSQL role source and scope rule | Old matrices and test reports |
| `CROSS_MODULE_API_CONTRACT.md`, `OPTIONS_API_CONTRACT.md`, `NOTIFICATION_API_CONTRACT.md`, `API_FRONTEND_MAPPING.md` | `06_API/API_CONTRACT.md`, `RESPONSE_STANDARD.md`, `ERROR_STANDARD.md` | Active envelope and endpoint contract | API snapshots and mapping reports |
| `DASHBOARD_*`, report matrices, portal audits, chat audits, Tahfizh/Mutabaah matrices | Matching `05_MODULE/*.md` | Concise module ownership and scope | Audit, acceptance, sync, and implementation reports |
| `SESSION_*`, `*_TEST_REPORT.md`, `*_ACCEPTANCE.md`, `*_AUDIT.md`, `*_IMPLEMENTATION_LOG.md` | `08_REPORT/CURRENT_STATUS.md`, `SESSION_HISTORY.md`, `CHANGELOG.md` | Short current status/history summary | Original session evidence |

## Outdated or Conflicting Rules Found

- `99_ARCHIVE/PRODUCTION_READINESS_REPORT.md` contains older 15-role and 143-test figures; it is historical.
- `99_ARCHIVE/00-master-audit-overview.md` contains an older 78-page count; the latest recorded metric is in `CURRENT_STATUS.md`.
- PostgreSQL bootstrap and schema reports contain different database names, migration counts, and pending states from different environments.
- `99_ARCHIVE/Account.md` contains legacy usernames and fixture credentials; it is not an authentication contract.
- Historical UI documents contain different card/modal radius and component naming; canonical values are card `18px`, modal `20px`, and the paths in `04_UI_UX/`.
- Session 16 reports production readiness while also recording PG17 as pending; current status therefore remains conditional.
- Archived reports contained absolute local file URLs to the pre-refactor root layout.

Outdated material was archived, not deleted. No archive document is listed as a canonical source.

## Link Audit

- Markdown link targets inspected: 50 historical links in five archived session reports.
- Broken targets found before fix: 50 absolute links to old root paths.
- Broken targets fixed: 50, remapped to relative files in `99_ARCHIVE/`.
- Remaining broken Markdown links: 0.
- Inline code references to historical filenames remain intentionally descriptive in reports; they do not make those files canonical.

## Final Audit Result

| CHECK | RESULT |
|---|---|
| README exists | PASS |
| INDEX exists | PASS |
| Canonical source per domain | PASS |
| Rulebook/report separation | PASS |
| Prompt/rulebook separation | PASS |
| Duplicate active source of truth | 0 remaining |
| Historical duplicates | Retained in archive intentionally |
| Internal Markdown links | 0 broken |
| Deleted docs | 0 |
| Source code changed by this refactor | 0 |
