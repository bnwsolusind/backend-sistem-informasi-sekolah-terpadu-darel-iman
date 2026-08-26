# TailGrids Modern Hero Card Header Component Guideline

## Overview
Dokumen ini berisi spesifikasi teknis dan panduan implementasi untuk **Modern Hero Card Header (Vivid Emerald Gradient Standard)** pada Sistem Manajemen Sekolah Terpadu (SIMSIT). Komponen header ini diletakkan di bawah `AppBreadcrumb` pada halaman-halaman utama (seperti Dashboard Yayasan, Dashboard Utama, Monitoring Divisi, Berita & Pengumuman Sekolah, dsb.) untuk memberikan kesan eksekutif, modern, tegas, dan state-of-the-art.

---

## Standar Kode & Struktur Template (Vivid Emerald Gradient Spec)

```jsx
import { Building2, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react'
import AppBreadcrumb from '@/components/app/AppBreadcrumb'
import { AppButton } from '@/components/app'

export default function ExampleDashboardPage({ title, description, badgeText, onRefresh }) {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Breadcrumb Navigation */}
      <AppBreadcrumb items={[{ label: 'Dashboard' }, { label: title }]} />

      {/* 2. Header Halaman Modern Hero Card dengan Gradasi Hijau Lebih Jelas & Peceat */}
      <div className="relative overflow-hidden rounded-[22px] border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-600/15 p-5 sm:p-6 shadow-md shadow-emerald-500/10 dark:border-emerald-600/40 dark:bg-gradient-to-r dark:from-emerald-950/70 dark:via-teal-950/50 dark:to-slate-900">
        {/* Ambient Glow Background Accent (Vibrant Dual Emerald-Teal Blobs) */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/40 via-teal-400/30 to-emerald-600/20 blur-3xl dark:from-emerald-500/50 dark:via-teal-400/40" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-gradient-to-tr from-emerald-600/30 via-teal-500/20 to-transparent blur-3xl dark:from-emerald-600/40 dark:via-teal-500/30" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Side: Icon Badge, Title, Role Tag & Description */}
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/40 border border-emerald-300/40 dark:from-emerald-400 dark:via-emerald-500 dark:to-teal-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1 text-xs font-extrabold text-white shadow-sm shadow-emerald-600/25 border border-emerald-300/40">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {badgeText}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Right Side: Action Button or Status Indicator Badge */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onRefresh ? (
              <AppButton
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={onRefresh}
                className="text-xs font-bold text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-950/80"
              >
                Segarkan Data
              </AppButton>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-100 via-emerald-50 to-teal-100 px-3.5 py-1.5 text-xs font-black text-emerald-900 dark:border-emerald-700 dark:bg-gradient-to-r dark:from-emerald-950 dark:to-teal-950 dark:text-emerald-200 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Realtime Analytics</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Konten Halaman Berikutnya (KPI Cards, Charts, Datatable) */}
    </div>
  )
}
```

---

## Karakteristik Desain Utama
1. **Vivid Emerald Container Styling**:
   - Class: `relative overflow-hidden rounded-[22px] border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-600/15 p-5 sm:p-6 shadow-md shadow-emerald-500/10 dark:border-emerald-600/40 dark:bg-gradient-to-r dark:from-emerald-950/70 dark:via-teal-950/50 dark:to-slate-900`.
2. **Dual Multi-Tone Vibrant Ambient Glows**:
   - Top Right Glow: `<div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/40 via-teal-400/30 to-emerald-600/20 blur-3xl dark:from-emerald-500/50 dark:via-teal-400/40" />`.
   - Bottom Left Glow: `<div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-gradient-to-tr from-emerald-600/30 via-teal-500/20 to-transparent blur-3xl dark:from-emerald-600/40 dark:via-teal-500/30" />`.
3. **High-Contrast Gradient Icon Badge**:
   - Class: `flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/40 border border-emerald-300/40 dark:from-emerald-400 dark:via-emerald-500 dark:to-teal-600`.
4. **Vivid Emerald Solid Pill Role Tag Badge**:
   - Class: `inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1 text-xs font-extrabold text-white shadow-sm shadow-emerald-600/25 border border-emerald-300/40`.
5. **Tipografi & Kontras**:
   - Title (`h1`): `text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white`.
   - Subtitle (`p`): `mt-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed`.
