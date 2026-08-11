# Read docs/ai/README.md and INDEX.md first.

# PROMPT REFACTOR UI/UX MODUL SIMSIT — MODERN SOFT ENTERPRISE

Gunakan prompt ini untuk menyelaraskan UI/UX modul lain dengan tampilan **Master Unit Pendidikan** yang sudah disetujui.

Ganti seluruh teks dalam tanda `[ ... ]` sesuai modul yang akan dikerjakan.

---

## PERAN

Anda adalah Senior Product Designer dan Senior Frontend Engineer untuk aplikasi SIMSIT.

Tugas Anda adalah melakukan refactor UI/UX modul:

**Nama modul:** `[NAMA MODUL]`  
**URL modul:** `[URL MODUL]`  
**File utama:** `[FILE HALAMAN JIKA DIKETAHUI]`

Gunakan halaman **Master Unit Pendidikan** sebagai master reference untuk:

- posisi dan hierarchy konten;
- ukuran card dan typography;
- hero banner;
- KPI;
- toolbar;
- filter;
- tabel;
- sidebar ringkasan;
- quick actions;
- popup tambah, edit, detail, import, export, statistik, dan hapus;
- notifikasi sistem;
- responsive tablet dan mobile;
- light mode dan dark mode.

Jangan menyalin data Unit Pendidikan ke modul lain. Sesuaikan label, ikon, statistik, field, kolom, filter, dan aksi berdasarkan domain modul target.

---

## WAJIB MEMBACA

Sebelum mengubah kode, baca canonical docs berikut:

- `docs/ai/README.md`
- `docs/ai/INDEX.md`
- `docs/ai/04_UI_UX/UI_RULEBOOK.md`
- `docs/ai/04_UI_UX/DESIGN_SYSTEM.md`
- `docs/ai/04_UI_UX/COMPONENT_STANDARD.md`
- `docs/ai/04_UI_UX/LAYOUT_STANDARD.md`
- `docs/ai/04_UI_UX/RESPONSIVE_STANDARD.md`
- `docs/ai/04_UI_UX/MODAL_DRAWER_STANDARD.md`
- `docs/ai/04_UI_UX/NOTIFICATION_STANDARD.md`
- dokumen modul terkait di `docs/ai/05_MODULE/`

Gunakan template UI aktif. Jika belum ada template yang dipilih, gunakan **Modern Soft**.

---

## BATASAN KERJA

Hanya boleh mengubah:

- UI;
- UX;
- layout;
- komponen presentasi;
- styling;
- responsive behavior;
- animation dan micro-interaction;
- loading, empty, dan error state;
- tampilan popup dan notifikasi.

Jangan mengubah:

- business logic;
- API dan bentuk payload;
- route atau URL;
- controller;
- service;
- repository;
- model dan relasi;
- migration dan database;
- permission atau policy;
- struktur menu utama;
- proses autentikasi;
- kontrak data yang sudah dipakai modul.

Semua tombol yang ditampilkan harus terhubung dengan handler yang tersedia. Jangan membuat tombol dekoratif yang tidak berfungsi.

Jika suatu aksi belum memiliki backend, jangan membuat data palsu seolah-olah berasal dari production API. Tampilkan pesan yang jujur atau pertahankan perilaku existing.

---

## AUDIT SEBELUM IMPLEMENTASI

Sebelum menulis kode:

1. Audit halaman dan komponen modul target.
2. Identifikasi service, query, mutation, handler, filter, pagination, dan state yang sudah berjalan.
3. Cari reusable component SIMSIT yang tersedia.
4. Cari pola UI pada halaman Master Unit Pendidikan.
5. Identifikasi field dan kolom yang benar-benar berasal dari API.
6. Catat tombol atau popup yang belum berfungsi.
7. Pastikan perubahan tidak mengganggu modul lain.

Jangan membuat komponen baru jika fungsi yang sama sudah tersedia.

---

## STRUKTUR HALAMAN DESKTOP

Gunakan urutan berikut:

1. Hero banner.
2. KPI cards.
3. Main workspace:
   - konten utama di sebelah kiri;
   - sidebar ringkasan di sebelah kanan.
4. Toolbar dua tingkat.
5. Data table atau content list.
6. Pagination.
7. Popup dan notification layer.

Gunakan spacing yang konsisten dan nyaman. Hindari card, teks, ikon, atau tombol yang terlalu besar.

Ukuran visual disarankan:

- radius card: `14px–18px`;
- tombol utama: tinggi `40px–44px`;
- tombol ikon: `36px–40px`;
- input dan select: tinggi `42px–48px`;
- body text: `12px–14px`;
- table text: `11px–12px`;
- heading card: `14px–16px`;
- page title: `24px–28px`;
- ikon umum: `16px`;
- ikon KPI: `20px–24px`.

---

## HERO BANNER

Hero wajib memiliki:

- background gradient hijau SIMSIT;
- judul modul;
- deskripsi singkat maksimal dua baris;
- ilustrasi yang relevan dengan domain modul;
- satu primary action utama di sisi kanan;
- dekorasi lembut tanpa mengganggu keterbacaan.

Contoh:

- Unit Pendidikan: ilustrasi gedung sekolah;
- Pegawai: ilustrasi tim atau tenaga pendidik;
- Siswa: ilustrasi siswa;
- Tahun Ajaran: ilustrasi kalender;
- Mata Pelajaran: ilustrasi buku;
- Jabatan: ilustrasi struktur organisasi.

Gunakan aset existing jika relevan. Jika tidak tersedia, gunakan komposisi CSS dan Lucide Icon. Jangan memakai ilustrasi yang tidak berkaitan.

Hero harus tetap terbaca pada dark mode, tablet, dan mobile.

---

## KPI CARDS

Tampilkan `3–5` KPI yang paling relevan dengan modul.

Setiap KPI berisi:

- ikon dalam icon container;
- label uppercase kecil;
- nilai utama;
- deskripsi atau perbandingan singkat;
- semantic color yang konsisten.

KPI harus mengambil data existing dari API atau state halaman. Jangan hardcode angka production.

### Kesetaraan Visual KPI dengan Master Unit Pendidikan

KPI modul target wajib memakai komponen, class pemicu tema, dan susunan visual yang sama dengan KPI pada halaman **Master Unit Pendidikan**. Kesamaan tidak cukup hanya dengan menggunakan komponen `MasterStatCard`; seluruh styling kontekstual yang mengaktifkan tampilan kartu referensi juga wajib diterapkan.

Pada implementasi web dashboard saat ini:

- gunakan `MasterStatsGrid` dan `MasterStatCard`;
- berikan `className="education-unit-kpis"` pada `MasterStatsGrid`, atau gunakan class global pengganti yang telah terbukti menghasilkan tampilan identik;
- pertahankan struktur anak `MasterStatCard` agar selector visual kartu tetap bekerja;
- samakan tinggi minimum, padding, radius, border, shadow, gradient, dekorasi, ukuran icon container, typography label, nilai, deskripsi, hover state, dan dark mode dengan Master Unit Pendidikan;
- hanya label, nilai, deskripsi, ikon, dan semantic variant yang boleh disesuaikan dengan domain modul target;
- jangan membuat versi KPI lokal yang tampil seperti kartu putih polos ketika halaman referensi memakai gradient atau dekorasi;
- verifikasi kesetaraan visual pada light mode dan dark mode serta breakpoint mobile, tablet, dan desktop.

Contoh:

```jsx
<MasterStatsGrid className="education-unit-kpis">
  <MasterStatCard
    icon={DomainIcon}
    label="[LABEL KPI]"
    value={nilaiDariApi}
    description="[DESKRIPSI KPI]"
    variant="success"
  />
</MasterStatsGrid>
```

Sebelum dinyatakan selesai, bandingkan hasil render KPI modul target berdampingan dengan Master Unit Pendidikan. Pastikan kartu tidak hanya memiliki isi yang benar, tetapi juga benar-benar identik dalam bentuk dan hierarchy visual.

---

## TOOLBAR DUA TINGKAT

### Baris pertama

- search input di sisi kiri;
- Import;
- Export;
- primary action Tambah di sisi kanan.

### Baris kedua

- tombol atau label Filter;
- seluruh filter domain modul;
- tombol reset atau refresh.

Ketentuan:

- search dan filter tetap memakai server-side behavior existing;
- debounce dipertahankan jika sudah ada;
- ukuran semua control konsisten;
- toolbar dapat horizontal scroll pada layar sempit;
- desktop actions disembunyikan jika sudah digantikan mobile action menu.

---

## DATA TABLE

Tabel harus mengikuti SIMSIT enterprise table:

- card header berisi judul, deskripsi, dan total data;
- header tabel uppercase kecil;
- row height medium;
- hover state lembut;
- seluruh kolom utama harus terlihat pada satu layar desktop tanpa horizontal scroll;
- gunakan `table-layout: fixed` atau pendekatan layout stabil yang setara;
- jangan memberi `min-width` tabel yang memaksa pengguna menggeser secara horizontal;
- gabungkan data yang saling berkaitan ke dalam satu kolom dengan hierarchy yang jelas;
- contoh penggabungan:
  - logo, nama, kode, dan jenis menjadi kolom **Identitas**;
  - nama pimpinan, avatar, dan nomor induk menjadi kolom **Pimpinan**;
  - jumlah siswa, guru, kelas, dan rombel menjadi kolom **Statistik**;
  - warna badge dan icon menjadi kolom **Visual**;
  - keterangan dan metadata tanggal dapat menjadi informasi sekunder di bawah nama;
- tentukan prioritas kolom untuk desktop, tablet, dan mobile;
- informasi sekunder boleh disembunyikan pada layar kecil jika sudah tersedia pada popup detail;
- informasi penting dari kolom yang disembunyikan harus dipindahkan ke kolom Identitas pada mobile;
- data utama memakai hierarchy yang jelas;
- badge untuk tipe dan status;
- avatar atau logo menggunakan data aktual;
- jika gambar tidak tersedia, gunakan initial/avatar fallback;
- aksi menggunakan icon button ber-tooltip dan konsisten di seluruh modul;
- loading memakai skeleton rows;
- empty state memiliki penjelasan dan CTA;
- error state memiliki retry;
- pagination berada di footer card;
- horizontal scroll hanya boleh menjadi fallback terakhir untuk tabel yang secara domain tidak dapat diringkas, seperti spreadsheet transaksi dengan puluhan kolom dinamis.

Kolom harus disesuaikan dengan modul target:

`[TULISKAN DAFTAR KOLOM MODUL]`

Jangan menampilkan kolom yang tidak memiliki data atau tidak relevan.

### Standar Tombol Aksi Tabel

Semua modul wajib menggunakan pola tombol aksi yang sama:

- ukuran tombol desktop: `36 × 36px`;
- icon: `16px`;
- gunakan Lucide Icons dengan `strokeWidth={2.5}` agar ikon terlihat tebal dan jelas;
- radius: `8px–10px`;
- jarak antar-tombol: `4px`;
- warna default tombol harus langsung menunjukkan fungsi, tidak hanya muncul saat hover;
- Lihat:
  - border biru muda;
  - background biru muda;
  - icon biru;
  - hover biru yang sedikit lebih kuat;
- Edit:
  - border amber muda;
  - background amber muda;
  - icon amber;
  - hover amber yang sedikit lebih kuat;
- Hapus:
  - border merah muda;
  - background merah muda;
  - icon merah;
  - hover merah yang sedikit lebih kuat;
- Restore:
  - border hijau muda;
  - background hijau muda;
  - icon hijau;
  - hover hijau yang sedikit lebih kuat;
- setiap tombol wajib memiliki tooltip, `title`, dan `aria-label`;
- gunakan focus ring sesuai semantic color;
- jangan mencampur ukuran, radius, atau gaya tombol aksi antar-modul.
- dark mode wajib memakai semantic background, border, dan warna icon dengan kontras yang tetap nyaman;
- ketebalan dan ukuran ikon Lihat, Edit, Hapus, dan Restore harus identik.

Pada mobile:

- tampilkan tombol **Lihat** di tabel;
- tombol Edit, Hapus, Import, Export, dan aksi tambahan tersedia melalui floating action button atau bottom sheet;
- Restore tetap dapat ditampilkan jika diperlukan agar data terhapus dapat dipulihkan;
- jangan membiarkan kelompok tombol aksi menyebabkan tabel melebar atau horizontal scroll.

---

## SIDEBAR

Desktop menggunakan sidebar kanan berisi:

### Ringkasan

- statistik modul dalam daftar vertikal;
- icon container kecil;
- label;
- nilai rata kanan;
- data mengikuti filter aktif.

### Aksi Cepat

- Tambah;
- Import;
- Export Excel;
- Export PDF;
- Lihat Statistik;
- aksi domain lain jika benar-benar tersedia.

Semua quick action wajib berfungsi dan membuka popup atau menjalankan handler yang sesuai.

Pada tablet/mobile, sidebar dipindahkan ke bawah konten atau diakses melalui action sheet.

---

## POPUP TAMBAH DAN EDIT

Tambah dan edit wajib menggunakan centered modal popup.

Struktur:

1. Header:
   - judul;
   - tombol tutup.
2. Stepper horizontal jika field banyak:
   - Informasi;
   - Lokasi/Detail;
   - Relasi/Penanggung Jawab;
   - Konfirmasi.
3. Body:
   - form dua kolom pada desktop;
   - satu kolom pada mobile;
   - label jelas;
   - required marker;
   - helper text;
   - inline validation;
   - upload area jika dibutuhkan.
4. Sticky footer:
   - Batal;
   - Simpan Draft jika didukung;
   - Selanjutnya;
   - Simpan atau Simpan Perubahan.

Jangan mengubah field, validasi, payload, atau proses submit existing.

---

## POPUP DETAIL

Detail wajib menggunakan centered modal popup, bukan pindah halaman jika flow existing menggunakan modal.

Struktur:

- header judul dan tombol tutup;
- tombol Edit dan Export jika user berwenang;
- hero/profile summary;
- logo atau avatar;
- nama dan status;
- metadata utama;
- tab horizontal:
  - Informasi;
  - Statistik;
  - Relasi;
  - Dokumen;
  - Riwayat;
- statistik singkat;
- empty state jika tab belum memiliki data.

Tab harus horizontal scroll pada mobile.

---

## POPUP IMPORT

Popup import wajib memiliki:

1. Header dan deskripsi.
2. Tombol Unduh Template.
3. Drag-and-drop upload area.
4. Informasi format dan batas ukuran file.
5. Validasi file.
6. Preview baris sebelum import.
7. Status valid atau error per baris.
8. Tombol Proses Import.
9. Loading state saat proses.
10. Setelah berhasil:
    - popup tidak langsung ditutup;
    - tampilkan jumlah data berhasil;
    - tampilkan tabel data yang berhasil diimpor;
    - tampilkan data gagal beserta alasannya jika ada;
    - tombol berubah menjadi Import Selesai;
    - tampilkan notifikasi sukses.

Data hasil import harus berasal dari respons atau proses existing. Jangan mengarang hasil import.

---

## POPUP EXPORT

Popup export wajib memiliki:

- pilihan format Excel, CSV, dan PDF sesuai kemampuan modul;
- selected state yang jelas;
- opsi semua data atau data sesuai filter;
- opsi menyertakan statistik jika tersedia;
- tombol Batal;
- tombol Export;
- loading state;
- notifikasi ketika file berhasil disiapkan;
- error message Bahasa Indonesia jika gagal.

Jangan menampilkan pilihan format yang tidak didukung oleh handler/backend.

---

## POPUP HAPUS

Gunakan confirmation modal:

- icon warning;
- nama data yang akan dihapus;
- penjelasan dampak;
- checkbox konfirmasi hanya jika risikonya tinggi;
- tombol Batal;
- tombol Hapus dengan semantic danger;
- loading state;
- notifikasi berhasil atau gagal.

Jangan mengubah soft-delete atau force-delete behavior existing.

---

## POPUP STATISTIK

Tombol Lihat Statistik harus membuka popup yang benar-benar berfungsi.

Isi minimal:

- KPI utama;
- distribusi kategori atau jenis;
- progress bar atau chart sederhana;
- data mengikuti filter aktif;
- loading, empty, dan error state.

Jangan membuat tombol yang hanya scroll ke tabel tanpa feedback yang jelas.

---

## NOTIFIKASI SISTEM

Gunakan notification toast di kanan bawah desktop dan area aman mobile.

Notifikasi minimal:

- berhasil disimpan;
- berhasil diubah;
- berhasil dihapus;
- import berhasil dan jumlah barisnya;
- export berhasil dan formatnya;
- error API;
- validation warning.

Toast berisi:

- semantic icon;
- judul;
- pesan singkat Bahasa Indonesia;
- tombol tutup;
- auto-dismiss sekitar `5–6` detik;
- animation masuk dan keluar;
- `aria-live="polite"`.

Jangan menampilkan data sensitif di notifikasi.

---

## TABLET DAN MOBILE

Pada lebar di bawah desktop:

- hero lebih ringkas;
- dekorasi hero tidak menutupi teks;
- KPI menjadi dua kolom atau satu kolom;
- sidebar pindah ke bawah;
- toolbar dapat horizontal scroll;
- tabel harus tetap muat tanpa horizontal scroll untuk tabel CRUD biasa;
- gabungkan informasi terkait ke kolom Identitas;
- sembunyikan kolom sekunder berdasarkan breakpoint;
- tampilkan kembali informasi tersembunyi di popup Detail;
- horizontal scroll hanya digunakan untuk spreadsheet atau tabel dinamis yang memang tidak dapat diringkas;
- desktop header actions disembunyikan;
- tampilkan floating middle-bottom action button;
- action button membuka bottom sheet.

Bottom sheet minimal berisi:

- Tambah;
- Lihat;
- Edit;
- Export;
- Import.

Pastikan:

- target sentuh minimal `44px`;
- popup tetap centered jika desain modul menetapkan popup;
- modal memiliki `max-height`;
- body modal dapat scroll;
- footer action tetap terlihat;
- tidak ada teks atau tombol terpotong.

---

## DARK MODE

Light dan dark mode harus identik secara layout.

Dark mode wajib memiliki:

- background surface yang cukup kontras;
- border terlihat;
- teks terbaca;
- badge dan semantic color tetap jelas;
- input, select, tabel, modal, dan toast tidak memiliki area putih yang salah;
- hero tetap mempertahankan identitas hijau SIMSIT.

---

## ACCESSIBILITY

Wajib:

- semantic HTML;
- label untuk semua input;
- `aria-label` untuk icon button;
- `role="dialog"` dan `aria-modal="true"` pada popup;
- `aria-live` pada notifikasi;
- focus state yang terlihat;
- keyboard accessible;
- Escape menutup modal jika pola existing mendukung;
- kontras warna sesuai aturan;
- jangan mengandalkan warna saja untuk status.

---

## ANIMATION

Gunakan motion lembut:

- page/card enter;
- modal fade dan scale;
- backdrop fade;
- toast slide-in;
- row hover;
- button press;
- spinner untuk proses async.

Durasi disarankan `150–250ms`.

Hormati `prefers-reduced-motion`.

Hindari animasi berlebihan.

---

## VERIFIKASI WAJIB

Setelah implementasi:

1. Jalankan lint.
2. Jalankan type-check jika tersedia.
3. Jalankan production build.
4. Jalankan test frontend terkait jika tersedia.
5. Jalankan `git diff --check`.
6. Pastikan seluruh tombol berfungsi.
7. Pastikan popup tambah, edit, detail, import, export, statistik, dan hapus dapat dibuka dan ditutup.
8. Pastikan import menampilkan data berhasil.
9. Pastikan notifikasi muncul.
10. Pastikan responsive tablet/mobile.
11. Pastikan dark mode.
12. Pastikan API, route, permission, dan business logic tidak berubah.

Jangan menjalankan perintah destruktif.

---

## OUTPUT AKHIR

Laporkan:

- ringkasan perubahan;
- daftar file diubah;
- reusable component yang digunakan;
- component baru jika benar-benar diperlukan;
- popup yang diperbarui;
- notifikasi yang ditambahkan;
- hasil lint;
- hasil type-check;
- hasil build;
- masalah yang belum selesai;
- screenshot desktop, tablet, dan mobile jika browser tersedia.

---

## INSTRUKSI EKSEKUSI

Kerjakan perubahan langsung pada proyek.

Jangan berhenti setelah memberi rekomendasi atau mockup. Implementasikan UI/UX sampai build berhasil, selama tetap berada dalam batasan perubahan UI yang ditentukan di atas.
