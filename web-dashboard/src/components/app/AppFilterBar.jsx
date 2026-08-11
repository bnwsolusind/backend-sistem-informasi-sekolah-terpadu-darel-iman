import React from 'react'
import { SlidersHorizontal } from 'lucide-react'

/**
 * AppFilterBar - canonical filter bar.
 * Semua halaman memakai AppFilterBar (bukan markup filter masing-masing).
 */
export default function AppFilterBar({ children, label = 'Filter', className = '' }) {
  return (
    <section className={`flex flex-col gap-3 rounded-[18px] border border-slate-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center dark:border-slate-800 dark:bg-[#1B2433] ${className}`}>
      {label && (
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
          <SlidersHorizontal className="h-4 w-4 text-[#0E5C44] dark:text-[#3FBF75]" />
          {label}:
        </span>
      )}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>
    </section>
  )
}
