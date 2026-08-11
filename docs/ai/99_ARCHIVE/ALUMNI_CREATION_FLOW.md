# Pembentukan Alumni (Alumni Creation) Flow — Sesi 6

## Overview
Setelah kelulusan ditetapkan, profil siswa secara otomatis terintegrasi ke dalam direktori Alumni dan Portal Alumni (`AlumniPortalController.php` & `FoundationGraduationAlumniPage.jsx`).

## Idempotent Upsert & Metadata Schema
Data alumni dikaitkan pada model `Student` dengan spesifikasi metadata:
```json
{
  "is_alumni": true,
  "status_siswa": "alumni",
  "status_alumni": "Tamat / Lulus",
  "tahun_lulus": "2026",
  "no_hp_alumni": "08123456789",
  "pendidikan_lanjut": "Universitas Indonesia",
  "pekerjaan": "Software Engineer"
}
```

## API Access Scope
- **Foundation / Yayasan**: `GET /api/v1/foundation/alumni` & `GET /api/v1/alumni` (Read-only monitoring lintas unit).
- **Alumni Portal**: `GET /api/v1/portal/alumni/profile` & `PUT /api/v1/portal/alumni/profile` (Mandiri oleh alumni yang login).
