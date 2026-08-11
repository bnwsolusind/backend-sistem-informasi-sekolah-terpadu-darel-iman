import React from 'react'
import { Eye, Pencil, Trash2, History, MoreVertical } from 'lucide-react'
import { Dropdown } from '../ui/dropdown'
import IconButton from './IconButton'

/**
 * ActionDropdown - canonical aksi baris tabel.
 * Preset: view, edit, delete, history. Bisa dikombinasi dengan aksi kustom.
 *
 * Contoh:
 * <ActionDropdown
 *   onView={...}
 *   onEdit={...}
 *   onDelete={...}
 *   onHistory={...}
 *   extraItems={[{ label: 'Cetak', icon: <Printer/>, onClick: ... }]}
 * />
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
    ...(onView ? [{ label: 'Lihat Detail', icon: <Eye className="h-4 w-4 text-sky-500" />, onClick: onView }] : []),
    ...(onEdit ? [{ label: 'Edit Data', icon: <Pencil className="h-4 w-4 text-amber-500" />, onClick: onEdit }] : []),
    ...(onHistory ? [{ label: 'Riwayat', icon: <History className="h-4 w-4 text-slate-400" />, onClick: onHistory }] : []),
    ...extraItems,
    ...(onDelete ? [{ divider: true }, { label: 'Hapus', icon: <Trash2 className="h-4 w-4 text-rose-500" />, onClick: onDelete, danger: true }] : []),
  ]

  if (items.length === 0) return null

  const defaultTrigger = <IconButton label="Aksi lainnya" icon={MoreVertical} size="icon" />

  return <Dropdown trigger={trigger || defaultTrigger} items={items} align={align} />
}
