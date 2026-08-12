import React from 'react'
import { Sparkles } from 'lucide-react'

/**
 * AppPageHeader - canonical page header (satu-satunya header di aplikasi).
 *
 * variant:
 *  - 'brand' : gradient hijau (dipakai dashboard role)
 *  - 'card'  : kartu putih (dipakai halaman master/data)
 *  - 'default': header ringan tanpa kartu
 *
 * Props: icon, title, description, actions (quick action), chips (badge role/unit/tahun), badgeCount
 */
export default function AppPageHeader({
  variant = 'brand',
  icon: Icon,
  title,
  description,
  actions,
  chips = [],
  className = '',
  eyebrow,
  welcomeName,
}) {
  if (variant === 'card') {
    return (
      <header className={`relative overflow-hidden rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm md:p-6 dark:border-slate-800 dark:bg-[#1B2433] ${className}`}>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex min-w-0 items-start gap-4">
            {Icon && (
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0E5C44]/10 text-[#0E5C44] sm:flex dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]">
                <Icon className="h-7 w-7" />
              </div>
            )}
            <div className="min-w-0">
              {eyebrow && <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0E5C44] dark:text-[#3FBF75]">{eyebrow}</p>}
              <h1 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl dark:text-white">{title}</h1>
              {description && <p className="mt-1 max-w-2xl text-xs text-slate-500 md:text-sm dark:text-slate-400">{description}</p>}
              {chips.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {chips.map((chip, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
        </div>
      </header>
    )
  }

  if (variant === 'default') {
    return (
      <header className={`flex flex-col justify-between gap-4 md:flex-row md:items-center ${className}`}>
        <div className="flex min-w-0 items-center gap-3.5">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0E5C44]/10 text-[#0E5C44] dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]">
              <Icon className="h-5.5 w-5.5" />
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0E5C44] dark:text-[#3FBF75]">{eyebrow}</p>}
            <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 md:text-xl dark:text-white">{title}</h1>
            {description && <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
      </header>
    )
  }

  // brand (default)
  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-gradient-to-r from-[#083A2A] via-[#0E5C44] to-[#1E8E5A] p-5 text-white shadow-lg md:p-6 ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="appPageHeaderPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30,0 L 60,30 L 30,60 L 0,30 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="30" cy="30" r="12" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#appPageHeaderPattern)" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-1">
          {eyebrow && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-100">
              <Sparkles className="h-3 w-3 text-emerald-300" />
              {eyebrow}
            </span>
          )}
          {welcomeName && <p className="text-[11px] font-semibold text-emerald-100/85">Selamat datang, {welcomeName}</p>}
          <h1 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">{title}</h1>
          {description && <p className="max-w-2xl text-xs leading-5 text-emerald-100 md:text-sm">{description}</p>}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {chips.map((chip, idx) => (
                <span key={idx} className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
