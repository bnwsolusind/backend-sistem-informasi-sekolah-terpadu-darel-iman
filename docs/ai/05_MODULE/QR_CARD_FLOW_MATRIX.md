# QR CARD FLOW MATRIX

## Matrix

| Card/context | Token aktual | Resolver aktual | Transaksi | Status |
|---|---|---|---|---|
| Student card — gate | stable opaque `stuqr:v1:*` dari `qr_credentials` | `StudentQrCredentialService` + `GateAttendanceService::resolveStudent()` | `attendances` | AVAILABLE — Step 05; IN/OUT, unit terminal, duplicate guard |
| Student card — lesson identify | stable opaque credential; fallback legacy hanya untuk compatibility | `StudentQrCredentialService` + `AttendanceCaptureService::resolveStudent()` | roster validation pada endpoint identify | AVAILABLE — Step 05 |
| Student card — lesson scan | stable opaque credential; fallback legacy hanya untuk compatibility | capture service + active session + roster check | draft row `lms_presensi` + scan log | AVAILABLE — Step 05 |
| Teacher/employee card — login | raw random UUID; DB menyimpan SHA-256 | `AuthService::loginEmployeeQr()` via `qr_credentials` | token Sanctum + login event; tidak membuat teaching attendance | AVAILABLE sebagai auth terpisah |
| Teacher card — teaching attendance | credential opaque yang sama hanya untuk identitas | `TeachingAttendanceService::scan()` via `/api/teacher/teaching-attendance/scan` | `teaching_attendances` per schedule + ready session | AVAILABLE — Step 04 |

## Security Verification

- `qr_credentials.token_hash` unique; raw token hanya dikembalikan saat generate. Status active/revoked/expired dan expiry tersedia.
- QR tidak menyimpan password, PIN, NIK, JWT permanen, atau credential plaintext.
- QR siswa baru adalah token HMAC opaque stabil; database hanya menyimpan SHA-256 token hash pada `qr_credentials`.
- Fallback lesson menerima encrypted payload lama atau NIS/NISN/card metadata untuk printed/legacy input; QR baru tetap satu source of truth pada credential aktif.
- `AttendanceScanLog` menyimpan hash identifier, bukan raw identifier.
- QR tetap bukan authorization: route permission, unit, period, enrollment/rombel, schedule, dan duplicate harus divalidasi server.

## Validasi Aktual

| Validasi | Gate | Lesson QR | Teacher teaching QR |
|---|---|---|---|
| identity exists/active | ada sebagian | ada | employee aktif + employee card aktif |
| credential active/revoked/expired | `qr_credentials.active()` | `qr_credentials.active()` | active/revoked/expired dari `qr_credentials` |
| unit | user scope + unit terminal + student unit | schedule/rombel + teacher ownership | schedule, employee, dan user/unit harus cocok |
| academic year/semester | tidak diisi oleh gate service pada create aktual | schedule date range pada save workflow | wajib aktif pada schedule |
| enrollment/rombel | tidak | class/kelas membership | kelas/jadwal milik guru |
| schedule/day/time | n/a | ada pada active workflow; identify hanya ownership | wajib cocok hari, periode, dan time window |
| teacher attendance prerequisite | n/a | tidak | session start wajib setelah scan valid |
| duplicate | transaction lock + PostgreSQL advisory key + service check | scan log + unique schedule/student/date + status guard; soft-deleted roster rows are restored before upsert | transaction lock + unique schedule/date |
| review before final | n/a | seluruh roster dibuat `belum_diverifikasi`; final menolak status unmarked | teaching session tidak memfinalisasi roster siswa |

## Runtime Coverage (2026-08-11)

PostgreSQL runtime 2026-08-11 terverifikasi berisi `1` active employee QR, `1` active student QR, `1` Step 04 demo schedule, `1` teaching attendance, dan `1` teaching session. Step 05 targeted regression `6 passed / 45 assertions` membuktikan student credential stabil, parent/student scope, gate IN/OUT, lesson roster, QR capture, duplicate, soft-delete restore, dan finalization. Authenticated browser flow QR -> review -> finalization juga pass pada viewport `1440` dan `390`; raw student token hanya dikembalikan ke card/portal caller dan database menyimpan hash.

## Keputusan Freeze

1. Satu credential kartu boleh mengidentifikasi subject, tetapi setiap endpoint wajib mengikat purpose/context transaksi.
2. QR login, bila dipertahankan, tetap flow auth terpisah dan tidak boleh otomatis berarti hadir mengajar.
3. Teaching QR hanya membuka attendance/session milik schedule guru; tidak memberi authorization lintas unit.
4. Untuk deadline berikutnya, pertahankan checklist sebagai primary; QR siswa hanya accelerant dan tetap masuk review.
