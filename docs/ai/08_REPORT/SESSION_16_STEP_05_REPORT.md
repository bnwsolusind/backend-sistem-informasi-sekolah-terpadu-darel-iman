# SESSION 16 STEP 05 REPORT

Date: 2026-08-11
Status: **PASS WITH FINDINGS**

## Scope

- Student QR/card credential and printed-card identity.
- Gate attendance check-in/check-out.
- Lesson attendance roster, checklist, QR capture, duplicate protection, review, and finalization.
- Parent/student portal QR visibility and child/self scope.
- Step 04 teaching-session prerequisite.

## Implemented

- Added `StudentQrCredentialService`.
- Student QR format is stable opaque `stuqr:v1:*`; it is derived from the server app key and student UUID, while `qr_credentials` stores only SHA-256 hash.
- Repeated card generation returns the same active credential instead of revoking and creating a new random token.
- Removed portal student-profile JSON QR containing ID, NIS, NISN, and name.
- Added child-scoped `/api/portal/attendance-qr` for parent/student profile QR.
- Gate resolver now accepts active student QR credentials and enforces user/unit terminal scope.
- Gate check-in/check-out uses transaction locks plus PostgreSQL advisory key; duplicate IN/OUT and checkout-without-check-in are rejected.
- Lesson QR capture no longer writes from local frontend roster matching; every scan reaches the backend resolver, active session check, and schedule roster check.
- Lesson session save fills the complete active roster with `belum_diverifikasi` when items are omitted.
- Finalization rejects linked Step 04 sessions that are not `active`, incomplete roster, and unmarked statuses.
- Student permission recommendations remain recommendations; they no longer become automatic attendance status in the workspace.
- Capture locks the lesson session and restores a soft-deleted roster row before the unique schedule/student/date upsert.
- Capture and gate responses redact raw QR identifiers and other sensitive credential payloads.

## Verification

| Check | Result |
|---|---|
| Step05 targeted feature tests | `6 passed / 45 assertions` |
| Gate + Step05 targeted regression | `14 passed / 68 assertions` |
| Step04 + TeacherPortal + MultiPortal + Parent regression | `26 passed / 141 assertions` |
| Frontend lint | Exit 0; existing warning-only baseline |
| Frontend build | PASS; Vite 8.2.1, `3295 modules` |
| Authenticated browser UAT | PASS; login -> schedule -> QR -> review -> finalization at `1440` and `390`, console errors 0, no document overflow |

## Findings

- Browser UAT covered the lesson QR/review/finalization flow at `1440` and `390`; `1024`, `768`, and `360` remain optional viewport expansion checks.
- Full PHPUnit suite remains a historical timeout/failure finding and is not claimed as PASS.
- `attendances` has no new database unique constraint for student/date because existing partition/history safety still requires a separate migration decision; application advisory locking is the current guard.
- Explicit enrollment table validation remains deferred; current roster source is active student membership through schedule class/rombel relationships.

## Next Gate

If release acceptance requires the full viewport matrix, rerun the authenticated flow at `1024`, `768`, and `360`; isolate the historical full-suite timeout separately. Step 05 targeted and authenticated acceptance is otherwise PASS WITH FINDINGS. Do not advance to Step 06.
