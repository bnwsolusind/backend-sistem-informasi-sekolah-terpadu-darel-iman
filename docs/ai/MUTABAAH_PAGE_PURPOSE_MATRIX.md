# Matriks Tujuan Halaman & Alur Pengguna Modul Mutaba’ah (MUTABAAH_PAGE_PURPOSE_MATRIX.md)

Dokumen ini merinci tujuan utama, peran pengguna target, tindakan utama, sumber data, dan perlakuan UI/UX khusus untuk seluruh 8 Halaman Modul Mutaba’ah.

---

```text
PAGE: Dashboard Mutaba’ah
PRIMARY USER: Tata Usaha, Kepala Sekolah, Waka Kesiswaan, Pembimbing
MAIN GOAL: Melihat ringkasan keterisian Mutaba’ah harian, tren grafik, serta alert tindak lanjut siswa/rombel bermasalah.
PRIMARY ACTION: Navigasi Quick Actions (+ Tambah Agenda, + Template, + Assign)
SECONDARY ACTION: Filter ringkas periode & unit
MAIN DATA: /api/mutabaah/analytics/dashboard
MAIN COMPONENT: MutabaahAnalyticsPage (view="dashboard")
FORM: - (Direct navigation to specific drawers)
DETAIL: Modal alert siswa belum mengisi
READ/WRITE: READ-ONLY
STATUS: UI REDESIGNED
```

```text
PAGE: Rekap Mutaba’ah
PRIMARY USER: Wali Kelas, Pembimbing, Tata Usaha, Kepala Sekolah
MAIN GOAL: Menganalisis rekapitulasi keterisian Mutaba’ah harian/mingguan/bulanan per siswa, kelas, dan indikator.
PRIMARY ACTION: Export Rekap (Excel/PDF)
SECONDARY ACTION: Filter 2-Tingkat (Utama + Drawer Lanjutan) & Periode Tabs
MAIN DATA: /api/mutabaah/analytics/recap
MAIN COMPONENT: MutabaahAnalyticsPage (view="rekap")
FORM: -
DETAIL: Student Recap Detail Drawer (Jurnal & Grafis)
READ/WRITE: READ & EXPORT
STATUS: UI REDESIGNED
```

```text
PAGE: Target & Evaluasi
PRIMARY USER: Pembimbing, Guru PAI, Waka Kesiswaan, Tata Usaha
MAIN GOAL: Menyusun target pembiasaan Mutaba’ah dan mengevaluasi persentase capaian riil siswa vs target.
PRIMARY ACTION: + Tambah Target Mutaba’ah
SECONDARY ACTION: Filter status target (Tercapai / Perlu Bimbingan)
MAIN DATA: /api/mutabaah/enterprise/templates
MAIN COMPONENT: MutabaahOverviewPage (view="evaluasi")
FORM: TargetModalForm (Name, Target %, Unit, Level, Status, Notes)
DETAIL: Student Evaluation Breakdown Modal
READ/WRITE: FULL CRUD
STATUS: UI REDESIGNED
```

```text
PAGE: Rincian Agenda TU
PRIMARY USER: Tata Usaha, Operator, Waka Kesiswaan
MAIN GOAL: Mengelola daftar indikator agenda harian (kode, nama, kategori, tipe input, bobot, status).
PRIMARY ACTION: + Tambah Agenda
SECONDARY ACTION: Filter kategori & pencarian kata kunci
MAIN DATA: /api/mutabaah/enterprise/agendas
MAIN COMPONENT: MutabaahEnterprisePage (resource="agendas")
FORM: CrudDrawer (Agenda Form)
DETAIL: Agenda Detail Drawer & Soft Delete / Restore
READ/WRITE: FULL CRUD
STATUS: UI REDESIGNED
```

```text
PAGE: Template Agenda
PRIMARY USER: Tata Usaha, Waka Kurikulum, Pembimbing Lead
MAIN GOAL: Membuat pola master template Mutaba’ah yang dapat digunakan kembali serta menyusun daftar indikatornya.
PRIMARY ACTION: + Tambah Template
SECONDARY ACTION: Susun Agenda Indikator (GripVertical)
MAIN DATA: /api/mutabaah/enterprise/templates
MAIN COMPONENT: MutabaahEnterprisePage (resource="templates")
FORM: CrudDrawer & TemplateItemsDrawer (Item Builder, Weight, Target, Parent Signature Toggle)
DETAIL: Template Preview & Items Drawer
READ/WRITE: FULL CRUD
STATUS: UI REDESIGNED
```

```text
PAGE: Assign Template
PRIMARY USER: Tata Usaha, Operator
MAIN GOAL: Menugaskan Template Agenda kepada Unit, Jenjang, Kelas, Rombel, atau Siswa Khusus dengan validasi periode.
PRIMARY ACTION: + Assign Template
SECONDARY ACTION: Filter status penugasan & rombel
MAIN DATA: /api/mutabaah/enterprise/template-assignments
MAIN COMPONENT: MutabaahEnterprisePage (resource="template-assignments")
FORM: CrudDrawer (Dependent Dropdown Unit → Class → Rombel → Student & Overlap Checker)
DETAIL: Assignment Detail Drawer
READ/WRITE: FULL CRUD
STATUS: UI REDESIGNED
```

```text
PAGE: Assign Pembimbing
PRIMARY USER: Tata Usaha, Koordinator Musyrif, Wali Kelas Lead
MAIN GOAL: Menugaskan Musyrif/Musyrifah/Wali Kelas/Guru PAI kepada rombel atau kelompok pembimbingan.
PRIMARY ACTION: + Assign Pembimbing
SECONDARY ACTION: Filter jenis pembimbing & unit pesantren
MAIN DATA: /api/mutabaah/enterprise/supervisor-assignments
MAIN COMPONENT: MutabaahEnterprisePage (resource="supervisor-assignments")
FORM: CrudDrawer (Permission Toggles: input, edit, finalize, view report & Pesantren/Ma'had check)
DETAIL: Supervisor Assignment & Scope Detail Drawer
READ/WRITE: FULL CRUD
STATUS: UI REDESIGNED
```

```text
PAGE: Monitoring Orang Tua
PRIMARY USER: Wali Kelas, Koordinator Musyrif, Manajemen Sekolah
MAIN GOAL: Memantau keterlibatan wali murid dalam membaca dan menandatangani paraf digital laporan Mutaba’ah anak.
PRIMARY ACTION: Filter Status Paraf (Signed / Unsigned)
SECONDARY ACTION: Search nama siswa / wali murid
MAIN DATA: /api/mutabaah/analytics/recap?signature_status=signed
MAIN COMPONENT: MutabaahOverviewPage (view="parents")
FORM: - (Read-only monitoring)
DETAIL: Signature Audit Detail Modal (Timestamp ISO8601, User ID, IP Address & Security Meta)
READ/WRITE: READ-ONLY AUDIT
STATUS: UI REDESIGNED
```
