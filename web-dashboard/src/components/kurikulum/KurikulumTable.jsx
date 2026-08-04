import React from 'react'
import {
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  BookOpen,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Tag,
} from 'lucide-react'

export default function KurikulumTable({
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
      <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-100 p-12 text-center shadow-xs">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 mb-4 border border-emerald-100">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Data Master Kurikulum Tidak Ditemukan</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Belum ada data kurikulum yang tersimpan atau data yang Anda cari tidak cocok dengan filter.
        </p>
      </div>
    )
  }

  const getJenisBadgeColor = (jenis) => {
    switch (jenis) {
      case 'SIT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Merdeka':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Nasional':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'Pesantren':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Lokal':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="bg-white dark:bg-[#1B2433] rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F4EB] dark:bg-slate-900/80 text-gray-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-800">
              <th className="py-4 px-4 w-12 text-center">NO</th>
              <th className="py-4 px-4 w-14 text-center">LOGO</th>
              <th className="py-4 px-4">KODE & NAMA KURIKULUM</th>
              <th className="py-4 px-4">JENIS & JENJANG</th>
              <th className="py-4 px-4">UNIT & TAHUN AJARAN</th>
              <th className="py-4 px-4 text-center">STATUS</th>
              <th className="py-4 px-4 text-center w-36">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs font-medium">
            {data.map((item, idx) => {
              const rowNumber = (page - 1) * perPage + idx + 1
              const isTerhapus = !!item.deleted_at

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-emerald-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                    isTerhapus ? 'bg-rose-50/30 dark:bg-rose-950/20 opacity-75' : ''
                  }`}
                >
                  {/* No */}
                  <td className="py-4 px-4 text-center text-gray-500 dark:text-slate-400 font-bold">
                    {rowNumber}
                  </td>

                  {/* Logo Badge */}
                  <td className="py-4 px-4 text-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center shadow-xs mx-auto border border-emerald-700">
                      {(item.jenjang || 'SD').slice(0, 3)}
                    </div>
                  </td>

                  {/* Kode & Nama */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                        {item.nama_kurikulum}
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {item.kode_kurikulum}
                      </span>
                    </div>
                  </td>

                  {/* Jenis & Jenjang */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getJenisBadgeColor(
                          item.jenis_kurikulum
                        )}`}
                      >
                        <Tag className="w-3 h-3" />
                        {item.jenis_kurikulum}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase border border-slate-200 dark:border-slate-700">
                        {item.jenjang}
                      </span>
                    </div>
                  </td>

                  {/* Unit & Tahun Ajaran */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.unit_pendidikan_nama || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item.tahun_ajaran_nama || '-'}</span>
                      {item.semester_nama && <span>• {item.semester_nama}</span>}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    {isTerhapus ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Terhapus
                      </span>
                    ) : item.status ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Nonaktif
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      {/* Detail */}
                      <button
                        onClick={() => onDetail(item)}
                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900 transition-all border border-blue-100 dark:border-blue-900"
                        title="Detail Kurikulum"
                        aria-label="Detail Kurikulum"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {!isTerhapus ? (
                        <>
                          {/* Edit */}
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:hover:bg-amber-900 transition-all border border-amber-100 dark:border-amber-900"
                            title="Edit Kurikulum"
                            aria-label="Edit Kurikulum"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Hapus */}
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400 dark:hover:bg-rose-900 transition-all border border-rose-100 dark:border-rose-900"
                            title="Hapus Kurikulum"
                            aria-label="Hapus Kurikulum"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        /* Pulihkan */
                        <button
                          onClick={() => onRestore(item)}
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-900 transition-all border border-emerald-100 dark:border-emerald-900"
                          title="Pulihkan Kurikulum"
                          aria-label="Pulihkan Kurikulum"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
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
