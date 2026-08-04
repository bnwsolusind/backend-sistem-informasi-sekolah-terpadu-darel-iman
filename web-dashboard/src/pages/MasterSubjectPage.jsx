import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  Upload,
  FileSpreadsheet,
  FileText,
  CheckSquare,
  Square,
  Archive,
  Library,
  Save,
  Clock3,
  Target,
  ChartNoAxesColumn,
  CircleX,
} from 'lucide-react'
import { subjectService } from '../services/subjectService'
import { masterKurikulumService } from '../services/masterKurikulumService'
import { educationUnitService } from '../services/educationUnitService'
import {
  MasterActionButton,
  MasterDataPage,
  MasterPageHeader,
  MasterStatCard,
  MasterStatsGrid,
} from '../components/master-data'

const KELOMPOK_LIST = ['Kelompok A', 'Kelompok B', 'Kekhasan SIT', 'Muatan Lokal', 'Al-Qur\'an/Tahfizh']
const KATEGORI_LIST = ['Wajib', 'Pilihan', 'Tahfizh/Diniyah', 'Ekstrakurikuler', 'Vokasi']

export default function MasterSubjectPage({ embedded = false, hideBreadcrumb = false }) {
  const queryClient = useQueryClient()

  // Filter States
  const [search, setSearch] = useState('')
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('')
  const [selectedKurikulumFilter, setSelectedKurikulumFilter] = useState('')
  const [selectedKelompokFilter, setSelectedKelompokFilter] = useState('')
  const [selectedKategoriFilter, setSelectedKategoriFilter] = useState('')
  const [selectedJenjangFilter, setSelectedJenjangFilter] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')
  const [denganSampahFilter, setDenganSampahFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage] = useState(15)

  // Selection & Bulk States
  const [selectedIds, setSelectedIds] = useState([])

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedForEdit, setSelectedForEdit] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedForDetail, setSelectedForDetail] = useState(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false)
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    unit_pendidikan_id: '',
    kurikulum_id: '',
    kode_mapel: '',
    nama_mapel: '',
    nama_singkat: '',
    kelompok_mapel: 'Kelompok A',
    kategori: 'Wajib',
    jenjang: 'SD',
    tingkat_kelas: 'All',
    jam_pelajaran: 2,
    kkm: 75,
    bobot_pengetahuan: 40,
    bobot_keterampilan: 40,
    bobot_sikap: 20,
    warna: '#0E5C44',
    ikon: 'BookOpen',
    urutan_tampil: 1,
    status: true,
    deskripsi: '',
  })

  // Queries
  const { data: responseData = {}, isLoading, isError, refetch } = useQuery({
    queryKey: [
      'master-subjects-list',
      page,
      perPage,
      search,
      selectedUnitFilter,
      selectedKurikulumFilter,
      selectedKelompokFilter,
      selectedKategoriFilter,
      selectedJenjangFilter,
      selectedStatusFilter,
      denganSampahFilter,
    ],
    queryFn: () =>
      subjectService.getDaftar({
        page,
        per_page: perPage,
        search,
        unit_pendidikan_id: selectedUnitFilter,
        kurikulum_id: selectedKurikulumFilter,
        kelompok_mapel: selectedKelompokFilter,
        kategori: selectedKategoriFilter,
        jenjang: selectedJenjangFilter,
        status: selectedStatusFilter,
        dengan_sampah: denganSampahFilter,
        order_by: 'created_at',
        order_dir: 'desc',
      }),
  })

  const { data: kurikulumDropdown = [] } = useQuery({
    queryKey: ['kurikulum-dropdown-options'],
    queryFn: async () => {
      const res = await masterKurikulumService.getDropdown()
      return Array.isArray(res) ? res : (res?.data || [])
    },
  })

  const { data: unitDropdown = [] } = useQuery({
    queryKey: ['education-units-dropdown-options'],
    queryFn: async () => {
      const res = await educationUnitService.getDaftar()
      return res.data || []
    },
  })

  // Mutations
  const simpanMutation = useMutation({
    mutationFn: (payload) => {
      if (selectedForEdit) {
        return subjectService.ubah({ id: selectedForEdit.id, payload })
      }
      return subjectService.tambah(payload)
    },
    onSuccess: (res) => {
      Swal.fire('Berhasil', res.message || 'Data mata pelajaran berhasil disimpan.', 'success')
      setIsFormModalOpen(false)
      setSelectedForEdit(null)
      queryClient.invalidateQueries(['master-subjects-list'])
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Gagal menyimpan data mata pelajaran.'
      Swal.fire('Error', msg, 'error')
    },
  })

  const hapusMutation = useMutation({
    mutationFn: (id) => subjectService.hapus(id),
    onSuccess: (res) => {
      Swal.fire('Terhapus', res.message || 'Mata pelajaran berhasil dihapus.', 'success')
      queryClient.invalidateQueries(['master-subjects-list'])
    },
    onError: (err) => {
      Swal.fire('Gagal', err.response?.data?.message || 'Gagal menghapus mata pelajaran.', 'error')
    },
  })

  const pulihkanMutation = useMutation({
    mutationFn: (id) => subjectService.pulihkan(id),
    onSuccess: (res) => {
      Swal.fire('Dipulihkan', res.message || 'Mata pelajaran berhasil dipulihkan.', 'success')
      queryClient.invalidateQueries(['master-subjects-list'])
    },
  })

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }) => subjectService.bulkStatus(ids, status),
    onSuccess: (res) => {
      Swal.fire('Berhasil', res.message || 'Status berhasil diperbarui secara massal.', 'success')
      setSelectedIds([])
      queryClient.invalidateQueries(['master-subjects-list'])
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids) => subjectService.bulkDelete(ids),
    onSuccess: (res) => {
      Swal.fire('Berhasil', res.message || 'Data berhasil dihapus secara massal.', 'success')
      setSelectedIds([])
      queryClient.invalidateQueries(['master-subjects-list'])
    },
  })

  const items = responseData.data || []
  const meta = responseData.meta || {}
  const stats = responseData.statistik || { total: 0, aktif: 0, tidak_aktif: 0, terhapus: 0 }
  const lastPage = Math.max(Number(meta.last_page) || 1, 1)
  const archiveCount = Number(stats.tidak_aktif || 0) + Number(stats.terhapus || 0)
  const activePercent = Number(stats.total) > 0
    ? Math.round((Number(stats.aktif || 0) / Number(stats.total)) * 100)
    : 0

  const resetFilters = () => {
    setSearch('')
    setSelectedUnitFilter('')
    setSelectedKurikulumFilter('')
    setSelectedKelompokFilter('')
    setSelectedKategoriFilter('')
    setSelectedJenjangFilter('')
    setSelectedStatusFilter('')
    setDenganSampahFilter('')
    setPage(1)
  }

  // Multi select logic
  const isAllSelected = items.length > 0 && selectedIds.length === items.length
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((i) => i.id))
    }
  }

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleOpenFormTambah = () => {
    setSelectedForEdit(null)
    setFormData({
      unit_pendidikan_id: unitDropdown[0]?.id || '',
      kurikulum_id: kurikulumDropdown[0]?.id || '',
      kode_mapel: '',
      nama_mapel: '',
      nama_singkat: '',
      kelompok_mapel: 'Kelompok A',
      kategori: 'Wajib',
      jenjang: 'SD',
      tingkat_kelas: 'All',
      jam_pelajaran: 2,
      kkm: 75,
      bobot_pengetahuan: 40,
      bobot_keterampilan: 40,
      bobot_sikap: 20,
      warna: '#0E5C44',
      ikon: 'BookOpen',
      urutan_tampil: 1,
      status: true,
      deskripsi: '',
    })
    setIsFormModalOpen(true)
  }

  const handleOpenFormEdit = (row) => {
    setSelectedForEdit(row)
    setFormData({
      unit_pendidikan_id: row.unit_pendidikan_id || '',
      kurikulum_id: row.kurikulum_id || '',
      kode_mapel: row.kode_mapel || row.code || '',
      nama_mapel: row.nama_mapel || row.name || '',
      nama_singkat: row.nama_singkat || '',
      kelompok_mapel: row.kelompok_mapel || 'Kelompok A',
      kategori: row.kategori || 'Wajib',
      jenjang: row.jenjang || 'SD',
      tingkat_kelas: row.tingkat_kelas || 'All',
      jam_pelajaran: row.jam_pelajaran || 2,
      kkm: row.kkm || 75,
      bobot_pengetahuan: row.bobot_pengetahuan || 40,
      bobot_keterampilan: row.bobot_keterampilan || 40,
      bobot_sikap: row.bobot_sikap || 20,
      warna: row.warna || '#0E5C44',
      ikon: row.ikon || 'BookOpen',
      urutan_tampil: row.urutan_tampil || 1,
      status: row.status ?? true,
      deskripsi: row.deskripsi || row.description || '',
    })
    setIsFormModalOpen(true)
  }

  const handleOpenDetail = (row) => {
    setSelectedForDetail(row)
    setIsDetailModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.kode_mapel || !formData.nama_mapel) {
      Swal.fire('Peringatan', 'Kode dan Nama Mata Pelajaran wajib diisi.', 'warning')
      return
    }
    simpanMutation.mutate(formData)
  }

  const handleExportExcel = async () => {
    try {
      const res = await subjectService.exportExcel({
        search,
        unit_pendidikan_id: selectedUnitFilter,
        kurikulum_id: selectedKurikulumFilter,
        kelompok_mapel: selectedKelompokFilter,
        kategori: selectedKategoriFilter,
        jenjang: selectedJenjangFilter,
        status: selectedStatusFilter,
      })

      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.filename || 'master_mata_pelajaran.json'
      a.click()
      Swal.fire('Ekspor Berhasil', `${res.total_rows || res.data?.length || 0} data telah diekspor.`, 'success')
    } catch {
      Swal.fire('Gagal', 'Gagal mendownload data ekspor Excel.', 'error')
    }
  }

  const handleExportPdf = async () => {
    try {
      const res = await subjectService.exportPdf({
        search,
        unit_pendidikan_id: selectedUnitFilter,
        kurikulum_id: selectedKurikulumFilter,
        kelompok_mapel: selectedKelompokFilter,
        kategori: selectedKategoriFilter,
        jenjang: selectedJenjangFilter,
        status: selectedStatusFilter,
      })
      Swal.fire('Ekspor PDF Ready', res.message || 'Laporan PDF berhasil dibuat.', 'success')
    } catch {
      Swal.fire('Gagal', 'Gagal mencetak dokumen PDF.', 'error')
    }
  }

  const handleImportSubmit = async (e) => {
    e.preventDefault()
    if (!importFile) {
      Swal.fire('Peringatan', 'Pilih file Excel/CSV terlebih dahulu.', 'warning')
      return
    }
    const form = new FormData()
    form.append('file', importFile)

    try {
      const res = await subjectService.importFile(form)
      Swal.fire('Impor Berhasil', res.message || 'Data berhasil diimpor.', 'success')
      setIsImportModalOpen(false)
      setImportFile(null)
      queryClient.invalidateQueries(['master-subjects-list'])
    } catch (err) {
      Swal.fire('Gagal Impor', err.response?.data?.message || 'Proses impor gagal.', 'error')
    }
  }

  return (
    <MasterDataPage
      className="education-unit-page subject-master-page"
      hideBreadcrumb={embedded || hideBreadcrumb}
    >
      {/* PAGE HEADER */}
      <MasterPageHeader
        tone="brand"
        icon={BookOpen}
        title="Master Mata Pelajaran"
        description="Kelola referensi mata pelajaran untuk kurikulum, jadwal, penilaian, dan rapor."
        actions={
          <MasterActionButton onClick={handleOpenFormTambah}>
            Tambah Mata Pelajaran
          </MasterActionButton>
        }
      />

      {/* KPI STATISTIC CARDS */}
      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={Library} label="Total Mata Pelajaran" value={stats.total || 0} description="Terdaftar di sistem" variant="success" delay={60} />
        <MasterStatCard icon={CheckCircle} label="Mata Pelajaran Aktif" value={stats.aktif || 0} description="Siap digunakan saat ini" variant="success" delay={110} />
        <MasterStatCard icon={CircleX} label="Arsip / Nonaktif" value={archiveCount} description="Nonaktif atau terhapus" variant="warning" delay={160} />
        <MasterStatCard icon={Target} label="Kategori Mapel" value={KATEGORI_LIST.length} description="Kelompok pembelajaran" variant="info" delay={210} />
      </MasterStatsGrid>

      {/* FILTER CONTROL BAR */}
      <section
        className="ui-enter space-y-3 rounded-[18px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-[#1B2433]"
        style={{ animationDelay: '210ms' }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Cari nama atau kode mata pelajaran..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-xs font-semibold text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
              aria-label="Cari nama atau kode mata pelajaran"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            <MasterActionButton variant="import" icon={Upload} onClick={() => setIsImportModalOpen(true)}>Impor</MasterActionButton>
            <MasterActionButton variant="export" icon={FileSpreadsheet} onClick={handleExportExcel}>Excel</MasterActionButton>
            <MasterActionButton variant="export" icon={FileText} onClick={handleExportPdf}>PDF</MasterActionButton>
            <MasterActionButton onClick={handleOpenFormTambah}>Tambah</MasterActionButton>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto border-t border-slate-100 pt-3 text-sm dark:border-slate-700 [&_select]:dark:border-slate-700 [&_select]:dark:bg-[#111827] [&_select]:dark:text-slate-200">
          <span className="flex items-center gap-1.5 font-bold text-gray-600 dark:text-slate-300">
            <Filter className="h-3.5 w-3.5 text-emerald-600" />
            Filter:
          </span>

          <select
            value={selectedUnitFilter}
            onChange={(e) => { setSelectedUnitFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Filter unit pendidikan"
          >
            <option value="">Semua Unit</option>
            {unitDropdown.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <select
            value={selectedKurikulumFilter}
            onChange={(e) => { setSelectedKurikulumFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Filter kurikulum"
          >
            <option value="">Semua Kurikulum</option>
            {kurikulumDropdown.map((k) => (
              <option key={k.id} value={k.id}>{k.nama_kurikulum}</option>
            ))}
          </select>

          <select
            value={selectedKelompokFilter}
            onChange={(e) => { setSelectedKelompokFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Filter kelompok mata pelajaran"
          >
            <option value="">Semua Kelompok</option>
            {KELOMPOK_LIST.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <select
            value={selectedKategoriFilter}
            onChange={(e) => { setSelectedKategoriFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Filter kategori mata pelajaran"
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_LIST.map((kategori) => (
              <option key={kategori} value={kategori}>{kategori}</option>
            ))}
          </select>

          <select
            value={selectedJenjangFilter}
            onChange={(e) => { setSelectedJenjangFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Filter jenjang mata pelajaran"
          >
            <option value="">Semua Jenjang</option>
            {['PAUD', 'TK', 'SD', 'SMP', 'SMA', 'SMK'].map((jenjang) => (
              <option key={jenjang} value={jenjang}>{jenjang}</option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => { setSelectedStatusFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Filter status mata pelajaran"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak_aktif">Non-Aktif</option>
          </select>

          <select
            value={denganSampahFilter}
            onChange={(e) => { setDenganSampahFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Filter cakupan data"
          >
            <option value="">Data Aktif</option>
            <option value="1">Termasuk Arsip</option>
          </select>
          <button
            type="button"
            onClick={resetFilters}
            className="ui-button inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </section>

      <div className="subject-workspace grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0 space-y-4">
      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="ui-enter flex flex-col gap-3 rounded-2xl border border-emerald-700 bg-emerald-900 p-4 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckSquare className="h-4 w-4 text-amber-300" />
            <span>Terpilih {selectedIds.length} data mata pelajaran</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: true })}
              disabled={bulkStatusMutation.isPending}
              className="ui-button inline-flex items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle className="h-4 w-4" />
              Aktifkan
            </button>
            <button
              onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: false })}
              disabled={bulkStatusMutation.isPending}
              className="ui-button inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Archive className="h-4 w-4" />
              Nonaktifkan
            </button>
            <button
              onClick={() => {
                Swal.fire({
                  title: 'Hapus Massal?',
                  text: `Apakah Anda yakin ingin menghapus ${selectedIds.length} mata pelajaran terpilih?`,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#e11d48',
                  confirmButtonText: 'Ya, Hapus Semua',
                  cancelButtonText: 'Batal',
                }).then((result) => {
                  if (result.isConfirmed) {
                    bulkDeleteMutation.mutate(selectedIds)
                  }
                })
              }}
              disabled={bulkDeleteMutation.isPending}
              className="ui-button inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Hapus Massal
            </button>
          </div>
        </div>
      )}

      {/* TABLE DATA */}
      <section className="overflow-hidden rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-labelledby="subject-table-title">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 id="subject-table-title" className="text-base font-bold text-slate-900 dark:text-white">Daftar Mata Pelajaran</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Data mata pelajaran sesuai filter dan kewenangan pengguna.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{meta.total || stats.total || 0} mapel</span>
        </div>
        <div className="overflow-hidden">
          <table className="w-full table-fixed text-left text-sm text-slate-600" aria-label="Daftar mata pelajaran">
            <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700 dark:bg-slate-800/70">
              <tr>
                <th className="w-[5%] px-2 py-3 text-center">
                  <button onClick={toggleSelectAll} className="rounded text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600" aria-label={isAllSelected ? 'Batalkan pilih semua' : 'Pilih semua mata pelajaran'}>
                    {isAllSelected ? <CheckSquare className="h-4 w-4 text-emerald-600" /> : <Square className="h-4 w-4" />}
                  </button>
                </th>
                <th className="w-[27%] px-3 py-3 font-bold">Identitas Mapel</th>
                <th className="hidden w-[21%] px-3 py-3 font-bold md:table-cell">Kurikulum & Unit</th>
                <th className="hidden w-[17%] px-3 py-3 font-bold lg:table-cell">Klasifikasi</th>
                <th className="hidden w-[13%] px-3 py-3 text-center font-bold xl:table-cell">Parameter</th>
                <th className="hidden w-[10%] px-2 py-3 text-center font-bold sm:table-cell">Status</th>
                <th className="w-[17%] px-2 py-3 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} aria-hidden="true">
                    <td colSpan="7" className="px-4 py-3">
                      <div className="h-11 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700/70" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center">
                    <CircleX className="mx-auto h-8 w-8 text-rose-500" />
                    <p className="mt-3 font-bold text-slate-800">Data mata pelajaran gagal dimuat</p>
                    <p className="mt-1 text-xs text-slate-500">Periksa koneksi lalu coba kembali.</p>
                    <button type="button" onClick={() => refetch()} className="mt-4 h-10 rounded-xl bg-emerald-800 px-4 font-semibold text-white">Coba Lagi</button>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <BookOpen className="mx-auto mb-2 h-7 w-7 text-slate-300" />
                    <p className="font-semibold text-slate-600">Mata pelajaran tidak ditemukan</p>
                    <p className="mt-1 text-xs">Ubah kata pencarian atau reset filter untuk melihat data lainnya.</p>
                    <button type="button" onClick={handleOpenFormTambah} className="mt-4 h-10 rounded-xl bg-emerald-800 px-4 font-semibold text-white">Tambah Mata Pelajaran</button>
                  </td>
                </tr>
              ) : (
                items.map((row, index) => {
                  const isSelected = selectedIds.includes(row.id)
                  const subjectName = row.nama_mapel || row.name || 'Mata pelajaran'
                  const subjectColor = row.warna || '#0E5C44'
                  return (
                    <tr
                      key={row.id}
                      className={`ui-row transition-colors hover:bg-emerald-50/40 ${isSelected ? 'bg-emerald-50/60' : ''}`}
                      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                    >
                      <td className="px-2 py-3 text-center">
                        <button onClick={() => toggleSelectRow(row.id)} className="rounded focus:outline-none focus:ring-2 focus:ring-emerald-600" aria-label={`${isSelected ? 'Batalkan pilihan' : 'Pilih'} ${row.nama_mapel || row.name}`}>
                          {isSelected ? <CheckSquare className="h-4 w-4 text-emerald-600" /> : <Square className="h-4 w-4 text-slate-300" />}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                            style={{
                              color: subjectColor,
                              borderColor: `${subjectColor}33`,
                              backgroundColor: `${subjectColor}12`,
                            }}
                          >
                            <BookOpen className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-extrabold leading-5 text-slate-900 dark:text-white" title={subjectName}>
                              {subjectName}
                            </p>
                            <p className="truncate font-mono text-[9px] font-medium text-slate-400">
                              {row.kode_mapel || row.code} {row.nama_singkat ? `(${row.nama_singkat})` : ''}
                            </p>
                            <p className="mt-0.5 truncate text-[9px] text-slate-400 md:hidden">{row.kurikulum?.nama_kurikulum || 'Kurikulum Terpadu'} · {row.unit_pendidikan?.name || 'Semua Unit'}</p>
                            <p className={`mt-0.5 text-[9px] font-bold sm:hidden ${row.status ? 'text-emerald-700' : 'text-rose-600'}`}>• {row.status ? 'Aktif' : 'Nonaktif'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-3 py-3 md:table-cell">
                        <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                          {row.kurikulum?.nama_kurikulum || 'Kurikulum Terpadu'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {row.unit_pendidikan?.name || 'Semua Unit'}
                        </p>
                      </td>
                      <td className="hidden px-3 py-3 lg:table-cell">
                        <span className="mb-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700">
                          {row.kelompok_mapel || 'Kelompok A'}
                        </span>
                        <span className="block w-fit rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                          {row.kategori || 'Wajib'}
                        </span>
                      </td>
                      <td className="hidden px-3 py-3 text-center xl:table-cell">
                        <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{row.jam_pelajaran || 2} JP · KKM {row.kkm || 75}</p>
                        <p className="mt-1 text-[9px] font-medium text-slate-400">{row.bobot_pengetahuan || 40}/{row.bobot_keterampilan || 40}/{row.bobot_sikap || 20}</p>
                      </td>
                      <td className="hidden px-2 py-3 text-center sm:table-cell">
                        {row.status ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-800">
                            AKTIF
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600">
                            NON-AKTIF
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                        {row.is_deleted ? (
                          <button
                            onClick={() => pulihkanMutation.mutate(row.id)}
                            disabled={pulihkanMutation.isPending}
                            className="ui-button flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                            title="Pulihkan data"
                            aria-label={`Pulihkan mata pelajaran ${subjectName}`}
                          >
                            <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleOpenDetail(row)}
                          className="ui-button flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                          title="Lihat detail"
                          aria-label={`Lihat detail mata pelajaran ${subjectName}`}
                        >
                          <Eye className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                        {!row.is_deleted && (
                          <>
                            <button
                              onClick={() => handleOpenFormEdit(row)}
                              className="ui-button hidden h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 transition-colors hover:bg-amber-100 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 sm:flex"
                              title="Edit data"
                              aria-label={`Edit mata pelajaran ${subjectName}`}
                            >
                              <Edit2 className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => {
                                Swal.fire({
                                  title: 'Hapus Mata Pelajaran?',
                                  text: `Hapus mapel ${row.nama_mapel || row.name}?`,
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#e11d48',
                                  confirmButtonText: 'Ya, Hapus',
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    hapusMutation.mutate(row.id)
                                  }
                                })
                              }}
                              disabled={hapusMutation.isPending}
                              className="ui-button hidden h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:flex"
                              title="Hapus data"
                              aria-label={`Hapus mata pelajaran ${subjectName}`}
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Menampilkan {meta.from || 0} - {meta.to || 0} dari {meta.total || 0} Mata Pelajaran
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="ui-button inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Ke halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>
              <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">
                {page} / {lastPage}
              </span>
              <button
                disabled={page >= lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="ui-button inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Ke halaman berikutnya"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
      </section>
        </main>

        <aside className="space-y-4 xl:sticky xl:top-5" aria-label="Ringkasan mata pelajaran">
          <section className="edu-card rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><Library className="h-5 w-5" /></span>
              <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Mapel</h2><p className="text-xs text-slate-500 dark:text-slate-400">Data halaman aktif</p></div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                ['Total Mapel', stats.total || 0, Library, 'text-emerald-700 bg-emerald-50'],
                ['Mapel Aktif', stats.aktif || 0, CheckCircle, 'text-emerald-700 bg-emerald-50'],
                ['Nonaktif', stats.tidak_aktif || 0, CircleX, 'text-amber-700 bg-amber-50'],
                ['Terhapus', stats.terhapus || 0, Archive, 'text-rose-700 bg-rose-50'],
                ['Kategori', KATEGORI_LIST.length, Target, 'text-blue-700 bg-blue-50'],
              ].map(([label, value, Icon, color]) => (
                <div key={label} className="flex items-center gap-3 py-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1 text-[11px] font-semibold text-slate-500 dark:text-slate-300">{label}</span>
                  <strong className="text-sm font-black tabular-nums text-slate-900 dark:text-white">{Number(value).toLocaleString('id-ID')}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="edu-card rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Aksi Cepat</h2>
            <div className="mt-3 grid gap-2">
              {[
                ['Tambah Mata Pelajaran', BookOpen, handleOpenFormTambah, 'text-emerald-700 bg-emerald-50'],
                ['Import Data Mapel', Upload, () => setIsImportModalOpen(true), 'text-blue-700 bg-blue-50'],
                ['Export Excel', FileSpreadsheet, handleExportExcel, 'text-emerald-700 bg-emerald-50'],
                ['Export PDF', FileText, handleExportPdf, 'text-rose-600 bg-rose-50'],
                ['Lihat Statistik', ChartNoAxesColumn, () => setIsStatisticsModalOpen(true), 'text-violet-700 bg-violet-50'],
              ].map(([label, Icon, action, color]) => (
                <button key={label} type="button" onClick={action} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-left text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-700/20 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-emerald-950/40">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span>{label}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* FORM MODAL (CREATE & EDIT) */}
      {isFormModalOpen && (
        <div className="ui-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="subject-form-title">
          <div className="ui-modal max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 id="subject-form-title" className="flex items-center gap-2 text-base font-black text-slate-800">
                <BookOpen className="h-5 w-5 text-emerald-800" />
                <span>{selectedForEdit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}</span>
              </h2>
              <button onClick={() => setIsFormModalOpen(false)} className="ui-button rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup formulir">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Kurikulum <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.kurikulum_id}
                    onChange={(e) => setFormData({ ...formData, kurikulum_id: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="">Pilih Kurikulum</option>
                    {kurikulumDropdown.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama_kurikulum} {k.kode_kurikulum ? `(${k.kode_kurikulum})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Unit Pendidikan <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.unit_pendidikan_id}
                    onChange={(e) => setFormData({ ...formData, unit_pendidikan_id: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="">Pilih Unit Pendidikan</option>
                    {unitDropdown.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Kode Mapel <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formData.kode_mapel}
                    onChange={(e) => setFormData({ ...formData, kode_mapel: e.target.value })}
                    required
                    placeholder="Contoh: MP-SD-PAI"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Nama Mapel <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formData.nama_mapel}
                    onChange={(e) => setFormData({ ...formData, nama_mapel: e.target.value })}
                    required
                    placeholder="Contoh: Pendidikan Agama Islam"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Nama Singkat / Singkatan</label>
                  <input
                    type="text"
                    value={formData.nama_singkat}
                    onChange={(e) => setFormData({ ...formData, nama_singkat: e.target.value })}
                    placeholder="Contoh: PAI"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Kelompok Mapel</label>
                  <select
                    value={formData.kelompok_mapel}
                    onChange={(e) => setFormData({ ...formData, kelompok_mapel: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {KELOMPOK_LIST.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {KATEGORI_LIST.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Alokasi JP per Minggu</label>
                  <input
                    type="number"
                    value={formData.jam_pelajaran}
                    onChange={(e) => setFormData({ ...formData, jam_pelajaran: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">KKM Minimum</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.kkm}
                    onChange={(e) => setFormData({ ...formData, kkm: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Bobot Pengetahuan (%)</label>
                  <input
                    type="number"
                    value={formData.bobot_pengetahuan}
                    onChange={(e) => setFormData({ ...formData, bobot_pengetahuan: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Bobot Keterampilan (%)</label>
                  <input
                    type="number"
                    value={formData.bobot_keterampilan}
                    onChange={(e) => setFormData({ ...formData, bobot_keterampilan: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">Bobot Sikap (%)</label>
                  <input
                    type="number"
                    value={formData.bobot_sikap}
                    onChange={(e) => setFormData({ ...formData, bobot_sikap: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="ui-button rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={simpanMutation.isPending}
                  className="ui-button rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="mr-2 inline h-4 w-4" />
                  {simpanMutation.isPending ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedForDetail && (
        <div className="ui-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="subject-detail-title">
          <div className="ui-modal w-full max-w-xl space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 id="subject-detail-title" className="flex items-center gap-2 text-base font-black text-slate-800">
                <Eye className="h-5 w-5 text-blue-600" />
                <span>Detail Mata Pelajaran</span>
              </h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="ui-button rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup detail">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-bold text-slate-500">Kode Mapel</span>
                  <span className="font-mono font-extrabold text-slate-800">{selectedForDetail.kode_mapel || selectedForDetail.code}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-bold text-slate-500">Nama Mapel</span>
                  <span className="font-black text-slate-800">{selectedForDetail.nama_mapel || selectedForDetail.name}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-bold text-slate-500">Kurikulum</span>
                  <span className="font-bold text-slate-700">{selectedForDetail.kurikulum?.nama_kurikulum || '-'}</span>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <span className="font-bold text-slate-500">Unit Pendidikan</span>
                  <span className="font-bold text-slate-700">{selectedForDetail.unit_pendidikan?.name || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-800">
                    <Clock3 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Alokasi JP</p>
                    <p className="mt-0.5 text-base font-black text-emerald-800">{selectedForDetail.jam_pelajaran || 2} JP / Minggu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-800">
                    <Target className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">KKM Minimum</p>
                    <p className="mt-0.5 text-base font-black text-emerald-800">{selectedForDetail.kkm || 75}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  <ChartNoAxesColumn className="h-4 w-4 text-emerald-800" />
                  Bobot Penilaian Rapor
                </p>
                <div className="flex flex-col gap-2 text-xs font-bold text-slate-700 sm:flex-row sm:justify-between">
                  <span>Pengetahuan: {selectedForDetail.bobot_pengetahuan || 40}%</span>
                  <span>Keterampilan: {selectedForDetail.bobot_keterampilan || 40}%</span>
                  <span>Sikap: {selectedForDetail.bobot_sikap || 20}%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="ui-button rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATISTICS MODAL */}
      {isStatisticsModalOpen && (
        <div className="ui-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="subject-statistics-title">
          <div className="ui-modal max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[18px] border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            <header className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white p-5 dark:border-slate-700 dark:bg-[#1B2433]">
              <div>
                <h2 id="subject-statistics-title" className="text-lg font-bold text-slate-900 dark:text-white">Statistik Mata Pelajaran</h2>
                <p className="mt-1 text-xs text-slate-500">Ringkasan berdasarkan filter aktif.</p>
              </div>
              <button type="button" onClick={() => setIsStatisticsModalOpen(false)} aria-label="Tutup statistik" className="h-10 w-10 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><X className="mx-auto h-5 w-5" /></button>
            </header>
            <div className="space-y-5 p-5">
              <MasterStatsGrid className="education-unit-kpis">
                <MasterStatCard icon={Library} label="Total" value={stats.total || 0} description="Mata pelajaran" variant="success" />
                <MasterStatCard icon={CheckCircle} label="Aktif" value={stats.aktif || 0} description={`${activePercent}% dari total`} variant="success" />
                <MasterStatCard icon={CircleX} label="Arsip" value={archiveCount} description="Nonaktif / terhapus" variant="warning" />
              </MasterStatsGrid>
              <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span>Tingkat keaktifan</span><span>{activePercent}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-emerald-600 transition-[width] duration-200" style={{ width: `${activePercent}%` }} />
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="ui-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="subject-import-title">
          <div className="ui-modal w-full max-w-md space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 id="subject-import-title" className="flex items-center gap-2 text-base font-black text-slate-800">
                <Upload className="h-5 w-5 text-emerald-800" />
                <span>Impor Data Mata Pelajaran</span>
              </h2>
              <button onClick={() => setIsImportModalOpen(false)} className="ui-button rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup impor">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <FileSpreadsheet className="mx-auto mb-2 h-8 w-8 text-emerald-800" />
                <p className="font-bold text-slate-700">Pilih file Excel (.xlsx) / CSV</p>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => setImportFile(e.target.files[0])}
                  className="mt-2 text-xs w-full"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => Swal.fire('Format Impor', 'Header kolom: kode_mapel, nama_mapel, kelompok_mapel, kategori, jam_pelajaran, kkm.', 'info')}
                  className="ui-button text-left text-xs font-semibold text-emerald-800 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  Download Template
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="ui-button rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!importFile}
                    className="ui-button inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload className="h-4 w-4" />
                    Upload & Impor
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsMobileActionsOpen(true)}
        className="fixed bottom-22 left-1/2 z-40 inline-flex h-14 -translate-x-1/2 items-center gap-2 rounded-full bg-emerald-800 px-5 text-sm font-bold text-white shadow-xl shadow-emerald-900/25 xl:hidden"
        aria-label="Buka aksi mata pelajaran"
      >
        <BookOpen className="h-5 w-5" />
        Aksi
      </button>

      {isMobileActionsOpen && (
        <div className="ui-backdrop fixed inset-0 z-50 flex items-end bg-slate-950/55" role="dialog" aria-modal="true" aria-label="Aksi mata pelajaran">
          <div className="ui-modal w-full rounded-t-[24px] bg-white p-5 pb-8 shadow-2xl dark:bg-[#1B2433]">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-600" />
            <div className="flex items-center justify-between">
              <div><h2 className="font-bold text-slate-900 dark:text-white">Aksi Mata Pelajaran</h2><p className="text-xs text-slate-500">Pilih tindakan yang ingin dilakukan.</p></div>
              <button type="button" onClick={() => setIsMobileActionsOpen(false)} aria-label="Tutup menu aksi" className="h-11 w-11 rounded-xl text-slate-500 hover:bg-slate-100"><X className="mx-auto h-5 w-5" /></button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MasterActionButton onClick={() => { setIsMobileActionsOpen(false); handleOpenFormTambah() }}>Tambah</MasterActionButton>
              <MasterActionButton variant="import" icon={Upload} onClick={() => { setIsMobileActionsOpen(false); setIsImportModalOpen(true) }}>Impor</MasterActionButton>
              <MasterActionButton variant="export" icon={FileSpreadsheet} onClick={() => { setIsMobileActionsOpen(false); handleExportExcel() }}>Ekspor</MasterActionButton>
              <MasterActionButton variant="import" icon={ChartNoAxesColumn} onClick={() => { setIsMobileActionsOpen(false); setIsStatisticsModalOpen(true) }}>Statistik</MasterActionButton>
            </div>
          </div>
        </div>
      )}
    </MasterDataPage>
  )
}
