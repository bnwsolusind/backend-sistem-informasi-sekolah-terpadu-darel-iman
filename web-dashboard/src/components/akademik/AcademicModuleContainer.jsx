import { useMemo } from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'

export default function AcademicModuleContainer({ title, description, tabs, children }) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab')

  const tabLinks = useMemo(() => tabs.map((tab) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab.key)
    return { ...tab, to: `${location.pathname}?${params.toString()}` }
  }), [location.pathname, searchParams, tabs])

  return (
    <section className="space-y-5">
      <header className="overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0E5C44] to-[#1E8E5A] p-5 text-white shadow-lg md:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-100">Akademik &amp; LMS</p>
        <h1 className="mt-2 text-2xl font-black md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-emerald-50/90">{description}</p>
      </header>

      <nav aria-label={`Tab ${title}`} className="rounded-[18px] border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-[#1B2433]">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabLinks.map((tab) => (
            <NavLink
              key={tab.key}
              to={tab.to}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === tab.key
                ? 'bg-[#0E5C44] text-white shadow-sm dark:bg-[#3FBF75] dark:text-slate-950'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="academic-module-content">{children}</div>
    </section>
  )
}
