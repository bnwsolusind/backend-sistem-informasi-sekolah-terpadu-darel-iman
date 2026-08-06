import { useEffect, useMemo, useState } from 'react'
import {
  FaBookmark,
  FaCheck,
  FaDownload,
  FaGraduationCap,
  FaIdCard,
  FaMobileAlt,
  FaPrint,
  FaQrcode,
  FaTimes,
} from 'react-icons/fa'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { BookOpen, CalendarDays, Droplets, IdCard, LoaderCircle, RotateCcw, School, Search, ShieldCheck, UserRound } from 'lucide-react'
import { studentService } from '../../services/studentService'
import { usePengaturanStore } from '../../stores/pengaturanStore'
import PersonAvatar from '../ui/PersonAvatar'

const THEMES = [
  { id: 'green', name: 'Hijau Islami', primary: '#0E5C44', dark: '#064e3b', secondary: '#1E8E5A', soft: '#ecfdf5', accent: '#F6C143' },
  { id: 'blue', name: 'Biru Modern', primary: '#1D4ED8', dark: '#1e40af', secondary: '#3B82F6', soft: '#eff6ff', accent: '#93C5FD' },
  { id: 'purple', name: 'Ungu Elegan', primary: '#6D28D9', dark: '#5b21b6', secondary: '#8B5CF6', soft: '#f5f3ff', accent: '#C4B5FD' },
  { id: 'orange', name: 'Oranye Ceria', primary: '#EA580C', dark: '#c2410c', secondary: '#F97316', soft: '#fff7ed', accent: '#FDBA74' },
  { id: 'teal', name: 'Teal Fresh', primary: '#0F766E', dark: '#115e59', secondary: '#14B8A6', soft: '#f0fdfa', accent: '#99F6E4' },
  { id: 'navy', name: 'Navy Premium', primary: '#172554', dark: '#0f172a', secondary: '#1E3A8A', soft: '#eff6ff', accent: '#60A5FA' },
]

const DEFAULT_CONFIG = {
  orientation: 'horizontal',
  templateColor: 'green',
  showPhoto: true,
  showLogo: true,
  showQr: true,
  showNis: true,
  showNisn: true,
  showClass: true,
  showRombel: true,
  showUnit: true,
  showAcademicYear: false,
  showMotto: true,
}

function normalizeStudent(item) {
  const meta = item?.metadata || item?.raw?.metadata || {}
  return {
    ...item,
    id: item?.id,
    nama: item?.nama || item?.full_name || item?.nama_lengkap || '-',
    nis: item?.nis || '-',
    nisn: item?.nisn || meta.nisn || '-',
    unit: item?.unit || item?.unit_pendidikan || meta.akademik?.unit_pendidikan || meta.unit_pendidikan || '-',
    kelas: item?.kelas || item?.school_class?.name || meta.kelas_label || meta.akademik?.kelas || '-',
    rombel: item?.rombel || meta.rombel || meta.akademik?.rombel || '-',
    status: item?.status || (item?.is_active === false ? 'Nonaktif' : 'Aktif'),
    foto: item?.foto || meta.foto_url || meta.foto || meta.photo_url || meta.photo || meta.avatar || meta.avatar_url || meta.url_foto || item?.raw?.foto_url || item?.raw?.user?.avatar || '',
    tanggalLahir: item?.tanggal_lahir || item?.birth_date || meta.tanggal_lahir || meta.birth_date || '',
    golonganDarah: item?.golongan_darah || item?.blood_type || meta.golongan_darah || meta.blood_type || '-',
    raw: item?.raw || item,
  }
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="text-[11px] font-semibold text-slate-600">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-emerald-700' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </label>
  )
}

export default function CetakKartuSiswaModal({ student, onClose }) {
  const [cardConfig, setCardConfig] = useState(DEFAULT_CONFIG)
  const [selectedStudent, setSelectedStudent] = useState(() => normalizeStudent(student))
  const [studentSearch, setStudentSearch] = useState('')
  const [studentOptions, setStudentOptions] = useState(() => student ? [normalizeStudent(student)] : [])
  const [isSaving, setIsSaving] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toast, setToast] = useState(null)
  const [qrToken, setQrToken] = useState('')
  const [qrError, setQrError] = useState('')
  const pengaturan = usePengaturanStore((state) => state.pengaturan)
  const {
    orientation, templateColor: themeId, showPhoto, showQr, showLogo,
    showNis, showNisn, showClass, showRombel, showUnit,
    showAcademicYear, showMotto,
  } = cardConfig
  const updateConfig = (key, value) => setCardConfig((current) => ({ ...current, [key]: value }))
  const theme = THEMES.find((item) => item.id === themeId) || THEMES[0]

  const data = useMemo(() => {
    const meta = selectedStudent?.raw?.metadata || {}
    return {
      id: selectedStudent?.id,
      nis: selectedStudent?.nis || '-',
      nisn: selectedStudent?.nisn || meta.nisn || '-',
      nama: selectedStudent?.nama || '-',
      unit: selectedStudent?.unit || '-',
      kelas: selectedStudent?.kelas || '-',
      rombel: selectedStudent?.rombel || '-',
      status: selectedStudent?.status || 'Aktif',
      tahunAjaran: meta.tahun_ajaran_berjalan || meta.akademik?.tahun_ajaran || '-',
      tanggalLahir: selectedStudent?.tanggalLahir || selectedStudent?.raw?.birth_date || '-',
      golonganDarah: selectedStudent?.golonganDarah || '-',
      foto: selectedStudent?.foto || meta.foto_url || '',
      educationUnitId: selectedStudent?.raw?.unit_id || null,
    }
  }, [selectedStudent])

  useEffect(() => {
    setSelectedStudent(normalizeStudent(student))
  }, [student])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      studentService.getDaftar({ per_page: 15, search: studentSearch || undefined })
        .then((result) => {
          const list = (result?.data || []).map(normalizeStudent)
          setStudentOptions(list.length ? list : (student ? [normalizeStudent(student)] : []))
        })
        .catch(() => {})
    }, 350)
    return () => window.clearTimeout(timer)
  }, [student, studentSearch])

  useEffect(() => {
    let active = true
    studentService.getCardSetting(data.educationUnitId)
      .then((result) => {
        const setting = result?.data
        if (!active || !setting) return
        setCardConfig({
          orientation: setting.orientation || 'horizontal',
          templateColor: setting.template_color || 'green',
          showPhoto: setting.show_photo ?? true,
          showLogo: setting.show_logo ?? true,
          showQr: setting.show_qrcode ?? true,
          showNis: setting.show_nis ?? true,
          showNisn: setting.show_nisn ?? true,
          showClass: setting.show_class ?? true,
          showRombel: setting.show_rombel ?? true,
          showUnit: setting.show_unit ?? true,
          showAcademicYear: setting.show_academic_year ?? false,
          showMotto: setting.show_motto ?? true,
        })
      })
      .catch(() => {
        try {
          const cached = JSON.parse(localStorage.getItem('student_card_template') || 'null')
          if (active && cached) setCardConfig((current) => ({ ...current, ...cached }))
        } catch {
          // Gunakan konfigurasi default.
        }
      })
    return () => { active = false }
  }, [data.educationUnitId])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    let active = true
    setQrToken('')
    setQrError('')
    if (!data.id || String(data.id).startsWith('demo-')) {
      setQrError('Simpan siswa ke database untuk mengaktifkan QR absensi.')
      return () => { active = false }
    }

    studentService.getAttendanceQrToken(data.id)
      .then((result) => {
        if (active) setQrToken(result?.data?.qr_token || '')
      })
      .catch(() => {
        if (active) setQrError('Token QR belum dapat dibuat. Periksa hak akses admin.')
      })

    return () => { active = false }
  }, [data.id])

  if (!student) return null

  const sekolah = pengaturan?.school_name || pengaturan?.namaSekolah || 'YAYASAN DAR EL-IMAN'
  const logo = pengaturan?.logo_url || pengaturan?.logoUrl || ''
  const brandTitle = sekolah
    .replace(/^YAYASAN\s*/i, '')
    .replace(/\s*-\s*/g, '-')
    .trim()
  const initials = data.nama.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const formatDate = (value) => {
    if (!value || value === '-') return '-'
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime())
      ? value
      : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed)
  }

  const saveTemplate = async () => {
    setIsSaving(true)
    try {
      await studentService.saveCardSetting({
        education_unit_id: data.educationUnitId,
        orientation,
        template_color: themeId,
        show_photo: showPhoto,
        show_logo: showLogo,
        show_qrcode: showQr,
        show_nis: showNis,
        show_nisn: showNisn,
        show_class: showClass,
        show_rombel: showRombel,
        show_unit: showUnit,
        show_academic_year: showAcademicYear,
        show_motto: showMotto,
        is_default: true,
      })
      localStorage.setItem('student_card_template', JSON.stringify(cardConfig))
      setToast({ tone: 'success', title: 'Template Berhasil Disimpan', message: 'Pilihan desain kartu siswa berhasil disimpan.' })
    } catch {
      setToast({ tone: 'danger', title: 'Gagal Memproses Kartu', message: 'Terjadi kesalahan saat membuat kartu siswa. Silakan coba kembali.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrint = () => {
    if (!data.id) {
      setToast({ tone: 'warning', title: 'Pilih Siswa', message: 'Silakan pilih data siswa sebelum mencetak kartu.' })
      return
    }
    setToast({ tone: 'success', title: 'Kartu Siap Dicetak', message: 'Dokumen kartu siswa berhasil disiapkan.' })
    window.setTimeout(() => window.print(), 150)
  }

  const handleDownload = async () => {
    if (!data.id) {
      setToast({ tone: 'warning', title: 'Pilih Siswa', message: 'Silakan pilih data siswa sebelum mencetak kartu.' })
      return
    }
    const node = document.getElementById('printable-student-card')
    if (!node) return
    setIsProcessing(true)
    try {
      const dataUrl = await toPng(node, { pixelRatio: 3, cacheBust: true, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `kartu-siswa-${data.nis || data.id}.png`
      link.href = dataUrl
      link.click()
      setToast({ tone: 'success', title: 'Preview Berhasil Diunduh', message: 'File kartu siswa berhasil dibuat.' })
    } catch {
      setToast({ tone: 'danger', title: 'Gagal Memproses Kartu', message: 'Terjadi kesalahan saat membuat kartu siswa. Silakan coba kembali.' })
    } finally {
      setIsProcessing(false)
    }
  }

  const resetTemplate = () => setCardConfig(DEFAULT_CONFIG)

  const cardClass = orientation === 'horizontal'
    ? 'aspect-[86/54] w-full max-w-[560px]'
    : 'aspect-[54/86] w-full max-w-[320px]'

  const BrandMark = ({ compact = false, inverted = false }) => (
    <div className="flex items-center gap-2 text-left">
      {showLogo && (
        <span className={`flex shrink-0 items-center justify-center ${compact ? 'h-9 w-9' : 'h-11 w-11'}`} style={{ color: inverted ? '#ffffff' : theme.dark }}>
          {logo
            ? <img src={logo} alt="Logo situs" className="h-full w-full object-contain" />
            : <FaGraduationCap className={compact ? 'text-xl' : 'text-2xl'} />}
        </span>
      )}
      <span className="min-w-0">
        <small className={`block text-[6px] font-black uppercase leading-none tracking-[0.16em] ${inverted ? 'text-white/70' : ''}`} style={{ color: inverted ? undefined : theme.primary }}>Yayasan</small>
        <strong className={`${compact ? 'text-[11px]' : 'text-[15px]'} mt-0.5 block max-w-[220px] truncate font-black uppercase leading-none tracking-tight`} style={{ color: inverted ? '#ffffff' : theme.dark }}>{brandTitle}</strong>
        <small className={`mt-1 block whitespace-nowrap text-[6px] font-semibold leading-none ${inverted ? 'text-white/80' : 'text-slate-400'}`}>Islamic School</small>
      </span>
    </div>
  )

  const StudentPhoto = ({ vertical = false, className = '' }) => {
    const sizeClass = className || (vertical ? 'h-[126px] w-[108px]' : 'h-[118px] w-[104px]')
    return (
      <div className={`${sizeClass} ${vertical ? 'rounded-2xl border-4 border-white shadow-lg' : 'rounded-xl'} flex items-center justify-center overflow-hidden bg-slate-100 shadow-sm`} style={{ backgroundColor: data.foto ? undefined : theme.primary }}>
        <PersonAvatar src={data.foto} name={data.nama} size={vertical ? 'profile' : 'card'} className={`${vertical ? 'h-[118px] w-[100px] rounded-[16px]' : 'h-full w-full rounded-[12px]'} border-0 shadow-none`} />
      </div>
    )
  }

  const AttendanceQr = ({ size }) => (
    <div className="rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-slate-300">
      {qrToken ? <QRCodeSVG value={qrToken} size={size} level="M" /> : <FaQrcode style={{ width: size, height: size }} className="text-slate-300" />}
    </div>
  )

  const DetailRow = ({ icon: Icon, label, value, horizontal = false }) => (
    <div className={`flex min-w-0 items-center ${horizontal ? 'gap-2' : 'gap-2.5'}`}>
      <span className="flex shrink-0 items-center justify-center" style={{ color: theme.primary }}><Icon className={horizontal ? 'h-3.5 w-3.5' : 'h-3 w-3'} strokeWidth={2.4} /></span>
      <span className={`grid min-w-0 flex-1 items-baseline ${horizontal ? 'grid-cols-[62px_8px_minmax(0,1fr)]' : 'grid-cols-[68px_8px_minmax(0,1fr)]'} text-slate-800`}>
        <small className={`${horizontal ? 'text-[8px]' : 'text-[7px]'} font-medium`}>{label}</small><b className="text-[8px]">:</b><strong className={`${horizontal ? 'text-[9px]' : 'text-[7.5px]'} truncate font-black`}>{value}</strong>
      </span>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-student-card, #printable-student-card * { visibility: visible !important; }
          #printable-student-card {
            position: fixed !important; inset: 0 !important; margin: auto !important;
            box-shadow: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
          }
        }
      `}</style>

      <section className="my-3 flex max-h-[calc(100vh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><FaIdCard /></span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Kartu Siswa</h2>
              <p className="text-[11px] text-slate-500">Atur desain, aktifkan QR absensi, lalu cetak kartu siswa.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={saveTemplate} disabled={isSaving} className="hidden h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white disabled:opacity-60 sm:flex">
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FaBookmark />} {isSaving ? 'Menyimpan...' : 'Simpan Pilihan'}
            </button>
            <button type="button" onClick={onClose} aria-label="Tutup" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"><FaTimes /></button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="overflow-y-auto border-r border-slate-100 bg-slate-50/60 p-4">
            <div className="space-y-5">
              <section>
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-700">1. Pilih Siswa</h3>
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Cari nama siswa, NIS, atau NISN..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-[11px] outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100" />
                </label>
                <select
                  value={selectedStudent?.id || ''}
                  onChange={(event) => setSelectedStudent(studentOptions.find((item) => String(item.id) === event.target.value) || null)}
                  className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 outline-none focus:border-emerald-600"
                >
                  <option value="">Pilih siswa...</option>
                  {studentOptions.map((item) => <option key={item.id} value={item.id}>{item.nama} · {item.nis} · {item.nisn}</option>)}
                </select>
                {selectedStudent && (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                    <PersonAvatar src={data.foto} name={data.nama} size="table" className="border-emerald-200" />
                    <span className="min-w-0">
                      <strong className="block truncate text-xs text-slate-800">{data.nama}</strong>
                      <small className="block truncate text-[9px] text-slate-500">NIS {data.nis} · NISN {data.nisn}</small>
                      <small className="block truncate text-[9px] font-semibold text-emerald-700">{data.unit} · Kelas {data.kelas} · {data.status}</small>
                    </span>
                  </div>
                )}
              </section>

              <section>
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-700">2. Orientasi Kartu</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[['horizontal', 'Horizontal'], ['vertical', 'Vertikal']].map(([value, label]) => (
                    <button key={value} type="button" onClick={() => updateConfig('orientation', value)} className={`relative flex h-14 items-center justify-center gap-2 rounded-xl border text-[11px] font-bold transition ${orientation === value ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'}`}><FaIdCard className={value === 'vertical' ? 'rotate-90' : ''} />{label}{orientation === value && <FaCheck className="absolute right-2 top-2 text-[9px]" />}</button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-700">3. Pilih Template Warna</h3>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map((item) => (
                    <button key={item.id} type="button" onClick={() => updateConfig('templateColor', item.id)} className={`relative overflow-hidden rounded-xl border bg-white p-1.5 text-left transition ${themeId === item.id ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-200'}`}>
                      <span className="block h-9 rounded-lg" style={{ background: `linear-gradient(145deg, ${item.primary}, ${item.soft} 58%, ${item.accent})` }} />
                      <span className="mt-1 flex justify-center gap-0.5">{[item.primary, item.secondary, item.accent].map((color) => <i key={color} className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />)}</span>
                      <span className="mt-1 block truncate text-center text-[8px] font-bold text-slate-600">{item.name}</span>
                      {themeId === item.id && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[8px] text-white"><FaCheck /></span>}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-1 text-[10px] font-black uppercase tracking-wider text-slate-700">4. Opsi Tampilan</h3>
                <div className="grid grid-cols-1 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:grid-cols-2 lg:grid-cols-1">
                  <Toggle label="Foto Siswa" checked={showPhoto} onChange={(value) => updateConfig('showPhoto', value)} />
                  <Toggle label="Logo Yayasan" checked={showLogo} onChange={(value) => updateConfig('showLogo', value)} />
                  <Toggle label="QR Code" checked={showQr} onChange={(value) => updateConfig('showQr', value)} />
                  <Toggle label="NIS" checked={showNis} onChange={(value) => updateConfig('showNis', value)} />
                  <Toggle label="NISN" checked={showNisn} onChange={(value) => updateConfig('showNisn', value)} />
                  <Toggle label="Kelas" checked={showClass} onChange={(value) => updateConfig('showClass', value)} />
                  <Toggle label="Rombel" checked={showRombel} onChange={(value) => updateConfig('showRombel', value)} />
                  <Toggle label="Unit Pendidikan" checked={showUnit} onChange={(value) => updateConfig('showUnit', value)} />
                  <Toggle label="Tahun Ajaran" checked={showAcademicYear} onChange={(value) => updateConfig('showAcademicYear', value)} />
                  <Toggle label="Motto" checked={showMotto} onChange={(value) => updateConfig('showMotto', value)} />
                </div>
              </section>

              <button type="button" onClick={resetTemplate} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Reset Template</button>
            </div>
          </aside>

          <main className="min-h-0 overflow-y-auto p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Preview Kartu Siswa</h3>
                <p className="text-[11px] text-slate-500">QR hanya aktif untuk siswa yang sudah tersimpan dan memiliki token absensi.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${qrToken ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {qrToken ? 'QR Absensi Aktif' : 'QR Belum Aktif'}
              </span>
            </div>

            <div className="flex min-h-[500px] items-center justify-center overflow-auto rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_center,_#f8fafc,_#eef2f7)] p-6">
              <article
                id="printable-student-card"
                className={`${cardClass} relative flex shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xl`}
                style={{ border: `1px solid ${theme.primary}40` }}
              >
                {orientation === 'horizontal' ? (
                  <div className="relative z-10 h-full w-full">
                    <span className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 1px)`, backgroundSize: '13px 13px' }} />
                    <span className="absolute -right-20 -top-24 h-40 w-64 rounded-[50%]" style={{ background: theme.soft }} />
                    <div className="absolute left-[4%] top-[6%]"><BrandMark /></div>
                    <span className="absolute right-0 top-0 rounded-bl-[28px] px-5 py-3 text-[9px] font-black tracking-wider text-white" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})` }}>KARTU SISWA</span>

                    {showPhoto && <div className="absolute left-[5.8%] top-[31%] h-[45%] w-[25.8%]"><StudentPhoto className="h-full w-full rounded-[14px] border border-slate-200" /></div>}
                    {showUnit && <span className="absolute left-[5.8%] top-[78.5%] w-[25.8%] truncate rounded-md px-2 py-1 text-center text-[7px] font-black text-white" style={{ background: theme.primary }}>{data.unit}</span>}

                    <div className={`absolute top-[31%] min-w-0 ${showPhoto ? 'left-[36%] right-[31%]' : 'left-[6%] right-[31%]'}`}>
                      <p className="text-[7px] font-medium text-slate-500">Nama</p>
                      <h4 className="truncate text-[13px] font-black uppercase leading-tight text-slate-950">{data.nama}</h4>
                      <div className="mt-2.5 space-y-2">
                        {showNis && <DetailRow icon={IdCard} label="NIS" value={data.nis} horizontal />}
                        {showNisn && <DetailRow icon={ShieldCheck} label="NISN" value={data.nisn} horizontal />}
                        {showClass && <DetailRow icon={UserRound} label="Kelas" value={`${data.kelas}${showRombel && data.rombel !== '-' ? ` / ${data.rombel}` : ''}`} horizontal />}
                        {!showClass && showRombel && <DetailRow icon={UserRound} label="Rombel" value={data.rombel} horizontal />}
                        <DetailRow icon={CalendarDays} label="Tanggal Lahir" value={formatDate(data.tanggalLahir)} horizontal />
                        <DetailRow icon={Droplets} label="Gol. Darah" value={data.golonganDarah} horizontal />
                        {showAcademicYear && <DetailRow icon={School} label="Tahun Ajaran" value={data.tahunAjaran} horizontal />}
                      </div>
                    </div>
                    {showQr && <div className="absolute right-[5%] top-[38%] flex w-[22%] flex-col items-center rounded-xl border border-slate-300 bg-white p-2 shadow-sm"><AttendanceQr size={78} /><b className="mt-1 w-full rounded py-1 text-center text-[7px] text-white" style={{ background: theme.primary }}>ID CARD</b><small className="mt-1 text-[6px] text-slate-500">Scan untuk verifikasi</small></div>}

                    <span className="absolute -bottom-[26%] -left-[9%] h-[44%] w-[92%] -rotate-2 rounded-[50%]" style={{ background: `linear-gradient(115deg, ${theme.dark}, ${theme.primary})`, borderTop: `4px solid ${theme.accent}` }} />
                    <span className="absolute -bottom-[23%] right-[-9%] h-[39%] w-[43%] rotate-2 rounded-[58%_0_0_0]" style={{ background: `linear-gradient(130deg, ${theme.accent}, #d89b13)` }} />
                    <div className="absolute bottom-[5%] left-[5%] flex items-center gap-2 text-white"><BookOpen className="h-6 w-6" strokeWidth={1.5} /><p className="text-[7px] font-semibold leading-tight">Sekolah Unggulan<br />Berbasis Al-Qur'an</p></div>
                    <p className="absolute bottom-[7%] left-[37%] text-[7px] font-medium text-white/90">www.dareliman.sch.id</p>
                    <div className="absolute bottom-[4%] right-[4%] w-[23%] text-center text-white">
                      <svg viewBox="0 0 120 34" className="mx-auto h-7 w-[86%]" aria-hidden="true"><path d="M8 26C24 4 23 3 18 29C40 5 31 30 50 14C42 36 65 10 58 28C74 16 77 28 111 23" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      <p className="text-[6.5px] font-bold uppercase">Kepala Sekolah</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 h-full w-full text-center">
                    <span className="absolute left-0 right-0 top-0 h-[28%] rounded-b-[52%]" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.dark})`, borderBottom: `4px solid ${theme.accent}` }} />
                    <span className="absolute left-0 right-0 top-0 h-[28%] opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '13px 13px' }} />
                    <div className="absolute left-[8%] right-[8%] top-[5%]"><BrandMark compact inverted /></div>
                    {showMotto && <p className="absolute left-[36%] right-[5%] top-[16%] text-left text-[7px] italic leading-relaxed text-white/90">Berilmu, Berakhlak, Beramal<br />Untuk Meraih Ridha Allah</p>}

                    {showPhoto && <div className="absolute left-1/2 top-[17.5%] h-[22%] w-[38%] -translate-x-1/2"><StudentPhoto vertical className="h-full w-full rounded-full border-4 border-white shadow-lg" /></div>}
                    <div className={`absolute left-[8%] right-[8%] ${showPhoto ? 'top-[40.5%]' : 'top-[29%]'}`}>
                      <h4 className="truncate text-[14px] font-black uppercase leading-tight" style={{ color: theme.dark }}>{data.nama}</h4>
                      {showUnit && <p className="mx-auto mt-1 w-fit max-w-full truncate rounded-md px-4 py-1 text-[7px] font-black text-white" style={{ background: theme.primary }}>{data.unit}</p>}
                      <div className="mt-3 space-y-2 text-left">
                        {showNis && <DetailRow icon={IdCard} label="NIS" value={data.nis} />}
                        {showNisn && <DetailRow icon={ShieldCheck} label="NISN" value={data.nisn} />}
                        {showClass && <DetailRow icon={UserRound} label="Kelas" value={`${data.kelas}${showRombel && data.rombel !== '-' ? ` / ${data.rombel}` : ''}`} />}
                        {!showClass && showRombel && <DetailRow icon={UserRound} label="Rombel" value={data.rombel} />}
                        <DetailRow icon={CalendarDays} label="Tanggal Lahir" value={formatDate(data.tanggalLahir)} />
                        <DetailRow icon={Droplets} label="Gol. Darah" value={data.golonganDarah} />
                        {showAcademicYear && <DetailRow icon={School} label="Tahun Ajaran" value={data.tahunAjaran} />}
                      </div>
                    </div>
                    {showQr && <div className="absolute bottom-[12%] left-1/2 flex -translate-x-1/2 flex-col items-center rounded-xl border border-slate-300 bg-white p-2 shadow-sm"><AttendanceQr size={68} /><b className="mt-1 w-full rounded py-1 text-[7px] text-white" style={{ background: theme.primary }}>ID CARD</b><small className="mt-1 text-[6px] text-slate-500">Scan untuk verifikasi</small></div>}
                    <span className="absolute -bottom-[5%] -left-[10%] h-[17%] w-[120%] rounded-[50%_50%_0_0]" style={{ background: `linear-gradient(115deg, ${theme.dark}, ${theme.primary})`, borderTop: `4px solid ${theme.accent}` }} />
                    <div className="absolute bottom-[3.6%] left-[8%] flex items-center gap-2 text-left text-white"><BookOpen className="h-6 w-6" strokeWidth={1.5} /><p className="text-[6.5px] font-semibold leading-tight">Sekolah Unggulan<br />Berbasis Al-Qur'an</p></div>
                    <p className="absolute bottom-[3.6%] right-[8%] border-l border-white/40 pl-4 text-left text-[6.5px] font-bold text-white">TAHUN AJARAN<br />{data.tahunAjaran}</p>
                  </div>
                )}
              </article>
            </div>

            {qrError && <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] font-medium text-amber-800">{qrError}</p>}

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><FaQrcode className="text-emerald-700" /><span className="text-[10px]"><b className="block text-slate-800">QR Aman</b><span className="text-slate-500">Token terenkripsi</span></span></div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><FaPrint className="text-emerald-700" /><span className="text-[10px]"><b className="block text-slate-800">Siap Cetak</b><span className="text-slate-500">Ukuran kartu identitas</span></span></div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><FaMobileAlt className="text-emerald-700" /><span className="text-[10px]"><b className="block text-slate-800">Mobile Ready</b><span className="text-slate-500">Dapat dipindai Android</span></span></div>
            </div>
          </main>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4">
          <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-5 text-xs font-semibold text-slate-700">Tutup</button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={saveTemplate} disabled={isSaving} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 disabled:opacity-60 sm:hidden">
              {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FaBookmark />} Simpan
            </button>
            <button type="button" onClick={handleDownload} disabled={isProcessing} className="flex h-10 items-center gap-2 rounded-xl border border-emerald-700 px-4 text-xs font-bold text-emerald-800 disabled:opacity-60">
              {isProcessing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FaDownload />} {isProcessing ? 'Memproses...' : 'Unduh Preview'}
            </button>
            <button type="button" onClick={handlePrint} className="flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-5 text-xs font-bold text-white hover:bg-emerald-900"><FaPrint /> Cetak Kartu</button>
          </div>
        </footer>
      </section>
      {toast && (
        <div className={`fixed right-4 top-4 z-[70] w-[min(360px,calc(100vw-2rem))] rounded-2xl border bg-white p-4 shadow-2xl ${
          toast.tone === 'danger' ? 'border-rose-200' : toast.tone === 'warning' ? 'border-amber-200' : 'border-emerald-200'
        }`}>
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
              toast.tone === 'danger' ? 'bg-rose-600' : toast.tone === 'warning' ? 'bg-amber-500' : 'bg-emerald-700'
            }`}>{toast.tone === 'danger' ? <FaTimes /> : <FaCheck />}</span>
            <div className="min-w-0"><strong className="block text-sm text-slate-900">{toast.title}</strong><p className="mt-1 text-xs leading-relaxed text-slate-500">{toast.message}</p></div>
            <button type="button" onClick={() => setToast(null)} className="text-slate-400"><FaTimes /></button>
          </div>
        </div>
      )}
    </div>
  )
}
