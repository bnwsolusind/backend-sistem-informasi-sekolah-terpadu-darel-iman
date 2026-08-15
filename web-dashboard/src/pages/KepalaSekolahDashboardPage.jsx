import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserCheck,
  GraduationCap,
  School,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  BookOpen,
  Award,
  Plus,
  RefreshCw,
  Calendar,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

import {
  AppPageHeader,
  AppBreadcrumb,
  AppFilterBar,
  KpiCard,
  SummaryCard,
  AppDataTable,
  AppBadge,
  AppButton,
  SectionHeader,
  PageContainer,
} from '../components/app'

import ChartCard from '../components/dashboard/ChartCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'
import KpiQuickViewModal from '../components/KpiQuickViewModal'
import ModalErrorBoundary from '../components/common/ModalErrorBoundary'

import { kepalaSekolahDashboardService } from '../services/kepalaSekolahDashboardService'

export default function KepalaSekolahDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeModal, setActiveModal] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await kepalaSekolahDashboardService.getOverview()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Kepala Sekolah dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Kepala Sekolah.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading && !data) return <SkeletonDashboard />
  if (error && !data) return <ErrorState message={error} onRetry={fetchDashboard} />

  const kpis = data?.kpis || {}
  const context = data?.context || {}
  const charts = data?.charts || {}
  const tables = data?.tables || {}

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  const announcementColumns = [
    {
      key: 'judul',
      label: 'Judul Pengumuman',
      render: (row) => <span className="font-extrabold text-slate-900 dark:text-white text-xs">{row.judul}</span>,
    },
    {
      key: 'target',
      label: 'Target Audience',
      render: (row) => <AppBadge variant="info">{row.target || 'Semua Unit'}</AppBadge>,
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
      <AppBreadcrumb items={[{ label: 'Dashboard Kepala Sekolah' }]} />

      {/* Header */}
      <AppPageHeader
        variant="brand"
        title="Dashboard Kepala Sekolah"
        eyebrow={`Unit Monitoring — ${context.unit?.nama || 'Unit Education'}`}
        description={`Monitoring operasional harian, kehadiran civitas akademika, pencapaian tahfizh, serta performa kelas pada ${context.unit?.nama || 'Unit Education'}.`}
        welcomeName="Kepala Sekolah"
        chips={[
          context.unit?.nama ? `Unit: ${context.unit.nama}` : 'Unit Education',
          context.tahun_ajaran ? `TA ${context.tahun_ajaran.nama}` : 'TBA 2026/2027',
          context.semester ? `Semester ${context.semester.nama}` : 'Semester Ganjil',
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <AppButton variant="accent" size="sm" icon={CheckCircle2} onClick={() => navigate('/absensi/rekap-kehadiran')}>
              Rekap Kehadiran
            </AppButton>
            <AppButton variant="outline" size="sm" icon={RefreshCw} onClick={fetchDashboard} className="border-white/30 text-white hover:bg-white/10">
              Segarkan Data
            </AppButton>
          </div>
        }
      />

      {/* Filter Bar */}
      <AppFilterBar label="Filter Operasional Unit" onReset={fetchDashboard} />

      {/* Primary Unit KPIs */}
      <section className="space-y-3">
        <SectionHeader title="Metrik Utama Unit Sekolah" subtitle="Jumlah siswa, guru, pegawai, dan rombel aktif" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Siswa Aktif"
            value={formatNumber(kpis.total_siswa?.total)}
            icon={Users}
            colorScheme="emerald"
            badge="Siswa Unit"
            badgeVariant="success"
            onClick={() => setActiveModal('total_siswa')}
          />
          <KpiCard
            title="Total Guru Pengajar"
            value={formatNumber(kpis.total_guru?.total)}
            icon={GraduationCap}
            colorScheme="blue"
            badge="Guru"
            badgeVariant="info"
            onClick={() => setActiveModal('total_guru')}
          />
          <KpiCard
            title="Total Pegawai & Staf"
            value={formatNumber(kpis.total_pegawai?.total)}
            icon={UserCheck}
            colorScheme="violet"
            badge="Tendik"
            badgeVariant="purple"
            onClick={() => setActiveModal('total_pegawai')}
          />
          <KpiCard
            title="Total Rombel / Kelas"
            value={formatNumber(kpis.total_rombel?.total || kpis.total_kelas?.total)}
            icon={Layers}
            colorScheme="indigo"
            badge="Rombel"
            badgeVariant="success"
            onClick={() => setActiveModal('total_kelas')}
          />
        </div>
      </section>

      {/* Daily Attendance & Tahfizh Metrics */}
      <section className="space-y-3">
        <SectionHeader title="Kondisi Presensi & Setoran Tahfizh Hari Ini" subtitle="Monitoring kehadiran harian dan setoran hafalan Al-Qur'an" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <SummaryCard
            title="Hadir Hari Ini"
            value={formatNumber(kpis.siswa_hadir_hari_ini?.total)}
            icon={CheckCircle2}
            colorScheme="emerald"
          />
          <SummaryCard
            title="Terlambat"
            value={formatNumber(kpis.siswa_terlambat?.total)}
            icon={Clock}
            colorScheme="amber"
          />
          <SummaryCard
            title="Izin"
            value={formatNumber(kpis.siswa_izin?.total)}
            icon={FileText}
            colorScheme="blue"
          />
          <SummaryCard
            title="Sakit"
            value={formatNumber(kpis.siswa_sakit?.total)}
            icon={AlertCircle}
            colorScheme="rose"
          />
          <SummaryCard
            title="Setoran Tahfizh"
            value={formatNumber(kpis.setoran_tahfizh_hari_ini?.total)}
            description="Setoran hafalan hari ini"
            icon={BookOpen}
            colorScheme="indigo"
          />
        </div>
      </section>

      {/* Quick Action Navigation */}
      <section className="rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1B2433]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Akses Cepat Kepala Sekolah</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Navigasi langsung ke pemantauan presensi, tahfizh, dan kesiswaan</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AppButton variant="secondary" size="sm" icon={FileText} onClick={() => navigate('/dashboard/monitoring-divisi')}>
              Monitoring Divisi
            </AppButton>
            <AppButton variant="secondary" size="sm" icon={CheckCircle2} onClick={() => navigate('/absensi/rekap-kehadiran')}>
              Rekap Kehadiran
            </AppButton>
            <AppButton variant="secondary" size="sm" icon={BookOpen} onClick={() => navigate('/dashboard/tahfizh')}>
              Monitoring Tahfizh
            </AppButton>
            <AppButton variant="primary" size="sm" icon={Award} onClick={() => navigate('/dashboard/pemantauan')}>
              Verifikasi Prestasi
            </AppButton>
          </div>
        </div>
      </section>

      {/* Attendance Chart & Announcements */}
      <section className="space-y-3">
        <SectionHeader title="Tren Kehadiran & Pengumuman Sekolah" subtitle="Grafik pergerakan presensi 7 hari terakhir dan edaran pengumuman" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <ChartCard
            title="Tren Kehadiran Siswa 7 Hari Terakhir"
            subtitle="Visualisasi tingkat kehadiran harian di unit"
            className="lg:col-span-7"
            empty={!charts.attendance_trend || charts.attendance_trend.length === 0}
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.attendance_trend || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="hadir" stroke="#0E5C44" strokeWidth={2.5} name="Hadir" />
                  <Line type="monotone" dataKey="terlambat" stroke="#F59E0B" strokeWidth={2} name="Terlambat" />
                  <Line type="monotone" dataKey="alpha" stroke="#EF4444" strokeWidth={2} name="Alpha" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="lg:col-span-5">
            <AppDataTable
              title="Pengumuman Sekolah Terbaru"
              description="Informasi resmi untuk unit sekolah"
              data={tables.announcements || []}
              columns={announcementColumns}
              keyField="judul"
              showToolbar={false}
              showPagination={false}
            />
          </div>
        </div>
      </section>

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
