# Aturan Desain Responsif & Layar Seluler Modul Mutaba’ah (MUTABAAH_RESPONSIVE_RULES.md)

Dokumen ini merinci aturan tata letak responsif pada berbagai breakpoint perangkat (Desktop, Laptop, Tablet, Mobile) untuk menjamin kenyamanan tampilan dan mencegah horizontal page overflow.

---

## 1. Breakpoint Standard
- **Desktop Extra Large (≥ 1440px)**: Grid 4-kolom KPI, 2-panel supervisor layout, table view penuh dengan 10+ kolom.
- **Desktop Large (1024px – 1439px)**: Grid 3-kolom KPI, 2-panel supervisor layout, table view scrollable.
- **Tablet (768px – 1023px)**: Grid 2-kolom KPI, drawer width 420px, scrollable horizontal sub-nav tabs.
- **Mobile (360px – 767px)**: Grid 2-kolom KPI, full-width cards, stacked table cards, fullscreen drawer sheet, bottom action bar.

---

## 2. Aturan Khusus Komponen pada Mobile

1. **Sub-Navigasi Kontekstual**: Menyediakan fitur touch-swipe horizontal scroll tanpa scrollbar fisik (`scrollbar-width: none`).
2. **KPI Grid**: Menggunakan grid 2-kolom ringkas agar angka utama dan label tetap terbaca jelas tanpa overflow.
3. **Data Tables**: Pada layar <640px, tabel dengan kolom lebih dari 5 diubah menjadi *Stacked Entity Cards* dengan tombol *Accordion Detail*.
4. **Form Drawers & Wizards**: Pada layar seluler, drawer secara otomatis menjadi *Fullscreen Bottom Sheet* dengan sticky header dan sticky action footer (`Tutup` dan `Simpan`).
5. **No Horizontal Page Overflow**: Seluruh container menggunakan `max-width: 100%` dan `box-sizing: border-box` untuk memastikan tidak ada penggeseran layar ke samping.
