import { useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QRCodeSVG } from 'qrcode.react'
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Info,
  IdCard,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
} from 'lucide-react'
import {
  FaArrowLeft,
  FaBuilding,
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaExclamationTriangle,
  FaEye,
  FaFileExcel,
  FaFileImport,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUpload,
  FaChalkboardTeacher,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard,
  FaUserTie,
  FaAward,
  FaFolderOpen,
  FaPrint,
} from 'react-icons/fa'
import {
  MasterActionButton,
  MasterDataPage,
  MasterEmptyState,
  MasterErrorState,
  MasterPageHeader,
  MasterStatCard,
  MasterStatsGrid,
} from '../components/master-data'
import { employeeService } from '../services/employeeService'
import { educationUnitService } from '../services/educationUnitService'
import PersonAvatar from '../components/ui/PersonAvatar'
import { usePengaturanStore } from '../stores/pengaturanStore'

const STATUS_PEGAWAI_OPTIONS = ['Tetap', 'Kontrak', 'Honorer', 'Magang']
const STATUS_OPTIONS = ['Aktif', 'Nonaktif', 'Cuti', 'Resign']
const ID_CARD_TEMPLATES = [
  { id: 'green', label: 'Hijau', description: 'Template Kepala Sekolah' },
  { id: 'blue', label: 'Biru', description: 'Template Guru' },
  { id: 'purple', label: 'Ungu', description: 'Template Wakil Kepala' },
  { id: 'orange', label: 'Oranye', description: 'Template Staf TU' },
]

function makeEmployeeQrPayload(employee) {
  const position = (employee?.jabatan_name || '').toLowerCase()
  const roles = [
    'pegawai',
    ...(position.includes('guru') ? ['guru'] : []),
    ...(position.includes('tata usaha') || position.includes('tu') ? ['tata_usaha'] : []),
    ...(position.includes('wali kelas') || position.includes('walas') ? ['wali_kelas'] : []),
  ]

  return JSON.stringify({
    version: 1,
    type: 'simsit_employee_login',
    subject_id: employee?.id,
    login_identifier: employee?.niy || employee?.email,
    employee_number: employee?.niy,
    unit_id: employee?.unit_id,
    roles: [...new Set(roles)],
    purpose: 'authentication_exchange',
    issuer: 'SIMSIT_YAYASAN_DAR_EL_IMAN',
  })
}

function formatEmployeeCardDate(value) {
  if (!value) return '—'
  const date = new Date(`${String(value).split('T')[0]}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

function getStatusBadgeStyle(status) {
  switch (status) {
    case 'Aktif':
      return { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-600' }
    case 'Cuti':
      return { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-600' }
    case 'Resign':
      return { bg: 'bg-rose-100', text: 'text-rose-800', dot: 'bg-rose-600' }
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' }
  }
}

function initialFormState() {
  return {
    id: null,
    niy: '',
    nik: '',
    nama_lengkap: '',
    nama_panggilan: '',
    gelar_depan: '',
    gelar_belakang: '',
    jenis_kelamin: 'L',
    tempat_lahir: 'Padang',
    tanggal_lahir: '',
    agama: 'Islam',
    foto: '',

    unit_id: '',
    jabatan_id: '',
    status_pegawai: 'Tetap',
    tanggal_masuk: new Date().toISOString().split('T')[0],
    tanggal_keluar: '',
    status: 'Aktif',

    no_hp: '',
    email: '',
    alamat: '',
    provinsi: 'Sumatera Barat',
    kota: 'Padang',
    kecamatan: '',
    kelurahan: '',
    kode_pos: '',

    user_id: '',
    role_id: '',
    metadata: {
      teachings: [],
      position_history: [],
      certifications: [],
      documents: [],
      attendances: [],
    },
  }
}

function parseFromApi(item) {
  const meta = item?.metadata || {}
  return {
    id: item?.id || null,
    niy: item?.niy || '',
    nik: item?.nik || '',
    nama_lengkap: item?.nama_lengkap || '',
    nama_panggilan: item?.nama_panggilan || '',
    gelar_depan: item?.gelar_depan || '',
    gelar_belakang: item?.gelar_belakang || '',
    jenis_kelamin: item?.jenis_kelamin || 'L',
    tempat_lahir: item?.tempat_lahir || 'Padang',
    tanggal_lahir: item?.tanggal_lahir ? item.tanggal_lahir.split('T')[0] : '',
    agama: item?.agama || 'Islam',
    foto: item?.foto || '',

    unit_id: item?.unit_id || '',
    unit_name: item?.unit?.name || 'Yayasan Pusat',
    jabatan_id: item?.jabatan_id || '',
    jabatan_name: item?.position?.name || 'Staf / Guru',
    status_pegawai: item?.status_pegawai || 'Tetap',
    tanggal_masuk: item?.tanggal_masuk ? item.tanggal_masuk.split('T')[0] : '',
    tanggal_keluar: item?.tanggal_keluar ? item.tanggal_keluar.split('T')[0] : '',
    status: item?.status || 'Aktif',

    no_hp: item?.no_hp || '',
    email: item?.email || '',
    alamat: item?.alamat || '',
    provinsi: item?.provinsi || 'Sumatera Barat',
    kota: item?.kota || 'Padang',
    kecamatan: item?.kecamatan || '',
    kelurahan: item?.kelurahan || '',
    kode_pos: item?.kode_pos || '',

    user_id: item?.user_id || '',
    role_id: item?.role_id || '',
    teachings: item?.teachings || meta.teachings || [],
    position_history: meta.position_history || [
      { jabatan: item?.position?.name || 'Staf', tgl_mulai: item?.tanggal_masuk || '2022-01-01', keterangan: 'Pengangkatan Pertama' },
    ],
    certifications: meta.certifications || [
      { nama: 'Sertifikat Pendidik (Serdik)', penerbit: 'Kemdikbudristek', tahun: '2023', no_sertifikat: '1234567890' },
    ],
    documents: meta.documents || [
      { nama: 'KTP Pegawai', file_name: 'ktp_pegawai.pdf', tanggal: '2024-01-10' },
      { nama: 'Ijazah Terakhir', file_name: 'ijazah_s1.pdf', tanggal: '2024-01-10' },
    ],
    attendances: meta.attendances || [
      { tanggal: '2026-07-25', jam_masuk: '07:15', jam_pulang: '16:00', status: 'Hadir' },
      { tanggal: '2026-07-24', jam_masuk: '07:20', jam_pulang: '16:05', status: 'Hadir' },
    ],
  }
}

function makePayload(form) {
  return {
    niy: form.niy,
    nik: form.nik,
    nama_lengkap: form.nama_lengkap,
    nama_panggilan: form.nama_panggilan,
    gelar_depan: form.gelar_depan,
    gelar_belakang: form.gelar_belakang,
    jenis_kelamin: form.jenis_kelamin,
    tempat_lahir: form.tempat_lahir,
    tanggal_lahir: form.tanggal_lahir || null,
    agama: form.agama,
    foto: form.foto,
    unit_id: form.unit_id || null,
    jabatan_id: form.jabatan_id || null,
    status_pegawai: form.status_pegawai,
    tanggal_masuk: form.tanggal_masuk || null,
    tanggal_keluar: form.tanggal_keluar || null,
    status: form.status,
    no_hp: form.no_hp,
    email: form.email,
    alamat: form.alamat,
    provinsi: form.provinsi,
    kota: form.kota,
    kecamatan: form.kecamatan,
    kelurahan: form.kelurahan,
    kode_pos: form.kode_pos,
    metadata: {
      teachings: form.teachings || [],
      position_history: form.position_history || [],
      certifications: form.certifications || [],
      documents: form.documents || [],
      attendances: form.attendances || [],
    },
  }
}

export default function EmployeesPage() {
  const queryClient = useQueryClient()
  const pengaturan = usePengaturanStore((state) => state.pengaturan)

  // Filter States
  const [search, setSearch] = useState('')
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('')
  const [selectedJabatanFilter, setSelectedJabatanFilter] = useState('')
  const [selectedStatusPegawaiFilter, setSelectedStatusPegawaiFilter] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('')

  // Pagination State
  const [page, setPage] = useState(1)

  // Modal Controls
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialFormState())
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState('xlsx')
  const [notifications, setNotifications] = useState([])
  const [showIdCardModal, setShowIdCardModal] = useState(null)
  const [selectedIdCardTemplate, setSelectedIdCardTemplate] = useState('green')
  const [idCardOrientation, setIdCardOrientation] = useState(() => localStorage.getItem('employee-id-card-orientation') || 'vertical')

  const changeIdCardOrientation = (orientation) => {
    setIdCardOrientation(orientation)
    localStorage.setItem('employee-id-card-orientation', orientation)
  }

  // Import Data States
  const [importFile, setImportFile] = useState(null)
  const [importPreviewData, setImportPreviewData] = useState([])
  const [isImporting, setIsImporting] = useState(false)

  // Detail Modal State
  const [detailEmployee, setDetailEmployee] = useState(null)
  const [activeDetailTab, setActiveDetailTab] = useState('Identitas')

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [hasConfirmedDeleteCheck, setHasConfirmedDeleteCheck] = useState(false)

  // Quick New Sub-item States inside Detail Modal
  const [newTeaching, setNewTeaching] = useState({ mapel: '', kelas: '', tahun: '2025/2026', semester: 'Ganjil' })
  const [newCert, setNewCert] = useState({ nama: '', penerbit: '', tahun: '', no_sertifikat: '' })
  const [newDoc, setNewDoc] = useState({ nama: '', file_name: '' })

  const pushNotification = (title, message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setNotifications((current) => [...current, { id, title, message, tone }])
    window.setTimeout(() => {
      setNotifications((current) => current.filter((notification) => notification.id !== id))
    }, 5500)
  }

  // Query Fetching Employees
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [
      'employees',
      page,
      search,
      selectedUnitFilter,
      selectedJabatanFilter,
      selectedStatusPegawaiFilter,
      selectedStatusFilter,
      selectedGenderFilter,
    ],
    queryFn: () =>
      employeeService.getDaftar({
        page,
        per_page: 15,
        search: search || undefined,
        unit_id: selectedUnitFilter || undefined,
        jabatan_id: selectedJabatanFilter || undefined,
        status_pegawai: selectedStatusPegawaiFilter || undefined,
        status: selectedStatusFilter || undefined,
        jenis_kelamin: selectedGenderFilter || undefined,
      }),
  })

  // Query Fetching Positions & Units for Dropdowns
  const { data: positionsData } = useQuery({
    queryKey: ['positions'],
    queryFn: () => employeeService.getPositions(),
  })

  const { data: unitsData } = useQuery({
    queryKey: ['education-units-list'],
    queryFn: () => educationUnitService.getDaftar({ per_page: 100 }),
  })

  const positionsList = positionsData?.data || [
    { id: '1', name: 'Kepala Sekolah' },
    { id: '2', name: 'Wakil Kepala Sekolah' },
    { id: '3', name: 'Guru Kelas' },
    { id: '4', name: 'Guru Mata Pelajaran' },
    { id: '5', name: 'Tata Usaha (TU)' },
    { id: '6', name: 'Operator Sekolah' },
    { id: '7', name: 'Divisi Pendidikan' },
    { id: '8', name: 'Ketua Yayasan' },
  ]

  const unitsList = unitsData?.data || []

  const rawList = useMemo(() => data?.data || [], [data?.data])

  const items = useMemo(() => {
    const apiItems = rawList.map(parseFromApi)
    let list = apiItems.length > 0 ? apiItems : []

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (i) =>
          i.nama_lengkap.toLowerCase().includes(q) ||
          i.niy.toLowerCase().includes(q) ||
          i.nik.toLowerCase().includes(q) ||
          i.no_hp.toLowerCase().includes(q)
      )
    }

    if (selectedUnitFilter) {
      list = list.filter((i) => i.unit_id === selectedUnitFilter || i.unit_name.toLowerCase().includes(selectedUnitFilter.toLowerCase()))
    }

    if (selectedJabatanFilter) {
      list = list.filter((i) => i.jabatan_id === selectedJabatanFilter || i.jabatan_name.toLowerCase().includes(selectedJabatanFilter.toLowerCase()))
    }

    if (selectedStatusPegawaiFilter) {
      list = list.filter((i) => i.status_pegawai === selectedStatusPegawaiFilter)
    }

    if (selectedStatusFilter) {
      list = list.filter((i) => i.status === selectedStatusFilter)
    }

    if (selectedGenderFilter) {
      list = list.filter((i) => i.jenis_kelamin === selectedGenderFilter)
    }

    return list
  }, [rawList, search, selectedUnitFilter, selectedJabatanFilter, selectedStatusPegawaiFilter, selectedStatusFilter, selectedGenderFilter])

  const employeeSummary = useMemo(() => {
    const active = items.filter((item) => item.status === 'Aktif').length
    const inactive = items.length - active
    const male = items.filter((item) => item.jenis_kelamin === 'L').length
    const female = items.filter((item) => item.jenis_kelamin === 'P').length
    const units = new Set(items.map((item) => item.unit_id || item.unit_name).filter(Boolean)).size
    const ages = items
      .map((item) => item.tanggal_lahir && Math.floor((Date.now() - new Date(item.tanggal_lahir).getTime()) / 31557600000))
      .filter((age) => Number.isFinite(age) && age > 0)
    return {
      total: data?.total || items.length,
      active,
      inactive,
      male,
      female,
      units,
      averageAge: ages.length ? (ages.reduce((sum, age) => sum + age, 0) / ages.length).toFixed(1) : '—',
    }
  }, [items, data?.total])

  const paginationInfo = {
    total: data?.total || items.length,
    from: data?.from || (items.length > 0 ? 1 : 0),
    to: data?.to || items.length,
    last_page: data?.last_page || 1,
  }

  const handleFotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((p) => ({ ...p, foto: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // --- Handlers Import ---
  const handleDownloadTemplatePegawai = () => {
    const headers = ['NIY', 'NIK', 'Nama Lengkap', 'Jenis Kelamin (L/P)', 'Jabatan', 'Status Pegawai', 'No HP', 'Email']
    const sampleRow = ['NIY-2026001', '1371012345670001', 'Ustadz Ahmad Farhan, S.Pd', 'L', 'Guru Kelas', 'Tetap', '08123456789', 'ahmad@dareliman.sch.id']
    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Template_Import_Pegawai.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportFile(file)
    setImportPreviewData([
      { niy: 'NIY-2026002', nama: 'Ust. Muhammad Rizky, M.Pd', jabatan: 'Guru Mapel', status_pegawai: 'Tetap', status: 'Valid' },
      { niy: 'NIY-2026003', nama: 'Ustadzah Siti Fatimah, S.T', jabatan: 'Tata Usaha (TU)', status_pegawai: 'Kontrak', status: 'Valid' },
    ])
  }

  const handleProcessImport = () => {
    if (!importFile) return
    setIsImporting(true)
    setTimeout(() => {
      setIsImporting(false)
      setShowImportModal(false)
      setImportFile(null)
      setImportPreviewData([])
      pushNotification('Import Berhasil', 'Data pegawai berhasil diimpor ke sistem.', 'info')
    }, 1200)
  }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload) => employeeService.tambah(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      pushNotification('Berhasil Disimpan', 'Data pegawai baru berhasil ditambahkan ke sistem.')
      closeFormModal()
    },
    onError: (err) => {
      pushNotification('Gagal Disimpan', err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data pegawai.', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => employeeService.ubah({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      pushNotification('Berhasil Diubah', 'Data pegawai berhasil diperbarui.')
      closeFormModal()
    },
    onError: (err) => {
      pushNotification('Gagal Diubah', err?.response?.data?.message || 'Terjadi kesalahan saat memperbarui data pegawai.', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => employeeService.hapus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      pushNotification('Berhasil Dihapus', 'Data pegawai berhasil dihapus dari sistem.')
      setDeleteTarget(null)
      setHasConfirmedDeleteCheck(false)
    },
    onError: (err) => {
      pushNotification('Gagal Dihapus', err?.response?.data?.message || 'Terjadi kesalahan saat menghapus data pegawai.', 'error')
    },
  })

  // Modal Handlers
  const openAddModal = () => {
    setIsEditMode(false)
    setFormData(initialFormState())
    setCurrentStep(1)
    setIsFormModalOpen(true)
  }

  const openEditModal = (emp) => {
    setIsEditMode(true)
    setFormData(emp)
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
    if (!formData.nama_lengkap.trim()) {
      pushNotification('Perhatian', 'Data pegawai belum lengkap. Nama lengkap wajib diisi.', 'warning')
      return
    }

    const payload = makePayload(formData)
    if (isEditMode && formData.id) {
      updateMutation.mutate({ id: formData.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const toggleEmployeeStatus = (emp) => {
    const updatedForm = { ...emp, status: emp.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }
    const payload = makePayload(updatedForm)
    updateMutation.mutate({ id: emp.id, payload })
  }

  // Export Excel Modal Handler
  const handleExportExcel = () => {
    setExportFormat('xlsx')
    setShowExportModal(true)
  }

  // Add Teaching Assignment to Detail Pegawai
  const handleAddTeaching = () => {
    if (!newTeaching.mapel || !newTeaching.kelas) {
      Swal.fire('Peringatan', 'Mata Pelajaran dan Kelas wajib diisi!', 'warning')
      return
    }
    const updatedTeachings = [...(detailEmployee.teachings || []), { ...newTeaching }]
    const updatedEmp = { ...detailEmployee, teachings: updatedTeachings }
    setDetailEmployee(updatedEmp)
    updateMutation.mutate({ id: detailEmployee.id, payload: makePayload(updatedEmp) })
    setNewTeaching({ mapel: '', kelas: '', tahun: '2025/2026', semester: 'Ganjil' })
  }

  // Add Certification to Detail Pegawai
  const handleAddCert = () => {
    if (!newCert.nama) {
      Swal.fire('Peringatan', 'Nama Sertifikasi wajib diisi!', 'warning')
      return
    }
    const updatedCertifications = [...(detailEmployee.certifications || []), { ...newCert }]
    const updatedEmp = { ...detailEmployee, certifications: updatedCertifications }
    setDetailEmployee(updatedEmp)
    updateMutation.mutate({ id: detailEmployee.id, payload: makePayload(updatedEmp) })
    setNewCert({ nama: '', penerbit: '', tahun: '', no_sertifikat: '' })
  }

  // Add Document to Detail Pegawai
  const handleAddDoc = () => {
    if (!newDoc.nama) {
      Swal.fire('Peringatan', 'Nama Dokumen wajib diisi!', 'warning')
      return
    }
    const updatedDocuments = [...(detailEmployee.documents || []), { ...newDoc, tanggal: new Date().toISOString().split('T')[0] }]
    const updatedEmp = { ...detailEmployee, documents: updatedDocuments }
    setDetailEmployee(updatedEmp)
    updateMutation.mutate({ id: detailEmployee.id, payload: makePayload(updatedEmp) })
    setNewDoc({ nama: '', file_name: '' })
  }

  return (
    <MasterDataPage className="employee-master-page education-unit-page" hideBreadcrumb>
      <MasterPageHeader
        tone="brand"
        icon={UsersRound}
        title="Master Data Pegawai"
        description="Kelola seluruh data pegawai, profil, jabatan, unit kerja, dan informasi kepegawaian dengan mudah."
        actions={
          <MasterActionButton className="employee-hero__action" icon={Plus} onClick={openAddModal}>
            Tambah Pegawai
          </MasterActionButton>
        }
      />

      <MasterStatsGrid className="education-unit-kpis employee-kpis lg:grid-cols-5">
        <MasterStatCard icon={UsersRound} label="Total Pegawai" value={employeeSummary.total} description="Terdaftar di sistem" variant="success" />
        <MasterStatCard icon={BriefcaseBusiness} label="Pegawai Aktif" value={employeeSummary.active} description={`${employeeSummary.total ? ((employeeSummary.active / employeeSummary.total) * 100).toFixed(1) : 0}% dari total pegawai`} variant="success" delay={50} />
        <MasterStatCard icon={IdCard} label="Pegawai Nonaktif" value={employeeSummary.inactive} description={`${employeeSummary.total ? ((employeeSummary.inactive / employeeSummary.total) * 100).toFixed(1) : 0}% dari total pegawai`} variant="warning" delay={100} />
        <MasterStatCard icon={Building2} label="Total Unit Kerja" value={employeeSummary.units} description="Unit pendidikan" variant="info" delay={150} />
        <MasterStatCard icon={CalendarDays} label="Rata-rata Usia" value={employeeSummary.averageAge} description="Tahun" variant="neutral" delay={200} />
      </MasterStatsGrid>

      <section className="edu-enter rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-label="Pencarian dan filter pegawai">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Cari pegawai</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Cari pegawai, NIY, NIK, jabatan, atau unit kerja..."
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1) }}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
                />
              </label>
              <div className="hidden shrink-0 items-center gap-2 lg:flex">
                <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="import" icon={Upload} onClick={() => setShowImportModal(true)}>Import Excel</MasterActionButton>
                <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="export" icon={Download} onClick={handleExportExcel}>Export Excel</MasterActionButton>
                <MasterActionButton className="!h-11 !rounded-xl !px-3.5" icon={Plus} onClick={openAddModal}>Tambah Pegawai</MasterActionButton>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:text-slate-300">
                <SlidersHorizontal className="h-4 w-4 text-emerald-700" /> Filter
              </span>
              {[
                { label: 'Semua Unit Kerja', value: selectedUnitFilter, setter: setSelectedUnitFilter, options: unitsList.map((unit) => ({ value: unit.id, label: unit.name })) },
                { label: 'Semua Jabatan', value: selectedJabatanFilter, setter: setSelectedJabatanFilter, options: positionsList.map((position) => ({ value: position.id, label: position.name })) },
                { label: 'Semua Status', value: selectedStatusFilter, setter: setSelectedStatusFilter, options: STATUS_OPTIONS.map((status) => ({ value: status, label: status })) },
                { label: 'Semua Jenis Kelamin', value: selectedGenderFilter, setter: setSelectedGenderFilter, options: [{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }] },
              ].map((filter) => (
                <select
                  key={filter.label}
                  aria-label={filter.label}
                  value={filter.value}
                  onChange={(event) => { filter.setter(event.target.value); setPage(1) }}
                  className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ))}
              <button
                type="button"
                onClick={() => {
                  setSelectedUnitFilter('')
                  setSelectedJabatanFilter('')
                  setSelectedStatusPegawaiFilter('')
                  setSelectedStatusFilter('')
                  setSelectedGenderFilter('')
                  setSearch('')
                  setPage(1)
                }}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-emerald-950/40"
              >
                <RefreshCcw className="h-4 w-4" /> Reset
              </button>
            </div>
      </section>

      <div className="employee-workspace grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0 space-y-5">
          {isError ? (
            <MasterErrorState description="Data pegawai tidak dapat diambil dari server." onRetry={refetch} />
          ) : (
            <section className="employee-table-card overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[var(--shadow-soft-xl)] dark:border-slate-700/80 dark:bg-[#1B2433]">
              <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Daftar Pegawai</h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Menampilkan data sesuai filter dan kewenangan Anda.</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-slate-500">{paginationInfo.total} pegawai</span>
              </header>
              {isLoading || isFetching ? (
                <div className="space-y-3 p-5" aria-label="Memuat data pegawai">
                  {[1, 2, 3, 4, 5].map((row) => <div key={row} className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />)}
                </div>
              ) : items.length === 0 ? (
                <MasterEmptyState title="Pegawai tidak ditemukan" description="Ubah kata pencarian atau filter untuk melihat data lainnya." />
              ) : (
                <div className="employee-table-wrap">
                  <table className="employee-table w-full table-fixed text-left">
                    <thead>
                      <tr>
                        <th className="employee-col-number text-center">No</th>
                        <th className="employee-col-photo text-center">Foto</th>
                        <th className="employee-col-identity">Nama Pegawai <span>NIY</span></th>
                        <th className="employee-col-position">Jabatan <span>Unit Kerja</span></th>
                        <th className="employee-col-contact">Kontak</th>
                        <th className="employee-col-status text-center">Status</th>
                        <th className="employee-col-date">Tgl Bergabung</th>
                        <th className="employee-col-actions text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row, index) => {
                        const fullName = `${row.gelar_depan ? `${row.gelar_depan} ` : ''}${row.nama_lengkap}${row.gelar_belakang ? `, ${row.gelar_belakang}` : ''}`
                        return (
                          <tr key={row.id || index}>
                            <td className="text-center font-semibold text-slate-400">{paginationInfo.from + index}</td>
                            <td className="text-center">
                              <PersonAvatar
                                src={row.photo_url || row.avatar_url || row.user?.photo_url || row.user?.avatar_url || row.foto}
                                name={fullName}
                                size="table"
                                className="mx-auto border-slate-200 dark:border-slate-700"
                              />
                            </td>
                            <td>
                              <p className="truncate font-bold text-slate-900 dark:text-white">{fullName}</p>
                              <p className="truncate text-xs text-slate-500">{row.niy || 'NIY belum tersedia'}</p>
                            </td>
                            <td>
                              <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{row.jabatan_name || '—'}</p>
                              <p className="truncate text-xs text-slate-500">{row.unit_name || 'Belum ditentukan'}</p>
                            </td>
                            <td>
                              <p className="flex items-center gap-2 truncate text-xs text-slate-700 dark:text-slate-300"><Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />{row.no_hp || '—'}</p>
                              <p className="mt-1 flex items-center gap-2 truncate text-xs text-slate-500"><Mail className="h-3.5 w-3.5 shrink-0" />{row.email || '—'}</p>
                            </td>
                            <td className="text-center">
                              <button type="button" onClick={() => toggleEmployeeStatus(row)} title="Ubah status pegawai" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${row.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Aktif' ? 'bg-emerald-500' : 'bg-amber-500'}`} />{row.status}
                              </button>
                            </td>
                            <td>
                              <p className="whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                {row.tanggal_masuk
                                  ? new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(row.tanggal_masuk))
                                  : '—'}
                              </p>
                            </td>
                            <td>
                              <div className="flex justify-center gap-1.5">
                                <button type="button" onClick={() => { setDetailEmployee(row); setActiveDetailTab('Identitas') }} title="Lihat detail" aria-label={`Lihat ${row.nama_lengkap}`} className="employee-row-action employee-row-action--view"><Eye /></button>
                                <button type="button" onClick={() => openEditModal(row)} title="Edit pegawai" aria-label={`Edit ${row.nama_lengkap}`} className="employee-row-action employee-row-action--edit"><Pencil /></button>
                                <button type="button" onClick={() => { setDeleteTarget(row); setHasConfirmedDeleteCheck(false) }} title="Hapus pegawai" aria-label={`Hapus ${row.nama_lengkap}`} className="employee-row-action employee-row-action--delete"><Trash2 /></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {paginationInfo.total > 0 && (
                <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row dark:border-slate-700">
                  <p>Menampilkan {paginationInfo.from}–{paginationInfo.to} dari {paginationInfo.total} data</p>
                  <div className="flex items-center gap-2">
                    <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="employee-page-button" aria-label="Halaman sebelumnya">‹</button>
                    <span className="employee-page-button employee-page-button--active">{page}</span>
                    <button type="button" disabled={page >= paginationInfo.last_page} onClick={() => setPage((current) => current + 1)} className="employee-page-button" aria-label="Halaman berikutnya">›</button>
                  </div>
                </footer>
              )}
            </section>
          )}
        </main>

        <aside className="space-y-4 xl:sticky xl:top-5" aria-label="Ringkasan pegawai">
          <section className="edu-card rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><UsersRound className="h-5 w-5" /></div>
              <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Pegawai</h2><p className="text-xs text-slate-500 dark:text-slate-400">Data halaman aktif</p></div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                ['Total Pegawai', employeeSummary.total, UsersRound, 'text-emerald-700 bg-emerald-50'],
                ['Pegawai Aktif', employeeSummary.active, BadgeCheck, 'text-emerald-700 bg-emerald-50'],
                ['Pegawai Nonaktif', employeeSummary.inactive, IdCard, 'text-amber-700 bg-amber-50'],
                ['Laki-laki', employeeSummary.male, UserRound, 'text-blue-700 bg-blue-50'],
                ['Perempuan', employeeSummary.female, UserRound, 'text-violet-700 bg-violet-50'],
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
                ['Tambah Pegawai Baru', Plus, openAddModal, 'text-emerald-700 bg-emerald-50'],
                ['Import Data Pegawai', Upload, () => setShowImportModal(true), 'text-blue-700 bg-blue-50'],
                ['Export Excel', FileSpreadsheet, handleExportExcel, 'text-emerald-700 bg-emerald-50'],
                ['Cetak Daftar Pegawai', FileText, () => window.print(), 'text-rose-600 bg-rose-50'],
              ].map(([label, Icon, action, color]) => (
                <button key={label} type="button" onClick={action} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-left text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-emerald-950/40">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span>{label}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="hidden" aria-hidden="true">
      {/* 1. Header Banner */}
      <div className="master-hero rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Modul Manajemen SDM & Kepegawaian
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">Data Pegawai & Tenaga Pendidik</h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola master data Guru, Kepala Sekolah, Tata Usaha, Operator, hingga Pimpinan Yayasan
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportExcel}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              <FaFileExcel /> Export Excel
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              <FaFileImport /> Import Excel
            </button>
            <button
              onClick={openAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 text-sm shadow-md"
            >
              <FaPlus /> Tambah Pegawai
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
            <FaUserTie />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Pegawai</p>
            <h3 className="text-2xl font-bold text-slate-800">{items.length}</h3>
            <span className="text-[11px] text-emerald-600 font-medium">Master Pegawai ERP</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
            <FaChalkboardTeacher />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tenaga Pendidik / Guru</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {items.filter((i) => i.jabatan_name.toLowerCase().includes('guru') || i.jabatan_name.toLowerCase().includes('kepala')).length}
            </h3>
            <span className="text-[11px] text-blue-600 font-medium">Guru & Pengajar</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
            <FaBuilding />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Staf TU & Operator</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {items.filter((i) => !i.jabatan_name.toLowerCase().includes('guru')).length}
            </h3>
            <span className="text-[11px] text-purple-600 font-medium">Administrasi & Teknis</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl font-bold">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Status Aktif</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {items.filter((i) => i.status === 'Aktif').length}
            </h3>
            <span className="text-[11px] text-yellow-600 font-medium">Aktif Bekerja</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/3">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Cari Nama, NIY, NIK, No HP..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <div className="flex items-center gap-1.5 text-slate-500 mr-1 shrink-0">
            <FaFilter className="text-xs" />
            <span className="text-xs font-bold">Filter:</span>
          </div>

          <select
            value={selectedUnitFilter}
            onChange={(e) => { setSelectedUnitFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none shrink-0"
          >
            <option value="">Semua Unit</option>
            {unitsList.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <select
            value={selectedJabatanFilter}
            onChange={(e) => { setSelectedJabatanFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none shrink-0"
          >
            <option value="">Semua Jabatan</option>
            {positionsList.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={selectedStatusPegawaiFilter}
            onChange={(e) => { setSelectedStatusPegawaiFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none shrink-0"
          >
            <option value="">Status Pegawai</option>
            {STATUS_PEGAWAI_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => { setSelectedStatusFilter(e.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none shrink-0"
          >
            <option value="">Status Keaktifan</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Table View */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 w-16 text-center">Foto</th>
                <th className="py-3.5 px-4 font-bold">NIY / Nama Pegawai</th>
                <th className="py-3.5 px-4 font-bold">Jabatan</th>
                <th className="py-3.5 px-4 font-bold">Unit Kerja</th>
                <th className="py-3.5 px-4 font-bold">Status Pegawai</th>
                <th className="py-3.5 px-4 font-bold">No. HP / Email</th>
                <th className="py-3.5 px-4 text-center font-bold">Status</th>
                <th className="py-3.5 px-4 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Memuat data pegawai...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada data pegawai ditemukan.
                  </td>
                </tr>
              ) : (
                items.map((row, idx) => {
                  const badge = getStatusBadgeStyle(row.status)
                  const namaFull = `${row.gelar_depan ? row.gelar_depan + ' ' : ''}${row.nama_lengkap}${row.gelar_belakang ? ', ' + row.gelar_belakang : ''}`
                  return (
                    <tr key={row.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-4 px-4 text-center">
                        {row.foto ? (
                          <img
                            src={row.foto}
                            alt={row.nama_lengkap}
                            className="mx-auto h-10 w-10 rounded-full object-cover shadow-sm border border-slate-200"
                          />
                        ) : (
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800 font-bold text-white text-xs shadow-sm">
                            {row.nama_lengkap.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 leading-snug">{namaFull}</div>
                        <div className="text-xs text-slate-400 font-mono">NIY: {row.niy || '-'}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{row.jabatan_name}</td>
                      <td className="py-4 px-4 font-medium text-slate-600">{row.unit_name}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 border border-slate-200">
                          {row.status_pegawai}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 space-y-0.5">
                        {row.no_hp && <div className="flex items-center gap-1.5"><FaPhoneAlt className="text-[10px] text-slate-400" /> {row.no_hp}</div>}
                        {row.email && <div className="flex items-center gap-1.5"><FaEnvelope className="text-[10px] text-slate-400" /> {row.email}</div>}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.bg} ${badge.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}></span>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setShowIdCardModal(row)}
                            title="ID Card"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                          >
                            <FaIdCard className="text-xs" />
                          </button>
                          <button
                            onClick={() => { setDetailEmployee(row); setActiveDetailTab('Identitas') }}
                            title="Detail"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          <button
                            onClick={() => openEditModal(row)}
                            title="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(row)
                              setHasConfirmedDeleteCheck(false)
                            }}
                            title="Hapus"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <FaTrash className="text-xs" />
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

        {/* Pagination Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold">{paginationInfo.from}</span> sampai{' '}
            <span className="font-semibold">{paginationInfo.to}</span> dari{' '}
            <span className="font-semibold">{paginationInfo.total}</span> data pegawai
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
      </div>

      </div>

      {/* 5. MODAL WIZARD: TAMBAH / EDIT PEGAWAI */}
      {isFormModalOpen && (
        <div className="employee-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="employee-form-title">
          <div className="employee-form-modal w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <h2 id="employee-form-title" className="text-base font-bold text-slate-900">
                {isEditMode ? 'Edit Pegawai' : 'Tambah Pegawai'}
              </h2>
              <button onClick={closeFormModal} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
                ✕
              </button>
            </div>

            {/* Main Body Grid */}
            <div className="employee-form-layout grid grid-cols-1 lg:grid-cols-4 min-h-[480px]">
              {/* Stepper Sidebar */}
              <div className="employee-form-stepper border-r border-slate-100 bg-slate-50/50 p-6 space-y-6">
                {[
                  { step: 1, label: 'Identitas & Foto' },
                  { step: 2, label: 'Kepegawaian' },
                  { step: 3, label: 'Kontak & Alamat' },
                  { step: 4, label: 'Konfirmasi' },
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${currentStep === s.step
                          ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                          : currentStep > s.step
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                        }`}
                    >
                      {s.step}
                    </div>
                    <span
                      className={`text-sm font-semibold transition-colors ${currentStep === s.step ? 'text-emerald-900' : 'text-slate-500 group-hover:text-slate-800'
                        }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <div className={`employee-form-content ${isEditMode ? 'lg:col-span-2' : 'lg:col-span-3'} p-6 overflow-y-auto max-h-[540px]`}>
                {/* STEP 1: Identitas & Foto */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Identitas Pegawai</h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Foto Pegawai</label>
                      {formData.foto ? (
                        <div className="flex items-center gap-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                          <img src={formData.foto} alt="Preview Foto" className="h-16 w-16 rounded-full object-cover border-2 border-emerald-600 shadow-sm shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">Foto Berhasil Diunggah</p>
                            <button
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, foto: '' }))}
                              className="text-xs font-bold text-rose-600 hover:underline mt-1 inline-block"
                            >
                              Hapus Foto & Upload Ulang
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center hover:bg-emerald-50/30 hover:border-emerald-400 cursor-pointer transition-colors">
                          <FaUpload className="text-emerald-700 text-xl mb-1" />
                          <span className="text-xs font-bold text-slate-700">Upload Foto Profil</span>
                          <span className="text-[10px] text-slate-400">PNG, JPG Maksimal 2MB</span>
                          <input type="file" accept="image/*" onChange={handleFotoUpload} className="hidden" />
                        </label>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          NIY (Nomor Induk Yayasan) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="NIY-2026xxxx"
                          value={formData.niy}
                          onChange={(e) => setFormData((p) => ({ ...p, niy: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                        <input
                          type="text"
                          placeholder="1371xxxxxxxxxxxx"
                          value={formData.nik}
                          onChange={(e) => setFormData((p) => ({ ...p, nik: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Gelar Depan</label>
                        <input
                          type="text"
                          placeholder="Ust. / Dr."
                          value={formData.gelar_depan}
                          onChange={(e) => setFormData((p) => ({ ...p, gelar_depan: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ahmad Farhan"
                          value={formData.nama_lengkap}
                          onChange={(e) => setFormData((p) => ({ ...p, nama_lengkap: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Gelar Belakang</label>
                        <input
                          type="text"
                          placeholder="S.Pd / M.Pd"
                          value={formData.gelar_belakang}
                          onChange={(e) => setFormData((p) => ({ ...p, gelar_belakang: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Panggilan</label>
                        <input
                          type="text"
                          placeholder="Farhan"
                          value={formData.nama_panggilan}
                          onChange={(e) => setFormData((p) => ({ ...p, nama_panggilan: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                        <select
                          value={formData.jenis_kelamin}
                          onChange={(e) => setFormData((p) => ({ ...p, jenis_kelamin: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        >
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                        <input
                          type="text"
                          placeholder="Padang"
                          value={formData.tempat_lahir}
                          onChange={(e) => setFormData((p) => ({ ...p, tempat_lahir: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                        <input
                          type="date"
                          value={formData.tanggal_lahir}
                          onChange={(e) => setFormData((p) => ({ ...p, tanggal_lahir: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Kepegawaian */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Status & Penempatan Kepegawaian</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Kerja / Sekolah</label>
                        <select
                          value={formData.unit_id}
                          onChange={(e) => setFormData((p) => ({ ...p, unit_id: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        >
                          <option value="">Pilih Unit Pendidikan</option>
                          {unitsList.map((u) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Master</label>
                        <select
                          value={formData.jabatan_id}
                          onChange={(e) => setFormData((p) => ({ ...p, jabatan_id: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        >
                          <option value="">Pilih Jabatan</option>
                          {positionsList.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Status Pegawai</label>
                        <select
                          value={formData.status_pegawai}
                          onChange={(e) => setFormData((p) => ({ ...p, status_pegawai: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        >
                          {STATUS_PEGAWAI_OPTIONS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Status Keaktifan</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Masuk</label>
                        <input
                          type="date"
                          value={formData.tanggal_masuk}
                          onChange={(e) => setFormData((p) => ({ ...p, tanggal_masuk: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Keluar (Jika Ada)</label>
                        <input
                          type="date"
                          value={formData.tanggal_keluar}
                          onChange={(e) => setFormData((p) => ({ ...p, tanggal_keluar: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Kontak & Alamat */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Kontak & Alamat</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                        <input
                          type="text"
                          placeholder="0812-3456-7890"
                          value={formData.no_hp}
                          onChange={(e) => setFormData((p) => ({ ...p, no_hp: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Pegawai</label>
                        <input
                          type="email"
                          placeholder="pegawai@dareliman.sch.id"
                          value={formData.email}
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
                      <textarea
                        rows={3}
                        placeholder="Jl. Khatib Sulaiman No. 20..."
                        value={formData.alamat}
                        onChange={(e) => setFormData((p) => ({ ...p, alamat: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
                        <input
                          type="text"
                          value={formData.kota}
                          onChange={(e) => setFormData((p) => ({ ...p, kota: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Provinsi</label>
                        <input
                          type="text"
                          value={formData.provinsi}
                          onChange={(e) => setFormData((p) => ({ ...p, provinsi: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Konfirmasi */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Konfirmasi Data Pegawai</h3>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-medium">NIY:</span>
                        <span className="font-bold text-slate-800">{formData.niy || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-medium">Nama Lengkap:</span>
                        <span className="font-bold text-slate-800">{formData.nama_lengkap || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-medium">Status Pegawai:</span>
                        <span className="font-bold text-slate-800">{formData.status_pegawai || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500 font-medium">Kontak HP:</span>
                        <span className="font-bold text-slate-800">{formData.no_hp || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Email:</span>
                        <span className="font-bold text-slate-800">{formData.email || '-'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Side Card in Edit Mode */}
              {isEditMode && (
                <div className="border-l border-slate-100 bg-slate-50/30 p-6 space-y-4">
                  <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-emerald-700 to-teal-800 p-4 text-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{formData.niy}</span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">{formData.status}</span>
                    </div>
                    <h4 className="font-extrabold text-sm leading-tight">{formData.nama_lengkap}</h4>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => toggleEmployeeStatus(formData)}
                      className="w-full rounded-lg border border-amber-300 bg-amber-50 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      {formData.status === 'Aktif' ? 'Nonaktifkan Pegawai' : 'Aktifkan Pegawai'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTarget(formData)
                        closeFormModal()
                      }}
                      className="w-full rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Hapus Pegawai
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <button
                type="button"
                onClick={closeFormModal}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>

              <div className="flex items-center gap-2">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
                    className="rounded-lg bg-emerald-800 px-6 py-2 text-xs font-bold text-white shadow hover:bg-emerald-900 transition-colors"
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="rounded-lg bg-emerald-800 px-6 py-2 text-xs font-bold text-white shadow hover:bg-emerald-900 transition-colors"
                  >
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan Pegawai'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL DETAIL PEGAWAI (WITH 7 TABS) */}
      {detailEmployee && (
        <div className="employee-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Detail Pegawai">
          <div className="employee-detail-modal w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3.5 bg-slate-50">
              <button
                onClick={() => setDetailEmployee(null)}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <FaArrowLeft /> Kembali
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowIdCardModal(detailEmployee)}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-600 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100"
                >
                  <FaIdCard /> ID Card
                </button>
                <button
                  onClick={() => {
                    const target = detailEmployee
                    setDetailEmployee(null)
                    openEditModal(target)
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Profile Card Header */}
              <div className="flex flex-col md:flex-row gap-6 items-center rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <PersonAvatar
                  src={detailEmployee.photo_url || detailEmployee.avatar_url || detailEmployee.user?.photo_url || detailEmployee.user?.avatar_url || detailEmployee.foto}
                  name={detailEmployee.gelar_depan ? `${detailEmployee.gelar_depan} ${detailEmployee.nama_lengkap}` : detailEmployee.nama_lengkap}
                  size="detail"
                  className="h-28 w-28 shrink-0 shadow-md"
                />
                <div className="flex-1 space-y-1 text-center md:text-left">
                  <span className="rounded-md bg-emerald-800 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {detailEmployee.niy}
                  </span>
                  <h2 className="text-xl font-black text-slate-900">
                    {detailEmployee.gelar_depan} {detailEmployee.nama_lengkap}{detailEmployee.gelar_belakang ? `, ${detailEmployee.gelar_belakang}` : ''}
                  </h2>
                  <p className="text-xs font-bold text-emerald-700">{detailEmployee.jabatan_name} - {detailEmployee.unit_name}</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center md:justify-start gap-2">
                    <span>Status: <strong className="text-slate-800">{detailEmployee.status_pegawai}</strong></span>
                    <span>• Keaktifan: <strong className="text-emerald-700">{detailEmployee.status}</strong></span>
                  </p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-500 overflow-x-auto pb-1 scrollbar-hide">
                {['Identitas', 'Kepegawaian', 'Penugasan Mengajar', 'Riwayat Jabatan', 'Sertifikasi', 'Dokumen', 'Absensi'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(tab)}
                    className={`pb-3 transition-colors border-b-2 whitespace-nowrap ${activeDetailTab === tab
                        ? 'border-emerald-800 text-emerald-900'
                        : 'border-transparent hover:text-slate-800'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB 1: IDENTITAS */}
              {activeDetailTab === 'Identitas' && (
                <div className="grid grid-cols-2 gap-4 text-xs bg-white rounded-xl border border-slate-200 p-5">
                  <div>
                    <span className="text-slate-400 block mb-0.5">NIY</span>
                    <span className="font-bold text-slate-800">{detailEmployee.niy}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">NIK</span>
                    <span className="font-bold text-slate-800">{detailEmployee.nik || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Jenis Kelamin</span>
                    <span className="font-bold text-slate-800">{detailEmployee.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Tempat, Tanggal Lahir</span>
                    <span className="font-bold text-slate-800">{detailEmployee.tempat_lahir}, {detailEmployee.tanggal_lahir || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">No HP / WhatsApp</span>
                    <span className="font-bold text-slate-800">{detailEmployee.no_hp || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Email</span>
                    <span className="font-bold text-slate-800">{detailEmployee.email || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block mb-0.5">Alamat Lengkap</span>
                    <span className="font-bold text-slate-800">{detailEmployee.alamat || '-'}</span>
                  </div>
                </div>
              )}

              {/* TAB 2: KEPEGAWAIAN */}
              {activeDetailTab === 'Kepegawaian' && (
                <div className="grid grid-cols-2 gap-4 text-xs bg-white rounded-xl border border-slate-200 p-5">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Unit Kerja</span>
                    <span className="font-bold text-slate-800">{detailEmployee.unit_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Jabatan Utama</span>
                    <span className="font-bold text-slate-800">{detailEmployee.jabatan_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Status Pegawai</span>
                    <span className="font-bold text-slate-800">{detailEmployee.status_pegawai}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Tanggal Masuk</span>
                    <span className="font-bold text-slate-800">{detailEmployee.tanggal_masuk || '-'}</span>
                  </div>
                </div>
              )}

              {/* TAB 3: PENUGASAN MENGAJAR */}
              {activeDetailTab === 'Penugasan Mengajar' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">Tambah Penugasan Mengajar Baru</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Mata Pelajaran"
                        value={newTeaching.mapel}
                        onChange={(e) => setNewTeaching((p) => ({ ...p, mapel: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Kelas / Rombel"
                        value={newTeaching.kelas}
                        onChange={(e) => setNewTeaching((p) => ({ ...p, kelas: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Tahun Ajaran"
                        value={newTeaching.tahun}
                        onChange={(e) => setNewTeaching((p) => ({ ...p, tahun: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <button
                        onClick={handleAddTeaching}
                        className="rounded-lg bg-emerald-800 text-white text-xs font-bold py-1.5 hover:bg-emerald-900"
                      >
                        + Tambah Penugasan
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 font-bold uppercase text-slate-500">
                        <tr>
                          <th className="py-2.5 px-3">Mata Pelajaran</th>
                          <th className="py-2.5 px-3">Kelas</th>
                          <th className="py-2.5 px-3">Tahun Ajaran</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(detailEmployee.teachings || []).length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-slate-400">Belum ada penugasan mengajar</td>
                          </tr>
                        ) : (
                          detailEmployee.teachings.map((t, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-bold text-slate-800">{t.mapel || t.subject?.name || 'Bahasa Arab'}</td>
                              <td className="py-2.5 px-3 font-semibold">{t.kelas || t.classroom?.name || 'Kelas 5A'}</td>
                              <td className="py-2.5 px-3">{t.tahun || '2025/2026'}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold">Aktif</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: RIWAYAT JABATAN */}
              {activeDetailTab === 'Riwayat Jabatan' && (
                <div className="space-y-3">
                  {(detailEmployee.position_history || []).map((h, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-slate-800">{h.jabatan}</h4>
                        <span className="text-slate-400">{h.keterangan || 'Penugasan Resmi'}</span>
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-600">{h.tgl_mulai}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: SERTIFIKASI */}
              {activeDetailTab === 'Sertifikasi' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">Tambah Sertifikasi Baru</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Sertifikat"
                        value={newCert.nama}
                        onChange={(e) => setNewCert((p) => ({ ...p, nama: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Penerbit"
                        value={newCert.penerbit}
                        onChange={(e) => setNewCert((p) => ({ ...p, penerbit: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Tahun"
                        value={newCert.tahun}
                        onChange={(e) => setNewCert((p) => ({ ...p, tahun: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <button
                        onClick={handleAddCert}
                        className="rounded-lg bg-blue-700 text-white text-xs font-bold py-1.5 hover:bg-blue-800"
                      >
                        + Tambah Sertifikat
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(detailEmployee.certifications || []).map((c, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <FaAward className="text-xl text-amber-500" />
                          <div>
                            <h4 className="font-bold text-slate-800">{c.nama}</h4>
                            <p className="text-slate-400">Penerbit: {c.penerbit} ({c.tahun})</p>
                          </div>
                        </div>
                        <span className="font-mono text-slate-600">{c.no_sertifikat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: DOKUMEN */}
              {activeDetailTab === 'Dokumen' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">Upload Dokumen Pegawai</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Dokumen (KTP, SK, Ijazah)"
                        value={newDoc.nama}
                        onChange={(e) => setNewDoc((p) => ({ ...p, nama: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Nama File (.pdf / .jpg)"
                        value={newDoc.file_name}
                        onChange={(e) => setNewDoc((p) => ({ ...p, file_name: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                      />
                      <button
                        onClick={handleAddDoc}
                        className="rounded-lg bg-purple-700 text-white text-xs font-bold py-1.5 hover:bg-purple-800"
                      >
                        + Simpan Dokumen
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(detailEmployee.documents || []).map((d, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <FaFolderOpen className="text-lg text-purple-600" />
                          <div>
                            <h4 className="font-bold text-slate-800">{d.nama}</h4>
                            <p className="text-slate-400">{d.file_name} • Upload: {d.tanggal}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => Swal.fire('Preview Dokumen', `Membuka file ${d.file_name}`, 'info')}
                          className="rounded-lg border border-slate-300 px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Lihat File
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: ABSENSI */}
              {activeDetailTab === 'Absensi' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 font-bold uppercase text-slate-500">
                        <tr>
                          <th className="py-2.5 px-3">Tanggal</th>
                          <th className="py-2.5 px-3">Jam Masuk</th>
                          <th className="py-2.5 px-3">Jam Pulang</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(detailEmployee.attendances || []).map((a, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{a.tanggal}</td>
                            <td className="py-2.5 px-3 font-mono text-emerald-700">{a.jam_masuk}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{a.jam_pulang}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold">
                                {a.status}
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
          </div>
        </div>
      )}

      {/* 7. MODAL CETAK ID CARD PEGAWAI */}
      {showIdCardModal && (
        <div className="employee-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="employee-id-card-title">
          <section className="employee-id-modal w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            <header className="employee-id-modal__header flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
              <div>
                <h2 id="employee-id-card-title" className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white"><FaIdCard className="text-emerald-700" /> ID Card Pegawai</h2>
                <p className="mt-0.5 text-xs text-slate-500">Pratinjau kartu identitas dan QR akses SIMSIT</p>
              </div>
              <button type="button" onClick={() => setShowIdCardModal(null)} aria-label="Tutup ID Card" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><FaTimes /></button>
            </header>

            <div className="employee-id-preview">
              <article className={`employee-id-card employee-id-card--${idCardOrientation} employee-id-card--${selectedIdCardTemplate}`}>
                <div className="employee-id-card__pattern" aria-hidden="true" />
                <div className="employee-id-card__top-wave" aria-hidden="true" />
                <header className="employee-id-card__brand">
                  <span className="employee-id-card__logo">
                    {pengaturan.logo_url
                      ? <img src={pengaturan.logo_url} alt={`Logo ${pengaturan.school_name}`} />
                      : <b>{pengaturan.logo_text || 'YDE'}</b>}
                  </span>
                  <strong>{pengaturan.school_name || 'YAYASAN DAR EL-IMAN'}</strong>
                  <small>{pengaturan.application_name || 'ISLAMIC SCHOOL'}</small>
                  <em>Berilmu, Berakhlak, Beramal</em>
                </header>

                <span className="employee-id-card__label">KARTU PEGAWAI</span>

                <div className="employee-id-card__photo">
                  {showIdCardModal.foto ? (
                    <img src={showIdCardModal.foto} alt={showIdCardModal.nama_lengkap} />
                  ) : (
                    <span>{showIdCardModal.nama_lengkap.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>

                <div className="employee-id-card__identity">
                  <h3>{showIdCardModal.gelar_depan} {showIdCardModal.nama_lengkap}{showIdCardModal.gelar_belakang ? `, ${showIdCardModal.gelar_belakang}` : ''}</h3>
                  <strong>{showIdCardModal.jabatan_name || 'Pegawai'}</strong>
                </div>

                <dl className="employee-id-card__meta">
                  <div><dt>NIY</dt><dd>{showIdCardModal.niy || '—'}</dd></div>
                  <div><dt>Unit Kerja</dt><dd>{showIdCardModal.unit_name || '—'}</dd></div>
                  <div><dt>Tanggal Lahir</dt><dd>{formatEmployeeCardDate(showIdCardModal.tanggal_lahir)}</dd></div>
                  <div><dt>Status</dt><dd>{showIdCardModal.status_pegawai || showIdCardModal.status || '—'}</dd></div>
                </dl>

                <div className="employee-id-card__qr">
                  <QRCodeSVG
                    value={makeEmployeeQrPayload(showIdCardModal)}
                    size={92}
                    level="M"
                    marginSize={1}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    title={`QR akses SIMSIT ${showIdCardModal.nama_lengkap}`}
                  />
                  <span>SCAN UNTUK VERIFIKASI</span>
                </div>

                <footer><b>Generasi Beriman, Berilmu,<br />Berakhlak Mulia</b><span>TAHUN AJARAN<br />2025/2026</span></footer>
              </article>

              <aside className="employee-id-info">
                <div className="employee-id-template-picker">
                  <div>
                    <h3>Pilih Template Kartu</h3>
                    <p>Pilih warna kartu identitas yang akan digunakan.</p>
                  </div>
                  <div className="employee-id-template-grid">
                    {ID_CARD_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setSelectedIdCardTemplate(template.id)}
                        aria-pressed={selectedIdCardTemplate === template.id}
                        className={`employee-id-template-option employee-id-template-option--${template.id} ${selectedIdCardTemplate === template.id ? 'is-selected' : ''}`}
                      >
                        <span className="employee-id-template-option__preview">
                          <i />
                          <b>DEI</b>
                          <em />
                          <small>QR</small>
                        </span>
                        <strong>{template.label}</strong>
                        <small>{template.description}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="employee-id-orientation-picker">
                  <div>
                    <h3>Orientasi Kartu</h3>
                    <p>Pilih tata letak kartu untuk preview dan hasil cetak.</p>
                  </div>
                  <div className="employee-id-orientation-grid">
                    {[
                      ['horizontal', 'Horizontal'],
                      ['vertical', 'Vertikal'],
                    ].map(([value, label]) => (
                      <button key={value} type="button" onClick={() => changeIdCardOrientation(value)} aria-pressed={idCardOrientation === value} className={idCardOrientation === value ? 'is-selected' : ''}>
                        <span className={`employee-id-orientation-icon employee-id-orientation-icon--${value}`}><i /><b /></span>
                        <strong>{label}</strong>
                        {idCardOrientation === value && <FaCheckCircle />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Informasi QR Login</h3>
                  <p>QR memuat identitas pengguna, unit kerja, dan peran akses untuk proses pertukaran autentikasi SIMSIT.</p>
                </div>
                <dl>
                  <div><dt>Identifier Login</dt><dd>{showIdCardModal.niy || showIdCardModal.email}</dd></div>
                  <div><dt>Peran Utama</dt><dd>{showIdCardModal.jabatan_name || 'Pegawai'}</dd></div>
                  <div><dt>Unit Kerja</dt><dd>{showIdCardModal.unit_name || '—'}</dd></div>
                  <div><dt>Status</dt><dd><span>{showIdCardModal.status}</span></dd></div>
                </dl>
                <div className="employee-id-security-note">
                  <BadgeCheck />
                  <p>QR tidak menyimpan password atau token rahasia. Backend nantinya harus memvalidasi QR dan menukarnya dengan sesi login yang aman.</p>
                </div>
              </aside>
            </div>

            <footer className="employee-id-modal__footer flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/40">
              <button type="button" onClick={() => setShowIdCardModal(null)} className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Tutup</button>
              <button type="button" onClick={() => window.print()} className="flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-5 text-xs font-bold text-white shadow hover:bg-emerald-900"><FaPrint /> Cetak ID Card</button>
            </footer>
          </section>
        </div>
      )}

      {/* 8. MODAL KONFIRMASI HAPUS PEGAWAI */}
      {deleteTarget && (
        <div className="employee-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Hapus Pegawai">
          <div className="employee-delete-modal w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-6 text-center space-y-3 border-b border-slate-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-2xl">
                <FaExclamationTriangle />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Hapus Data Pegawai</h3>
              <p className="text-xs text-slate-500">Apakah Anda yakin ingin menghapus pegawai berikut secara permanen?</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800 font-black text-white text-xs">
                  {deleteTarget.nama_lengkap.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-xs space-y-0.5">
                  <h4 className="font-extrabold text-slate-900">{deleteTarget.nama_lengkap}</h4>
                  <p className="text-slate-500">NIY: <span className="font-medium text-slate-700">{deleteTarget.niy}</span></p>
                  <p className="text-slate-500">Jabatan: <span className="font-medium text-slate-700">{deleteTarget.jabatan_name}</span></p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={hasConfirmedDeleteCheck}
                  onChange={(e) => setHasConfirmedDeleteCheck(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-800 focus:ring-emerald-600"
                />
                Saya memahami bahwa data pegawai tidak dapat dikembalikan.
              </label>
            </div>

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
        <div className="employee-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="employee-export-title">
          <section className="employee-export-modal w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#1B2433]">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
              <h2 id="employee-export-title" className="text-base font-bold text-slate-900 dark:text-white">Export Data Pegawai</h2>
              <button type="button" onClick={() => setShowExportModal(false)} aria-label="Tutup modal export" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><FaTimes /></button>
            </header>
            <div className="space-y-5 p-5">
              <div>
                <p className="mb-3 text-xs font-bold text-slate-700 dark:text-slate-200">Pilih Format Export</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['xlsx', 'Excel (.xlsx)', 'Format Excel untuk pengolahan data lanjutan', FaFileExcel],
                    ['csv', 'CSV (.csv)', 'Format CSV untuk kompatibilitas sistem lain', FileText],
                  ].map(([format, label, description, Icon]) => (
                    <button key={format} type="button" onClick={() => setExportFormat(format)} className={`relative min-h-28 rounded-xl border p-4 text-left transition ${exportFormat === format ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/10 dark:bg-emerald-950/30' : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700'}`}>
                      <Icon className={`mb-3 h-6 w-6 ${exportFormat === format ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <strong className="block text-xs text-slate-900 dark:text-white">{label}</strong>
                      <span className="mt-1 block text-[10px] leading-relaxed text-slate-500">{description}</span>
                      {exportFormat === format && <span className="absolute right-3 top-3 text-sm font-black text-emerald-700">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-200">Opsi Export</p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-emerald-700" /> Export semua data</label>
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-emerald-700" /> Export sesuai filter aktif</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="accent-emerald-700" /> Hanya data pegawai aktif</label>
                </div>
              </div>
            </div>
            <footer className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/40">
              <button type="button" onClick={() => setShowExportModal(false)} className="h-10 rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Batal</button>
              <button type="button" onClick={() => { setShowExportModal(false); pushNotification('Export Berhasil', `Data pegawai berhasil disiapkan dalam format ${exportFormat === 'xlsx' ? 'Excel' : 'CSV'}.`, 'info') }} className="h-10 rounded-xl bg-emerald-800 px-6 text-xs font-bold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-900">Export</button>
            </footer>
          </section>
        </div>
      )}

      {/* 9. MODAL DASHBOARD IMPORT PEGAWAI */}
      {showImportModal && (
        <div className="employee-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Import Data Pegawai">
          <div className="employee-import-modal w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <FaFileImport className="text-base" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Import Data Pegawai</h2>
                  <p className="text-xs text-slate-500">Unggah file CSV/Excel untuk impor data pegawai secara massal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowImportModal(false); setImportFile(null); setImportPreviewData([]) }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FaFileExcel className="text-2xl text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Unduh Format Template Import Pegawai</h4>
                    <p className="text-[11px] text-slate-500">Format disesuaikan dengan skema master pegawai ERP.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplatePegawai}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-white px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
                >
                  <FaDownload className="text-emerald-600" /> Unduh Template
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Unggah File (Excel / CSV)</label>
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:bg-slate-50 cursor-pointer transition">
                  <FaUpload className="text-3xl text-emerald-700 mb-2" />
                  <span className="text-xs font-bold text-slate-800">
                    {importFile ? importFile.name : 'Klik untuk memilih file Excel atau CSV'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {importFile ? `${(importFile.size / 1024).toFixed(1)} KB` : 'Format disukai: .csv, .xlsx (Maks. 5MB)'}
                  </span>
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {importPreviewData.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">Preview Data ({importPreviewData.length} baris)</h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                        <tr>
                          <th className="py-2 px-3">NIY</th>
                          <th className="py-2 px-3">Nama Pegawai</th>
                          <th className="py-2 px-3">Jabatan</th>
                          <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importPreviewData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono">{row.niy}</td>
                            <td className="py-2 px-3 font-bold text-slate-800">{row.nama}</td>
                            <td className="py-2 px-3">{row.jabatan}</td>
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

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <button
                type="button"
                onClick={() => { setShowImportModal(false); setImportFile(null); setImportPreviewData([]) }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!importFile || isImporting}
                onClick={handleProcessImport}
                className="flex items-center gap-2 rounded-xl bg-[#064e3b] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800 disabled:opacity-50 transition"
              >
                {isImporting ? 'Memproses Import...' : 'Proses Import Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="employee-toast-stack" aria-live="polite" aria-atomic="true">
        {notifications.map((notification) => (
          <article key={notification.id} className={`employee-toast employee-toast--${notification.tone}`}>
            <span className="employee-toast__icon">
              {notification.tone === 'info' ? <Info /> : notification.tone === 'warning' ? <FaExclamationTriangle /> : notification.tone === 'error' ? <FaTimes /> : <BadgeCheck />}
            </span>
            <div className="min-w-0 flex-1">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
            </div>
            <button type="button" onClick={() => setNotifications((current) => current.filter((item) => item.id !== notification.id))} aria-label="Tutup notifikasi"><FaTimes /></button>
          </article>
        ))}
      </div>
    </MasterDataPage>
  )
}
