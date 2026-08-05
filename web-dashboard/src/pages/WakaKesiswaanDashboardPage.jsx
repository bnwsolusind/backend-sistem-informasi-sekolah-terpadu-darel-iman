import React, { useState, useEffect } from 'react'
import { Users, UserCheck, Clock, UserX, FileText, Award } from 'lucide-react'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardFilter from '../components/dashboard/DashboardFilter'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'

import { managementDashboardService } from '../services/managementDashboardService'

export default function WakaKesiswaanDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await managementDashboardService.getWakaKesiswaan()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Waka Kesiswaan dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Waka Kesiswaan.')
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
        title="Dashboard Waka Kesiswaan"
        subtitle="Pantau kedisiplinan, keterlambatan, prestasi, dan catatan perilaku siswa"
        roleName="Waka Kesiswaan"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      <KpiCardGrid cols={3}>
        <KpiCard
          title="Total Siswa"
          value={formatNumber(kpis.total_siswa?.total)}
          icon={Users}
        />
        <KpiCard
          title="Siswa Aktif"
          value={formatNumber(kpis.siswa_aktif?.total)}
          icon={UserCheck}
        />
        <KpiCard
          title="Prestasi Siswa"
          value={formatNumber(kpis.prestasi_siswa?.total)}
          icon={Award}
        />
      </KpiCardGrid>

      <KpiCardGrid cols={3}>
        <KpiCard
          title="Siswa Terlambat Hari Ini"
          value={formatNumber(kpis.siswa_terlambat?.total)}
          icon={Clock}
        />
        <KpiCard
          title="Tidak Hadir Hari Ini"
          value={formatNumber(kpis.siswa_tidak_hadir?.total)}
          icon={UserX}
        />
        <KpiCard
          title="Catatan Siswa / Perilaku"
          value={formatNumber(kpis.catatan_siswa?.total)}
          icon={FileText}
        />
      </KpiCardGrid>
    </div>
  )
}
