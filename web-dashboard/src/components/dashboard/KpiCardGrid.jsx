import React from 'react'

export default function KpiCardGrid({ children, cols = 4 }) {
  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return <div className={`grid gap-4 ${gridColsClass}`}>{children}</div>
}
