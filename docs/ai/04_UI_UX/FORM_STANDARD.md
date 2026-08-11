# FORM STANDARD

Standar form & validasi. Bukti historis: `99_ARCHIVE/UI_FORM_STANDARD.md`.

## Form Control Specifications

| Elemen | Styling | Validasi |
|---|---|---|
| Text / Email Input | `h-12 rounded-[14px] border border-slate-200 bg-white text-xs font-semibold` | Red border + `text-rose-600` error message |
| Select / Dropdown | `h-12 rounded-[14px] border ...` | Disabled saat parent value kosong |
| Date Picker | Native HTML5 / custom dengan ikon kalender | Format `YYYY-MM-DD` |
| Form Section Title | `text-sm font-extrabold uppercase text-slate-800 tracking-wider border-b pb-2` | Kelompok fieldset logis |
| Action Buttons | Primary Submit (`#0E5C44`), Cancel (Ghost/Outline) | Spinner saat submit |

## Form Step Wizard Directive

Form > 10 field (mis. Master Siswa, Master Pegawai) diorganisir ke tabs/sections logis (`Identitas`, `Akademik`, `Kontak`, `Dokumen`) agar tidak scroll vertikal tanpa akhir.

## Aturan

- Floating label, focus ring hijau, smooth validation (lihat DESIGN_SYSTEM).
- Dependent dropdown: disable sampai parent terisi; resolusi via options API backend (lihat `06_API/API_CONTRACT.md`).
- Validasi data via backend (Form Request) sebagai otoritas; validasi frontend hanya UX.
- Form memakai popup modal/drawer, bukan navigasi halaman terpisah (lihat MODAL_DRAWER_STANDARD).

## Referensi

- Tokens: `04_UI_UX/DESIGN_SYSTEM.md`
- Popup: `04_UI_UX/MODAL_DRAWER_STANDARD.md`
- Detail: `99_ARCHIVE/UI_FORM_STANDARD.md`
