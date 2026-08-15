import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import AppBadge from './AppBadge'
import AppSkeleton from './AppSkeleton'

const toneMap = {
  emerald: 'bg-[#0E5C44]/10 text-[#0E5C44] dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]',
  blue: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

/**
 * SummaryCard - Canonical summary card (used for unit, program, rombel summary).
 */
export default function SummaryCard({
  icon: Icon,
  title,
  value,
  description,
  badge,
  badgeVariant = 'info',
  onClick,
  loading = false,
  accent = true,
  colorScheme,
  className = '',
}) {
  if (loading) {
    return <AppSkeleton variant="card" className={cn('summary-card h-[90px] rounded-[18px]', className)} />
  }

  const tone = colorScheme ? toneMap[colorScheme] || toneMap.emerald : null
  const isClickable = typeof onClick === 'function'

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
      className={cn(
        'summary-card flex items-center gap-4 rounded-[18px] border border-slate-200/80 bg-white p-4.5 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E5C44]/30 dark:border-slate-800 dark:bg-[#1B2433]',
        isClickable && 'cursor-pointer hover:-translate-y-0.5 hover:border-[#3FBF75]/40 hover:shadow-md dark:hover:border-[#3FBF75]/30',
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'summary-card__icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors',
            tone || (accent ? 'bg-[#0E5C44]/10 text-[#0E5C44] dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300')
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="summary-card__content min-w-0 flex-1">
        <p className="summary-card__title truncate text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </p>
        <div className="summary-card__value-row mt-0.5 flex flex-wrap items-center gap-2">
          <span className="summary-card__value text-xl font-black text-slate-900 dark:text-white">
            {value ?? '—'}
          </span>
          {badge && <AppBadge variant={badgeVariant}>{badge}</AppBadge>}
        </div>
        {description && (
          <p className="summary-card__description mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
            {description}
          </p>
        )}
      </div>
      {isClickable && <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600" />}
    </div>
  )
}
