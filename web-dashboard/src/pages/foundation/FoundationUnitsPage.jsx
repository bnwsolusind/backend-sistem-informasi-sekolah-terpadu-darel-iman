import React, { useState, useEffect, useCallback } from 'react'
import {
  Building2,
  Search,
  Eye,
  ShieldAlert,
  LayoutGrid,
  List,
  RefreshCw,
  AlertCircle,
  Users,
  UserCheck,
  GraduationCap,
  School,
  TrendingUp,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import api from '../../services/api'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { EmptyState } from '../../components/ui/empty-state'
import KpiDetailDrawer from '../../components/KpiDetailDrawer'

const CHART_COLORS = ['#0E5C44', '#1E8E5A', '#3FBF75', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B']

export function FoundationUnitsPage() {
  const [viewMode, setViewMode] = useState('table')
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Selected Detail Modal
  const [selectedUnitId, setSelectedUnitId] = useState(null)

  const fetchUnits = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get('/foundation/units')
      const rawData = res.data?.data || res.data || []
      setUnits(Array.isArray(rawData) ? rawData : [])
    } catch (err) {
      console.error('Failed to fetch foundation units:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  // Filtered List
  const filteredUnits = units.filter((u) => {
    const name = (u.name || u.nama || '').toString().toLowerCase()
    const code = (u.code || u.kode || '').toString().toLowerCase()
    const level = (u.jenis_unit || u.level || '').toString().toLowerCase()

    const matchesSearch = name.includes(search.toLowerCase()) || code.includes(search.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || level.includes(selectedLevel.toLowerCase())
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'aktif' && (u.is_active || u.status === 'aktif')) ||
      (selectedStatus === 'nonaktif' && (!u.is_active && u.status !== 'aktif'))

    return matchesSearch && matchesLevel && matchesStatus
  })

  // KPI Calculations
  const totalUnits = units.length
  const activeUnits = units.filter((u) => u.is_active || u.status === 'aktif').length
  const inactiveUnits = totalUnits - activeUnits
  const totalGuru = units.reduce((acc, u) => acc + Number(u.guru_count || 0), 0)
  const totalPegawai = units.reduce((acc, u) => acc + Number(u.pegawai_count || 0), 0)
  const totalSiswa = units.reduce((acc, u) => acc + Number(u.siswa_aktif_count || 0), 0)
  const totalKelas = units.reduce((acc, u) => acc + Number(u.kelas_count || 0), 0)
  const totalRombel = units.reduce((acc, u) => acc + Number(u.rombel_count || 0), 0)

  // Chart Data Preparation
  const chartSiswaData = units.map((u) => ({
    name: u.code || u.name,
    siswa: Number(u.siswa_aktif_count || 0),
    guru: Number(u.guru_count || 0),
    pegawai: Number(u.pegawai_count || 0),
  }))

  const levelDistribution = Object.values(
    units.reduce((acc, u) => {
      const lvl = u.jenis_unit || u.level || 'Lainnya'
      if (!acc[lvl]) acc[lvl] = { name: lvl, value: 0 }
      acc[lvl].value += 1
      return acc
    }, {})
  )

  return (
    <div className="space-y-6 pb-12">
      {/* 1. BREADCRUMB & HEADER BANNER */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 dark:bg-[#1B2433] md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Mode Monitoring • Akses Read-Only Pengurus Yayasan</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Unit Pendidikan</h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pantau seluruh Unit Pendidikan, pimpinan, jumlah guru, pegawai, siswa, kelas, dan rombel secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUnits}
            disabled={loading}
            className="gap-2 rounded-xl border-slate-200 font-bold dark:border-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard label="Total Unit" value={totalUnits} icon={Building2} color="text-emerald-600" />
        <KpiCard label="Unit Aktif" value={activeUnits} icon={Building2} color="text-blue-600" />
        <KpiCard label="Unit Nonaktif" value={inactiveUnits} icon={Building2} color="text-rose-600" />
        <KpiCard label="Total Guru" value={totalGuru} icon={UserCheck} color="text-purple-600" />
        <KpiCard label="Total Pegawai" value={totalPegawai} icon={Users} color="text-indigo-600" />
        <KpiCard label="Total Siswa" value={totalSiswa} icon={GraduationCap} color="text-amber-600" />
        <KpiCard label="Total Kelas" value={totalKelas} icon={School} color="text-teal-600" />
        <KpiCard label="Total Rombel" value={totalRombel} icon={School} color="text-cyan-600" />
      </div>

      {/* 3. RECHARTS VISUAL SUMMARY */}
      {!loading && !error && units.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Distribusi Siswa & SDM Per Unit</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartSiswaData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="siswa" name="Siswa" fill="#0E5C44" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="guru" name="Guru" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pegawai" name="Pegawai" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              <span>Proporsi Jenjang Unit</span>
            </h3>
            <div className="h-64 min-h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {levelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode unit, nama unit, atau jenis..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          >
            <option value="all">Semua Jenjang</option>
            <option value="TK">TK / PAUD</option>
            <option value="SD">SD / MIT</option>
            <option value="SMP">SMP / SMPIT</option>
            <option value="SMA">SMA / SMAIT</option>
            <option value="PONPES">Ponpes / Ma'had</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>

          <div className="flex rounded-xl border border-slate-200 p-1 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-lg p-1.5 transition ${viewMode === 'table' ? 'bg-[#0E5C44] text-white font-bold' : 'text-slate-500'}`}
              title="Tampilan Tabel"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-[#0E5C44] text-white font-bold' : 'text-slate-500'}`}
              title="Tampilan Grid Card"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. TABLE / GRID CONTENT READ-ONLY VIEW */}
      {loading ? (
        <div className="space-y-3 p-4 bg-white dark:bg-[#1B2433] rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <Skeleton className="h-10 w-full rounded-xl" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20">
          <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Data Unit Pendidikan Tidak Dapat Dimuat</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Terjadi masalah saat mengambil data dari database server. Silakan coba kembali.
          </p>
          <Button variant="primary" size="sm" onClick={fetchUnits} className="mt-4 gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      ) : filteredUnits.length === 0 ? (
        <EmptyState
          title="Tidak Ada Unit Pendidikan"
          description="Tidak ditemukan data unit pendidikan yang cocok dengan filter pencarian Anda."
        />
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1B2433] shadow-xs">
          <table className="w-full text-xs text-left text-slate-700 dark:text-slate-200">
            <thead className="bg-slate-100/80 dark:bg-[#1b302c] text-slate-600 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-3.5 py-3 text-center w-12">No</th>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama Unit Pendidikan</th>
                <th className="px-4 py-3">Jenis Unit</th>
                <th className="px-4 py-3">Kepala Sekolah</th>
                <th className="px-4 py-3 text-center">Guru</th>
                <th className="px-4 py-3 text-center">Pegawai</th>
                <th className="px-4 py-3 text-center">Siswa</th>
                <th className="px-4 py-3 text-center">Kelas</th>
                <th className="px-4 py-3 text-center">Rombel</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUnits.map((u, idx) => (
                <tr key={u.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="px-3.5 py-3 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{u.code || u.kode || '-'}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{u.name || u.nama}</td>
                  <td className="px-4 py-3 font-medium">{u.jenis_unit || u.level || '-'}</td>
                  <td className="px-4 py-3 font-medium">{u.kepala_sekolah || 'Belum Ditentukan'}</td>
                  <td className="px-4 py-3 text-center font-bold">{u.guru_count || 0}</td>
                  <td className="px-4 py-3 text-center font-bold">{u.pegawai_count || 0}</td>
                  <td className="px-4 py-3 text-center font-bold">{u.siswa_aktif_count || 0}</td>
                  <td className="px-4 py-3 text-center font-medium">{u.kelas_count || 0}</td>
                  <td className="px-4 py-3 text-center font-medium">{u.rombel_count || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={u.is_active || u.status === 'aktif' ? 'success' : 'secondary'}>
                      {u.is_active || u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUnitId(u.id)}
                      className="gap-1.5 rounded-xl border-emerald-600/60 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 font-bold px-2.5 py-1 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Lihat Detail</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUnits.map((u, idx) => (
            <div
              key={u.id || idx}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-[#1B2433] space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950 dark:text-emerald-300">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{u.name || u.nama}</h3>
                    <span className="text-xs font-semibold text-slate-400">{u.code || u.kode} • {u.jenis_unit || u.level}</span>
                  </div>
                </div>
                <Badge variant={u.is_active || u.status === 'aktif' ? 'success' : 'secondary'}>
                  {u.is_active || u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Guru</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white">{u.guru_count || 0}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pegawai</span>
                  <p className="text-sm font-black text-slate-800 dark:text-white">{u.pegawai_count || 0}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Siswa</span>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{u.siswa_aktif_count || 0}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-medium">Kepsek: {u.kepala_sekolah || 'Belum Ditentukan'}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedUnitId(u.id)}
                  className="gap-1.5 rounded-xl border-emerald-600/60 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 font-bold text-xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Lihat Detail</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* READ-ONLY DETAIL MODAL / DRAWER */}
      <KpiDetailDrawer
        type="unit_pendidikan"
        id={selectedUnitId}
        isOpen={Boolean(selectedUnitId)}
        onClose={() => setSelectedUnitId(null)}
      />
    </div>
  )
}

function KpiCard({ label, value, icon: IconComponent, color }) {
  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1B2433] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
        <span>{label}</span>
        {IconComponent && <IconComponent className={`h-3.5 w-3.5 ${color}`} />}
      </div>
      <div className={`text-lg sm:text-xl font-black ${color} dark:text-white`}>
        {Number(value || 0).toLocaleString('id-ID')}
      </div>
    </div>
  )
}
