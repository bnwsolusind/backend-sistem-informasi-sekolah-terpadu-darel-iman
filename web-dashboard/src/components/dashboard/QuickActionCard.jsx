import React from 'react'
import PermissionGuard from './PermissionGuard'

export default function QuickActionCard({
  title = 'Aksi Cepat',
  actions = []
}) {
  if (actions.length === 0) return null

  return (
    <div className="rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          const content = (
            <button
              key={idx}
              type="button"
              onClick={act.onClick}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/60 hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-emerald-950/40 dark:hover:border-emerald-800 transition-all text-center group"
            >
              {act.icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0E5C44] shadow-xs group-hover:scale-110 dark:bg-slate-800 dark:text-emerald-400 transition-transform mb-2">
                  <act.icon className="h-5 w-5" />
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-[#0E5C44] dark:group-hover:text-emerald-400">
                {act.label}
              </span>
            </button>
          )

          if (act.permissions && act.permissions.length > 0) {
            return (
              <PermissionGuard key={idx} any={act.permissions}>
                {content}
              </PermissionGuard>
            )
          }

          return content
        })}
      </div>
    </div>
  )
}
