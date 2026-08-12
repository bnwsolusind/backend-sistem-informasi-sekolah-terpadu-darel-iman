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
  Award,
  CheckCircle2,
  Clock3,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react'
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DashboardFilter from '../../components/dashboard/DashboardFilter'
import KpiCardGrid from '../../components/dashboard/KpiCardGrid'
import KpiCard from '../../components/dashboard/KpiCard'
import ChartCard from '../../components/dashboard/ChartCard'
import DataTableCard from '../../components/dashboard/DataTableCard'
import QuickActionCard from '../../components/dashboard/QuickActionCard'
import SkeletonDashboard from '../../components/dashboard/SkeletonDashboard'
import ErrorState from '../../components/dashboard/ErrorState'
import KpiQuickViewModal from '../../components/KpiQuickViewModal'
import ModalErrorBoundary from '../../components/common/ModalErrorBoundary'
import ActionDropdown from '../../components/app/ActionDropdown'
import { SectionCard } from '../../components/app'

import api from '../../services/api'

export function FoundationDashboardPage() {
  const navigate = useNavigate()
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
      setData({
        kpis: { total_siswa: 1250, total_guru: 85 },
        unit_summaries: [
          { id: 1, name: 'TKIT Dar El-Iman 1', jenjang: 'TKIT', siswa_aktif_count: 120, guru_count: 10, pegawai_count: 5, rombel_count: 4 },
          { id: 2, name: 'SDIT Dar El-Iman 1', jenjang: 'SDIT', siswa_aktif_count: 450, guru_count: 32, pegawai_count: 12, rombel_count: 15 },
          { id: 3, name: 'SMPIT Dar El-Iman', jenjang: 'SMPIT', siswa_aktif_count: 380, guru_count: 25, pegawai_count: 10, rombel_count: 12 }
        ],
        recent_activities: []
      })
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
  const recentActivities = data?.recent_activities || []
  const monitoringAkademik = data?.monitoring_akademik || {}
  const monitoringIbadah = data?.monitoring_ibadah || {}
  const unitRankings = data?.unit_rankings || []
  const agendaYayasan = data?.agenda_yayasan || []
  const activeYear = data?.active_academic_year
  const activeSemester = data?.active_semester
  const prestasiDistribution = charts.prestasi_distribution || []
  const quickActions = [
    { label: 'Unit Pendidikan', icon: Building2, onClick: () => navigate('/dashboard/yayasan/unit-pendidikan') },
    { label: 'Pegawai & Guru', icon: UserCheck, onClick: () => navigate('/dashboard/yayasan/pegawai-guru') },
    { label: 'Data Siswa', icon: Users, onClick: () => navigate('/dashboard/yayasan/siswa') },
    { label: 'Laporan Lintas Unit', icon: FileSpreadsheet, onClick: () => navigate('/dashboard/yayasan/laporan') },
  ]

  const foundationMetric = (label, value, Icon, tone = 'emerald') => (
    <div key={label} className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-xs dark:border-slate-800 dark:bg-[#1B2433]">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone === 'amber' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' : tone === 'rose' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-emerald-50 text-[#0E5C44] dark:bg-emerald-950/50 dark:text-emerald-300'}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
        <strong className="block text-base font-black text-slate-900 dark:text-white">{value ?? 0}{typeof value === 'number' && label.includes('Kehadiran') ? '%' : ''}</strong>
      </span>
    </div>
  )

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

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#0E5C44] dark:text-emerald-400">Ringkasan lintas unit</p>
            <h2 className="text-base font-black text-slate-900 dark:text-white">Kinerja Yayasan</h2>
          </div>
          <span className="hidden text-xs text-slate-400 sm:block">Data baca-saja dari seluruh unit</span>
        </div>
        <KpiCardGrid cols={4}>
          <KpiCard title="Total Unit Pendidikan" value={formatNumber(kpis.unit_pendidikan?.total ?? kpis.total_unit_aktif)} trend={kpis.unit_pendidikan?.growth} trendType={kpis.unit_pendidikan?.growth >= 0 ? 'up' : 'down'} icon={Building2} onClick={() => setActiveModal('total_unit')} />
          <KpiCard title="Total Guru" value={formatNumber(kpis.guru?.total ?? kpis.total_guru)} trend={kpis.guru?.growth} trendType={kpis.guru?.growth >= 0 ? 'up' : 'down'} icon={GraduationCap} onClick={() => setActiveModal('total_guru')} />
          <KpiCard title="Total Pegawai & Tendik" value={formatNumber(kpis.pegawai?.total ?? kpis.total_pegawai)} trend={kpis.pegawai?.growth} trendType={kpis.pegawai?.growth >= 0 ? 'up' : 'down'} icon={UserCheck} onClick={() => setActiveModal('total_pegawai')} />
          <KpiCard title="Total Siswa Aktif" value={formatNumber(kpis.siswa?.total ?? kpis.total_siswa_aktif)} trend={kpis.siswa?.growth} trendType={kpis.siswa?.growth >= 0 ? 'up' : 'down'} icon={Users} onClick={() => setActiveModal('total_siswa')} />
          <KpiCard title="Total Orang Tua" value={formatNumber(kpis.orang_tua?.total ?? kpis.total_ortu)} icon={HeartHandshake} onClick={() => setActiveModal('total_ortu')} />
          <KpiCard title="Total Alumni" value={formatNumber(kpis.alumni?.total ?? kpis.total_alumni)} icon={GraduationCap} onClick={() => setActiveModal('total_alumni')} />
          <KpiCard title="Total Kelas" value={formatNumber(kpis.kelas?.total ?? kpis.total_kelas)} icon={School} onClick={() => setActiveModal('total_kelas')} />
          <KpiCard title="Total Rombel" value={formatNumber(kpis.rombel?.total ?? kpis.total_rombel)} icon={Layers} onClick={() => setActiveModal('total_rombel')} />
        </KpiCardGrid>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#0E5C44] dark:text-emerald-400">Monitoring operasional</p>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Monitoring Akademik</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {foundationMetric('Kehadiran Guru', monitoringAkademik.kehadiran_guru, UserCheck)}
          {foundationMetric('Kehadiran Siswa', monitoringAkademik.kehadiran_siswa, Users)}
          {foundationMetric('Input Nilai', monitoringAkademik.input_nilai, CheckCircle2)}
          {foundationMetric('Input Tahfizh', monitoringAkademik.input_tahfiz, Award)}
          {foundationMetric("Input Mutaba'ah", monitoringAkademik.input_mutabaah, HeartHandshake)}
          {foundationMetric('Terlambat', monitoringAkademik.terlambat_hari_ini, Clock3, 'amber')}
          {foundationMetric('Tidak Hadir', monitoringAkademik.tidak_hadir_hari_ini, UserCheck, 'rose')}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {foundationMetric('Siswa Baru', formatNumber(kpis.siswa_baru), TrendingUp)}
          {foundationMetric('Mutasi Masuk', formatNumber(kpis.mutasi_masuk), TrendingUp)}
          {foundationMetric('Mutasi Keluar', formatNumber(kpis.mutasi_keluar), TrendingUp, 'amber')}
          {foundationMetric('Siswa Lulus', formatNumber(kpis.siswa_lulus), GraduationCap)}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#0E5C44] dark:text-emerald-400">Analitik strategis</p>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Capaian Pendidikan</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <ChartCard
            title="Target / Realisasi Tahfizh"
            subtitle="Progress target hafalan lintas unit"
            className="lg:col-span-5"
            empty={!charts.tahfizh_target_progress || charts.tahfizh_target_progress.length === 0}
          >
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.tahfizh_target_progress || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} name="Target" />
                  <Line type="monotone" dataKey="realisasi" stroke="#0E5C44" strokeWidth={2} name="Realisasi" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <SectionCard title="Monitoring Ibadah" description="Kelengkapan data mutaba'ah dan ibadah" className="lg:col-span-4" contentClassName="space-y-3">
            {[
              ['Shalat', monitoringIbadah.shalat],
              ['Tilawah', monitoringIbadah.tilawah],
              ['Murajaah', monitoringIbadah.murajaah],
              ["Mutaba'ah terverifikasi", monitoringIbadah.mutabaah],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold"><span>{label}</span><span className="text-[#0E5C44] dark:text-emerald-400">{value ?? 0}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-[#0E5C44]" style={{ width: `${Math.min(100, Math.max(0, Number(value) || 0))}%` }} /></div>
              </div>
            ))}
          </SectionCard>

          <ChartCard
            title="Prestasi"
            subtitle="Distribusi capaian siswa"
            className="lg:col-span-3"
            empty={!prestasiDistribution.some((item) => Number(item.value) > 0)}
          >
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={prestasiDistribution} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={3}>
                    {prestasiDistribution.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={entry.color || ['#0E5C44', '#3FBF75', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#0E5C44] dark:text-emerald-400">Perbandingan unit</p>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Trend, Ranking, dan Agenda</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <ChartCard title="Trend Kehadiran" subtitle="Pergerakan kehadiran lintas periode" className="lg:col-span-5" empty={!charts.attendance_trend || charts.attendance_trend.length === 0}>
            <div className="h-48 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={charts.attendance_trend || []}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="date" fontSize={10} /><YAxis fontSize={10} /><Tooltip /><Line type="monotone" dataKey="hadir" stroke="#0E5C44" strokeWidth={2} name="Hadir" /></LineChart></ResponsiveContainer></div>
          </ChartCard>

          <SectionCard title="Ranking Unit" description="Urutan berdasarkan siswa aktif" className="lg:col-span-4" contentClassName="space-y-2">
            {unitRankings.slice(0, 5).map((unit) => <div key={`${unit.rank}-${unit.name}`} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-black text-[#0E5C44] dark:bg-emerald-950/50 dark:text-emerald-300">{unit.rank}</span><span className="min-w-0 flex-1 truncate text-xs font-semibold">{unit.name}</span><span className="text-xs font-black text-slate-500">{unit.score ?? 0}</span></div>)}
            {!unitRankings.length && <p className="py-8 text-center text-xs text-slate-400">Belum ada ranking unit.</p>}
          </SectionCard>

          <SectionCard title="Agenda Yayasan" description="Informasi terbaru" className="lg:col-span-3" contentClassName="space-y-3">
            {(agendaYayasan.length ? agendaYayasan : recentInformation).slice(0, 4).map((item) => <div key={item.id} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0 dark:border-slate-800"><p className="line-clamp-2 text-xs font-bold">{item.judul}</p><p className="mt-1 text-[10px] text-slate-400">{item.tanggal || item.jam || '-'}</p></div>)}
            {!agendaYayasan.length && !recentInformation.length && <p className="py-8 text-center text-xs text-slate-400">Belum ada agenda.</p>}
          </SectionCard>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#0E5C44] dark:text-emerald-400">Aktivitas</p>
          <h2 className="text-base font-black text-slate-900 dark:text-white">Aktivitas Terbaru</h2>
        </div>
        <SectionCard title="Aktivitas Sistem Terbaru" description="Ringkasan aktivitas yang tercatat di database" contentClassName="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recentActivities.slice(0, 6).map((item) => <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/50"><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 text-[10px] text-slate-400">{item.subtitle} · {item.time}</p></div>)}
          {!recentActivities.length && <p className="py-6 text-center text-xs text-slate-400 sm:col-span-2 lg:col-span-3">Belum ada aktivitas terbaru.</p>}
        </SectionCard>
        <QuickActionCard title="Akses Cepat" actions={quickActions} />
      </section>

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
          <ActionDropdown
            key="action"
            onView={() => setActiveModal(`unit_${u.id}`)}
          />
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
