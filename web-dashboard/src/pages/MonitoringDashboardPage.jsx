import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, Users, UserRoundCheck, Clock3, UserX } from 'lucide-react'
import { api } from '../services/api'
import TeacherMonitoringPanel from '../components/attendance/TeacherMonitoringPanel'
import { useAuthStore } from '../stores/authStore'

const cards = [
  { key: 'total_siswa', label: 'Total Siswa', icon: Users },
  { key: 'total_guru', label: 'Total Guru', icon: UserRoundCheck },
  { key: 'kehadiran_hari_ini', label: 'Kehadiran Hari Ini', icon: Clock3 },
  { key: 'statistik_ketidakhadiran', label: 'Tidak Hadir', icon: UserX },
]

export default function MonitoringDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [teacherMonitoring, setTeacherMonitoring] = useState(null)
  const [teacherMonitoringError, setTeacherMonitoringError] = useState('')
  const [teacherMonitoringLoading, setTeacherMonitoringLoading] = useState(true)
  const canLoadSummary = useAuthStore((state) => state.user?.permissions?.includes('dashboard.pemantauan.lihat'))

  const loadDashboard = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/dashboard-pemantauan/ringkasan')
      setDashboard(response.data?.data ?? null)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Data dashboard tidak dapat dimuat.')
    } finally {
      setLoading(false)
    }
  }

  const loadTeacherMonitoring = async () => {
    setTeacherMonitoringLoading(true)
    setTeacherMonitoringError('')
    try {
      const response = await api.get('/teacher-monitoring')
      setTeacherMonitoring(response.data?.data ?? null)
    } catch (requestError) {
      if (requestError.response?.status !== 403) {
        setTeacherMonitoringError(requestError.response?.data?.message || 'Monitoring guru belum dapat dimuat.')
      }
    } finally {
      setTeacherMonitoringLoading(false)
    }
  }

  useEffect(() => {
    if (canLoadSummary) loadDashboard()
    else setLoading(false)
    loadTeacherMonitoring()
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'hidden') loadTeacherMonitoring()
    }, 20000)
    return () => window.clearInterval(timer)
  }, [canLoadSummary])

  if (loading) {
    return <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <div key={card.key} className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />)}</div>
  }

  if (error && !teacherMonitoring && !teacherMonitoringLoading) {
    return <section className="m-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900 dark:bg-rose-950/30"><AlertTriangle className="mx-auto h-6 w-6 text-rose-600" /><p className="mt-3 text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</p><button type="button" onClick={loadDashboard} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0E5C44] px-4 py-2 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" />Coba Lagi</button></section>
  }

  const statistics = dashboard?.kartu_statistik || {}
  const alerts = (dashboard?.indikator_kinerja_utama || []).slice(0, 5)

  return <main className="space-y-6 p-4 sm:p-6"><header><p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Dashboard Pemantauan</p><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ringkasan operasional</h1></header>{!error && <><section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ key, label, icon: Icon }) => <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><Icon className="h-5 w-5 text-emerald-600" /><p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{Number(statistics[key] || 0).toLocaleString('id-ID')}</p><p className="text-sm text-slate-500">{label}</p></article>)}</section><section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">Indikator perlu perhatian</h2>{alerts.length ? <ul className="mt-4 space-y-3">{alerts.map((item) => <li key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{item.nama_indikator || item.nama || 'Indikator kinerja'}</li>)}</ul> : <p className="mt-4 text-sm text-slate-500">Belum ada indikator kinerja pada periode ini.</p>}</section></>}<TeacherMonitoringPanel data={teacherMonitoring} loading={teacherMonitoringLoading} error={teacherMonitoringError} onRetry={loadTeacherMonitoring} /></main>
}
