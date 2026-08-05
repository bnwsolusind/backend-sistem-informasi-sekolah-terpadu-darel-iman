import React, { useState, useEffect } from 'react'
import { BookOpen, Calendar, Target, Award, FileSpreadsheet, CheckSquare } from 'lucide-react'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardFilter from '../components/dashboard/DashboardFilter'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'

import { managementDashboardService } from '../services/managementDashboardService'

export default function WakaKurikulumDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await managementDashboardService.getWakaKurikulum()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Waka Kurikulum dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Waka Kurikulum.')
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

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title="Dashboard Waka Kurikulum"
        subtitle="Kelola dan monitor kesiapan kurikulum, jadwal pelajaran, perangkat ajar, dan evaluasi CBT"
        roleName="Waka Kurikulum"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      <KpiCardGrid cols={4}>
        <KpiCard
          title="Mata Pelajaran Aktif"
          value={formatNumber(kpis.total_subjects?.total)}
          icon={BookOpen}
        />
        <KpiCard
          title="Jadwal Pelajaran"
          value={formatNumber(kpis.total_schedules?.total)}
          icon={Calendar}
        />
        <KpiCard
          title="Capaian Pembelajaran (CP)"
          value={formatNumber(kpis.total_cp?.total)}
          icon={Target}
        />
        <KpiCard
          title="Tujuan Pembelajaran (TP)"
          value={formatNumber(kpis.total_tp?.total)}
          icon={Award}
        />
      </KpiCardGrid>

      <KpiCardGrid cols={4}>
        <KpiCard
          title="Modul Ajar"
          value={formatNumber(kpis.total_modul_ajar?.total)}
          icon={FileSpreadsheet}
        />
        <KpiCard
          title="Kisi-kisi Ujian"
          value={formatNumber(kpis.total_kisi_kisi?.total)}
          icon={CheckSquare}
        />
        <KpiCard
          title="Bank Soal"
          value={formatNumber(kpis.total_bank_soal?.total)}
          icon={BookOpen}
        />
        <KpiCard
          title="Ujian CBT"
          value={formatNumber(kpis.total_ujian_cbt?.total)}
          icon={Calendar}
        />
      </KpiCardGrid>
    </div>
  )
}
