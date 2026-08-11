import React from 'react'

/**
 * AppToolbar - canonical toolbar (search + filter + aksi).
 * Susunan: [search (flex-1)] [filter] [actions]
 */
export default function AppToolbar({ search, filters, actions, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between ${className}`}>
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {search}
        {filters}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      {children}
    </div>
  )
}
