import React from 'react'
import { Eye, Pencil, Trash2, History, MoreVertical } from 'lucide-react'
import { Dropdown } from '../ui/dropdown'

/**
 * ActionDropdown - canonical aksi baris tabel.
 * Preset: view, edit, delete, history. Bisa dikombinasi dengan aksi kustom.
 */
export default function ActionDropdown({
  onView,
  onEdit,
  onDelete,
  onHistory,
  extraItems = [],
  trigger,
  align = 'right',
}) {
  const items = [
    ...(onView ? [{ label: 'Lihat Data', icon: <Eye className="h-4 w-4 text-sky-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors shrink-0" />, onClick: onView }] : []),
    ...(onEdit ? [{ label: 'Edit Data', icon: <Pencil className="h-4 w-4 text-amber-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors shrink-0" />, onClick: onEdit }] : []),
    ...(onHistory ? [{ label: 'Riwayat', icon: <History className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors shrink-0" />, onClick: onHistory }] : []),
    ...extraItems,
    ...(onDelete ? [{ divider: true }, { label: 'Hapus', icon: <Trash2 className="h-4 w-4 text-rose-500 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors shrink-0" />, onClick: onDelete, danger: true }] : []),
  ]

  if (items.length === 0) return null

  const defaultTrigger = (
    <button
      type="button"
      aria-label="Aksi"
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-xs hover:border-emerald-600/40 hover:bg-emerald-50/60 hover:text-emerald-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700/20 dark:border-slate-700/80 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
    >
      <MoreVertical className="h-4 w-4 shrink-0" />
    </button>
  )

  return <Dropdown trigger={trigger || defaultTrigger} items={items} align={align} />
}
