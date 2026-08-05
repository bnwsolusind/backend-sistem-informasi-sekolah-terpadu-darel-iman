# Matriks Konsistensi Komponen UI/UX Modul Mutaba’ah (UI_COMPONENT_CONSISTENCY_MATRIX.md)

Dokumen ini mencatat matriks penggunaan komponen UI/UX pada 8 Halaman Modul Mutaba’ah untuk menjamin konsistensi visual dan fungsional.

---

| Komponen UI | Dashboard | Rekap | Target & Evaluasi | Agenda TU | Template Agenda | Assign Template | Assign Pembimbing | Monitoring Ortu |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **MutabaahSubNav** |  |  |  |  |  |  |  |  |
| **MutabaahPageHeader** |  |  |  |  |  |  |  |  |
| **KPI Grid Cards** |  |  |  |  |  |  |  |  |
| **Primary Action Button** | Quick Actions | Export | + Target | + Agenda | + Template | + Assign | + Assign | Filter |
| **Filter Bar / Chips** | Ringkas | 2-Tingkat | Status | Kategori | Search | Scope | Pembimbing | Status Paraf |
| **Data View Mode** | Cards/Charts | Table | Table/Cards | List/Calendar | Cards/Table | Table | 2-Panel | Table |
| **Form / Drawer Modal** | - | Detail | Target Form | Agenda Form | Template/Items | Assign Form | Supervisor Form | Audit Modal |
| **Access Control Scope** | Read | Read/Export | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Read Audit |

---

## Prinsip Konsistensi Komponen
1. **Warna Dominan**: Emerald Green (`#0E5C44`) untuk tombol utama, active navigation tab, dan status `Aktif/Tercapai`.
2. **Standard Radii**: `18px` untuk container card, `10px` untuk input & button.
3. **Sub-Navigasi Kontekstual**: `MutabaahSubNav` tampil di setiap halaman Mutaba'ah di bawah header utama untuk perpindahan navigasi instan.
4. **Empty State & Error State**: Menggunakan komponen pesan khusus dengan tombol aksi pemulihan (*retry*) atau petunjuk penambahan data pertama.
