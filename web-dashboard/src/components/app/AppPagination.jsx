import React from 'react'
import { Pagination } from '../ui/pagination'

/**
 * AppPagination - canonical pagination.
 * Menerima meta Laravel `{ current_page, last_page, total, per_page, from, to }`
 * atau prop manual.
 */
export default function AppPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  meta,
}) {
  const resolvedCurrent = meta?.current_page ?? currentPage ?? 1
  const resolvedTotal = meta?.last_page ?? totalPages ?? 1
  const resolvedTotalItems = meta?.total ?? totalItems ?? 0
  const resolvedPerPage = meta?.per_page ?? itemsPerPage ?? 10

  if (resolvedTotalItems === 0) return null

  return (
    <Pagination
      currentPage={resolvedCurrent}
      totalPages={resolvedTotal}
      onPageChange={onPageChange}
      totalItems={resolvedTotalItems}
      itemsPerPage={resolvedPerPage}
    />
  )
}
