import React from 'react'
import { Filter, RefreshCw } from 'lucide-react'

export default function DashboardFilter({
  units = [],
  selectedUnit = 'all',
  onUnitChange,
  academicYears = [],
  selectedAcademicYear = '',
  onAcademicYearChange,
  semesters = [],
  selectedSemester = '',
  onSemesterChange,
  onReset,
  extraFilters
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[18px] border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Filter className="w-4 h-4 text-[#0E5C44] dark:text-emerald-400" />
          <span>Filter Data:</span>
        </div>

        {units.length > 0 && (
          <select
            value={selectedUnit}
            onChange={(e) => onUnitChange?.(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0E5C44] focus:ring-1 focus:ring-[#0E5C44] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Semua Unit Pendidikan</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.nama}
              </option>
            ))}
          </select>
        )}

        {academicYears.length > 0 && (
          <select
            value={selectedAcademicYear}
            onChange={(e) => onAcademicYearChange?.(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0E5C44] focus:ring-1 focus:ring-[#0E5C44] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">Tahun Ajaran Aktif</option>
            {academicYears.map((ay) => (
              <option key={ay.id} value={ay.id}>
                {ay.year_name || ay.nama || ay.tahun}
              </option>
            ))}
          </select>
        )}

        {semesters.length > 0 && (
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange?.(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0E5C44] focus:ring-1 focus:ring-[#0E5C44] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="">Semester Aktif</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.nama}
              </option>
            ))}
          </select>
        )}

        {extraFilters}
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#0E5C44] dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filter</span>
        </button>
      )}
    </div>
  )
}
