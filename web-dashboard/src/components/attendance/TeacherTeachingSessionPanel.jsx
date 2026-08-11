import { useEffect, useRef, useState } from 'react'
import { Camera, Clock3, Play, QrCode, Radio, RefreshCw, Square, XCircle } from 'lucide-react'
import { AppBadge, AppButton, AppCard, AppModal } from '../app'
import { teacherTeachingService } from '../../services/teacherTeachingService'

const statusVariant = {
  hadir: 'success',
  terlambat: 'warning',
  ready: 'info',
  active: 'success',
  completed: 'neutral',
  belum_presensi: 'neutral',
}

const statusLabel = {
  hadir: 'Hadir',
  terlambat: 'Terlambat',
  ready: 'Siap Mengajar',
  active: 'Sedang Mengajar',
  completed: 'Selesai Mengajar',
  belum_presensi: 'Belum Presensi',
}

function getDeviceId() {
  const key = 'simsit.teacher.presence.device_id'
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const created = window.crypto?.randomUUID?.() || `browser-${Date.now()}`
  window.localStorage.setItem(key, created)
  return created
}

export default function TeacherTeachingSessionPanel({ onNotify }) {
  const [schedules, setSchedules] = useState([])
  const [selectedScheduleId, setSelectedScheduleId] = useState('')
  const [attendance, setAttendance] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [qrToken, setQrToken] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const detectorRef = useRef(null)
  const scanTimerRef = useRef(null)
  const processingRef = useRef(false)

  const selectedSchedule = schedules.find((item) => item.id === selectedScheduleId) || schedules[0]

  const notify = (type, title, message) => onNotify?.(type, title, message)

  const loadSchedules = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await teacherTeachingService.schedules()
      const nextSchedules = data.schedules || []
      setSchedules(nextSchedules)
      setSelectedScheduleId((current) => nextSchedules.some((item) => item.id === current) ? current : (nextSchedules[0]?.id || ''))
      const current = nextSchedules.find((item) => item.id === selectedScheduleId) || nextSchedules[0]
      setAttendance(current?.attendance || null)
      setSession(current?.session || null)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Jadwal mengajar Step 04 belum dapat dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSchedules()
    const deviceId = getDeviceId()
    const sendHeartbeat = () => {
      if (document.visibilityState === 'hidden') return
      teacherTeachingService.heartbeat(deviceId, 'Browser Portal Guru').catch(() => {})
    }
    sendHeartbeat()
    const heartbeatTimer = window.setInterval(sendHeartbeat, 20000)
    return () => window.clearInterval(heartbeatTimer)
  }, [])

  useEffect(() => {
    const current = schedules.find((item) => item.id === selectedScheduleId)
    setAttendance(current?.attendance || null)
    setSession(current?.session || null)
  }, [selectedScheduleId, schedules])

  useEffect(() => () => stopCamera(), [])

  const stopCamera = () => {
    if (scanTimerRef.current) window.clearInterval(scanTimerRef.current)
    scanTimerRef.current = null
    detectorRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraActive(false)
  }

  const closeScanner = () => {
    stopCamera()
    setShowScanner(false)
  }

  const submitCard = async (value = qrToken) => {
    const token = String(value || '').trim()
    if (!selectedSchedule?.id || !token || processingRef.current) return
    processingRef.current = true
    setProcessing(true)
    setError('')
    try {
      const result = await teacherTeachingService.scanCard({ schedule_id: selectedSchedule.id, qr_token: token })
      setAttendance(result?.attendance || null)
      setSession(result?.session || null)
      setQrToken('')
      closeScanner()
      notify('success', result?.scan_status === 'duplicate' ? 'Presensi Sudah Tercatat' : 'Presensi Berhasil', result?.message || 'Presensi guru tersimpan.')
      await loadSchedules()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'QR kartu guru ditolak oleh server.'
      setError(message)
      notify('error', 'Scan Ditolak', message)
    } finally {
      processingRef.current = false
      setProcessing(false)
    }
  }

  const startCamera = async () => {
    setCameraError('')
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Browser tidak mendukung akses kamera.')
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraActive(true)
      if (!('BarcodeDetector' in window)) {
        setCameraError('Pemindaian otomatis belum tersedia di browser ini. Gunakan input scanner USB/manual.')
        return
      }
      detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] })
      scanTimerRef.current = window.setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2 || processingRef.current) return
        try {
          const codes = await detectorRef.current.detect(videoRef.current)
          const value = codes[0]?.rawValue
          if (value) await submitCard(value)
        } catch {
          // Frame tanpa QR valid diabaikan sampai pemindaian berikutnya.
        }
      }, 500)
    } catch (cameraRequestError) {
      setCameraError(cameraRequestError.message || 'Kamera tidak dapat diakses. Periksa izin browser.')
    }
  }

  const openScanner = () => {
    setShowScanner(true)
    window.setTimeout(startCamera, 100)
  }

  const startTeaching = async () => {
    if (!session?.id || processing) return
    setProcessing(true)
    try {
      const nextSession = await teacherTeachingService.startSession(session.id)
      setSession(nextSession)
      notify('success', 'Sesi Dimulai', 'Status mengajar sekarang aktif.')
    } catch (requestError) {
      notify('error', 'Sesi Belum Dimulai', requestError.response?.data?.message || 'Sesi mengajar tidak dapat dimulai.')
    } finally {
      setProcessing(false)
    }
  }

  const closeTeaching = async () => {
    if (!session?.id || processing) return
    setProcessing(true)
    try {
      const nextSession = await teacherTeachingService.closeSession(session.id)
      setSession(nextSession)
      notify('success', 'Sesi Selesai', 'Sesi mengajar ditutup pada server.')
    } catch (requestError) {
      notify('error', 'Sesi Belum Ditutup', requestError.response?.data?.message || 'Sesi mengajar tidak dapat ditutup.')
    } finally {
      setProcessing(false)
    }
  }

  const attendanceStatus = attendance?.status || 'belum_presensi'
  const teachingStatus = session?.teaching_session_status || 'belum_presensi'

  return (
    <AppCard
      id="teacher-step04-panel"
      icon={QrCode}
      title="Presensi Mengajar Step 04"
      description="QR kartu guru mengidentifikasi guru; server tetap memvalidasi jadwal dan konteks akademik."
      actions={<AppButton variant="ghost" size="sm" icon={RefreshCw} onClick={loadSchedules} loading={loading} tooltip="Muat ulang jadwal" />}
    >
      {error && <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"><XCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      {loading ? (
        <div className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" aria-label="Memuat presensi mengajar" />
      ) : schedules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-700">Belum ada jadwal mengajar aktif pada hari ini.</div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {schedules.map((schedule) => (
              <button
                type="button"
                key={schedule.id}
                onClick={() => setSelectedScheduleId(schedule.id)}
                className={`rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-700/20 ${selectedSchedule?.id === schedule.id ? 'border-emerald-700 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/30' : 'border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900/40'}`}
              >
                <div className="flex items-start justify-between gap-2"><span className="text-xs font-bold text-slate-900 dark:text-white">{schedule.subject?.name || schedule.subject?.nama_mapel || 'Mata Pelajaran'}</span><AppBadge dot variant={statusVariant[schedule.session?.teaching_session_status || schedule.attendance?.status || 'belum_presensi'] || 'neutral'}>{statusLabel[schedule.session?.teaching_session_status || schedule.attendance?.status || 'belum_presensi'] || 'Belum Presensi'}</AppBadge></div>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{schedule.class?.nama_kelas || schedule.class?.kode_kelas || 'Rombel'} · {schedule.time_start?.slice(0, 5)}–{schedule.time_end?.slice(0, 5)}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Jadwal Terpilih</p>
              <h3 className="mt-1 truncate text-base font-extrabold text-slate-900 dark:text-white">{selectedSchedule?.subject?.name || selectedSchedule?.subject?.nama_mapel || 'Mata Pelajaran'}</h3>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{selectedSchedule?.class?.nama_kelas || selectedSchedule?.class?.kode_kelas || 'Rombel'} · {selectedSchedule?.time_start?.slice(0, 5)}–{selectedSchedule?.time_end?.slice(0, 5)}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <AppBadge dot variant={statusVariant[attendanceStatus] || 'neutral'}>{statusLabel[attendanceStatus] || attendanceStatus}</AppBadge>
              <AppBadge dot variant={statusVariant[teachingStatus] || 'neutral'}>{statusLabel[teachingStatus] || teachingStatus}</AppBadge>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1"><span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">QR token kartu guru / scanner USB</span><input value={qrToken} onChange={(event) => setQrToken(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); submitCard() } }} autoComplete="off" placeholder="Scan QR kartu guru atau tempel token opaque" className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
            <div className="flex gap-2"><AppButton variant="outline" icon={Camera} onClick={openScanner} disabled={processing}>Kamera</AppButton><AppButton icon={QrCode} onClick={() => submitCard()} loading={processing} disabled={!qrToken.trim() || !selectedSchedule?.id}>Presensi</AppButton></div>
          </div>

          <div className="flex flex-wrap gap-2">
            <AppButton variant="success" icon={Play} onClick={startTeaching} loading={processing} disabled={!session?.id || teachingStatus !== 'ready'}>Mulai Sesi Mengajar</AppButton>
            <AppButton variant="outline" icon={Square} onClick={closeTeaching} loading={processing} disabled={!session?.id || teachingStatus !== 'active'}>Selesai Mengajar</AppButton>
            {attendance?.check_in_at && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Clock3 className="h-4 w-4" />Presensi {new Date(attendance.check_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>}
            {teachingStatus === 'active' && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><Radio className="h-4 w-4" />Online presence aktif</span>}
          </div>
        </div>
      )}

      <AppModal isOpen={showScanner} onClose={closeScanner} title="Scan QR Kartu Guru" description="QR hanya untuk identifikasi dan presensi jadwal" icon={Camera} maxWidth="max-w-2xl">
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-950"><video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />{!cameraActive && <div className="absolute inset-0 flex items-center justify-center text-center text-xs font-semibold text-slate-300">Kamera belum aktif</div>}</div>
          {cameraError && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">{cameraError}</div>}
          <label><span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">Fallback scanner/manual</span><input value={qrToken} onChange={(event) => setQrToken(event.target.value)} autoComplete="off" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" placeholder="Tempel opaque QR token" /></label>
        </div>
      </AppModal>
    </AppCard>
  )
}
