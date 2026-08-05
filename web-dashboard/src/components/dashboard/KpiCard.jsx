import React from 'react'
import TrendIndicator from './TrendIndicator'

export default function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'neutral',
  trendText,
  onClick,
  subtitle,
  loading = false,
  colorScheme = 'emerald'
}) {
  if (loading) {
    return (
      <div className="h-32 rounded-[18px] bg-slate-100 dark:bg-slate-800 animate-pulse p-5 border border-slate-200 dark:border-slate-800" />
    )
  }

  const isClickable = typeof onClick === 'function'

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${
        isClickable ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:translate-y-0' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {value !== undefined && value !== null ? value : '-'}
            </h3>
          </div>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#0E5C44] dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
            <Icon className="h-5.5 w-5.5" />
          </div>
        )}
      </div>

      {(trend !== undefined && trend !== null) && (
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <TrendIndicator value={trend} type={trendType} text={trendText} />
        </div>
      )}
    </div>
  )
}
