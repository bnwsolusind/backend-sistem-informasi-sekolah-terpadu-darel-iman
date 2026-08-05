import React, { useState, useEffect } from 'react'
import { Building2, Users, GraduationCap, FileCheck, AlertCircle, Award } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardFilter from '../components/dashboard/DashboardFilter'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import ChartCard from '../components/dashboard/ChartCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'

import { managementDashboardService } from '../services/managementDashboardService'

export default function DivisiPendidikanDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await managementDashboardService.getDivisiPendidikan()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Divisi Pendidikan dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Divisi Pendidikan.')
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

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title="Dashboard Divisi Pendidikan"
        subtitle="Monitoring dan evaluasi kinerja akademik serta operasional lintas unit pendidikan"
        roleName="Divisi Pendidikan"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      <KpiCardGrid cols={3}>
        <KpiCard
          title="Unit yang Dipantau"
          value={formatNumber(kpis.unit_monitored?.total)}
          icon={Building2}
        />
        <KpiCard
          title="Total Siswa"
          value={formatNumber(kpis.total_siswa?.total)}
          icon={Users}
        />
        <KpiCard
          title="Total Guru"
          value={formatNumber(kpis.total_guru?.total)}
          icon={GraduationCap}
        />
      </KpiCardGrid>

      <KpiCardGrid cols={3}>
        <KpiCard
          title="Laporan Bulanan Masuk"
          value={formatNumber(kpis.laporan_bulanan_masuk?.total)}
          icon={FileCheck}
        />
        <KpiCard
          title="Laporan Belum Masuk"
          value={formatNumber(kpis.laporan_bulanan_belum?.total)}
          icon={AlertCircle}
        />
        <KpiCard
          title="Prestasi Siswa"
          value={formatNumber(kpis.total_prestasi?.total)}
          icon={Award}
        />
      </KpiCardGrid>

      <ChartCard
        title="Perbandingan Jumlah Siswa & Pegawai antar Unit"
        subtitle="Analisis ketersediaan SDM dan rasio siswa"
        empty={!charts.unit_comparison || charts.unit_comparison.length === 0}
      >
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.unit_comparison || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} />
              <YAxis stroke="#888888" fontSize={11} />
              <Tooltip />
              <Bar dataKey="siswa" fill="#0E5C44" name="Siswa" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pegawai" fill="#3FBF75" name="Pegawai" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}
