import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import {
  Briefcase as FaBriefcase,
  Plus as FaPlus,
  FileSpreadsheet as FaFileExcel,
  Upload as FaFileImport,
  CircleCheck as FaCheckCircle,
  Network as FaSitemap,
  LockOpen as FaLockOpen,
} from 'lucide-react'
import { jabatanService } from '../services/jabatanService'
import JabatanTable from '../components/jabatan/JabatanTable'
import JabatanFormModal from '../components/jabatan/JabatanFormModal'
import JabatanDetailModal from '../components/jabatan/JabatanDetailModal'
import JabatanImportModal from '../components/jabatan/JabatanImportModal'
import {
  MasterActionButton,
  MasterDataSection,
  MasterDataPage,
  MasterFilterSelect,
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
  const statsValue = (value) => (isError ? '—' : value)

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

  const handleResetFilters = () => {
    setSearch('')
    setSelectedUnitFilter('')
    setSelectedSatuanKerjaFilter('')
    setSelectedLevelFilter('')
    setSelectedStatusFilter('')
    setDenganSampahFilter('')
    setPage(1)
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
    <MasterDataPage className="education-unit-page jabatan-master-page" hideBreadcrumb>
      <MasterPageHeader
        title="Master Jabatan"
        description="Kelola jabatan, satuan kerja, cakupan akses, struktur organisasi, dan role sistem pegawai."
        icon={FaSitemap}
        actions={
          <>
            <MasterActionButton variant="import" icon={FaFileImport} onClick={() => setIsImportModalOpen(true)}>
              Import Data
            </MasterActionButton>
            <MasterActionButton variant="export" icon={FaFileExcel} onClick={handleExportExcel}>
              Export CSV
            </MasterActionButton>
            <MasterActionButton icon={FaPlus} onClick={handleOpenCreate}>
              Tambah Jabatan
            </MasterActionButton>
          </>
        }
      />

      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={FaBriefcase} label="Total Jabatan" value={statsValue(statistik.total_jabatan ?? 0)} description="Terdaftar di sistem" variant="success" delay={40} loading={isLoading} />
        <MasterStatCard icon={FaCheckCircle} label="Jabatan Aktif" value={statsValue(statistik.aktif ?? 0)} description="Beroperasi saat ini" variant="info" delay={80} loading={isLoading} />
        <MasterStatCard icon={FaSitemap} label="Bagan Struktur" value={statsValue(statistik.tampil_struktur ?? 0)} description="Tampil di organisasi" variant="warning" delay={120} loading={isLoading} />
        <MasterStatCard icon={FaLockOpen} label="Akses Login" value={statsValue(statistik.boleh_login ?? 0)} description="Dapat memakai sistem" variant="neutral" delay={160} loading={isLoading} />
      </MasterStatsGrid>

      <MasterDataSection
        title="Data Jabatan"
        description="Daftar jabatan sesuai pencarian, cakupan unit, dan filter yang dipilih."
        countLabel={`${Number(meta.total ?? daftarJabatan.length).toLocaleString('id-ID')} jabatan`}
        search={{
          value: search,
          onChange: (event) => {
            setSearch(event.target.value)
            setPage(1)
          },
          placeholder: 'Cari nama atau kode jabatan...',
          'aria-label': 'Cari jabatan',
        }}
        filters={
          <>
            <MasterFilterSelect
              aria-label="Filter satuan kerja"
              value={selectedSatuanKerjaFilter}
              onChange={(event) => {
                setSelectedSatuanKerjaFilter(event.target.value)
                setPage(1)
              }}
            >
              <option value="">Semua Satuan Kerja</option>
              {(options.satuan_kerja || []).map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </MasterFilterSelect>
            <MasterFilterSelect
              aria-label="Filter level jabatan"
              value={selectedLevelFilter}
              onChange={(event) => {
                setSelectedLevelFilter(event.target.value)
                setPage(1)
              }}
            >
              <option value="">Semua Level</option>
              {(options.level_jabatan || []).map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </MasterFilterSelect>
            <MasterFilterSelect
              aria-label="Filter unit sekolah"
              value={selectedUnitFilter}
              onChange={(event) => {
                setSelectedUnitFilter(event.target.value)
                setPage(1)
              }}
            >
              <option value="">Semua Unit Sekolah</option>
              {(options.unit_sekolah || []).map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.nama}</option>
              ))}
            </MasterFilterSelect>
            <MasterFilterSelect
              aria-label="Filter status jabatan"
              value={selectedStatusFilter}
              onChange={(event) => {
                setSelectedStatusFilter(event.target.value)
                setPage(1)
              }}
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </MasterFilterSelect>
            <MasterFilterSelect
              aria-label="Filter data terhapus"
              value={denganSampahFilter}
              onChange={(event) => {
                setDenganSampahFilter(event.target.value)
                setPage(1)
              }}
            >
              <option value="">Data Aktif</option>
              <option value="ya">Termasuk Terhapus</option>
            </MasterFilterSelect>
            <MasterFilterSelect
              aria-label="Jumlah data per halaman"
              value={perPage}
              onChange={(event) => {
                setPerPage(Number(event.target.value))
                setPage(1)
              }}
            >
              <option value={10}>10 per halaman</option>
              <option value={15}>15 per halaman</option>
              <option value={25}>25 per halaman</option>
              <option value={50}>50 per halaman</option>
            </MasterFilterSelect>
          </>
        }
        onReset={handleResetFilters}
        resetDisabled={
          !search &&
          !selectedUnitFilter &&
          !selectedSatuanKerjaFilter &&
          !selectedLevelFilter &&
          !selectedStatusFilter &&
          !denganSampahFilter
        }
        isLoading={isLoading || isFetching}
        isError={isError}
        errorTitle="Data jabatan gagal dimuat"
        onRetry={refetch}
        isEmpty={!isLoading && !isFetching && !isError && daftarJabatan.length === 0}
        emptyTitle="Jabatan tidak ditemukan"
        emptyDescription="Coba sesuaikan kata kunci pencarian atau filter yang diterapkan."
        pagination={{
          meta: {
            total: meta.total ?? daftarJabatan.length,
            from: meta.from ?? (daftarJabatan.length ? (page - 1) * perPage + 1 : 0),
            to: meta.to ?? ((page - 1) * perPage + daftarJabatan.length),
            last_page: meta.last_page ?? 1,
            current_page: meta.current_page ?? page,
            per_page: meta.per_page ?? perPage,
          },
          page,
          onPageChange: setPage,
        }}
      >
        <JabatanTable
          data={daftarJabatan}
          onDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      </MasterDataSection>

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
