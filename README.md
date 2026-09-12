Sistem Manajemen Sekolah Islam Terpadu
Monorepo ini berisi fondasi School ERP berbasis:

Backend API: Laravel 12 + PostgreSQL 17 + Sanctum + Spatie Permission
Web Dashboard: React 19 + Vite + Tailwind CSS + Recharts + Zustand
Mobile App: React Native (Expo) + React Navigation + React Native Paper
Infra: Docker Compose (Nginx + PHP-FPM + PostgreSQL + Redis)
Struktur
backend
web-dashboard
mobile-app
infra
Tahap Saat Ini
Tahap 1 sudah disiapkan:

Setup autentikasi login/logout/profile menggunakan Sanctum
Setup role/permission 7 role utama
Setup migration inti dengan UUID, JSONB, soft delete, timezone timestamp
Setup partisi PostgreSQL untuk tabel operasional bulanan
Setup endpoint dasar dashboard, students, teachers, classes
Setup UI dashboard modern (shell + statistik + chart)
Setup bottom navigation mobile untuk portal orang tua/siswa
Menjalankan Local (Manual)
1. Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve

### Perintah Simulasi Data Akademik 1 Tahun (T.A. 2026/2027)
Untuk menghasilkan data simulasi 1 tahun pelajaran penuh (Juli 2026 – Juli 2027) yang mencakup sesi mengajar, presensi gerbang, tugas LMS, nilai, e-rapor, tahfizh, mutabaah, dan tagihan SPP:

```bash
# Menjalankan seluruh simulasi data 1 tahun ajaran:
php artisan simulate:academic-year-2026-2027 --module=all

# Menjalankan per modul spesifik:
php artisan simulate:academic-year-2026-2027 --module=schedules   # Sesi Mengajar Guru
php artisan simulate:academic-year-2026-2027 --module=attendance  # Presensi Harian Siswa
php artisan simulate:academic-year-2026-2027 --module=lms         # Materi & Penugasan LMS
php artisan simulate:academic-year-2026-2027 --module=grades      # Rekap Nilai Siswa (student_grades)
php artisan simulate:academic-year-2026-2027 --module=rapor       # Buku e-Rapor Digital
php artisan simulate:academic-year-2026-2027 --module=tahfizh     # Setoran Hafalan Quran
php artisan simulate:academic-year-2026-2027 --module=mutabaah    # Rekap Ibadah Harian
php artisan simulate:academic-year-2026-2027 --module=finance     # Tagihan & Pembayaran SPP 12 Bulan

# Membersihkan / Rollback data simulasi secara aman (hanya menghapus data bertanda is_simulation):
php artisan simulate:academic-year-2026-2027 --rollback
```
2. Web Dashboard
cd web-dashboard
npm install
npm run dev
3. Mobile App
cd mobile-app
npm install
npm run start
Menjalankan Dengan Docker
cd infra
docker compose up -d --build
Catatan: setelah container aktif, jalankan migrasi dari container backend atau dari host.

Endpoint Tahap 1
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/profile
GET /api/dashboard
GET /api/students
GET /api/teachers
GET /api/classes
GET /api/attendance (placeholder)
GET /api/tahfizh (placeholder)
GET /api/mutabaah (placeholder)
GET /api/materials (placeholder)
GET /api/assignments (placeholder)
GET /api/exams (placeholder)
GET /api/alumni (placeholder)
GET /api/notifications (placeholder)
