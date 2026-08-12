import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Database,
  Users,
  Settings,
  ShieldCheck,
  Building2,
  BookOpen,
  CheckCircle2,
  Activity,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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

import { managementDashboardService } from '../services/managementDashboardService'

export default function OperatorDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeModal, setActiveModal] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await managementDashboardService.getOperator()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Operator dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Operator.')
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
      label: 'Kelola Master Data',
      icon: Database,
      onClick: () => navigate('/dashboard/students'),
      permissions: ['sistem.master_data'],
    },
    {
      label: 'Pengaturan Sistem',
      icon: Settings,
      onClick: () => navigate('/dashboard/pengaturan'),
      permissions: ['sistem.pengaturan'],
    },
    {
      label: 'Hak Akses & Role',
      icon: ShieldCheck,
      onClick: () => navigate('/dashboard/hak-akses'),
      permissions: ['sistem.hak_akses'],
    },
    {
      label: 'Audit Notifikasi',
      icon: Activity,
      onClick: () => navigate('/dashboard/notifications'),
      permissions: ['sistem.master_data'],
    },
  ]

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title="Dashboard Operator Sistem"
        subtitle="Manajemen data terpadu, pemeliharaan master data, dan monitoring kesehatan sistem"
        roleName="Operator Sekolah"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      {/* KPI Cards Grid */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Total Pengguna Terdaftar"
           value={formatNumber(kpis.total_users?.total)}
          icon={Users}
          onClick={() => setActiveModal('total_users')}
        />
        <KpiCard
          title="Data Siswa Aktif"
           value={formatNumber(kpis.total_students?.total)}
          icon={BookOpen}
          onClick={() => setActiveModal('total_students')}
        />
        <KpiCard
          title="Data Pegawai & Guru"
           value={formatNumber(kpis.total_employees?.total)}
          icon={Building2}
          onClick={() => setActiveModal('total_employees')}
        />
        <KpiCard
           title="Kelas Aktif"
           value={formatNumber(kpis.active_classes?.total)}
           icon={CheckCircle2}
           subtitle="Dalam scope unit operator"
        />
      </KpiCardGrid>

      <QuickActionCard title="Aksi Cepat Operator" actions={quickActions} />

      {/* Data Distribution & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Volume Master Data Terdaftar"
          subtitle="Rincian entitas terkelola dalam database"
          empty={!charts.data_density || charts.data_density.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.data_density || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="total" fill="#0E5C44" radius={[6, 6, 0, 0]} name="Jumlah Record" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="lg:col-span-2">
          <DataTableCard
            title="Log Aktivitas & Audit Operator"
            subtitle="Riwayat pengubahan master data dan sistem"
            headers={['Aktivitas', 'Modul', 'Waktu', 'Pengguna']}
             rows={(tables.recent_activities || []).map((act) => [
              <span key="action" className="font-semibold text-slate-900 dark:text-white">
                {act.action}
              </span>,
              act.module,
              act.timestamp,
              act.user,
            ])}
            emptyMessage="Belum ada aktivitas terbaru."
          />
        </div>
      </div>

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
