import React from 'react'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  loading = false,
  empty = false,
  emptyMessage = 'Belum ada data grafik untuk periode ini.',
  error = null,
  onRetry,
  className = ''
}) {
  return (
    <div className={`rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="min-h-[260px] flex items-center justify-center">
        {loading ? (
          <div className="w-full h-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : empty ? (
          <EmptyState title="Data Kosong" message={emptyMessage} />
        ) : (
          <div className="w-full">{children}</div>
        )}
      </div>
    </div>
  )
}
