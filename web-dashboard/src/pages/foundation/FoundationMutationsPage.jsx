import React, { useState, useEffect, useCallback } from 'react'
import {
  GraduationCap,
  Search,
  Eye,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  ArrowRightLeft,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import api from '../../services/api'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { EmptyState } from '../../components/ui/empty-state'
import KpiDetailDrawer from '../../components/KpiDetailDrawer'

export function FoundationMutationsPage() {
  const [mutations, setMutations] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'masuk' | 'antarunit' | 'keluar'
  const [search, setSearch] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 15

  // Selected Detail Modal
  const [selectedStudentId, setSelectedStudentId] = useState(null)

  // Fetch Units
  useEffect(() => {
    api.get('/foundation/units')
      .then((res) => {
        const raw = res.data?.data || res.data || []
        setUnits(Array.isArray(raw) ? raw : [])
      })
      .catch(() => {})
  }, [])

  // Fetch Mutations from DB API
  const fetchMutations = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const params = {
        search: search || undefined,
        unit_id: selectedUnit !== 'all' ? selectedUnit : undefined,
        type: activeTab !== 'all' ? activeTab : undefined,
        per_page: 100,
      }

      const res = await api.get('/foundation/student-mutations', { params })
      const resData = res.data
      let list = []
      if (Array.isArray(resData)) {
        list = resData
      } else if (resData?.data) {
        list = Array.isArray(resData.data) ? resData.data : resData.data.data || []
      }
      setMutations(list)
    } catch (err) {
      console.error('Failed to fetch foundation mutations:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [search, selectedUnit, activeTab])

  useEffect(() => {
    fetchMutations()
  }, [fetchMutations])

  // Filtered List
  const filteredMutations = mutations.filter((m) => {
    const name = (m.full_name || m.nama || '').toString().toLowerCase()
    const nis = (m.nis || m.nisn || '').toString().toLowerCase()
    const unitName = (m.education_unit?.name || m.unit?.name || '').toString().toLowerCase()
    const mutasiType = (m.metadata?.mutasi_type || m.mutasi_type || '').toString().toLowerCase()

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'masuk' && mutasiType.includes('masuk')) ||
      (activeTab === 'antarunit' && mutasiType.includes('antar')) ||
      (activeTab === 'keluar' && mutasiType.includes('keluar'))

    const matchesSearch = name.includes(search.toLowerCase()) || nis.includes(search.toLowerCase())
    const matchesUnit = selectedUnit === 'all' || m.unit_id === selectedUnit || unitName.includes(selectedUnit.toLowerCase())

    return matchesTab && matchesSearch && matchesUnit
  })

  const totalItems = filteredMutations.length
  const totalPages = Math.ceil(totalItems / perPage) || 1
  const paginatedMutations = filteredMutations.slice((page - 1) * perPage, page * perPage)

  // KPI Calculations
  const totalMutasi = mutations.length
  const pindahMasuk = mutations.filter((m) => (m.metadata?.mutasi_type || '').includes('masuk')).length
  const pindahAntarunit = mutations.filter((m) => (m.metadata?.mutasi_type || '').includes('antar')).length
  const pindahKeluar = mutations.filter((m) => (m.metadata?.mutasi_type || '').includes('keluar')).length

  // Chart Data
  const unitDistribution = Object.values(
    mutations.reduce((acc, m) => {
      const uName = m.education_unit?.code || m.education_unit?.name || 'Lainnya'
      if (!acc[uName]) acc[uName] = { name: uName, mutasi: 0 }
      acc[uName].mutasi += 1
      return acc
    }, {})
  )

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 dark:bg-[#1B2433] md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Mode Monitoring • Akses Read-Only Pengurus Yayasan</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Mutasi Siswa</h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pantau siswa pindah masuk, pindah antarunit, dan pindah keluar dari seluruh Unit Pendidikan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMutations}
            disabled={loading}
            className="gap-2 rounded-xl border-slate-200 font-bold dark:border-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Total Mutasi" value={totalMutasi} icon={ArrowRightLeft} color="text-emerald-600" />
        <KpiCard label="Pindah Masuk" value={pindahMasuk} icon={ArrowRightLeft} color="text-blue-600" />
        <KpiCard label="Pindah Antarunit" value={pindahAntarunit} icon={ArrowRightLeft} color="text-purple-600" />
        <KpiCard label="Pindah Keluar" value={pindahKeluar} icon={ArrowRightLeft} color="text-rose-600" />
      </div>

      {/* 3. RECHARTS VISUAL SUMMARY */}
      {!loading && !error && mutations.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span>Distribusi Mutasi Siswa Per Unit</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="mutasi" name="Total Mutasi" fill="#0E5C44" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. TABS & SEARCH & FILTERS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('all'); setPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${activeTab === 'all' ? 'bg-[#0E5C44] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            Semua Mutasi ({totalMutasi})
          </button>
          <button
            onClick={() => { setActiveTab('masuk'); setPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${activeTab === 'masuk' ? 'bg-[#0E5C44] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            Pindah Masuk ({pindahMasuk})
          </button>
          <button
            onClick={() => { setActiveTab('antarunit'); setPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${activeTab === 'antarunit' ? 'bg-[#0E5C44] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            Pindah Antarunit ({pindahAntarunit})
          </button>
          <button
            onClick={() => { setActiveTab('keluar'); setPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${activeTab === 'keluar' ? 'bg-[#0E5C44] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            Pindah Keluar ({pindahKeluar})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari nama siswa, NIS, atau keterangan mutasi..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2">
            {units.length > 0 && (
              <select
                value={selectedUnit}
                onChange={(e) => { setSelectedUnit(e.target.value); setPage(1); }}
                className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
              >
                <option value="all">Semua Unit Pendidikan</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.code}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* 5. CONTENT TABLE READ-ONLY VIEW */}
      {loading ? (
        <div className="space-y-3 p-4 bg-white dark:bg-[#1B2433] rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <Skeleton className="h-10 w-full rounded-xl" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20">
          <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Data Mutasi Siswa Tidak Dapat Dimuat</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Terjadi masalah saat mengambil data dari database server. Silakan coba kembali.
          </p>
          <Button variant="primary" size="sm" onClick={fetchMutations} className="mt-4 gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      ) : filteredMutations.length === 0 ? (
        <EmptyState
          title="Tidak Ada Data Mutasi"
          description="Tidak ditemukan data mutasi siswa yang sesuai dengan kriteria pencarian dan filter Anda."
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1B2433] shadow-xs">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-200">
              <thead className="bg-slate-100/80 dark:bg-[#1b302c] text-slate-600 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3.5 py-3 text-center w-12">No</th>
                  <th className="px-4 py-3">NIS / NISN</th>
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-4 py-3">Jenis Mutasi</th>
                  <th className="px-4 py-3">Unit Sekolah</th>
                  <th className="px-4 py-3">Tanggal Pengajuan</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedMutations.map((m, idx) => {
                  const mType = m.metadata?.mutasi_type || m.mutasi_type || 'Mutasi'
                  return (
                    <tr key={m.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="px-3.5 py-3 text-center font-bold text-slate-400">{(page - 1) * perPage + idx + 1}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{m.nis || m.nisn || '-'}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{m.full_name || m.nama}</td>
                      <td className="px-4 py-3 font-medium">
                        <Badge variant={mType.includes('masuk') ? 'success' : mType.includes('antar') ? 'purple' : 'secondary'}>
                          {mType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium">{m.education_unit?.name || m.unit?.name || '-'}</td>
                      <td className="px-4 py-3 font-medium">{m.updated_at ? new Date(m.updated_at).toLocaleDateString('id-ID') : 'Terbaru'}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="success">Selesai</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedStudentId(m.id)}
                          className="gap-1.5 rounded-xl border-emerald-600/60 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 font-bold px-2.5 py-1 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Lihat Detail</span>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium px-2">
            <span>
              Menampilkan <span className="font-bold text-slate-800 dark:text-white">{Math.min((page - 1) * perPage + 1, totalItems)}</span> - <span className="font-bold text-slate-800 dark:text-white">{Math.min(page * perPage, totalItems)}</span> dari <span className="font-bold text-slate-800 dark:text-white">{totalItems}</span> Data Mutasi.
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border-slate-200 dark:border-slate-700 font-bold"
              >
                Sebelumnya
              </Button>
              <span className="font-bold text-slate-800 dark:text-white px-2">
                Halaman {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-xl border-slate-200 dark:border-slate-700 font-bold"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* READ-ONLY DETAIL MODAL / DRAWER */}
      <KpiDetailDrawer
        type="siswa"
        id={selectedStudentId}
        isOpen={Boolean(selectedStudentId)}
        onClose={() => setSelectedStudentId(null)}
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
