import React from 'react'
import { FolderOpen } from 'lucide-react'

export default function EmptyState({
  title = 'Belum Ada Data',
  message = 'Tidak ada data yang dapat ditampilkan untuk kriteria atau periode ini.',
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
        <FolderOpen className="h-7 w-7" />
      </div>
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
