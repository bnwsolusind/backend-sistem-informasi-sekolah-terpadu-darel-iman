# DASHBOARD_LAYOUT_RULEBOOK.md

# SIMSIT Dashboard Layout Standard

Version : 1.0

Status : LOCKED

============================================================

TUJUAN

============================================================

Seluruh dashboard pada SIMSIT WAJIB menggunakan layout yang sama.

Dashboard yang termasuk:

- Super Admin
- Ketua Yayasan
- Pengurus Yayasan
- Kepala Sekolah
- Tata Usaha
- Guru
- Wali Kelas
- Guru Tahfizh
- Musyrif
- Musyrifah
- Orang Tua
- Siswa

Perbedaan hanya terdapat pada:

- Data
- Widget
- KPI
- Permission
- Quick Action

Bukan layout.

============================================================

JANGAN

============================================================

Jangan membuat layout dashboard baru.

Jangan mengubah posisi Hero Banner.

Jangan memindahkan KPI.

Jangan mengubah posisi Chart.

Jangan memindahkan Notification.

Jangan mengubah ukuran card secara acak.

============================================================

LAYOUT

============================================================

Seluruh dashboard menggunakan urutan berikut.

────────────────────────────────────────

TOPBAR

────────────────────────────────────────

Logo

Search

Global Filter

Notification

Message

Theme

Profile

────────────────────────────────────────

HERO

────────────────────────────────────────

Judul

Subtitle

Quick Action

Filter Tahun

Filter Unit

Filter Semester

────────────────────────────────────────

ROW 1

KPI

────────────────────────────────────────

KPI Card

KPI Card

KPI Card

KPI Card

KPI Card

KPI Card

KPI Card

KPI Card

Desktop

8 card

Laptop

4 card

Tablet

2 card

Mobile

1 card

============================================================

ROW 2

============================================================

3 Card Besar

Card 1

Ringkasan

Card 2

Chart

Card 3

Chart

Desktop

3 kolom

Laptop

2 kolom

Tablet

2 kolom

Mobile

1 kolom

============================================================

ROW 3

============================================================

Widget

Widget

Widget

Desktop

3 kolom

Laptop

2 kolom

Tablet

2 kolom

Mobile

1 kolom

============================================================

ROW 4

============================================================

Table

Table

Desktop

2 kolom

Laptop

2 kolom

Tablet

1 kolom

Mobile

1 kolom

============================================================

ROW 5

============================================================

Quick Action

Recent Activity

Notification

Calendar

Desktop

4 kolom

Laptop

2 kolom

Tablet

2 kolom

Mobile

1 kolom

============================================================

ROW 6

============================================================

Data Table

Full Width

============================================================

CARD

============================================================

Gunakan AppCard.

Radius mengikuti template.

Padding konsisten.

Shadow konsisten.

Border konsisten.

============================================================

KPI CARD

============================================================

Struktur

Icon

Title

Value

Trend

Mini Sparkline

Footer

============================================================

CHART CARD

============================================================

Header

Title

Filter

Action

Body

Chart

Footer

============================================================

TABLE CARD

============================================================

Header

Title

Action

Toolbar

Search

Filter

Export

Body

AppDataTable

Footer

Pagination

============================================================

QUICK ACTION

============================================================

Quick Action harus berupa Card.

Bukan Floating Button.

Desktop

Grid

Tablet

Grid

Mobile

Horizontal Scroll

============================================================

NOTIFICATION

============================================================

Notification Card.

5 data terbaru.

Button

Lihat Semua.

============================================================

RECENT ACTIVITY

============================================================

Timeline.

Avatar.

Status.

Jam.

============================================================

PROFILE

============================================================

Profile Header.

Avatar.

Role.

Unit.

Status Online.

============================================================

BOTTOM NAVIGATION

============================================================

Desktop

Tidak ada.

Laptop

Tidak ada.

Tablet

WAJIB.

Mobile

WAJIB.

============================================================

TABLET

============================================================

Bottom Navigation.

Beranda

Modul

Quick Action

Notifikasi

Profil

============================================================

ROLE GURU

============================================================

Bottom Navigation

Beranda

Jadwal

SCAN

Notifikasi

Profil

============================================================

ROLE SISWA

============================================================

Bottom Navigation

Beranda

Jadwal

Tugas

Notifikasi

Profil

============================================================

ROLE ORANG TUA

============================================================

Bottom Navigation

Beranda

Anak

Aktivitas

Notifikasi

Profil

============================================================

ROLE KEPALA SEKOLAH

============================================================

Filter hanya:

Unit Sendiri.

Tidak boleh melihat unit lain.

============================================================

ROLE PENGURUS YAYASAN

============================================================

Boleh melihat seluruh Unit.

Filter:

Unit

Jenjang

Semester

Tahun

Rentang Tanggal

============================================================

ROLE SUPER ADMIN

============================================================

Melihat seluruh data.

============================================================

WIDGET STANDAR

============================================================

Gunakan widget berikut.

Ringkasan Unit

Ringkasan Guru

Ringkasan Pegawai

Ringkasan Siswa

Ringkasan Orang Tua

Ringkasan Alumni

Ringkasan Prestasi

Ringkasan Tahfizh

Ringkasan Mutaba'ah

Ringkasan Absensi

Ringkasan Nilai

Ringkasan Akademik

Ringkasan Keuangan

Ringkasan LMS

Ringkasan Login User

Ringkasan Aktivitas

============================================================

ANIMATION

============================================================

Gunakan Motion Rulebook.

Fade.

Slide.

Stagger.

Hover.

Scale.

Glow.

Counter.

============================================================

LIGHT MODE

============================================================

Layout IDENTIK.

============================================================

DARK MODE

============================================================

Layout IDENTIK.

Hanya warna berubah.

============================================================

RESPONSIVE

============================================================

Desktop

1920+

Laptop

1366

Tablet

768

Smartphone

390

============================================================

OUTPUT

============================================================

Semua Dashboard harus memiliki layout identik.

Hanya widget yang berubah sesuai role.

Dilarang mengubah struktur layout ketika membuat dashboard baru.