import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/utils'
import AppBadge from './AppBadge'
import AppSkeleton from './AppSkeleton'

function Sparkline({ data = [], color = '#3FBF75', className = '' }) {
  if (!Array.isArray(data) || data.length < 2) return null
  const w = 96
  const h = 28
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => `${((i / (data.length - 1)) * w).toFixed(1)},${(h - 3 - ((v - min) / range) * (h - 6)).toFixed(1)}`)
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn('h-7 w-24', className)} aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const toneMap = {
  emerald: 'bg-[#0E5C44]/10 text-[#0E5C44] border-emerald-100 dark:bg-[#3FBF75]/20 dark:text-[#3FBF75] dark:border-emerald-900/40',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
  blue: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900',
  violet: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-900',
  amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
  rose: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900',
}

/**
 * KpiCard - Canonical KPI card for dashboards and statistics summaries.
 */
export default function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up',
  trendText,
  badge,
  badgeVariant = 'success',
  sparkline,
  onClick,
  colorScheme = 'emerald',
  subtitle,
  loading = false,
  isError = false,
  errorMessage,
  onRetry,
  empty = false,
  className = '',
}) {
  if (loading) {
    return <AppSkeleton variant="card" className={cn('h-[118px] rounded-[18px]', className)} />
  }

  if (isError) {
    return (
      <div className={cn('flex flex-col justify-between rounded-[18px] border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20', className)}>
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-xs font-bold truncate">{title || 'Gagal memuat KPI'}</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">{errorMessage || 'Data tidak dapat diambil'}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:underline dark:text-rose-300"
          >
            <RefreshCw className="h-3 w-3" />
            Coba Lagi
          </button>
        )}
      </div>
    )
  }

  const isClickable = typeof onClick === 'function'
  const tone = toneMap[colorScheme] || toneMap.emerald

  const TrendIcon = trendType === 'down' ? ArrowDownRight : trendType === 'neutral' ? Minus : ArrowUpRight
  const trendColor = trendType === 'down' ? 'text-rose-600 dark:text-rose-400' : trendType === 'neutral' ? 'text-slate-400 dark:text-slate-500' : 'text-[#1E8E5A] dark:text-[#3FBF75]'

  const displayValue = empty || value === undefined || value === null ? '—' : value

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      title={isClickable ? 'Klik untuk melihat detail KPI' : undefined}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-[18px] border border-slate-200/80 bg-white p-4.5 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E5C44]/30 dark:border-slate-800 dark:bg-[#1B2433]',
        isClickable && 'cursor-pointer hover:-translate-y-0.5 hover:border-[#3FBF75]/40 hover:shadow-md dark:hover:border-[#3FBF75]/30',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </p>
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {displayValue}
            </h3>
            {badge && <AppBadge variant={badgeVariant} dot>{badge}</AppBadge>}
          </div>
          {subtitle && (
            <p className="line-clamp-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-transparent shadow-xs transition-colors', tone)}>
            <Icon className="h-5.5 w-5.5" />
          </div>
        )}
      </div>

      {trend !== undefined && trend !== null && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn('inline-flex items-center gap-0.5 text-xs font-extrabold', trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {trend}
            </span>
            <span className="truncate text-[10px] font-medium text-slate-400 dark:text-slate-500">
              {trendText || 'vs periode sebelumnya'}
            </span>
          </div>
          {sparkline && <Sparkline data={sparkline} className="h-6 w-16 shrink-0" />}
        </div>
      )}

      {isClickable && (
        <span className="absolute bottom-3.5 right-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0E5C44]/10 text-[#0E5C44] opacity-0 transition-all group-hover:opacity-100 dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]">
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  )
}
