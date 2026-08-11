# Pemetaan API dan Frontend LMS Sesi 4

## 1. Media Pembelajaran
- **Frontend Page**: `LmsMediaPage.jsx`
- **Service**: `lmsMediaService.js`
- **Endpoints**:
  - `GET /api/lms/media`
  - `GET /api/lms/media/{id}`
  - `POST /api/lms/media`
  - `PUT /api/lms/media/{id}`
  - `DELETE /api/lms/media/{id}`
  - `POST /api/lms/media/reorder`

## 2. Referensi Pembelajaran
- **Frontend Page**: `LmsReferensiPage.jsx`
- **Service**: `lmsReferensiService.js`
- **Endpoints**:
  - `GET /api/lms/referensi`
  - `GET /api/lms/referensi/{id}`
  - `POST /api/lms/referensi`
  - `PUT /api/lms/referensi/{id}`
  - `DELETE /api/lms/referensi/{id}`
  - `POST /api/lms/referensi/{id}/restore`

## 3. Aktivitas Belajar
- **Frontend Page**: `LmsAktivitasBelajarPage.jsx`
- **Service**: `lmsAktivitasBelajarService.js`
- **Endpoints**:
  - `GET /api/lms/aktivitas`
  - `GET /api/lms/aktivitas/{id}`
  - `POST /api/lms/aktivitas`
  - `PUT /api/lms/aktivitas/{id}`
  - `DELETE /api/lms/aktivitas/{id}`
  - `POST /api/lms/aktivitas/{id}/restore`

## 4. Diskusi Kelas
- **Frontend Page**: `LmsDiskusiPage.jsx`
- **Service**: `lmsDiskusiService.js`
- **Endpoints**:
  - `GET /api/lms/diskusi`
  - `GET /api/lms/diskusi/{id}`
  - `POST /api/lms/diskusi`
  - `PUT /api/lms/diskusi/{id}`
  - `DELETE /api/lms/diskusi/{id}`
  - `POST /api/lms/diskusi/{id}/toggle-pin`
  - `POST /api/lms/diskusi/{id}/toggle-close`
  - `POST /api/lms/diskusi/{id}/komentar`
  - `DELETE /api/lms/diskusi/{diskusiId}/komentar/{komentarId}`

## 5. Presensi LMS
- **Frontend Page**: `LmsPresensiPage.jsx`
- **Service**: `lmsPresensiService.js`
- **Endpoints**:
  - `GET /api/lms/presensi`
  - `GET /api/lms/presensi/{id}`
  - `POST /api/lms/presensi`
  - `POST /api/lms/presensi/bulk`
  - `PUT /api/lms/presensi/{id}`
  - `DELETE /api/lms/presensi/{id}`
  - `GET /api/lms/presensi/stats`
  - `GET /api/lms/presensi/options`
  - `GET /api/lesson-attendance/sessions`
  - `GET /api/lesson-attendance/my-schedules`
