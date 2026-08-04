import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Archive,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  Upload,
  X,
} from 'lucide-react'
import { tahunAjaranService } from '../services/tahunAjaranService'
import TahunAjaranTable from '../components/tahun-ajaran/TahunAjaranTable'
import TahunAjaranFormModal from '../components/tahun-ajaran/TahunAjaranFormModal'
import TahunAjaranDetailModal from '../components/tahun-ajaran/TahunAjaranDetailModal'
import TahunAjaranImportModal from '../components/tahun-ajaran/TahunAjaranImportModal'
import {
  MasterActionButton,
  MasterDataPage,
  MasterDeleteDialog,
  MasterErrorState,
  MasterPageHeader,
  MasterStatCard,
  MasterStatsGrid,
} from '../components/master-data'

const cardClass = 'rounded-[var(--master-card-radius,18px)] border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1B2433]'

export default function MasterTahunAjaranPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')
  const [denganSampahFilter, setDenganSampahFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedForEdit, setSelectedForEdit] = useState(null)
  const [selectedForDetail, setSelectedForDetail] = useState(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [notifications, setNotifications] = useState([])
  const perPage = 15

  const query = useQuery({
    queryKey: ['tahun-ajaran-list', page, perPage, search, selectedStatusFilter, denganSampahFilter],
    queryFn: () => tahunAjaranService.getDaftar({
      page,
      per_page: perPage,
      search,
      status: selectedStatusFilter,
      dengan_sampah: denganSampahFilter,
      order_by: 'start_date',
      order_dir: 'desc',
    }),
  })
  const listData = query.data?.data || []
  const meta = query.data?.meta || {}
  const stats = query.data?.statistik || {}

  const notify = (title, message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setNotifications((items) => [...items, { id, title, message, tone }])
    window.setTimeout(() => setNotifications((items) => items.filter((item) => item.id !== id)), 5500)
  }
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tahun-ajaran-list'] })
  const apiError = (err, fallback) => notify('Terjadi Kesalahan', err?.response?.data?.message || fallback, 'danger')

  const simpanMutation = useMutation({
    mutationFn: tahunAjaranService.tambah,
    onSuccess: (res) => {
      invalidate()
      setIsFormModalOpen(false)
      notify('Berhasil Disimpan', res?.message || 'Tahun ajaran baru berhasil ditambahkan.')
    },
    onError: (err) => apiError(err, 'Gagal menyimpan data tahun ajaran.'),
  })
  const ubahMutation = useMutation({
    mutationFn: tahunAjaranService.ubah,
    onSuccess: (res) => {
      invalidate()
      setIsFormModalOpen(false)
      setSelectedForEdit(null)
      notify('Berhasil Diubah', res?.message || 'Perubahan tahun ajaran berhasil disimpan.')
    },
    onError: (err) => apiError(err, 'Gagal memperbarui data tahun ajaran.'),
  })
  const setAktifMutation = useMutation({
    mutationFn: tahunAjaranService.setAktif,
    onSuccess: (res) => {
      invalidate()
      notify('Periode Aktif Diperbarui', res?.message || 'Tahun ajaran berhasil dijadikan periode aktif.')
    },
    onError: (err) => apiError(err, 'Gagal mengaktifkan tahun ajaran.'),
  })
  const hapusMutation = useMutation({
    mutationFn: tahunAjaranService.hapus,
    onSuccess: (res) => {
      invalidate()
      setDeleteTarget(null)
      notify('Berhasil Dihapus', res?.message || 'Tahun ajaran berhasil dihapus.', 'danger')
    },
    onError: (err) => apiError(err, 'Gagal menghapus data tahun ajaran.'),
  })
  const pulihkanMutation = useMutation({
    mutationFn: tahunAjaranService.pulihkan,
    onSuccess: (res) => {
      invalidate()
      notify('Berhasil Dipulihkan', res?.message || 'Tahun ajaran berhasil dipulihkan.')
    },
    onError: (err) => apiError(err, 'Gagal memulihkan data tahun ajaran.'),
  })
  const importMutation = useMutation({
    mutationFn: tahunAjaranService.prosesImport,
    onSuccess: (res, rows) => {
      invalidate()
      setIsImportModalOpen(false)
      notify('Impor Selesai', res?.message || `${rows.length} baris tahun ajaran berhasil diproses.`)
    },
    onError: (err) => apiError(err, 'Gagal memproses impor data.'),
  })

  const activeCount = stats.aktif ?? listData.filter((item) => item.is_active && !item.deleted_at).length
  const inactiveCount = stats.tidak_aktif ?? Math.max((stats.total ?? meta.total ?? listData.length) - activeCount, 0)
  const deletedCount = listData.filter((item) => item.deleted_at).length
  const total = stats.total ?? meta.total ?? listData.length
  const activeItem = listData.find((item) => item.is_active)

  const openAdd = () => {
    setSelectedForEdit(null)
    setIsFormModalOpen(true)
    setShowMobileActions(false)
  }
  const resetFilters = () => {
    setSearch('')
    setSelectedStatusFilter('')
    setDenganSampahFilter('')
    setPage(1)
  }
  const exportCsv = async () => {
    try {
      const rows = await tahunAjaranService.ekspor({ search, status: selectedStatusFilter })
      if (!rows?.length) {
        notify('Tidak Ada Data', 'Tidak ada data sesuai filter yang dapat diekspor.', 'warning')
        return
      }
      const headers = ['NO', 'NAMA TAHUN AJARAN', 'TANGGAL MULAI', 'TANGGAL SELESAI', 'STATUS AKTIF', 'KETERANGAN', 'TANGGAL DIBUAT']
      const csv = [headers, ...rows.map((row) => [
        row.no, row.nama, row.start_date, row.end_date, row.is_active, row.keterangan || '', row.created_at,
      ])].map((line) => line.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `tahun_ajaran_${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
      setShowExportModal(false)
      notify('Ekspor Berhasil', `${rows.length} data tahun ajaran berhasil diunduh sebagai CSV.`)
    } catch (err) {
      apiError(err, 'Gagal menyiapkan berkas ekspor.')
    }
  }

  return (
    <MasterDataPage className="education-unit-page academic-year-page" hideBreadcrumb>
      <MasterPageHeader
        title="Master Tahun Ajaran"
        description="Kelola periode akademik, rentang tanggal, dan tahun ajaran aktif sekolah."
        tone="brand"
        icon={CalendarDays}
        actions={<MasterActionButton className="education-unit-hero__action !h-11 !border-white !bg-white !text-emerald-800 !shadow-none hover:!bg-emerald-50" icon={Plus} onClick={openAdd}>Tambah Tahun Ajaran</MasterActionButton>}
      />

      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={CalendarDays} label="Total Periode" value={total} description="Tersimpan di sistem" variant="success" delay={40} />
        <MasterStatCard icon={Star} label="Periode Aktif" value={activeCount} description={activeItem?.name || 'Belum ada periode aktif'} variant="info" delay={80} />
        <MasterStatCard icon={Archive} label="Tidak Aktif" value={inactiveCount} description="Periode lampau atau mendatang" variant="warning" delay={120} />
        <MasterStatCard icon={RotateCcw} label="Data Terhapus" value={deletedCount} description="Pada halaman dan filter aktif" variant="neutral" delay={160} />
      </MasterStatsGrid>

      <section className={`${cardClass} p-4`} aria-label="Pencarian dan filter tahun ajaran">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Cari tahun ajaran</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="search" value={search} placeholder="Cari nama tahun ajaran..." onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100" />
          </label>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <MasterActionButton className="!h-11 !px-3.5" variant="import" icon={Upload} onClick={() => setIsImportModalOpen(true)}>Import</MasterActionButton>
            <MasterActionButton className="!h-11 !px-3.5" variant="export" icon={FileSpreadsheet} onClick={() => setShowExportModal(true)}>Export</MasterActionButton>
            <MasterActionButton className="!h-11 !px-3.5" icon={Plus} onClick={openAdd}>Tambah</MasterActionButton>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:text-slate-300"><SlidersHorizontal className="h-4 w-4 text-emerald-700" /> Filter</span>
          <select aria-label="Filter status periode" value={selectedStatusFilter} onChange={(e) => { setSelectedStatusFilter(e.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
            <option value="">Semua Status</option><option value="true">Aktif Utama</option><option value="false">Tidak Aktif</option>
          </select>
          <select aria-label="Filter cakupan data" value={denganSampahFilter} onChange={(e) => { setDenganSampahFilter(e.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
            <option value="">Data Aktif</option><option value="true">Termasuk Terhapus</option>
          </select>
          <button type="button" onClick={resetFilters} className="h-11 shrink-0 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">Reset</button>
          <button type="button" onClick={() => query.refetch()} title="Muat ulang" aria-label="Muat ulang data" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-300"><RefreshCcw className={`h-4 w-4 ${query.isFetching ? 'animate-spin' : ''}`} /></button>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className={`${cardClass} overflow-hidden`} aria-labelledby="academic-year-table-title">
          <header className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-700">
            <div><h2 id="academic-year-table-title" className="text-base font-bold text-slate-900 dark:text-white">Daftar Tahun Ajaran</h2><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Periode akademik sesuai filter aktif.</p></div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{total} periode</span>
          </header>
          {query.isError ? <div className="p-5"><MasterErrorState onRetry={query.refetch} /></div> : (
            <TahunAjaranTable
              data={listData} isLoading={query.isLoading || query.isFetching} page={page} perPage={perPage}
              onDetail={setSelectedForDetail}
              onEdit={(item) => { setSelectedForEdit(item); setIsFormModalOpen(true) }}
              onSetAktif={(item) => setAktifMutation.mutate(item.id)}
              onDelete={setDeleteTarget}
              onRestore={(item) => pulihkanMutation.mutate(item.id)}
            />
          )}
          {meta.total > 0 && <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700"><span>Menampilkan <b>{meta.from || 0}</b>–<b>{meta.to || 0}</b> dari <b>{meta.total || 0}</b> data</span><div className="flex items-center gap-2"><button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-9 rounded-lg border border-slate-200 px-3 disabled:opacity-40 dark:border-slate-700">Sebelumnya</button><span className="rounded-lg bg-emerald-800 px-3 py-2 font-bold text-white">{page} / {meta.last_page || 1}</span><button disabled={page >= (meta.last_page || 1)} onClick={() => setPage((p) => p + 1)} className="h-9 rounded-lg border border-slate-200 px-3 disabled:opacity-40 dark:border-slate-700">Selanjutnya</button></div></footer>}
        </section>

        <aside className="space-y-4 xl:sticky xl:top-5">
          <section className={`${cardClass} p-5`}>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Periode</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Mengikuti data dan filter aktif</p>
            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-700">
              {[['Total Periode', total, CalendarDays], ['Periode Aktif', activeCount, CheckCircle2], ['Tidak Aktif', inactiveCount, Archive], ['Data Terhapus', deletedCount, RotateCcw]].map(([label, value, Icon]) => <div key={label} className="flex items-center gap-3 py-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50"><Icon className="h-4 w-4" /></span><span className="flex-1 text-[11px] font-semibold text-slate-500 dark:text-slate-300">{label}</span><strong className="text-sm tabular-nums text-slate-900 dark:text-white">{value}</strong></div>)}
            </div>
          </section>
          <section className={`${cardClass} p-5`}>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Aksi Cepat</h2>
            <div className="mt-3 grid gap-2">
              {[
                ['Tambah Tahun Ajaran', Plus, openAdd],
                ['Import Data', Upload, () => setIsImportModalOpen(true)],
                ['Export CSV', FileSpreadsheet, () => setShowExportModal(true)],
                ['Lihat Statistik', BarChart3, () => setShowStatisticsModal(true)],
              ].map(([label, Icon, action]) => <button key={label} type="button" onClick={action} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-left text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-emerald-950/40"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50"><Icon className="h-4 w-4" /></span>{label}</button>)}
            </div>
          </section>
        </aside>
      </div>

      <button type="button" onClick={() => setShowMobileActions(true)} aria-label="Buka aksi tahun ajaran" className="fixed bottom-22 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-800 text-white shadow-xl lg:hidden"><Plus className="h-6 w-6" /></button>
      {showMobileActions && <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 lg:hidden" role="dialog" aria-modal="true" aria-label="Aksi tahun ajaran" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowMobileActions(false) }}><section className="w-full rounded-t-3xl bg-white p-5 pb-8 dark:bg-[#1B2433]"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold dark:text-white">Aksi Tahun Ajaran</h2><button onClick={() => setShowMobileActions(false)} aria-label="Tutup aksi"><X /></button></div><div className="grid grid-cols-2 gap-3">{[['Tambah', Plus, openAdd], ['Import', Upload, () => { setShowMobileActions(false); setIsImportModalOpen(true) }], ['Export', FileSpreadsheet, () => { setShowMobileActions(false); setShowExportModal(true) }], ['Statistik', BarChart3, () => { setShowMobileActions(false); setShowStatisticsModal(true) }]].map(([label, Icon, action]) => <button key={label} onClick={action} className="flex min-h-14 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold dark:border-slate-700 dark:text-white"><Icon className="h-4 w-4 text-emerald-700" />{label}</button>)}</div></section></div>}

      {showStatisticsModal && <SimpleModal title="Statistik Tahun Ajaran" description="Ringkasan berdasarkan filter yang sedang aktif." onClose={() => setShowStatisticsModal(false)} icon={BarChart3}><div className="grid gap-3 p-5 sm:grid-cols-2">{[['Total Periode', total], ['Periode Aktif', activeCount], ['Tidak Aktif', inactiveCount], ['Data Terhapus', deletedCount]].map(([label, value]) => <article key={label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><strong className="text-2xl font-black text-slate-900 dark:text-white">{value}</strong><span className="block text-xs text-slate-500">{label}</span><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${total ? Math.min(100, Math.round((value / total) * 100)) : 0}%` }} /></div></article>)}</div></SimpleModal>}
      {showExportModal && <SimpleModal title="Export Tahun Ajaran" description="Format yang didukung oleh modul saat ini adalah CSV." onClose={() => setShowExportModal(false)} icon={FileText}><div className="p-5"><button type="button" className="flex w-full items-center gap-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 p-4 text-left dark:bg-emerald-950/30" onClick={exportCsv}><FileSpreadsheet className="h-6 w-6 text-emerald-700" /><span><b className="block text-sm dark:text-white">CSV (.csv)</b><small className="text-slate-500">Data mengikuti pencarian dan filter status aktif.</small></span></button></div><footer className="flex justify-end gap-2 border-t border-slate-100 p-4 dark:border-slate-700"><button onClick={() => setShowExportModal(false)} className="h-11 rounded-xl border border-slate-200 px-4 text-xs font-semibold dark:border-slate-700 dark:text-white">Batal</button><button onClick={exportCsv} className="h-11 rounded-xl bg-emerald-800 px-5 text-xs font-semibold text-white">Export CSV</button></footer></SimpleModal>}

      <MasterDeleteDialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={() => hapusMutation.mutate(deleteTarget.id)} isLoading={hapusMutation.isPending} title={`Hapus tahun ajaran ${deleteTarget?.name || ''}?`} description="Data akan dipindahkan ke arsip dan dapat dipulihkan kembali." />
      <TahunAjaranFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSubmit={(payload) => selectedForEdit ? ubahMutation.mutate({ id: selectedForEdit.id, payload }) : simpanMutation.mutate(payload)} initialData={selectedForEdit} isSubmitting={simpanMutation.isPending || ubahMutation.isPending} />
      <TahunAjaranDetailModal isOpen={Boolean(selectedForDetail)} onClose={() => setSelectedForDetail(null)} data={selectedForDetail} />
      <TahunAjaranImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={(rows) => importMutation.mutate(rows)} isSubmitting={importMutation.isPending} />

      <div className="fixed bottom-5 right-4 z-60 grid w-[min(24rem,calc(100vw-2rem))] gap-2" aria-live="polite">
        {notifications.map((item) => <div key={item.id} className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl dark:bg-[#1B2433] ${item.tone === 'danger' ? 'border-rose-200' : item.tone === 'warning' ? 'border-amber-200' : 'border-emerald-200'}`}><CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${item.tone === 'danger' ? 'text-rose-600' : item.tone === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`} /><div className="min-w-0 flex-1"><b className="text-sm text-slate-900 dark:text-white">{item.title}</b><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-300">{item.message}</p></div><button onClick={() => setNotifications((items) => items.filter((n) => n.id !== item.id))} aria-label="Tutup notifikasi"><X className="h-4 w-4 text-slate-400" /></button></div>)}
      </div>
    </MasterDataPage>
  )
}

function SimpleModal({ title, description, icon: Icon, onClose, children }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}><section className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]"><header className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-700"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50"><Icon className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-900 dark:text-white">{title}</h2><p className="text-xs text-slate-500">{description}</p></div></div><button onClick={onClose} aria-label={`Tutup ${title}`} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button></header>{children}</section></div>
}
