import React from 'react'
import { Sparkles, Calendar, School } from 'lucide-react'

export default function DashboardHeader({
  title,
  subtitle,
  roleName,
  unitName,
  academicYear,
  semester,
  action
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#083A2A] via-[#0E5C44] to-[#1E8E5A] p-6 md:p-8 text-white shadow-xl border border-emerald-500/20">
      {/* Geometric background decoration */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamicHeaderPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30,0 L 60,30 L 30,60 L 0,30 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="30" cy="30" r="12" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamicHeaderPattern)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {roleName && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-100 border border-emerald-300/30 backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                {roleName}
              </span>
            )}
            {unitName && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                <School className="w-3 h-3 text-white/80" />
                {unitName}
              </span>
            )}
            {(academicYear || semester) && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-white/80" />
                {academicYear} {semester ? `(${semester})` : ''}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-sm text-emerald-100 max-w-2xl">{subtitle}</p>}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
