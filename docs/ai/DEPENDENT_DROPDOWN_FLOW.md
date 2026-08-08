# DEPENDENT DROPDOWN FLOW MATRIX — SESI 13.5

Tanggal: 2026-08-07  
Project: Sistem Manajemen Sekolah Terpadu  
Scope: Specification and validation of cascade rules, state resets, query keys, and backend filters for all relational pickers.

---

## 1. CASCADE RELATIONSHIP CHAINS

Seluruh dependent dropdown mengikuti standar pengelolaan state teratur saat parent value berubah:

### 1.1 Chain Academic Administration
$$\text{Unit} \xrightarrow{\text{reset child \& query}} \text{Tahun Ajaran} \xrightarrow{\text{reset child \& query}} \text{Semester} \xrightarrow{\text{reset child \& query}} \text{Kelas} \xrightarrow{\text{reset child \& query}} \text{Rombel} \xrightarrow{\text{reset child \& query}} \text{Siswa}$$

### 1.2 Chain Curriculum & LMS
$$\text{Kurikulum} \xrightarrow{\text{reset child \& query}} \text{Mata Pelajaran} \xrightarrow{\text{reset child \& query}} \text{Capaian Pembelajaran (CP)} \xrightarrow{\text{reset child \& query}} \text{Tujuan Pembelajaran (TP)}$$

### 1.3 Chain Teaching & Schedule
$$\text{Guru} \xrightarrow{\text{reset child \& query}} \text{Penugasan Mengajar} \xrightarrow{\text{reset child \& query}} \text{Jadwal Pelajaran}$$

### 1.4 Chain Mutaba'ah Enterprise
$$\text{Template Mutaba’ah} \xrightarrow{\text{reset child \& query}} \text{Indikator} \xrightarrow{\text{reset child \& query}} \text{Assignment} \xrightarrow{\text{reset child \& query}} \text{Pembimbing / Mentor}$$

### 1.5 Chain Tahfizh Halaqah
$$\text{Halaqah} \xrightarrow{\text{reset child \& query}} \text{Guru Tahfizh} \xrightarrow{\text{reset child \& query}} \text{Siswa Binaan}$$

---

## 2. STATE TRANSITION RULES ON PARENT CHANGE

Saat nilai parent dropdown berubah:
1. **Child Options State Reset**: Seluruh opsi turunan di-reset menjadi array kosong `[]`.
2. **Value Clear**: Nilai terpilih pada child input dihapus (`null` / `''`).
3. **Query Key Reactivity**: React Query key turunan otomatis ter-update dengan parameter parent ID baru.
4. **Loading State**: UI menampilkan spinner/skeleton loading pada child dropdown selama proses fetch backend.
5. **Backend Filter Enforced**: Request API menyertakan query parameter `unit_id`, `academic_year_id`, `class_id`, `cp_id`, dll.
