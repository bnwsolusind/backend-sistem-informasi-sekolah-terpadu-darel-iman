import React, { useMemo, useState, useEffect } from 'react'
import { ChevronDown, ChevronsUpDown } from 'lucide-react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table'
import { cn } from '../../lib/utils'
import AppSearch from './AppSearch'
import AppPagination from './AppPagination'
import AppEmptyState from './AppEmptyState'
import AppErrorState from './AppErrorState'
import AppSkeleton from './AppSkeleton'
import ActionDropdown from './ActionDropdown'

/**
 * AppDataTable - canonical data table (satu-satunya tabel di aplikasi).
 *
 * Fitur:
 *  - Sticky header, sticky kolom aksi
 *  - Search internal + controlled
 *  - Filter via `filters` node (biasanya AppFilterBar)
 *  - Pagination (meta Laravel atau manual)
 *  - Density comfortable/compact
 *  - Loading skeleton, Empty, Error state
 *  - Selected row
 *  - Kolom aksi (View/Edit/Delete/History) via ActionDropdown
 *
 * columns: [{ key, label, render(row), className, hideOnMobile }]
 */
export default function AppDataTable({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  searchableKeys,
  search = '',
  onSearchChange,
  searchPlaceholder = 'Cari data...',
  filters,
  actions,
  title,
  description,
  bulkActions,
  clientPagination = false,
  clientPageSize = 10,
  page,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  meta,
  onRowClick,
  selectedKeys = [],
  onToggleSelect,
  density = 'comfortable',
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionOnClick,
  onView,
  onEdit,
  onDelete,
  onHistory,
  extraActions,
  toolbarClassName = '',
  className = '',
}) {
  const [internalSearch, setInternalSearch] = useState(search)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [clientPage, setClientPage] = useState(1)

  const searchValue = onSearchChange ? search : internalSearch

  useEffect(() => {
    setInternalSearch(search)
  }, [search])

  useEffect(() => {
    if (clientPagination) setClientPage(1)
  }, [clientPagination, searchValue, sortKey, sortDir])

  const handleSearch = (e) => {
    const value = e.target.value
    setInternalSearch(value)
    onSearchChange?.(value)
  }

  const filteredData = useMemo(() => {
    if (!searchValue) return data
    const keys = searchableKeys || columns.map((c) => c.key).filter(Boolean)
    const term = searchValue.toLowerCase()
    return data.filter((row) =>
      keys.some((key) => {
        const val = row?.[key]
        if (val === null || val === undefined) return false
        return String(val).toLowerCase().includes(term)
      })
    )
  }, [data, searchValue, searchableKeys, columns])

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData
    const dir = sortDir === 'asc' ? 1 : -1
    return [...filteredData].sort((a, b) => {
      const av = a?.[sortKey]
      const bv = b?.[sortKey]
      if (av === bv) return 0
      if (av === null || av === undefined) return 1
      if (bv === null || bv === undefined) return -1
      return String(av).localeCompare(String(bv), 'id', { numeric: true }) * dir
    })
  }, [filteredData, sortKey, sortDir])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const hasActionColumn = Boolean(onView || onEdit || onDelete || onHistory || extraActions)
  const rowPadding = density === 'compact' ? 'px-4 py-2.5' : 'px-5 py-4'
  const hasFilters = Boolean(filters)
  const resolvedBulkActions = typeof bulkActions === 'function' ? bulkActions(selectedKeys) : bulkActions
  const clientTotalPages = Math.max(1, Math.ceil(sortedData.length / clientPageSize))
  const resolvedClientPage = Math.min(clientPage, clientTotalPages)
  const visibleData = clientPagination
    ? sortedData.slice((resolvedClientPage - 1) * clientPageSize, resolvedClientPage * clientPageSize)
    : sortedData

  return (
    <div className={cn('overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1B2433]', className)}>
      {/* Toolbar: search + filter + action */}
      {(onSearchChange || search !== undefined || hasFilters || actions) && (
        <div className={cn('flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800', toolbarClassName)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {(title || description) && (
              <div className="min-w-0">
                {title && <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>}
                {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
              </div>
            )}
            <div className="flex flex-1 items-center gap-3 sm:justify-end">
              <AppSearch
                value={searchValue}
                onChange={handleSearch}
                placeholder={searchPlaceholder}
                size="sm"
              />
              {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </div>
          </div>
          {hasFilters && <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">{filters}</div>}
          {selectedKeys.length > 0 && resolvedBulkActions && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-emerald-50/70 p-2 dark:bg-emerald-950/30">
              <span className="mr-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {selectedKeys.length} dipilih
              </span>
              {resolvedBulkActions}
            </div>
          )}
        </div>
      )}

      {/* Body states */}
      {isLoading ? (
        <div className="p-4">
          <AppSkeleton variant="table" rows={6} cols={columns.length} />
        </div>
      ) : isError ? (
        <div className="p-4">
          <AppErrorState title="Data Gagal Dimuat" description={errorMessage} onRetry={onRetry} compact />
        </div>
      ) : sortedData.length === 0 ? (
        <AppEmptyState
          title={emptyTitle || 'Data Tidak Ditemukan'}
          description={emptyDescription || 'Belum ada data yang sesuai dengan kriteria.'}
          actionLabel={emptyActionLabel}
          onAction={emptyActionOnClick}
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {onToggleSelect && (
                  <TableHead className="w-10 px-4">
                    <input
                      type="checkbox"
                      aria-label="Pilih semua"
                      checked={selectedKeys.length > 0 && selectedKeys.length === visibleData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onToggleSelect?.(visibleData.map((row) => row[keyField]))
                        } else {
                          onToggleSelect?.([])
                        }
                      }}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#0E5C44]"
                    />
                  </TableHead>
                )}
                {columns.map((col) => (
                  <TableHead key={col.key || col.label} className={cn('whitespace-nowrap', col.hideOnMobile && 'hidden lg:table-cell')}>
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1 uppercase tracking-wider transition hover:text-[#0E5C44] dark:hover:text-[#3FBF75]"
                      >
                        {col.label}
                        <ChevronsUpDown className={cn('h-3 w-3', sortKey === col.key ? 'text-[#0E5C44] dark:text-[#3FBF75]' : 'text-slate-300')} />
                      </button>
                    ) : (
                      col.label
                    )}
                  </TableHead>
                ))}
                {hasActionColumn && (
                  <TableHead className="sticky right-0 z-10 whitespace-nowrap bg-inherit text-right" style={{ background: 'inherit' }}>
                    <span className="sr-only">Aksi</span>
                    <ChevronDown className="h-3 w-3 opacity-0" />
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleData.map((row, rowIdx) => {
                const rowKey = row?.[keyField] ?? rowIdx
                const selected = selectedKeys.includes(rowKey)
                return (
                  <TableRow
                    key={rowKey}
                    data-state={selected ? 'selected' : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(onRowClick && 'cursor-pointer')}
                  >
                    {onToggleSelect && (
                      <TableCell className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Pilih ${rowKey}`}
                          checked={selected}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...new Set([...selectedKeys, rowKey])]
                              : selectedKeys.filter((k) => k !== rowKey)
                            onToggleSelect?.(next)
                          }}
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#0E5C44]"
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key || col.label} className={cn(rowPadding, 'whitespace-nowrap', col.hideOnMobile && 'hidden lg:table-cell')}>
                        {col.render ? col.render(row, rowIdx) : row?.[col.key] ?? '—'}
                      </TableCell>
                    ))}
                    {hasActionColumn && (
                      <TableCell className={cn('sticky right-0 z-10', rowPadding)} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {extraActions?.({ row, rowIdx })}
                          {hasActionColumn && (
                            <ActionDropdown
                              onView={onView ? () => onView(row) : undefined}
                              onEdit={onEdit ? () => onEdit(row) : undefined}
                              onDelete={onDelete ? () => onDelete(row) : undefined}
                              onHistory={onHistory ? () => onHistory(row) : undefined}
                            />
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && sortedData.length > 0 && (
        <div className="px-4 pb-4 pt-3">
          <AppPagination
            currentPage={clientPagination ? resolvedClientPage : page}
            totalPages={clientPagination ? clientTotalPages : totalPages}
            totalItems={clientPagination ? sortedData.length : totalItems}
            itemsPerPage={clientPagination ? clientPageSize : itemsPerPage}
            onPageChange={clientPagination ? setClientPage : onPageChange}
            meta={meta}
          />
        </div>
      )}
    </div>
  )
}
