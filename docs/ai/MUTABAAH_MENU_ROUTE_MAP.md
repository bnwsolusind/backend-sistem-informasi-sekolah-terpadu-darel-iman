# Pemetaan Terperinci Halaman, Rute Frontend, Component, API, & CRUD Modul Mutaba’ah (MUTABAAH_MENU_ROUTE_MAP.md)

Dokumen ini merinci pemetaan utuh 8 Menu Modul Mutaba’ah yang telah terpisah penuh ke dalam **page components khusus**, rute eksplisit, query keys independen, `data-testid` unik, dan fungsionalitas bisnis tersendiri.

---

## 1. Pemetaan Terperinci per Submenu

```text
MENU: Dashboard Mutaba’ah
ROUTE: /dashboard/mutabaah
OLD PAGE COMPONENT: MutabaahPage.jsx (Generic Catch-All)
NEW PAGE COMPONENT: MutabaahDashboardPage.jsx (pages/mutabaah/MutabaahDashboardPage.jsx)
DATA TEST ID: mutabaah-dashboard-page
API: GET /api/mutabaah/analytics/dashboard
QUERY KEY: ['mutabaah', 'dashboard', filters]
PAGE HEADER: Dashboard Mutaba’ah Yaumiyyah
PRIMARY ACTION: Quick Actions (+ Tambah Agenda, + Susun Template, + Assign Template, + Assign Pembimbing, + Rekap)
TABLE/LIST: Trend Chart, Indicator Distribution, Today's Agendas, Unfilled Students Alert
FORM: - (Quick action navigation to dedicated module drawers)
PERMISSION: mutabaah.dashboard.view
MANUAL TEST: Klik /dashboard/mutabaah → Renders MutabaahDashboardPage → KPI & Charts tampil
AUTOMATED TEST: mutabaah_dashboard_route_renders_dashboard_page
STATUS: PAGE SEPARATION PASSED
```

```text
MENU: Rekap Mutaba’ah
ROUTE: /dashboard/mutabaah/rekap
OLD PAGE COMPONENT: MutabaahPage.jsx (Generic Catch-All)
NEW PAGE COMPONENT: MutabaahRecapPage.jsx (pages/mutabaah/MutabaahRecapPage.jsx)
DATA TEST ID: mutabaah-recap-page
API: GET /api/mutabaah/analytics/recap
QUERY KEY: ['mutabaah', 'recap', filters]
PAGE HEADER: Rekapitulasi Mutaba’ah Yaumiyyah
PRIMARY ACTION: Filter Periode & Unit, Export Excel/PDF
TABLE/LIST: Tabel Rekap Siswa (Baik, Kurang, Belum, %, Paraf Ortu Status)
FORM: Student Recap Detail Drawer
PERMISSION: mutabaah.recap.view, mutabaah.report.export
MANUAL TEST: Klik /dashboard/mutabaah/rekap → Renders MutabaahRecapPage → Tabel rekap & Export bekerja
AUTOMATED TEST: mutabaah_recap_route_renders_recap_page
STATUS: PAGE SEPARATION PASSED
```

```text
MENU: Target & Evaluasi
ROUTE: /dashboard/mutabaah/target-evaluasi
OLD PAGE COMPONENT: MutabaahPage.jsx (Generic Catch-All)
NEW PAGE COMPONENT: MutabaahTargetEvaluationPage.jsx (pages/mutabaah/MutabaahTargetEvaluationPage.jsx)
DATA TEST ID: mutabaah-target-page
API: GET /api/mutabaah/enterprise/templates, POST/PUT /api/mutabaah/enterprise/templates
QUERY KEY: ['mutabaah', 'targets', filters]
PAGE HEADER: Target & Evaluasi Mutaba’ah
PRIMARY ACTION: + Tambah Target Mutaba’ah
TABLE/LIST: Tabel Target & Evaluasi Capaian Siswa (Realisasi %, Badge: Tercapai / Perlu Bimbingan)
FORM: TargetModalForm (Name, Target %, Unit, Level, Status, Notes)
PERMISSION: mutabaah.targets.view, mutabaah.targets.create
MANUAL TEST: Klik /dashboard/mutabaah/target-evaluasi → Renders MutabaahTargetEvaluationPage → Form Target modal tampil & submit ke DB
AUTOMATED TEST: mutabaah_target_route_renders_target_page
STATUS: PAGE SEPARATION PASSED
```

```text
MENU: Rincian Agenda TU
ROUTE: /dashboard/mutabaah/rincian-agenda
OLD PAGE COMPONENT: MutabaahPage.jsx (Generic Catch-All)
NEW PAGE COMPONENT: MutabaahAgendaDetailPage.jsx (pages/mutabaah/MutabaahAgendaDetailPage.jsx)
DATA TEST ID: mutabaah-agenda-page
API: GET/POST/PUT/DELETE /api/mutabaah/enterprise/agendas
QUERY KEY: ['mutabaah', 'agendas', params]
PAGE HEADER: Rincian Agenda TU
PRIMARY ACTION: + Tambah Agenda
TABLE/LIST: Tabel Agenda Indikator (Kode, Nama, Kategori, Tipe Input, Bobot, Status)
FORM: CrudDrawer (Field Agenda)
PERMISSION: mutabaah.agenda.view, mutabaah.agenda.create, mutabaah.agenda.update
MANUAL TEST: Klik /dashboard/mutabaah/rincian-agenda → Renders MutabaahAgendaDetailPage → Drawer Agenda & CRUD aktif
AUTOMATED TEST: mutabaah_agenda_route_renders_agenda_page
STATUS: PAGE SEPARATION PASSED
```

```text
MENU: Template Agenda
ROUTE: /dashboard/mutabaah/template-agenda
OLD PAGE COMPONENT: MutabaahPage.jsx (Generic Catch-All)
NEW PAGE COMPONENT: MutabaahTemplatePage.jsx (pages/mutabaah/MutabaahTemplatePage.jsx)
DATA TEST ID: mutabaah-template-page
API: GET/POST/PUT/DELETE /api/mutabaah/enterprise/templates
QUERY KEY: ['mutabaah', 'templates', params]
PAGE HEADER: Template Agenda Mutaba’ah
PRIMARY ACTION: + Tambah Template
TABLE/LIST: Tabel Template Agenda (Kode, Nama, Unit, Jenjang, Semester, Status)
FORM: CrudDrawer & TemplateItemsDrawer (Penyusun Indikator Template)
PERMISSION: mutabaah.template.view, mutabaah.template.create, mutabaah.template.update
MANUAL TEST: Klik /dashboard/mutabaah/template-agenda → Renders MutabaahTemplatePage → Susun Agenda drawer aktif
AUTOMATED TEST: mutabaah_template_route_renders_template_page
STATUS: PAGE SEPARATION PASSED
```

```text
MENU: Assign Template
ROUTE: /dashboard/mutabaah/assign-template
OLD PAGE COMPONENT: MutabaahPage.jsx (Generic Catch-All)
NEW PAGE COMPONENT: MutabaahTemplateAssignmentPage.jsx (pages/mutabaah/MutabaahTemplateAssignmentPage.jsx)
DATA TEST ID: mutabaah-template-assignment-page
API: GET/POST/PUT/DELETE /api/mutabaah/enterprise/template-assignments
QUERY KEY: ['mutabaah', 'template-assignments', params]
PAGE HEADER: Assign Template Agenda
PRIMARY ACTION: + Assign Template
TABLE/LIST: Tabel Penugasan Template (Template, Unit, Scope Rombel/Siswa, Periode, Status)
FORM: CrudDrawer (Dependent Dropdown Unit → Jenjang → Kelas → Rombel → Siswa)
PERMISSION: mutabaah.template.view, mutabaah.template.assign
MANUAL TEST: Klik /dashboard/mutabaah/assign-template → Renders MutabaahTemplateAssignmentPage → Validation bentrok periode aktif
AUTOMATED TEST: mutabaah_template_assignment_route_renders_assignment_page
STATUS: PAGE SEPARATION PASSED
```

```text
MENU: Assign Pembimbing
ROUTE: /dashboard/mutabaah/assign-pembimbing
OLD PAGE COMPONENT: MutabaahPage.jsx (Generic Catch-All)
NEW PAGE COMPONENT: MutabaahSupervisorAssignmentPage.jsx (pages/mutabaah/MutabaahSupervisorAssignmentPage.jsx)
DATA TEST ID: mutabaah-supervisor-assignment-page
API: GET/POST/PUT/DELETE /api/mutabaah/enterprise/supervisor-assignments
QUERY KEY: ['mutabaah', 'supervisor-assignments', params]
PAGE HEADER: Assign Pembimbing Mutaba’ah
PRIMARY ACTION: + Assign Pembimbing
TABLE/LIST: Tabel Penugasan Pembimbing (Nama Pegawai, Jenis Pembimbing, Unit, Scope, Permissions, Status)
FORM: CrudDrawer (Permission Toggles & Validasi Unit Pesantren/Ma'had)
PERMISSION: mutabaah.supervisor.view, mutabaah.supervisor.create
MANUAL TEST: Klik /dashboard/mutabaah/assign-pembimbing → Renders MutabaahSupervisorAssignmentPage → Validasi Musyrif aktif
AUTOMATED TEST: mutabaah_supervisor_assignment_route_renders_supervisor_page
STATUS: PAGE SEPARATION PASSED
```

```text
MENU: Monitoring Orang Tua
ROUTE: /dashboard/mutabaah/monitoring-orang-tua
OLD PAGE COMPONENT: MutabaahPage.jsx (Generic Catch-All)
NEW PAGE COMPONENT: MutabaahParentMonitoringPage.jsx (pages/mutabaah/MutabaahParentMonitoringPage.jsx)
DATA TEST ID: mutabaah-parent-monitoring-page
API: GET /api/mutabaah/analytics/recap?signature_status=signed
QUERY KEY: ['mutabaah', 'parent-monitoring', filters]
PAGE HEADER: Monitoring Orang Tua
PRIMARY ACTION: Read-only Filter Status Paraf (Signed / Unsigned)
TABLE/LIST: Tabel Monitoring Paraf Ortu (Anak, Wali Murid, Badge Status Paraf, Timestamp Signed_at, Catatan)
FORM: Audit Detail Modal (Digital Signature Audit)
PERMISSION: mutabaah.parent.monitor
MANUAL TEST: Klik /dashboard/mutabaah/monitoring-orang-tua → Renders MutabaahParentMonitoringPage → Audit Modal & Filter Paraf Ortu aktif
AUTOMATED TEST: mutabaah_parent_monitoring_route_renders_parent_monitoring_page
STATUS: PAGE SEPARATION PASSED
```

---

## 2. Status Akhir Refaktor Halaman

```text
MUTABAAH PAGE SEPARATION PASSED
```
