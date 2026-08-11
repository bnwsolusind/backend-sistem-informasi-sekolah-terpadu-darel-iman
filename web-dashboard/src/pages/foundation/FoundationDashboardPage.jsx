import React, { useState, useEffect } from 'react'
import {
  Building2,
  Users,
  UserCheck,
  GraduationCap,
  HeartHandshake,
  School,
  Layers,
  Award,
  Megaphone,
  Eye,
  FileSpreadsheet
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

import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardFilter from '../../components/dashboard/DashboardFilter'
import KpiCardGrid from '../../components/dashboard/KpiCardGrid'
import KpiCard from '../../components/dashboard/KpiCard'
import ChartCard from '../../components/dashboard/ChartCard'
import DataTableCard from '../../components/dashboard/DataTableCard'
import SkeletonDashboard from '../../components/dashboard/SkeletonDashboard'
import ErrorState from '../../components/dashboard/ErrorState'
import KpiQuickViewModal from '../../components/KpiQuickViewModal'
import ModalErrorBoundary from '../../components/common/ModalErrorBoundary'

import api from '../../services/api'

export function FoundationDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('all')
  const [activeModal, setActiveModal] = useState(null)
  const [unitsList, setUnitsList] = useState([])

  const fetchDashboard = async (unitId = selectedUnitFilter) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/foundation/dashboard', {
        params: { unit_id: unitId }
      })
      if (res.data && res.data.data) {
        setData(res.data.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load foundation dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Yayasan.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnits = async () => {
    try {
      const res = await api.get('/foundation/units')
      if (res.data && res.data.data) {
        setUnitsList(res.data.data)
      }
    } catch (err) {
      console.error('Failed to load units for filter:', err)
    }
  }

  useEffect(() => {
    fetchUnits()
    fetchDashboard('all')
  }, [])

  const handleUnitFilterChange = (unitId) => {
    setSelectedUnitFilter(unitId)
    fetchDashboard(unitId)
  }

  if (loading) return <SkeletonDashboard />
  if (error) return <ErrorState message={error} onRetry={() => fetchDashboard(selectedUnitFilter)} />

  const kpis = data?.kpis || {}
  const charts = data?.charts || {}
  const unitSummaries = data?.unit_summaries || []
  const recentInformation = data?.recent_information || []
  const activeYear = data?.active_academic_year
  const activeSemester = data?.active_semester

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  return (
    <div className="space-y-6 pb-12">
      {/* Header (Monitoring Eksekutif Yayasan) */}
      <DashboardHeader
        title="Dashboard Pengurus Yayasan"
        subtitle="Monitoring eksekutif perkembangan sekolah, SDM, kesiswaan, dan unit pendidikan secara terpadu"
        roleName="Pengurus Yayasan"
        academicYear={activeYear?.name || activeYear?.nama}
        semester={activeSemester?.name || activeSemester?.nama}
      />

      {/* Filter Global Unit */}
      <DashboardFilter
        units={unitsList}
        selectedUnit={selectedUnitFilter}
        onUnitChange={handleUnitFilterChange}
        onReset={() => handleUnitFilterChange('all')}
      />

      {/* Primary KPI Grid (View Only) */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Total Unit Pendidikan"
          value={formatNumber(kpis.unit_pendidikan?.total ?? kpis.total_unit_aktif)}
          trend={kpis.unit_pendidikan?.growth}
          trendType={kpis.unit_pendidikan?.growth >= 0 ? 'up' : 'down'}
          icon={Building2}
          onClick={() => setActiveModal('total_unit')}
        />
        <KpiCard
          title="Total Guru"
          value={formatNumber(kpis.guru?.total ?? kpis.total_guru)}
          trend={kpis.guru?.growth}
          trendType={kpis.guru?.growth >= 0 ? 'up' : 'down'}
          icon={GraduationCap}
          onClick={() => setActiveModal('total_guru')}
        />
        <KpiCard
          title="Total Pegawai & Tendik"
          value={formatNumber(kpis.pegawai?.total ?? kpis.total_pegawai)}
          trend={kpis.pegawai?.growth}
          trendType={kpis.pegawai?.growth >= 0 ? 'up' : 'down'}
          icon={UserCheck}
          onClick={() => setActiveModal('total_pegawai')}
        />
        <KpiCard
          title="Total Siswa Aktif"
          value={formatNumber(kpis.siswa?.total ?? kpis.total_siswa_aktif)}
          trend={kpis.siswa?.growth}
          trendType={kpis.siswa?.growth >= 0 ? 'up' : 'down'}
          icon={Users}
          onClick={() => setActiveModal('total_siswa')}
        />
      </KpiCardGrid>

      {/* Secondary KPI Grid (Akademik & Alumni) */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Total Orang Tua"
          value={formatNumber(kpis.orang_tua?.total ?? kpis.total_ortu)}
          icon={HeartHandshake}
          onClick={() => setActiveModal('total_ortu')}
        />
        <KpiCard
          title="Total Alumni"
          value={formatNumber(kpis.alumni?.total ?? kpis.total_alumni)}
          icon={GraduationCap}
          onClick={() => setActiveModal('total_alumni')}
        />
        <KpiCard
          title="Total Kelas"
          value={formatNumber(kpis.kelas?.total ?? kpis.total_kelas)}
          icon={School}
          onClick={() => setActiveModal('total_kelas')}
        />
        <KpiCard
          title="Total Rombel"
          value={formatNumber(kpis.rombel?.total ?? kpis.total_rombel)}
          icon={Layers}
          onClick={() => setActiveModal('total_rombel')}
        />
      </KpiCardGrid>

      {/* Additional Stats Bar */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Siswa Baru"
          value={formatNumber(kpis.siswa_baru)}
          subtitle="Tahun Ajaran Berjalan"
        />
        <KpiCard
          title="Mutasi Masuk"
          value={formatNumber(kpis.mutasi_masuk)}
          subtitle="Siswa Pindahan"
        />
        <KpiCard
          title="Mutasi Keluar"
          value={formatNumber(kpis.mutasi_keluar)}
          subtitle="Siswa Keluar"
        />
        <KpiCard
          title="Siswa Lulus"
          value={formatNumber(kpis.siswa_lulus)}
          subtitle="Tercatat di Sistem"
        />
      </KpiCardGrid>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Distribusi Guru & Pegawai per Unit"
          subtitle="Sebaran SDM pendidik dan tenaga kependidikan"
          empty={!charts.sdm_distribution || charts.sdm_distribution.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.sdm_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="guru" fill="#0E5C44" name="Guru" radius={[6, 6, 0, 0]} />
                <Bar dataKey="tendik" fill="#3FBF75" name="Tendik" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Pergerakan Siswa Bulanan"
          subtitle="Pendaftaran siswa baru dan tren mutasi"
          empty={!charts.student_movement || charts.student_movement.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.student_movement || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="siswa_baru" stroke="#0E5C44" strokeWidth={2} name="Siswa Baru" />
                <Line type="monotone" dataKey="masuk" stroke="#1E8E5A" strokeWidth={2} name="Mutasi Masuk" />
                <Line type="monotone" dataKey="keluar" stroke="#EF4444" strokeWidth={2} name="Mutasi Keluar" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Unit Summary Table (View-Only, No Edit/Delete) */}
      <DataTableCard
        title="Ringkasan Kinerja Unit Pendidikan"
        subtitle="Daftar unit beserta statistik siswa, guru, dan rombel"
        headers={['No', 'Nama Unit', 'Jenjang', 'Siswa', 'Guru', 'Pegawai', 'Rombel', 'Aksi']}
        rows={unitSummaries.map((u, idx) => [
          idx + 1,
          <span key="name" className="font-semibold text-slate-900 dark:text-white">{u.name}</span>,
          u.jenjang || u.code || '-',
          formatNumber(u.siswa_aktif_count || u.siswa_count),
          formatNumber(u.guru_count),
          formatNumber(u.pegawai_count),
          formatNumber(u.rombel_count || u.kelas_count),
          <button
            key="action"
            type="button"
            onClick={() => setActiveModal(`unit_${u.id}`)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E5C44] hover:underline dark:text-emerald-400"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Detail</span>
          </button>
        ])}
        emptyMessage="Belum ada unit pendidikan yang terdaftar."
      />

      {/* Recent Information / Announcements */}
      <DataTableCard
        title="Pengumuman & Informasi Terbaru"
        subtitle="Pengumuman resmi dari yayasan atau unit sekolah"
        headers={['Judul Informasi', 'Tanggal', 'Prioritas']}
        rows={recentInformation.map((info, idx) => [
          <div key="info">
            <div className="font-semibold text-slate-900 dark:text-white text-xs">{info.judul}</div>
            <div className="text-[11px] text-slate-500 line-clamp-1">{info.isi}</div>
          </div>,
          info.tanggal,
          <span key="priority" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {info.prioritas || 'Normal'}
          </span>
        ])}
        emptyMessage="Belum ada pengumuman terbaru."
      />

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
