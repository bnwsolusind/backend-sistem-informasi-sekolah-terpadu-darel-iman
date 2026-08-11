import React from 'react'
import { Calendar, School } from 'lucide-react'
import { AppHero } from '../app'

export default function DashboardHeader({
  title,
  subtitle,
  roleName,
  unitName,
  academicYear,
  semester,
  action
}) {
  const chips = []
  if (unitName) {
    chips.push(
      <React.Fragment key="unit">
        <School className="h-3 w-3 text-white/80" />
        {unitName}
      </React.Fragment>
    )
  }
  if (academicYear || semester) {
    chips.push(
      <React.Fragment key="periode">
        <Calendar className="h-3 w-3 text-white/80" />
        {academicYear}
        {semester ? ` (${semester})` : ''}
      </React.Fragment>
    )
  }

  return (
    <AppHero
      title={title}
      description={subtitle}
      eyebrow={roleName}
      chips={chips}
      actions={action}
    />
  )
}
