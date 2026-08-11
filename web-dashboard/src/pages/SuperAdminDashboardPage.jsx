import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Users,
  UserCheck,
  GraduationCap,
  HeartHandshake,
  School,
  Layers,
  ShieldCheck,
  UserX,
  Plus,
  Activity,
  UserPlus,
  Key,
  FileText
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
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

import { superAdminDashboardService } from '../services/superAdminDashboardService'

export default function SuperAdminDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeModal, setActiveModal] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await superAdminDashboardService.getOverview()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load super admin dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Super Admin.')
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
  const unitSummaries = data?.unit_summaries || []
  const recentLogins = data?.recent_logins || []
  const recentActivities = data?.recent_activities || []

  const quickActions = [
    {
      label: 'Tambah Unit',
      icon: Plus,
      onClick: () => navigate('/dashboard/master/unit-pendidikan'),
      permissions: ['foundation.unit.view']
    },
    {
      label: 'Tambah Pegawai',
      icon: UserPlus,
      onClick: () => navigate('/dashboard/employees'),
      permissions: ['foundation.employee.view']
    },
    {
      label: 'Tambah Siswa',
      icon: Users,
      onClick: () => navigate('/dashboard/students'),
      permissions: ['kesiswaan.data_lengkap_siswa']
    },
    {
      label: 'Kelola Role',
      icon: Key,
      onClick: () => navigate('/dashboard/hak-akses'),
      permissions: ['sistem.hak_akses']
    },
    {
      label: 'Audit Log',
      icon: FileText,
      onClick: () => navigate('/dashboard/notifications'),
      permissions: ['sistem.pengaturan']
    }
  ]

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <DashboardHeader
        title="Dashboard Utama Super Admin"
        subtitle="Pantau dan kelola seluruh unit pendidikan, data master, serta performa sistem terpadu."
        roleName="Super Admin"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      {/* Filter */}
      <DashboardFilter onReset={fetchDashboard} />

      {/* Primary KPI Grid (System & Enterprise Metrics) */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Total Unit Pendidikan"
          value={formatNumber(kpis.total_units?.total)}
          icon={Building2}
          onClick={() => setActiveModal('total_units')}
        />
        <KpiCard
          title="Unit Aktif"
          value={formatNumber(kpis.active_units?.total)}
          icon={School}
          onClick={() => setActiveModal('active_units')}
        />
        <KpiCard
          title="Total Pegawai"
          value={formatNumber(kpis.total_employees?.total)}
          icon={UserCheck}
          onClick={() => setActiveModal('total_employees')}
        />
        <KpiCard
          title="Total Guru"
          value={formatNumber(kpis.total_teachers?.total)}
          icon={GraduationCap}
          onClick={() => setActiveModal('total_teachers')}
        />
      </KpiCardGrid>

      {/* Secondary KPI Grid (Academic & User Metrics) */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Total Siswa"
          value={formatNumber(kpis.total_students?.total)}
          icon={Users}
          onClick={() => setActiveModal('total_students')}
        />
        <KpiCard
          title="Total Orang Tua"
          value={formatNumber(kpis.total_parents?.total)}
          icon={HeartHandshake}
          onClick={() => setActiveModal('total_parents')}
        />
        <KpiCard
          title="Total Rombel / Kelas"
          value={formatNumber(kpis.total_rombel?.total || kpis.total_classes?.total)}
          icon={Layers}
          onClick={() => setActiveModal('total_rombel')}
        />
        <KpiCard
          title="Total Alumni"
          value={formatNumber(kpis.total_alumni?.total)}
          icon={GraduationCap}
          onClick={() => setActiveModal('total_alumni')}
        />
      </KpiCardGrid>

      {/* System Security & User Health KPIs */}
      <KpiCardGrid cols={3}>
        <KpiCard
          title="Pengguna Sistem Aktif"
          value={formatNumber(kpis.active_users?.total)}
          icon={ShieldCheck}
          onClick={() => setActiveModal('active_users')}
        />
        <KpiCard
          title="Role Terdaftar"
          value={formatNumber(kpis.active_roles?.total)}
          icon={Key}
          onClick={() => setActiveModal('active_roles')}
        />
        <KpiCard
          title="User Tanpa Role"
          value={formatNumber(kpis.users_without_role?.total)}
          icon={UserX}
          onClick={() => setActiveModal('users_without_role')}
        />
      </KpiCardGrid>

      {/* Quick Actions */}
      <QuickActionCard title="Aksi Cepat Super Admin" actions={quickActions} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Distribusi Siswa per Unit Pendidikan"
          subtitle="Jumlah siswa aktif yang terdaftar di masing-masing unit"
          empty={!charts.student_distribution || charts.student_distribution.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.student_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="total" fill="#0E5C44" radius={[6, 6, 0, 0]} name="Siswa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Distribusi Guru & Pegawai per Unit"
          subtitle="Perbandingan jumlah guru dan tenaga kependidikan"
          empty={!charts.staff_distribution || charts.staff_distribution.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.staff_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="guru" fill="#1E8E5A" radius={[6, 6, 0, 0]} name="Guru" />
                <Bar dataKey="pegawai" fill="#3FBF75" radius={[6, 6, 0, 0]} name="Pegawai" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTableCard
            title="Ringkasan Unit Pendidikan"
            subtitle="Daftar unit beserta statistik utama"
            headers={['No', 'Nama Unit', 'Kode', 'Siswa', 'Guru', 'Pegawai', 'Status']}
            rows={unitSummaries.map((u, idx) => [
              idx + 1,
              <span key="name" className="font-semibold text-slate-900 dark:text-white">{u.name}</span>,
              u.code,
              formatNumber(u.siswa_count),
              formatNumber(u.guru_count),
              formatNumber(u.pegawai_count),
              <span key="status" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {u.status}
              </span>
            ])}
            emptyMessage="Belum ada unit pendidikan terdaftar."
          />
        </div>

        <div className="space-y-6">
          <DataTableCard
            title="User Login Terbaru"
            subtitle="Sesi masuk pengguna terbaru"
            headers={['Nama / Email', 'Waktu']}
            rows={recentLogins.map((item, idx) => [
              <div key="user">
                <div className="font-semibold text-slate-900 dark:text-white text-xs">{item.name}</div>
                <div className="text-[11px] text-slate-400">{item.email}</div>
              </div>,
              <span key="time" className="text-xs text-slate-500">{item.created_at || 'Baru saja'}</span>
            ])}
            emptyMessage="Belum ada catatan sesi login terbaru."
          />
        </div>
      </div>

      {/* KPI Detail Modal (Real PostgreSQL Data) */}
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
