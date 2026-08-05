import React, { useState, useEffect } from 'react'
import { BookOpen, Award, CheckCircle2, UserX, Plus, FileText, Eye, Layers } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardFilter from '../components/dashboard/DashboardFilter'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import ChartCard from '../components/dashboard/ChartCard'
import DataTableCard from '../components/dashboard/DataTableCard'
import QuickActionCard from '../components/dashboard/QuickActionCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'
import DetailModal from '../components/dashboard/DetailModal'

import { managementDashboardService } from '../services/managementDashboardService'

const COLORS = ['#0E5C44', '#EF4444']

export default function GuruTahfizhDashboardPage() {
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
      console.error('Failed to load Guru Tahfizh dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Guru Tahfizh.')
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
      label: 'Input Setoran',
      icon: Plus,
      onClick: () => window.location.href = '/dashboard/tahfizh',
      permissions: ['tahfizh.input_setoran_harian']
    },
    {
      label: 'Monitoring Target',
      icon: BookOpen,
      onClick: () => window.location.href = '/dashboard/tahfizh',
      permissions: ['tahfizh.monitoring_target']
    },
    {
      label: 'Rekap Harian',
      icon: FileText,
      onClick: () => window.location.href = '/dashboard/tahfizh',
      permissions: ['tahfizh.rekap_harian']
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title="Dashboard Guru Tahfizh / Musyrif"
        subtitle="Monitor setoran hafalan Al-Qur'an, murajaah harian, dan capaian target santri/siswa binaan"
        roleName="Guru Tahfizh"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      {/* Primary KPI Grid */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Siswa Binaan"
          value={formatNumber(kpis.total_siswa_binaan?.total)}
          icon={BookOpen}
          onClick={() => setActiveModal('total_siswa_binaan')}
        />
        <KpiCard
          title="Setoran Hari Ini"
          value={formatNumber(kpis.setoran_hari_ini?.total)}
          icon={CheckCircle2}
        />
        <KpiCard
          title="Siswa Sudah Setor"
          value={formatNumber(kpis.siswa_sudah_setor?.total)}
          icon={Award}
        />
        <KpiCard
          title="Siswa Belum Setor"
          value={formatNumber(kpis.siswa_belum_setor?.total)}
          icon={UserX}
        />
      </KpiCardGrid>

      {/* Secondary KPI Grid */}
      <KpiCardGrid cols={2}>
        <KpiCard
          title="Total Baris Setoran Hafalan"
          value={formatNumber(kpis.total_setoran_baris?.total)}
          icon={Layers}
          subtitle="Agregat baris hafalan tersimpan"
        />
        <KpiCard
          title="Total Murajaah (Lembar)"
          value={formatNumber(kpis.total_murajaah_lembar?.total)}
          icon={BookOpen}
          subtitle="Agregat lembar murajaah tersimpan"
        />
      </KpiCardGrid>

      <QuickActionCard title="Aksi Cepat Guru Tahfizh" actions={quickActions} />

      {/* Chart & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Status Setoran Hari Ini"
          subtitle="Perbandingan siswa sudah vs belum setor"
          empty={!charts.setoran_summary || charts.setoran_summary.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.setoran_summary || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="status"
                >
                  {(charts.setoran_summary || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="lg:col-span-2">
          <DataTableCard
            title="Riwayat Setoran Terbaru"
            subtitle="Catatan hafalan dan murajaah siswa binaan"
            headers={['Siswa', 'Surah & Ayat', 'Baris', 'Murajaah', 'Tanggal']}
            rows={(tables.recent_logs || []).map((log, idx) => [
              <span key="student" className="font-semibold text-slate-900 dark:text-white">{log.student?.full_name || 'Siswa'}</span>,
              `${log.hafalan_surah_name || 'Surah'} (${log.hafalan_ayah_start || 1}-${log.hafalan_ayah_end || 1})`,
              log.hafalan_baris || log.line_count || 0,
              log.murajaah_text || `${log.murajaah_lembar || 0} Lembar`,
              log.record_date || log.date || (log.created_at ? new Date(log.created_at).toLocaleDateString('id-ID') : '-')
            ])}
            emptyMessage="Belum ada catatan setoran terbaru."
          />
        </div>
      </div>

      <DetailModal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={`Detail Tahfizh (${activeModal})`}
        subtitle="Data detail hafalan dan target santri binaan"
      >
        <div className="p-4 text-center text-sm text-slate-500">
          Data detail <span className="font-bold text-slate-800 dark:text-slate-200">{activeModal}</span> siap ditampilkan.
        </div>
      </DetailModal>
    </div>
  )
}
