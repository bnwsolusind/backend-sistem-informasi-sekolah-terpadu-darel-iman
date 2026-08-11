# Read docs/ai/README.md and INDEX.md first.

# SIMSIT UI System Master Prompt

> Dokumen eksekusi UI. Sebelum menjalankan instruksi ini, baca canonical docs yang relevan; jangan membaca seluruh archive secara default.

## Urutan Prioritas Aturan
1. `docs/ai/04_UI_UX/UI_RULEBOOK.md`
2. `docs/ai/04_UI_UX/DESIGN_SYSTEM.md`
3. `docs/ai/04_UI_UX/COMPONENT_STANDARD.md`
4. `docs/ai/04_UI_UX/RESPONSIVE_STANDARD.md`
5. `docs/ai/04_UI_UX/MODAL_DRAWER_STANDARD.md` atau standard komponen yang relevan
6. `docs/ai/05_MODULE/` untuk modul yang sedang dikerjakan
7. Instruksi task spesifik

Jika terjadi konflik, aturan yang lebih spesifik berlaku selama tidak melanggar Master UI Lock.

## Instruksi Eksekusi
- Audit proyek dan komponen existing terlebih dahulu.
- Jangan membuat ulang komponen global yang sudah ada.
- Jangan mengubah business logic, route, API, atau navigasi tanpa kebutuhan.
- Terapkan animasi hanya melalui pola komponen dan token yang sudah ada di canonical UI docs; jangan membuat motion rulebook baru di dalam task.
- Pastikan Light, Dark, System, tiga template visual, responsive, dan reduced motion tetap berfungsi.
- Berhenti dan laporkan jika perubahan berisiko merusak modul lain.

---

BANGUN DAN TERAPKAN SIMSIT DESIGN SYSTEM YANG KONSISTEN UNTUK SELURUH MODUL.

============================================================
IDENTITAS PROYEK
============================================================

Nama:
SIMSIT — Sistem Informasi Manajemen Sekolah Terpadu

Struktur proyek:

backend/
mobile-app/
web-dashboard/

Teknologi:

Backend:
- Laravel 12
- PHP 8.3
- PostgreSQL
- Laravel Sanctum
- Spatie Laravel Permission

Web Dashboard:
- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- TanStack Table
- React Hook Form
- Zod
- Zustand
- Lucide React
- Framer Motion
- ApexCharts

Mobile:
- React Native / Expo
- TypeScript
- React Navigation
- React Query
- Zustand
- Lucide / Expo Vector Icons

============================================================
TUJUAN UTAMA
============================================================

Buat satu Design System global yang digunakan oleh seluruh modul.

Semua halaman dan modul harus:

- konsisten;
- modern;
- responsif;
- mudah digunakan;
- memiliki tampilan enterprise SaaS;
- memiliki identitas visual sekolah Islam;
- menggunakan komponen reusable;
- menggunakan ukuran, ikon, warna, radius, shadow, spacing, dan pola interaksi yang sama;
- mendukung Light Mode dan Dark Mode;
- mendukung pilihan tiga template visual melalui Pengaturan Situs.

DILARANG membuat desain baru secara mandiri pada setiap modul.

DILARANG membuat ulang button, card, table, modal, drawer, field, filter, pagination, badge, atau komponen umum di dalam folder modul.

Setiap modul wajib menggunakan komponen global dari Design System SIMSIT.

============================================================
MASTER UI LOCK
============================================================

Pertahankan:

- struktur sidebar;
- struktur topbar;
- struktur navigasi utama;
- posisi logo;
- hero/page header;
- breadcrumb;
- content container;
- card;
- table;
- form;
- drawer;
- modal;
- pagination;
- filter;
- bottom navigation;
- Light Mode;
- Dark Mode.

Jangan mengubah struktur layout utama ketika membuat modul baru.

Modul baru hanya boleh mengisi area konten menggunakan komponen global yang telah tersedia.

============================================================
TIGA TEMPLATE VISUAL
============================================================

Sediakan tiga pilihan template UI yang dapat dipilih melalui:

Pengaturan
→ Pengaturan Situs
→ Tampilan
→ Template Antarmuka

Pilihan:

1. Template Classic Enterprise
2. Template Modern Soft
3. Template Premium Compact

Simpan pilihan template ke pengaturan global.

Contoh nilai:

ui_template:
- classic
- modern
- compact

theme_mode:
- light
- dark
- system

Pilihan template tidak boleh mengubah:

- struktur menu;
- route;
- hak akses;
- isi data;
- fungsi CRUD;
- urutan navigasi;
- struktur form;
- struktur table;
- struktur dashboard.

Template hanya boleh mengubah visual token seperti:

- radius;
- shadow;
- kepadatan;
- padding;
- bentuk card;
- bentuk button;
- bentuk field;
- bentuk badge;
- gaya sidebar;
- gaya toolbar.

============================================================
TEMPLATE 1 — CLASSIC ENTERPRISE
============================================================

Karakter:

- rapi;
- formal;
- profesional;
- enterprise;
- menyerupai struktur komponen Bootstrap modern;
- tetap dibangun menggunakan Tailwind CSS;
- border terlihat ringan;
- shadow tipis;
- kepadatan normal.

Token visual:

- Card radius: 12px
- Button radius: 8px
- Input radius: 8px
- Modal radius: 12px
- Drawer radius: 0 pada sisi kanan
- Border: jelas tetapi tipis
- Shadow: ringan
- Table density: normal
- Toolbar: kompak dan formal
- Sidebar: solid
- Button: sedikit rectangular
- Badge: rounded-full

Gunakan template ini untuk pengguna yang menyukai tampilan administrasi formal.

============================================================
TEMPLATE 2 — MODERN SOFT
============================================================

Karakter:

- modern;
- premium;
- ringan;
- rounded;
- soft shadow;
- banyak whitespace;
- nyaman digunakan;
- cocok sebagai template default.

Token visual:

- Card radius: 18px
- Button radius: 12px
- Input radius: 12px
- Modal radius: 18px
- Drawer radius: 18px pada sisi kiri drawer
- Border: soft
- Shadow: soft-xl
- Table density: comfortable
- Toolbar: rounded container
- Sidebar: gradient atau solid soft
- Button: rounded-xl
- Badge: rounded-full
- Hover: lift ringan

Gunakan template ini sebagai default SIMSIT.

============================================================
TEMPLATE 3 — PREMIUM COMPACT
============================================================

Karakter:

- modern;
- padat;
- efisien;
- cocok untuk operator;
- lebih banyak data terlihat;
- tetap nyaman dan tidak sempit.

Token visual:

- Card radius: 10px
- Button radius: 8px
- Input radius: 8px
- Modal radius: 12px
- Border: tipis
- Shadow: sangat ringan
- Table density: compact
- Toolbar: compact
- Sidebar: compact
- Button: ukuran lebih kecil
- Field height: lebih pendek
- Gap antar-komponen: lebih kecil

Gunakan template ini untuk TU, operator, dan halaman dengan data besar.

============================================================
DESIGN TOKEN GLOBAL
============================================================

Warna utama:

Primary:
#0E5C44

Secondary:
#1E8E5A

Accent:
#3FBF75

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

Info:
#3B82F6

Light background:
#F7F9FC

Light surface:
#FFFFFF

Light muted:
#F1F5F9

Dark background:
#0F172A

Dark surface:
#111827

Dark card:
#1B2433

Dark muted:
#273244

Gunakan CSS variables agar template dan theme dapat diubah tanpa mengubah komponen.

Contoh:

:root {
  --primary: #0E5C44;
  --secondary: #1E8E5A;
  --accent: #3FBF75;
  --background: #F7F9FC;
  --surface: #FFFFFF;
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --border: #E2E8F0;
  --card-radius: 18px;
  --input-radius: 12px;
  --button-radius: 12px;
}

.dark {
  --background: #0F172A;
  --surface: #1B2433;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --border: #334155;
}

Light Mode dan Dark Mode wajib menggunakan layout identik.

Jangan mengubah ukuran, posisi, atau struktur komponen ketika theme berubah.

============================================================
TYPOGRAPHY
============================================================

Gunakan font utama:

Inter

Fallback:

"Inter", "Plus Jakarta Sans", system-ui, sans-serif

Ukuran:

Heading 1:
32px / 700

Heading 2:
24px / 700

Heading 3:
20px / 600

Heading 4:
18px / 600

Body Large:
16px / 400

Body Default:
14px / 400

Body Small:
12px / 400

Caption:
11px / 500

Button:
14px / 600

Gunakan typography yang sama pada seluruh modul.

============================================================
SISTEM SPACING
============================================================

Gunakan skala:

4px
8px
12px
16px
20px
24px
32px
40px
48px
64px

Jangan menggunakan nilai spacing acak.

Default page gap:
24px

Default card padding:
24px desktop
20px tablet
16px mobile

============================================================
STRUKTUR KOMPONEN GLOBAL
============================================================

Buat struktur:

web-dashboard/src/
├── components/
│   ├── ui/
│   │   ├── AppButton.tsx
│   │   ├── IconButton.tsx
│   │   ├── AppBadge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── AppAlert.tsx
│   │   ├── AppAvatar.tsx
│   │   ├── AppTooltip.tsx
│   │   ├── AppDropdown.tsx
│   │   ├── AppTabs.tsx
│   │   ├── AppAccordion.tsx
│   │   ├── AppProgress.tsx
│   │   ├── AppSkeleton.tsx
│   │   └── AppDivider.tsx
│   │
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── PageContainer.tsx
│   │   ├── PageHeader.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── DesktopSidebar.tsx
│   │   ├── TabletSidebar.tsx
│   │   ├── MobileBottomNavigation.tsx
│   │   ├── TabletBottomNavigation.tsx
│   │   ├── AppTopbar.tsx
│   │   ├── MobileHeader.tsx
│   │   └── AppFooter.tsx
│   │
│   ├── cards/
│   │   ├── AppCard.tsx
│   │   ├── KpiCard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── StudentProfileCard.tsx
│   │   ├── EmployeeProfileCard.tsx
│   │   ├── QuickActionCard.tsx
│   │   └── SummaryCard.tsx
│   │
│   ├── forms/
│   │   ├── FormField.tsx
│   │   ├── AppInput.tsx
│   │   ├── AppTextarea.tsx
│   │   ├── AppSelect.tsx
│   │   ├── AppMultiSelect.tsx
│   │   ├── AppSearchSelect.tsx
│   │   ├── AppCheckbox.tsx
│   │   ├── AppRadio.tsx
│   │   ├── AppSwitch.tsx
│   │   ├── AppDatePicker.tsx
│   │   ├── AppTimePicker.tsx
│   │   ├── AppFileUpload.tsx
│   │   ├── AppImageUpload.tsx
│   │   ├── AvatarUpload.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── CurrencyInput.tsx
│   │   └── PhoneInput.tsx
│   │
│   ├── table/
│   │   ├── AppDataTable.tsx
│   │   ├── TableToolbar.tsx
│   │   ├── TableSearch.tsx
│   │   ├── TableFilterButton.tsx
│   │   ├── TableActions.tsx
│   │   ├── TablePagination.tsx
│   │   ├── TableColumnVisibility.tsx
│   │   ├── TableDensity.tsx
│   │   ├── TableEmptyState.tsx
│   │   └── TableSkeleton.tsx
│   │
│   ├── overlay/
│   │   ├── AppModal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── DeleteDialog.tsx
│   │   ├── AppDrawer.tsx
│   │   ├── FormDrawer.tsx
│   │   ├── DetailDrawer.tsx
│   │   ├── FilterDrawer.tsx
│   │   └── NotificationDrawer.tsx
│   │
│   ├── navigation/
│   │   ├── SidebarMenuItem.tsx
│   │   ├── SidebarMenuGroup.tsx
│   │   ├── BottomNavItem.tsx
│   │   ├── UserMenu.tsx
│   │   ├── NotificationMenu.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   ├── TemplateSwitcher.tsx
│   │   └── GlobalSearch.tsx
│   │
│   ├── feedback/
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── AccessDenied.tsx
│   │   ├── OfflineState.tsx
│   │   └── AppToast.tsx
│   │
│   └── profile/
│       ├── ProfileHeader.tsx
│       ├── ProfileAvatar.tsx
│       ├── ProfileInfo.tsx
│       ├── ProfileStats.tsx
│       ├── ProfileTabs.tsx
│       ├── ProfileTimeline.tsx
│       ├── ProfileDocuments.tsx
│       └── ProfileActivity.tsx
│
├── config/
│   ├── design-tokens.ts
│   ├── navigation.ts
│   ├── role-navigation.ts
│   └── status-config.ts
│
├── hooks/
│   ├── useTheme.ts
│   ├── useUiTemplate.ts
│   ├── useResponsive.ts
│   └── useRoleNavigation.ts
│
└── stores/
    ├── ui-settings-store.ts
    └── navigation-store.ts

============================================================
BUTTON SYSTEM
============================================================

Semua button wajib menggunakan AppButton.

Varian:

- primary
- secondary
- success
- warning
- danger
- info
- outline
- ghost
- soft
- link

Ukuran:

- xs
- sm
- md
- lg
- xl
- icon

State:

- default
- hover
- active
- focus
- disabled
- loading

Ikon menggunakan Lucide React.

Standar ikon:

Tambah:
Plus

Edit:
Pencil

Detail:
Eye

Hapus:
Trash2

Restore:
RotateCcw

Simpan:
Save

Batal:
X

Filter:
SlidersHorizontal

Search:
Search

Import:
Upload

Export Excel:
FileSpreadsheet

Export PDF:
FileText

Print:
Printer

Refresh:
RefreshCcw

Download:
Download

Upload:
UploadCloud

Scan:
ScanLine atau QrCode

Kamera:
Camera

Notifikasi:
Bell

Pengaturan:
Settings

Profil:
UserRound

Logout:
LogOut

Dilarang menggunakan ikon berbeda untuk aksi yang sama pada modul berbeda.

============================================================
TABLE SYSTEM
============================================================

Semua tabel wajib menggunakan AppDataTable.

Fitur standar:

- server-side pagination;
- server-side search;
- server-side sorting;
- row selection;
- bulk action;
- sticky header;
- column visibility;
- density switcher;
- responsive;
- loading skeleton;
- empty state;
- error state;
- pagination;
- page size;
- action column;
- filter;
- import;
- export;
- print.

Urutan toolbar tabel:

Kiri:
- Search
- Filter aktif

Kanan:
- Refresh
- Import
- Export
- Tambah Data

Urutan action row:

- Detail
- Edit
- Aksi tambahan
- Hapus

Pada desktop, tampilkan icon button dengan tooltip.

Pada mobile, gabungkan aksi ke dropdown tiga titik agar tidak terlalu padat.

============================================================
CARD SYSTEM
============================================================

Semua card wajib menggunakan AppCard.

Jenis:

- default;
- bordered;
- elevated;
- interactive;
- compact;
- profile;
- KPI;
- chart;
- summary.

KPI Card berisi:

- ikon;
- label;
- nilai;
- trend;
- persentase;
- mini chart opsional;
- loading skeleton;
- tooltip.

Card tidak boleh memiliki radius dan shadow yang berbeda secara acak.

Radius dan shadow harus mengikuti template aktif.

============================================================
FORM SYSTEM
============================================================

Semua form menggunakan:

- React Hook Form;
- Zod;
- FormField;
- komponen input global.

Struktur field:

Label
Input
Helper text
Validation message

Field wajib diberi tanda bintang merah.

State field:

- default;
- focus;
- success;
- error;
- disabled;
- read-only.

Tinggi field harus konsisten.

Jangan membuat input HTML dengan styling lokal pada setiap halaman.

============================================================
DRAWER DAN MODAL
============================================================

CRUD menggunakan Drawer.

Gunakan FormDrawer untuk:

- tambah;
- edit.

Gunakan DetailDrawer untuk:

- detail;
- riwayat;
- audit.

Modal hanya digunakan untuk:

- konfirmasi;
- hapus;
- approval;
- peringatan;
- informasi singkat;
- preview tertentu.

Struktur drawer:

Header:
- ikon;
- judul;
- deskripsi;
- tombol close.

Body:
- form atau detail;
- dapat di-scroll.

Footer:
- tombol Batal;
- tombol Simpan atau Update.

Lebar:

Desktop:
- sm 420px
- md 560px
- lg 720px
- xl 880px

Tablet:
- maksimal 85vw

Mobile:
- full screen atau hampir full screen.

============================================================
PROFILE DAN AVATAR
============================================================

Sediakan komponen profil untuk:

- siswa;
- pegawai;
- guru;
- orang tua;
- pengguna login.

Gunakan AppAvatar dan ProfileAvatar.

Ukuran avatar:

- xs 24px
- sm 32px
- md 40px
- lg 56px
- xl 80px
- 2xl 112px

Bentuk:

- circle sebagai default;
- rounded;
- square bila diperlukan.

Jika foto tidak tersedia:

- tampilkan inisial nama;
- gunakan warna latar yang konsisten;
- jangan tampilkan gambar rusak.

ProfileHeader siswa memuat:

- foto;
- nama lengkap;
- NIS/NISN;
- unit;
- kelas;
- rombel;
- status;
- tombol edit;
- tombol cetak profil.

ProfileHeader pegawai memuat:

- foto;
- nama lengkap;
- NIY/NIP;
- jabatan;
- unit kerja;
- status;
- tombol edit;
- tombol cetak profil.

Profile menu pengguna login memuat:

- avatar;
- nama;
- role;
- unit;
- Profil Saya;
- Pengaturan Akun;
- Ganti Password;
- Aktivitas Saya;
- Theme;
- Logout.

============================================================
NOTIFICATION SYSTEM
============================================================

Sediakan NotificationMenu dan NotificationDrawer.

Jenis notifikasi:

- info;
- success;
- warning;
- danger;
- approval;
- attendance;
- academic;
- mutabaah;
- tahfizh;
- finance;
- system.

Setiap notifikasi memuat:

- ikon;
- judul;
- deskripsi;
- waktu;
- status dibaca;
- link tujuan;
- indikator prioritas.

Fitur:

- tandai dibaca;
- tandai semua dibaca;
- filter;
- grouping;
- pagination atau infinite scroll;
- badge jumlah unread;
- empty state;
- real-time ready.

============================================================
RESPONSIVE BREAKPOINT
============================================================

Gunakan breakpoint Tailwind:

sm:
640px

md:
768px

lg:
1024px

xl:
1280px

2xl:
1536px

============================================================
DESKTOP DAN LAPTOP
============================================================

Pada lebar minimal 1024px:

- gunakan sidebar kiri;
- sidebar dapat collapse;
- gunakan topbar penuh;
- tampilkan breadcrumb;
- tampilkan toolbar lengkap;
- gunakan table desktop;
- drawer muncul dari kanan;
- bottom navigation tidak ditampilkan.

Laptop kecil:

- sidebar dapat collapse otomatis;
- KPI card menjadi dua atau tiga kolom;
- toolbar boleh wrap;
- table tetap dapat digunakan tanpa memotong aksi penting.

============================================================
TABLET
============================================================

Pada lebar 768px sampai 1023px:

- sidebar desktop tidak ditampilkan secara permanen;
- sidebar tersedia sebagai sheet/drawer;
- topbar tetap tersedia;
- bottom navigation WAJIB ditampilkan;
- bottom navigation tidak boleh hilang;
- content memiliki padding aman di bawah agar tidak tertutup bottom navigation;
- tabel dapat berubah menjadi table scroll atau card list;
- form menggunakan satu atau dua kolom;
- drawer menggunakan lebar maksimal 85vw;
- hero banner disederhanakan tanpa menghilangkan identitas halaman.

Bottom navigation tablet minimal memuat:

- Beranda;
- Jadwal atau Modul Utama;
- tombol aksi tengah;
- Notifikasi;
- Profil.

Tombol aksi tengah dapat berubah berdasarkan role dan halaman.

============================================================
MOBILE
============================================================

Pada lebar di bawah 768px:

- gunakan MobileHeader;
- gunakan MobileBottomNavigation;
- sidebar dibuka melalui drawer;
- breadcrumb dapat disederhanakan;
- toolbar menjadi responsive;
- button sekunder dapat masuk ke menu More;
- DataTable dapat berubah menjadi responsive card list;
- filter dibuka melalui FilterDrawer;
- form satu kolom;
- drawer menjadi full screen;
- modal menggunakan lebar hampir penuh;
- button aksi utama dapat sticky di bawah form.

Bottom navigation mobile harus memiliki maksimal lima item.

============================================================
BOTTOM NAVIGATION BERDASARKAN ROLE
============================================================

Buat bottom navigation dinamis berdasarkan role.

Konfigurasi harus berasal dari:

src/config/role-navigation.ts

Jangan hardcode menu pada setiap halaman.

Contoh Super Admin:

1. Beranda
2. Modul
3. Tambah / Quick Action
4. Notifikasi
5. Profil

Contoh Guru:

1. Beranda
2. Jadwal
3. Scan
4. Notifikasi
5. Profil

Contoh Wali Kelas:

1. Beranda
2. Kelas
3. Scan
4. Mutaba’ah
5. Profil

Contoh Siswa:

1. Beranda
2. Jadwal
3. Tugas
4. Notifikasi
5. Profil

Contoh Orang Tua:

1. Beranda
2. Anak
3. Aktivitas
4. Notifikasi
5. Profil

============================================================
TOMBOL SCAN UNTUK GURU
============================================================

Ketika pengguna login sebagai:

- guru;
- wali kelas;
- guru mapel;
- guru tahfizh;
- pembimbing;
- musyrif;
- musyrifah;

dan pengguna memiliki permission presensi yang sesuai, tampilkan tombol Scan pada posisi tengah bottom navigation.

Gunakan tombol aksi berbentuk:

- circle;
- lebih besar dari menu lain;
- elevated;
- menggunakan ikon ScanLine, QrCode, atau Camera;
- memiliki label Scan.

Aksi Scan membuka Scan Action Sheet:

- Scan QR Code;
- Scan Barcode;
- Buka Kamera;
- Input Presensi Manual.

Untuk guru yang mengambil presensi murid, tombol Scan mengarah ke:

Presensi
→ Pilih Jadwal Pelajaran
→ Pilih Rombel
→ Scan Siswa

Sebelum membuka scanner:

1. Validasi permission.
2. Validasi jadwal aktif.
3. Validasi guru pengampu.
4. Validasi unit.
5. Validasi kelas atau rombel.
6. Validasi waktu presensi.
7. Jika tidak ada jadwal aktif, tampilkan pesan yang jelas.

Tombol Scan hanya muncul jika:

- role sesuai;
- permission sesuai;
- modul presensi aktif.

Jangan hanya memeriksa role.
Gunakan permission backend dan frontend.

============================================================
LIGHT MODE DAN DARK MODE
============================================================

Sediakan pilihan:

- Light
- Dark
- System

Simpan pilihan pengguna.

Dark Mode tidak boleh:

- mengubah layout;
- mengubah ukuran;
- menghilangkan border;
- menghilangkan ikon;
- mengubah posisi navigasi;
- mengubah bentuk card;
- merusak chart;
- menghilangkan bottom navigation.

Semua komponen harus memiliki variant dark.

Gunakan CSS variables dan class dark.

Jangan menulis warna background putih secara hardcode di dalam halaman modul.

Gunakan token seperti:

bg-surface
text-primary
text-secondary
border-default

============================================================
PENGATURAN SITUS
============================================================

Buat halaman:

Pengaturan
→ Pengaturan Situs
→ Tampilan

Field:

Template Antarmuka:
- Classic Enterprise
- Modern Soft
- Premium Compact

Mode Tampilan:
- Light
- Dark
- System

Kepadatan:
- Compact
- Comfortable
- Spacious

Sidebar:
- Expanded
- Collapsed
- Otomatis

Posisi Navigasi Mobile:
- Bottom
- Drawer

Ukuran Font:
- Small
- Default
- Large

Animasi:
- Aktif
- Nonaktif

Preview:

- tampilkan preview Card;
- Button;
- Field;
- Table;
- Badge;
- Sidebar;
- Bottom Navigation;
- Light/Dark.

Simpan pengaturan global sekolah dan pengaturan personal pengguna secara terpisah.

Prioritas pengaturan:

1. Pengaturan personal pengguna
2. Pengaturan unit
3. Pengaturan global sistem
4. Default aplikasi

============================================================
STANDARD PAGE LAYOUT
============================================================

Semua halaman CRUD menggunakan urutan:

1. PageHeader / HeroBanner
2. Breadcrumb
3. KPI Card opsional
4. PageToolbar
5. Filter aktif
6. AppDataTable atau AppCardGrid
7. Pagination
8. FormDrawer
9. ConfirmDialog
10. Toast

Jangan mengubah urutan ini tanpa kebutuhan khusus.

============================================================
STANDARD CRUD ACTION
============================================================

Button toolbar:

- Filter
- Refresh
- Import
- Export
- Tambah Data

Action table:

- Detail
- Edit
- Hapus

Tambahan bila relevan:

- Restore
- Print
- Approval
- History
- Duplicate
- Assign

Semua aksi menggunakan ikon global yang sama.

============================================================
STATUS BADGE
============================================================

Gunakan StatusBadge.

Mapping standar:

Aktif:
success

Nonaktif:
neutral

Draft:
info

Proses:
info

Pending:
warning

Disetujui:
success

Ditolak:
danger

Dibatalkan:
danger

Selesai:
success

Diarsipkan:
neutral

Hadir:
success

Izin:
info

Sakit:
warning

Alpha:
danger

Terlambat:
warning

Jangan membuat warna status berbeda antar modul.

============================================================
LOADING, EMPTY, DAN ERROR STATE
============================================================

Setiap halaman wajib memiliki:

Loading:
- skeleton;
- jangan hanya spinner layar penuh.

Empty:
- ikon atau ilustrasi;
- judul;
- deskripsi;
- tombol aksi bila pengguna memiliki permission.

Error:
- judul;
- deskripsi;
- tombol coba lagi;
- detail error hanya untuk development.

Access denied:
- tampilkan halaman 403 yang konsisten.

============================================================
ACCESSIBILITY
============================================================

Wajib:

- keyboard navigation;
- focus ring;
- aria-label;
- tooltip untuk icon button;
- contrast minimal AA;
- ukuran target sentuh minimal 44px pada tablet dan mobile;
- dukungan screen reader;
- jangan hanya mengandalkan warna untuk status.

============================================================
PERFORMANCE
============================================================

Gunakan:

- lazy loading;
- route-based code splitting;
- memoization bila perlu;
- debounced search;
- server-side pagination;
- virtual scroll hanya untuk data besar;
- image lazy loading;
- avatar compression;
- skeleton;
- query caching;
- optimistic update hanya untuk proses aman.

============================================================
ATURAN IMPLEMENTASI MODUL BARU
============================================================

Setiap kali membuat modul baru:

1. Baca Design System SIMSIT.
2. Audit komponen global yang tersedia.
3. Gunakan komponen global.
4. Jangan membuat komponen lokal jika komponen global sudah tersedia.
5. Jangan membuat Button baru.
6. Jangan membuat Card baru.
7. Jangan membuat Table baru.
8. Jangan membuat Drawer baru.
9. Jangan membuat Modal baru.
10. Jangan membuat Input baru.
11. Jangan membuat Badge baru.
12. Jangan membuat Pagination baru.
13. Jangan membuat Loading State baru.
14. Jangan membuat Empty State baru.
15. Jangan membuat warna baru tanpa menambahkan design token.
16. Jangan menggunakan ikon selain Lucide untuk web.
17. Jangan mengubah layout utama.
18. Jangan menghapus Light Mode.
19. Jangan menghapus Dark Mode.
20. Jangan menghilangkan bottom navigation pada tablet dan mobile.
21. Jangan mengubah tampilan modul lama ketika menambahkan modul baru.
22. Jangan menulis class Tailwind visual berulang di setiap halaman jika dapat dimasukkan ke komponen global.

Jika kebutuhan komponen belum tersedia:

- buat komponen reusable di folder global;
- dokumentasikan API props;
- tambahkan contoh penggunaan;
- gunakan kembali pada modul terkait;
- jangan membuat versi khusus hanya untuk satu modul kecuali benar-benar unik.

============================================================
CONTOH PEMAKAIAN HALAMAN CRUD
============================================================

Gunakan struktur seperti berikut:

<AppLayout>
  <PageContainer>
    <PageHeader
      title="Data Siswa"
      description="Kelola data siswa seluruh unit pendidikan"
      breadcrumbs={breadcrumbs}
      icon={Users}
    />

    <KpiCardGrid>
      <KpiCard />
      <KpiCard />
      <KpiCard />
      <KpiCard />
    </KpiCardGrid>

    <AppCard>
      <TableToolbar>
        <TableSearch />
        <TableFilterButton />
        <RefreshButton />
        <ImportButton />
        <ExportButton />
        <AppButton icon={Plus}>
          Tambah Data
        </AppButton>
      </TableToolbar>

      <AppDataTable />

      <TablePagination />
    </AppCard>

    <FormDrawer />
    <DetailDrawer />
    <DeleteDialog />
  </PageContainer>
</AppLayout>

Semua modul CRUD harus mengikuti pola tersebut.

============================================================
PENGUJIAN RESPONSIVE
============================================================

Uji minimal pada ukuran:

Mobile kecil:
360 × 800

Mobile besar:
430 × 932

Tablet portrait:
768 × 1024

Tablet landscape:
1024 × 768

Laptop:
1366 × 768

Desktop:
1440 × 900

Desktop besar:
1920 × 1080

Pastikan:

- tidak ada konten terpotong;
- tidak ada button keluar layar;
- bottom navigation tidak menutup konten;
- table tetap terbaca;
- drawer sesuai viewport;
- modal tidak keluar layar;
- dropdown tidak terpotong;
- sidebar tidak menutupi content;
- profile image tidak pecah;
- chart responsif;
- Light dan Dark Mode bekerja.

============================================================
OUTPUT YANG DIHARAPKAN
============================================================

Buat:

1. Design token global.
2. Theme provider.
3. Template provider.
4. Tiga template UI.
5. Light Mode.
6. Dark Mode.
7. Komponen reusable.
8. Layout responsive.
9. Sidebar desktop.
10. Drawer sidebar tablet/mobile.
11. Bottom navigation tablet.
12. Bottom navigation mobile.
13. Role-based navigation.
14. Tombol Scan guru.
15. Pengaturan tampilan.
16. Preview template.
17. Dokumentasi komponen.
18. Storybook atau halaman showcase bila tersedia.
19. Contoh satu halaman CRUD.
20. Contoh halaman profil siswa.
21. Contoh halaman profil pegawai.
22. Contoh notification center.

Setelah selesai, laporkan:

- file yang dibuat;
- file yang diubah;
- daftar komponen;
- daftar design token;
- cara mengganti template;
- cara mengganti Light/Dark;
- cara menambahkan modul baru;
- cara menambahkan item bottom navigation;
- cara mengatur tombol Scan berdasarkan role dan permission;
- hasil lint;
- hasil type-check;
- hasil build;
- hasil pengujian responsive.

Jangan mengubah fungsi bisnis modul yang sudah ada.
Jangan mengubah API backend tanpa kebutuhan.
Jangan merusak menu atau route yang sudah berjalan.

============================================================
BATAS MOTION
============================================================

Motion bukan source of truth terpisah. Jika task menyentuh animasi, ikuti `04_UI_UX/UI_RULEBOOK.md`, `DESIGN_SYSTEM.md`, `COMPONENT_STANDARD.md`, dan `MODAL_DRAWER_STANDARD.md`; hormati reduced motion dan jangan membuat animasi lokal yang tidak reusable.
