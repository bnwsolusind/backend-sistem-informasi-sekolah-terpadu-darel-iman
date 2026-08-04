import React, { useState, useEffect, useCallback } from 'react'
import {
  GraduationCap,
  Search,
  Eye,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
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

const CHART_COLORS = ['#0E5C44', '#3B82F6', '#EC4899', '#8B5CF6', '#F59E0B', '#10B981']

export function FoundationStudentsPage() {
  const [students, setStudents] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')
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

  // Fetch Students from DB API
  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const params = {
        search: search || undefined,
        unit_id: selectedUnit !== 'all' ? selectedUnit : undefined,
        gender: selectedGender !== 'all' ? selectedGender : undefined,
        per_page: 100,
      }

      const res = await api.get('/foundation/students', { params })
      const resData = res.data
      let list = []
      if (Array.isArray(resData)) {
        list = resData
      } else if (resData?.data) {
        list = Array.isArray(resData.data) ? resData.data : resData.data.data || []
      }
      setStudents(list)
    } catch (err) {
      console.error('Failed to fetch foundation students:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [search, selectedUnit, selectedGender])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // Client-Side Search Filtering & Pagination
  const filteredStudents = students.filter((st) => {
    const name = (st.full_name || st.nama || '').toString().toLowerCase()
    const nis = (st.nis || st.nisn || '').toString().toLowerCase()
    const unitName = (st.education_unit?.name || st.unit?.name || '').toString().toLowerCase()
    const gender = (st.gender || '').toString()

    const matchesSearch = name.includes(search.toLowerCase()) || nis.includes(search.toLowerCase())
    const matchesUnit = selectedUnit === 'all' || st.unit_id === selectedUnit || unitName.includes(selectedUnit.toLowerCase())
    const matchesGender =
      selectedGender === 'all' ||
      (selectedGender === 'L' && (gender === 'male' || gender === 'L')) ||
      (selectedGender === 'P' && (gender === 'female' || gender === 'P'))

    return matchesSearch && matchesUnit && matchesGender
  })

  const totalItems = filteredStudents.length
  const totalPages = Math.ceil(totalItems / perPage) || 1
  const paginatedStudents = filteredStudents.slice((page - 1) * perPage, page * perPage)

  // KPI Calculations
  const totalStudents = students.length
  const maleCount = students.filter((s) => s.gender === 'male' || s.gender === 'L').length
  const femaleCount = students.filter((s) => s.gender === 'female' || s.gender === 'P').length
  const activeCount = students.filter((s) => s.is_active || s.status === 'aktif').length
  const noRombelCount = students.filter((s) => !s.kelas_id && !s.school_class_id).length

  // Chart Data Preparation
  const unitDistribution = Object.values(
    students.reduce((acc, st) => {
      const uName = st.education_unit?.code || st.education_unit?.name || 'Lainnya'
      if (!acc[uName]) acc[uName] = { name: uName, laki: 0, perempuan: 0 }
      if (st.gender === 'male' || st.gender === 'L') {
        acc[uName].laki += 1
      } else {
        acc[uName].perempuan += 1
      }
      return acc
    }, {})
  )

  const genderPieData = [
    { name: 'Laki-Laki (Siswa)', value: maleCount },
    { name: 'Perempuan (Siswi)', value: femaleCount },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 dark:bg-[#1B2433] md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Mode Monitoring • Akses Read-Only Pengurus Yayasan</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Data Siswa Seluruh Unit</h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pantau seluruh siswa aktif dari semua Unit Pendidikan dan Tahun Ajaran secara terintegrasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStudents}
            disabled={loading}
            className="gap-2 rounded-xl border-slate-200 font-bold dark:border-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <KpiCard label="Total Siswa" value={totalStudents} icon={GraduationCap} color="text-emerald-600" />
        <KpiCard label="Siswa Laki-Laki" value={maleCount} icon={GraduationCap} color="text-blue-600" />
        <KpiCard label="Siswi Perempuan" value={femaleCount} icon={GraduationCap} color="text-rose-600" />
        <KpiCard label="Siswa Aktif" value={activeCount} icon={GraduationCap} color="text-indigo-600" />
        <KpiCard label="Belum Masuk Rombel" value={noRombelCount} icon={GraduationCap} color="text-amber-600" />
      </div>

      {/* 3. RECHARTS VISUAL SUMMARY */}
      {!loading && !error && students.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>Distribusi Siswa Laki-Laki & Perempuan Per Unit</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="laki" name="Laki-Laki" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="perempuan" name="Perempuan" fill="#EC4899" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              <span>Rasio Gender Siswa</span>
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#EC4899" />
                  </Pie>
                  <Tooltip />
                  <Legend tick={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari NIS, NISN, atau nama siswa..."
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

          <select
            value={selectedGender}
            onChange={(e) => { setSelectedGender(e.target.value); setPage(1); }}
            className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          >
            <option value="all">Semua Gender</option>
            <option value="L">Laki-Laki</option>
            <option value="P">Perempuan</option>
          </select>
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
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Data Siswa Tidak Dapat Dimuat</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Terjadi masalah saat mengambil data siswa dari database. Silakan coba kembali.
          </p>
          <Button variant="primary" size="sm" onClick={fetchStudents} className="mt-4 gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          title="Tidak Ada Data Siswa"
          description="Tidak ditemukan peserta didik yang sesuai dengan kriteria pencarian dan filter Anda."
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
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Unit Pendidikan</th>
                  <th className="px-4 py-3">Kelas / Rombel</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedStudents.map((st, idx) => (
                  <tr key={st.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-3.5 py-3 text-center font-bold text-slate-400">{(page - 1) * perPage + idx + 1}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{st.nis || st.nisn || '-'}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{st.full_name || st.nama}</td>
                    <td className="px-4 py-3 font-medium">
                      {st.gender === 'male' || st.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                    </td>
                    <td className="px-4 py-3 font-medium">{st.education_unit?.name || st.unit?.name || '-'}</td>
                    <td className="px-4 py-3 font-medium">{st.kelas?.nama_kelas || st.school_class?.name || 'Belum Ada'}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={st.is_active || st.status === 'aktif' ? 'success' : 'secondary'}>
                        {st.is_active || st.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedStudentId(st.id)}
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

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium px-2">
            <span>
              Menampilkan <span className="font-bold text-slate-800 dark:text-white">{Math.min((page - 1) * perPage + 1, totalItems)}</span> - <span className="font-bold text-slate-800 dark:text-white">{Math.min(page * perPage, totalItems)}</span> dari <span className="font-bold text-slate-800 dark:text-white">{totalItems}</span> Siswa.
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
