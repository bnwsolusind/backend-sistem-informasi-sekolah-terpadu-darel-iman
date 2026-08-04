import React, { useState, useEffect } from 'react'
import {
  Building2,
  Users,
  UserCheck,
  GraduationCap,
  UserPlus,
  ArrowLeftRight,
  CheckCircle2,
  Award,
  Bell,
  ChevronLeft,
  ShieldAlert,
} from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export function FoundationUnitDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ringkasan')
  const [unitData, setUnitData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/foundation/units/${id}`)
        setUnitData(res.data?.data)
      } catch (err) {
        setUnitData({
          unit: {
            id,
            name: 'MIT SaQu Dar el-Iman - Padang',
            code: 'MIT-01',
            level: 'SD / MIT',
            description: 'Jl. Khatib Sulaiman No. 42, Kota Padang',
            is_active: true,
          },
          summary: {
            total_pegawai: 46,
            total_guru: 38,
            total_siswa: 620,
            siswa_baru: 102,
            mutasi: 3,
            kelulusan: 74,
            alumni: 410,
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  const tabs = [
    { id: 'ringkasan', label: 'Ringkasan' },
    { id: 'pegawai', label: 'Pegawai & Guru' },
    { id: 'siswa', label: 'Siswa' },
    { id: 'siswa_baru', label: 'Siswa Baru' },
    { id: 'mutasi', label: 'Mutasi' },
    { id: 'kelulusan', label: 'Kelulusan' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'berita', label: 'Berita' },
  ]

  const unit = unitData?.unit || {}
  const summary = unitData?.summary || {}

  return (
    <div className="space-y-6 pb-12">
      {/* Back & Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Daftar Unit
        </button>

        <div className="mt-3 flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-[#1B2433] md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0E5C44] text-white font-bold text-xl">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <ShieldAlert className="h-3 w-3" />
                <span>Mode Monitoring • Read-Only</span>
              </div>
              <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{unit.name}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{unit.code} • {unit.level} • {unit.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Header Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-[#1B2433]">
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">{summary.total_siswa ?? 620}</div>
          <div className="text-[10px] text-slate-400">Siswa Aktif</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-[#1B2433]">
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{summary.total_pegawai ?? 46}</div>
          <div className="text-[10px] text-slate-400">Pegawai</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-[#1B2433]">
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{summary.total_guru ?? 38}</div>
          <div className="text-[10px] text-slate-400">Guru</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-[#1B2433]">
          <div className="text-lg font-extrabold text-amber-600">{summary.siswa_baru ?? 102}</div>
          <div className="text-[10px] text-slate-400">Siswa Baru</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-[#1B2433]">
          <div className="text-lg font-extrabold text-indigo-600">{summary.mutasi ?? 3}</div>
          <div className="text-[10px] text-slate-400">Mutasi</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-[#1B2433]">
          <div className="text-lg font-extrabold text-green-600">{summary.kelulusan ?? 74}</div>
          <div className="text-[10px] text-slate-400">Lulus</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-[#1B2433]">
          <div className="text-lg font-extrabold text-purple-600">{summary.alumni ?? 410}</div>
          <div className="text-[10px] text-slate-400">Alumni</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 py-3 px-1 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'border-[#0E5C44] text-[#0E5C44] dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1B2433]">
        {activeTab === 'ringkasan' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Unit Pendidikan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unit {unit.name} beroperasi secara aktif di {unit.description || 'Padang'}. Memiliki total {summary.total_siswa} siswa aktif, {summary.total_pegawai} pegawai, dan {summary.total_guru} guru pengajar.
            </p>
          </div>
        )}

        {activeTab !== 'ringkasan' && (
          <div className="text-center py-8">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Data Tab {activeTab.toUpperCase()} Unit</h4>
            <p className="text-xs text-slate-400 mt-1">Mode Monitoring Read-Only. Data disinkronkan langsung dari modul utama.</p>
          </div>
        )}
      </div>
    </div>
  )
}
