import React, { useState, useEffect, useCallback } from 'react'
import {
  FileText,
  Search,
  Eye,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  LayoutGrid,
  List,
  Calendar,
  User,
  Megaphone,
} from 'lucide-react'
import api from '../../services/api'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { EmptyState } from '../../components/ui/empty-state'
import { Modal } from '../../components/ui/modal'

export function FoundationInformationPage() {
  const [information, setInformation] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  // Tabs & Filters
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'pengumuman' | 'berita' | 'agenda'
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 12

  // Selected Detail Modal State
  const [selectedInfo, setSelectedInfo] = useState(null)

  // Fetch Information from DB API
  const fetchInformation = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const params = {
        search: search || undefined,
        per_page: 100,
      }

      const res = await api.get('/foundation/information', { params })
      const resData = res.data
      let list = []
      if (Array.isArray(resData)) {
        list = resData
      } else if (resData?.data) {
        list = Array.isArray(resData.data) ? resData.data : resData.data.data || []
      }
      setInformation(list)
    } catch (err) {
      console.error('Failed to fetch foundation information:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchInformation()
  }, [fetchInformation])

  // Filtered List
  const filteredInfo = information.filter((info) => {
    const title = (info.judul_pengumuman || info.judul || info.title || '').toString().toLowerCase()
    const content = (info.isi_pengumuman || info.content || '').toString().toLowerCase()
    const type = (info.kategori || info.jenis || 'pengumuman').toString().toLowerCase()

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pengumuman' && type.includes('pengumuman')) ||
      (activeTab === 'berita' && type.includes('berita')) ||
      (activeTab === 'agenda' && type.includes('agenda'))

    const matchesSearch = title.includes(search.toLowerCase()) || content.includes(search.toLowerCase())

    return matchesTab && matchesSearch
  })

  const totalItems = filteredInfo.length
  const totalPages = Math.ceil(totalItems / perPage) || 1
  const paginatedInfo = filteredInfo.slice((page - 1) * perPage, page * perPage)

  // KPI Calculations
  const totalCount = information.length
  const pengumumanCount = information.filter((i) => (i.kategori || i.jenis || 'pengumuman').toLowerCase().includes('pengumuman')).length
  const beritaCount = information.filter((i) => (i.kategori || i.jenis || '').toLowerCase().includes('berita')).length
  const agendaCount = information.filter((i) => (i.kategori || i.jenis || '').toLowerCase().includes('agenda')).length

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 dark:bg-[#1B2433] md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Mode Monitoring • Akses Read-Only Pengurus Yayasan</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Informasi Sekolah</h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Lihat berita, pengumuman, agenda, dan informasi resmi dari seluruh Unit Pendidikan Dar el-Iman.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInformation}
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
        <KpiCard label="Total Informasi" value={totalCount} icon={FileText} color="text-emerald-600" />
        <KpiCard label="Pengumuman" value={pengumumanCount} icon={Megaphone} color="text-blue-600" />
        <KpiCard label="Berita Terbit" value={beritaCount} icon={FileText} color="text-purple-600" />
        <KpiCard label="Agenda Mendatang" value={agendaCount} icon={Calendar} color="text-amber-600" />
      </div>

      {/* 3. TABS & SEARCH & VIEW MODE CONTROLS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => { setActiveTab('all'); setPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'all' ? 'bg-[#0E5C44] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            Semua ({totalCount})
          </button>
          <button
            onClick={() => { setActiveTab('pengumuman'); setPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'pengumuman' ? 'bg-[#0E5C44] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            Pengumuman ({pengumumanCount})
          </button>
          <button
            onClick={() => { setActiveTab('berita'); setPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'berita' ? 'bg-[#0E5C44] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            Berita ({beritaCount})
          </button>
          <button
            onClick={() => { setActiveTab('agenda'); setPage(1); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${activeTab === 'agenda' ? 'bg-[#0E5C44] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            Agenda ({agendaCount})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 dark:bg-[#1B2433] dark:border-slate-800 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari judul atau isi pengumuman/berita..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 p-1 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-[#0E5C44] text-white font-bold' : 'text-slate-500'}`}
                title="Tampilan Grid Card"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`rounded-lg p-1.5 transition ${viewMode === 'table' ? 'bg-[#0E5C44] text-white font-bold' : 'text-slate-500'}`}
                title="Tampilan Tabel"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CONTENT VIEW */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20">
          <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Informasi Sekolah Tidak Dapat Dimuat</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Terjadi masalah saat mengambil informasi dari database server. Silakan coba kembali.
          </p>
          <Button variant="primary" size="sm" onClick={fetchInformation} className="mt-4 gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Coba Lagi</span>
          </Button>
        </div>
      ) : filteredInfo.length === 0 ? (
        <EmptyState
          title="Belum Ada Informasi"
          description="Tidak ditemukan pengumuman atau berita yang sesuai dengan kata kunci pencarian Anda."
        />
      ) : viewMode === 'grid' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedInfo.map((info, idx) => {
              const title = info.judul_pengumuman || info.judul || info.title || 'Informasi Resmi'
              const content = info.isi_pengumuman || info.content || 'Konten informasi sekolah.'
              const category = info.kategori || info.jenis || 'Pengumuman'
              const dateStr = info.created_at ? new Date(info.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Terbaru'

              return (
                <div
                  key={info.id || idx}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-[#1B2433] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="emerald">{category}</Badge>
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {dateStr}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">{title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{content}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {info.penulis || 'Humas Yayasan'}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedInfo(info)}
                      className="gap-1.5 rounded-xl border-emerald-600/60 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 font-bold text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Baca Detail</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium px-2 pt-2">
            <span>
              Menampilkan <span className="font-bold text-slate-800 dark:text-white">{Math.min((page - 1) * perPage + 1, totalItems)}</span> - <span className="font-bold text-slate-800 dark:text-white">{Math.min(page * perPage, totalItems)}</span> dari <span className="font-bold text-slate-800 dark:text-white">{totalItems}</span> Informasi.
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
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#1B2433] shadow-xs">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-200">
              <thead className="bg-slate-100/80 dark:bg-[#1b302c] text-slate-600 dark:text-slate-300 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3.5 py-3 text-center w-12">No</th>
                  <th className="px-4 py-3">Judul Informasi</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Penulis</th>
                  <th className="px-4 py-3">Tanggal Publikasi</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedInfo.map((info, idx) => (
                  <tr key={info.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-3.5 py-3 text-center font-bold text-slate-400">{(page - 1) * perPage + idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {info.judul_pengumuman || info.judul || info.title}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <Badge variant="emerald">{info.kategori || info.jenis || 'Pengumuman'}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{info.penulis || 'Humas Yayasan'}</td>
                    <td className="px-4 py-3 font-medium">
                      {info.created_at ? new Date(info.created_at).toLocaleDateString('id-ID') : 'Terbaru'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="success">Terbit</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedInfo(info)}
                        className="gap-1.5 rounded-xl border-emerald-600/60 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 font-bold px-2.5 py-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Baca Detail</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* READ-ONLY READ DETAIL MODAL */}
      {selectedInfo && (
        <Modal
          isOpen={Boolean(selectedInfo)}
          onClose={() => setSelectedInfo(null)}
          maxWidth="max-w-2xl"
          title={
            <div className="flex items-center gap-2">
              <Badge variant="emerald">{selectedInfo.kategori || selectedInfo.jenis || 'Pengumuman'}</Badge>
              <span className="text-xs text-slate-400 font-medium">
                {selectedInfo.created_at ? new Date(selectedInfo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Terbaru'}
              </span>
            </div>
          }
          footer={
            <div className="flex justify-end w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedInfo(null)}
                className="rounded-xl px-6 font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Tutup
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-200">
            <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
              {selectedInfo.judul_pengumuman || selectedInfo.judul || selectedInfo.title}
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>Penulis: <strong className="text-slate-700 dark:text-slate-200">{selectedInfo.penulis || 'Humas Yayasan'}</strong></span>
              <span>•</span>
              <span>Status: <Badge variant="success">Terbit Resmi</Badge></span>
            </div>
            <div className="prose dark:prose-invert max-w-none leading-relaxed space-y-3 whitespace-pre-wrap">
              {selectedInfo.isi_pengumuman || selectedInfo.content || 'Konten pengumuman sekolah.'}
            </div>
          </div>
        </Modal>
      )}
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
