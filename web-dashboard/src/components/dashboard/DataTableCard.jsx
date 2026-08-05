import React from 'react'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

export default function DataTableCard({
  title,
  subtitle,
  action,
  headers = [],
  rows = [],
  loading = false,
  emptyMessage = 'Belum ada data pada tabel ini.',
  error = null,
  onRetry,
  className = ''
}) {
  return (
    <div className={`rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          {title && <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      {loading ? (
        <div className="space-y-3 py-2">
          <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : rows.length === 0 ? (
        <EmptyState title="Data Tidak Ditemukan" message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx} className="px-4 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  {Array.isArray(row) ? (
                    row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 whitespace-nowrap">
                        {cell}
                      </td>
                    ))
                  ) : (
                    <td colSpan={headers.length} className="px-4 py-3">
                      {row}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
