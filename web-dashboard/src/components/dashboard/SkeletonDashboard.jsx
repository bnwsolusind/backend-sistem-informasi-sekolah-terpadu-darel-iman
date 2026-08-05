import React from 'react'

export default function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-40 w-full rounded-[24px] bg-slate-200 dark:bg-slate-800" />

      {/* Filter skeleton */}
      <div className="h-14 w-full rounded-[18px] bg-slate-200 dark:bg-slate-800" />

      {/* KPI grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-32 rounded-[18px] bg-slate-200 dark:bg-slate-800" />
        <div className="h-32 rounded-[18px] bg-slate-200 dark:bg-slate-800" />
        <div className="h-32 rounded-[18px] bg-slate-200 dark:bg-slate-800" />
        <div className="h-32 rounded-[18px] bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Chart grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-[18px] bg-slate-200 dark:bg-slate-800" />
        <div className="h-72 rounded-[18px] bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Table skeleton */}
      <div className="h-64 rounded-[18px] bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}
