import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorState({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kesalahan koneksi atau pengolahan data.',
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/50 mb-3">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E5C44] text-white text-xs font-semibold hover:bg-[#1E8E5A] transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  )
}
