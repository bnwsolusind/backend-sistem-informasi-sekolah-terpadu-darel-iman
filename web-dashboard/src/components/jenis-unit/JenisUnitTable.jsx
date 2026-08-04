import React from 'react'
import {
  Baby,
  BookOpen,
  Building2,
  Eye,
  GraduationCap,
  House,
  Landmark,
  Pencil,
  RotateCcw,
  School,
  Trash2,
  University,
} from 'lucide-react'

const ICON_MAP = {
  Building: Building2,
  School,
  Book: BookOpen,
  Mosque: Landmark,
  Graduation: GraduationCap,
  University,
  Children: Baby,
  Home: House,
}

// eslint-disable-next-line react/only-export-components -- helper ikon dipakai bersama modal terkait.
export function renderJenisUnitIcon(iconName, className = 'w-4 h-4') {
  const IconComp = ICON_MAP[iconName] || School
  return <IconComp className={className} strokeWidth={2.25} />
}

export default function JenisUnitTable({
  data = [],
  isLoading = false,
  page = 1,
  perPage = 15,
  onDetail,
  onEdit,
  onDelete,
  onRestore,
}) {
  if (isLoading) {
    return (
      <div className="ui-enter overflow-hidden border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-[#1B2433]" role="status" aria-label="Memuat data jenis unit pendidikan">
        <span className="sr-only">Memuat data jenis unit pendidikan...</span>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="grid grid-cols-[36px_minmax(0,1fr)_72px_44px] items-center gap-3 border-b border-slate-100 px-3 py-3 last:border-b-0 dark:border-slate-700 sm:grid-cols-[36px_minmax(0,1fr)_90px_116px]">
            <span className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-700" />
            <span className="flex items-center gap-3">
              <span className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />
              <span className="grid flex-1 gap-2"><span className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-700" /><span className="h-2.5 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-slate-700" /></span>
            </span>
            <span className="h-5 animate-pulse rounded-full bg-slate-100 dark:bg-slate-700" />
            <span className="h-9 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="ui-enter rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
          <School className="h-8 w-8" strokeWidth={2.25} />
        </div>
        <h3 className="text-base font-semibold text-gray-800">Data Tidak Ditemukan</h3>
        <p className="text-sm text-gray-500 mt-1">Belum ada data jenis unit pendidikan yang sesuai dengan kriteria.</p>
      </div>
    )
  }

  return (
    <div className="ui-enter overflow-hidden rounded-none border border-slate-200/80 bg-white shadow-none dark:border-slate-700 dark:bg-[#1B2433]" style={{ animationDelay: '250ms' }}>
      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <th className="w-[9%] px-2 py-3 text-center sm:w-[6%]">No</th>
              <th className="w-[51%] px-3 py-3 sm:w-[42%] xl:w-[33%]">Identitas Jenis Unit</th>
              <th className="hidden w-[14%] px-3 py-3 md:table-cell">Jenjang</th>
              <th className="hidden w-[14%] px-3 py-3 xl:table-cell">Visual</th>
              <th className="hidden w-[8%] px-2 py-3 text-center lg:table-cell">Urutan</th>
              <th className="w-[22%] px-2 py-3 text-center sm:w-[15%]">Status</th>
              <th className="w-[18%] px-2 py-3 text-center sm:w-[23%] xl:w-[20%]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {data.map((item, index) => {
              const rowNo = (page - 1) * perPage + index + 1
              const badgeColor = item.warna_badge || '#10B981'

              return (
                <tr
                  key={item.id || item.uuid}
                  className={`ui-row hover:bg-emerald-50/40 transition-colors ${
                    item.is_deleted ? 'bg-red-50/40 opacity-75' : ''
                  }`}
                  style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                >
                  <td className="px-2 py-3 text-center text-xs font-medium text-gray-500">{rowNo}</td>
                  <td className="px-3 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                        {renderJenisUnitIcon(item.icon, 'w-4 h-4')}
                      </span>
                      <span className="min-w-0">
                        <strong className="block truncate text-xs font-bold text-gray-900 dark:text-white" title={item.nama_jenis}>{item.nama_jenis}</strong>
                        <span className="mt-0.5 block truncate text-[10px] font-semibold text-emerald-800">{item.kode_jenis} · {item.singkatan || '-'}</span>
                        <small className="mt-0.5 block truncate text-[9px] text-slate-400 md:hidden">{item.jenjang} · Urutan {item.urutan}</small>
                        <small className="mt-0.5 hidden truncate text-[9px] text-slate-400 xl:block" title={item.keterangan}>{item.keterangan || 'Tanpa keterangan'}</small>
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 md:table-cell">
                    <span className="inline-flex max-w-full items-center truncate rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      {item.jenjang}
                    </span>
                  </td>
                  <td className="hidden px-3 py-3 xl:table-cell">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="inline-block h-4 w-4 shrink-0 rounded-full border border-gray-200 shadow-xs"
                        style={{ backgroundColor: badgeColor }}
                      />
                      <span className="truncate font-mono text-[9px] uppercase text-gray-500">{badgeColor}</span>
                    </div>
                  </td>
                  <td className="hidden px-2 py-3 text-center text-xs font-bold text-gray-700 lg:table-cell">{item.urutan}</td>
                  <td className="px-3 py-3 text-center">
                    {item.status ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        • Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                        • Tidak Aktif
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onDetail && onDetail(item)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/20 dark:border-blue-800/70 dark:bg-blue-950/40 dark:text-blue-300"
                        aria-label={`Lihat ${item.nama_jenis}`}
                        title="Detail"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                      {!item.is_deleted ? (
                        <>
                          <button
                            onClick={() => onEdit && onEdit(item)}
                            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-500/20 sm:flex dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-300"
                            aria-label={`Edit ${item.nama_jenis}`}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => onDelete && onDelete(item)}
                            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-rose-500/20 sm:flex dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-300"
                            aria-label={`Hapus ${item.nama_jenis}`}
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onRestore && onRestore(item)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-500/20 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300"
                          aria-label={`Pulihkan ${item.nama_jenis}`}
                          title="Pulihkan Data"
                        >
                          <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
