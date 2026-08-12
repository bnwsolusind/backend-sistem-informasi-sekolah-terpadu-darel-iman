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
  Plus
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardFilter from '../components/dashboard/DashboardFilter'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import ChartCard from '../components/dashboard/ChartCard'
import DataTableCard from '../components/dashboard/DataTableCard'
import QuickActionCard from '../components/dashboard/QuickActionCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'
import KpiQuickViewModal from '../components/KpiQuickViewModal'
import ModalErrorBoundary from '../components/common/ModalErrorBoundary'

import { kepalaSekolahDashboardService } from '../services/kepalaSekolahDashboardService'

export default function KepalaSekolahDashboardPage() {
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

  if (loading) return <SkeletonDashboard />
  if (error) return <ErrorState message={error} onRetry={fetchDashboard} />

  const kpis = data?.kpis || {}
  const context = data?.context || {}
  const charts = data?.charts || {}
  const tables = data?.tables || {}

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  const quickActions = [
    {
      label: 'Monitoring Divisi',
      icon: FileText,
       onClick: () => navigate('/dashboard/pemantauan'),
      permissions: ['dashboard.pemantauan.lihat']
    },
    {
      label: 'Rekap Kehadiran',
      icon: CheckCircle2,
       onClick: () => navigate('/absensi/rekap-kehadiran'),
      permissions: ['kehadiran.siswa.monitoring']
    },
    {
      label: 'Monitoring Tahfizh',
      icon: BookOpen,
       onClick: () => navigate('/dashboard/tahfizh'),
      permissions: ['tahfizh.monitoring_target']
    },
    {
      label: 'Verifikasi Prestasi',
      icon: Award,
       onClick: () => navigate('/dashboard/pemantauan'),
      permissions: ['kesiswaan.rekap_prestasi']
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title="Dashboard Kepala Sekolah"
        subtitle={`Monitoring operasional dan akademik ${context.unit?.nama || 'Unit Education'}`}
        roleName="Kepala Sekolah"
        unitName={context.unit?.nama}
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      {/* Main KPIs */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Total Siswa Aktif"
          value={formatNumber(kpis.total_siswa?.total)}
          icon={Users}
          onClick={() => setActiveModal('total_siswa')}
        />
        <KpiCard
          title="Total Guru"
          value={formatNumber(kpis.total_guru?.total)}
          icon={GraduationCap}
          onClick={() => setActiveModal('total_guru')}
        />
        <KpiCard
          title="Total Pegawai"
          value={formatNumber(kpis.total_pegawai?.total)}
          icon={UserCheck}
          onClick={() => setActiveModal('total_pegawai')}
        />
        <KpiCard
          title="Total Rombel / Kelas"
          value={formatNumber(kpis.total_rombel?.total || kpis.total_kelas?.total)}
          icon={Layers}
          onClick={() => setActiveModal('total_kelas')}
        />
      </KpiCardGrid>

      {/* Daily Attendance KPIs */}
      <KpiCardGrid cols={5}>
        <KpiCard
          title="Hadir Hari Ini"
          value={formatNumber(kpis.siswa_hadir_hari_ini?.total)}
          icon={CheckCircle2}
        />
        <KpiCard
          title="Terlambat"
          value={formatNumber(kpis.siswa_terlambat?.total)}
          icon={Clock}
        />
        <KpiCard
          title="Izin"
          value={formatNumber(kpis.siswa_izin?.total)}
          icon={FileText}
        />
        <KpiCard
          title="Sakit"
          value={formatNumber(kpis.siswa_sakit?.total)}
          icon={AlertCircle}
        />
        <KpiCard
          title="Setoran Tahfizh"
          value={formatNumber(kpis.setoran_tahfizh_hari_ini?.total)}
          icon={BookOpen}
        />
      </KpiCardGrid>

      <QuickActionCard title="Aksi Cepat Kepala Sekolah" actions={quickActions} />

      {/* Attendance Chart */}
      <ChartCard
        title="Tren Kehadiran Siswa 7 Hari Terakhir"
        subtitle="Visualisasi tingkat kehadiran harian"
        empty={!charts.attendance_trend || charts.attendance_trend.length === 0}
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.attendance_trend || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="hadir" stroke="#0E5C44" strokeWidth={2} name="Hadir" />
              <Line type="monotone" dataKey="terlambat" stroke="#F59E0B" strokeWidth={2} name="Terlambat" />
              <Line type="monotone" dataKey="alpha" stroke="#EF4444" strokeWidth={2} name="Alpha" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Announcements Table */}
      <DataTableCard
        title="Pengumuman Sekolah Terbaru"
        subtitle="Informasi penting untuk civitas akademika"
        headers={['Judul Pengumuman', 'Target', 'Tanggal']}
        rows={(tables.announcements || []).map((ann, idx) => [
          <span key="title" className="font-semibold text-slate-900 dark:text-white">{ann.judul}</span>,
          ann.target || 'Semua Unit',
          ann.created_at ? new Date(ann.created_at).toLocaleDateString('id-ID') : '-'
        ])}
        emptyMessage="Belum ada pengumuman terbaru."
      />

      <ModalErrorBoundary onClose={() => setActiveModal(null)}>
        <KpiQuickViewModal
          type={activeModal}
          isOpen={Boolean(activeModal)}
          onClose={() => setActiveModal(null)}
        />
      </ModalErrorBoundary>
    </div>
  )
}
