import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Database,
  BookOpen,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Search,
  Bell,
  User,
  Layers,
  Plus,
  LogOut,
  Calendar,
  Sparkles,
  Sun,
  Moon,
  CalendarCheck,
  HelpCircle,
  BookHeart,
  Users,
  Building2,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import { usePengaturanStore } from '../stores/pengaturanStore'
import { useUnitStore } from '../stores/unitStore'
import { Drawer } from '../components/ui/drawer'
import { FAB } from '../components/ui/fab'
import ActiveScheduleNotice from '../components/attendance/ActiveScheduleNotice'
import FloatingChatWidget from '../components/portal/FloatingChatWidget'
import PersonAvatar from '../components/ui/PersonAvatar'

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const setSession = useAuthStore((state) => state.setSession)
  const activeUnit = useUnitStore((state) => state.activeUnit)
  const setActiveUnit = useUnitStore((state) => state.setActiveUnit)
  const pengaturan = usePengaturanStore((state) => state.pengaturan)
  const muatPengaturan = usePengaturanStore((state) => state.muatPengaturan)
  const namaSekolah = pengaturan?.school_name || 'YAYASAN DAR EL - IMAN'
  const roles = Array.isArray(user?.roles) ? user.roles : []
  const permissions = Array.isArray(user?.permissions) ? user.permissions : []
  const hasRole = (...names) => names.some((name) => roles.some((role) => String(role).toLowerCase().replace(/[\s_-]+/g, '') === String(name).toLowerCase().replace(/[\s_-]+/g, '')))
  const can = (...names) => hasRole('Super Admin') || names.some((name) => permissions.includes(name))
  const isPortalUser = hasRole('Siswa', 'Orang Tua', 'Orangtua', 'Wali Murid')

  const [collapsed, setCollapsed] = useState(Boolean(pengaturan?.sidebar_collapsed))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSection, setOpenSection] = useState('master-data')
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [roleAccessOpen, setRoleAccessOpen] = useState(false)
  const [roleAccessLoading, setRoleAccessLoading] = useState('')
  const [impersonating] = useState(() => Boolean(localStorage.getItem('school_erp_superadmin_session')))
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') return false
    if (saved === 'dark') return true
    return false // Default to Light Mode
  })

  useEffect(() => {
    muatPengaturan()
  }, [muatPengaturan])

  useEffect(() => {
    document.title = pengaturan.application_name || 'Sistem Manajemen Sekolah'
    let favicon = document.querySelector("link[rel~='icon']")
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.appendChild(favicon)
    }
    favicon.href = pengaturan.favicon_url || '/favicon.ico'
  }, [pengaturan.application_name, pengaturan.favicon_url])

  useEffect(() => {
    setCollapsed(Boolean(pengaturan.sidebar_collapsed))
  }, [pengaturan.sidebar_collapsed])

  const profileDropdownRef = useRef(null)
  const unitDropdownRef = useRef(null)
  const themeDropdownRef = useRef(null)
  const roleAccessRef = useRef(null)

  // Sync dark mode class on html & body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false)
      }
      if (unitDropdownRef.current && !unitDropdownRef.current.contains(e.target)) {
        setUnitDropdownOpen(false)
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setThemeMenuOpen(false)
      }
      if (roleAccessRef.current && !roleAccessRef.current.contains(e.target)) {
        setRoleAccessOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const namaTampil = user?.name || 'Ketua Yayasan'
  const roleTampil = roles.join(', ') || 'Pengguna'
  const tanggalTampil = 'Senin, 27 Juli 2026 / 1 Muharram 1448 H'

  const toggleSection = (sectionKey) => {
    setOpenSection((prev) => (prev === sectionKey ? '' : sectionKey))
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Abaikan error API jika token sudah expired
    } finally {
      clearSession()
      localStorage.removeItem('school_erp_superadmin_session')
      window.location.href = '/masuk'
    }
  }

  const roleAccessOptions = [
    { label: 'Pengurus Yayasan', role: 'Yayasan' },
    { label: 'Divisi Pendidikan', role: 'Divisi Pendidikan' },
    { label: 'Kepala Sekolah', role: 'Kepala Sekolah' },
    { label: 'Tata Usaha', role: 'Tata Usaha' },
    { label: 'Guru', role: 'Guru' },
    { label: 'Guru Tahfizh', role: 'Guru Tahfizh' },
    { label: 'Musyrif', role: 'Musyrif' },
    { label: 'Orang Tua', role: 'Orang Tua' },
    { label: 'Siswa', role: 'Siswa' },
  ]

  const routeForRole = (role) => {
    if (role === 'Orang Tua') return '/portal-orangtua'
    if (role === 'Siswa') return '/portal-siswa'
    return '/dashboard'
  }

  const accessAsRole = async (option) => {
    setRoleAccessLoading(option.role)
    try {
      const currentSession = {
        token: localStorage.getItem('school_erp_token'),
        user,
      }
      const result = await authService.impersonate(option.role)
      const targetUser = result.user?.data || result.user
      if (!result.token || !Array.isArray(targetUser?.roles)) {
        throw new Error('Respons sesi role tidak valid')
      }
      localStorage.setItem('school_erp_superadmin_session', JSON.stringify(currentSession))
      setSession({ token: result.token, user: targetUser })
      // Reload penuh diperlukan agar cache query, permission, dan seluruh outlet
      // dibangun ulang menggunakan token pengguna target.
      window.location.replace(routeForRole(option.role))
    } catch (error) {
      Swal.fire('Akses belum tersedia', error.response?.data?.message || 'Gagal masuk sebagai role tersebut.', 'error')
    } finally {
      setRoleAccessLoading('')
    }
  }

  const returnToSuperAdmin = () => {
    try {
      const original = JSON.parse(localStorage.getItem('school_erp_superadmin_session') || 'null')
      if (!original?.token || !original?.user) throw new Error('Sesi tidak ditemukan')
      setSession(original)
      localStorage.removeItem('school_erp_superadmin_session')
      window.location.replace('/dashboard')
    } catch {
      clearSession()
      localStorage.removeItem('school_erp_superadmin_session')
      window.location.href = '/masuk'
    }
  }

  const daftarUnitOptions = [
    { id: 'SEMUA', name: 'Semua Unit Pendidikan' },
    { id: 'TK', name: 'TK Islam Terpadu' },
    { id: 'SD', name: 'SD Islam Terpadu' },
    { id: 'SMP', name: 'SMP Islam Terpadu' },
    { id: 'SMA', name: 'SMA Islam Terpadu' },
    { id: 'PONPES', name: 'Pondok Pesantren' },
  ]

  const attendanceSubmenus = [
    ...(hasRole('Wali Kelas') && can('attendance.homeroom.dashboard', 'homeroom_attendance.dashboard', 'homeroom_attendance.view') ? [
      { to: '/absensi/dashboard-wali-kelas', label: 'Dashboard Wali Kelas' },
      { to: '/absensi/rekap-kehadiran', label: 'Rekap Kehadiran' },
      { to: '/absensi/verifikasi-izin', label: 'Verifikasi Izin/Sakit' },
      { to: '/absensi/koreksi', label: 'Koreksi Presensi' },
      { to: '/absensi/tindak-lanjut', label: 'Tindak Lanjut Siswa' },
      { to: '/absensi/laporan', label: 'Laporan Rombel' },
    ] : []),
    ...(hasRole('Guru', 'Guru Tahfizh') && can('attendance.teacher.dashboard', 'lesson_attendance.view_own', 'lesson_attendance.create') ? [
      { to: '/absensi/dashboard-guru', label: 'Dashboard Guru' },
      { to: '/absensi/jadwal-mengajar', label: 'Jadwal Mengajar' },
      { to: '/absensi/presensi', label: 'Presensi Pembelajaran' },
      { to: '/absensi/riwayat-guru', label: 'Riwayat Presensi' },
    ] : []),
    ...(hasRole('Siswa', 'Orang Tua') && can('attendance.student.view_own', 'student_attendance.view_own') ? [
      // { to: '/absensi/kehadiran-saya', label: 'Kehadiran Saya' },
      // { to: '/absensi/riwayat-saya', label: 'Riwayat Kehadiran' },
      // { to: '/absensi/pengajuan-izin', label: 'Pengajuan Izin/Sakit' },
    ] : []),
    ...(!hasRole('Guru') && !hasRole('Guru Tahfizh') && !hasRole('Wali Kelas') && !hasRole('Siswa') ? [
      { to: '/dashboard/absensi-gerbang', label: 'Absensi Gerbang' },
      { to: '/dashboard/absensi-pembelajaran', label: 'Absensi Kelas & MaPel' },
      { to: '/dashboard/absensi-ibadah', label: 'Absensi Ibadah Santri' },
      { to: '/dashboard/laporan-absensi', label: 'Rekap Presensi & Laporan' },
    ] : [
      { to: '/dashboard/absensi-pembelajaran', label: 'Absensi Kelas & Mata Pelajaran' },
      { to: '/dashboard/absensi-gerbang', label: 'Absensi Gerbang' },
      { to: '/dashboard/absensi-ibadah', label: 'Absensi Ibadah Santri' },
    ]),
  ].filter((item, index, list) => list.findIndex((entry) => entry.to === item.to) === index)

  const bolehBukaMenu = (to) => {
    if (hasRole('Super Admin')) return true

    if (to.startsWith('/portal-siswa')) return hasRole('Siswa', 'Orang Tua', 'Orangtua', 'Wali Murid')
    if (to.startsWith('/portal-orangtua')) return hasRole('Orang Tua', 'Orangtua', 'Wali Murid')
    if (to.startsWith('/portal-guru')) return hasRole('Guru', 'Guru Tahfizh', 'Wali Kelas')
    if (to === '/dashboard') return can('dashboard.view')
    if (to.startsWith('/dashboard/pemantauan')) return can('dashboard.pemantauan.lihat')
    // Data pribadi hanya memberi akses ke profil siswa sendiri di portal,
    // bukan ke master data seluruh siswa.
    if (to === '/dashboard/students') return can('kesiswaan.data_lengkap_siswa')
    if (to.includes('/students/rombel') || to.includes('/students/kelas')) return can('kesiswaan.kelas_rombel')
    if (to.includes('/students/input') || to.includes('/students/laporan')) return can('kesiswaan.laporan_masuk_keluar')
    if (to.includes('/lms/penugasan')) return can('kesiswaan.penugasan_siswa')
    if (to.includes('/lms/materi-pembelajaran')) return can('pembelajaran.materi')
    if (to.includes('/lms/kisi-kisi')) return can('pembelajaran.kisi_kisi_ujian')
    if (to.includes('/lms/bank-soal')) return can('pembelajaran.bank_soal')
    if (to.includes('/jadwal-pelajaran')) return can('pembelajaran.jadwal_pelajaran')
    if (to.includes('/master-kurikulum')) return can('pembelajaran.kurikulum.view')
    if (to === '/dashboard/mutabaah/rekap') return can('mutabaah.recap.view', 'mutabaah.report.view', 'mutabaah.report.export')
    if (to === '/dashboard/tahfizh') return hasRole('Super Admin', 'Admin', 'Tata Usaha', 'TU', 'Musyrif')
    if (to.includes('/tahfizh')) return can('tahfizh.monitoring_target', 'tahfizh.laporan_target')
    if (to.includes('/absensi-ibadah') || to.includes('/worship')) {
      return (
        hasRole('Musyrif', 'Musyrifah', 'Pengasuh', 'Wali Asrama', 'Pembimbing', 'Super Admin', 'Admin') ||
        can('worship_attendance.view', 'worship_attendance.verify')
      )
    }
    if (to.includes('/mutabaah')) {
      return (
        hasRole('Super Admin', 'Admin', 'Yayasan', 'Kepala Sekolah', 'Divisi Pendidikan', 'Waka Kesiswaan', 'Waka Kurikulum', 'Tata Usaha', 'TU', 'Operator', 'Wali Kelas', 'Guru', 'Musyrif', 'Musyrifah', 'Pembimbing', 'Pengurus Yayasan') ||
        can('mutabaah.view', 'mutabaah.input', 'mutabaah.agenda.manage', 'sistem.master_data', 'mutabaah.dashboard.view', 'mutabaah.recap.view', 'mutabaah.daily.view', 'mutabaah.agenda.view', 'mutabaah.template.view', 'mutabaah.supervisor.view', 'mutabaah.parent.monitor')
      )
    }
    if (to.includes('/laporan-absensi')) return can('kehadiran.siswa.monitoring', 'kehadiran.siswa.rekap_keterlambatan', 'kehadiran.siswa.rekap_ketidakhadiran')
    if (to.includes('/rekap-absensi-gerbang')) return can('kehadiran.siswa.monitoring', 'gate_attendance.view')
    if (to.includes('/rekap-absensi-ibadah')) return can('worship_attendance.view', 'worship_attendance.verify')
    if (to.includes('/laporan-siswa')) return can('kesiswaan.rekap_prestasi', 'kesiswaan.kelulusan_per_unit', 'kesiswaan.kelulusan_per_tahun')
    if (to.includes('/laporan-alumni')) return can('kesiswaan.alumni_tujuan_lanjut')
    if (to.startsWith('/absensi') || to.includes('/attendance') || to.includes('/lms/presensi')) {
      return can(
        'kehadiran.siswa.absensi_digital',
        'kehadiran.siswa.barcode_kartu',
        'lesson_attendance.view',
        'lesson_attendance.view_own',
        'student_attendance.view_own',
      )
    }
    if (to.startsWith('/dashboard/yayasan')) {
      return (
        hasRole('Super Admin', 'Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'sekretaris_yayasan', 'bendahara_yayasan', 'pengurus_yayasan') ||
        can(
          'foundation.dashboard.view',
          'foundation.unit.view',
          'foundation.employee.view',
          'foundation.teacher.view',
          'foundation.student.view',
          'foundation.student_new.view',
          'foundation.student_mutation.view',
          'foundation.graduation.view',
          'foundation.alumni.view',
          'foundation.information.view',
          'foundation.report.view',
          'foundation.report.export'
        )
      )
    }
    if (to.includes('/hak-akses')) return can('sistem.hak_akses')
    if (to.includes('/pengaturan')) return can('sistem.pengaturan')

    return can('sistem.master_data')
  }

  const isFoundationUser =
    !hasRole('Super Admin', 'superadmin', 'SuperAdmin') &&
    (hasRole('Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'sekretaris_yayasan', 'bendahara_yayasan', 'pengurus_yayasan') ||
      can('foundation.dashboard.view'))

  const sidebarMenu = isFoundationUser ? [
    {
      key: 'dashboard-yayasan',
      label: 'Dashboard Yayasan',
      icon: LayoutDashboard,
      to: '/dashboard/yayasan',
    },
    {
      key: 'yayasan-monitoring',
      label: 'Monitoring',
      icon: Building2,
      submenus: [
        { to: '/dashboard/yayasan/unit-pendidikan', label: 'Unit Pendidikan' },
        { to: '/dashboard/yayasan/pegawai-guru', label: 'Pegawai & Guru' },
        { to: '/dashboard/yayasan/siswa', label: 'Data Siswa' },
        { to: '/dashboard/yayasan/siswa-baru', label: 'Siswa Baru' },
        { to: '/dashboard/yayasan/mutasi-siswa', label: 'Mutasi Siswa' },
        { to: '/dashboard/yayasan/kelulusan-alumni', label: 'Kelulusan & Alumni' },
        { to: '/dashboard/yayasan/informasi-sekolah', label: 'Informasi Sekolah' },
      ],
    },
    {
      key: 'yayasan-laporan',
      label: 'Laporan',
      icon: FileText,
      submenus: [
        { to: '/dashboard/yayasan/laporan/sdm', label: 'Laporan SDM' },
        { to: '/dashboard/yayasan/laporan/siswa', label: 'Laporan Siswa' },
        { to: '/dashboard/yayasan/laporan/mutasi', label: 'Laporan Mutasi' },
        { to: '/dashboard/yayasan/laporan/kelulusan', label: 'Laporan Kelulusan' },
        { to: '/dashboard/yayasan/laporan/alumni', label: 'Laporan Alumni' },
        { to: '/dashboard/yayasan/laporan/lintas-unit', label: 'Laporan Lintas Unit' },
      ],
    },
    {
      key: 'yayasan-akun',
      label: 'Akun',
      icon: User,
      submenus: [
        { to: '/dashboard/yayasan/notifikasi', label: 'Notifikasi' },
        { to: '/dashboard/yayasan/profil', label: 'Profil' },
      ],
    },
  ] : [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: '/dashboard',
    },
    {
      key: 'master-data',
      label: 'DASHBOARD YAYASAN',
      icon: Building2,
      submenus: [
        { to: '/dashboard/yayasan', label: 'Ringkasan Utama' },
        { to: '/dashboard/yayasan/unit-pendidikan', label: 'Unit Pendidikan' },
        { to: '/dashboard/yayasan/pegawai-guru', label: 'Pegawai & Guru' },
        { to: '/dashboard/yayasan/siswa', label: 'Data Siswa' },
        { to: '/dashboard/yayasan/siswa-baru', label: 'Siswa Baru' },
        { to: '/dashboard/yayasan/mutasi-siswa', label: 'Mutasi Siswa' },
        { to: '/dashboard/yayasan/kelulusan-alumni', label: 'Kelulusan & Alumni' },
        { to: '/dashboard/yayasan/informasi-sekolah', label: 'Informasi Sekolah' },
        { to: '/dashboard/yayasan/laporan', label: 'Laporan Lintas Unit' },
      ],
    },
    {
      key: 'master-data',
      label: 'MASTER DATA',
      icon: Database,
      submenus: [
        { to: '/dashboard/students/unit-pendidikan', label: 'Unit Pendidikan' },
        { to: '/dashboard/master-jenis-unit', label: 'Jenis Unit' },
        { to: '/dashboard/master-jabatan', label: 'Jabatan' },
        { to: '/dashboard/employees', label: 'Pegawai' },
        { to: '/dashboard/students', label: 'Siswa' },
        { to: '/dashboard/master-quran-surah', label: 'Al-Qur’an' },
        { to: '/dashboard/master-jadwal-sholat', label: 'Sholat' },
        { to: '/dashboard/master-doa', label: 'Do’a & Dzikir' },
      ],
    },
    {
      key: 'akademik',
      label: 'AKADEMIK & LMS',
      icon: BookOpen,
      submenus: [
        { to: '/dashboard/akademik/pengaturan?tab=tahun-ajaran', label: 'Pengaturan Akademik' },
        { to: '/dashboard/akademik/perencanaan?tab=cp', label: 'Perencanaan Pembelajaran' },
        { to: '/dashboard/akademik/pembelajaran?tab=materi', label: 'Pembelajaran' },
        { to: '/dashboard/akademik/evaluasi?tab=penugasan', label: 'Tugas & Evaluasi' },
        { to: '/dashboard/akademik/nilai-rapor?tab=buku-nilai', label: 'Nilai & Rapor' },
      ],
    },
    {
      key: 'portal-guru',
      label: 'PORTAL GURU',
      icon: BookOpen,
      submenus: [
        { to: '/portal-guru', label: 'Ringkasan' },
        // { to: '/portal-guru/workspace?tab=jadwal', label: 'Workspace Pembelajaran' },
        { to: '/portal-guru/workspace?tab=chat', label: 'Komunikasi Orang Tua' },
        { to: '/dashboard/chat-pegawai', label: 'Chat Pegawai' },
      ],
    },
    {
      key: 'portal-ortu-siswa',
      label: hasRole('Orang Tua') ? 'PORTAL ORANG TUA' : hasRole('Siswa') ? 'PORTAL SISWA' : 'PORTAL ORANG TUA & SISWA',
      icon: Users,
      submenus: [
        ...(hasRole('Orang Tua') ? [
          { to: '/portal-orangtua?tab=ringkasan', label: 'Dashboard' },
          { to: '/portal-orangtua?tab=chat', label: 'Chat Guru' },
          { to: '/portal-siswa/mutabaah', label: 'Mutabaah' },
          { to: '/portal-siswa/absensi', label: 'Absensi' },
          { to: '/absensi/kehadiran-saya', label: 'Kehadiran Saya' },
          { to: '/absensi/riwayat-saya', label: 'Riwayat Kehadiran' },
          { to: '/absensi/pengajuan-izin', label: 'Pengajuan Izin/Sakit' },
        ] : []),
        ...(hasRole('Siswa', 'Orang Tua', 'Orangtua', 'Wali Murid') ? [
          { to: '/portal-siswa/profil', label: 'Profil & Biodata' },
          { to: '/portal-siswa/informasi-sekolah', label: 'Informasi Sekolah' },
          { to: '/portal-siswa/jadwal', label: 'Jadwal' },
          { to: '/portal-siswa/materi', label: 'Materi' },
          { to: '/portal-siswa/tugas', label: 'Tugas' },
          { to: '/portal-siswa/tahfizh', label: 'Tahfizh' },
          { to: '/portal-siswa/nilai', label: 'Nilai' },
          { to: '/portal-siswa/komentar-guru', label: 'Komentar Guru' },
          { to: '/portal-siswa/kisi-kisi', label: 'Kisi-kisi' },
          { to: '/portal-siswa/ujian-cbt', label: 'Ujian CBT' },
          { to: '/portal-siswa/hasil', label: 'Hasil' },
        ] : []),
      ],
    },
    {
      key: 'absensi',
      label: 'ABSENSI',
      icon: CalendarCheck,
      submenus: attendanceSubmenus,
    },
    {
      key: 'musyrif-asrama',
      label: 'PORTAL MUSYRIF',
      icon: Moon,
      submenus: [
        { to: '/dashboard/absensi-ibadah', label: 'Presensi Ibadah Santri' },
        { to: '/dashboard/mutabaah', label: 'Mutaba’ah Harian Santri' },
        ...(hasRole('Super Admin', 'Admin', 'Tata Usaha', 'TU', 'Musyrif')
          ? [{ to: '/dashboard/tahfizh', label: 'Setoran Tahfizh Asrama' }]
          : []),
      ],
    },
    {
      key: 'mutabaah',
      label: 'MUTABA’AH',
      icon: BookHeart,
      submenus: [
        { to: '/dashboard/mutabaah', label: 'Dashboard Mutaba’ah' },
        // { to: '/dashboard/mutabaah/input-harian', label: 'Input Mutaba’ah Harian' },
        { to: '/dashboard/mutabaah/rekap', label: 'Rekap Mutaba’ah' },
        { to: '/dashboard/mutabaah/target-evaluasi', label: 'Target & Evaluasi' },
        ...(hasRole('Super Admin', 'Admin', 'Yayasan', 'Kepala Sekolah', 'Divisi Pendidikan', 'Tata Usaha', 'TU', 'Operator', 'Wali Kelas', 'Musyrif', 'Pembimbing') || can('mutabaah.agenda.view') ? [{ to: '/dashboard/mutabaah/rincian-agenda', label: 'Rincian Agenda TU' }] : []),
        ...(hasRole('Super Admin', 'Admin', 'Yayasan', 'Kepala Sekolah', 'Divisi Pendidikan', 'Tata Usaha', 'TU', 'Operator', 'Wali Kelas', 'Musyrif', 'Pembimbing') || can('mutabaah.template.view') ? [{ to: '/dashboard/mutabaah/template-agenda', label: 'Template Agenda' }] : []),
        ...(hasRole('Super Admin', 'Admin', 'Yayasan', 'Kepala Sekolah', 'Divisi Pendidikan', 'Tata Usaha', 'TU', 'Operator', 'Wali Kelas', 'Musyrif', 'Pembimbing') || can('mutabaah.template.assign') ? [{ to: '/dashboard/mutabaah/assign-template', label: 'Assign Template' }] : []),
        ...(hasRole('Super Admin', 'Admin', 'Yayasan', 'Kepala Sekolah', 'Divisi Pendidikan', 'Tata Usaha', 'TU', 'Operator', 'Wali Kelas', 'Musyrif', 'Pembimbing') || can('mutabaah.supervisor.view') ? [{ to: '/dashboard/mutabaah/assign-pembimbing', label: 'Assign Pembimbing' }] : []),
        { to: '/dashboard/mutabaah/monitoring-orang-tua', label: 'Monitoring Orang Tua' },

      ],
    },
    // {
    //   key: 'tahfidz',
    //   label: 'TAHFIDZ',
    //   icon: BookMarked,
    //   submenus: [
    //     { to: '/dashboard/tahfizh', label: 'Hafalan' },
    //     { to: '/dashboard/tahfizh?tab=murajaah', label: 'Murajaah' },
    //   ],
    // },
    {
      key: 'laporan',
      label: 'REKAP DATA',
      icon: FileText,
      submenus: [
        { to: '/dashboard/laporan-siswa', label: 'Laporan Siswa' },
        { to: '/dashboard/laporan-absensi', label: 'Laporan Absensi Pembelajaran' },
        { to: '/dashboard/rekap-absensi-gerbang', label: 'Laporan Absensi Gerbang' },
        { to: '/dashboard/rekap-absensi-ibadah', label: 'Laporan Absensi Ibadah' },
        { to: '/dashboard/mutabaah/rekap', label: 'Laporan Mutaba’ah' },
        { to: '/dashboard/laporan-tahfizh', label: 'Laporan Tahfizh' },
        { to: '/dashboard/laporan-akademik', label: 'Laporan Akademik & Nilai' },
        { to: '/dashboard/laporan-pegawai', label: 'Laporan Pegawai & Guru' },
        { to: '/dashboard/laporan-lms', label: 'Laporan LMS' },
        { to: '/dashboard/laporan-alumni', label: 'Laporan Alumni & Prestasi' },
      ],
    },
    {
      key: 'pengaturan',
      label: 'PENGATURAN',
      icon: Settings,
      submenus: [
        { to: '/dashboard/pengaturan', label: 'Profil Sekolah' },
        { to: '/dashboard/hak-akses', label: 'Hak Akses' },
        // { to: '/dashboard/pengaturan?tab=unit', label: 'Pengaturan Unit' },
      ],
    },
  ].map((item) => (
    item.submenus
      ? { ...item, submenus: item.submenus.filter((submenu) => bolehBukaMenu(submenu.to)) }
      : item
  )).filter((item) => (
    item.submenus ? item.submenus.length > 0 : bolehBukaMenu(item.to)
  ))

  const isSubActive = (to) => {
    const targetPath = to.split('?')[0]
    if (targetPath.startsWith('/dashboard/mutabaah')) {
      return location.pathname.replace(/\/$/, '') === targetPath
    }
    if (targetPath === '/dashboard/students') {
      return location.pathname === '/dashboard/students' || location.pathname === '/dashboard/students/'
    }
    return location.pathname.startsWith(targetPath) && targetPath !== '/dashboard'
  }

  const notifikasiItems = [
    { id: 1, title: 'Setoran Tahfizh Baru', desc: 'Siswa Ahmad Faiq menyelesaikan Surah Al-Mulk', time: '10 min yang lalu', unread: true },
    { id: 2, title: 'Laporan Kehadiran Guru', desc: 'Rekap kehadiran bulan Juli telah difinalisasi', time: '1 jam yang lalu', unread: true },
    { id: 3, title: 'Jadwal Rapat Kurikulum', desc: 'Undangan rapat evaluasi Semester Ganjil 2026/2027', time: '3 jam yang lalu', unread: false },
  ]

  return (
    <div
      className={`site-shell min-h-screen text-slate-800 flex flex-col font-sans antialiased dark:bg-slate-950 dark:text-slate-100 template-${pengaturan.template}`}
      style={{
        '--site-sidebar': pengaturan.sidebar_color,
        '--site-accent': pengaturan.sidebar_accent_color,
        '--site-body': pengaturan.body_color,
        '--site-header': pengaturan.header_color,
        backgroundColor: isDarkMode ? '#0F172A' : pengaturan.body_color,
      }}
    >
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`flex flex-1 min-h-screen ${pengaturan.sidebar_position === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {/* Left Sidebar (Sticky & Collapsible) */}
        <aside
          className={`site-sidebar fixed inset-y-0 z-50 flex flex-col justify-between border-white/10 text-slate-100 transition-all duration-300 ease-in-out md:sticky md:top-0 md:h-screen ${pengaturan.sidebar_position === 'right' ? 'right-0 border-l' : 'left-0 border-r'} ${pengaturan.sidebar_style === 'light' ? 'site-sidebar-light' : ''} ${collapsed ? 'w-20' : 'w-64'
            } ${mobileMenuOpen ? 'translate-x-0 w-64' : pengaturan.sidebar_position === 'right' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          style={{
            background: pengaturan.sidebar_style === 'gradient'
              ? `linear-gradient(180deg, ${pengaturan.sidebar_color}, color-mix(in srgb, ${pengaturan.sidebar_color} 72%, #000))`
              : pengaturan.sidebar_style === 'light' ? '#FFFFFF' : pengaturan.sidebar_color,
          }}
        >
          {/* Header Sidebar: Logo & Collapsible Toggle */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-white shadow-md" style={{ backgroundColor: pengaturan.sidebar_accent_color }}>
                  {pengaturan.logo_url ? <img src={pengaturan.logo_url} alt="Logo" className="h-full w-full bg-white object-contain p-1" /> : <span className="text-[10px] font-black">{pengaturan.logo_text || <Sparkles className="h-5 w-5" />}</span>}
                </div>
                {!collapsed && (
                  <div className="min-w-0">
                    <h1 className="text-xs font-black tracking-wider text-white uppercase truncate font-sans">
                      {namaSekolah}
                    </h1>
                    <p className="text-[10px] font-bold tracking-widest" style={{ color: pengaturan.sidebar_accent_color }}>{pengaturan.application_name}</p>
                  </div>
                )}
              </div>

              {/* Desktop Toggle Button */}
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-emerald-100 hover:bg-white/20 hover:text-white transition-all btn-master"
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden text-emerald-200 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3 text-xs custom-scrollbar">
            {sidebarMenu.map((item) => {
              const Icon = item.icon
              if (!item.submenus) {
                const isActive = location.pathname === item.to
                return (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-bold transition-all duration-200 ${isActive
                      ? 'bg-white text-[#0E5C44] shadow-md dark:bg-[#10B981] dark:text-[#0d1514]'
                      : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                      }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-[#0E5C44]/10 text-[#0E5C44] dark:bg-slate-900/30 dark:text-slate-900' : 'text-emerald-300'}`}>
                      <Icon className="h-4 w-4 stroke-[2]" />
                    </div>
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                )
              }

              const isOpen = openSection === item.key
              const hasActiveChild = item.submenus.some((sub) => isSubActive(sub.to))

              return (
                <div key={item.key} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (collapsed) setCollapsed(false)
                      toggleSection(item.key)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 ${hasActiveChild || isOpen
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                      }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="h-4 w-4 shrink-0 text-[#3FBF75] stroke-[1.8]" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <span className="text-[10px]">
                        {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </span>
                    )}
                  </button>

                  {/* Submenu Accordion */}
                  {!collapsed && isOpen && (
                    <div className="ml-5 space-y-1 border-l-2 border-[#3FBF75]/40 pl-3 pt-1 animate-[masterDropdownSlide_0.2s_ease-out]">
                      {item.submenus.map((sub) => {
                        const active = isSubActive(sub.to)
                        return (
                          <NavLink
                            key={sub.label}
                            to={sub.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block rounded-lg px-2.5 py-1.5 text-xs transition-all duration-150 ${active
                              ? 'bg-[#3FBF75] text-slate-900 font-bold shadow-xs'
                              : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                            {sub.label}
                          </NavLink>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User Status Bar & Help Link at Sidebar Bottom */}
          <div className="p-3.5 border-t border-white/10 bg-black/10 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <PersonAvatar
                  src={user?.photo_url || user?.avatar_url || user?.avatar || user?.photo || user?.profile_photo_url}
                  name={namaTampil}
                  size="sm"
                  className="border border-white/20 shadow-md"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#083a2b]" />
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-white leading-tight">{namaTampil}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="truncate text-[10px] font-medium text-[#3FBF75]">{roleTampil}</p>
                    <span className="text-[9px] text-emerald-300 font-semibold">• Online</span>
                  </div>
                </div>
              )}
            </div>

            {!collapsed && (
              <p className="truncate px-2 text-[9px] text-white/55">{pengaturan.footer_text}</p>
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={() => navigate('/dashboard/pengaturan')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 text-[11px] font-semibold transition"
              >
                <HelpCircle className="h-3.5 w-3.5 text-[#3FBF75]" />
                <span>Bantuan & Panduan</span>
              </button>
            )}
          </div>
        </aside>

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar Navbar (Sticky Header) */}
          <header
            className={`${pengaturan.header_sticky ? 'sticky top-0' : 'relative'} z-30 flex h-16 items-center justify-between border-b border-slate-200/80 px-4 md:px-8 backdrop-blur-md shadow-2xs transition-colors duration-200 dark:border-slate-800/80`}
            style={{
              backgroundColor: isDarkMode
                ? 'rgba(17, 24, 39, 0.94)'
                : pengaturan.header_style === 'transparent'
                  ? 'transparent'
                  : pengaturan.header_style === 'solid'
                    ? pengaturan.header_color
                    : `${pengaturan.header_color}E6`,
            }}
          >
            {/* Left Controls: Mobile Toggle, Unit Switcher Dropdown, Search */}
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:border-slate-800 dark:text-slate-300"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Active Unit Dropdown Switcher */}
              <div className="relative" ref={unitDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-[#0E5C44]/30 transition-all dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 btn-master"
                >
                  <Layers className="h-4 w-4 text-[#0E5C44] dark:text-[#3FBF75] stroke-[2]" />
                  <span className="hidden sm:inline text-slate-500 font-medium">Unit:</span>
                  <span className="font-extrabold text-[#0E5C44] dark:text-[#3FBF75]">{activeUnit || 'Semua Unit'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {unitDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-[18px] bg-white p-1.5 shadow-2xl border border-slate-200/80 z-50 animate-[masterDropdownSlide_0.2s_ease-out] dark:bg-[#1B2433] dark:border-slate-800">
                    <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Pilih Unit Pendidikan
                    </p>
                    {daftarUnitOptions.map((unit) => (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => {
                          setActiveUnit(unit.id)
                          setUnitDropdownOpen(false)
                        }}
                        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeUnit === unit.id
                          ? 'bg-[#0E5C44]/10 text-[#0E5C44] font-bold dark:bg-[#3FBF75]/20 dark:text-[#3FBF75]'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60'
                          }`}
                      >
                        <span>{unit.name}</span>
                        {activeUnit === unit.id && <span className="h-2 w-2 rounded-full bg-[#0E5C44] dark:bg-[#3FBF75]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Global Search Bar (Expand Width on Focus) */}
              <div className="relative hidden md:flex items-center flex-1 max-w-xs transition-all duration-300 focus-within:max-w-md">
                <Search className="absolute left-3 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari siswa, guru, kelas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 pl-9 pr-8 py-1.5 text-xs font-medium placeholder-slate-400 focus:bg-white focus:border-[#0E5C44] focus:outline-none focus:ring-2 focus:ring-[#0E5C44]/30 transition-all duration-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-[#111827] dark:focus:border-[#3FBF75]"
                />
                <span className="absolute right-3 rounded-md bg-slate-200/60 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  Ctrl + K
                </span>
              </div>
            </div>

            {/* Right Controls: Date, Notifications, Profile Avatar */}
            <div className="flex items-center gap-3">
              {/* Realtime Date Display */}
              <div className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-100/70 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                <Calendar className="h-3.5 w-3.5 text-[#0E5C44] dark:text-[#3FBF75]" />
                <span>{tanggalTampil}</span>
              </div>

              {/* Super Admin: switch into a representative role session */}
              {hasRole('Super Admin') && !impersonating && (
                <div className="relative" ref={roleAccessRef}>
                  <button
                    type="button"
                    onClick={() => setRoleAccessOpen((open) => !open)}
                    aria-haspopup="menu"
                    aria-expanded={roleAccessOpen}
                    className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#0E5C44] transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                    title="Masuk sebagai role lain"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden xl:inline">Akses Role</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {roleAccessOpen && (
                    <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[18px] border border-slate-200/80 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-[#13221f]">
                      <div className="px-2 pb-2 pt-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Login sebagai</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">Pilih role untuk melihat portal dan hak aksesnya.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-0.5">
                        {roleAccessOptions.map((option) => (
                          <button
                            key={option.role}
                            type="button"
                            role="menuitem"
                            disabled={Boolean(roleAccessLoading)}
                            onClick={() => accessAsRole(option)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-[#0E5C44] disabled:cursor-wait disabled:opacity-60 dark:text-slate-200 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
                          >
                            <span>{option.label}</span>
                            {roleAccessLoading === option.role ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notification Drawer Trigger */}
              {!isPortalUser && (
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(true)}
                  className="relative rounded-xl border border-slate-200/80 bg-slate-50/80 p-2 text-slate-600 hover:bg-slate-100 hover:text-[#0E5C44] transition-all dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 btn-master"
                  title="Notifikasi Sistem"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-xs">
                    {notifikasiItems.filter((n) => n.unread).length}
                  </span>
                </button>
              )}

              {/* Mode Tampilan Switcher (Light / Dark Mode) */}
              <div className="relative" ref={themeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  aria-label="Pilih mode tampilan"
                  aria-haspopup="menu"
                  aria-expanded={themeMenuOpen}
                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 transition-all btn-master"
                  title="Pilih Mode Tampilan"
                >
                  {isDarkMode ? <Moon className="h-4 w-4 text-emerald-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                  <span className="hidden sm:inline font-semibold">{isDarkMode ? 'Night Mode' : 'Light Mode'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {themeMenuOpen && (
                  <div role="menu" className="absolute right-0 top-full mt-2 w-48 rounded-[18px] bg-white p-1.5 shadow-2xl border border-slate-200/80 z-50 animate-[masterDropdownSlide_0.2s_ease-out] dark:bg-[#13221f] dark:border-slate-800">
                    <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Mode Tampilan
                    </p>

                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={!isDarkMode}
                      onClick={() => {
                        setIsDarkMode(false)
                        setThemeMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${!isDarkMode
                        ? 'bg-[#0E5C44]/10 text-[#0E5C44] font-bold dark:bg-emerald-500/20 dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-amber-500" />
                        <span>Light Mode</span>
                      </div>
                      {!isDarkMode && <span className="h-2 w-2 rounded-full bg-[#0E5C44] dark:bg-emerald-400" />}
                    </button>

                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={isDarkMode}
                      onClick={() => {
                        setIsDarkMode(true)
                        setThemeMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${isDarkMode
                        ? 'bg-[#0E5C44]/10 text-[#0E5C44] font-bold dark:bg-emerald-500/20 dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-emerald-400" />
                        <span>Night Mode</span>
                      </div>
                      {isDarkMode && <span className="h-2 w-2 rounded-full bg-[#0E5C44] dark:bg-emerald-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* User Profile Avatar Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-all shadow-xs dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200 btn-master"
                >
                  <div className="h-7 w-7 rounded-full bg-[#0E5C44] text-white flex items-center justify-center font-bold text-xs shadow-sm border border-[#3FBF75]/30">
                    {namaTampil.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{namaTampil}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{roleTampil}</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown Popup */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-[18px] bg-white border border-slate-200/80 shadow-2xl overflow-hidden z-50 animate-[masterDropdownSlide_0.2s_ease-out] dark:bg-[#1B2433] dark:border-slate-800">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{namaTampil}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5 dark:text-slate-400">admin@dareliman.sch.id</p>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <button
                        onClick={() => {
                          navigate(isFoundationUser ? '/dashboard/yayasan/profil' : '/dashboard/profil-akun')
                          setProfileDropdownOpen(false)
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <User className="h-4 w-4 text-[#0E5C44] dark:text-[#3FBF75]" />
                        <span>Lihat Profil</span>
                      </button>
                      <button
                        onClick={() => {
                          if (hasRole('Siswa', 'Orang Tua', 'Orangtua', 'Wali Murid')) {
                            navigate('/portal-siswa/informasi-sekolah')
                          } else {
                            navigate(isFoundationUser ? '/dashboard/yayasan/notifikasi' : '/notifications')
                          }
                          setProfileDropdownOpen(false)
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Bell className="h-4 w-4 text-slate-500" />
                        <span>Notifikasi</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate(isFoundationUser ? '/dashboard/yayasan/profil' : '/dashboard/pengaturan?tab=keamanan')
                          setProfileDropdownOpen(false)
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Settings className="h-4 w-4 text-slate-500" />
                        <span>Pengaturan Akun</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 p-1.5 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          logout()
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar Sistem</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Page Workspace */}
          <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
            {impersonating && (
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100">
                <div>
                  <p className="text-xs font-extrabold">Mode akses role aktif: {roleTampil}</p>
                  <p className="mt-0.5 text-[11px] opacity-75">Anda sedang melihat sistem sebagai {namaTampil}.</p>
                </div>
                <button
                  type="button"
                  onClick={returnToSuperAdmin}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-800 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Kembali ke Super Admin
                </button>
              </div>
            )}
            <ActiveScheduleNotice />
            <Outlet />
          </main>
        </div>
      </div>

      {/* Notifications Drawer */}
      {!isPortalUser && (
        <Drawer
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          title="Pemberitahuan & Activity Log"
          position="right"
        >
          <div className="space-y-3">
            {notifikasiItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition ${item.unread
                  ? 'bg-emerald-50/50 border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-800/80'
                  : 'bg-white border-slate-200/80 dark:bg-slate-900 dark:border-slate-800/80'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h5>
                  {item.unread && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
                </div>
                <p className="text-xs text-slate-600 mt-1 dark:text-slate-300">{item.desc}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">{item.time}</p>
              </div>
            ))}
          </div>
        </Drawer>
      )}

      {/* Mobile Bottom Navigation (Responsive Mobile View <= 768px) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-slate-200/80 bg-white/95 px-2 py-2 backdrop-blur-md md:hidden shadow-lg dark:border-slate-800 dark:bg-slate-900/95">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-semibold transition ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>

        {(hasRole('Siswa', 'Orang Tua') || can('kesiswaan.data_lengkap_siswa')) && (
          <NavLink
            to={hasRole('Siswa') ? '/portal-siswa' : hasRole('Orang Tua') ? '/portal-orangtua' : '/dashboard/students'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-semibold transition ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
              }`
            }
          >
            <Database className="h-5 w-5" />
            <span>{hasRole('Siswa') ? 'Portal Siswa' : hasRole('Orang Tua') ? 'Portal Anak' : 'Data Siswa'}</span>
          </NavLink>
        )}

        {/* Action Center Trigger */}
        {(hasRole('Siswa', 'Orang Tua') || can('kesiswaan.data_lengkap_siswa')) && (
          <button
            type="button"
            onClick={() => navigate(hasRole('Siswa') ? '/portal-siswa/tugas' : hasRole('Orang Tua') ? '/portal-orangtua?tab=attendance' : '/dashboard/students?action=add')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setNotificationsOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-400"
        >
          <Bell className="h-5 w-5" />
          <span>Notifikasi</span>
        </button>

        <NavLink
          to="/dashboard/pengaturan"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-semibold transition ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
            }`
          }
        >
          <User className="h-5 w-5" />
          <span>Profil</span>
        </NavLink>
      </nav>

      {/* Floating Action Button (FAB) for Mobile Quick Add */}
      {!hasRole('Siswa', 'Orang Tua') && can('kesiswaan.data_lengkap_siswa') && <FAB onClick={() => navigate('/dashboard/students?action=add')} label="Tambah Siswa" />}

      {/* Floating Chat Pop-Up & Melayang Button */}
      <FloatingChatWidget />
    </div>
  )
}
