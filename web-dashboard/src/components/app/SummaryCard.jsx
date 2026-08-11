import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import AppBadge from './AppBadge'
import AppSkeleton from './AppSkeleton'

const toneMap = {
  emerald: 'bg-emerald-50 text-[#0E5C44] border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900',
  blue: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900',
  violet: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-900',
  amber: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
  rose: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900',
  slate: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
}

/**
 * SummaryCard - canonical summary ringkasan (unit, rombel, program, dll).
 * Klik → popup detail.
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
    return <AppSkeleton variant="card" />
  }

  const tone = colorScheme ? toneMap[colorScheme] || toneMap.emerald : null

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={cn(
        'flex items-center gap-4 rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-[#1B2433]',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:border-[#3FBF75]/40 hover:shadow-lg',
        className
      )}
    >
      {Icon && (
        <div className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
          tone || (accent ? 'bg-[#0E5C44]/10 text-[#0E5C44] dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300')
        )}>
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-xl font-black text-slate-900 dark:text-white">{value ?? '—'}</span>
          {badge && <AppBadge variant={badgeVariant}>{badge}</AppBadge>}
        </div>
        {description && <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">{description}</p>}
      </div>
      {onClick && <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />}
    </div>
  )
}
