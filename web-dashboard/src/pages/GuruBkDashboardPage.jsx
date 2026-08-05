import React, { useState, useEffect } from 'react'
import { FileText, HeartHandshake, ShieldCheck, Users, AlertTriangle, CheckCircle2, Plus } from 'lucide-react'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardFilter from '../components/dashboard/DashboardFilter'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import DataTableCard from '../components/dashboard/DataTableCard'
import QuickActionCard from '../components/dashboard/QuickActionCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'
import DetailModal from '../components/dashboard/DetailModal'

import { managementDashboardService } from '../services/managementDashboardService'

export default function GuruBkDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeModal, setActiveModal] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await managementDashboardService.getGuruBk()
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Guru BK dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Guru BK.')
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
  const tables = data?.tables || {}

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  const quickActions = [
    {
      label: 'Tambah Catatan BK',
      icon: Plus,
      onClick: () => window.location.href = '/dashboard/guru/student-notes',
      permissions: ['teacher.student_note.create']
    },
    {
      label: 'Lihat Catatan Siswa',
      icon: FileText,
      onClick: () => window.location.href = '/dashboard/guru/student-notes',
      permissions: ['teacher.student_note.view']
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title="Dashboard Guru BK (Bimbingan Konseling)"
        subtitle="Ruang pendampingan konseling dan penanganan catatan perilaku siswa yang terproteksi"
        roleName="Guru BK"
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter onReset={fetchDashboard} />

      {/* Primary KPI Grid */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Total Catatan Konseling"
          value={formatNumber(kpis.total_konseling?.total)}
          icon={FileText}
          onClick={() => setActiveModal('total_konseling')}
        />
        <KpiCard
          title="Siswa Dalam Pendampingan"
          value={formatNumber(kpis.siswa_dalam_pendampingan?.total)}
          icon={Users}
        />
        <KpiCard
          title="Butuh Tindak Lanjut"
          value={formatNumber(kpis.kasus_menunggu_tindak_lanjut?.total)}
          icon={AlertTriangle}
        />
        <KpiCard
          title="Kasus Prioritas Tinggi"
          value={formatNumber(kpis.kasus_prioritas_tinggi?.total)}
          icon={AlertTriangle}
        />
      </KpiCardGrid>

      {/* Security Banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200">
        <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
        <div className="text-xs">
          <span className="font-bold block">Proteksi Kerahasiaan Data BK Terjamin</span>
          Catatan konseling dan pendampingan hanya dapat diakses oleh konselor/guru BK yang berwenang.
        </div>
      </div>

      <QuickActionCard title="Aksi Cepat Guru BK" actions={quickActions} />

      {/* Active Cases Table */}
      <DataTableCard
        title="Daftar Pendampingan / Catatan Konseling Terbaru"
        subtitle="Informasi umum pendampingan siswa"
        headers={['Nama Siswa', 'Kategori', 'Judul Catatan', 'Prioritas', 'Tanggal']}
        rows={(tables.cases || []).map((c, idx) => [
          <span key="student" className="font-semibold text-slate-900 dark:text-white">{c.student?.full_name || 'Siswa'}</span>,
          c.category || 'Konseling',
          c.title || 'Catatan Pendampingan',
          <span key="priority" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {c.priority || 'Normal'}
          </span>,
          c.date || (c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID') : '-')
        ])}
        emptyMessage="Belum ada catatan konseling terbaru."
      />

      <DetailModal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={`Detail Pendampingan BK (${activeModal})`}
        subtitle="Data detail konseling terproteksi"
      >
        <div className="p-4 text-center text-sm text-slate-500">
          Data detail <span className="font-bold text-slate-800 dark:text-slate-200">{activeModal}</span> siap ditampilkan.
        </div>
      </DetailModal>
    </div>
  )
}
