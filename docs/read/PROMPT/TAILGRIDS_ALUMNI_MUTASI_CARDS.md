# TailGrids Alumni & Mutasi Detail Cards Component Guideline

## Overview
Dokumen ini berisi spesifikasi teknis dan panduan desain UI/UX untuk **Detail Summary Cards (Pindah Unit, Pindah Keluar, & Tujuan Tamat Alumni)** pada Sistem Manajemen Sekolah Terpadu (SIMSIT). 

Komponen ini dirancang untuk menggantikan kartu metrik konvensional yang kaku menjadi kartu wawasan (*insightful cards*) yang informatif, interaktif, dan modern dengan dukungan tema gelap (*dark mode*), visual hierarchy yang tajam, ambient glowing, serta integrasi modal rincian interaktif (*interactive drill-down modal*).

---

## Filosofi Desain UI/UX

1. **Information Density & At-a-Glance Clarity**:
   - Kartu tidak sekadar menyajikan angka total mentah, melainkan menyajikan ringkasan kontekstual (*mini breakdown* top unit tujuan, top sekolah luar, atau bar distribusi kelanjutan studi).
   - Pengambil keputusan (Kepala Sekolah, Admin Yayasan) dapat langsung menangkap arah perpindahan dan kelulusan siswa tanpa harus membuka tabel data terlebih dahulu.

2. **Semantic Color Coding (Tonal Harmony)**:
   - 🟡 **Amber / Orange Accent** untuk **Pindah Unit (Mutasi Internal)**: Menandakan pergerakan di dalam ekosistem yayasan yang dinamis dan perlu koordinasi antar-unit.
   - 🔴 **Rose / Pink Accent** untuk **Pindah Keluar (Mutasi Eksternal)**: Menandakan pelepasan data siswa ke sekolah luar dengan aksen peringatan yang tegas namun elegan.
   - 🟢 **Emerald / Teal Accent** untuk **Tujuan Tamat (Studi Lanjut Alumni)**: Merefleksikan pencapaian, kelulusan sukses, dan kesinambungan pendidikan santri/siswa ke jenjang yang lebih tinggi.

3. **Micro-Interactions & Affordance**:
   - Dilengkapi subtle ambient glow di sudut kartu yang membesar secara halus saat di-hover (`group-hover:scale-110` / `blur-2xl`).
   - Penanda interaksi kursor (`cursor-pointer`) disertai label ajakan klik di bagian footer kartu (`Klik untuk detail lengkap`) yang memicu dialog rincian data.

4. **Keterbacaan Numerik Nyata (Bukan Persentase Saja)**:
   - Pada kartu Tujuan Tamat, label kategori menampilkan **jumlah siswa secara absolut** (`X siswa`) dengan bilah progres berwarna (*colored progress bar*) sebagai penunjuk visual proporsi.

---

## Standar Kode & Template Komponen (3-Column Grid)

```jsx
import React from 'react'
import { ArrowRightLeft, UserX, GraduationCap, Eye } from 'lucide-react'

export function AlumniMutasiCardsGrid({
  counts,
  categoryLists,
  tujuanStats,
  onOpenCardModal,
  setCategoryTab,
  setPage,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">

      {/* ========================================================================= */}
      {/* CARD A: PINDAH UNIT (MUTASI INTERNAL)                                     */}
      {/* ========================================================================= */}
      <div
        onClick={() => {
          setCategoryTab('mutasi')
          setPage(1)
          onOpenCardModal('pindah_unit')
        }}
        className="group relative overflow-hidden cursor-pointer rounded-[18px] border-2 border-amber-300/70 bg-gradient-to-br from-amber-50 via-orange-50/60 to-white p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 dark:border-amber-700/50 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-slate-900"
      >
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl group-hover:bg-amber-400/30 transition-all" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/40">
              <ArrowRightLeft className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Pindah Unit
              </p>
              <p className="text-[10px] text-amber-600/70 dark:text-amber-500/70">
                Mutasi Internal Antar Unit
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
            Internal
          </span>
        </div>

        {/* Metric Value */}
        <p className="text-4xl font-black text-amber-700 dark:text-amber-300 tabular-nums">
          {counts.pindah_unit}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-amber-600/80 dark:text-amber-400/80">
          siswa berpindah unit di dalam yayasan
        </p>

        {/* Contextual Mini Breakdown: Top Unit Tujuan */}
        <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/40 space-y-1">
          {counts.pindah_unit > 0 ? (
            <>
              {(() => {
                const unitCount = {}
                categoryLists.pindah_unit.forEach((item) => {
                  const uName = item.education_unit?.name || item.unit?.name || 'Unit Lain'
                  unitCount[uName] = (unitCount[uName] || 0) + 1
                })
                return Object.entries(unitCount)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([unit, cnt]) => (
                    <div key={unit} className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-amber-800/80 dark:text-amber-300/80 truncate max-w-[70%]">
                        {unit}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400">
                        {cnt} siswa
                      </span>
                    </div>
                  ))
              })()}
            </>
          ) : (
            <p className="text-[10px] text-amber-500/60 italic">Belum ada data mutasi internal</p>
          )}
        </div>

        {/* Footer Link / Trigger Affordance */}
        <p className="mt-2 text-[10px] font-bold text-amber-600/60 dark:text-amber-500/60 flex items-center gap-1">
          <Eye className="h-3 w-3" /> Klik untuk detail lengkap
        </p>
      </div>

      {/* ========================================================================= */}
      {/* CARD B: PINDAH KELUAR SEKOLAH (MUTASI EKSTERNAL)                           */}
      {/* ========================================================================= */}
      <div
        onClick={() => {
          setCategoryTab('mutasi')
          setPage(1)
          onOpenCardModal('pindah_keluar')
        }}
        className="group relative overflow-hidden cursor-pointer rounded-[18px] border-2 border-rose-300/70 bg-gradient-to-br from-rose-50 via-pink-50/60 to-white p-5 shadow-sm hover:shadow-md hover:border-rose-400 transition-all duration-200 dark:border-rose-700/50 dark:from-rose-950/40 dark:via-pink-950/20 dark:to-slate-900"
      >
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-rose-400/20 blur-2xl group-hover:bg-rose-400/30 transition-all" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm shadow-rose-500/40">
              <UserX className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Pindah Keluar
              </p>
              <p className="text-[10px] text-rose-600/70 dark:text-rose-500/70">
                Mutasi ke Sekolah Lain
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
            Eksternal
          </span>
        </div>

        {/* Metric Value */}
        <p className="text-4xl font-black text-rose-700 dark:text-rose-300 tabular-nums">
          {counts.pindah_keluar}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold text-rose-600/80 dark:text-rose-400/80">
          siswa pindah keluar ke sekolah lain
        </p>

        {/* Contextual Mini Breakdown: Top Sekolah Tujuan */}
        <div className="mt-3 pt-3 border-t border-rose-200/60 dark:border-rose-800/40 space-y-1">
          {counts.pindah_keluar > 0 ? (
            <>
              {(() => {
                const sekolahCount = {}
                categoryLists.pindah_keluar.forEach((item) => {
                  const tujuan = item.metadata?.sekolah_tujuan || 'Sekolah Lain'
                  sekolahCount[tujuan] = (sekolahCount[tujuan] || 0) + 1
                })
                return Object.entries(sekolahCount)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([sekolah, cnt]) => (
                    <div key={sekolah} className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-rose-800/80 dark:text-rose-300/80 truncate max-w-[70%]">
                        {sekolah}
                      </span>
                      <span className="text-[10px] font-extrabold text-rose-700 dark:text-rose-400">
                        {cnt} siswa
                      </span>
                    </div>
                  ))
              })()}
            </>
          ) : (
            <p className="text-[10px] text-rose-500/60 italic">Belum ada data mutasi keluar</p>
          )}
        </div>

        {/* Footer Link / Trigger Affordance */}
        <p className="mt-2 text-[10px] font-bold text-rose-600/60 dark:text-rose-500/60 flex items-center gap-1">
          <Eye className="h-3 w-3" /> Klik untuk detail lengkap
        </p>
      </div>

      {/* ========================================================================= */}
      {/* CARD C: TUJUAN TAMAT ALUMNI (DISTRIBUSI STUDI LANJUT)                    */}
      {/* ========================================================================= */}
      <div
        onClick={() => {
          setCategoryTab('alumni')
          setPage(1)
          onOpenCardModal('lanjut_studi')
        }}
        className="group relative overflow-hidden cursor-pointer rounded-[18px] border-2 border-emerald-300/70 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white p-5 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200 dark:border-emerald-700/50 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900"
      >
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl group-hover:bg-emerald-400/30 transition-all" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/40">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Tujuan Tamat
              </p>
              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70">
                Distribusi Studi Lanjut Alumni
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
            {tujuanStats.total} Alumni
          </span>
        </div>

        {/* Breakdown Progress Bars dengan Jumlah Absolut */}
        <div className="space-y-2">
          {[
            { label: 'Kuliah / PTN / PTS', count: tujuanStats.kuliah, color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-300' },
            { label: 'Pesantren / Ma\'had', count: tujuanStats.pesantren, color: 'bg-purple-500', textColor: 'text-purple-700 dark:text-purple-300' },
            { label: 'Bekerja / Wirausaha', count: tujuanStats.bekerja, color: 'bg-amber-500', textColor: 'text-amber-700 dark:text-amber-300' },
            { label: 'Sekolah Lanjutan', count: tujuanStats.sekolah, color: 'bg-sky-500', textColor: 'text-sky-700 dark:text-sky-300' },
            { label: 'Belum Terisi', count: tujuanStats.belumDiisi, color: 'bg-slate-300', textColor: 'text-slate-500 dark:text-slate-400' },
          ].map(({ label, count, color, textColor }) => {
            const pct = tujuanStats.total > 0 ? Math.round((count / tujuanStats.total) * 100) : 0
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[10px] font-semibold ${textColor} truncate max-w-[60%]`}>
                    {label}
                  </span>
                  <span className={`text-[10px] font-extrabold ${textColor}`}>
                    {count} <span className="font-semibold opacity-70">siswa</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Link / Trigger Affordance */}
        <p className="mt-3 text-[10px] font-bold text-emerald-600/60 dark:text-emerald-500/60 flex items-center gap-1">
          <Eye className="h-3 w-3" /> Klik untuk detail lengkap
        </p>
      </div>

    </div>
  )
}
```

---

## Spesifikasi Token Gaya (Style Tokens)

| Elemen | Pindah Unit (Amber) | Pindah Keluar (Rose) | Tujuan Tamat (Emerald) |
|---|---|---|---|
| **Border Container** | `border-amber-300/70 dark:border-amber-700/50` | `border-rose-300/70 dark:border-rose-700/50` | `border-emerald-300/70 dark:border-emerald-700/50` |
| **Glow Effect** | `bg-amber-400/20 blur-2xl` | `bg-rose-400/20 blur-2xl` | `bg-emerald-400/20 blur-2xl` |
| **Icon Badge Gradient**| `from-amber-500 to-orange-600` | `from-rose-500 to-pink-600` | `from-emerald-500 to-teal-600` |
| **Tag Badge Header** | `bg-amber-100 text-amber-700 dark:bg-amber-900/60` | `bg-rose-100 text-rose-700 dark:bg-rose-900/60` | `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60` |
| **Nilai Metrik Utama** | `text-4xl font-black text-amber-700 dark:text-amber-300` | `text-4xl font-black text-rose-700 dark:text-rose-300` | Dynamic breakdown rows (multi-color) |
| **Divider Pemisah** | `border-t border-amber-200/60 dark:border-amber-800/40` | `border-t border-rose-200/60 dark:border-rose-800/40` | Embedded progress track `bg-slate-100 dark:bg-slate-800` |

---

## Standar Interaksi Drill-Down Modal (TailGrids Dialog)

Ketika salah satu kartu diklik:
1. `type = 'pindah_unit'`: Dialog menampilkan kolom `No`, `Nama & NIS Siswa`, `Unit Asal`, `Unit Tujuan Baru` (disertai ikon panah mutasi), `Waktu Mutasi`, dan `Alasan Mutasi`.
2. `type = 'pindah_keluar'`: Dialog menampilkan kolom `No`, `Nama & NIS Siswa`, `Unit Asal`, `Sekolah Tujuan Keluar`, `Waktu Pindah`, dan `Alasan Keluar`.
3. `type = 'lanjut_studi'`: Dialog menampilkan kolom `No`, `Nama & NIS Siswa`, `Unit Lulus`, `Tahun Tamat`, `Status Lanjutan` (Badge), `Kampus / Sekolah Tujuan`, dan `Jurusan / Karir`.
4. Dialog menggunakan konfigurasi lebar `max-w-4xl w-full` dengan scroll viewport `max-h-[65vh]` dan input filter pencarian instan (*instant search input*).
