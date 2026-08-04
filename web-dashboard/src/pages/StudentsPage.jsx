import { useEffect, useMemo, useState } from 'react'
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaEye,
  FaFileExcel,
  FaFileImport,
  FaFilter,
  FaPlus,
  FaPrint,
  FaSearch,
  FaMale,
  FaFemale,
  FaBuilding,
  FaTimes,
  FaTrash,
  FaUpload,
  FaUser,
  FaUserGraduate,
} from 'react-icons/fa'
import Swal from 'sweetalert2'
import CetakKartuSiswaModal from '../components/siswa/CetakKartuSiswaModal'
import StudentFormModal from '../components/siswa/StudentFormModal'
import { useDaftarKelas } from '../hooks/useReferenceData'
import { useAksiSiswa, useDaftarSiswa } from '../hooks/useStudents'
import {
  MasterActionButton,
  MasterDataPage,
  MasterPageHeader,
  MasterStatCard,
  MasterStatsGrid,
} from '../components/master-data'

const initialForm = () => ({
  id: null,
  // Step 1: Data Siswa
  nis: '',
  nisn: '',
  full_name: '',
  birth_place: '',
  birth_date: '',
  gender: 'male',
  agama: 'Islam',
  foto_url: '',

  // Step 2: Ortu / Wali
  nama_ayah: '',
  pekerjaan_ayah: '',
  hp_ayah: '',
  nama_ibu: '',
  pekerjaan_ibu: '',
  hp_ibu: '',
  nama_wali: '',
  hp_wali: '',
  alamat_ortu: '',

  // Step 3: Akademik
  unit_pendidikan: 'SDIT 2 Dar el-Iman - Padang',
  class_id: '',
  kelas_label: '6A',
  rombel: 'Rombel A',
  tahun_ajaran: '2024/2025',
  tanggal_masuk: '2023-07-10',
  no_induk_sebelumnya: '',
  status_siswa: 'aktif',
  kurikulum: 'Kurikulum Merdeka',
  beasiswa: 'Tidak Ada',
  catatan: '',
})

export default function StudentsPage() {
  const [step, setStep] = useState(1)

  // Filters
  const [unitFilter, setUnitFilter] = useState('')
  const [kelasFilter, setKelasFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal Control States
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showCetakModal, setShowCetakModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  // Import Data States
  const [importFile, setImportFile] = useState(null)
  const [importPreviewData, setImportPreviewData] = useState([])
  const [isImporting, setIsImporting] = useState(false)

  // Selected student data
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [activeDetailTab, setActiveDetailTab] = useState('siswa')
  const [studentToPrint, setStudentToPrint] = useState(null)

  // Form State
  const [formData, setFormData] = useState(initialForm())
  const [isEdit, setIsEdit] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Hooks data API
  const { data: daftarSiswaData, isLoading, isError, refetch } = useDaftarSiswa({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchQuery || undefined,
  })
  const { data: daftarKelasData } = useDaftarKelas(
    { per_page: 200 },
    { enabled: showFormModal, staleTime: 5 * 60 * 1000 },
  )
  const { tambah, ubah, hapus } = useAksiSiswa()

  const rawStudents = daftarSiswaData?.data || []
  const rawClasses = daftarKelasData?.data || []
  const studentPagination = {
    total: daftarSiswaData?.total || 0,
    from: daftarSiswaData?.from || 0,
    to: daftarSiswaData?.to || 0,
    lastPage: daftarSiswaData?.last_page || 1,
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentPage(1)
      setSearchQuery(searchInput.trim())
    }, 400)

    return () => window.clearTimeout(timer)
  }, [searchInput])

  // --- Handlers Import ---
  const handleDownloadTemplateSiswa = () => {
    const headers = [
      // Identitas Siswa
      'No Pendaftaran', 'NIK', 'No Registrasi Akta Lahir', 'No KK', 'NIS', 'NISN', 'Nama Lengkap',
      'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin (L/P)', 'Agama', 'Kewarganegaraan', 'Email',
      'Anak Ke', 'Jumlah Saudara', 'Jumlah Saudara Tiri', 'Berat Badan (kg)', 'Tinggi Badan (cm)',
      'Riwayat Penyakit', 'Foto URL',
      // Alamat
      'Alamat Siswa', 'RT', 'RW', 'Dusun', 'Kelurahan', 'Kecamatan', 'Kota/Kabupaten',
      'Provinsi', 'Kode Pos', 'Jenis Tempat Tinggal', 'Jarak ke Sekolah (km)', 'Moda Transportasi',
      'Hobi', 'Cita-cita',
      // Sekolah & Bantuan
      'Sekolah Asal', 'Status Sekolah Asal', 'Kecamatan Sekolah Asal', 'Kota/Kab Sekolah Asal',
      'HP/WA Sekolah Asal', 'Nominal SPP', 'Nominal Bantuan Ortu Asuh', 'Penerima KPS/PKH (ya/tidak)',
      'Punya KIP (ya/tidak)', 'Layak PIP (ya/tidak)', 'Alasan Menolak PIP',
      // Data Ayah
      'NIK Ayah', 'Nama Ayah', 'Tempat Lahir Ayah', 'Tgl Lahir Ayah', 'Telfon Ayah', 'HP Ayah',
      'WA Ayah', 'Medsos Ayah', 'Pendidikan Terakhir Ayah', 'Pekerjaan Ayah',
      'Instansi Pekerjaan Ayah', 'Jabatan Ayah', 'Keahlian Ayah', 'Penghasilan Ayah',
      'Alamat Instansi Ayah', 'Alamat Rumah Ayah',
      // Data Ibu
      'NIK Ibu', 'Nama Ibu', 'Tempat Lahir Ibu', 'Tgl Lahir Ibu', 'Telfon Ibu', 'HP Ibu',
      'WA Ibu', 'Medsos Ibu', 'Pendidikan Terakhir Ibu', 'Pekerjaan Ibu',
      'Instansi Pekerjaan Ibu', 'Jabatan Ibu', 'Keahlian Ibu', 'Penghasilan Ibu',
      'Alamat Instansi Ibu', 'Alamat Rumah Ibu',
      // Data Wali
      'NIK Wali', 'Nama Wali', 'HP Wali', 'WA Wali', 'Pekerjaan Wali', 'Alamat Wali',
      // Akademik
      'Unit Pendidikan', 'NIS Pembayaran', 'Tahun Ajaran Masuk', 'Tahun Ajaran Berjalan',
      'Status Siswa', 'Status Orang Tua (Umum/Pegawai)', 'NIY Ortu Jika Pegawai',
      'Wali Kelas', 'NIY Wali Kelas',
    ]
    const sampleRow = [
      'PDK-2024-001', '1371234567890123', 'AK.2014.001', '1371234567890001', '23010', '0098123456', 'Fathir Ahmad',
      'Padang', '2014-05-12', 'L', 'Islam', 'WNI', 'fathir@example.com',
      '1', '2', '0', '35', '130',
      '-', 'https://example.com/foto.jpg',
      'Jl. Khatib Sulaiman No. 10', '04', '02', 'Lolong', 'Lolong Belanti', 'Padang Utara', 'Padang',
      'Sumatera Barat', '25114', 'Milik Sendiri', '2', 'Jalan Kaki',
      'Membaca', 'Dokter',
      'SD Negeri 01 Padang', 'Formal', 'Padang Utara', 'Padang',
      '0812-0000-0001', '500000', '0', 'tidak',
      'tidak', 'tidak', '-',
      '1371098765432101', 'Rahmat Hidayat', 'Padang', '1985-03-10', '0751-000001', '081299887766',
      '081299887766', '-', 'S1/D4', 'Wiraswasta',
      'CV Rahmat Jaya', 'Direktur', 'Manajemen', '7500000',
      'Jl. Sudirman No. 5 Padang', 'Jl. Khatib Sulaiman No. 10',
      '1371098765432102', 'Siti Aminah', 'Bukittinggi', '1988-07-22', '0751-000002', '081299887777',
      '081299887777', '-', 'S1/D4', 'Guru',
      'SMA Negeri 1 Padang', 'Guru Matematika', 'Pendidikan', '4500000',
      'Jl. Hamka No. 10 Padang', 'Jl. Khatib Sulaiman No. 10',
      '-', '-', '-', '-', '-', '-',
      'SDIT 2 Dar el-Iman - Padang', '23010', '2024/2025', '2024/2025',
      'aktif', 'Umum', '-',
      'Budi Santoso S.Pd', 'NIY-2024-001',
    ]
    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Template_Import_Data_Lengkap_Siswa.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportFile(file)
    setImportPreviewData([
      { nis: '23011', nisn: '0098761122', nama: 'Fatimah Az-Zahra', gender: 'P', tempatLahir: 'Padang', tanggalLahir: '2015-03-10', agama: 'Islam', alamat: 'Jl. Raden Saleh', unit: 'SDIT 2', kelas: '6A', namaAyah: 'Abdullah', hpAyah: '0812-1111-2222', namaIbu: 'Khadijah', hpIbu: '0812-1111-3333', namaWali: '-', hpWali: '-', status: 'Valid', email: 'fatimah@example.com' },
      { nis: '23012', nisn: '0098761123', nama: 'Abdullah Al-Fatih', gender: 'L', tempatLahir: 'Padang', tanggalLahir: '2015-07-22', agama: 'Islam', alamat: 'Jl. Khatib Sulaiman', unit: 'SDIT 2', kelas: '6A', namaAyah: 'Ahmad', hpAyah: '0812-2222-3333', namaIbu: '-', hpIbu: '-', namaWali: '-', hpWali: '-', status: 'Valid', email: 'abdullah@example.com' },
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
      Swal.fire({ title: 'Import Berhasil!', text: 'Data siswa berhasil diimpor.', icon: 'success', confirmColor: '#064e3b' })
    }, 1200)
  }

  // Predefined default mock students
  const defaultStudents = useMemo(() => [
    {
      id: 'demo-1',
      nis: '23001',
      nisn: '0098765446',
      nama: 'Ahmad Zaky',
      unit: 'SDIT 2 Dar el-Iman - Padang',
      kelas: '6A',
      orangTua: 'Ahmad Fauzi (Ayah)',
      noHp: '0812-3456-7890',
      status: 'Aktif',
      gender: 'Laki-laki',
      tempatLahir: 'Padang',
      tanggalLahir: '2014-05-12',
      agama: 'Islam',
      alamat: 'Jl. Khatib Sulaiman No. 10 Kel. Lolong Belanti Kec. Padang Utara Padang',
    },
    {
      id: 'demo-2',
      nis: '23002',
      nisn: '0098765447',
      nama: 'Aisyah Humaira',
      unit: 'SDIT 2 Dar el-Iman - Padang',
      kelas: '6A',
      orangTua: 'Siti Rahmawati (Ibu)',
      noHp: '0813-2222-4444',
      status: 'Aktif',
      gender: 'Perempuan',
      tempatLahir: 'Padang',
      tanggalLahir: '2014-08-20',
      agama: 'Islam',
      alamat: 'Jl. Raden Saleh Padang',
    },
    {
      id: 'demo-3',
      nis: '23003',
      nisn: '0098765448',
      nama: 'Muhammad Fadli',
      unit: 'SDIT 3 Dar el-Iman - Padang',
      kelas: '5B',
      orangTua: 'Fadli Hasan (Ayah)',
      noHp: '0812-1111-2222',
      status: 'Aktif',
      gender: 'Laki-laki',
      tempatLahir: 'Padang',
      tanggalLahir: '2015-02-14',
      agama: 'Islam',
      alamat: 'Kuranji Padang',
    },
    {
      id: 'demo-4',
      nis: '23004',
      nisn: '0098765449',
      nama: 'Nabila Putri',
      unit: 'SDIT 1 Dar el-Iman - 50 Kota',
      kelas: '5A',
      orangTua: 'Rudi Santoso (Ayah)',
      noHp: '0812-3333-4444',
      status: 'Aktif',
      gender: 'Perempuan',
      tempatLahir: 'Payakumbuh',
      tanggalLahir: '2015-11-03',
      agama: 'Islam',
      alamat: '50 Kota',
    },
    {
      id: 'demo-5',
      nis: '23005',
      nisn: '0098765450',
      nama: 'Raihan Abiyyu',
      unit: 'MIT SaQu Dar el-Iman - Padang',
      kelas: '4A',
      orangTua: 'Andi Wijaya (Ayah)',
      noHp: '0812-5555-6666',
      status: 'Mutasi',
      gender: 'Laki-laki',
      tempatLahir: 'Padang',
      tanggalLahir: '2016-01-15',
      agama: 'Islam',
      alamat: 'Nanggalo Padang',
    },
    {
      id: 'demo-6',
      nis: '23006',
      nisn: '0098765451',
      nama: 'Salsabila Zahra',
      unit: 'TKIT 1 Dar el-Iman - Padang',
      kelas: 'TK B',
      orangTua: 'Dewi Anggraini (Ibu)',
      noHp: '0813-7777-8888',
      status: 'Aktif',
      gender: 'Perempuan',
      tempatLahir: 'Padang',
      tanggalLahir: '2018-09-09',
      agama: 'Islam',
      alamat: 'Marapalam Padang',
    },
    {
      id: 'demo-7',
      nis: '23007',
      nisn: '0098765452',
      nama: 'Fahrian Ibrahim',
      unit: 'SDIT 4 Dar el-Iman - Padang',
      kelas: '3A',
      orangTua: 'Budi Setiawan (Ayah)',
      noHp: '0813-9999-0000',
      status: 'Lulus',
      gender: 'Laki-laki',
      tempatLahir: 'Padang',
      tanggalLahir: '2014-04-10',
      agama: 'Islam',
      alamat: 'Ulak Karang Padang',
    },
    {
      id: 'demo-8',
      nis: '23008',
      nisn: '0098765453',
      nama: 'Kayla Azka',
      unit: 'SDIT 2 Dar el-Iman - Padang',
      kelas: '3B',
      orangTua: 'Maya Sari (Ibu)',
      noHp: '0812-1212-3434',
      status: 'Aktif',
      gender: 'Perempuan',
      tempatLahir: 'Padang',
      tanggalLahir: '2017-03-25',
      agama: 'Islam',
      alamat: 'Lapai Padang',
    },
  ], [])

  // Map API students to display list
  // Map API students to display list
  const formattedStudents = useMemo(() => {
    if (rawStudents.length > 0) {
      return rawStudents.map((item) => {
        const meta = item.metadata || {}
        const parentRel = item.parent || {}
        const parentsPivot = item.parents_pivot || item.parents || []

        // Extract Parent Name with fallback options
        let parentName = ''
        let relationshipLabel = ''

        if (meta.nama_ayah || meta.ayah?.nama || meta.orang_tua?.nama_ayah || item.nama_ayah) {
          parentName = meta.nama_ayah || meta.ayah?.nama || meta.orang_tua?.nama_ayah || item.nama_ayah
          relationshipLabel = 'Ayah'
        } else if (meta.nama_ibu || meta.ibu?.nama || meta.orang_tua?.nama_ibu || item.nama_ibu) {
          parentName = meta.nama_ibu || meta.ibu?.nama || meta.orang_tua?.nama_ibu || item.nama_ibu
          relationshipLabel = 'Ibu'
        } else if (meta.nama_wali || meta.wali?.nama || meta.orang_tua?.nama_wali || item.nama_wali) {
          parentName = meta.nama_wali || meta.wali?.nama || meta.orang_tua?.nama_wali || item.nama_wali
          relationshipLabel = 'Wali'
        } else if (typeof meta.orang_tua === 'string' && meta.orang_tua.trim()) {
          parentName = meta.orang_tua.trim()
        } else if (typeof item.orang_tua === 'string' && item.orang_tua.trim()) {
          parentName = item.orang_tua.trim()
        } else if (typeof meta.orang_tua === 'object' && (meta.orang_tua?.nama || meta.orang_tua?.full_name || meta.orang_tua?.name)) {
          parentName = meta.orang_tua?.nama || meta.orang_tua?.full_name || meta.orang_tua?.name
        } else if (meta.nama_ortu || meta.nama_orang_tua || meta.parent_name || meta.orang_tua_nama) {
          parentName = meta.nama_ortu || meta.nama_orang_tua || meta.parent_name || meta.orang_tua_nama
        } else if (item.nama_ortu || item.nama_orang_tua || item.parent_name) {
          parentName = item.nama_ortu || item.nama_orang_tua || item.parent_name
        } else if (parentRel.full_name || parentRel.name) {
          parentName = parentRel.full_name || parentRel.name
          relationshipLabel = 'Orang Tua'
        } else if (parentsPivot[0]?.full_name || parentsPivot[0]?.name) {
          parentName = parentsPivot[0].full_name || parentsPivot[0].name
          if (parentsPivot[0]?.pivot?.relationship_type) {
            relationshipLabel = parentsPivot[0].pivot.relationship_type
          }
        }

        const ortuObj = parentName
          ? (relationshipLabel ? `${parentName} (${relationshipLabel})` : parentName)
          : '-'

        // Extract Phone Number with fallback options
        const hpObj =
          meta.hp_ayah || meta.telfon_ayah || meta.nomor_wa_ayah || meta.nomor_hp_wa_ayah || meta.ayah?.hp ||
          meta.hp_ibu || meta.telfon_ibu || meta.nomor_wa_ibu || meta.nomor_hp_wa_ibu || meta.ibu?.hp ||
          meta.hp_wali || meta.telfon_wali || meta.nomor_wa_wali || meta.nomor_hp_wa_wali || meta.wali?.hp ||
          (typeof meta.orang_tua === 'object' ? (meta.orang_tua?.no_hp || meta.orang_tua?.hp || meta.orang_tua?.phone) : null) ||
          meta.no_hp || meta.phone ||
          parentRel.phone || parentRel.no_hp || parentRel.telepon ||
          parentsPivot[0]?.phone || parentsPivot[0]?.no_hp ||
          item.phone || item.no_hp || item.hp_ortu || '-'

        const fotoObj =
          meta.foto_url ||
          meta.foto ||
          meta.photo_url ||
          meta.photo ||
          meta.avatar ||
          meta.avatar_url ||
          meta.url_foto ||
          item.foto_url ||
          item.foto ||
          item.photo_url ||
          item.photo ||
          item.avatar ||
          item.user?.avatar ||
          item.user?.avatar_url ||
          item.user?.photo ||
          ''

        const stRaw = String(meta.akademik?.status_siswa || (item.is_active ? 'aktif' : 'nonaktif')).toLowerCase()
        const statusText =
          stRaw === 'mutasi'
            ? 'Mutasi'
            : stRaw === 'lulus'
              ? 'Lulus'
              : stRaw === 'aktif' || item.is_active
                ? 'Aktif'
                : 'Nonaktif'

        return {
          id: item.id,
          nis: item.nis || '-',
          nisn: item.nisn || meta.nisn || '-',
          nama: item.full_name || item.nama || '-',
          unit: meta.akademik?.unit_pendidikan || meta.unit_pendidikan || item.education_unit?.name || 'SDIT 2 Dar el-Iman - Padang',
          kelas: meta.akademik?.kelas || item.school_class?.name || item.class?.name || '6A',
          orangTua: ortuObj,
          noHp: hpObj,
          status: statusText,
          gender: item.gender === 'female' ? 'Perempuan' : 'Laki-laki',
          tempatLahir: item.birth_place || meta.birth_place || 'Padang',
          tanggalLahir: item.birth_date ? String(item.birth_date).slice(0, 10) : (meta.birth_date ? String(meta.birth_date).slice(0, 10) : '2014-05-12'),
          agama: meta.agama || 'Islam',
          alamat: item.address || meta.alamat_siswa || 'Padang - Sumatera Barat',
          foto: fotoObj,
          raw: item,
        }
      })
    }
    return defaultStudents
  }, [rawStudents, defaultStudents])

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return formattedStudents.filter((item) => {
      const matchUnit = !unitFilter || item.unit.toLowerCase().includes(unitFilter.toLowerCase())
      const matchKelas = !kelasFilter || item.kelas.toLowerCase().includes(kelasFilter.toLowerCase())
      const matchStatus = !statusFilter || item.status.toLowerCase() === statusFilter.toLowerCase()
      const matchSearch =
        !searchInput ||
        item.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.nis.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.nisn.toLowerCase().includes(searchInput.toLowerCase())
      return matchUnit && matchKelas && matchStatus && matchSearch
    })
  }, [formattedStudents, unitFilter, kelasFilter, statusFilter, searchInput])

  // Pagination
  const totalPages = Math.max(1, studentPagination.lastPage)
  const paginatedStudents = filteredStudents

  // Form Handlers
  const handleOpenTambah = () => {
    setIsEdit(false)
    setSelectedStudent(null)
    setShowFormModal(true)
  }

  const handleOpenEdit = (student) => {
    setIsEdit(true)
    setSelectedStudent(student)
    setShowDetailModal(false)
    setShowFormModal(true)
  }

  const handleOpenDetail = (student) => {
    setSelectedStudent(student)
    setActiveDetailTab('siswa')
    setShowDetailModal(true)
  }

  const handleDelete = async (student) => {
    const res = await Swal.fire({
      title: 'Hapus data siswa?',
      text: `Data ${student.nama} akan dihapus dari sistem.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
    })
    if (res.isConfirmed) {
      if (student.raw?.id) {
        await hapus.mutateAsync(student.id)
      } else {
        await Swal.fire('Berhasil', 'Data siswa berhasil dihapus.', 'success')
      }
      setShowDetailModal(false)
    }
  }

  const handleFormSubmitCallback = async (payload) => {
    try {
      if (isEdit && payload.id) {
        if (String(payload.id).startsWith('demo-')) {
          Swal.fire('Berhasil', 'Data siswa berhasil diperbarui (mode demo).', 'success')
        } else {
          await ubah.mutateAsync({ id: payload.id, payload })
          Swal.fire('Berhasil', 'Data siswa berhasil diperbarui.', 'success')
        }
      } else {
        await tambah.mutateAsync(payload)
        Swal.fire('Berhasil', 'Data siswa baru berhasil ditambahkan.', 'success')
      }
      setShowFormModal(false)
    } catch (err) {
      Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data.', 'error')
    }
  }

  // Export Excel CSV trigger
  const handleExportExcel = () => {
    const headers = ['NIS', 'NISN', 'Nama Lengkap', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'Alamat', 'Unit Pendidikan', 'Kelas', 'Nama Ayah', 'HP Ayah', 'Nama Ibu', 'HP Ibu', 'Nama Wali', 'HP Wali', 'Status', 'Email']
    const csvRows = [headers.join(',')]

    filteredStudents.forEach((st) => {
      const meta = st.raw?.metadata || {}
      const row = [
        `"${st.nis}"`,
        `"${st.nisn}"`,
        `"${st.nama}"`,
        `"${st.gender}"`,
        `"${st.tempatLahir || ''}"`,
        `"${st.tanggalLahir || ''}"`,
        `"${st.agama || ''}"`,
        `"${(st.alamat || '').replace(/"/g, '""')}"`,
        `"${st.unit}"`,
        `"${st.kelas}"`,
        `"${meta.ayah?.nama || ''}"`,
        `"${meta.ayah?.hp || meta.ibu?.hp || meta.wali?.hp || ''}"`,
        `"${meta.ibu?.nama || ''}"`,
        `"${meta.ibu?.hp || ''}"`,
        `"${meta.wali?.nama || ''}"`,
        `"${meta.wali?.hp || ''}"`,
        `"${st.status}"`,
        `"${meta.email || ''}"`,
      ]
      csvRows.push(row.join(','))
    })

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Data_Siswa_DarElIman_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Render Status Badge
  const renderStatusBadge = (statusStr) => {
    const st = String(statusStr || '').toLowerCase()
    if (st === 'aktif') {
      return <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Aktif</span>
    }
    if (st === 'mutasi') {
      return <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Mutasi</span>
    }
    if (st === 'lulus') {
      return <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Lulus</span>
    }
    return <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">Nonaktif</span>
  }

  return (
    <MasterDataPage className="education-unit-page student-master-page" hideBreadcrumb>
      <MasterPageHeader
        title="Master Siswa"
        description="Kelola identitas, data akademik, orang tua atau wali, serta status seluruh siswa."
        tone="brand"
        icon={FaUserGraduate}
        actions={(
          <MasterActionButton
            className="education-unit-hero__action !h-11 !rounded-xl !border-white !bg-white !px-5 !text-xs !text-emerald-800 !shadow-none hover:!bg-emerald-50"
            icon={FaPlus}
            onClick={handleOpenTambah}
          >
            Tambah Siswa
          </MasterActionButton>
        )}
      />

      {/* Quick Summary Cards */}
      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={FaUserGraduate} label="Total Siswa" value={studentPagination.total || filteredStudents.length} description="Terdaftar di sistem" variant="success" delay={40} />
        <MasterStatCard
          icon={FaMale}
          label="Siswa Laki-laki"
          value={filteredStudents.filter((s) => ['laki-laki', 'l'].includes((s.gender || '').toLowerCase())).length}
          description="Berdasarkan data filter"
          variant="info"
          delay={80}
        />
        <MasterStatCard
          icon={FaFemale}
          label="Siswa Perempuan"
          value={filteredStudents.filter((s) => ['perempuan', 'p'].includes((s.gender || '').toLowerCase())).length}
          description="Berdasarkan data filter"
          variant="danger"
          delay={120}
        />
        <MasterStatCard
          icon={FaCheckCircle}
          label="Status Aktif"
          value={filteredStudents.filter((s) => (s.status || '').toLowerCase() === 'aktif').length}
          description="Berdasarkan data filter"
          variant="warning"
          delay={160}
        />
      </MasterStatsGrid>

      {/* Filter Bar */}
      <section className="edu-enter rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-label="Pencarian dan filter siswa">
        {/* Search Input */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Cari siswa</span>
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari NIS, NISN, atau nama siswa..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            />
          </label>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="import" icon={FaFileImport} onClick={() => setShowImportModal(true)}>Import</MasterActionButton>
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="export" icon={FaFileExcel} onClick={handleExportExcel}>Export Excel</MasterActionButton>
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" icon={FaPlus} onClick={handleOpenTambah}>Tambah Siswa</MasterActionButton>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <div className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-slate-500 dark:border-slate-700 dark:text-slate-300">
            <FaFilter className="text-xs" />
            <span className="text-xs font-bold">Filter</span>
          </div>

          <select
            value={unitFilter}
            onChange={(e) => { setUnitFilter(e.target.value); setCurrentPage(1) }}
            className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
          >
            <option value="">Semua Unit Pendidikan</option>
            <option value="SDIT 1">SDIT 1 Dar el-Iman - 50 Kota</option>
            <option value="SDIT 2">SDIT 2 Dar el-Iman - Padang</option>
            <option value="SDIT 3">SDIT 3 Dar el-Iman - Padang</option>
            <option value="SDIT 4">SDIT 4 Dar el-Iman - Padang</option>
            <option value="TKIT 1">TKIT 1 Dar el-Iman - Padang</option>
            <option value="MIT SaQu">MIT SaQu Dar el-Iman - Padang</option>
          </select>

          <select
            value={kelasFilter}
            onChange={(e) => { setKelasFilter(e.target.value); setCurrentPage(1) }}
            className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
          >
            <option value="">Semua Kelas</option>
            <option value="6A">6A</option>
            <option value="5B">5B</option>
            <option value="5A">5A</option>
            <option value="4A">4A</option>
            <option value="3A">3A</option>
            <option value="3B">3B</option>
            <option value="TK B">TK B</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="h-11 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="mutasi">Mutasi</option>
            <option value="lulus">Lulus</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
            <button type="button" onClick={() => setShowImportModal(true)} title="Import Excel" className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600"><FaFileImport /></button>
            <button type="button" onClick={handleExportExcel} title="Export Excel" className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-emerald-700"><FaFileExcel /></button>
          </div>
        </div>
      </section>

      {/* Main Student Data Table */}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
      <section className="edu-enter overflow-hidden rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-labelledby="student-table-title">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 id="student-table-title" className="text-base font-bold text-slate-900 dark:text-white">Daftar Siswa</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Data siswa sesuai filter dan kewenangan pengguna.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{studentPagination.total || filteredStudents.length} siswa</span>
        </div>
        <div className="overflow-hidden">
          <table className="w-full table-fixed text-left text-sm text-slate-600" aria-label="Daftar siswa">
            <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="w-[6%] px-2 py-3 text-center">No</th>
                <th className="w-[34%] px-3 py-3 font-bold">Identitas Siswa</th>
                <th className="hidden w-[29%] px-3 py-3 font-bold md:table-cell">Orang Tua / Wali</th>
                <th className="hidden w-[11%] px-2 py-3 text-center font-bold sm:table-cell">Status</th>
                <th className="w-[20%] px-2 py-3 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td colSpan={5} className="px-4 py-4"><div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <p className="text-sm font-bold text-rose-700">Data siswa gagal dimuat</p>
                    <p className="mt-1 text-xs text-slate-500">Periksa koneksi server kemudian coba kembali.</p>
                    <button type="button" onClick={() => refetch()} className="mt-4 h-10 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white">Muat Ulang</button>
                  </td>
                </tr>
              ) : paginatedStudents.map((item, idx) => (
                <tr key={item.id} className="edu-row align-middle transition-colors hover:bg-emerald-50/40" style={{ animationDelay: `${Math.min(idx, 8) * 35}ms` }}>
                  <td className="px-2 py-3 text-center text-xs font-bold text-slate-400">
                    {(studentPagination.from || 1) + idx}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      {item.foto ? (
                        <img src={item.foto} alt="" loading="lazy" className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm" />
                      ) : (
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-black text-white shadow-sm">
                          {(item.nama || 'S').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
                        </span>
                      )}
                      <span className="min-w-0">
                        <strong className="block truncate text-xs font-extrabold leading-5 text-slate-900 dark:text-white" title={item.nama}>{item.nama}</strong>
                        <small className="block truncate text-[9px] font-medium text-slate-400">NIS {item.nis} · NISN {item.nisn || '-'}</small>
                        <small className="mt-0.5 block truncate text-[9px] font-semibold text-emerald-700 dark:text-emerald-300" title={`${item.unit} · Kelas ${item.kelas}`}>
                          {item.unit} · Kelas {item.kelas}
                        </small>
                        <small className="mt-0.5 block truncate text-[9px] font-medium text-slate-500 md:hidden" title={item.orangTua}>Ortu: {item.orangTua} ({item.noHp || '-'})</small>
                        <small className={`mt-0.5 text-[9px] font-bold sm:hidden ${(item.status || '').toLowerCase() === 'aktif' ? 'text-emerald-700' : 'text-amber-600'}`}>• {item.status}</small>
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 md:table-cell">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-800">{(item.orangTua || 'W').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
                      <span className="min-w-0">
                        <strong className="block truncate text-xs text-slate-800 dark:text-slate-100" title={item.orangTua}>{item.orangTua}</strong>
                        <small className="mt-1 block whitespace-nowrap text-[10px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                          {item.noHp || '-'}
                        </small>
                      </span>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-center sm:table-cell">{renderStatusBadge(item.status)}</td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex flex-nowrap items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(item)}
                        title="Lihat detail"
                        aria-label={`Lihat detail ${item.nama}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/20 dark:border-blue-800/70 dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        title="Edit siswa"
                        aria-label={`Edit ${item.nama}`}
                        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-500/20 sm:flex dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-300"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStudentToPrint(item)
                          setShowCetakModal(true)
                        }}
                        title="Cetak Kartu Siswa"
                        aria-label={`Cetak kartu ${item.nama}`}
                        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-500/20 lg:flex dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300"
                      >
                        <FaPrint className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        title="Hapus siswa"
                        aria-label={`Hapus ${item.nama}`}
                        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-rose-500/20 sm:flex dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-300"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && !isError && paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    Tidak ada data siswa yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 bg-slate-50/80 px-4 py-3 text-xs">
          <div className="text-slate-500">
            Menampilkan {filteredStudents.length === 0 ? 0 : studentPagination.from || 1} sampai{' '}
            {filteredStudents.length === 0 ? 0 : studentPagination.to || filteredStudents.length} dari {studentPagination.total || filteredStudents.length} data
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              Sebelumnya
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                  currentPage === pg ? 'bg-[#064e3b] text-white shadow' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </section>
      <aside className="space-y-4 xl:sticky xl:top-5" aria-label="Ringkasan siswa">
        <section className="edu-card rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><FaUserGraduate /></div>
            <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Siswa</h2><p className="text-xs text-slate-500">Data halaman aktif</p></div>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              ['Total Siswa', studentPagination.total || filteredStudents.length, FaUserGraduate, 'text-emerald-700 bg-emerald-50'],
              ['Siswa Aktif', filteredStudents.filter((s) => (s.status || '').toLowerCase() === 'aktif').length, FaCheckCircle, 'text-emerald-700 bg-emerald-50'],
              ['Laki-laki', filteredStudents.filter((s) => ['laki-laki', 'l'].includes((s.gender || '').toLowerCase())).length, FaMale, 'text-blue-700 bg-blue-50'],
              ['Perempuan', filteredStudents.filter((s) => ['perempuan', 'p'].includes((s.gender || '').toLowerCase())).length, FaFemale, 'text-rose-600 bg-rose-50'],
            ].map(([label, value, Icon, color]) => (
              <div key={label} className="flex items-center gap-3 py-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon /></span>
                <span className="min-w-0 flex-1 text-[11px] font-semibold text-slate-500">{label}</span>
                <strong className="text-sm font-black tabular-nums text-slate-900 dark:text-white">{value}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="edu-card rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Aksi Cepat</h2>
          <div className="mt-3 grid gap-2">
            {[
              ['Tambah Siswa', FaPlus, handleOpenTambah, 'text-emerald-700 bg-emerald-50'],
              ['Import Data Siswa', FaFileImport, () => setShowImportModal(true), 'text-blue-700 bg-blue-50'],
              ['Export Excel', FaFileExcel, handleExportExcel, 'text-emerald-700 bg-emerald-50'],
            ].map(([label, Icon, action, color]) => (
              <button key={label} type="button" onClick={action} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-left text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon /></span>{label}
              </button>
            ))}
          </div>
        </section>
      </aside>
      </div>

      {/* POP UP MODAL 1: DETAIL SISWA */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <FaUserGraduate className="text-lg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Detail Siswa</h3>
                  <p className="text-[11px] font-medium text-slate-500">Informasi lengkap siswa dan data pendukung.</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)}
                aria-label="Tutup detail siswa"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                <FaTimes className="text-base" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[75vh] overflow-y-auto bg-white p-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">

                {/* Left: Profile Overview Card */}
                <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-xs">
                  {/* Photo + Name + Status */}
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 border-emerald-600 bg-slate-100 shadow">
                      {selectedStudent.foto ? (
                        <img src={selectedStudent.foto} alt={selectedStudent.nama} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-emerald-800 text-lg font-black text-white">
                          {(selectedStudent.nama || 'S').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{selectedStudent.nama}</h3>
                        {renderStatusBadge(selectedStudent.status)}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">NIS: {selectedStudent.nis} | NISN: {selectedStudent.nisn}</p>
                      <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">{selectedStudent.unit}</p>
                    </div>
                  </div>

                  {/* Biodata Singkat */}
                  <div className="space-y-2.5 border-t border-slate-100 pt-3">
                    {[
                      { label: 'Tempat, Tgl Lahir', value: `${selectedStudent.tempatLahir}, ${selectedStudent.tanggalLahir}` },
                      { label: 'Jenis Kelamin', value: selectedStudent.gender },
                      { label: 'Agama', value: selectedStudent.agama || 'Islam' },
                      { label: 'Kelas', value: selectedStudent.kelas },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-start gap-2">
                        <span className="text-slate-500 shrink-0">{item.label}:</span>
                        <span className="font-semibold text-slate-800 text-right">{item.value || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Tabbed Detail */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Tab Navigation + Content */}
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {/* Tabs Header */}
                    <div className="flex gap-0 border-b border-slate-200 overflow-x-auto">
                      {[
                        { key: 'siswa', label: 'Data Siswa' },
                        { key: 'orangTua', label: 'Orang Tua / Wali' },
                        { key: 'akademik', label: 'Akademik' },
                        { key: 'riwayat', label: 'Riwayat' },
                        { key: 'dokumen', label: 'Dokumen' },
                      ].map(({ key, label }) => (
                        <button key={key} onClick={() => setActiveDetailTab(key)}
                          className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                            activeDetailTab === key
                              ? 'border-emerald-700 text-emerald-900 font-extrabold bg-emerald-50/50'
                              : 'border-transparent text-slate-500 hover:text-slate-700'
                          }`}>
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 text-xs space-y-2">
                      {(() => {
                        const rawMeta = selectedStudent.raw?.metadata || {}
                        const parentRel = selectedStudent.raw?.parent || {}
                        const parentsPivot = selectedStudent.raw?.parents_pivot || selectedStudent.raw?.parents || []
                        const meta = {
                          ...rawMeta,
                          nama_ayah: rawMeta.nama_ayah || rawMeta.ayah?.nama || rawMeta.orang_tua?.nama_ayah || parentRel.full_name || parentRel.name || parentsPivot[0]?.full_name,
                          nama_ibu: rawMeta.nama_ibu || rawMeta.ibu?.nama || rawMeta.orang_tua?.nama_ibu,
                          nama_wali: rawMeta.nama_wali || rawMeta.wali?.nama || rawMeta.orang_tua?.nama_wali,
                          hp_ayah: rawMeta.hp_ayah || rawMeta.ayah?.hp || rawMeta.orang_tua?.no_hp || parentRel.phone || parentRel.no_hp || parentsPivot[0]?.phone,
                          hp_ibu: rawMeta.hp_ibu || rawMeta.ibu?.hp || rawMeta.orang_tua?.no_hp,
                          hp_wali: rawMeta.hp_wali || rawMeta.wali?.hp || rawMeta.orang_tua?.no_hp,
                        }
                        const DRow = ({ label, val }) => (
                          <p><span className="font-bold text-slate-700">{label}:</span>{' '}
                            <span className="text-slate-800">{val || '-'}</span>
                          </p>
                        )
                        if (activeDetailTab === 'siswa') return (
                          <div className="space-y-2">
                            <DRow label="NIS" val={selectedStudent.nis} />
                            <DRow label="NISN" val={selectedStudent.nisn} />
                            <DRow label="No Pendaftaran" val={meta.no_pendaftaran} />
                            <DRow label="NIK" val={meta.nik} />
                            <DRow label="No KK" val={meta.no_kk} />
                            <DRow label="No Registrasi Akta Lahir" val={meta.no_registrasi_akta_lahir} />
                            <DRow label="Kewarganegaraan" val={meta.kewarganegaraan || 'WNI'} />
                            <DRow label="Email" val={meta.email} />
                            <DRow label="Anak Ke-" val={meta.anak_ke} />
                            <DRow label="Jumlah Saudara" val={meta.jumlah_saudara} />
                            <DRow label="Jumlah Saudara Tiri" val={meta.jumlah_saudara_tiri} />
                            <DRow label="Berat Badan" val={meta.berat_badan ? `${meta.berat_badan} kg` : null} />
                            <DRow label="Tinggi Badan" val={meta.tinggi_badan ? `${meta.tinggi_badan} cm` : null} />
                            <DRow label="Riwayat Penyakit" val={meta.riwayat_penyakit} />
                            <hr className="border-slate-100 my-2" />
                            <DRow label="Alamat Lengkap" val={selectedStudent.alamat || meta.alamat_siswa} />
                            <DRow label="RT/RW" val={meta.rt && meta.rw ? `${meta.rt} / ${meta.rw}` : null} />
                            <DRow label="Dusun/Jalan" val={meta.dusun} />
                            <DRow label="Kelurahan" val={meta.kelurahan} />
                            <DRow label="Kecamatan" val={meta.kecamatan} />
                            <DRow label="Kota/Kabupaten" val={meta.kota_kabupaten} />
                            <DRow label="Provinsi" val={meta.provinsi} />
                            <DRow label="Kode Pos" val={meta.kode_pos} />
                            <DRow label="Jenis Tempat Tinggal" val={meta.jenis_tempat_tinggal} />
                            <DRow label="Jarak ke Sekolah" val={meta.jarak_tempuh_ke_sekolah ? `${meta.jarak_tempuh_ke_sekolah} km` : null} />
                            <DRow label="Moda Transportasi" val={meta.moda_transportasi} />
                            <hr className="border-slate-100 my-2" />
                            <DRow label="Hobi" val={meta.hobi} />
                            <DRow label="Cita-cita" val={meta.cita_cita} />
                          </div>
                        )
                        if (activeDetailTab === 'orangTua') return (
                          <div className="space-y-2">
                            <p className="font-bold text-emerald-800 border-b border-emerald-100 pb-1.5 mb-2">Data Ayah Kandung</p>
                            <DRow label="NIK Ayah" val={meta.nik_ayah} />
                            <DRow label="Nama Ayah" val={meta.nama_ayah} />
                            <DRow label="Tempat, Tgl Lahir Ayah" val={meta.tempat_lahir_ayah && meta.tgl_lahir_ayah ? `${meta.tempat_lahir_ayah}, ${meta.tgl_lahir_ayah}` : (meta.tempat_lahir_ayah || meta.tgl_lahir_ayah)} />
                            <DRow label="Telfon / HP Ayah" val={meta.telfon_ayah || meta.hp_ayah} />
                            <DRow label="No WA Ayah" val={meta.nomor_wa_ayah} />
                            <DRow label="Pendidikan Terakhir Ayah" val={meta.pendidikan_terakhir_ayah} />
                            <DRow label="Pekerjaan Ayah" val={meta.pekerjaan_ayah} />
                            <DRow label="Instansi / Jabatan Ayah" val={meta.instansi_pekerjaan_ayah && meta.jabatan_pekerjaan_ayah ? `${meta.instansi_pekerjaan_ayah} — ${meta.jabatan_pekerjaan_ayah}` : (meta.instansi_pekerjaan_ayah || meta.jabatan_pekerjaan_ayah)} />
                            <DRow label="Penghasilan Ayah" val={meta.penghasilan_ayah ? `Rp ${Number(meta.penghasilan_ayah).toLocaleString('id-ID')}` : null} />
                            <DRow label="Alamat Rumah Ayah" val={meta.alamat_ayah} />
                            <hr className="border-slate-100 my-2" />
                            <p className="font-bold text-blue-800 border-b border-blue-100 pb-1.5 mb-2">Data Ibu Kandung</p>
                            <DRow label="NIK Ibu" val={meta.nik_ibu} />
                            <DRow label="Nama Ibu" val={meta.nama_ibu} />
                            <DRow label="Tempat, Tgl Lahir Ibu" val={meta.tempat_lahir_ibu && meta.tgl_lahir_ibu ? `${meta.tempat_lahir_ibu}, ${meta.tgl_lahir_ibu}` : (meta.tempat_lahir_ibu || meta.tgl_lahir_ibu)} />
                            <DRow label="Telfon / HP Ibu" val={meta.telfon_ibu || meta.hp_ibu} />
                            <DRow label="No WA Ibu" val={meta.nomor_wa_ibu} />
                            <DRow label="Pendidikan Terakhir Ibu" val={meta.pendidikan_terakhir_ibu} />
                            <DRow label="Pekerjaan Ibu" val={meta.pekerjaan_ibu} />
                            <DRow label="Instansi / Jabatan Ibu" val={meta.instansi_pekerjaan_ibu && meta.jabatan_pekerjaan_ibu ? `${meta.instansi_pekerjaan_ibu} — ${meta.jabatan_pekerjaan_ibu}` : (meta.instansi_pekerjaan_ibu || meta.jabatan_pekerjaan_ibu)} />
                            <DRow label="Penghasilan Ibu" val={meta.penghasilan_ibu ? `Rp ${Number(meta.penghasilan_ibu).toLocaleString('id-ID')}` : null} />
                            <DRow label="Alamat Rumah Ibu" val={meta.alamat_ibu} />
                            {(meta.nama_wali || meta.hp_wali) && (<>
                              <hr className="border-slate-100 my-2" />
                              <p className="font-bold text-slate-700 border-b border-slate-100 pb-1.5 mb-2">Data Wali</p>
                              <DRow label="NIK Wali" val={meta.nik_wali} />
                              <DRow label="Nama Wali" val={meta.nama_wali} />
                              <DRow label="HP / WA Wali" val={meta.hp_wali || meta.nomor_wa_wali} />
                              <DRow label="Pekerjaan Wali" val={meta.pekerjaan_wali} />
                              <DRow label="Alamat Wali" val={meta.alamat_wali} />
                            </>)}
                          </div>
                        )
                        if (activeDetailTab === 'akademik') return (
                          <div className="space-y-2">
                            <DRow label="Unit Pendidikan" val={selectedStudent.unit} />
                            <DRow label="Kelas" val={selectedStudent.kelas} />
                            <DRow label="Tahun Ajaran Masuk" val={meta.tahun_ajaran_masuk} />
                            <DRow label="Tahun Ajaran Berjalan" val={meta.tahun_ajaran_berjalan} />
                            <DRow label="Status Siswa" val={selectedStudent.status} />
                            <DRow label="NIS Pembayaran" val={meta.nis_pembayaran} />
                            <DRow label="Wali Kelas" val={meta.wali_kelas} />
                            <DRow label="NIY Wali Kelas" val={meta.niy_wali_kelas} />
                            <DRow label="Status Orang Tua" val={meta.status_orang_tua} />
                            <DRow label="NIY Ortu (Jika Pegawai)" val={meta.niy_ortu_jika_pegawai} />
                            <hr className="border-slate-100 my-2" />
                            <DRow label="Sekolah Asal" val={meta.sekolah_asal} />
                            <DRow label="Status Sekolah Asal" val={meta.status_sekolah_asal} />
                            <DRow label="Nominal SPP" val={meta.nominal_spp ? `Rp ${Number(meta.nominal_spp).toLocaleString('id-ID')}` : null} />
                            <DRow label="Penerima KPS/PKH" val={meta.penerima_kps_pkh} />
                            <DRow label="Punya KIP" val={meta.apakah_punya_kip} />
                            <DRow label="Layak Menerima PIP" val={meta.apakah_layak_menerima_pip} />
                            <DRow label="Alasan Menolak PIP" val={meta.alasan_menolak_pip} />
                          </div>
                        )
                        if (activeDetailTab === 'riwayat') return (
                          <div className="space-y-2">
                            <DRow label="Tanggal Masuk" val={meta.tanggal_masuk} />
                            <DRow label="No Induk Sebelumnya" val={meta.no_induk_sebelumnya} />
                            <DRow label="Beasiswa" val={meta.beasiswa} />
                            <DRow label="Catatan" val={meta.catatan} />
                            <p className="text-slate-400 mt-2">Riwayat keaktifan & kehadiran tercatat di sistem absensi.</p>
                          </div>
                        )
                        if (activeDetailTab === 'dokumen') return (
                          <div className="space-y-2">
                            <DRow label="Foto Siswa (URL)" val={meta.foto_url} />
                            <DRow label="No Registrasi Akta Lahir" val={meta.no_registrasi_akta_lahir} />
                            <DRow label="No Kartu Keluarga" val={meta.no_kk} />
                            <p className="text-slate-400 mt-2">Status dokumen fisik dikelola secara manual oleh admin TU.</p>
                          </div>
                        )
                        return null
                      })()}
                    </div>
                  </div>

                  {/* Quick Actions Card — sesuai gambar */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">AKSI CEPAT</h4>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleOpenEdit(selectedStudent)}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition">
                        <FaEdit /> Edit Data
                      </button>
                      <button onClick={() => { setStudentToPrint(selectedStudent); setShowCetakModal(true) }}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition">
                        <FaPrint /> Cetak Kartu Siswa
                      </button>
                      <button onClick={() => handleDelete(selectedStudent)}
                        className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition">
                        <FaTrash /> Hapus Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3">
              <button type="button" onClick={() => setShowDetailModal(false)}
                className="rounded-xl border border-slate-300 bg-white px-6 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP UP MODAL 2: TAMBAH / EDIT SISWA FORM */}
      <StudentFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        initialData={isEdit ? selectedStudent : null}
        onSubmit={handleFormSubmitCallback}
        classes={rawClasses}
      />

      {/* POP UP MODAL 3: CETAK KARTU SISWA */}
      {showCetakModal && (
        <CetakKartuSiswaModal student={studentToPrint} onClose={() => setShowCetakModal(false)} />
      )}

      {/* POP UP MODAL 4: DASHBOARD IMPORT DATA SISWA */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <FaFileImport className="text-base" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Dashboard Import Data Siswa</h2>
                  <p className="text-xs text-slate-500">Unggah file Excel atau CSV untuk mengimpor banyak siswa secara massal</p>
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

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Step 1: Download Template */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FaFileExcel className="text-2xl text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Unduh Format Template Import</h4>
                    <p className="text-[11px] text-slate-500">Gunakan format file ini agar kolom data sesuai dengan sistem ERP.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplateSiswa}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-white px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition shadow-xs whitespace-nowrap"
                >
                  <FaDownload className="text-emerald-600" /> Unduh Template
                </button>
              </div>

              {/* Step 2: Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Unggah File (Excel / CSV)</label>
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:bg-slate-50 cursor-pointer transition">
                  <FaUpload className="text-3xl text-emerald-700 mb-2" />
                  <span className="text-xs font-bold text-slate-800">
                    {importFile ? importFile.name : 'Klik untuk memilih file Excel atau CSV'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {importFile ? `${(importFile.size / 1024).toFixed(1)} KB` : 'Format disukai: .csv, .xlsx, .xls (Maks. 5MB)'}
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
              {importPreviewData.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">Preview Data yang Siap Diimpor ({importPreviewData.length} baris)</h4>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Format Sesuai
                    </span>
                  </div>
                   <div className="overflow-x-auto rounded-xl border border-slate-200">
                     <table className="w-full text-left text-xs text-slate-600">
                       <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                         <tr>
                           <th className="py-2 px-3">NIS</th>
                           <th className="py-2 px-3">NISN</th>
                           <th className="py-2 px-3">Nama Siswa</th>
                           <th className="py-2 px-3">JK</th>
                           <th className="py-2 px-3">Unit Pendidikan</th>
                           <th className="py-2 px-3">Kelas</th>
                           <th className="py-2 px-3">Nama Ayah</th>
                           <th className="py-2 px-3">HP Ayah</th>
                           <th className="py-2 px-3">Status</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {importPreviewData.map((row, idx) => (
                           <tr key={idx} className="hover:bg-slate-50">
                             <td className="py-2 px-3 font-medium">{row.nis}</td>
                             <td className="py-2 px-3">{row.nisn}</td>
                             <td className="py-2 px-3 font-bold text-slate-800">{row.nama}</td>
                             <td className="py-2 px-3">{row.gender}</td>
                             <td className="py-2 px-3">{row.unit}</td>
                             <td className="py-2 px-3 font-semibold">{row.kelas}</td>
                             <td className="py-2 px-3">{row.namaAyah}</td>
                             <td className="py-2 px-3">{row.hpAyah}</td>
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
    </MasterDataPage>
  )
}
