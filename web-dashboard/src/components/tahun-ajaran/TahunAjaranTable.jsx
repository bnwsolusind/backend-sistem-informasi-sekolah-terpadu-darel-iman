import { Archive, CalendarDays, Eye, LoaderCircle, Pencil, RotateCcw, Star, Trash2 } from 'lucide-react'
import { MasterEmptyState, MasterStatusBadge } from '../master-data'

export default function TahunAjaranTable({ data = [], isLoading, page = 1, perPage = 15, onDetail, onEdit, onSetAktif, onDelete, onRestore }) {
  if (isLoading) return <div className="space-y-3 p-5" aria-label="Memuat tahun ajaran">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />)}</div>
  if (!data.length) return <div className="p-5"><MasterEmptyState title="Tahun ajaran tidak ditemukan" description="Ubah pencarian atau filter, lalu coba kembali." /></div>
  return <div className="overflow-hidden">
    <table className="w-full table-fixed text-left text-xs text-slate-600 dark:text-slate-300" aria-label="Daftar tahun ajaran">
      <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-300"><tr>
        <th className="w-11 px-3 py-3 text-center">No</th><th className="px-3 py-3">Identitas Periode</th><th className="hidden w-1/4 px-3 py-3 md:table-cell">Rentang Tanggal</th><th className="hidden w-32 px-4 py-3 text-center sm:table-cell">Status</th><th className="w-28 px-4 py-3 text-center sm:w-48">Aksi</th>
      </tr></thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">{data.map((item, index) => {
        const deleted = Boolean(item.deleted_at)
        return <tr key={item.id} className={`${deleted ? 'bg-rose-50/40 dark:bg-rose-950/10' : item.is_active ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''} transition hover:bg-slate-50 dark:hover:bg-slate-800/50`}>
          <td className="px-3 py-3 text-center text-slate-400">{(page - 1) * perPage + index + 1}</td>
          <td className="px-3 py-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50"><CalendarDays className="h-5 w-5" /></span><span className="min-w-0"><strong className="block truncate text-sm text-slate-900 dark:text-white">{item.name}</strong><small className="mt-0.5 block truncate text-[10px] text-slate-400 md:hidden">{item.start_date || '-'} – {item.end_date || '-'}</small><small className="mt-0.5 block truncate text-[10px] text-slate-400">{item.keterangan || item.metadata?.keterangan || 'Tanpa keterangan'}</small></span></div></td>
          <td className="hidden px-3 py-3 md:table-cell"><strong className="block text-xs text-slate-800 dark:text-slate-100">{item.start_date || '-'}</strong><small className="text-[10px] text-slate-400">sampai {item.end_date || '-'}</small></td>
          <td className="hidden px-4 py-3 text-center sm:table-cell">{deleted ? <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700"><Archive className="h-3 w-3" />Terhapus</span> : <MasterStatusBadge active={item.is_active} activeLabel="Aktif" inactiveLabel="Nonaktif" />}</td>
          <td className="px-4 py-3"><div className="flex items-center justify-center gap-2">
            {deleted ? <Action label={`Pulihkan ${item.name}`} tone="restore" onClick={() => onRestore(item)} icon={RotateCcw} /> : <>
              {!item.is_active && <Action label={`Aktifkan ${item.name}`} tone="restore" onClick={() => onSetAktif(item)} icon={Star} />}
              <Action label={`Lihat detail ${item.name}`} tone="view" onClick={() => onDetail(item)} icon={Eye} />
              <Action extra="hidden sm:flex" label={`Edit ${item.name}`} tone="edit" onClick={() => onEdit(item)} icon={Pencil} />
              <Action extra="hidden sm:flex" label={`Hapus ${item.name}`} tone="delete" onClick={() => onDelete(item)} icon={Trash2} />
            </>}
          </div></td>
        </tr>
      })}</tbody>
    </table>
  </div>
}

function Action({ label, tone, icon: Icon = LoaderCircle, onClick, extra = '' }) {
  const styles = { view: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300', edit: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300', delete: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300', restore: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' }
  return <button type="button" title={label} aria-label={label} onClick={onClick} className={`${extra} flex h-9 w-9 items-center justify-center rounded-lg border transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-600/20 ${styles[tone]}`}><Icon className="h-4 w-4" strokeWidth={2.5} /></button>
}
