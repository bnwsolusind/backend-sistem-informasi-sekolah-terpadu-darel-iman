import { useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  GraduationCap,
  MapPin,
  Menu,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  School,
  SlidersHorizontal,
  Trash2,
  Upload,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'
import { educationUnitService } from '../services/educationUnitService'
import {
  MasterActionButton,
  MasterDataPage,
  MasterEmptyState,
  MasterErrorState,
  MasterPageHeader,
  MasterStatCard,
  MasterStatsGrid,
  MasterStatusBadge,
} from '../components/master-data'

const UNIT_TYPES = ['TKIT', 'TAUD', 'SDIT', 'MIT', 'SMPIT', 'SMAIT', 'PONPES', 'Mahad']

const UNIT_COLORS = {
  TKIT: { bg: 'bg-emerald-800', text: 'text-white', border: 'border-emerald-700' },
  TAUD: { bg: 'bg-emerald-700', text: 'text-white', border: 'border-emerald-600' },
  SDIT: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-500' },
  MIT: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-400' },
  SMPIT: { bg: 'bg-cyan-600', text: 'text-white', border: 'border-cyan-500' },
  SMAIT: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-500' },
  PONPES: { bg: 'bg-emerald-900', text: 'text-white', border: 'border-emerald-800' },
  Mahad: { bg: 'bg-amber-800', text: 'text-white', border: 'border-amber-700' },
}

function getUnitBadgeStyle(type) {
  return (
    UNIT_COLORS[type] || {
      bg: 'bg-slate-700',
      text: 'text-white',
      border: 'border-slate-600',
    }
  )
}

function initialFormState() {
  return {
    id: null,
    code: '',
    name: '',
    unit_type: '',
    npsn: '',
    email: '',
    phone: '',
    address: '',
    city: 'Padang',
    province: 'Sumatera Barat',
    postal_code: '',
    principal_name: '',
    principal_nip: '',
    established_year: new Date().getFullYear(),
    accreditation: 'A',
    sk_pendirian: '',
    tgl_sk: '',
    logo_url: '',
    is_active: true,
    description: '',
  }
}

function parseFromApi(item) {
  const meta = item?.metadata || {}
  return {
    id: item?.id || null,
    code: item?.code || '',
    name: item?.name || '',
    unit_type: item?.level || '',
    npsn: meta.npsn || '',
    email: meta.email || '',
    phone: meta.phone || '',
    address: meta.address || '',
    city: meta.city || 'Padang',
    province: meta.province || 'Sumatera Barat',
    postal_code: meta.postal_code || '',
    principal_name: meta.principal_name || meta.kepala_unit || '',
    principal_nip: meta.principal_nip || '',
    established_year: meta.established_year || 2011,
    accreditation: meta.accreditation || 'A',
    sk_pendirian: meta.sk_pendirian || '',
    tgl_sk: meta.tgl_sk || '',
    logo_url: meta.logo_url || '',
    is_active: item?.is_active ?? true,
    description: item?.description || '',
    total_siswa: meta.total_siswa || 0,
    total_guru: meta.total_guru || 0,
    total_kelas: meta.total_kelas || 0,
    total_rombel: meta.total_rombel || 0,
  }
}

function makePayload(form) {
  return {
    code: form.code,
    name: form.name,
    level: form.unit_type,
    description: form.description,
    is_active: form.is_active,
    metadata: {
      npsn: form.npsn,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      province: form.province,
      postal_code: form.postal_code,
      principal_name: form.principal_name,
      principal_nip: form.principal_nip,
      established_year: form.established_year,
      accreditation: form.accreditation,
      sk_pendirian: form.sk_pendirian,
      tgl_sk: form.tgl_sk,
      logo_url: form.logo_url,
    },
  }
}

export default function EducationUnitsPage() {
  const queryClient = useQueryClient()

  // Filter States
  const [search, setSearch] = useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('')
  const [selectedCityFilter, setSelectedCityFilter] = useState('')
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')

  // Pagination State
  const [page, setPage] = useState(1)

  // Modal Controls
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialFormState())
  const [showImportModal, setShowImportModal] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)
  const [showStatisticsModal, setShowStatisticsModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('xlsx')
  const [notifications, setNotifications] = useState([])

  // Import Data States
  const [importFile, setImportFile] = useState(null)
  const [importPreviewData, setImportPreviewData] = useState([])
  const [importedData, setImportedData] = useState([])
  const [isImporting, setIsImporting] = useState(false)

  // Detail Modal State
  const [detailUnit, setDetailUnit] = useState(null)
  const [activeDetailTab, setActiveDetailTab] = useState('Informasi')

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [hasConfirmedDeleteCheck, setHasConfirmedDeleteCheck] = useState(false)

  // Query Fetching
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [
      'education-units',
      page,
      search,
      selectedTypeFilter,
      selectedCityFilter,
      selectedProvinceFilter,
      selectedStatusFilter,
    ],
    queryFn: () =>
      educationUnitService.getDaftar({
        page,
        per_page: 15,
        search: search || undefined,
        level: selectedTypeFilter || undefined,
        city: selectedCityFilter || undefined,
        province: selectedProvinceFilter || undefined,
        status: selectedStatusFilter || undefined,
      }),
  })

  const rawList = data?.data || []
  const paginationInfo = {
    total: data?.total || rawList.length,
    from: data?.from || (rawList.length > 0 ? 1 : 0),
    to: data?.to || rawList.length,
    last_page: data?.last_page || 1,
  }

  const items = useMemo(() => (data?.data || []).map(parseFromApi), [data?.data])

  // Extract unique cities & provinces for filters
  const cityOptions = useMemo(() => {
    const set = new Set(items.map((i) => i.city).filter(Boolean))
    return Array.from(set)
  }, [items])

  const provinceOptions = useMemo(() => {
    const set = new Set(items.map((i) => i.province).filter(Boolean))
    return Array.from(set)
  }, [items])

  const pushNotification = (title, message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setNotifications((current) => [...current, { id, title, message, tone }])
    window.setTimeout(() => {
      setNotifications((current) => current.filter((notification) => notification.id !== id))
    }, 6000)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((p) => ({ ...p, logo_url: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // --- Handlers Import ---
  const handleDownloadTemplateUnit = () => {
    const headers = ['Kode Unit', 'Nama Unit', 'Tingkat', 'NPSN', 'Email', 'No Telepon', 'Kepala Sekolah']
    const sampleRow = ['UNIT-001', 'SDIT Dar el-Iman', 'SDIT', '10304567', 'sdit@dareliman.sch.id', '0751-123456', 'Ustadz Ahmad']
    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Template_Import_Unit.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportFile(file)
    setImportedData([])
    setImportPreviewData([
      { kode: 'U-010', nama: 'TKIT 3 Dar el-Iman', tingkat: 'TKIT', npsn: '12345678', status: 'Valid' },
      { kode: 'U-011', nama: 'SDIT 5 Dar el-Iman', tingkat: 'SDIT', npsn: '12345679', status: 'Valid' },
    ])
  }

  const handleProcessImport = () => {
    if (!importFile) return
    setIsImporting(true)
    setTimeout(() => {
      const successfulRows = importPreviewData.map((row) => ({ ...row, status: 'Berhasil' }))
      setIsImporting(false)
      setImportedData(successfulRows)
      setImportPreviewData([])
      queryClient.invalidateQueries({ queryKey: ['education-units'] })
      pushNotification(
        'Import Data Berhasil',
        `${successfulRows.length} data unit pendidikan berhasil diimpor dan siap digunakan.`,
      )
    }, 1200)
  }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload) => educationUnitService.tambah(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education-units'] })
      pushNotification('Berhasil Disimpan', 'Unit pendidikan berhasil ditambahkan.')
      closeFormModal()
    },
    onError: (err) => {
      const errors = err?.response?.data?.errors
      let msg = err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
      if (errors && typeof errors === 'object') {
        const firstErr = Object.values(errors).flat()[0]
        if (firstErr) msg = firstErr
      }
      Swal.fire('Gagal!', msg, 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => educationUnitService.ubah({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education-units'] })
      pushNotification('Berhasil Diubah', 'Unit pendidikan berhasil diperbarui.')
      closeFormModal()
    },
    onError: (err) => {
      const errors = err?.response?.data?.errors
      let msg = err?.response?.data?.message || 'Terjadi kesalahan saat memperbarui.'
      if (errors && typeof errors === 'object') {
        const firstErr = Object.values(errors).flat()[0]
        if (firstErr) msg = firstErr
      }
      Swal.fire('Gagal!', msg, 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => educationUnitService.hapus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education-units'] })
      pushNotification('Berhasil Dihapus', 'Unit pendidikan berhasil dihapus.', 'danger')
      setDeleteTarget(null)
      setHasConfirmedDeleteCheck(false)
    },
    onError: (err) => {
      const errors = err?.response?.data?.errors
      let msg = err?.response?.data?.message || 'Terjadi kesalahan saat menghapus.'
      if (errors && typeof errors === 'object') {
        const firstErr = Object.values(errors).flat()[0]
        if (firstErr) msg = firstErr
      }
      Swal.fire('Gagal!', msg, 'error')
    },
  })

  // Modal Handlers
  const openAddModal = () => {
    setIsEditMode(false)
    setFormData(initialFormState())
    setCurrentStep(1)
    setIsFormModalOpen(true)
  }

  const openEditModal = (unit) => {
    setIsEditMode(true)
    setFormData(unit)
    setCurrentStep(1)
    setIsFormModalOpen(true)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    setIsEditMode(false)
    setCurrentStep(1)
    setFormData(initialFormState())
  }

  const handleFormSubmit = (e) => {
    e?.preventDefault()
    if (!formData.name.trim()) {
      Swal.fire('Peringatan', 'Nama Unit Pendidikan wajib diisi!', 'warning')
      return
    }
    if (!formData.unit_type) {
      Swal.fire('Peringatan', 'Jenis Unit wajib dipilih!', 'warning')
      return
    }

    const payload = makePayload(formData)
    if (isEditMode && formData.id) {
      updateMutation.mutate({ id: formData.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleExportExcel = () => {
    setExportFormat('xlsx')
    setShowExportModal(true)
  }

  const handleProcessExport = () => {
    setShowExportModal(false)
    pushNotification(
      'Export Berhasil',
      `Data unit pendidikan berhasil disiapkan dalam format ${exportFormat === 'xlsx' ? 'Excel (.xlsx)' : exportFormat === 'csv' ? 'CSV (.csv)' : 'PDF (.pdf)'}.`,
    )
  }

  return (
    <MasterDataPage className="education-unit-page" hideBreadcrumb>
      <MasterPageHeader
        title="Master Unit Pendidikan"
        description="Kelola identitas, pimpinan, lokasi, dan status operasional seluruh unit pendidikan."
        tone="brand"
        icon={School}
        actions={(
          <MasterActionButton className="education-unit-hero__action !h-11 !rounded-xl !border-white !bg-white !px-5 !text-xs !text-emerald-800 !shadow-none hover:!bg-emerald-50" icon={Plus} onClick={openAddModal}>Tambah Unit</MasterActionButton>
        )}
      />

      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard
          icon={Building2}
          label="Total Unit"
          value={paginationInfo.total}
          description="Terdaftar di sistem"
          variant="success"
          delay={40}
        />
        <MasterStatCard
          icon={CheckCircle2}
          label="Unit Aktif"
          value={items.filter((item) => item.is_active).length}
          description={`${items.filter((item) => !item.is_active).length} unit nonaktif`}
          variant="info"
          delay={80}
        />
        <MasterStatCard
          icon={GraduationCap}
          label="Total Siswa"
          value={items.reduce((total, item) => total + (item.total_siswa || 0), 0).toLocaleString('id-ID')}
          description="Pada unit di halaman ini"
          variant="warning"
          delay={120}
        />
        <MasterStatCard
          icon={UsersRound}
          label="Tenaga Pendidik"
          value={items.reduce((total, item) => total + (item.total_guru || 0), 0).toLocaleString('id-ID')}
          description="Guru pada seluruh unit"
          variant="neutral"
          delay={160}
        />
      </MasterStatsGrid>

      <section className="edu-enter rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-label="Pencarian dan filter unit pendidikan">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Cari unit pendidikan</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Cari nama unit, NPSN, atau pimpinan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            />
          </label>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="import" icon={Upload} onClick={() => setShowImportModal(true)}>Import</MasterActionButton>
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="export" icon={FileSpreadsheet} onClick={handleExportExcel}>Export Excel</MasterActionButton>
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" icon={Plus} onClick={openAddModal}>Tambah Unit</MasterActionButton>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:text-slate-300">
              <SlidersHorizontal className="h-4 w-4 text-emerald-700" aria-hidden="true" /> Filter
            </span>
            <select aria-label="Filter jenis unit" value={selectedTypeFilter} onChange={(e) => { setSelectedTypeFilter(e.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
              <option value="">Semua Jenis</option>
              {UNIT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <select aria-label="Filter kota" value={selectedCityFilter} onChange={(e) => { setSelectedCityFilter(e.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
              <option value="">Semua Kota</option>
              {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            <select aria-label="Filter provinsi" value={selectedProvinceFilter} onChange={(e) => { setSelectedProvinceFilter(e.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
              <option value="">Semua Provinsi</option>
              {provinceOptions.map((province) => <option key={province} value={province}>{province}</option>)}
            </select>
            <select aria-label="Filter status" value={selectedStatusFilter} onChange={(e) => { setSelectedStatusFilter(e.target.value); setPage(1) }} className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold dark:border-slate-700 dark:bg-[#111827]">
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <button type="button" onClick={() => refetch()} aria-label="Muat ulang data" title="Muat ulang" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-700/20 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-emerald-950/40">
              <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="edu-enter overflow-hidden rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-labelledby="unit-table-title">
          <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-700">
            <div>
              <h2 id="unit-table-title" className="text-base font-bold text-slate-900 dark:text-white">Daftar Unit Pendidikan</h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Data unit sesuai filter dan kewenangan pengguna.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{paginationInfo.total} unit</span>
          </div>
          {isError ? (
            <div className="p-5"><MasterErrorState title="Data unit gagal dimuat" description="Periksa koneksi kemudian coba muat ulang." onRetry={refetch} /></div>
          ) : (
        <div className="overflow-hidden">
          <table className="w-full table-fixed text-left text-sm text-slate-600" aria-label="Daftar unit pendidikan">
            <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="w-[5%] px-2 py-3 text-center">No</th>
                <th className="w-[28%] px-3 py-3 font-bold">Identitas Unit</th>
                <th className="hidden w-[15%] px-3 py-3 font-bold md:table-cell">Lokasi</th>
                <th className="hidden w-[20%] px-3 py-3 font-bold lg:table-cell">Pimpinan</th>
                <th className="hidden w-[13%] px-3 py-3 font-bold xl:table-cell">Statistik</th>
                <th className="hidden w-[10%] px-2 py-3 text-center font-bold sm:table-cell">Status</th>
                <th className="w-[19%] px-2 py-3 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td colSpan={7} className="px-4 py-4"><div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" /></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-5"><MasterEmptyState title="Belum ada unit pendidikan" description="Ubah filter pencarian atau tambahkan unit pendidikan baru." action={<MasterActionButton onClick={openAddModal}>Tambah Unit</MasterActionButton>} /></td>
                </tr>
              ) : (
                items.map((row, idx) => {
                  const style = getUnitBadgeStyle(row.unit_type)
                  return (
                    <tr key={row.id || idx} className="edu-row hover:bg-emerald-50/40 transition-colors" style={{ animationDelay: `${Math.min(idx, 8) * 35}ms` }}>
                      <td className="px-2 py-3 text-center text-xs font-bold text-slate-400">{(paginationInfo.from || 1) + idx}</td>
                      <td className="px-3 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          {row.logo_url ? (
                            <img src={row.logo_url} alt={row.name} className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm" />
                          ) : (
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-black shadow-sm ${style.bg} ${style.text}`}>{row.unit_type || 'UP'}</span>
                          )}
                          <span className="min-w-0">
                            <strong className="block truncate text-xs font-extrabold leading-5 text-slate-900 dark:text-white" title={row.name}>{row.name}</strong>
                            <span className="flex items-center gap-1.5">
                              <small className="truncate text-[9px] font-medium text-slate-400">{row.code || '-'}</small>
                              <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[8px] font-bold ${style.bg} ${style.text} ${style.border}`}>{row.unit_type || '-'}</span>
                            </span>
                            <small className="mt-0.5 block truncate text-[9px] text-slate-400 md:hidden">{row.city || '-'}, {row.province || '-'}</small>
                            <small className={`mt-0.5 text-[9px] font-bold sm:hidden ${row.is_active ? 'text-emerald-700' : 'text-rose-600'}`}>• {row.is_active ? 'Aktif' : 'Nonaktif'}</small>
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-3 py-3 md:table-cell">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200"><MapPin className="h-3.5 w-3.5 text-slate-400" />{row.city || '-'}</span>
                        <span className="mt-1 block pl-5 text-[10px] text-slate-500">{row.province || '-'}</span>
                      </td>
                      <td className="hidden px-3 py-3 lg:table-cell">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
                            {(row.principal_name || 'P').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <strong className="block truncate text-xs text-slate-800 dark:text-slate-100">{row.principal_name || '-'}</strong>
                            <small className="mt-0.5 block truncate text-[10px] text-slate-400">NIP. {row.principal_nip || '-'}</small>
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-3 py-3 xl:table-cell">
                        <div className="space-y-1 text-[10px] font-medium text-slate-500 dark:text-slate-300">
                          <span className="flex items-center gap-1.5"><GraduationCap className="h-3 w-3" />{(row.total_siswa || 0).toLocaleString('id-ID')} siswa</span>
                          <span className="flex items-center gap-1.5"><UsersRound className="h-3 w-3" />{(row.total_guru || 0).toLocaleString('id-ID')} guru</span>
                          <span className="flex items-center gap-1.5"><WalletCards className="h-3 w-3" />{(row.total_rombel || 0).toLocaleString('id-ID')} rombel</span>
                        </div>
                      </td>
                      <td className="hidden px-2 py-3 text-center sm:table-cell">
                        {row.is_active ? (
                          <MasterStatusBadge active />
                        ) : (
                          <MasterStatusBadge active={false} inactiveLabel="Nonaktif" />
                        )}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDetailUnit(row)}
                            title="Lihat detail"
                            aria-label={`Lihat detail ${row.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/20 dark:border-blue-800/70 dark:bg-blue-950/40 dark:text-blue-300"
                          >
                            <Eye className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => openEditModal(row)}
                            title="Edit unit"
                            aria-label={`Edit ${row.name}`}
                            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-500/20 sm:flex dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-300"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(row)
                              setHasConfirmedDeleteCheck(false)
                            }}
                            title="Hapus unit"
                            aria-label={`Hapus ${row.name}`}
                            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-rose-500/20 sm:flex dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
          )}

        {/* Pagination Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold">{paginationInfo.from}</span> sampai{' '}
            <span className="font-semibold">{paginationInfo.to}</span> dari{' '}
            <span className="font-semibold">{paginationInfo.total}</span> data
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 font-bold text-white">
              {page}
            </span>
            <button
              disabled={page >= paginationInfo.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-5" aria-label="Ringkasan unit pendidikan">
          <section className="edu-card rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><Building2 className="h-5 w-5" /></div>
              <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Unit</h2><p className="text-xs text-slate-500 dark:text-slate-400">Data halaman aktif</p></div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                ['Total Unit', paginationInfo.total, Building2, 'text-emerald-700 bg-emerald-50'],
                ['Unit Aktif', items.filter((item) => item.is_active).length, CheckCircle2, 'text-emerald-700 bg-emerald-50'],
                ['SD/MI', items.filter((item) => ['SDIT', 'MIT'].includes(item.unit_type)).length, School, 'text-emerald-700 bg-emerald-50'],
                ['Tenaga Pendidik', items.reduce((total, item) => total + (item.total_guru || 0), 0), UsersRound, 'text-blue-700 bg-blue-50'],
                ['Total Siswa', items.reduce((total, item) => total + (item.total_siswa || 0), 0), GraduationCap, 'text-blue-700 bg-blue-50'],
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
                ['Tambah Unit Pendidikan', Plus, openAddModal, 'text-emerald-700 bg-emerald-50'],
                ['Import Data Unit', Upload, () => setShowImportModal(true), 'text-blue-700 bg-blue-50'],
                ['Export Excel', FileSpreadsheet, handleExportExcel, 'text-emerald-700 bg-emerald-50'],
                ['Export PDF', FileText, () => { setExportFormat('pdf'); setShowExportModal(true) }, 'text-rose-600 bg-rose-50'],
                ['Lihat Statistik', GraduationCap, () => setShowStatisticsModal(true), 'text-violet-700 bg-violet-50'],
              ].map(([label, Icon, action, color]) => (
                <button key={label} type="button" onClick={action} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-left text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-emerald-950/40">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span>{label}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {showStatisticsModal && (
        <div
          className="education-unit-popup edu-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unit-statistics-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowStatisticsModal(false)
          }}
        >
          <section className="edu-modal my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="unit-statistics-title" className="text-base font-bold text-slate-900 dark:text-white">Statistik Unit Pendidikan</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ringkasan berdasarkan data dan filter yang sedang aktif.</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowStatisticsModal(false)} aria-label="Tutup statistik" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Total Unit', paginationInfo.total, Building2, 'bg-emerald-50 text-emerald-700'],
                ['Unit Aktif', items.filter((item) => item.is_active).length, CheckCircle2, 'bg-blue-50 text-blue-700'],
                ['Total Siswa', items.reduce((total, item) => total + (item.total_siswa || 0), 0), GraduationCap, 'bg-amber-50 text-amber-700'],
                ['Tenaga Pendidik', items.reduce((total, item) => total + (item.total_guru || 0), 0), UsersRound, 'bg-violet-50 text-violet-700'],
              ].map(([label, value, Icon, color]) => (
                <article key={label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}><Icon className="h-4 w-4" /></span>
                  <strong className="mt-3 block text-xl font-black tabular-nums text-slate-900 dark:text-white">{Number(value).toLocaleString('id-ID')}</strong>
                  <span className="mt-0.5 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</span>
                </article>
              ))}
            </div>

            <div className="px-5 pb-5">
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Distribusi Jenis Unit</h3>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-2">
                  {UNIT_TYPES.map((type) => {
                    const total = items.filter((item) => item.unit_type === type).length
                    const percentage = items.length ? Math.round((total / items.length) * 100) : 0
                    return (
                      <div key={type}>
                        <div className="mb-1.5 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{type}</span>
                          <strong className="text-slate-900 dark:text-white">{total} unit</strong>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                          <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <footer className="flex justify-end border-t border-slate-100 px-5 py-4 dark:border-slate-700">
              <button type="button" onClick={() => setShowStatisticsModal(false)} className="h-10 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white transition hover:bg-emerald-900">Tutup</button>
            </footer>
          </section>
        </div>
      )}

      {/* Tombol aksi tengah untuk tablet dan mobile */}
      <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileActions(true)}
          aria-label="Buka aksi Unit Pendidikan"
          className="flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-emerald-800 px-4 text-xs font-bold text-white shadow-xl shadow-emerald-950/25 transition active:scale-95"
        >
          <Menu className="h-5 w-5" />
          <span>Aksi</span>
        </button>
      </div>

      {showMobileActions && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/55 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-unit-actions-title">
          <section className="w-full rounded-t-2xl border-t border-slate-200 bg-white p-4 pb-7 shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 id="mobile-unit-actions-title" className="text-sm font-bold text-slate-900 dark:text-white">Aksi Unit Pendidikan</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pilih tindakan yang ingin dilakukan.</p>
              </div>
              <button type="button" onClick={() => setShowMobileActions(false)} aria-label="Tutup menu aksi" className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {[
                { label: 'Tambah', icon: Plus, action: openAddModal },
                { label: 'Lihat', icon: Eye, action: () => items[0] && setDetailUnit(items[0]), disabled: !items.length },
                { label: 'Edit', icon: Pencil, action: () => items[0] && openEditModal(items[0]), disabled: !items.length },
                { label: 'Export', icon: FileSpreadsheet, action: handleExportExcel },
                { label: 'Import', icon: Upload, action: () => setShowImportModal(true) },
              ].map(({ label, icon: Icon, action, disabled }) => (
                <button
                  key={label}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setShowMobileActions(false)
                    action()
                  }}
                  className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-700 transition active:scale-95 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                >
                  <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  {label}
                </button>
              ))}
            </div>
            {!!items.length && <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-400">Aksi Lihat dan Edit diterapkan pada unit pertama di daftar aktif.</p>}
          </section>
        </div>
      )}

      {/* Popup tambah / edit unit pendidikan */}
      {isFormModalOpen && (
        <div className="education-unit-popup edu-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="education-unit-form-title">
          <div className="edu-modal my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#1B2433]">
              <h2 id="education-unit-form-title" className="text-base font-bold text-slate-900 dark:text-white">
                {isEditMode ? 'Edit Unit Pendidikan' : 'Tambah Unit Pendidikan'}
              </h2>
              <button
                onClick={closeFormModal}
                aria-label="Tutup form unit pendidikan"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Main Body Grid */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* Left Column: Wizard Stepper */}
              <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 bg-white px-5 py-3 dark:border-slate-700 dark:bg-[#1B2433]">
                {[
                  { step: 1, label: 'Informasi Unit' },
                  { step: 2, label: 'Alamat' },
                  { step: 3, label: 'Kepala Sekolah' },
                  { step: 4, label: 'Konfirmasi' },
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className="group flex shrink-0 cursor-pointer items-center gap-2"
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                        currentStep === s.step
                          ? 'bg-[#054e3b] text-white shadow-md'
                          : currentStep > s.step
                            ? 'bg-[#086a52] text-white'
                            : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                      }`}
                    >
                      {s.step}
                    </div>
                    <span
                      className={`text-[10px] transition-colors ${
                        currentStep === s.step
                          ? 'font-extrabold text-[#054e3b]'
                          : 'font-semibold text-slate-500 group-hover:text-slate-800'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Main Column / Form Content */}
              <div className="max-h-[540px] overflow-y-auto p-5">
                {/* STEP 1: Informasi Unit */}
                {currentStep === 1 && (
                  <div key="unit-step-1" className="edu-step education-unit-form-grid gap-4">
                    <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2.5">
                      Informasi Unit
                    </h3>

                    {/* Foto Unit Upload Dropzone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Foto Unit</label>
                      {formData.logo_url ? (
                        <div className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                          <img src={formData.logo_url} alt="Logo Preview" className="h-16 w-16 rounded-xl object-cover border-2 border-[#054e3b] shadow-sm shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">Foto Unit Berhasil Diunggah</p>
                            <p className="text-[11px] text-slate-500">Foto akan tampil di tabel & detail unit</p>
                            <button
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, logo_url: '' }))}
                              className="text-xs font-bold text-rose-600 hover:underline mt-1 inline-block"
                            >
                              Hapus Foto & Unggah Ulang
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200/90 bg-[#f8fafc] p-6 text-center hover:bg-emerald-50/20 hover:border-emerald-400 cursor-pointer transition-all">
                          <Upload className="text-[#086a52] text-2xl mb-1.5" />
                          <span className="text-sm font-bold text-slate-800">Upload Foto</span>
                          <span className="text-xs text-slate-400 mt-0.5">PNG, JPG maksimal 2MB</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      )}
                    </div>

                    {/* Nama Unit */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Nama Unit Pendidikan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: SDIT 2 Dar el-Iman - Padang"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Jenis Unit */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Jenis Unit <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.unit_type}
                        onChange={(e) => setFormData((p) => ({ ...p, unit_type: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      >
                        <option value="">Pilih Jenis Unit</option>
                        {UNIT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* NPSN */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">NPSN (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Masukkan NPSN"
                        value={formData.npsn}
                        onChange={(e) => setFormData((p) => ({ ...p, npsn: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Email (Opsional)</label>
                      <input
                        type="email"
                        placeholder="Email unit pendidikan"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      />
                    </div>

                    {/* No Telepon */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">No. Telepon (Opsional)</label>
                      <input
                        type="text"
                        placeholder="08xx-xxxx-xxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Alamat */}
                {currentStep === 2 && (
                  <div key="unit-step-2" className="edu-step education-unit-form-grid gap-4">
                    <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2.5">Alamat Unit</h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Alamat Lengkap</label>
                      <textarea
                        rows={3}
                        placeholder="Jl. Khatib Sulaiman No. 10, Kel. Lolong Belanti..."
                        value={formData.address}
                        onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Kota / Kabupaten</label>
                        <input
                          type="text"
                          placeholder="Padang"
                          value={formData.city}
                          onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Provinsi</label>
                        <input
                          type="text"
                          placeholder="Sumatera Barat"
                          value={formData.province}
                          onChange={(e) => setFormData((p) => ({ ...p, province: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Kode Pos</label>
                      <input
                        type="text"
                        placeholder="25136"
                        value={formData.postal_code}
                        onChange={(e) => setFormData((p) => ({ ...p, postal_code: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Kepala Sekolah */}
                {currentStep === 3 && (
                  <div key="unit-step-3" className="edu-step education-unit-form-grid gap-4">
                    <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2.5">Kepala Sekolah / Pimpinan</h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Nama Kepala Sekolah / Pimpinan</label>
                      <input
                        type="text"
                        placeholder="Ust. Fadli Rahman, S.Pd"
                        value={formData.principal_name}
                        onChange={(e) => setFormData((p) => ({ ...p, principal_name: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">NIP / NIPY (Opsional)</label>
                      <input
                        type="text"
                        placeholder="1985xxxxxx"
                        value={formData.principal_nip}
                        onChange={(e) => setFormData((p) => ({ ...p, principal_nip: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Berdiri</label>
                        <input
                          type="number"
                          placeholder="2011"
                          value={formData.established_year}
                          onChange={(e) => setFormData((p) => ({ ...p, established_year: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Akreditasi</label>
                        <select
                          value={formData.accreditation}
                          onChange={(e) => setFormData((p) => ({ ...p, accreditation: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200/90 px-4 py-2.5 text-sm text-slate-800 focus:border-[#054e3b] focus:ring-2 focus:ring-[#054e3b]/10 focus:outline-none transition-all"
                        >
                          <option value="A">A (Unggul)</option>
                          <option value="B">B (Baik)</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Konfirmasi */}
                {currentStep === 4 && (
                  <div key="unit-step-4" className="edu-step space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2.5">Konfirmasi Data</h3>

                    <div className="rounded-2xl border border-slate-200/90 bg-[#f8fafc] p-4 space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-slate-500 font-medium">Nama Unit:</span>
                        <span className="font-bold text-slate-800">{formData.name || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-slate-500 font-medium">Jenis Unit:</span>
                        <span className="font-bold text-slate-800">{formData.unit_type || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-slate-500 font-medium">NPSN:</span>
                        <span className="font-bold text-slate-800">{formData.npsn || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-2">
                        <span className="text-slate-500 font-medium">Kota / Provinsi:</span>
                        <span className="font-bold text-slate-800">{formData.city}, {formData.province}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Kepala Sekolah:</span>
                        <span className="font-bold text-slate-800">{formData.principal_name || '-'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Action Footer (Persis Gambar UI/UX) */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3 dark:border-slate-700 dark:bg-[#1B2433]">
              <button
                type="button"
                onClick={closeFormModal}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="rounded-xl border border-[#054e3b] bg-white px-5 py-2.5 text-xs font-bold text-[#054e3b] hover:bg-emerald-50 transition-colors"
                >
                  Simpan Draft
                </button>
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
                    className="rounded-xl bg-[#054e3b] hover:bg-[#03382b] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-colors flex items-center gap-1"
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="rounded-xl bg-[#054e3b] hover:bg-[#03382b] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-colors flex items-center gap-1"
                  >
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan Unit'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup detail unit pendidikan */}
      {detailUnit && (
        <div className="education-unit-popup edu-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="education-unit-detail-title">
          <div className="edu-modal my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            {/* Top Action Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#1B2433]">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Detail Unit Pendidikan</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = detailUnit
                    setDetailUnit(null)
                    openEditModal(target)
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  <Pencil /> Edit
                </button>
                <button
                  onClick={() => { setExportFormat('pdf'); setShowExportModal(true) }}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <FileText className="text-red-500" /> Export PDF
                </button>
                <button type="button" onClick={() => setDetailUnit(null)} aria-label="Tutup detail unit pendidikan" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Hero Header Card */}
              <div className="flex flex-col md:flex-row gap-6 items-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {/* Building / Logo Preview */}
                <div className="h-36 w-full md:w-56 overflow-hidden rounded-xl bg-slate-200 flex items-center justify-center relative shrink-0">
                  {detailUnit.logo_url ? (
                    <img src={detailUnit.logo_url} alt={detailUnit.name} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                      <Building2 className="text-5xl text-slate-400" />
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded">
                        Gedung Utama
                      </span>
                    </>
                  )}
                </div>

                {/* Right Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 id="education-unit-detail-title" className="text-xl font-black text-slate-900">{detailUnit.name}</h2>
                    <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                      {detailUnit.unit_type || 'SDIT'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Status : <span className="font-bold">Aktif</span>
                  </div>
                  <p className="flex items-start gap-1.5 text-xs text-slate-500">
                    <MapPin className="mt-0.5 shrink-0 text-slate-400" />
                    {detailUnit.address || 'Alamat belum dilengkapi'}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                    <UsersRound className="h-4 w-4" aria-hidden="true" /> Kepala Sekolah : {detailUnit.principal_name || 'Belum ditentukan'}
                  </p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-6 overflow-x-auto border-b border-slate-200 text-xs font-bold text-slate-500">
                {['Informasi', 'Statistik', 'Guru', 'Siswa', 'Kelas', 'Dokumen', 'Riwayat'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(tab)}
                    className={`pb-3 transition-colors border-b-2 ${activeDetailTab === tab
                      ? 'border-emerald-800 text-emerald-900'
                      : 'border-transparent hover:text-slate-800'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content: Informasi */}
              {activeDetailTab === 'Informasi' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Detail Fields Grid */}
                  <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 text-sm">Informasi Unit</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Jenis Unit</span>
                        <span className="font-bold text-slate-800">{detailUnit.unit_type}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Tahun Berdiri</span>
                        <span className="font-bold text-slate-800">{detailUnit.established_year}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">NPSN</span>
                        <span className="font-bold text-slate-800">{detailUnit.npsn || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Status Akreditasi</span>
                        <span className="font-bold text-slate-800">{detailUnit.accreditation || 'A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Email</span>
                        <span className="font-bold text-slate-800">{detailUnit.email || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">SK Pendirian</span>
                        <span className="font-bold text-slate-800">{detailUnit.sk_pendirian || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">No. Telepon</span>
                        <span className="font-bold text-slate-800">{detailUnit.phone || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Tgl SK</span>
                        <span className="font-bold text-slate-800">{detailUnit.tgl_sk || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right 1 Col: Quick Stats Card */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 text-sm">Statistik Singkat</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                        <span className="flex items-center gap-2 text-slate-700"><GraduationCap className="text-blue-600" /> Siswa</span>
                        <span className="font-extrabold text-blue-900">{detailUnit.total_siswa?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                        <span className="flex items-center gap-2 text-slate-700"><UsersRound className="text-emerald-600" /> Guru</span>
                        <span className="font-extrabold text-emerald-900">{detailUnit.total_guru}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                        <span className="flex items-center gap-2 text-slate-700"><School className="text-amber-600" /> Kelas</span>
                        <span className="font-extrabold text-amber-900">{detailUnit.total_kelas}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50/60 border border-purple-100">
                        <span className="flex items-center gap-2 text-slate-700"><Building2 className="text-purple-600" /> Rombel</span>
                        <span className="font-extrabold text-purple-900">{detailUnit.total_rombel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab !== 'Informasi' && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Modul data {activeDetailTab} untuk unit ini siap digunakan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL KONFIRMASI HAPUS UNIT */}
      {deleteTarget && (
        <div className="edu-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="edu-modal w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
            {/* Header / Warning Icon */}
            <div className="p-6 text-center space-y-3 border-b border-slate-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-2xl">
                <AlertTriangle />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Hapus Unit Pendidikan</h3>
              <p className="text-xs text-slate-500">Apakah Anda yakin ingin menghapus unit pendidikan berikut?</p>
            </div>

            {/* Target Unit Card Preview */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-black text-white text-xs">
                  {deleteTarget.unit_type}
                </div>
                <div className="text-xs space-y-0.5">
                  <h4 className="font-extrabold text-slate-900">{deleteTarget.name}</h4>
                  <p className="text-slate-500">Jenis Unit: <span className="font-medium text-slate-700">{deleteTarget.unit_type}</span></p>
                  <p className="text-slate-500">Kota / Provinsi: <span className="font-medium text-slate-700">{deleteTarget.city}, {deleteTarget.province}</span></p>
                  <p className="text-slate-500">Kepala Sekolah: <span className="font-medium text-slate-700">{deleteTarget.principal_name}</span></p>
                </div>
              </div>

              {/* Danger Warning Alert Box */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 space-y-2">
                <p className="font-bold">Semua data yang terkait dengan unit ini akan terhapus permanen, termasuk:</p>
                <div className="grid grid-cols-2 gap-2 text-amber-800 font-medium">
                  <div className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> Data Siswa</div>
                  <div className="flex items-center gap-1.5"><UsersRound className="h-4 w-4" /> Data Guru</div>
                  <div className="flex items-center gap-1.5"><School className="h-4 w-4" /> Data Kelas</div>
                  <div className="flex items-center gap-1.5"><FolderOpen className="h-4 w-4" /> Laporan & Dokumen</div>
                  <div className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Absensi</div>
                  <div className="flex items-center gap-1.5"><WalletCards className="h-4 w-4" /> Data Keuangan</div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={hasConfirmedDeleteCheck}
                  onChange={(e) => setHasConfirmedDeleteCheck(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-800 focus:ring-emerald-600"
                />
                Saya memahami bahwa data tidak dapat dikembalikan.
              </label>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                disabled={!hasConfirmedDeleteCheck || deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="education-unit-popup edu-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="unit-export-title">
          <section className="edu-modal w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
              <div>
                <h2 id="unit-export-title" className="text-base font-bold text-slate-900 dark:text-white">Export Data Unit Pendidikan</h2>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Pilih format dan cakupan data yang akan diekspor.</p>
              </div>
              <button type="button" onClick={() => setShowExportModal(false)} aria-label="Tutup export" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
            </header>
            <div className="space-y-5 p-5">
              <div>
                <h3 className="mb-2 text-xs font-bold text-slate-800 dark:text-slate-100">Pilih Format Export</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['xlsx', 'Excel (.xlsx)', 'Pengolahan data', FileSpreadsheet],
                    ['csv', 'CSV (.csv)', 'Kompatibilitas', FileText],
                    ['pdf', 'PDF (.pdf)', 'Siap cetak', FileText],
                  ].map(([value, label, description, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setExportFormat(value)}
                      className={`rounded-xl border p-3 text-left transition ${exportFormat === value ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/10 dark:bg-emerald-950/30' : 'border-slate-200 hover:border-emerald-200 dark:border-slate-700'}`}
                    >
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white"><Icon className={`h-4 w-4 ${exportFormat === value ? 'text-emerald-700' : 'text-slate-400'}`} />{label}</span>
                      <small className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">{description}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <h3 className="mb-3 text-xs font-bold text-slate-800 dark:text-slate-100">Opsi Export</h3>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-700" /> Export semua data sesuai filter aktif
                </label>
                <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <input type="checkbox" className="h-4 w-4 accent-emerald-700" /> Sertakan statistik siswa, guru, dan rombel
                </label>
              </div>
            </div>
            <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-700">
              <button type="button" onClick={() => setShowExportModal(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Batal</button>
              <button type="button" onClick={handleProcessExport} className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white hover:bg-emerald-900"><Download className="h-4 w-4" />Export</button>
            </footer>
          </section>
        </div>
      )}

      {/* POP UP MODAL: DASHBOARD IMPORT DATA UNIT PENDIDIKAN */}
      {showImportModal && (
        <div className="education-unit-popup edu-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="unit-import-title">
          <div className="edu-modal w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#1B2433]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Upload className="text-base" />
                </div>
                <div>
                  <h2 id="unit-import-title" className="text-base font-bold text-slate-900 dark:text-white">Import Data Unit Pendidikan</h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Unggah file Excel atau CSV sesuai template sistem.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowImportModal(false); setImportFile(null); setImportPreviewData([]); setImportedData([]) }}
                aria-label="Tutup import data"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
              {/* Step 1: Download Template */}
              <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="text-2xl text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Unduh Format Template Import</h4>
                    <p className="text-[11px] text-slate-500">Gunakan template agar kolom sesuai dengan sistem.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplateUnit}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-white px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
                >
                  <Download className="text-emerald-600" /> Unduh Template
                </button>
              </div>

              {/* Step 2: Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Unggah File (Excel / CSV)</label>
                <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40 dark:border-slate-600 dark:bg-slate-800/40">
                  <Upload className="text-3xl text-emerald-700 mb-2" />
                  <span className="text-xs font-bold text-slate-800">
                    {importFile ? importFile.name : 'Drag & drop file Excel atau CSV di sini'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {importFile ? `${(importFile.size / 1024).toFixed(1)} KB • siap diperiksa` : 'atau klik untuk memilih file • maks. 5MB'}
                  </span>
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Step 3: Preview Table */}
              {(importPreviewData.length > 0 || importedData.length > 0) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                      {importedData.length > 0 ? `Data Berhasil Diimpor (${importedData.length} baris)` : `Preview Data Siap Diimpor (${importPreviewData.length} baris)`}
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {importedData.length > 0 ? 'Import Berhasil' : 'Format Sesuai'}
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                        <tr>
                          <th className="py-2 px-3">Kode</th>
                          <th className="py-2 px-3">Nama Unit</th>
                          <th className="py-2 px-3">Tingkat</th>
                          <th className="py-2 px-3">NPSN</th>
                          <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(importedData.length > 0 ? importedData : importPreviewData).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-medium">{row.kode}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{row.nama}</td>
                            <td className="py-2 px-3">{row.tingkat}</td>
                            <td className="py-2 px-3 font-semibold">{row.npsn}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3 dark:border-slate-700 dark:bg-[#1B2433]">
              <button
                type="button"
                onClick={() => { setShowImportModal(false); setImportFile(null); setImportPreviewData([]); setImportedData([]) }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {importedData.length > 0 ? 'Tutup' : 'Batal'}
              </button>
              <button
                type="button"
                disabled={!importFile || isImporting || importedData.length > 0}
                onClick={handleProcessImport}
                className="flex items-center gap-2 rounded-xl bg-[#064e3b] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800 disabled:opacity-50 transition"
              >
                {isImporting ? 'Memproses Import...' : importedData.length > 0 ? 'Import Selesai' : 'Proses Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="pointer-events-none fixed bottom-5 right-5 z-[70] grid w-[min(360px,calc(100vw-2rem))] gap-2" aria-live="polite" aria-label="Notifikasi sistem">
        {notifications.map((notification) => (
          <article key={notification.id} className={`pointer-events-auto edu-toast flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl dark:bg-[#1B2433] ${notification.tone === 'danger' ? 'border-rose-200' : 'border-emerald-200'}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${notification.tone === 'danger' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {notification.tone === 'danger' ? <Trash2 className="h-4 w-4" /> : <CheckCircle2 className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">{notification.title}</strong>
              <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{notification.message}</p>
            </div>
            <button type="button" onClick={() => setNotifications((current) => current.filter((item) => item.id !== notification.id))} aria-label="Tutup notifikasi" className="text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>
          </article>
        ))}
      </section>
    </MasterDataPage>
  )
}
