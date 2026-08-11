# CRUD Popup Matrix - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: 100% Popup Compliant (No Full-Page Redirections for Standard CRUD)

---

## 1. Overview & Principle

In accordance with Enterprise UX Principle #3:
> "Seluruh CRUD menjadi Popup: Tambah (Modal XL), Edit (Modal XL), Detail (Drawer / Modal), Approval (Popup), Assign (Popup), Import (Wizard Popup), Export (Popup), Delete (Confirmation Dialog). Tidak boleh lagi berpindah halaman untuk CRUD biasa."

All data entry, modification, detailed inspection, and administrative approvals occur in zero-reload modal overlays.

---

## 2. Popup Standard Matrix by CRUD Action

| Action Type | UX Overlay Type | Container Width / Specification | Header Behavior | Footer Behavior | Example Module Implementation |
|---|---|---|---|---|---|
| **Tambah Data** | Modal XL | `max-w-4xl` (1000px Desktop) | Sticky Header with Close (X) | Sticky Save & Cancel Buttons | `StudentFormModal`, `EducationUnitsPage` |
| **Edit Data** | Modal XL | `max-w-4xl` (1000px Desktop) | Sticky Header with Record ID | Sticky Save Changes & Cancel | `StudentFormModal`, `EmployeesPage` |
| **Detail Data** | Drawer / Modal | `max-w-3xl` or Right Drawer (`480px`) | Sticky Header with Quick Action | Close / Print Trigger | `KpiDetailDrawer`, `FoundationUnitDetailPage` |
| **Approval** | Popup Modal | `max-w-lg` (560px Desktop) | Warning / Shield Icon Header | Approve (Primary) & Reject (Danger) | `DeleteApprovalPage`, `AttendanceWorkspacePage` |
| **Assign Data** | Popup Modal | `max-w-2xl` (720px Desktop) | Dependent Dropdown Header | Assign / Save Mapping | `MutabaahTemplateAssignmentPage` |
| **Import Wizard** | Wizard Popup | `max-w-3xl` (3-Step Stepper) | File Upload & Mapping Step | Template Download & Execute | `EducationUnitsPage`, `StudentsPage` |
| **Export Data** | Popup Modal | `max-w-md` (480px Desktop) | Format Selection (XLSX, PDF) | Download File Trigger | `LaporanAbsensiPage`, `LaporanSiswaPage` |
| **Delete Data** | Confirmation Dialog | SweetAlert2 / Custom Dialog | Warning Icon Header | Destructive Delete & Cancel | `DeleteRequestModal`, `DataTableCard` |

---

## 3. Verified Module Audit List

- [x] **Master Unit Pendidikan**: Add, Edit, Import (Wizard), Export (Popup), Delete (Dialog) all operating via popups.
- [x] **Master Pegawai & Guru**: Add, Edit, Detail Drawer, Export (Popup), Delete (Dialog) operating via popups.
- [x] **Master Data Siswa**: Add, Edit, Detail Drawer, Import Wizard, Export (Popup) operating via popups.
- [x] **Master Kelas & Rombel**: Add, Edit, Student Mapping (Assign Popup) operating via popups.
- [x] **Akademik CP & TP**: Add CP/TP, Edit CP/TP, Delete CP/TP operating via popups.
- [x] **Mutabaah & Agenda**: Add Agenda, Template Assignment, Supervisor Mapping operating via popups.
- [x] **Hak Akses & Role**: Permission Matrix Modal, Role Assignment Popup operating via popups.
