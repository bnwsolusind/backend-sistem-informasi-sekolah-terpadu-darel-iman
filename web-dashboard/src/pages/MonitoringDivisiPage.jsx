import React, { useState } from 'react'
import {
  Layers,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  FileSpreadsheet,
  TrendingUp,
  Award,
  Building2,
  Trash2,
} from 'lucide-react'
import { Download1, Upload1 } from '@tailgrids/icons'
import Swal from 'sweetalert2'

import PageContainer from '../components/app/PageContainer'
import AppBreadcrumb from '../components/app/AppBreadcrumb'
import AppPageHeader from '../components/app/AppPageHeader'
import AppDataTable from '../components/app/AppDataTable'
import ActionDropdown from '../components/app/ActionDropdown'
import AppBadge from '../components/app/AppBadge'
import { MasterStatCard, MasterStatsGrid } from '../components/master-data'

import { useDaftarPemantauanDivisi, useAksiPemantauanDivisi } from '../hooks/useDashboardPemantauan'
import PemantauanDivisiFormModal from '../components/pemantauan/PemantauanDivisiFormModal'

import { AlertDialog } from '@/components/tailgrids/core/alert-dialog'
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/tailgrids/core/dialog'
import { Button } from '@/components/tailgrids/core/button'

const STATUS_MAP = {
  proses: { label: 'Dalam Proses', variant: 'sky', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  tercapai: { label: 'Tercapai', variant: 'emerald', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  terlambat: { label: 'Terlambat', variant: 'amber', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  belum_tercapai: { label: 'Belum Tercapai', variant: 'rose', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

export default function MonitoringDivisiPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState('')
  const [filterDivisi, setFilterDivisi] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  // React Query Hooks
  const { data, isLoading, isError, refetch } = useDaftarPemantauanDivisi({
    page,
    per_page: perPage,
    search: search || undefined,
  })

  const { tambah, ubah, hapus } = useAksiPemantauanDivisi()

  const items = data?.data || []
  const pagination = {
    currentPage: data?.current_page || page,
    totalPages: data?.last_page || 1,
    totalRecords: data?.total || items.length,
    from: data?.from || 1,
    to: data?.to || items.length,
  }

  // Filter client side additional if needed
  const filteredItems = items.filter((item) => {
    if (filterDivisi && item.nama_divisi !== filterDivisi) return false
    if (filterStatus && item.status_pemantauan !== filterStatus) return false
    return true
  })

  // KPI Statistics Calculation
  const totalCount = pagination.totalRecords
  const tercapaiCount = items.filter((i) => i.status_pemantauan === 'tercapai').length
  const prosesCount = items.filter((i) => i.status_pemantauan === 'proses').length
  const perluPerhatianCount = items.filter((i) => ['terlambat', 'belum_tercapai'].includes(i.status_pemantauan)).length
  const avgCapaian = items.length > 0
    ? Math.round(items.reduce((acc, curr) => acc + (Number(curr.persentase_capaian) || 0), 0) / items.length)
    : 0

  // Modal Action Handlers
  const handleOpenCreate = () => {
    setSelectedRecord(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (record) => {
    setSelectedRecord(record)
    setIsFormOpen(true)
  }

  const handleOpenDelete = (id) => {
    setDeleteTargetId(id)
    setIsDeleteOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    if (selectedRecord?.id) {
      await ubah.mutateAsync(
        { id: selectedRecord.id, payload: formData },
        {
          onSuccess: () => {
            setIsFormOpen(false)
            refetch()
          },
        }
      )
    } else {
      await tambah.mutateAsync(formData, {
        onSuccess: () => {
          setIsFormOpen(false)
          refetch()
        },
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return
    await hapus.mutateAsync(deleteTargetId, {
      onSuccess: () => {
        setIsDeleteOpen(false)
        setDeleteTargetId(null)
        refetch()
      },
    })
  }

  // AppDataTable Columns Definition
  const columns = [
    {
      key: 'nama_divisi',
      label: 'NAMA DIVISI',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-xs">{row.nama_divisi || '-'}</span>
            <p className="text-[10px] text-slate-400">Unit Operasional</p>
          </div>
        </div>
      ),
    },
    {
      key: 'aspek_pemantauan',
      label: 'ASPEK PEMANTAUAN',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{row.aspek_pemantauan || '-'}</p>
          {row.catatan && (
            <p className="text-[11px] text-slate-400 line-clamp-1 italic max-w-xs">{row.catatan}</p>
          )}
        </div>
      ),
    },
    {
      key: 'persentase_capaian',
      label: 'CAPAIAN (%)',
      render: (row) => {
        const val = Number(row.persentase_capaian) || 0
        const barColor = val >= 80 ? 'bg-emerald-500' : val >= 50 ? 'bg-amber-500' : 'bg-rose-500'
        return (
          <div className="w-36 space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>{val}%</span>
              <span className="text-[10px] text-slate-400">{val >= 100 ? 'Selesai' : 'Target'}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${Math.min(val, 100)}%` }} />
            </div>
          </div>
        )
      },
    },
    {
      key: 'status_pemantauan',
      label: 'STATUS',
      render: (row) => {
        const conf = STATUS_MAP[row.status_pemantauan] || { label: row.status_pemantauan || 'proses', color: 'bg-slate-100 text-slate-600' }
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${conf.color}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {conf.label}
          </span>
        )
      },
    },
    {
      key: 'tanggal_pemantauan',
      label: 'TANGGAL',
      render: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {row.tanggal_pemantauan
            ? new Date(row.tanggal_pemantauan).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '-'}
        </span>
      ),
    },
    {
      key: 'aksi',
      label: 'AKSI',
      headerProps: { className: 'text-right' },
      cellProps: { className: 'text-right' },
      render: (row) => (
        <ActionDropdown
          onEdit={() => handleOpenEdit(row)}
          onDelete={() => handleOpenDelete(row.id)}
        />
      ),
    },
  ]

  return (
    <PageContainer maxW="7xl">
      <div className="space-y-6 pb-12">
        {/* Breadcrumb Navigation */}
        <AppBreadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Monitoring Divisi' }]} />

        {/* Page Header */}
        <AppPageHeader
          variant="brand"
          title="Monitoring & Evaluasi Divisi"
          eyebrow="Division Oversight & Performance Management"
          description="Pencatatan, pengawasan indikator kinerja, dan evaluasi berkala capaian program divisi pendidikan serta unit operasional sekolah."
          welcomeName="Pimpinan / Pengawas"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-all hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" />
                Tambah Pemantauan Divisi
              </button>
            </div>
          }
        />

        {/* KPI Stats Grid */}
        <MasterStatsGrid cols={4}>
          <MasterStatCard
            title="Total Pemantauan"
            value={totalCount}
            subtitle="Catatan supervisi aktif"
            icon={Layers}
            variant="emerald"
          />
          <MasterStatCard
            title="Capaian Rata-Rata"
            value={`${avgCapaian}%`}
            subtitle="Persentase ketercapaian"
            icon={TrendingUp}
            variant="blue"
          />
          <MasterStatCard
            title="Target Tercapai"
            value={tercapaiCount}
            subtitle="Indikator sesuai target"
            icon={CheckCircle2}
            variant="green"
          />
          <MasterStatCard
            title="Perlu Perhatian"
            value={perluPerhatianCount}
            subtitle="Terlambat / belum tercapai"
            icon={AlertTriangle}
            variant="rose"
          />
        </MasterStatsGrid>

        {/* Filter Bar & Secondary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#1B2433]">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Filter Divisi */}
            <select
              value={filterDivisi}
              onChange={(e) => setFilterDivisi(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">Semua Divisi</option>
              <option value="Divisi Pendidikan">Divisi Pendidikan</option>
              <option value="Divisi Kurikulum">Divisi Kurikulum</option>
              <option value="Divisi Kesiswaan">Divisi Kesiswaan</option>
              <option value="Divisi Tahfizh">Divisi Tahfizh</option>
              <option value="Divisi Bahasa">Divisi Bahasa</option>
              <option value="Tata Usaha">Tata Usaha</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">Semua Status</option>
              <option value="proses">Dalam Proses</option>
              <option value="tercapai">Tercapai</option>
              <option value="terlambat">Terlambat</option>
              <option value="belum_tercapai">Belum Tercapai</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Segarkan
            </button>
          </div>
        </div>

        {/* AppDataTable complying with TailGrids Gold Standard Benchmark */}
        <AppDataTable
          title="Daftar Pemantauan Divisi"
          subtitle="Tabel hasil supervisi dan evaluasi indikator kerja antar divisi"
          columns={columns}
          data={filteredItems}
          loading={isLoading}
          searchQuery={search}
          onSearchChange={setSearch}
          pagination={pagination}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
          actionButtons={[
            {
              key: 'add',
              label: 'Tambah Pemantauan',
              icon: Plus,
              onClick: handleOpenCreate,
              color: 'emerald',
            },
          ]}
        />

        {/* Form Modal Add / Edit */}
        <PemantauanDivisiFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedRecord}
          isSubmitting={tambah.isPending || ubah.isPending}
        />

        {/* TailGrids Delete Confirmation Alert Dialog */}
        <AlertDialog isOpen={isDeleteOpen} onOpenChange={(open) => !open && setIsDeleteOpen(false)}>
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/40">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle>Hapus Data Pemantauan Divisi?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Catatan hasil supervisi divisi ini akan terhapus dari sistem.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              pending={hapus.isPending}
            >
              Hapus Data
            </Button>
          </DialogFooter>
        </AlertDialog>
      </div>
    </PageContainer>
  )
}
