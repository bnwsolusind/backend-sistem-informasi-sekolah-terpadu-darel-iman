# Standar Layout & Styling Halaman Laporan (Report Page Style Guide)

Dokumen ini merupakan panduan standar desain visual (*gold standard*) untuk seluruh halaman rekap & laporan pada aplikasi **Sistem Manajemen Sekolah Terpadu**. Seluruh halaman laporan wajib mengadopsi struktur visual 3-column grid, animasi Framer Motion yang halus, dan komponen UI terpadu.

---

## 1. Halaman Benchmark Referensi Utama
1. **Rekap Absensi Gerbang**: [RekapAbsensiGerbangPage.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/web-dashboard/src/pages/RekapAbsensiGerbangPage.jsx) (`http://localhost:5173/dashboard/rekap-absensi-gerbang`)
2. **Rekap Absensi Ibadah**: [RekapAbsensiIbadahPage.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/web-dashboard/src/pages/RekapAbsensiIbadahPage.jsx) (`http://localhost:5173/dashboard/rekap-absensi-ibadah`)
3. **Laporan Absensi**: [LaporanAbsensiPage.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/web-dashboard/src/pages/LaporanAbsensiPage.jsx) (`http://localhost:5173/dashboard/laporan-absensi`)
4. **Laporan Siswa**: [LaporanSiswaPage.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/web-dashboard/src/pages/LaporanSiswaPage.jsx) (`http://localhost:5173/dashboard/laporan-siswa`)
5. **Laporan Absensi Siswa**: [AttendanceReportPage.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/web-dashboard/src/pages/attendance/AttendanceReportPage.jsx) (`http://localhost:5173/absensi/laporan`)

---

## 2. Struktur Hierarki Halaman Laporan

Setiap halaman laporan disusun dengan tata letak vertikal yang konsisten dan animasi *staggered entrance*:

```
[ PageContainer & AppBreadcrumb (Wrapped in motion.div) ]
            │
            ▼
[ PrintOptionModal & Detail Dialog Modal (AnimatePresence & Backdrop) ]
            │
            ▼
[ Summary Cards Grid (5 Kartu KPI Berwarna Equal Width & Spring Hover Physics) ]
            │
            ▼
[ Grid 3-Kolom Equal Width (items-stretch) ]
  ├── Column 1: Panel Kartu Filter Laporan (Unit, Kelas, Sesi, Periode, Date From/To)
  ├── Column 2: Grafik Tren Utama (Recharts AreaChart / BarChart / LineChart)
  └── Column 3: Grafik Distribusi Donut (Recharts PieChart dengan Legenda & Center Total)
            │
            ▼
[ Datatable Outer Container (Squircle Action Buttons, Search Bar, Per Halaman, HoverCard, Table & Pagination) ]
```

---

## 3. Framer Motion Animation Guidelines untuk Halaman Laporan

Halaman laporan menggunakan `framer-motion` untuk efek pemuatan bertahap (*staggered entrance*) dan animasi kartu KPI:

```jsx
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

// Wrapper Utama Halaman Laporan:
<PageContainer>
  <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6 pb-12">
    <motion.div variants={itemVariants}>
      {/* AppBreadcrumb */}
    </motion.div>

    <motion.div variants={itemVariants}>
      {/* 5-Card Summary Grid */}
    </motion.div>

    <motion.div variants={itemVariants}>
      {/* 3-Column Equal Grid */}
    </motion.div>

    <motion.div variants={itemVariants}>
      {/* Datatable Outer Container */}
    </motion.div>
  </motion.div>
</PageContainer>
```

---

## 4. Komponen Utama & Kode Templat

### A. Kartu KPI Ringkasan Interaktif (5-Card Grid)
Setiap kartu KPI menggunakan tone warna terpadu (`emerald`, `violet`, `sky`, `amber`, `rose`), persentase ratio, serta event klik untuk membuka modal drill-down:

```jsx
{cards.map(({ label, statusKey, value, icon: Icon, tone, percent }) => {
  const style = toneStyles[tone] || toneStyles.emerald
  return (
    <motion.article
      key={label}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => openCardModal(statusKey, label, tone)}
      role="button"
      tabIndex={0}
      className={`group flex flex-col justify-between h-full p-4 rounded-[18px] border shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer ${style.cardBg}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className={`size-10 sm:size-11 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg} ${style.iconColor}`}>
          <Icon className="size-5 sm:size-6" />
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${style.badge}`}>
          {percent.toFixed(1)}%
        </span>
      </div>
      <div>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-0.5">{label}</span>
        <strong className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white block">
          {formatAngka(value)}
        </strong>
      </div>
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80">
        <span>dari total data</span>
        <span className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
          Detail &rarr;
        </span>
      </div>
    </motion.article>
  )
})}
```

---

### B. 3-Column Equal Grid Section (Col 1: Filter Laporan)
Gunakan layout `grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch` agar ketiga kartu memiliki tinggi seragam.

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
  {/* Column 1: Panel Filter Laporan */}
  <article className="overflow-hidden rounded-[18px] border border-slate-200/80 bg-white dark:bg-[#1B2433] p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
    <div>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Filter Laporan</h2>
        <button
          type="button"
          onClick={resetFilter}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          Reset Filter
        </button>
      </div>

      <div className="space-y-3">
        {/* Dropdown Unit / Sesi */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Pilihan Sesi / Unit</label>
          <select
            value={filterOption}
            onChange={(e) => { setFilterOption(e.target.value); setHalaman(1); }}
            className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="semua">Semua Option</option>
          </select>
        </div>

        {/* Dropdown Periode Waktu */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Periode Waktu</label>
          <select
            value={period}
            onChange={(e) => {
              const nextPeriod = e.target.value
              setPeriod(nextPeriod)
              if (nextPeriod !== 'custom' && nextPeriod !== 'semua') {
                const { from, to } = getPeriodDateRange(nextPeriod)
                setDateFrom(from)
                setDateTo(to)
              } else if (nextPeriod === 'semua') {
                setDateFrom('')
                setDateTo('')
              }
              setHalaman(1)
            }}
            className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="semua">Semua Periode Data</option>
            <option value="hari">Hari Ini (Per Hari)</option>
            <option value="minggu">7 Hari Terakhir (Per Minggu)</option>
            <option value="bulan">Bulan Ini (Per Bulan)</option>
            <option value="semester">6 Bulan Terakhir (Per Semester)</option>
            <option value="tahun">Tahun Ini (Per Tahun)</option>
            <option value="custom">Rentang Tanggal Kustom</option>
          </select>
        </div>

        {/* Grid 2-Kolom Tanggal Mulai & Tanggal Selesai */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Tanggal Mulai</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPeriod('custom'); setHalaman(1); }}
              className="w-full h-8 px-2 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Tanggal Selesai</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPeriod('custom'); setHalaman(1); }}
              className="w-full h-8 px-2 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  </article>

  {/* Column 2: Grafik Tren Utama (BarChart/AreaChart) */}
  <article className="overflow-hidden rounded-[18px] border border-slate-200/80 bg-white dark:bg-[#1B2433] p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">Tren Data Utama</h2>
      <span className="text-xs font-semibold text-slate-400">Trend Analytics</span>
    </div>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="nama" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="jumlah" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </article>

  {/* Column 3: Grafik Distribusi Donut (PieChart) */}
  <article className="overflow-hidden rounded-[18px] border border-slate-200/80 bg-white dark:bg-[#1B2433] p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">Distribusi Komposisi</h2>
      <span className="text-xs font-bold text-slate-500">{formatAngka(total)} Total</span>
    </div>
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="relative w-40 h-40 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={2}>
              {pieData.map((item) => <Cell key={item.name} fill={item.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <strong className="text-xl font-black text-slate-900 dark:text-white">{formatAngka(total)}</strong>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
        </div>
      </div>
    </div>
  </article>
</div>
```

---

## 5. Aturan Wajib Komponen UI (AGENTS.md & Rules)

1. **Aksi Tombol Toolbar**: Wajib menggunakan `SquircleActionButton` dari `@/components/master-data` (misal `variant="export"` untuk Export CSV dan `variant="view"` untuk Cetak Data).
2. **Datatable Layout**:
   - Kontainer tabel memiliki `overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-[#1B2433]`.
   - Viewport tabel menggunakan `TableRoot fullBleed={false}` dengan pembungkus padding `px-4 sm:px-6 md:px-8`.
   - Baris tabel menggunakan `TableRow` dengan micro-animation hover `hover:bg-slate-50/90 dark:hover:bg-slate-800/50`.
3. **Pencetakan & Export PDF**: Wajib menggunakan `PrintOptionModal` yang memanggil `printCleanTable` (pencetakan hidden iframe tanpa tab baru) dan `downloadPdfTable` (unduh berkas `.pdf`).
4. **Pratinjau Identitas Data**: Menggunakan `HoverCard` untuk menampilkan popup profil cepat saat kursor diarahkan ke nama siswa/pegawai.
