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
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Bell,
  RefreshCw,
  Eye,
  Filter,
} from 'lucide-react'
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

import {
  AppPageHeader,
  AppBreadcrumb,
  AppFilterBar,
  KpiCard,
  SummaryCard,
  AppDataTable,
  AppBadge,
  AppButton,
  ActionDropdown,
  SectionHeader,
} from '../../components/app'

import ChartCard from '../../components/dashboard/ChartCard'
import SkeletonDashboard from '../../components/dashboard/SkeletonDashboard'
import ErrorState from '../../components/dashboard/ErrorState'
import KpiQuickViewModal from '../../components/KpiQuickViewModal'
import ModalErrorBoundary from '../../components/common/ModalErrorBoundary'
import KpiDetailDrawer from '../../components/KpiDetailDrawer'

import api from '../../services/api'

export function FoundationDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('all')
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState('year')
  const [activeModal, setActiveModal] = useState(null)
  const [detailDrawer, setDetailDrawer] = useState({ isOpen: false, type: null, id: null })
  const [unitsList, setUnitsList] = useState([])

  const fetchDashboard = async (unitId = selectedUnitFilter, period = selectedPeriodFilter) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/foundation/dashboard', {
        params: { unit_id: unitId, period }
      })
      if (res.data && res.data.data) {
        setData(res.data.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load foundation dashboard:', err)
      setError(err?.response?.data?.message || 'Gagal memuat data dashboard yayasan.')
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
    fetchDashboard('all', 'year')
  }, [])

  const handleUnitFilterChange = (unitId) => {
    setSelectedUnitFilter(unitId)
    fetchDashboard(unitId, selectedPeriodFilter)
  }

  const handleResetFilter = () => {
    setSelectedUnitFilter('all')
    setSelectedPeriodFilter('year')
    fetchDashboard('all', 'year')
  }

  const handleOpenUnitDetail = (unit) => {
    setDetailDrawer({
      isOpen: true,
      type: 'unit_pendidikan',
      id: unit.id,
    })
  }

  if (loading && !data) return <SkeletonDashboard />
  if (error && !data) return <ErrorState message={error} onRetry={() => fetchDashboard(selectedUnitFilter)} />

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
  const sdmDistribution = charts.sdm_distribution || []

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  const isFiltered = selectedUnitFilter !== 'all' || selectedPeriodFilter !== 'year'

  // Columns for Unit Summary Table
  const unitColumns = [
    {
      key: 'name',
      label: 'Nama Unit Pendidikan',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0E5C44]/10 text-[#0E5C44] font-black text-xs dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]">
            {(row.code || row.name || 'UN').substring(0, 3).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-slate-900 dark:text-white truncate">{row.name}</p>
            <p className="text-[11px] text-slate-400 font-medium">{row.jenis_unit || row.level || 'Unit Sekolah'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'kepala_sekolah',
      label: 'Kepala Sekolah',
      hideOnMobile: true,
      render: (row) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {typeof row.kepala_sekolah === 'object' ? row.kepala_sekolah?.nama : row.kepala_sekolah || 'Belum Ditentukan'}
        </span>
      ),
    },
    {
      key: 'siswa_aktif_count',
      label: 'Siswa Aktif',
      sortable: true,
      render: (row) => (
        <span className="font-extrabold text-[#0E5C44] dark:text-[#3FBF75]">
          {formatNumber(row.siswa_aktif_count ?? row.siswa_count)} Siswa
        </span>
      ),
    },
    {
      key: 'guru_count',
      label: 'Guru',
      sortable: true,
      render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{formatNumber(row.guru_count)}</span>,
    },
    {
      key: 'pegawai_count',
      label: 'Pegawai & Tendik',
      sortable: true,
      hideOnMobile: true,
      render: (row) => <span className="font-semibold text-slate-600 dark:text-slate-400">{formatNumber(row.pegawai_count)}</span>,
    },
    {
      key: 'rombel_count',
      label: 'Rombel',
      sortable: true,
      hideOnMobile: true,
      render: (row) => <span className="font-semibold text-slate-600 dark:text-slate-400">{formatNumber(row.rombel_count || row.kelas_count)}</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <AppBadge variant={row.is_active ? 'success' : 'secondary'} dot>
          {row.is_active ? 'Aktif' : 'Nonaktif'}
        </AppBadge>
      ),
    },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <AppBreadcrumb items={[{ label: 'Dashboard Pengurus Yayasan' }]} />

      {/* Welcome Header (Brand Variant with Islamic Modern Pattern) */}
      <AppPageHeader
        variant="brand"
        title="Dashboard Pengurus Yayasan"
        eyebrow="Yayasan Darel Iman — Executive Monitoring"
        description="Monitoring eksekutif 15 unit pendidikan, SDM guru & pegawai, kesiswaan, capaian akademik, tahfizh, dan mutaba'ah secara terpadu."
        welcomeName="Pengurus Yayasan"
        chips={[
          activeYear ? `Tahun Ajaran ${activeYear.name || activeYear.nama}` : 'TBA 2026/2027',
          activeSemester ? `Semester ${activeSemester.name || activeSemester.nama}` : 'Semester Ganjil',
          `${unitsList.length || 15} Unit Pendidikan`,
          'Status: Monitoring Real-Time',
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <AppButton
              variant="accent"
              size="sm"
              icon={FileSpreadsheet}
              onClick={() => navigate('/dashboard/yayasan/laporan')}
            >
              Laporan Lintas Unit
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchDashboard(selectedUnitFilter, selectedPeriodFilter)}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Segarkan
            </AppButton>
          </div>
        }
      />

      {/* Filter Global Unit & Periode */}
      <AppFilterBar
        label="Filter Monitoring"
        activeCount={isFiltered ? (selectedUnitFilter !== 'all' ? 1 : 0) + (selectedPeriodFilter !== 'year' ? 1 : 0) : 0}
        onReset={handleResetFilter}
      >
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Unit Pendidikan:</span>
            <select
              value={selectedUnitFilter}
              onChange={(e) => handleUnitFilterChange(e.target.value)}
              className="h-9.5 min-w-[200px] rounded-xl border border-slate-200/80 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-[#0E5C44] focus:ring-2 focus:ring-[#0E5C44]/20 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200 dark:focus:border-[#3FBF75]"
            >
              <option value="all">Semua Unit Pendidikan (15 Unit)</option>
              {unitsList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.code || u.jenis_unit || 'Unit'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Periode:</span>
            <select
              value={selectedPeriodFilter}
              onChange={(e) => {
                setSelectedPeriodFilter(e.target.value)
                fetchDashboard(selectedUnitFilter, e.target.value)
              }}
              className="h-9.5 rounded-xl border border-slate-200/80 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-[#0E5C44] focus:ring-2 focus:ring-[#0E5C44]/20 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200 dark:focus:border-[#3FBF75]"
            >
              <option value="year">Tahun Berjalan</option>
              <option value="month">Bulan Ini</option>
              <option value="semester">Semester Ini</option>
            </select>
          </div>
        </div>
      </AppFilterBar>

      {/* KPI Cards Grid (Canonical KpiCard Session 3) */}
      <section className="space-y-3">
        <SectionHeader
          title="Kinerja Eksekutif Yayasan"
          subtitle="Ringkasan agregat real-time dari PostgreSQL seluruh unit pendidikan"
          badge="Monitoring Real-Time"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Unit Pendidikan"
            value={formatNumber(kpis.unit_pendidikan?.total ?? kpis.total_unit_aktif ?? unitsList.length)}
            trend={kpis.unit_pendidikan?.growth ?? kpis.growth_unit}
            trendType={(kpis.unit_pendidikan?.growth ?? 0) >= 0 ? 'up' : 'down'}
            trendText="unit baru bulan ini"
            icon={Building2}
            colorScheme="emerald"
            badge="15 Unit"
            badgeVariant="success"
            onClick={() => setActiveModal('total_unit')}
          />

          <KpiCard
            title="Guru & Pendidik"
            value={formatNumber(kpis.guru?.total ?? kpis.total_guru)}
            trend={kpis.guru?.growth ?? kpis.growth_guru}
            trendType={(kpis.guru?.growth ?? 0) >= 0 ? 'up' : 'down'}
            trendText="vs bulan lalu"
            icon={GraduationCap}
            colorScheme="blue"
            badge="SDM Guru"
            badgeVariant="info"
            onClick={() => setActiveModal('total_guru')}
          />

          <KpiCard
            title="Pegawai & Tendik"
            value={formatNumber(kpis.pegawai?.total ?? kpis.total_pegawai)}
            trend={kpis.pegawai?.growth ?? kpis.growth_pegawai}
            trendType={(kpis.pegawai?.growth ?? 0) >= 0 ? 'up' : 'down'}
            trendText="vs bulan lalu"
            icon={UserCheck}
            colorScheme="violet"
            badge="Tendik"
            badgeVariant="purple"
            onClick={() => setActiveModal('total_pegawai')}
          />

          <KpiCard
            title="Siswa Aktif"
            value={formatNumber(kpis.siswa?.total ?? kpis.total_siswa_aktif)}
            trend={kpis.siswa?.growth ?? kpis.growth_siswa}
            trendType={(kpis.siswa?.growth ?? 0) >= 0 ? 'up' : 'down'}
            trendText="siswa terdaftar"
            icon={Users}
            colorScheme="indigo"
            badge="Terdaftar"
            badgeVariant="success"
            onClick={() => setActiveModal('total_siswa')}
          />

          <KpiCard
            title="Orang Tua / Wali"
            value={formatNumber(kpis.orang_tua?.total ?? kpis.total_ortu)}
            trend={kpis.orang_tua?.growth ?? kpis.growth_ortu}
            trendType="up"
            trendText="akun wali murid"
            icon={HeartHandshake}
            colorScheme="rose"
            badge="Wali"
            badgeVariant="warning"
            onClick={() => setActiveModal('total_ortu')}
          />

          <KpiCard
            title="Total Alumni"
            value={formatNumber(kpis.alumni?.total ?? kpis.total_alumni)}
            trend={kpis.alumni?.growth ?? kpis.growth_alumni}
            trendType="up"
            trendText="alumni terdata"
            icon={Sparkles}
            colorScheme="amber"
            badge="Lulusan"
            badgeVariant="purple"
            onClick={() => setActiveModal('total_alumni')}
          />

          <KpiCard
            title="Total Kelas"
            value={formatNumber(kpis.kelas?.total ?? kpis.total_kelas)}
            trend={kpis.kelas?.growth ?? kpis.growth_kelas}
            trendType="neutral"
            trendText="ruang kelas"
            icon={School}
            colorScheme="blue"
            badge="Kelas"
            badgeVariant="info"
            onClick={() => setActiveModal('total_kelas')}
          />

          <KpiCard
            title="Total Rombel"
            value={formatNumber(kpis.rombel?.total ?? kpis.total_rombel)}
            trend={kpis.rombel?.growth ?? kpis.growth_rombel}
            trendType="up"
            trendText="rombongan belajar"
            icon={Layers}
            colorScheme="emerald"
            badge="Rombel"
            badgeVariant="success"
            onClick={() => setActiveModal('total_rombel')}
          />
        </div>
      </section>

      {/* Ringkasan Operasional & Monitoring Akademik */}
      <section className="space-y-3">
        <SectionHeader
          title="Monitoring Operasional & Akademik"
          subtitle="Kondisi presensi, input nilai, tahfizh, dan mutaba'ah ibadah harian"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <SummaryCard
            title="Kehadiran Guru"
            value={`${monitoringAkademik.kehadiran_guru ?? 100}%`}
            icon={UserCheck}
            colorScheme="emerald"
          />
          <SummaryCard
            title="Kehadiran Siswa"
            value={`${monitoringAkademik.kehadiran_siswa ?? 100}%`}
            icon={Users}
            colorScheme="blue"
          />
          <SummaryCard
            title="Input Nilai"
            value={`${monitoringAkademik.input_nilai ?? 100}%`}
            icon={CheckCircle2}
            colorScheme="violet"
          />
          <SummaryCard
            title="Input Tahfizh"
            value={`${monitoringAkademik.input_tahfiz ?? 100}%`}
            icon={Award}
            colorScheme="amber"
          />
          <SummaryCard
            title="Input Mutaba'ah"
            value={`${monitoringAkademik.input_mutabaah ?? 100}%`}
            icon={HeartHandshake}
            colorScheme="indigo"
          />
          <SummaryCard
            title="Terlambat Hari Ini"
            value={formatNumber(monitoringAkademik.terlambat_hari_ini)}
            icon={Clock3}
            colorScheme="amber"
          />
          <SummaryCard
            title="Tidak Hadir"
            value={formatNumber(monitoringAkademik.tidak_hadir_hari_ini)}
            icon={UserCheck}
            colorScheme="rose"
          />
        </div>

        {/* Demographic & Movement Breakdown */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard
            title="Siswa Baru"
            value={formatNumber(kpis.siswa_baru)}
            description="Tahun ajaran berjalan"
            icon={TrendingUp}
            colorScheme="emerald"
          />
          <SummaryCard
            title="Mutasi Masuk"
            value={formatNumber(kpis.mutasi_masuk)}
            description="Siswa pindahan masuk"
            icon={TrendingUp}
            colorScheme="blue"
          />
          <SummaryCard
            title="Mutasi Keluar"
            value={formatNumber(kpis.mutasi_keluar)}
            description="Siswa pindahan keluar"
            icon={TrendingUp}
            colorScheme="amber"
          />
          <SummaryCard
            title="Siswa Lulus"
            value={formatNumber(kpis.siswa_lulus)}
            description="Telah menyelesaikan pendidikan"
            icon={GraduationCap}
            colorScheme="indigo"
          />
        </div>
      </section>

      {/* Visual Analytics & Charts */}
      <section className="space-y-3">
        <SectionHeader
          title="Analitik Capaian & Distribusi Lintas Unit"
          subtitle="Visualisasi grafik distribusi SDM, capaian prestasi, dan mutaba'ah ibadah"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Chart 1: Distribusi SDM Guru & Tendik per Unit */}
          <ChartCard
            title="Distribusi SDM per Unit Pendidikan"
            subtitle="Perbandingan jumlah Guru vs Tendik di seluruh unit"
            className="lg:col-span-6"
            empty={!sdmDistribution || sdmDistribution.length === 0}
          >
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sdmDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="code" fontSize={10} interval={0} angle={-30} textAnchor="end" />
                  <YAxis fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="guru" fill="#0E5C44" name="Guru" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="tendik" fill="#3FBF75" name="Tendik" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Chart 2: Monitoring Mutaba'ah Ibadah */}
          <div className="rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm space-y-4 lg:col-span-3 dark:border-slate-800 dark:bg-[#1B2433]">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Monitoring Ibadah Harian</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tingkat kelengkapan mutaba'ah siswa</p>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { label: 'Shalat Wajib & Sunnah', value: monitoringIbadah.shalat },
                { label: 'Tilawah Al-Qur\'an', value: monitoringIbadah.tilawah },
                { label: 'Muraja\'ah Hafalan', value: monitoringIbadah.murajaah },
                { label: 'Mutaba\'ah Terverifikasi', value: monitoringIbadah.mutabaah },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="text-[#0E5C44] dark:text-[#3FBF75] font-black">{item.value ?? 0}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0E5C44] to-[#3FBF75] transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, Number(item.value) || 0))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Distribusi Prestasi Siswa */}
          <ChartCard
            title="Distribusi Prestasi Siswa"
            subtitle="Kategori capaian prestasi terdaftar"
            className="lg:col-span-3"
            empty={!prestasiDistribution.some((item) => Number(item.value) > 0)}
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prestasiDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {prestasiDistribution.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={entry.color || ['#0E5C44', '#3FBF75', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </section>

      {/* Cross-Unit Comparison & Performance Ranking */}
      <section className="space-y-3">
        <SectionHeader
          title="Perbandingan Kinerja Unit Pendidikan"
          subtitle="Daftar 15 unit pendidikan beserta statistik jumlah siswa, guru, pegawai, dan rombel"
          actions={
            <AppButton
              variant="outline"
              size="sm"
              icon={Building2}
              onClick={() => navigate('/dashboard/yayasan/unit-pendidikan')}
            >
              Lihat Seluruh Unit
            </AppButton>
          }
        />

        <AppDataTable
          data={unitSummaries}
          columns={unitColumns}
          keyField="id"
          searchPlaceholder="Cari nama atau jenis unit..."
          onView={(row) => handleOpenUnitDetail(row)}
          renderMobileCard={({ row, onView }) => (
            <div
              key={row.id}
              onClick={onView}
              className="flex flex-col gap-2.5 rounded-[16px] border border-slate-200/80 bg-white p-4 shadow-sm cursor-pointer hover:border-[#3FBF75]/40 dark:border-slate-800 dark:bg-[#1B2433]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E5C44]/10 text-[#0E5C44] font-black text-xs dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]">
                    {(row.code || row.name || 'UN').substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{row.name}</h4>
                    <p className="text-xs text-slate-400">{row.jenis_unit || row.level || 'Unit Pendidikan'}</p>
                  </div>
                </div>
                <AppBadge variant={row.is_active ? 'success' : 'secondary'} dot>
                  {row.is_active ? 'Aktif' : 'Nonaktif'}
                </AppBadge>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800 text-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Siswa</span>
                  <p className="text-xs font-black text-[#0E5C44] dark:text-[#3FBF75]">{formatNumber(row.siswa_aktif_count)}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Guru</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatNumber(row.guru_count)}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Rombel</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatNumber(row.rombel_count || row.kelas_count)}</p>
                </div>
              </div>
            </div>
          )}
        />
      </section>

      {/* Activity Feed & Announcements Grid */}
      <section className="space-y-3">
        <SectionHeader
          title="Informasi Resmi & Aktivitas Terbaru"
          subtitle="Pengumuman resmi yayasan dan log aktivitas sistem terkini"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Announcements Feed */}
          <div className="rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm space-y-4 lg:col-span-7 dark:border-slate-800 dark:bg-[#1B2433]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Pengumuman & Agenda Yayasan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Informasi dan edaran resmi terbaru</p>
              </div>
              <AppBadge variant="info">{recentInformation.length} Informasi</AppBadge>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentInformation.map((info) => (
                <div key={info.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">
                      {info.judul}
                    </h4>
                    <span className="shrink-0 text-[10px] font-bold text-slate-400">
                      {info.tanggal}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{info.isi}</p>
                </div>
              ))}
              {!recentInformation.length && (
                <p className="py-8 text-center text-xs text-slate-400 italic">Belum ada pengumuman resmi terbaru.</p>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm space-y-4 lg:col-span-5 dark:border-slate-800 dark:bg-[#1B2433]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Aktivitas Sistem Terbaru</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Log transaksi presensi dan aktivitas</p>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2.5">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{act.title}</p>
                    <p className="text-[10px] text-slate-400">{act.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-extrabold text-[#0E5C44] dark:text-[#3FBF75]">
                    {act.time}
                  </span>
                </div>
              ))}
              {!recentActivities.length && (
                <p className="py-8 text-center text-xs text-slate-400 italic">Belum ada aktivitas terbaru tercatat.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Bar */}
      <section className="rounded-[18px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1B2433]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Akses Cepat Modul Eksekutif</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Navigasi langsung ke modul monitoring spesifik</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AppButton
              variant="secondary"
              size="sm"
              icon={Building2}
              onClick={() => navigate('/dashboard/yayasan/unit-pendidikan')}
            >
              Unit Pendidikan
            </AppButton>
            <AppButton
              variant="secondary"
              size="sm"
              icon={UserCheck}
              onClick={() => navigate('/dashboard/yayasan/pegawai-guru')}
            >
              Pegawai & Guru
            </AppButton>
            <AppButton
              variant="secondary"
              size="sm"
              icon={Users}
              onClick={() => navigate('/dashboard/yayasan/siswa')}
            >
              Data Siswa
            </AppButton>
            <AppButton
              variant="primary"
              size="sm"
              icon={FileSpreadsheet}
              onClick={() => navigate('/dashboard/yayasan/laporan')}
            >
              Laporan Lintas Unit
            </AppButton>
          </div>
        </div>
      </section>

      {/* Modal Quick View KPI (Data PostgreSQL Real) */}
      <ModalErrorBoundary onClose={() => setActiveModal(null)}>
        <KpiQuickViewModal
          type={activeModal}
          isOpen={Boolean(activeModal)}
          onClose={() => setActiveModal(null)}
        />
      </ModalErrorBoundary>

      {/* Canonical Detail Drawer Slide-over */}
      <KpiDetailDrawer
        type={detailDrawer.type}
        id={detailDrawer.id}
        isOpen={detailDrawer.isOpen}
        onClose={() => setDetailDrawer({ isOpen: false, type: null, id: null })}
      />
    </div>
  )
}

export default FoundationDashboardPage
