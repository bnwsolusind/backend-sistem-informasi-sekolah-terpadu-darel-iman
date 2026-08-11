import React from 'react'
import { Home, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

/**
 * AppBreadcrumb - canonical breadcrumb.
 *
 * items: [{ label, to }] — item terakhir tanpa `to` dianggap halaman aktif.
 * homeTo: default '/dashboard' (Home icon). Set null untuk menyembunyikan home.
 */
export default function AppBreadcrumb({ items = [], homeTo = '/dashboard', className = '' }) {
  const all = homeTo ? [{ label: 'Beranda', to: homeTo }, ...items] : [...items]

  return (
    <nav className={cn('flex items-center gap-1 text-xs', className)} aria-label="Breadcrumb">
      {all.map((item, idx) => {
        const isLast = idx === all.length - 1
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />}
            {isLast || !item.to ? (
              <strong className="font-bold text-slate-800 dark:text-slate-200" aria-current="page">
                {item.label}
              </strong>
            ) : (
              <Link
                to={item.to}
                aria-label={item.label === 'Beranda' ? 'Kembali ke Dashboard' : item.label}
                className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-[#0E5C44] dark:text-slate-400 dark:hover:text-[#3FBF75]"
              >
                {item.label === 'Beranda' && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
