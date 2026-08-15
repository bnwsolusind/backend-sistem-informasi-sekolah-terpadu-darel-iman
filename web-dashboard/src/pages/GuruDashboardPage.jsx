import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Users,
  BookOpen,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  FilePlus,
  BookMarked,
  Award,
  Eye,
  CalendarDays,
  RefreshCw,
} from 'lucide-react'

import {
  AppPageHeader,
  AppBreadcrumb,
  AppFilterBar,
  KpiCard,
  AppDataTable,
  AppBadge,
  AppButton,
  SectionHeader,
  DetailPanel,
  PageContainer,
} from '../components/app'

import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'
import KpiQuickViewModal from '../components/KpiQuickViewModal'
import ModalErrorBoundary from '../components/common/ModalErrorBoundary'

import api from '../services/api'

export default function GuruDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [selectedScheduleDetail, setSelectedScheduleDetail] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/teacher/dashboard')
      if (res.data && res.data.data) {
        setData(res.data.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Teacher dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Guru.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading && !data) return <SkeletonDashboard />
  if (error && !data) return <ErrorState message={error} onRetry={fetchDashboard} />

  const teacher = data?.teacher || {}
  const academicContext = data?.academic_context || {}
  const kpis = data?.kpi || {}
  const schedulesToday = data?.schedules_today || []
  const announcements = data?.announcements || []
  const teacherAttendanceLogs = data?.teacher_attendance_logs || []

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  const scheduleColumns = [
    {
      key: 'time',
      label: 'Waktu Pertemuan',
      render: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-white text-xs">
          {row.time_start || row.jam_mulai || '-'} - {row.time_end || row.jam_selesai || '-'}
        </span>
      ),
    },
    {
      key: 'subject',
      label: 'Mata Pelajaran',
      render: (row) => (
        <div className="min-w-0">
          <p className="font-extrabold text-[#0E5C44] dark:text-[#3FBF75] text-xs truncate">
            {row.subject?.nama_mapel || row.subject?.name || 'Mata Pelajaran'}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Ruang: {row.room || row.ruangan || 'Utama'}</p>
        </div>
      ),
    },
    {
      key: 'kelas',
      label: 'Kelas / Rombel',
      render: (row) => <AppBadge variant="info">{row.kelas?.nama_kelas || row.kelas?.kode_kelas || 'Kelas'}</AppBadge>,
    },
    {
      key: 'actions',
      label: 'Detail',
      render: (row) => (
        <AppButton variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedScheduleDetail(row)}>
          Detail
        </AppButton>
      ),
    },
  ]

  const attendanceLogColumns = [
    {
      key: 'date',
      label: 'Tanggal',
      render: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{row.attendance_date || row.date || (row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-')}</span>,
    },
    {
      key: 'check_in',
      label: 'Waktu Masuk',
      render: (row) => <span className="font-bold text-slate-900 dark:text-white text-xs">{row.check_in_time || row.jam_masuk || (row.created_at ? new Date(row.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-')}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <AppBadge variant="success" dot>{row.status || 'Hadir'}</AppBadge>,
    },
  ]

  const announcementColumns = [
    {
      key: 'judul',
      label: 'Judul Pengumuman',
      render: (row) => <span className="font-extrabold text-slate-900 dark:text-white text-xs">{row.judul_pengumuman || row.judul}</span>,
    },
    {
      key: 'created_at',
      label: 'Tanggal',
      render: (row) => <span className="text-xs text-slate-500 font-medium">{row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-'}</span>,
    },
  ]

  return (
    <PageContainer maxW="7xl">
      <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <AppBreadcrumb items={[{ label: 'Portal Guru Mata Pelajaran' }]} />

      {/* Header */}
      <AppPageHeader
        variant="brand"
        title={`Assalamu'alaikum, ${teacher.name || 'Guru'}`}
        eyebrow="Teaching Workspace & Learning Portal"
        description={`Portal Guru Mata Pelajaran — NIP/NIY: ${teacher.nip_niy || '-'} | ${teacher.education_unit || 'Unit Education'}.`}
        welcomeName={teacher.name || 'Guru'}
        chips={[
          teacher.education_unit ? `Unit: ${teacher.education_unit}` : 'Unit Sekolah',
          academicContext.academic_year ? `TA ${academicContext.academic_year}` : 'TBA 2026/2027',
          academicContext.semester ? `Semester ${academicContext.semester}` : 'Semester Ganjil',
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <AppButton variant="accent" size="sm" icon={CheckCircle2} onClick={() => navigate('/portal-guru/presensi-pembelajaran')}>
              Input Presensi
            </AppButton>
            <AppButton variant="outline" size="sm" icon={RefreshCw} onClick={fetchDashboard} className="border-white/30 text-white hover:bg-white/10">
              Segarkan Data
            </AppButton>
          </div>
        }
      />

      {/* Filter Bar */}
      <AppFilterBar label="Filter Jadwal & Pembelajaran" onReset={fetchDashboard} />

      {/* Primary KPI Grid */}
      <section className="space-y-3">
        <SectionHeader title="Ringkasan Aktivitas Mengajar" subtitle="Jadwal harian, total siswa, rombel, dan tugas pending" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Jadwal Hari Ini"
            value={formatNumber(kpis.schedules_today_count)}
            icon={Calendar}
            colorScheme="emerald"
            badge="Jadwal"
            badgeVariant="success"
            onClick={() => setActiveModal('schedules_today')}
          />
          <KpiCard
            title="Total Siswa Diajar"
            value={formatNumber(kpis.total_students)}
            icon={Users}
            colorScheme="blue"
            badge="Siswa"
            badgeVariant="info"
            onClick={() => setActiveModal('total_students')}
          />
          <KpiCard
            title="Total Rombel / Kelas"
            value={formatNumber(kpis.total_classes)}
            icon={BookOpen}
            colorScheme="violet"
            badge="Rombel"
            badgeVariant="purple"
            onClick={() => setActiveModal('total_classes')}
          />
          <KpiCard
            title="Tugas Belum Dinilai"
            value={formatNumber(kpis.pending_grading_count)}
            icon={FileCheck}
            colorScheme="amber"
            badge="Perlu Penilaian"
            badgeVariant="warning"
            onClick={() => setActiveModal('pending_grading')}
          />
        </div>
      </section>

      {/* Quick Action Navigation */}
      <section className="rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1B2433]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Aksi Cepat Guru</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pintas manajemen presensi, materi, tugas, dan nilai siswa</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AppButton variant="secondary" size="sm" icon={CheckCircle2} onClick={() => navigate('/portal-guru/presensi-pembelajaran')}>
              Input Presensi
            </AppButton>
            <AppButton variant="secondary" size="sm" icon={FilePlus} onClick={() => navigate('/portal-guru/materi')}>
              Tambah Materi
            </AppButton>
            <AppButton variant="secondary" size="sm" icon={BookMarked} onClick={() => navigate('/portal-guru/penugasan')}>
              Buat Tugas
            </AppButton>
            <AppButton variant="secondary" size="sm" icon={FileCheck} onClick={() => navigate('/portal-guru/pengumpulan-tugas')}>
              Nilai Tugas
            </AppButton>
            <AppButton variant="primary" size="sm" icon={CalendarDays} onClick={() => navigate('/portal-guru/jadwal')}>
              Lihat Jadwal
            </AppButton>
          </div>
        </div>
      </section>

      {/* Teaching Schedule Table & Attendance Log */}
      <section className="space-y-3">
        <SectionHeader title="Jadwal Mengajar Hari Ini & Presensi Pengajar" subtitle="Daftar kelas diampu hari ini dan log presensi guru" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <AppDataTable
              title="Jadwal Mengajar Hari Ini"
              description={academicContext.date || 'Jadwal Aktif Hari Ini'}
              data={schedulesToday}
              columns={scheduleColumns}
              keyField="id"
              searchPlaceholder="Cari jadwal..."
            />
          </div>

          <div className="lg:col-span-4">
            <AppDataTable
              title="Log Absensi Guru (View Only)"
              description="Riwayat presensi harian pengajar"
              data={teacherAttendanceLogs}
              columns={attendanceLogColumns}
              keyField="attendance_date"
              showToolbar={false}
              showPagination={false}
            />
          </div>
        </div>
      </section>

      {/* Announcements Table */}
      <section className="space-y-3">
        <AppDataTable
          title="Pengumuman Sekolah Terbaru"
          description="Informasi resmi dari unit sekolah"
          data={announcements}
          columns={announcementColumns}
          keyField="judul"
          showToolbar={false}
          showPagination={false}
        />
      </section>

      {/* Schedule Detail Panel */}
      {selectedScheduleDetail && (
        <DetailPanel
          isOpen={Boolean(selectedScheduleDetail)}
          onClose={() => setSelectedScheduleDetail(null)}
          title="Detail Jadwal Mengajar"
          subtitle={`${selectedScheduleDetail.subject?.nama_mapel || 'Mapel'} - ${selectedScheduleDetail.kelas?.nama_kelas || 'Kelas'}`}
          fields={[
            { label: 'Mata Pelajaran', value: selectedScheduleDetail.subject?.nama_mapel || selectedScheduleDetail.subject?.name },
            { label: 'Kelas & Rombel', value: selectedScheduleDetail.kelas?.nama_kelas || 'Kelas' },
            { label: 'Waktu Pertemuan', value: `${selectedScheduleDetail.time_start || selectedScheduleDetail.jam_mulai || '-'} - ${selectedScheduleDetail.time_end || selectedScheduleDetail.jam_selesai || '-'}` },
            { label: 'Ruangan', value: selectedScheduleDetail.room || selectedScheduleDetail.ruangan || 'Ruangan Utama' },
          ]}
          actions={
            <AppButton
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => {
                setSelectedScheduleDetail(null)
                navigate(`/portal-guru/presensi-pembelajaran?schedule_id=${selectedScheduleDetail.id}`)
              }}
            >
              Input Presensi Pembelajaran
            </AppButton>
          }
        />
      )}

      {/* KPI Detail Modal */}
      <ModalErrorBoundary onClose={() => setActiveModal(null)}>
        <KpiQuickViewModal
          type={activeModal}
          isOpen={Boolean(activeModal)}
          onClose={() => setActiveModal(null)}
        />
      </ModalErrorBoundary>
    </div>
    </PageContainer>
  )
}
