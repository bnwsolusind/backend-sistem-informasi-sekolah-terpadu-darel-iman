import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Plus,
  RotateCcw,
  School,
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
  MasterDataSection,
  MasterFilterSelect,
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

  const resetFilters = () => {
    setSearch('')
    setSelectedStatusFilter('')
    setSelectedJenjangFilter('')
    setDenganSampahFilter('')
    setPage(1)
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

  const activeCount = stats.aktif ?? 0
  const inactiveCount = stats.tidak_aktif ?? 0
  const deletedCount = stats.terhapus ?? 0
  const totalCount = stats.total ?? 0
  const statsValue = (value) => (isError ? '—' : value)
  const tableIsLoading = isLoading || isFetching
  const filtersAreClear = !search && !selectedStatusFilter && !selectedJenjangFilter && !denganSampahFilter

  return (
    <MasterDataPage className="education-unit-page jenis-unit-page" hideBreadcrumb>
      <MasterPageHeader
        title="Master Jenis Unit Pendidikan"
        description="Kelola klasifikasi, jenjang, identitas visual, dan status jenis unit pendidikan Dar el-Iman."
        icon={GraduationCap}
        actions={(
          <>
            <MasterActionButton variant="import" icon={Upload} onClick={() => { setImportResult(null); setIsImportModalOpen(true) }}>Import</MasterActionButton>
            <MasterActionButton variant="export" icon={FileSpreadsheet} onClick={() => setShowExportModal(true)}>Export</MasterActionButton>
            <MasterActionButton icon={Plus} onClick={handleOpenFormTambah}>Tambah Jenis Unit</MasterActionButton>
          </>
        )}
      />

      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={School} label="Total Jenis Unit" value={statsValue(totalCount)} description="Terdaftar di sistem" variant="success" delay={40} loading={isLoading} />
        <MasterStatCard icon={CheckCircle2} label="Jenis Aktif" value={statsValue(activeCount)} description="Dapat digunakan" variant="info" delay={80} loading={isLoading} />
        <MasterStatCard icon={RotateCcw} label="Tidak Aktif" value={statsValue(inactiveCount)} description="Dinonaktifkan" variant="warning" delay={120} loading={isLoading} />
        <MasterStatCard icon={Trash2} label="Data Terhapus" value={statsValue(deletedCount)} description="Tersimpan di arsip" variant="neutral" delay={160} loading={isLoading} />
      </MasterStatsGrid>

      <MasterDataSection
        title="Daftar Jenis Unit Pendidikan"
        description="Data sesuai filter dan kewenangan pengguna."
        countLabel={`${Number(meta.total ?? listData.length).toLocaleString('id-ID')} jenis`}
        search={{
          value: search,
          onValueChange: (value) => { setSearch(value); setPage(1) },
          placeholder: 'Cari kode, nama jenis unit, atau singkatan...',
          'aria-label': 'Cari jenis unit pendidikan',
        }}
        filters={(
          <>
            <MasterFilterSelect aria-label="Filter status jenis unit" value={selectedStatusFilter} onChange={(event) => { setSelectedStatusFilter(event.target.value); setPage(1) }}>
              <option value="">Semua Status</option>
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </MasterFilterSelect>
            <MasterFilterSelect aria-label="Filter jenjang pendidikan" value={selectedJenjangFilter} onChange={(event) => { setSelectedJenjangFilter(event.target.value); setPage(1) }}>
              <option value="">Semua Jenjang</option>
              {JENJANG_LIST.map((jenjang) => <option key={jenjang} value={jenjang}>{jenjang}</option>)}
            </MasterFilterSelect>
            <MasterFilterSelect aria-label="Filter cakupan data jenis unit" value={denganSampahFilter} onChange={(event) => { setDenganSampahFilter(event.target.value); setPage(1) }}>
              <option value="">Data Aktif</option>
              <option value="true">Termasuk Terhapus</option>
            </MasterFilterSelect>
          </>
        )}
        onReset={resetFilters}
        resetDisabled={filtersAreClear}
        isLoading={tableIsLoading}
        isError={isError}
        errorTitle="Data jenis unit gagal dimuat"
        errorMessage="Periksa koneksi atau coba muat ulang data."
        onRetry={refetch}
        isEmpty={!tableIsLoading && !isError && listData.length === 0}
        emptyTitle="Jenis unit tidak ditemukan"
        emptyDescription="Ubah pencarian atau filter, lalu coba kembali."
        pagination={{
          meta: {
            total: meta.total ?? listData.length,
            from: meta.from ?? (listData.length ? (page - 1) * perPage + 1 : 0),
            to: meta.to ?? ((page - 1) * perPage + listData.length),
            last_page: meta.last_page ?? 1,
            current_page: meta.current_page ?? page,
            per_page: meta.per_page ?? perPage,
          },
          page,
          onPageChange: setPage,
        }}
      >
        <JenisUnitTable data={listData} page={page} perPage={perPage} onDetail={handleOpenDetail} onEdit={handleOpenFormEdit} onDelete={handleConfirmDelete} onRestore={(item) => pulihkanMutation.mutate(item.id || item.uuid)} />
      </MasterDataSection>

      <JenisUnitFormModal isOpen={isFormModalOpen} onClose={() => { setIsFormModalOpen(false); setSelectedForEdit(null) }} onSubmit={handleFormSubmit} initialData={selectedForEdit} isSubmitting={simpanMutation.isPending || ubahMutation.isPending} />
      <JenisUnitDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} data={selectedForDetail} onEdit={() => { setIsDetailModalOpen(false); handleOpenFormEdit(selectedForDetail) }} />
      <JenisUnitImportModal isOpen={isImportModalOpen} onClose={() => { setIsImportModalOpen(false); setImportResult(null) }} onImport={(rows) => importMutation.mutate(rows)} isSubmitting={importMutation.isPending} result={importResult} />

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
