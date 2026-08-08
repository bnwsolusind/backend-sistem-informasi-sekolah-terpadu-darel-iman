# SESI 14 REGRESSION REPORT — BASELINE GUARD & VERIFICATION

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Regression baseline validation across backend tests, frontend linting, and frontend production build.

---

## 1. REGRESSION BASELINE COMPARISON

| METRIK TEST | BASELINE SESI 13.5 | AKHIR SESI 14 | DELTA | STATUS |
|---|---|---|---|---|
| Tests | 293 | **315** | +22 | PASS |
| Assertions | 1080 | **1115** | +35 | PASS |
| Failures | 0 | **0** | 0 | PASS |
| Errors | 0 | **0** | 0 | PASS |
| Skipped | 0 | **0** | 0 | PASS |
| Frontend Lint | 0 errors | **0 errors** | 0 | PASS |
| Frontend Build | Success | **Success** (3,248 modules) | 0 | PASS |

---

## 2. REGRESSION GUARD SUMMARY

- Baseline test count increased from **293 to 315 tests** (+22 tests).
- Total assertions increased from **1080 to 1115 assertions** (+35 assertions).
- Zero test failures, zero errors, zero skips.
- All pre-existing test suites (Access Control, Student Portal, Parent Portal, CBT Auto-Timeout, Notification Scope, Chat Scope, School Information Visibility, Master Options Lookup) remain 100% intact and passing.
