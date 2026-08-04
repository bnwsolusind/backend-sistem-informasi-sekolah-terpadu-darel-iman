import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import {
  BarChart3,
  CheckCircle2,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Menu,
  Plus,
  RefreshCcw,
  RotateCcw,
  School,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { jenisUnitService } from '../services/jenisUnitService'
import JenisUnitTable from '../components/jenis-unit/JenisUnitTable'
import JenisUnitFormModal from '../components/jenis-unit/JenisUnitFormModal'
import JenisUnitDetailModal from '../components/jenis-unit/JenisUnitDetailModal'
import JenisUnitImportModal from '../components/jenis-unit/JenisUnitImportModal'
import {
  MasterActionButton,
  MasterDataPage,
  MasterPageHeader,
  MasterStatCard,
  MasterStatsGrid,
} from '../components/master-data'

const JENJANG_LIST = ['PAUD', 'TK', 'SD', 'MI', 'SMP', 'MTs', 'SMA', 'MA', 'Pondok Pesantren', 'Mahad']

export default function MasterJenisUnitPendidikanPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')
  const [selectedJenjangFilter, setSelectedJenjangFilter] = useState('')
  const [denganSampahFilter, setDenganSampahFilter] = useState('')
  const [page, setPage] = useState(1)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedForEdit, setSelectedForEdit] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedForDetail, setSelectedForDetail] = useState(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)
  const [exportFormat, setExportFormat] = useState('xlsx')
  const [isExporting, setIsExporting] = useState(false)
  const [notifications, setNotifications] = useState([])
  const perPage = 15

  const pushNotification = (title, message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setNotifications((current) => [...current, { id, title, message, tone }])
    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id))
    }, 6000)
  }

  const {
    data: responseData = {},
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['jenis-unit-list', page, perPage, search, selectedStatusFilter, selectedJenjangFilter, denganSampahFilter],
    queryFn: () => jenisUnitService.getDaftar({
      page,
      per_page: perPage,
      search,
      status: selectedStatusFilter,
      jenjang: selectedJenjangFilter,
      dengan_sampah: denganSampahFilter,
      order_by: 'urutan',
      order_dir: 'asc',
    }),
  })

  const listData = responseData?.data || []
  const meta = responseData?.meta || {}
  const stats = responseData?.statistik || {}

  const simpanMutation = useMutation({
    mutationFn: (payload) => jenisUnitService.tambah(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['jenis-unit-list'] })
      setIsFormModalOpen(false)
      pushNotification('Berhasil Disimpan', res?.message || 'Jenis unit pendidikan berhasil ditambahkan.')
    },
    onError: (error) => Swal.fire('Gagal Menyimpan', error.response?.data?.message || 'Gagal menyimpan jenis unit pendidikan.', 'error'),
  })

  const ubahMutation = useMutation({
    mutationFn: ({ id, payload }) => jenisUnitService.ubah({ id, payload }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['jenis-unit-list'] })
      setIsFormModalOpen(false)
      setSelectedForEdit(null)
      pushNotification('Berhasil Diubah', res?.message || 'Jenis unit pendidikan berhasil diperbarui.')
    },
    onError: (error) => Swal.fire('Gagal Memperbarui', error.response?.data?.message || 'Gagal memperbarui jenis unit pendidikan.', 'error'),
  })

  const hapusMutation = useMutation({
    mutationFn: (id) => jenisUnitService.hapus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['jenis-unit-list'] })
      pushNotification('Berhasil Dihapus', res?.message || 'Jenis unit pendidikan berhasil dihapus.', 'danger')
    },
    onError: (error) => Swal.fire('Gagal Menghapus', error.response?.data?.message || 'Data yang sudah digunakan tidak dapat dihapus.', 'error'),
  })

  const pulihkanMutation = useMutation({
    mutationFn: (id) => jenisUnitService.pulihkan(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['jenis-unit-list'] })
      pushNotification('Berhasil Dipulihkan', res?.message || 'Jenis unit pendidikan berhasil dipulihkan.')
    },
    onError: (error) => Swal.fire('Gagal Memulihkan', error.response?.data?.message || 'Data gagal dipulihkan.', 'error'),
  })

  const importMutation = useMutation({
    mutationFn: (rows) => jenisUnitService.prosesImport(rows),
    onSuccess: (res, rows) => {
      queryClient.invalidateQueries({ queryKey: ['jenis-unit-list'] })
      const resultRows = res?.data?.rows || res?.data?.berhasil || rows
      setImportResult({
        rows: Array.isArray(resultRows) ? resultRows : rows,
        message: res?.message || 'Data jenis unit berhasil diimpor.',
      })
      pushNotification('Import Data Berhasil', `${Array.isArray(resultRows) ? resultRows.length : rows.length} data jenis unit berhasil diimpor.`)
    },
    onError: (error) => Swal.fire('Gagal Mengimpor', error.response?.data?.message || 'Gagal memproses impor data.', 'error'),
  })

  const handleOpenFormTambah = () => {
    setSelectedForEdit(null)
    setIsFormModalOpen(true)
  }

  const handleOpenFormEdit = (item) => {
    setSelectedForEdit(item)
    setIsFormModalOpen(true)
  }

  const handleOpenDetail = (item) => {
    setSelectedForDetail(item)
    setIsDetailModalOpen(true)
  }

  const handleConfirmDelete = (item) => {
    Swal.fire({
      title: 'Hapus jenis unit?',
      text: `${item.nama_jenis} akan dihapus. Data yang sudah digunakan mungkin tidak dapat dihapus.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) hapusMutation.mutate(item.id || item.uuid)
    })
  }

  const handleFormSubmit = (payload) => {
    if (selectedForEdit) {
      ubahMutation.mutate({ id: selectedForEdit.id || selectedForEdit.uuid, payload })
    } else {
      simpanMutation.mutate(payload)
    }
  }

  const handleProcessExport = async () => {
    setIsExporting(true)
    try {
      const dataEkspor = await jenisUnitService.ekspor({
        search,
        status: selectedStatusFilter,
        jenjang: selectedJenjangFilter,
      })
      if (!dataEkspor?.length) {
        Swal.fire('Tidak Ada Data', 'Tidak ada data yang sesuai filter untuk diekspor.', 'info')
        return
      }

      const headers = ['NO', 'KODE JENIS', 'NAMA JENIS UNIT', 'SINGKATAN', 'JENJANG', 'WARNA BADGE', 'ICON', 'URUTAN', 'STATUS', 'KETERANGAN', 'TANGGAL DIBUAT']
      const csvRows = dataEkspor.map((row) => [
        row.no,
        row.kode_jenis,
        row.nama_jenis,
        row.singkatan,
        row.jenjang,
        row.warna_badge,
        row.icon,
        row.urutan,
        row.status,
        row.keterangan || '',
        row.created_at,
      ].map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      const blob = new Blob([[headers.join(','), ...csvRows].join('\n')], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `export_jenis_unit_${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
      setShowExportModal(false)
      pushNotification('Export Berhasil', `${dataEkspor.length} data berhasil disiapkan sebagai ${exportFormat === 'xlsx' ? 'CSV kompatibel Excel' : 'CSV'}.`)
    } catch {
      Swal.fire('Gagal Mengekspor', 'Data jenis unit gagal diunduh.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const activeCount = stats.aktif ?? listData.filter((item) => item.status && !item.is_deleted).length
  const inactiveCount = stats.tidak_aktif ?? listData.filter((item) => !item.status && !item.is_deleted).length
  const totalCount = stats.total ?? meta.total ?? listData.length

  return (
    <MasterDataPage className="education-unit-page jenis-unit-page" hideBreadcrumb>
      <MasterPageHeader
        title="Master Jenis Unit Pendidikan"
        description="Kelola klasifikasi, jenjang, identitas visual, dan status jenis unit pendidikan Dar el-Iman."
        tone="brand"
        icon={GraduationCap}
        actions={<MasterActionButton className="education-unit-hero__action !h-11 !rounded-xl !border-white !bg-white !px-5 !text-xs !text-emerald-800 !shadow-none hover:!bg-emerald-50" onClick={handleOpenFormTambah}>Tambah Jenis Unit</MasterActionButton>}
      />

      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={School} label="Total Jenis Unit" value={totalCount} description="Terdaftar di sistem" variant="success" delay={40} />
        <MasterStatCard icon={CheckCircle2} label="Jenis Aktif" value={activeCount} description="Dapat digunakan" variant="info" delay={80} />
        <MasterStatCard icon={RotateCcw} label="Tidak Aktif" value={inactiveCount} description="Dinonaktifkan" variant="warning" delay={120} />
        <MasterStatCard icon={GraduationCap} label="Cakupan Jenjang" value={JENJANG_LIST.length} description="Jenjang pendidikan" variant="neutral" delay={160} />
      </MasterStatsGrid>

      <section className="ui-enter rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-label="Pencarian dan filter jenis unit">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Cari jenis unit pendidikan</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1) }}
              placeholder="Cari kode, nama jenis unit, atau singkatan..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-white"
            />
          </label>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="import" icon={Upload} onClick={() => { setImportResult(null); setIsImportModalOpen(true) }}>Import</MasterActionButton>
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="export" icon={FileSpreadsheet} onClick={() => setShowExportModal(true)}>Export Excel</MasterActionButton>
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" onClick={handleOpenFormTambah}>Tambah Jenis</MasterActionButton>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:text-slate-300"><SlidersHorizontal className="h-4 w-4 text-emerald-700" />Filter</span>
          <select value={selectedStatusFilter} onChange={(event) => { setSelectedStatusFilter(event.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
            <option value="">Semua Status</option><option value="true">Aktif</option><option value="false">Tidak Aktif</option>
          </select>
          <select value={selectedJenjangFilter} onChange={(event) => { setSelectedJenjangFilter(event.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
            <option value="">Semua Jenjang</option>{JENJANG_LIST.map((jenjang) => <option key={jenjang} value={jenjang}>{jenjang}</option>)}
          </select>
          <select value={denganSampahFilter} onChange={(event) => { setDenganSampahFilter(event.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
            <option value="">Data Aktif</option><option value="true">Termasuk Terhapus</option>
          </select>
          <button type="button" onClick={() => refetch()} aria-label="Muat ulang data" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-300"><RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /></button>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="min-w-0">
          <div className="mb-0 flex items-center justify-between rounded-t-[var(--master-card-radius)] border border-b-0 border-slate-200/80 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#1B2433]">
            <div><h2 className="text-base font-bold text-slate-900 dark:text-white">Daftar Jenis Unit Pendidikan</h2><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Data sesuai filter dan kewenangan pengguna.</p></div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{meta.total ?? listData.length} jenis</span>
          </div>
          {isError ? (
            <div className="rounded-b-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#1B2433]">
              <p className="text-sm font-bold text-rose-700">Data jenis unit gagal dimuat.</p>
              <button type="button" onClick={() => refetch()} className="mt-3 h-10 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white">Coba Lagi</button>
            </div>
          ) : (
            <JenisUnitTable data={listData} isLoading={isLoading || isFetching} page={page} perPage={perPage} onDetail={handleOpenDetail} onEdit={handleOpenFormEdit} onDelete={handleConfirmDelete} onRestore={(item) => pulihkanMutation.mutate(item.id || item.uuid)} />
          )}
          {meta.total > 0 && (
            <footer className="flex flex-col justify-between gap-3 rounded-b-2xl border border-t-0 border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-[#1B2433]">
              <span>Menampilkan <strong>{meta.from || 0}</strong>–<strong>{meta.to || 0}</strong> dari <strong>{meta.total}</strong> data</span>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="h-9 rounded-lg border border-slate-200 px-3 disabled:opacity-40 dark:border-slate-700">Sebelumnya</button>
                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-emerald-800 px-2 font-bold text-white">{page}</span>
                <button type="button" disabled={page >= (meta.last_page || 1)} onClick={() => setPage((current) => current + 1)} className="h-9 rounded-lg border border-slate-200 px-3 disabled:opacity-40 dark:border-slate-700">Selanjutnya</button>
              </div>
            </footer>
          )}
        </section>

        <aside className="space-y-4 xl:sticky xl:top-5">
          <section className="rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Jenis Unit</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Data halaman aktif</p>
            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-700">
              {[
                ['Total Jenis', totalCount, School, 'bg-emerald-50 text-emerald-700'],
                ['Jenis Aktif', activeCount, CheckCircle2, 'bg-emerald-50 text-emerald-700'],
                ['Tidak Aktif', inactiveCount, RotateCcw, 'bg-amber-50 text-amber-700'],
                ['Cakupan Jenjang', JENJANG_LIST.length, GraduationCap, 'bg-blue-50 text-blue-700'],
              ].map(([label, value, Icon, color]) => (
                <div key={label} className="flex items-center gap-3 py-3"><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span><span className="flex-1 text-[11px] font-semibold text-slate-500 dark:text-slate-300">{label}</span><strong className="text-sm text-slate-900 dark:text-white">{value}</strong></div>
              ))}
            </div>
          </section>
          <section className="rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Aksi Cepat</h2>
            <div className="mt-3 grid gap-2">
              {[
                ['Tambah Jenis Unit', Plus, handleOpenFormTambah, 'bg-emerald-50 text-emerald-700'],
                ['Import Data', Upload, () => { setImportResult(null); setIsImportModalOpen(true) }, 'bg-blue-50 text-blue-700'],
                ['Export Excel', FileSpreadsheet, () => { setExportFormat('xlsx'); setShowExportModal(true) }, 'bg-emerald-50 text-emerald-700'],
                ['Export CSV', FileText, () => { setExportFormat('csv'); setShowExportModal(true) }, 'bg-rose-50 text-rose-600'],
                ['Lihat Statistik', BarChart3, () => setShowStatisticsModal(true), 'bg-violet-50 text-violet-700'],
              ].map(([label, Icon, action, color]) => (
                <button key={label} type="button" onClick={action} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-left text-xs font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-slate-700 dark:text-slate-200"><span className={`flex h-7 w-7 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span>{label}</button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <button type="button" onClick={() => setShowMobileActions(true)} className="flex h-14 items-center gap-2 rounded-full bg-emerald-800 px-4 text-xs font-bold text-white shadow-xl"><Menu className="h-5 w-5" />Aksi</button>
      </div>

      {showMobileActions && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/55 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true">
          <section className="w-full rounded-t-2xl bg-white p-4 pb-7 dark:bg-[#1B2433]">
            <div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-bold dark:text-white">Aksi Jenis Unit</h2><p className="text-xs text-slate-500">Pilih tindakan yang akan dilakukan.</p></div><button type="button" onClick={() => setShowMobileActions(false)} className="h-11 w-11"><X className="mx-auto h-5 w-5" /></button></div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {[
                ['Tambah', Plus, handleOpenFormTambah, false],
                ['Lihat', Eye, () => listData[0] && handleOpenDetail(listData[0]), !listData.length],
                ['Edit', School, () => listData[0] && handleOpenFormEdit(listData[0]), !listData.length],
                ['Export', Download, () => setShowExportModal(true), false],
                ['Import', Upload, () => setIsImportModalOpen(true), false],
              ].map(([label, Icon, action, disabled]) => <button key={label} type="button" disabled={disabled} onClick={() => { setShowMobileActions(false); action() }} className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><Icon className="h-5 w-5 text-emerald-700" />{label}</button>)}
            </div>
          </section>
        </div>
      )}

      <JenisUnitFormModal isOpen={isFormModalOpen} onClose={() => { setIsFormModalOpen(false); setSelectedForEdit(null) }} onSubmit={handleFormSubmit} initialData={selectedForEdit} isSubmitting={simpanMutation.isPending || ubahMutation.isPending} />
      <JenisUnitDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedForDetail} onEdit={() => { setIsDetailModalOpen(false); handleOpenFormEdit(selectedForDetail) }} />
      <JenisUnitImportModal isOpen={isImportModalOpen} onClose={() => { setIsImportModalOpen(false); setImportResult(null) }} onImport={(rows) => importMutation.mutate(rows)} isSubmitting={importMutation.isPending} result={importResult} />

      {showStatisticsModal && (
        <div className="education-unit-popup fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <section className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700"><div><h2 className="text-base font-bold text-slate-900 dark:text-white">Statistik Jenis Unit</h2><p className="text-[11px] text-slate-500">Distribusi data sesuai filter aktif.</p></div><button type="button" onClick={() => setShowStatisticsModal(false)}><X className="h-5 w-5" /></button></header>
            <div className="grid gap-3 p-5 sm:grid-cols-3">{[['Total', totalCount], ['Aktif', activeCount], ['Tidak Aktif', inactiveCount]].map(([label, value]) => <article key={label} className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-700"><strong className="block text-2xl font-black text-slate-900 dark:text-white">{value}</strong><span className="text-xs text-slate-500">{label}</span></article>)}</div>
            <div className="space-y-3 px-5 pb-5">{JENJANG_LIST.map((jenjang) => { const count = listData.filter((item) => item.jenjang === jenjang).length; const percentage = listData.length ? Math.round((count / listData.length) * 100) : 0; return <div key={jenjang}><div className="mb-1 flex justify-between text-[11px]"><span>{jenjang}</span><strong>{count} jenis</strong></div><div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${percentage}%` }} /></div></div> })}</div>
          </section>
        </div>
      )}

      {showExportModal && (
        <div className="education-unit-popup fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700"><div><h2 className="text-base font-bold text-slate-900 dark:text-white">Export Data Jenis Unit</h2><p className="text-[11px] text-slate-500">Pilih format data yang akan diunduh.</p></div><button type="button" onClick={() => setShowExportModal(false)}><X className="h-5 w-5" /></button></header>
            <div className="grid gap-3 p-5 sm:grid-cols-2">{[['xlsx', 'Excel-compatible CSV', FileSpreadsheet], ['csv', 'CSV (.csv)', FileText]].map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setExportFormat(value)} className={`rounded-xl border p-4 text-left ${exportFormat === value ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'border-slate-200 dark:border-slate-700'}`}><span className="flex items-center gap-2 text-xs font-bold dark:text-white"><Icon className="h-4 w-4 text-emerald-700" />{label}</span><small className="mt-1 block text-[10px] text-slate-500">Data sesuai filter aktif</small></button>)}</div>
            <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-700"><button type="button" onClick={() => setShowExportModal(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-semibold dark:border-slate-700">Batal</button><button type="button" disabled={isExporting} onClick={handleProcessExport} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white disabled:opacity-50"><Download className="h-4 w-4" />{isExporting ? 'Menyiapkan...' : 'Export'}</button></footer>
          </section>
        </div>
      )}

      <section className="pointer-events-none fixed bottom-5 right-5 z-[70] grid w-[min(360px,calc(100vw-2rem))] gap-2" aria-live="polite">
        {notifications.map((notification) => (
          <article key={notification.id} className={`pointer-events-auto edu-toast flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl dark:bg-[#1B2433] ${notification.tone === 'danger' ? 'border-rose-200' : 'border-emerald-200'}`}>
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${notification.tone === 'danger' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{notification.tone === 'danger' ? <Trash2 className="h-4 w-4" /> : <CheckCircle2 className="h-5 w-5" />}</span>
            <div className="flex-1"><strong className="block text-xs font-bold text-slate-900 dark:text-white">{notification.title}</strong><p className="mt-1 text-[11px] text-slate-500">{notification.message}</p></div>
            <button type="button" onClick={() => setNotifications((current) => current.filter((item) => item.id !== notification.id))}><X className="h-4 w-4 text-slate-400" /></button>
          </article>
        ))}
      </section>
    </MasterDataPage>
  )
}
