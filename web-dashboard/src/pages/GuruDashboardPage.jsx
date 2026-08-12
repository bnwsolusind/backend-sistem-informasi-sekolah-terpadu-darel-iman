import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Users,
  BookOpen,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  FilePlus,
  BookMarked,
  Award,
  Eye,
  CalendarDays
} from 'lucide-react'

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
import KpiQuickViewModal from '../components/KpiQuickViewModal'
import ModalErrorBoundary from '../components/common/ModalErrorBoundary'

import api from '../services/api'

export default function GuruDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [selectedScheduleDetail, setSelectedScheduleDetail] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/teacher/dashboard')
      if (res.data && res.data.data) {
        setData(res.data.data)
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Teacher dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data dashboard Guru.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) return <SkeletonDashboard />
  if (error) return <ErrorState message={error} onRetry={fetchDashboard} />

  const teacher = data?.teacher || {}
  const academicContext = data?.academic_context || {}
  const kpis = data?.kpi || {}
  const schedulesToday = data?.schedules_today || []
  const announcements = data?.announcements || []
  const teacherAttendanceLogs = data?.teacher_attendance_logs || []

  const formatNumber = (num) => (num !== undefined && num !== null ? Number(num).toLocaleString('id-ID') : '0')

  const quickActions = [
    {
      label: 'Input Presensi',
      icon: CheckCircle2,
       onClick: () => navigate('/portal-guru/presensi-pembelajaran'),
      permissions: ['teacher.attendance.create']
    },
    {
      label: 'Tambah Materi',
      icon: FilePlus,
       onClick: () => navigate('/portal-guru/materi'),
      permissions: ['teacher.material.create']
    },
    {
      label: 'Buat Tugas',
      icon: BookPlusIcon,
       onClick: () => navigate('/portal-guru/penugasan'),
      permissions: ['teacher.assignment.create']
    },
    {
      label: 'Nilai Tugas',
      icon: FileCheck,
       onClick: () => navigate('/portal-guru/pengumpulan-tugas'),
      permissions: ['teacher.grade.create']
    },
    {
      label: 'Lihat Jadwal',
      icon: CalendarDays,
       onClick: () => navigate('/portal-guru/jadwal'),
      permissions: ['teacher.schedule.view']
    }
  ]

  function BookPlusIcon(props) {
    return <BookMarked {...props} />
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Dashboard Header */}
      <DashboardHeader
        title={`Assalamu'alaikum, ${teacher.name || 'Guru'}`}
        subtitle={`Portal Guru Mata Pelajaran — NIP/NIY: ${teacher.nip_niy || '-'} | ${teacher.education_unit}`}
        roleName="Guru Mata Pelajaran"
        unitName={teacher.education_unit}
        academicYear={academicContext.academic_year}
        semester={academicContext.semester}
      />

      <DashboardFilter onReset={fetchDashboard} />

      {/* Primary KPI Grid */}
      <KpiCardGrid cols={4}>
        <KpiCard
          title="Jadwal Hari Ini"
          value={formatNumber(kpis.schedules_today_count)}
          icon={Calendar}
          onClick={() => setActiveModal('schedules_today')}
        />
        <KpiCard
          title="Total Siswa Diajar"
          value={formatNumber(kpis.total_students)}
          icon={Users}
          onClick={() => setActiveModal('total_students')}
        />
        <KpiCard
          title="Total Rombel / Kelas"
          value={formatNumber(kpis.total_classes)}
          icon={BookOpen}
          onClick={() => setActiveModal('total_classes')}
        />
        <KpiCard
          title="Tugas Belum Dinilai"
          value={formatNumber(kpis.pending_grading_count)}
          icon={FileCheck}
          onClick={() => setActiveModal('pending_grading')}
        />
      </KpiCardGrid>

      {/* Quick Actions */}
      <QuickActionCard title="Aksi Cepat Guru" actions={quickActions} />

      {/* Today's Schedule Table & Detail Modal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTableCard
            title="Jadwal Mengajar Hari Ini"
            subtitle={academicContext.date}
            headers={['Jam', 'Mata Pelajaran', 'Kelas', 'Ruangan', 'Detail']}
            rows={schedulesToday.map((sch, idx) => [
              <span key="time" className="font-semibold text-slate-800 dark:text-slate-200">
                {sch.time_start || sch.jam_mulai || '-'} - {sch.time_end || sch.jam_selesai || '-'}
              </span>,
              sch.subject?.nama_mapel || sch.subject?.name || 'Mata Pelajaran',
              sch.kelas?.nama_kelas || sch.kelas?.kode_kelas || 'Kelas',
              sch.room || sch.ruangan || 'Utama',
              <button
                key="detail"
                type="button"
                onClick={() => setSelectedScheduleDetail(sch)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E5C44] hover:underline dark:text-emerald-400"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Detail</span>
              </button>
            ])}
            emptyMessage="Tidak ada jadwal mengajar pada hari ini."
          />
        </div>

        {/* Section 4.5 Log Absensi Guru (Strictly View Only) */}
        <div>
          <DataTableCard
            title="Log Absensi Guru (View Only)"
            subtitle="Riwayat presensi harian pengajar"
            headers={['Tanggal', 'Masuk', 'Status']}
            rows={teacherAttendanceLogs.map((log, idx) => [
              log.attendance_date || log.date || (log.created_at ? new Date(log.created_at).toLocaleDateString('id-ID') : '-'),
              log.check_in_time || log.jam_masuk || (log.created_at ? new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'),
              <span key="status" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {log.status || 'Hadir'}
              </span>
            ])}
            emptyMessage="Belum ada riwayat absensi guru tercatat."
          />
        </div>
      </div>

      {/* Announcements Table */}
      <DataTableCard
        title="Pengumuman Sekolah Terbaru"
        subtitle="Informasi resmi dari unit sekolah"
        headers={['Judul Pengumuman', 'Tanggal']}
        rows={announcements.map((ann, idx) => [
          <span key="title" className="font-semibold text-slate-900 dark:text-white">{ann.judul_pengumuman || ann.judul}</span>,
          ann.created_at ? new Date(ann.created_at).toLocaleDateString('id-ID') : '-'
        ])}
        emptyMessage="Belum ada pengumuman terbaru."
      />

      {/* Schedule Detail Modal (Modal Jadwal Mengajar) */}
      <DetailModal
        isOpen={Boolean(selectedScheduleDetail)}
        onClose={() => setSelectedScheduleDetail(null)}
        title="Detail Jadwal Mengajar"
        subtitle={`${selectedScheduleDetail?.subject?.nama_mapel || 'Mapel'} - ${selectedScheduleDetail?.kelas?.nama_kelas || 'Kelas'}`}
      >
        {selectedScheduleDetail && (
          <div className="space-y-4 p-2">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">Mata Pelajaran</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedScheduleDetail.subject?.nama_mapel || selectedScheduleDetail.subject?.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">Kelas & Rombel</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedScheduleDetail.kelas?.nama_kelas || 'Kelas'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">Waktu Pertemuan</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedScheduleDetail.time_start} - {selectedScheduleDetail.time_end}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">Ruangan</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedScheduleDetail.room || 'Ruangan Utama'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                 onClick={() => navigate(`/portal-guru/presensi-pembelajaran?schedule_id=${selectedScheduleDetail.id}`)}
                className="px-4 py-2 rounded-xl bg-[#0E5C44] text-white text-xs font-semibold hover:bg-[#1E8E5A] transition-colors"
              >
                Input Presensi Pembelajaran
              </button>
            </div>
          </div>
        )}
      </DetailModal>

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
