import React from 'react'
import {
  Pencil as FaEdit,
  Trash2 as FaTrash,
  RotateCcw as FaRedo,
  Eye as FaEye,
  Network as FaSitemap,
  LockOpen as FaLockOpen,
  Lock as FaLock,
} from 'lucide-react'

export default function JabatanTable({
  data = [],
  isLoading = false,
  onDetail,
  onEdit,
  onDelete,
  onRestore,
}) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm" aria-busy="true" aria-label="Memuat data jabatan">
        <div className="grid grid-cols-4 gap-5 bg-slate-50/80 px-5 py-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-3 animate-pulse rounded bg-slate-200" />)}
        </div>
        <div className="space-y-0 divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="grid grid-cols-4 items-center gap-5 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-3 animate-pulse rounded bg-slate-100" />
              <div className="h-3 animate-pulse rounded bg-slate-100" />
              <div className="h-8 w-28 justify-self-end animate-pulse rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-800">
          <FaSitemap className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-800">Jabatan tidak ditemukan</p>
        <p className="mt-1 text-xs text-slate-500">
          Coba sesuaikan kata kunci pencarian atau kriteria filter yang diterapkan.
        </p>
      </div>
    )
  }

  return (
    <section className="w-full overflow-hidden rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-labelledby="jabatan-table-title">
      <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-700">
        <div><h2 id="jabatan-table-title" className="text-base font-bold text-slate-900 dark:text-white">Daftar Jabatan</h2><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Struktur jabatan sesuai filter dan kewenangan pengguna.</p></div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{data.length} data</span>
      </div>
      <div className="overflow-hidden">
      <table className="w-full table-fixed text-left text-sm text-slate-600" aria-label="Daftar jabatan">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
            <th className="w-[5%] px-2 py-3 text-center">No</th>
            <th className="w-[19%] px-3 py-3">Identitas Jabatan</th>
            <th className="hidden w-[15%] px-3 py-3 md:table-cell">Unit & Level</th>
            <th className="hidden w-[13%] px-3 py-3 lg:table-cell">Atasan Langsung</th>
            <th className="hidden w-[15%] px-3 py-3 text-center xl:table-cell">Akses</th>
            <th className="hidden w-[13%] px-3 py-3 text-center sm:table-cell">Status</th>
            <th className="w-[20%] px-2 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {data.map((item, index) => {
            const isTrashed = item.terhapus
            return (
              <tr
                key={item.id}
                className={`ui-row transition-colors hover:bg-emerald-50/40 ${
                  isTrashed ? 'bg-rose-50/40 opacity-75' : ''
                }`}
                style={{ animationDelay: `${Math.min(index * 35, 280)}ms` }}
              >
                {/* No & Urutan */}
                <td className="px-2 py-3 text-center text-xs font-bold text-slate-400">
                  {item.urutan ?? index + 1}
                </td>

                {/* Kode & Nama Jabatan */}
                <td className="px-3 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800">
                      <FaSitemap className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2 font-bold text-slate-800">
                        <span className="truncate text-xs dark:text-white">{item.nama_jabatan || item.name}</span>
                        {isTrashed && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 rounded">
                            Terhapus
                          </span>
                        )}
                      </div>
                      <span className="block truncate font-mono text-[9px] text-slate-500">
                        {item.kode_jabatan || item.code}
                      </span>
                      <span className="mt-0.5 block truncate text-[9px] text-slate-400 md:hidden">Level {item.level_jabatan} · {item.satuan_kerja || 'Belum ditentukan'}</span>
                      <span className="mt-0.5 block text-[9px] font-bold text-emerald-700">{item.jumlah_pegawai ?? 0} pegawai</span>
                    </div>
                  </div>
                </td>

                {/* Level & Unit Sekolah */}
                <td className="hidden px-3 py-3 md:table-cell">
                  <div className="space-y-1">
	                    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
	                      Level {item.level_jabatan}: {item.level_label}
	                    </span>
	                    <p className="text-xs font-bold text-emerald-800">{item.satuan_kerja || 'Belum ditentukan'}</p>
	                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.unit_sekolah ? (
                        <span className="font-medium text-slate-700">
                          {item.unit_sekolah.nama} ({item.unit_sekolah.kode})
                        </span>
                      ) : (
	                        <span className="italic text-slate-400">{item.scope_akses_label || 'Cakupan belum ditentukan'}</span>
                      )}
                    </p>
                  </div>
                </td>

                {/* Atasan Langsung */}
                <td className="hidden px-3 py-3 text-xs lg:table-cell">
                  {item.atasan_langsung ? (
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {item.atasan_langsung.nama_jabatan}
                      <span className="block text-[11px] text-slate-500 font-mono">
                        ({item.atasan_langsung.kode_jabatan})
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Pimpinan Tertinggi</span>
                  )}
                </td>

                {/* Struktur & Login */}
                <td className="hidden px-3 py-3 xl:table-cell">
                  <div className="mx-auto flex max-w-28 flex-col items-stretch gap-1.5">
                    {/* Tampil Struktur */}
                    <span
                      className={`inline-flex min-h-7 items-center gap-1.5 rounded-lg border px-2 text-[10px] font-semibold leading-none ${
                        item.tampil_struktur
                          ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                      title="Visibilitas Bagan Struktur Organisasi"
                    >
                      <FaSitemap className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.tampil_struktur ? 'Struktur' : 'Sembunyi'}</span>
                    </span>

                    {/* Boleh Login */}
                    <span
                      className={`inline-flex min-h-7 items-center gap-1.5 rounded-lg border px-2 text-[10px] font-semibold leading-none ${
                        item.boleh_login
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}
                      title="Hak Akses Login Akun Sistem"
                    >
                      {item.boleh_login ? <FaLockOpen className="h-3.5 w-3.5 shrink-0" /> : <FaLock className="h-3.5 w-3.5 shrink-0" />}
                      <span className="truncate">{item.boleh_login ? 'Login' : 'Non-Login'}</span>
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="hidden px-3 py-3 text-center sm:table-cell">
                  <span
                    className={`inline-flex min-h-7 min-w-18 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-2 text-[10px] font-bold ${
                      item.status === 'Aktif' || item.is_active
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        item.status === 'Aktif' || item.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {item.status || (item.is_active ? 'Aktif' : 'Nonaktif')}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-2 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onDetail(item)}
                      className="ui-button flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      title={`Lihat detail ${item.nama_jabatan || item.name}`}
                      aria-label={`Lihat detail ${item.nama_jabatan || item.name}`}
                    >
                      <FaEye className="h-4 w-4" strokeWidth={2.5} />
                    </button>

                    {!isTrashed ? (
                      <>
                        <button
                          onClick={() => onEdit(item)}
                          className="ui-button hidden h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 sm:flex"
                          title={`Edit ${item.nama_jabatan || item.name}`}
                          aria-label={`Edit ${item.nama_jabatan || item.name}`}
                        >
                          <FaEdit className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="ui-button hidden h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 sm:flex"
                          title={`Hapus ${item.nama_jabatan || item.name}`}
                          aria-label={`Hapus ${item.nama_jabatan || item.name}`}
                        >
                          <FaTrash className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onRestore(item)}
                        className="ui-button flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        title={`Pulihkan ${item.nama_jabatan || item.name}`}
                        aria-label={`Pulihkan ${item.nama_jabatan || item.name}`}
                      >
                        <FaRedo className="h-4 w-4" strokeWidth={2.5} />
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
    </section>
  )
}
