# Notification Standard Specification - Sistem Manajemen Sekolah Terpadu

**Session Target**: Session 15.9 Final UI/UX Audit & Standardization  
**Framework**: Laravel 12 + React 19 + Vite + TailwindCSS + PostgreSQL 17  
**Status**: Standardized Feedback System Enforced

---

## 1. Specification & Flow

In accordance with Enterprise UX Principle #17:
> "Seluruh aksi (Tambah, Edit, Delete, Import, Export, Approval, Finalisasi) harus memiliki: Confirmation Dialog, Loading, Success Toast, Error Toast, Notification Bell, Activity Timeline."

---

## 2. Feedback Channel Matrix

| User Action | 1. Confirmation Dialog | 2. Loading State | 3. Success Toast | 4. Error Toast | 5. Notification Bell | 6. Activity Timeline |
|---|---|---|---|---|---|---|
| **Tambah Data** | Optional | Spinner / Loading Button | SweetAlert Toast | SweetAlert Toast | System Event | Timeline Log |
| **Edit Data** | Optional | Spinner / Loading Button | SweetAlert Toast | SweetAlert Toast | System Event | Timeline Log |
| **Delete Data** | Mandatory Dialog | Destructive Spinner | SweetAlert Toast | SweetAlert Toast | Alert Bell | Timeline Log |
| **Import Wizard** | File Review Dialog | Progress Bar | Success Summary Toast | Error List Toast | Import Event | Timeline Log |
| **Export Data** | Options Modal | File Generating Spinner | File Download Trigger | Download Failed Toast | - | Audit Log |
| **Approval** | Mandatory Dialog | Processing Overlay | Approved Toast | Rejected Toast | Approval Bell | Timeline Log |
| **Finalisasi** | Mandatory Warning | Finalizing Overlay | Finalized Toast | Processing Toast | Broadcast Bell | Timeline Log |

---

## 3. UI Controls

- **Notification Bell**: Integrated in Topbar (`DashboardLayout.jsx`) with unread badge count, real-time fetching from `reportService.notifications()`, and "Tandai Semua Dibaca" trigger.
- **Toast Notifications**: SweetAlert2 toast instances configured with auto-dismiss (3000ms), top-end placement, and custom primary green highlight icons.
