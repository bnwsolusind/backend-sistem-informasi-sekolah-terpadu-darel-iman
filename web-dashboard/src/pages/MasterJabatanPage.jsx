import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import {
  Briefcase as FaBriefcase,
  Plus as FaPlus,
  Search as FaSearch,
  FileSpreadsheet as FaFileExcel,
  Upload as FaFileImport,
  RefreshCcw as FaRedo,
  CircleCheck as FaCheckCircle,
  Network as FaSitemap,
  LockOpen as FaLockOpen,
  ChevronLeft as FaChevronLeft,
  ChevronRight as FaChevronRight,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react'
import { jabatanService } from '../services/jabatanService'
import JabatanTable from '../components/jabatan/JabatanTable'
import JabatanFormModal from '../components/jabatan/JabatanFormModal'
import JabatanDetailModal from '../components/jabatan/JabatanDetailModal'
import JabatanImportModal from '../components/jabatan/JabatanImportModal'
import {
  MasterActionButton,
  MasterDataPage,
  MasterPageHeader,
  MasterStatCard,
  MasterStatsGrid,
} from '../components/master-data'

export default function MasterJabatanPage() {
  const queryClient = useQueryClient()

  // Filter & Pagination States
  const [search, setSearch] = useState('')
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('')
  const [selectedSatuanKerjaFilter, setSelectedSatuanKerjaFilter] = useState('')
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')
  const [denganSampahFilter, setDenganSampahFilter] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedJabatanForEdit, setSelectedJabatanForEdit] = useState(null)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedJabatanForDetail, setSelectedJabatanForDetail] = useState(null)

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false)

  // Query Options Dropdown
  const { data: options = {} } = useQuery({
    queryKey: ['jabatan-options'],
    queryFn: () => jabatanService.getOptions(),
  })

  // Query Daftar Jabatan
  const {
    data: jabatanData = {},
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'jabatan-list',
      page,
      perPage,
      search,
      selectedUnitFilter,
      selectedSatuanKerjaFilter,
      selectedLevelFilter,
      selectedStatusFilter,
      denganSampahFilter,
    ],
    queryFn: () =>
      jabatanService.getDaftar({
        page,
        per_page: perPage,
        search,
        unit_sekolah_id: selectedUnitFilter,
        satuan_kerja: selectedSatuanKerjaFilter,
        level_jabatan: selectedLevelFilter,
        status: selectedStatusFilter,
        dengan_sampah: denganSampahFilter,
        order_by: 'urutan',
        order_dir: 'asc',
      }),
  })

  const daftarJabatan = jabatanData?.data || []
  const meta = jabatanData?.meta || {}
  const statistik = jabatanData?.statistik || {}

  // Mutations
  const simpanMutation = useMutation({
    mutationFn: (payload) => jabatanService.tambah(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['jabatan-list'])
      queryClient.invalidateQueries(['jabatan-options'])
      setIsFormModalOpen(false)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: res?.message || 'Data jabatan baru berhasil ditambahkan.',
        timer: 2000,
        showConfirmButton: false,
      })
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Gagal menyimpan data jabatan.'
      Swal.fire('Error', msg, 'error')
    },
  })

  const ubahMutation = useMutation({
    mutationFn: ({ id, payload }) => jabatanService.ubah({ id, payload }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['jabatan-list'])
      queryClient.invalidateQueries(['jabatan-options'])
      setIsFormModalOpen(false)
      setSelectedJabatanForEdit(null)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: res?.message || 'Perubahan data jabatan berhasil disimpan.',
        timer: 2000,
        showConfirmButton: false,
      })
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Gagal memperbarui data jabatan.'
      Swal.fire('Error', msg, 'error')
    },
  })

  const hapusMutation = useMutation({
    mutationFn: (id) => jabatanService.hapus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['jabatan-list'])
      Swal.fire('Terhapus!', res?.message || 'Data jabatan berhasil dihapus.', 'success')
    },
    onError: (err) => {
      Swal.fire('Gagal!', err.response?.data?.message || 'Terjadi kesalahan saat menghapus.', 'error')
    },
  })

  const pulihkanMutation = useMutation({
    mutationFn: (id) => jabatanService.pulihkan(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['jabatan-list'])
      Swal.fire('Dipulihkan!', res?.message || 'Data jabatan berhasil dipulihkan.', 'success')
    },
    onError: (err) => {
      Swal.fire('Gagal!', err.response?.data?.message || 'Terjadi kesalahan saat memulihkan.', 'error')
    },
  })

  const importMutation = useMutation({
    mutationFn: (rows) => jabatanService.prosesImport(rows),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['jabatan-list'])
      queryClient.invalidateQueries(['jabatan-options'])
      setIsImportModalOpen(false)
      Swal.fire({
        icon: 'success',
        title: 'Impor Selesai',
        text: res?.message || `Berhasil diimpor.`,
      })
    },
    onError: (err) => {
      Swal.fire('Gagal Impor!', err.response?.data?.message || 'Format data impor bermasalah.', 'error')
    },
  })

  // Handlers
  const handleOpenCreate = () => {
    setSelectedJabatanForEdit(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setSelectedJabatanForEdit(item)
    setIsFormModalOpen(true)
  }

  const handleOpenDetail = (item) => {
    setSelectedJabatanForDetail(item)
    setIsDetailModalOpen(true)
  }

  const handleDelete = (item) => {
    Swal.fire({
      title: 'Hapus Data Jabatan?',
      html: `Apakah Anda yakin ingin menghapus jabatan <strong>${item.nama_jabatan || item.name}</strong> (${item.kode_jabatan || item.code})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus (Soft Delete)',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        hapusMutation.mutate(item.id)
      }
    })
  }

  const handleRestore = (item) => {
    Swal.fire({
      title: 'Pulihkan Data Jabatan?',
      html: `Apakah Anda yakin ingin memulihkan jabatan <strong>${item.nama_jabatan || item.name}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Pulihkan',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        pulihkanMutation.mutate(item.id)
      }
    })
  }

  const handleFormSubmit = (data) => {
    if (selectedJabatanForEdit) {
      ubahMutation.mutate({ id: selectedJabatanForEdit.id, payload: data })
    } else {
      simpanMutation.mutate(data)
    }
  }

  // Export Excel CSV
  const handleExportExcel = async () => {
    try {
      const dataEkspor = await jabatanService.ekspor({
        search,
        unit_sekolah_id: selectedUnitFilter,
        satuan_kerja: selectedSatuanKerjaFilter,
        level_jabatan: selectedLevelFilter,
        status: selectedStatusFilter,
      })

      if (!dataEkspor || dataEkspor.length === 0) {
        Swal.fire('Info', 'Tidak ada data untuk diekspor.', 'info')
        return
      }

      const headers = [
        'Kode Jabatan',
        'Nama Jabatan',
        'Satuan Kerja',
        'Level',
        'Level Label',
        'Unit Sekolah',
        'Atasan Langsung',
        'Role Sistem',
        'Urutan',
        'Status',
        'Tampil Struktur',
        'Boleh Login',
        'Jumlah Pegawai',
        'Deskripsi',
      ]

      const csvRows = [
        headers.join(','),
        ...dataEkspor.map((row) =>
          [
            `"${row.kode_jabatan || ''}"`,
            `"${row.nama_jabatan || ''}"`,
            `"${row.satuan_kerja || ''}"`,
            row.level_jabatan || '',
            `"${row.level_label || ''}"`,
            `"${row.unit_sekolah || ''}"`,
            `"${row.atasan_langsung || ''}"`,
            `"${row.role_sistem || ''}"`,
            row.urutan || 0,
            `"${row.status || ''}"`,
            `"${row.tampil_struktur || ''}"`,
            `"${row.boleh_login || ''}"`,
            row.jumlah_pegawai || 0,
            `"${(row.deskripsi || '').replace(/"/g, '""')}"`,
          ].join(',')
        ),
      ]

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Master_Jabatan_Sekolah_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      Swal.fire({
        icon: 'success',
        title: 'Ekspor Berhasil',
        text: 'File CSV Master Jabatan berhasil diunduh.',
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire('Error', 'Gagal mengekspor data: ' + err.message, 'error')
    }
  }

  return (
    <MasterDataPage className="education-unit-page jabatan-master-page">
      <MasterPageHeader
        title="Master Jabatan"
        description="Kelola jabatan, satuan kerja, cakupan akses, struktur organisasi, dan role sistem pegawai."
        tone="brand"
        icon={FaSitemap}
        actions={<MasterActionButton className="education-unit-hero__action !h-11 !rounded-xl !border-white !bg-white !px-5 !text-xs !text-emerald-800 !shadow-none hover:!bg-emerald-50" icon={FaPlus} onClick={handleOpenCreate}>Tambah Jabatan</MasterActionButton>}
      />

      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={FaBriefcase} label="Total Jabatan" value={statistik.total_jabatan ?? 0} description="Terdaftar di sistem" variant="success" delay={40} />
        <MasterStatCard icon={FaCheckCircle} label="Jabatan Aktif" value={statistik.aktif ?? 0} description="Beroperasi saat ini" variant="info" delay={80} />
        <MasterStatCard icon={FaSitemap} label="Bagan Struktur" value={statistik.tampil_struktur ?? 0} description="Tampil di organisasi" variant="warning" delay={120} />
        <MasterStatCard icon={FaLockOpen} label="Akses Login" value={statistik.boleh_login ?? 0} description="Dapat memakai sistem" variant="neutral" delay={160} />
      </MasterStatsGrid>

      <section className="edu-enter rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]" aria-label="Pencarian dan filter jabatan">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Cari nama atau kode jabatan</span>
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Cari nama atau kode jabatan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
            />
          </label>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="import" icon={FaFileImport} onClick={() => setIsImportModalOpen(true)}>Import</MasterActionButton>
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="export" icon={FaFileExcel} onClick={handleExportExcel}>Export CSV</MasterActionButton>
            <MasterActionButton className="!h-11 !rounded-xl !px-3.5" icon={FaPlus} onClick={handleOpenCreate}>Tambah Jabatan</MasterActionButton>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-500 dark:border-slate-700 dark:text-slate-300">
            <SlidersHorizontal className="h-4 w-4 text-emerald-700" aria-hidden="true" /> Filter
          </span>
          <select aria-label="Filter satuan kerja" value={selectedSatuanKerjaFilter} onChange={(e) => { setSelectedSatuanKerjaFilter(e.target.value); setPage(1) }} className="h-11 min-w-45 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
            <option value="">Semua Satuan Kerja</option>
            {(options.satuan_kerja || []).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <select aria-label="Filter level jabatan" value={selectedLevelFilter} onChange={(e) => { setSelectedLevelFilter(e.target.value); setPage(1) }} className="h-11 min-w-40 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
            <option value="">Semua Level (1-14)</option>
            {(options.level_jabatan || []).map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
          </select>
          <select aria-label="Filter unit sekolah" value={selectedUnitFilter} onChange={(e) => { setSelectedUnitFilter(e.target.value); setPage(1) }} className="h-11 min-w-44 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
            <option value="">Semua Unit Sekolah</option>
            {(options.unit_sekolah || []).map((unit) => <option key={unit.id} value={unit.id}>{unit.nama}</option>)}
          </select>
          <select aria-label="Filter status jabatan" value={selectedStatusFilter} onChange={(e) => { setSelectedStatusFilter(e.target.value); setPage(1) }} className="h-11 min-w-36 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
            <option value="">Semua Status</option>
            <option value="Aktif">Status Aktif</option>
            <option value="Nonaktif">Status Nonaktif</option>
          </select>
          <label className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300">
            <input type="checkbox" checked={denganSampahFilter === 'ya'} onChange={(e) => { setDenganSampahFilter(e.target.checked ? 'ya' : ''); setPage(1) }} className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600" />
            Data Terhapus
          </label>
          <button type="button" onClick={() => refetch()} aria-label="Muat ulang data" title="Muat ulang" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-700/20 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-emerald-950/40">
            <FaRedo className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          {(search || selectedUnitFilter || selectedSatuanKerjaFilter || selectedLevelFilter || selectedStatusFilter || denganSampahFilter) && (
            <button type="button" onClick={() => { setSearch(''); setSelectedUnitFilter(''); setSelectedSatuanKerjaFilter(''); setSelectedLevelFilter(''); setSelectedStatusFilter(''); setDenganSampahFilter(''); setPage(1) }} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <FaRedo className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      </section>

      <section className="hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm" aria-hidden="true">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <label htmlFor="cari-jabatan" className="sr-only">Cari jabatan</label>
          <input
            id="cari-jabatan"
            type="text"
            placeholder="Cari nama atau kode jabatan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <div className="hidden items-center justify-end gap-2 lg:col-span-3 lg:flex">
          <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="import" icon={FaFileImport} onClick={() => setIsImportModalOpen(true)}>Import</MasterActionButton>
          <MasterActionButton className="!h-11 !rounded-xl !px-3.5" variant="export" icon={FaFileExcel} onClick={handleExportExcel}>Export CSV</MasterActionButton>
          <MasterActionButton className="!h-11 !rounded-xl !px-3.5" icon={FaPlus} onClick={handleOpenCreate}>Tambah Jabatan</MasterActionButton>
        </div>

	          <select
	            aria-label="Filter satuan kerja"
	            value={selectedSatuanKerjaFilter}
	            onChange={(e) => {
	              setSelectedSatuanKerjaFilter(e.target.value)
	              setPage(1)
	            }}
	            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
	          >
	            <option value="">Semua Satuan Kerja</option>
	            {(options.satuan_kerja || []).map((item) => (
	              <option key={item.value} value={item.value}>{item.label}</option>
	            ))}
	          </select>

	          <select
            aria-label="Filter level jabatan"
            value={selectedLevelFilter}
            onChange={(e) => {
              setSelectedLevelFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="">Semua Level (1-14)</option>
            {(options.level_jabatan || []).map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter unit sekolah"
            value={selectedUnitFilter}
            onChange={(e) => {
              setSelectedUnitFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="">Semua Unit Sekolah</option>
            {(options.unit_sekolah || []).map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.nama}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter status jabatan"
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Status Aktif</option>
            <option value="Nonaktif">Status Nonaktif</option>
          </select>
	        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 md:col-span-2 lg:col-span-5">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={denganSampahFilter === 'ya'}
                onChange={(e) => {
                  setDenganSampahFilter(e.target.checked ? 'ya' : '')
                  setPage(1)
                }}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-600"
              />
              <span>Tampilkan Data Terhapus (Soft Deleted)</span>
            </label>
          </div>

	          {(search || selectedUnitFilter || selectedSatuanKerjaFilter || selectedLevelFilter || selectedStatusFilter || denganSampahFilter) && (
            <button
              onClick={() => {
                setSearch('')
	                setSelectedUnitFilter('')
	                setSelectedSatuanKerjaFilter('')
                setSelectedLevelFilter('')
                setSelectedStatusFilter('')
                setDenganSampahFilter('')
                setPage(1)
              }}
              className="ui-button flex items-center space-x-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            >
              <FaRedo className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <main className="min-w-0 space-y-4">
      {isError ? (
        <section className="rounded-2xl border border-rose-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-800">Data jabatan gagal dimuat.</p>
          <p className="mt-1 text-xs text-slate-500">Periksa koneksi, lalu coba muat ulang.</p>
          <button onClick={() => refetch()} className="ui-button mt-4 rounded-xl bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900">
            Coba Lagi
          </button>
        </section>
      ) : (
        <JabatanTable
          data={daftarJabatan}
          isLoading={isLoading || isFetching}
          onDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      )}

      {/* Pagination Controls */}
      {meta.total > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-xs text-slate-600 shadow-sm sm:flex-row">
          <div>
            Menampilkan <strong>{meta.from || 0}</strong> - <strong>{meta.to || 0}</strong> dari total{' '}
            <strong>{meta.total || 0}</strong> data jabatan
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Tampilkan:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value))
                  setPage(1)
                }}
                aria-label="Jumlah data per halaman"
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="ui-button rounded-lg border border-slate-200 p-2 hover:bg-slate-100 disabled:opacity-40"
                title="Halaman sebelumnya"
                aria-label="Halaman sebelumnya"
              >
                <FaChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1 font-bold">
                {meta.current_page || 1} / {meta.last_page || 1}
              </span>
              <button
                disabled={page >= (meta.last_page || 1)}
                onClick={() => setPage((prev) => prev + 1)}
                className="ui-button rounded-lg border border-slate-200 p-2 hover:bg-slate-100 disabled:opacity-40"
                title="Halaman berikutnya"
                aria-label="Halaman berikutnya"
              >
                <FaChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
        </main>

        <aside className="space-y-4 xl:sticky xl:top-5" aria-label="Ringkasan jabatan">
          <section className="edu-card rounded-[var(--master-card-radius)] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1B2433]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><FaBriefcase className="h-5 w-5" /></span>
              <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Jabatan</h2><p className="text-xs text-slate-500 dark:text-slate-400">Data halaman aktif</p></div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                ['Total Jabatan', statistik.total_jabatan ?? 0, FaBriefcase, 'text-emerald-700 bg-emerald-50'],
                ['Jabatan Aktif', statistik.aktif ?? 0, FaCheckCircle, 'text-emerald-700 bg-emerald-50'],
                ['Bagan Struktur', statistik.tampil_struktur ?? 0, FaSitemap, 'text-blue-700 bg-blue-50'],
                ['Akses Login', statistik.boleh_login ?? 0, FaLockOpen, 'text-violet-700 bg-violet-50'],
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
                ['Tambah Jabatan', FaPlus, handleOpenCreate, 'text-emerald-700 bg-emerald-50'],
                ['Import Data Jabatan', FaFileImport, () => setIsImportModalOpen(true), 'text-blue-700 bg-blue-50'],
                ['Export CSV', FaFileExcel, handleExportExcel, 'text-emerald-700 bg-emerald-50'],
                ['Lihat Statistik', BarChart3, () => setIsStatisticsModalOpen(true), 'text-violet-700 bg-violet-50'],
              ].map(([label, Icon, action, color]) => (
                <button key={label} type="button" onClick={action} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-left text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-700/20 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-emerald-950/40">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span>{label}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {isStatisticsModalOpen && (
        <div className="ui-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="jabatan-statistics-title">
          <section className="ui-modal w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><BarChart3 className="h-5 w-5" /></span>
                <div><h2 id="jabatan-statistics-title" className="text-base font-bold text-slate-900 dark:text-white">Statistik Jabatan</h2><p className="text-xs text-slate-500 dark:text-slate-400">Ringkasan berdasarkan data dan filter aktif.</p></div>
              </div>
              <button type="button" onClick={() => setIsStatisticsModalOpen(false)} aria-label="Tutup statistik" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">×</button>
            </header>
            <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Total Jabatan', statistik.total_jabatan ?? 0, FaBriefcase, 'bg-emerald-50 text-emerald-700'],
                ['Jabatan Aktif', statistik.aktif ?? 0, FaCheckCircle, 'bg-blue-50 text-blue-700'],
                ['Bagan Struktur', statistik.tampil_struktur ?? 0, FaSitemap, 'bg-amber-50 text-amber-700'],
                ['Akses Login', statistik.boleh_login ?? 0, FaLockOpen, 'bg-violet-50 text-violet-700'],
              ].map(([label, value, Icon, color]) => (
                <article key={label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}><Icon className="h-4 w-4" /></span>
                  <strong className="mt-3 block text-xl font-black tabular-nums text-slate-900 dark:text-white">{Number(value).toLocaleString('id-ID')}</strong>
                  <span className="mt-0.5 block text-[11px] font-semibold text-slate-500">{label}</span>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Modals */}
      <JabatanFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedJabatanForEdit(null)
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedJabatanForEdit}
        options={options}
        isSubmitting={simpanMutation.isPending || ubahMutation.isPending}
      />

      <JabatanDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedJabatanForDetail(null)
        }}
        jabatan={selectedJabatanForDetail}
      />

      <JabatanImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(rows) => importMutation.mutate(rows)}
        isSubmitting={importMutation.isPending}
      />
    </MasterDataPage>
  )
}
