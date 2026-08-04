import React from 'react'
import { CalendarDays, Pencil, School, UserRound, X } from 'lucide-react'
import { renderJenisUnitIcon } from './JenisUnitTable'

export default function JenisUnitDetailModal({ isOpen, onClose, data, onEdit }) {
  if (!isOpen || !data) return null

  const badgeColor = data.warna_badge || '#10B981'

  return (
    <div className="education-unit-popup ui-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="jenis-unit-detail-title">
      <div className="ui-modal flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#1B2433]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <School className="h-5 w-5" strokeWidth={2.25} />
            </div>
            <div>
              <h2 id="jenis-unit-detail-title" className="text-base font-bold text-slate-800 dark:text-white">Detail Jenis Unit Pendidikan</h2>
              <p className="text-xs text-slate-500">Informasi lengkap secara read-only.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup detail jenis unit"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>

        {/* Content Body */}
        <div className="min-h-0 space-y-5 overflow-y-auto p-5 text-sm text-gray-700">
          {/* Main Info Card */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-emerald-100 text-emerald-700">
                {renderJenisUnitIcon(data.icon, 'w-7 h-7')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-800 text-white uppercase">
                    {data.kode_jenis}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                    {data.jenjang}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-1">{data.nama_jenis}</h3>
                <p className="text-xs text-gray-500">Singkatan: {data.singkatan || '-'}</p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  data.status
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {data.status ? '• Aktif' : '• Tidak Aktif'}
              </span>
            </div>
          </div>

          {/* Details Table Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Urutan Tampilan</p>
              <p className="text-base font-bold text-gray-800 mt-0.5">{data.urutan}</p>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Warna Badge</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: badgeColor }}
                ></span>
                <span className="text-sm font-mono font-bold text-gray-700 uppercase">
                  {badgeColor}
                </span>
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-1">Keterangan / Deskripsi</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.keterangan || 'Tidak ada keterangan tambahan.'}
            </p>
          </div>

          {/* Audit Trail Info */}
          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                Tanggal Dibuat:
              </span>
              <span className="font-semibold text-gray-700">{data.created_at || '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5 text-gray-400" />
                Dibuat Oleh:
              </span>
              <span className="font-semibold text-gray-700">{data.created_by_name || 'Sistem'}</span>
            </div>
            {data.updated_at && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                  Terakhir Diubah:
                </span>
                <span className="font-semibold text-gray-700">{data.updated_at}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-[#1B2433]">
          {onEdit && (
            <button onClick={onEdit} className="ui-button inline-flex items-center gap-2 rounded-xl border border-emerald-700 px-5 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"><Pencil className="h-4 w-4" />Edit Data</button>
          )}
          <button
            onClick={onClose}
            className="ui-button rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-800/20 transition-all hover:bg-emerald-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
