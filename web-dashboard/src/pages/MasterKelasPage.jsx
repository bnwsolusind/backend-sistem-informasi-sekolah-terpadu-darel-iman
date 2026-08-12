import { useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  School,
  Users,
  UserCheck,
  Plus,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react'
import { kelasService } from '../services/kelasService'
import { ActionDropdown, AppBadge, PersonIdentityCell } from '../components/app'
import {
  MasterActionButton,
  MasterDataSection,
  MasterDataPage,
  MasterPageHeader,
  MasterStatsGrid,
  MasterStatCard,
  MasterFilterSelect,
  MasterFormModal,
  MasterDetailModal,
  MasterDeleteDialog,
} from '../components/master-data'

const UNIT_COLORS = {
  TKIT: { bg: 'bg-emerald-800', text: 'text-white', border: 'border-emerald-700' },
  TAUD: { bg: 'bg-emerald-700', text: 'text-white', border: 'border-emerald-600' },
  SDIT: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-500' },
  MIT: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-400' },
  SMPIT: { bg: 'bg-cyan-600', text: 'text-white', border: 'border-cyan-500' },
  SMAIT: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-500' },
  MA: { bg: 'bg-purple-700', text: 'text-white', border: 'border-purple-600' },
  PONPES: { bg: 'bg-emerald-900', text: 'text-white', border: 'border-emerald-800' },
  Mahad: { bg: 'bg-amber-800', text: 'text-white', border: 'border-amber-700' },
}

const EMPTY_OPTIONS = []
const DEFAULT_JENJANG = ['TKIT', 'SDIT', 'SMPIT', 'SMAIT', 'MIT', 'MA']
const DEFAULT_TINGKAT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

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
    unit_pendidikan_id: '',
    tahun_ajaran_id: '',
    semester_id: '',
    jenjang: 'SDIT',
    tingkat: '1',
    kode_kelas: '',
    nama_kelas: '',
    wali_kelas_id: '',
    kapasitas: 30,
    ruangan: '',
    status: 'Aktif',
  }
}

export default function MasterKelasPage() {
  const queryClient = useQueryClient()

  // State Filter & Search
  const [search, setSearch] = useState('')
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('')
  const [selectedTahunFilter, setSelectedTahunFilter] = useState('')
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('')
  const [selectedJenjangFilter, setSelectedJenjangFilter] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  // Modal Form State Wizard
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialFormState())
  const [formErrors, setFormErrors] = useState({})

  // Modal Detail & Delete State
  const [detailKelas, setDetailKelas] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Options Query
  const { data: optionsData } = useQuery({
    queryKey: ['kelas-options'],
    queryFn: () => kelasService.getOptions(),
  })

  const masterUnits = optionsData?.units || EMPTY_OPTIONS
  const masterTahunAjaran = optionsData?.tahun_ajaran || EMPTY_OPTIONS
  const masterSemesters = optionsData?.semesters || EMPTY_OPTIONS
  const masterEmployees = optionsData?.employees || optionsData?.guru || EMPTY_OPTIONS
  const masterJenjang = optionsData?.jenjang || DEFAULT_JENJANG
  const masterTingkat = optionsData?.tingkat || DEFAULT_TINGKAT

  const availableSemestersForm = useMemo(() => {
    if (!formData.tahun_ajaran_id) return masterSemesters
    return masterSemesters.filter((s) => s.academic_year_id === formData.tahun_ajaran_id)
  }, [masterSemesters, formData.tahun_ajaran_id])

  const filteredEmployeesForm = useMemo(() => {
    if (!formData.unit_pendidikan_id) return masterEmployees
    return masterEmployees.filter((e) => !e.unit_id || e.unit_id === formData.unit_pendidikan_id)
  }, [masterEmployees, formData.unit_pendidikan_id])

  // Fetch Lista Kelas
  const {
    data: classData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'kelas-list',
      page,
      search,
      selectedUnitFilter,
      selectedTahunFilter,
      selectedSemesterFilter,
      selectedJenjangFilter,
      selectedStatusFilter,
    ],
    queryFn: () =>
      kelasService.getDaftar({
        page,
        per_page: 10,
        search: search || undefined,
        unit_pendidikan_id: selectedUnitFilter || undefined,
        tahun_ajaran_id: selectedTahunFilter || undefined,
        semester_id: selectedSemesterFilter || undefined,
        jenjang: selectedJenjangFilter || undefined,
        status: selectedStatusFilter || undefined,
      }),
  })

  const rawList = classData?.data || []
  const stats = classData?.statistik || {
    total_kelas: 0,
    total_aktif: 0,
    wali_terisi: 0,
    total_kapasitas: 0,
  }

  const paginationInfo = {
    total: classData?.meta?.total || rawList.length,
    from: classData?.meta?.from || (rawList.length > 0 ? 1 : 0),
    to: classData?.meta?.to || rawList.length,
    last_page: classData?.meta?.last_page || 1,
    current_page: classData?.meta?.current_page || 1,
    per_page: classData?.meta?.per_page || 10,
  }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload) => kelasService.tambah(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas-list'] })
      queryClient.invalidateQueries({ queryKey: ['kelas-options'] })
      Swal.fire({ title: 'Berhasil!', text: 'Data kelas/rombel baru berhasil ditambahkan.', icon: 'success', confirmColor: '#065F46' })
      closeFormModal()
    },
    onError: (err) => {
      const respErrors = err?.response?.data?.errors || {}
      setFormErrors(respErrors)
      Swal.fire('Gagal!', err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data kelas.', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => kelasService.ubah({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas-list'] })
      Swal.fire({ title: 'Berhasil!', text: 'Data kelas/rombel berhasil diperbarui.', icon: 'success', confirmColor: '#065F46' })
      closeFormModal()
    },
    onError: (err) => {
      const respErrors = err?.response?.data?.errors || {}
      setFormErrors(respErrors)
      Swal.fire('Gagal!', err?.response?.data?.message || 'Terjadi kesalahan saat memperbarui data.', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => kelasService.hapus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas-list'] })
      setIsDeleteModalOpen(false)
      setDeleteTarget(null)
      Swal.fire({ title: 'Terhapus!', text: 'Data kelas berhasil dihapus (soft delete).', icon: 'success', confirmColor: '#065F46' })
    },
    onError: (err) => {
      Swal.fire('Gagal!', err?.response?.data?.message || 'Gagal menghapus data kelas.', 'error')
    },
  })

  // Handlers
  const openCreateModal = () => {
    setIsEditMode(false)
    setCurrentStep(1)
    setFormErrors({})
    const defaultUnit = masterUnits[0]?.id || ''
    const defaultTahun = masterTahunAjaran.find((t) => t.is_active)?.id || masterTahunAjaran[0]?.id || ''
    const defaultSem = masterSemesters.find((s) => s.is_active)?.id || masterSemesters[0]?.id || ''
    setFormData({ ...initialFormState(), unit_pendidikan_id: defaultUnit, tahun_ajaran_id: defaultTahun, semester_id: defaultSem })
    setIsFormModalOpen(true)
  }

  const openEditModal = (item) => {
    setIsEditMode(true)
    setCurrentStep(1)
    setFormErrors({})
    setFormData({
      id: item.id,
      unit_pendidikan_id: item.unit_pendidikan_id || '',
      tahun_ajaran_id: item.tahun_ajaran_id || '',
      semester_id: item.semester_id || '',
      jenjang: item.jenjang || 'SDIT',
      tingkat: item.tingkat || '1',
      kode_kelas: item.kode_kelas || '',
      nama_kelas: item.nama_kelas || '',
      wali_kelas_id: item.wali_kelas_id || '',
      kapasitas: item.kapasitas || 30,
      ruangan: item.ruangan || '',
      status: item.status || 'Aktif',
    })
    setIsFormModalOpen(true)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    setFormData(initialFormState())
    setFormErrors({})
    setCurrentStep(1)
  }

  const handleNextStep = () => {
    setFormErrors({})
    if (currentStep === 1) {
      if (!formData.unit_pendidikan_id) return setFormErrors({ unit_pendidikan_id: ['Pilih Unit Pendidikan terlebih dahulu.'] })
      if (!formData.tahun_ajaran_id) return setFormErrors({ tahun_ajaran_id: ['Pilih Tahun Ajaran terlebih dahulu.'] })
    } else if (currentStep === 2) {
      if (!formData.semester_id) return setFormErrors({ semester_id: ['Pilih Semester terlebih dahulu.'] })
      if (!formData.jenjang || !formData.tingkat) return setFormErrors({ jenjang: ['Lengkapi jenjang dan tingkat kelas.'] })
    } else if (currentStep === 3) {
      if (!formData.nama_kelas.trim()) return setFormErrors({ nama_kelas: ['Nama kelas wajib diisi.'] })
      if (!formData.kode_kelas.trim()) return setFormErrors({ kode_kelas: ['Kode kelas wajib diisi.'] })
      if (Number(formData.kapasitas) < 1) return setFormErrors({ kapasitas: ['Kapasitas minimal 1 siswa.'] })
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handleSubmitForm = (e) => {
    e?.preventDefault()
    if (isEditMode) {
      updateMutation.mutate({ id: formData.id, payload: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleExportExcel = () => {
    if (rawList.length === 0) return Swal.fire('Informasi', 'Tidak ada data kelas untuk diexport.', 'info')
    const headers = ['No', 'Kode Kelas', 'Nama Kelas', 'Jenjang', 'Tingkat', 'Wali Kelas', 'Jumlah Siswa', 'Kapasitas', 'Ruangan', 'Status']
    const csvRows = rawList.map((item, index) => [
      index + 1,
      `"${item.kode_kelas || ''}"`,
      `"${item.nama_kelas || ''}"`,
      `"${item.jenjang || ''}"`,
      `"${item.tingkat || ''}"`,
      `"${item.wali_kelas?.nama_tampil || '-'}"`,
      item.jumlah_siswa || 0,
      item.kapasitas || 30,
      `"${item.ruangan || '-'}"`,
      `"${item.status || ''}"`,
    ])
    const csvContent = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Data_Master_Kelas_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedUnitFilter('')
    setSelectedTahunFilter('')
    setSelectedSemesterFilter('')
    setSelectedJenjangFilter('')
    setSelectedStatusFilter('')
    setPage(1)
  }

  return (
    <MasterDataPage className="education-unit-page" hideBreadcrumb>
      {/* Header Banner */}
      <MasterPageHeader
        icon={School}
        title="Data Kelas & Rombongan Belajar"
        description="Kelola seluruh rombongan belajar, penugasan wali kelas, alokasi ruangan, dan kapasitas siswa di lingkungan Yayasan."
        actions={
          <>
            <MasterActionButton variant="export" icon={FileSpreadsheet} onClick={handleExportExcel}>Export</MasterActionButton>
            <MasterActionButton icon={Plus} onClick={openCreateModal}>Tambah Kelas</MasterActionButton>
          </>
        }
      />

      {/* Ringkasan Stats */}
      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={School} label="TOTAL KELAS" value={stats.total_kelas} description="Rombongan belajar terdaftar" variant="success" loading={isLoading} />
        <MasterStatCard icon={CheckCircle2} label="KELAS AKTIF" value={stats.total_aktif} description="Status operasional aktif" variant="info" loading={isLoading} />
        <MasterStatCard icon={UserCheck} label="WALI KELAS TERISI" value={stats.wali_terisi} description="Memiliki wali kelas" variant="warning" loading={isLoading} />
        <MasterStatCard icon={Users} label="TOTAL KAPASITAS" value={stats.total_kapasitas} description="Total kuota tempat duduk" variant="neutral" loading={isLoading} />
      </MasterStatsGrid>

      <MasterDataSection
        title="Daftar Kelas & Rombel"
        description="Data kelas sesuai periode, unit, jenjang, dan status yang dipilih."
        countLabel={`${Number(paginationInfo.total).toLocaleString('id-ID')} kelas`}
        search={{
          value: search,
          onValueChange: (value) => { setSearch(value); setPage(1) },
          placeholder: 'Cari kode kelas, nama kelas, atau nama wali kelas...',
          'aria-label': 'Cari kelas atau rombongan belajar',
        }}
        filters={
          <>
            <MasterFilterSelect aria-label="Filter unit pendidikan" value={selectedUnitFilter} onChange={(e) => { setSelectedUnitFilter(e.target.value); setPage(1) }}>
              <option value="">Semua Unit Pendidikan</option>
              {masterUnits.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
            </MasterFilterSelect>
            <MasterFilterSelect aria-label="Filter tahun ajaran" value={selectedTahunFilter} onChange={(e) => { setSelectedTahunFilter(e.target.value); setSelectedSemesterFilter(''); setPage(1) }}>
              <option value="">Semua Tahun Ajaran</option>
              {masterTahunAjaran.map((tahun) => (<option key={tahun.id} value={tahun.id}>{tahun.name}</option>))}
            </MasterFilterSelect>
            <MasterFilterSelect aria-label="Filter semester" value={selectedSemesterFilter} onChange={(e) => { setSelectedSemesterFilter(e.target.value); setPage(1) }}>
              <option value="">Semua Semester</option>
              {masterSemesters
                .filter((semester) => !selectedTahunFilter || semester.academic_year_id === selectedTahunFilter)
                .map((semester) => (<option key={semester.id} value={semester.id}>{semester.name}</option>))}
            </MasterFilterSelect>
            <MasterFilterSelect aria-label="Filter jenjang" value={selectedJenjangFilter} onChange={(e) => { setSelectedJenjangFilter(e.target.value); setPage(1) }}>
              <option value="">Semua Jenjang</option>
              {masterJenjang.map((jenjang) => (<option key={jenjang} value={jenjang}>{jenjang}</option>))}
            </MasterFilterSelect>
            <MasterFilterSelect aria-label="Filter status" value={selectedStatusFilter} onChange={(e) => { setSelectedStatusFilter(e.target.value); setPage(1) }}>
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </MasterFilterSelect>
          </>
        }
        onReset={resetFilters}
        resetDisabled={!search && !selectedUnitFilter && !selectedTahunFilter && !selectedSemesterFilter && !selectedJenjangFilter && !selectedStatusFilter}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        isEmpty={!isLoading && !isError && rawList.length === 0}
        emptyTitle="Data Kelas Tidak Ditemukan"
        emptyDescription="Belum ada data rombongan belajar yang sesuai dengan kriteria filter Anda."
        pagination={{ meta: paginationInfo, page, onPageChange: setPage }}
        ariaLabel="Data kelas dan rombongan belajar"
      >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F4EB] dark:bg-slate-900/80 text-gray-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-800">
                <th className="py-4 px-4 w-12 text-center">NO</th>
                <th className="py-4 px-4 w-14 text-center">LOGO</th>
                <th className="py-4 px-4">KODE & KELAS</th>
                <th className="py-4 px-4">JENJANG / TINGKAT</th>
                <th className="py-4 px-4">UNIT PENDIDIKAN</th>
                <th className="py-4 px-4">WALI KELAS</th>
                <th className="py-4 px-4">KAPASITAS & RUANGAN</th>
                <th className="py-4 px-4 text-center">STATUS</th>
                <th className="py-4 px-4 text-center w-36">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs font-medium">
              {rawList.map((item, index) => {
                const styleUnit = getUnitBadgeStyle(item.jenjang || item.unit_pendidikan?.level)
                const recordNo = (paginationInfo.current_page - 1) * 10 + index + 1

                return (
                  <tr key={item.id} className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    {/* NO */}
                    <td className="py-4 px-4 text-center text-gray-500 dark:text-slate-400 font-bold">
                      {recordNo}
                    </td>

                    {/* LOGO */}
                    <td className="py-4 px-4 text-center">
                      <div className={`w-9 h-9 rounded-full ${styleUnit.bg} ${styleUnit.text} font-black text-xs flex items-center justify-center shadow-xs mx-auto border ${styleUnit.border}`}>
                        {(item.jenjang || item.unit_pendidikan?.level || 'SD').slice(0, 3)}
                      </div>
                    </td>

                    {/* KODE & KELAS */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{item.nama_kelas}</div>
                      <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{item.kode_kelas}</div>
                    </td>

                    {/* JENJANG / TINGKAT */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${styleUnit.bg} ${styleUnit.text} ${styleUnit.border}`}>
                        {item.jenjang} - Tkt {item.tingkat}
                      </span>
                    </td>

                    {/* UNIT PENDIDIKAN */}
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {item.unit_pendidikan?.name || '-'}
                    </td>

                    {/* WALI KELAS */}
                    <td className="py-4 px-4">
                      <PersonIdentityCell
                        src={item.wali_kelas?.photo_url || item.wali_kelas?.avatar_url || item.wali_kelas?.foto}
                        name={item.wali_kelas?.nama_tampil || item.wali_kelas?.name || 'Belum diatur'}
                        subtitle={item.wali_kelas?.niy ? `NIY ${item.wali_kelas.niy}` : 'Wali kelas'}
                      />
                    </td>

                    {/* KAPASITAS & RUANGAN */}
                    <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-300">
                      <div><strong className="text-slate-900 dark:text-white font-bold">{item.jumlah_siswa || 0}</strong> / {item.kapasitas || 30} Siswa</div>
                      <div className="text-slate-500 dark:text-slate-400 font-medium">Ruang: {item.ruangan || '-'}</div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-4 text-center">
                      <AppBadge variant={item.status === 'Aktif' ? 'success' : 'neutral'} dot>
                        {item.status || 'Tidak Aktif'}
                      </AppBadge>
                    </td>

                    {/* AKSI */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex justify-center">
                        <ActionDropdown
                          onView={() => { setDetailKelas(item); setIsDetailModalOpen(true) }}
                          onEdit={() => openEditModal(item)}
                          onDelete={() => { setDeleteTarget(item); setIsDeleteModalOpen(true) }}
                        />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </MasterDataSection>

      {/* Form Modal Wizard */}
      <MasterFormModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        icon={School}
        title={isEditMode ? 'Edit Data Rombongan Belajar' : 'Tambah Rombongan Belajar Baru'}
        description={`Langkah ${currentStep} dari 4: Selesaikan pembuatan data kelas.`}
        footer={
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Kembali
            </button>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-emerald-800 px-5 text-xs font-semibold text-white hover:bg-emerald-900"
              >
                Lanjut <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitForm}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-800 px-6 text-xs font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> {isEditMode ? 'Simpan Perubahan' : 'Simpan Kelas'}
              </button>
            )}
          </div>
        }
      >
        <div className="p-6 space-y-5">
          {/* Stepper Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${currentStep === step ? 'bg-emerald-800 text-white' : currentStep > step ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                  {step}
                </div>
                <span className={`hidden text-xs font-semibold sm:inline ${currentStep === step ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step === 1 ? 'Unit & TA' : step === 2 ? 'Semester & Jenjang' : step === 3 ? 'Info Kelas' : 'Wali & Ruangan'}
                </span>
              </div>
            ))}
          </div>

          {/* Form Step Contents */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Unit Pendidikan *</label>
                <select
                  value={formData.unit_pendidikan_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, unit_pendidikan_id: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                >
                  <option value="">-- Pilih Unit Pendidikan --</option>
                  {masterUnits.map((u) => (<option key={u.id} value={u.id}>{u.name} ({u.level})</option>))}
                </select>
                {formErrors.unit_pendidikan_id && <p className="mt-1 text-xs text-rose-600">{formErrors.unit_pendidikan_id[0]}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Tahun Ajaran *</label>
                <select
                  value={formData.tahun_ajaran_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tahun_ajaran_id: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                >
                  <option value="">-- Pilih Tahun Ajaran --</option>
                  {masterTahunAjaran.map((t) => (<option key={t.id} value={t.id}>{t.name} {t.is_active ? '(Aktif)' : ''}</option>))}
                </select>
                {formErrors.tahun_ajaran_id && <p className="mt-1 text-xs text-rose-600">{formErrors.tahun_ajaran_id[0]}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Semester *</label>
                <select
                  value={formData.semester_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, semester_id: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                >
                  <option value="">-- Pilih Semester --</option>
                  {availableSemestersForm.map((s) => (<option key={s.id} value={s.id}>{s.name} ({s.academic_year_name || 'TA'})</option>))}
                </select>
                {formErrors.semester_id && <p className="mt-1 text-xs text-rose-600">{formErrors.semester_id[0]}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Jenjang *</label>
                  <select
                    value={formData.jenjang}
                    onChange={(e) => setFormData((prev) => ({ ...prev, jenjang: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                  >
                    {masterJenjang.map((j) => (<option key={j} value={j}>{j}</option>))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Tingkat Kelas *</label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tingkat: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                  >
                    {masterTingkat.map((t) => (<option key={t} value={t}>Tingkat {t}</option>))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Nama Kelas / Rombel *</label>
                <input
                  type="text"
                  value={formData.nama_kelas}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nama_kelas: e.target.value }))}
                  placeholder="Contoh: 7-A Tahfizh, Kelas 1 Binar"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                />
                {formErrors.nama_kelas && <p className="mt-1 text-xs text-rose-600">{formErrors.nama_kelas[0]}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Kode Kelas (Unique) *</label>
                <input
                  type="text"
                  value={formData.kode_kelas}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kode_kelas: e.target.value }))}
                  placeholder="Contoh: KLS-7A-SMP"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                />
                {formErrors.kode_kelas && <p className="mt-1 text-xs text-rose-600">{formErrors.kode_kelas[0]}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Kapasitas Maksimal Siswa</label>
                <input
                  type="number"
                  value={formData.kapasitas}
                  onChange={(e) => setFormData((prev) => ({ ...prev, kapasitas: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Penugasan Wali Kelas</label>
                <select
                  value={formData.wali_kelas_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wali_kelas_id: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                >
                  <option value="">-- Pilih Wali Kelas (Opsional) --</option>
                  {filteredEmployeesForm.map((emp) => (<option key={emp.id} value={emp.id}>{emp.nama_tampil || emp.name}</option>))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Lokasi Ruangan</label>
                <input
                  type="text"
                  value={formData.ruangan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ruangan: e.target.value }))}
                  placeholder="Contoh: Gedung Al-Farabi Lt. 2 (R-204)"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Status Operasional</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </MasterFormModal>

      {/* Detail Modal */}
      <MasterDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        icon={School}
        title="Detail Rombongan Belajar"
        description="Informasi spesifikasi kelas, unit pendidikan, dan wali kelas"
      >
        {detailKelas && (
          <div className="p-6 space-y-4 text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-lg font-bold text-slate-900">{detailKelas.nama_kelas}</h3>
              <p className="font-mono text-xs font-bold text-emerald-800 mt-0.5">{detailKelas.kode_kelas}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-bold text-slate-400 uppercase">Unit Pendidikan</p>
                <p className="font-semibold text-slate-800 mt-1">{detailKelas.unit_pendidikan?.name || '-'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-bold text-slate-400 uppercase">Jenjang & Tingkat</p>
                <p className="font-semibold text-slate-800 mt-1">{detailKelas.jenjang} - Tingkat {detailKelas.tingkat}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-bold text-slate-400 uppercase">Wali Kelas</p>
                <p className="font-semibold text-emerald-800 mt-1">{detailKelas.wali_kelas?.nama_tampil || detailKelas.wali_kelas?.name || 'Belum ditugaskan'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-bold text-slate-400 uppercase">Kapasitas / Terisi</p>
                <p className="font-semibold text-slate-800 mt-1">{detailKelas.jumlah_siswa || 0} / {detailKelas.kapasitas || 30} Siswa</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Lokasi Ruangan</p>
                <p className="font-semibold text-slate-800 mt-1">{detailKelas.ruangan || 'Belum diatur'}</p>
              </div>
            </div>
          </div>
        )}
      </MasterDetailModal>

      {/* Delete Confirmation */}
      <MasterDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeleteTarget(null) }}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isLoading={deleteMutation.isPending}
        title="Hapus Data Kelas?"
        description={`Apakah Anda yakin ingin menghapus data kelas ${deleteTarget?.nama_kelas}? Data akan dimasukkan ke arsip soft delete.`}
      />
    </MasterDataPage>
  )
}
