# FORM CONTROL & VALIDATION STANDARD — SESI 15

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Standardization of form inputs, labels, helper texts, validation messages, select pickers, and multi-step forms.

---

## 1. FORM CONTROL SPECIFICATIONS

| FORM ELEMENT | DESIGN SYSTEM STYLING | VALIDATION STATE |
|---|---|---|
| Text / Email Input | `h-12 rounded-[14px] border border-slate-200 bg-white text-xs font-semibold` | Red border + text-rose-600 error message |
| Select / Dropdown | `h-12 rounded-[14px] border border-slate-200 bg-white text-xs font-semibold` | Disables when parent value empty |
| Date Picker | Native HTML5 Date / Custom Picker with calendar icon | Validates date format YYYY-MM-DD |
| Form Section Title | `text-sm font-extrabold uppercase text-slate-800 tracking-wider border-b pb-2` | Grouped into logical fieldsets |
| Action Buttons | Primary Submit (`#0E5C44`), Cancel (`Ghost/Outline`) | Displays spinner on form submission |

---

## 2. FORM STEP WIZARD DIRECTIVE

Forms exceeding 10 fields (e.g. Master Siswa, Master Pegawai) organize fields into logical tabs/sections (`Identitas`, `Akademik`, `Kontak`, `Dokumen`) to avoid endless vertical scroll.
