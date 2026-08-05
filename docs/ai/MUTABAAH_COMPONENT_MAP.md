# Pemetaan Komponen UI Modern Modul Mutaba’ah (MUTABAAH_COMPONENT_MAP.md)

Dokumen ini mencatat pemetaan terperinci seluruh elemen antarmuka (UI Components) untuk 8 Halaman Modul Mutaba’ah.

---

```text
PAGE: Dashboard Mutaba’ah
HEADER COMPONENT: MutabaahPageHeader (Icon Box 44px + Period Badge)
KPI COMPONENT: Grid 6 MutabaahKpiCard (Dipantau, Terisi, Belum, Target %, Agenda, Ortu)
FILTER COMPONENT: Compact Context Bar (Unit, Tahun Ajaran, Semester, Tanggal)
CARD COMPONENT: Urgent Alert Card + Today's Agendas List Card + Quick Actions Card
TABLE COMPONENT: -
FORM COMPONENT: Quick Navigation Actions
MODAL/DRAWER: Unfilled Student Alert Detail Modal
STATUS COMPONENT: MutabaahStatusBadge
EMPTY STATE: MutabaahEmptyState ("Belum ada aktivitas Mutaba’ah")
ERROR STATE: MutabaahErrorState ("Data gagal dimuat" dengan tombol Retry)
PRIMARY ACTION: Input Mutaba’ah / Quick Actions Bar
RESPONSIVE MODE: 4-kolom desktop -> 2-kolom tablet/mobile touch scroll
STATUS: UI REDESIGNED
```

```text
PAGE: Rekap Mutaba’ah
HEADER COMPONENT: MutabaahPageHeader (Title + Period Badge)
KPI COMPONENT: Grid 4 MutabaahKpiCard (Keterisian, Target %, Belum Mengisi, Indikator Terendah)
FILTER COMPONENT: 2-Tier Filter (Filter Utama + Drawer Lanjutan dengan Active Filter Chips)
CARD COMPONENT: Summary Card + Student Detail Breakdown Card
TABLE COMPONENT: Responsive Recap Table dengan Visual Progress Bar %
FORM COMPONENT: Student Recap Detail Drawer
MODAL/DRAWER: Recap Detail Drawer (Jurnal & Grafis Keterisian)
STATUS COMPONENT: MutabaahStatusBadge
EMPTY STATE: MutabaahEmptyState ("Belum ada data rekap")
ERROR STATE: MutabaahErrorState ("Gagal mengambil data rekap")
PRIMARY ACTION: Export Rekap (Excel/PDF)
RESPONSIVE MODE: Table view desktop -> Accordion stacked cards mobile
STATUS: UI REDESIGNED
```

```text
PAGE: Target & Evaluasi
HEADER COMPONENT: MutabaahPageHeader (Title + Icon Target)
KPI COMPONENT: Grid 4 MutabaahKpiCard (Target Aktif, Tercapai, Belum Tercapai, Berakhir Segera)
FILTER COMPONENT: Filter Status Target & Cari Siswa/Kelas
CARD COMPONENT: Target Card View / Table View Toggle
TABLE COMPONENT: Target Evaluation Progress Table
FORM COMPONENT: TargetModalForm (5-Step Wizard Drawer)
MODAL/DRAWER: TargetModalForm Drawer + Student Evaluation Breakdown Modal
STATUS COMPONENT: MutabaahStatusBadge (Tercapai / Perlu Bimbingan)
EMPTY STATE: MutabaahEmptyState ("Belum ada target aktif")
ERROR STATE: MutabaahErrorState ("Gagal memuat target")
PRIMARY ACTION: + Tambah Target Mutaba’ah
RESPONSIVE MODE: Grid cards desktop -> Single card stacked mobile
STATUS: UI REDESIGNED
```

```text
PAGE: Rincian Agenda TU
HEADER COMPONENT: MutabaahPageHeader (Title + Icon Calendar)
KPI COMPONENT: Grid 4 MutabaahKpiCard (Agenda Hari Ini, Agenda Aktif, Selesai, Dibatalkan)
FILTER COMPONENT: Category Filter Dropdown + Status Filter
CARD COMPONENT: Agenda Status Cards
TABLE COMPONENT: Agendas Enterprise Table (Kode, Nama, Kategori, Tipe Input, Bobot, Status)
FORM COMPONENT: Agenda CrudDrawer
MODAL/DRAWER: Agenda CrudDrawer & Soft Delete / Restore Confirmation Modal
STATUS COMPONENT: MutabaahStatusBadge
EMPTY STATE: MutabaahEmptyState ("Belum ada agenda")
ERROR STATE: MutabaahErrorState ("Gagal memuat agenda")
PRIMARY ACTION: + Tambah Agenda
RESPONSIVE MODE: List/Calendar view toggle
STATUS: UI REDESIGNED
```

```text
PAGE: Template Agenda
HEADER COMPONENT: MutabaahPageHeader (Title + Icon ClipboardList)
KPI COMPONENT: Grid 4 MutabaahKpiCard (Total Template, Aktif, Draft, Digunakan)
FILTER COMPONENT: Unit & Status Filter
CARD COMPONENT: Template Cards View (Category Icon, Name, Code, Indicators Preview)
TABLE COMPONENT: Templates Enterprise Table
FORM COMPONENT: Template CrudDrawer + TemplateItemsDrawer (Indicator Builder)
MODAL/DRAWER: TemplateItemsDrawer (Drag handles, Weight, Target default, Paraf Ortu toggle)
STATUS COMPONENT: MutabaahStatusBadge
EMPTY STATE: MutabaahEmptyState ("Belum ada Template Agenda")
ERROR STATE: MutabaahErrorState ("Gagal memuat template")
PRIMARY ACTION: + Tambah Template
RESPONSIVE MODE: 3-column card grid desktop -> 1-column card mobile
STATUS: UI REDESIGNED
```

```text
PAGE: Assign Template
HEADER COMPONENT: MutabaahPageHeader (Title + Icon Layers3)
KPI COMPONENT: Grid 4 MutabaahKpiCard (Assignment Aktif, Unit, Rombel, Berakhir Segera)
FILTER COMPONENT: Unit & Status Filter
CARD COMPONENT: Assignment Summary Card + Overlap Warning Alert
TABLE COMPONENT: Template Assignments Enterprise Table
FORM COMPONENT: Step-Based Wizard CrudDrawer (1. Template, 2. Periode, 3. Target Scope, 4. Options, 5. Review)
MODAL/DRAWER: Assignment Wizard Drawer
STATUS COMPONENT: MutabaahStatusBadge
EMPTY STATE: MutabaahEmptyState ("Belum ada template yang ditetapkan")
ERROR STATE: MutabaahErrorState ("Gagal memuat assignment")
PRIMARY ACTION: + Tetapkan Template
RESPONSIVE MODE: Wizard modal desktop -> Fullscreen step sheet mobile
STATUS: UI REDESIGNED
```

```text
PAGE: Assign Pembimbing
HEADER COMPONENT: MutabaahPageHeader (Title + Icon UserRoundCheck)
KPI COMPONENT: Grid 4 MutabaahKpiCard (Pembimbing Aktif, Siswa Terbimbing, Belum Ada Pembimbing, Assignment Berakhir)
FILTER COMPONENT: Supervisor Type Filter + Unit Select
CARD COMPONENT: Supervisor Cards dengan Avatar & Quota Siswa Binaan
TABLE COMPONENT: 2-Panel Desktop Layout / Supervisor Table
FORM COMPONENT: Supervisor Assignment CrudDrawer (Permission Toggles: input, edit, finalize, view report)
MODAL/DRAWER: Supervisor CrudDrawer & Scope Detail Drawer
STATUS COMPONENT: MutabaahStatusBadge
EMPTY STATE: MutabaahEmptyState ("Belum ada pembimbing yang ditetapkan")
ERROR STATE: MutabaahErrorState ("Gagal memuat pembimbing")
PRIMARY ACTION: + Tetapkan Pembimbing
RESPONSIVE MODE: 2-Panel desktop -> Single panel list view mobile
STATUS: UI REDESIGNED
```

```text
PAGE: Monitoring Orang Tua
HEADER COMPONENT: MutabaahPageHeader (Title + Icon UsersRound)
KPI COMPONENT: Grid 4 MutabaahKpiCard (Orang Tua Terhubung, Paraf Signed, Belum Paraf, Respons Ortu)
FILTER COMPONENT: Status Paraf Filter (Signed / Unsigned) + Search
CARD COMPONENT: Parent Activity Summary Card
TABLE COMPONENT: Parent Signatures Audit Table
FORM COMPONENT: - (Read-only monitoring)
MODAL/DRAWER: Signature Audit Detail Modal (Timestamp ISO8601, User ID, IP Address & Security Meta)
STATUS COMPONENT: MutabaahStatusBadge (Ditandatangani / Belum Paraf)
EMPTY STATE: MutabaahEmptyState ("Belum ada aktivitas orang tua")
ERROR STATE: MutabaahErrorState ("Gagal memuat data monitoring")
PRIMARY ACTION: Read-only Status Filter & Export Monitoring
RESPONSIVE MODE: Table desktop -> Audit card list mobile
STATUS: UI REDESIGNED
```
