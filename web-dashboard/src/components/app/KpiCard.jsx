import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus, ChevronRight } from 'lucide-react'
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
  emerald: 'bg-emerald-50 text-[#0E5C44] border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900',
  blue: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900',
  violet: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-900',
  amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
  rose: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900',
}

/**
 * KpiCard - canonical KPI card.
 * Seluruh KPI di aplikasi memakai komponen ini agar identik:
 * icon + value + trend + badge + mini chart (sparkline) + action + hover + loading + empty.
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
  empty = false,
  className = '',
}) {
  if (loading) {
    return <AppSkeleton variant="card" />
  }

  const isClickable = typeof onClick === 'function'
  const tone = toneMap[colorScheme] || toneMap.emerald

  const TrendIcon = trendType === 'down' ? ArrowDownRight : trendType === 'neutral' ? Minus : ArrowUpRight
  const trendColor = trendType === 'down' ? 'text-rose-500' : trendType === 'neutral' ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400'

  const displayValue = empty || value === undefined || value === null ? '—' : value

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
      title={isClickable ? 'Klik untuk melihat detail' : undefined}
      className={cn(
        'relative h-full min-h-[112px] overflow-hidden rounded-[16px] border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-[#1B2433]',
        isClickable && 'cursor-pointer hover:-translate-y-0.5 hover:border-[#3FBF75]/40 hover:shadow-lg active:translate-y-0',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <p className="line-clamp-2 min-h-4 text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-slate-400 dark:text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{displayValue}</h3>
            {badge && <AppBadge variant={badgeVariant} dot>{badge}</AppBadge>}
          </div>
          {subtitle && <p className="line-clamp-1 text-[10px] text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border', tone)}>
            <Icon className="h-5.5 w-5.5" />
          </div>
        )}
      </div>

      {(trend !== undefined && trend !== null) && (
          <div className="mt-2 flex min-h-6 items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
          <div className="flex items-center gap-2">
              <span className={cn('inline-flex items-center gap-0.5 text-[11px] font-black', trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {trend}
            </span>
            <span className="truncate text-[9px] font-medium text-slate-400">{trendText || 'dari periode sebelumnya'}</span>
          </div>
          {sparkline && <Sparkline data={sparkline} className="h-6 w-16" />}
        </div>
      )}

      {isClickable && (
        <span className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#0E5C44]/10 text-[#0E5C44] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]" style={{ opacity: 0.75 }}>
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  )
}
