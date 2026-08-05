import React, { useState, useEffect } from 'react'
import { Users, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardFilter from '../components/dashboard/DashboardFilter'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'

import { managementDashboardService } from '../services/managementDashboardService'

export default function TataUsahaDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await managementDashboardService.getTataUsaha()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Tata Usaha dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Tata Usaha.')
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
        title="Dashboard Tata Usaha (TU)"
        subtitle="Kelola administrasi data kesiswaan, kepegawaian, dan kelengkapan dokumen sekolah"
        roleName="Tata Usaha"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      <KpiCardGrid cols={3}>
        <KpiCard
          title="Total Siswa Aktif"
          value={formatNumber(kpis.total_siswa?.total)}
          icon={Users}
        />
        <KpiCard
          title="Total Pegawai & Guru"
          value={formatNumber(kpis.total_pegawai?.total)}
          icon={UserCheck}
        />
        <KpiCard
          title="Absensi Terverifikasi Hari Ini"
          value={formatNumber(kpis.absensi_hari_ini?.total)}
          icon={CheckCircle2}
        />
      </KpiCardGrid>

      <KpiCardGrid cols={2}>
        <KpiCard
          title="Data Siswa Belum Lengkap"
          value={formatNumber(kpis.siswa_incomplete?.total)}
          icon={AlertTriangle}
          subtitle="Siswa dengan NISN, NIK, atau data ortu belum terisi"
        />
        <KpiCard
          title="Data Pegawai Belum Lengkap"
          value={formatNumber(kpis.pegawai_incomplete?.total)}
          icon={AlertTriangle}
          subtitle="Pegawai dengan NIY atau NIK belum terisi"
        />
      </KpiCardGrid>
    </div>
  )
}
