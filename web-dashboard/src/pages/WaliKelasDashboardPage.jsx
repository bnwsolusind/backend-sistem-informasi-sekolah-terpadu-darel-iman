import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  FileCheck,
  Award,
  BookOpen,
  Send,
  Eye,
  PhoneCall
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardFilter from '../components/dashboard/DashboardFilter'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import ChartCard from '../components/dashboard/ChartCard'
import DataTableCard from '../components/dashboard/DataTableCard'
import QuickActionCard from '../components/dashboard/QuickActionCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'
import DetailModal from '../components/dashboard/DetailModal'

import { waliKelasDashboardService } from '../services/waliKelasDashboardService'

const COLORS = ['#0E5C44', '#F59E0B', '#3B82F6', '#EC4899', '#EF4444']

export default function WaliKelasDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [selectedClassId, setSelectedClassId] = useState('')
  const [activeModal, setActiveModal] = useState(null)

  const fetchDashboard = async (classId = selectedClassId) => {
    setLoading(true)
    setError(null)
    try {
      const res = await waliKelasDashboardService.getOverview({ class_id: classId })
      if (res && res.data) {
        setData(res.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Wali Kelas dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Wali Kelas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleClassChange = (classId) => {
    setSelectedClassId(classId)
    fetchDashboard(classId)
  }

  if (loading) return <SkeletonDashboard />
  if (error) return <ErrorState message={error} onRetry={() => fetchDashboard(selectedClassId)} />

  const kpis = data?.kpis || {}
  const context = data?.context || {}
  const charts = data?.charts || {}
  const tables = data?.tables || {}
  const rombelOptions = context.rombel_options || []

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  const quickActions = [
    {
      label: 'Presensi Rombel',
      icon: CheckCircle2,
       onClick: () => navigate('/absensi/dashboard-wali-kelas'),
      permissions: ['homeroom_attendance.dashboard']
    },
    {
      label: 'Input Catatan Wali',
      icon: FileText,
       onClick: () => navigate('/absensi/dashboard-wali-kelas'),
      permissions: ['homeroom_attendance.follow_up']
    },
    {
      label: 'Rekap Presensi',
      icon: FileCheck,
       onClick: () => navigate('/absensi/rekap-kehadiran'),
      permissions: ['homeroom_attendance.export']
    },
    {
      label: 'Rekap Tahfizh',
      icon: BookOpen,
        onClick: () => navigate('/portal-guru/workspace?tab=tahfizh'),
      permissions: ['tahfizh.monitoring_target']
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title={`Dashboard Wali Kelas - ${context.rombel?.nama || 'Rombel'}`}
        subtitle="Monitoring presensi, akademik, tahfizh, mutabaah, dan catatan siswa rombel binaan"
        roleName="Wali Kelas"
        unitName={context.rombel?.nama}
        academicYear={context.tahun_ajaran?.nama}
        semester={context.semester?.nama}
      />

      <DashboardFilter
        extraFilters={
          rombelOptions.length > 1 && (
            <select
              value={selectedClassId || context.rombel?.id || ''}
              onChange={(e) => handleClassChange(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-medium text-slate-700 outline-hidden focus:border-[#0E5C44] focus:ring-1 focus:ring-[#0E5C44] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            >
              {rombelOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama_kelas}
                </option>
              ))}
            </select>
          )
        }
        onReset={() => handleClassChange('')}
      />

      {/* Primary KPI Grid */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Total Siswa Rombel"
          value={formatNumber(kpis.total_siswa_rombel?.total)}
          icon={Users}
          onClick={() => setActiveModal('total_siswa_rombel')}
        />
        <KpiCard
          title="Hadir Hari Ini"
          value={formatNumber(kpis.siswa_hadir_hari_ini?.total)}
          icon={CheckCircle2}
        />
        <KpiCard
          title="Terlambat Hari Ini"
          value={formatNumber(kpis.siswa_terlambat?.total)}
          icon={Clock}
        />
        <KpiCard
          title="Permohonan Izin / Sakit"
          value={formatNumber(kpis.pending_permissions?.total)}
          icon={FileText}
          onClick={() => setActiveModal('pending_permissions')}
        />
      </KpiCardGrid>

      {/* Secondary KPI Grid */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Catatan Siswa Aktif"
          value={formatNumber(kpis.active_student_notes?.total)}
          icon={AlertTriangle}
          onClick={() => setActiveModal('active_student_notes')}
        />
        <KpiCard
          title="Tindak Lanjut Catatan"
          value={formatNumber(kpis.followup_notes?.total)}
          icon={FileCheck}
        />
        <KpiCard
          title="Mutabaah Belum TTD Ortu"
          value={formatNumber(kpis.unsigned_parent_notes?.total)}
          icon={Award}
        />
        <KpiCard
          title="Izin Perlu Verifikasi"
          value={formatNumber(kpis.pending_permissions?.total)}
          icon={CheckCircle2}
        />
      </KpiCardGrid>

      <QuickActionCard title="Aksi Cepat Wali Kelas" actions={quickActions} />

      {/* Attendance Distribution Chart & Students Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Distribusi Presensi Siswa Rombel Hari Ini"
          subtitle="Persentase kehadiran per kategori"
          empty={!charts.attendance_distribution || charts.attendance_distribution.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.attendance_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="status"
                >
                  {(charts.attendance_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="lg:col-span-2">
          <DataTableCard
            title="Daftar Siswa Rombel"
            subtitle="Ringkasan identitas dan status siswa binaan"
            headers={['No', 'Nama Siswa', 'NISN', 'Jenis Kelamin', 'Status']}
            rows={(tables.students || []).map((st, idx) => [
              idx + 1,
              <span key="name" className="font-semibold text-slate-900 dark:text-white">{st.full_name}</span>,
              st.nisn || '-',
              st.gender === 'male' || st.gender === 'L' ? 'Laki-laki' : 'Perempuan',
              <span key="status" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {st.is_active ? 'Aktif' : 'Non-aktif'}
              </span>
            ])}
            emptyMessage="Belum ada siswa terdaftar pada rombel ini."
          />
        </div>
      </div>

      <DetailModal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={`Detail Wali Kelas (${activeModal})`}
        subtitle="Rincian data siswa dan aktivitas rombel"
      >
        <div className="p-4 text-center text-sm text-slate-500">
          Data detail <span className="font-bold text-slate-800 dark:text-slate-200">{activeModal}</span> siap ditampilkan secara terperinci.
        </div>
      </DetailModal>
    </div>
  )
}
