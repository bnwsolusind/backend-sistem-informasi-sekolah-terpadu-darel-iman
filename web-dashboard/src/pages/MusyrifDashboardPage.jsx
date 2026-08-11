import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Users,
  CalendarCheck,
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

export default function MusyrifDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeModal, setActiveModal] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await managementDashboardService.getGuruTahfizh()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Musyrif dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Musyrif.')
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
      label: 'Presensi Ibadah Santri',
      icon: CalendarCheck,
      onClick: () => (window.location.href = '/dashboard/absensi-ibadah'),
      permissions: ['worship_attendance.view'],
    },
    {
      label: 'Mutabaah Harian Santri',
      icon: Activity,
      onClick: () => (window.location.href = '/dashboard/mutabaah'),
      permissions: ['mutabaah.view'],
    },
    {
      label: 'Setoran Tahfizh Asrama',
      icon: BookOpen,
       onClick: () => (window.location.href = '/portal-guru/workspace?tab=tahfizh'),
      permissions: ['tahfizh.monitoring_target'],
    },
  ]

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title="Dashboard Musyrif / Pembimbing Asrama"
        subtitle="Monitoring ibadah, kedisiplinan asrama, mutaba'ah harian, dan hafalan santri binaan"
        roleName="Musyrif Asrama"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      {/* Primary KPI Grid */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Santri Binaan Asrama"
          value={formatNumber(kpis.santri_binaan?.total ?? kpis.total_siswa_binaan?.total ?? 0)}
          icon={Users}
          onClick={() => setActiveModal('santri_binaan')}
        />
        <KpiCard
          title="Presensi Sholat Berjamaah"
          value={formatNumber(kpis.ibadah_lengkap?.total ?? 0)}
          icon={CalendarCheck}
        />
        <KpiCard
          title="Setoran Hafalan Hari Ini"
          value={formatNumber(kpis.setoran_tahfizh?.total ?? kpis.setoran_hari_ini?.total ?? 0)}
          icon={BookOpen}
        />
        <KpiCard
          title="Mutaba'ah Terisi"
          value={formatNumber(kpis.mutabaah_terisi?.total ?? 0)}
          icon={CheckCircle2}
        />
      </KpiCardGrid>

      <QuickActionCard title="Aksi Cepat Musyrif Asrama" actions={quickActions} />

      {/* Chart & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Kedisiplinan Sholat Berjamaah"
          subtitle="Tingkat kehadiran sholat 5 waktu di Masjid/Musholla"
          empty={!charts.worship_trend || charts.worship_trend.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.worship_trend || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="shubuh" fill="#0E5C44" name="Shubuh" radius={[4, 4, 0, 0]} />
                <Bar dataKey="isya" fill="#3FBF75" name="Isya" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="lg:col-span-2">
          <DataTableCard
            title="Daftar Santri Binaan & Aktivitas Harian"
            subtitle="Ringkasan ibadah dan hafalan santri di kamar/kamar asrama"
            headers={['Nama Santri', 'Kamar', 'Kedisiplinan Sholat', 'Capaian Hafalan', 'Status']}
             rows={(tables.santri_logs || []).map((log) => [
              <span key="name" className="font-semibold text-slate-900 dark:text-white">
                {log.name}
              </span>,
              log.room,
              log.worship,
              log.tahfizh,
              <span
                key="st"
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  log.status === 'Baik' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                }`}
              >
                {log.status}
              </span>,
            ])}
            emptyMessage="Belum ada santri binaan."
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
