import { Suspense, lazy } from 'react'
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'

const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const StudentDataPage = lazy(() => import('../pages/StudentDataPage'))
const StudentsPage = lazy(() => import('../pages/StudentsPage'))
const EducationUnitsPage = lazy(() => import('../pages/EducationUnitsPage'))
const AttendancePage = lazy(() => import('../pages/AttendancePage'))
const TahfizhPage = lazy(() => import('../pages/TahfizhPage'))
const AcademicPage = lazy(() => import('../pages/AcademicPage'))
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const BeritaPublikPage = lazy(() => import('../pages/BeritaPublikPage'))
const PengaturanPage = lazy(() => import('../pages/PengaturanPage'))
const LaporanAbsensiPage = lazy(() => import('../pages/LaporanAbsensiPage'))
const LaporanTahfizhPage = lazy(() => import('../pages/LaporanTahfizhPage'))
const LaporanAkademikPage = lazy(() => import('../pages/LaporanAkademikPage'))
const LaporanSiswaPage = lazy(() => import('../pages/LaporanSiswaPage'))
const LaporanAlumniPage = lazy(() => import('../pages/LaporanAlumniPage'))
const LaporanPegawaiPage = lazy(() => import('../pages/LaporanPegawaiPage'))
const LaporanLmsPage = lazy(() => import('../pages/LaporanLmsPage'))
const RekapAbsensiGerbangPage = lazy(() => import('../pages/RekapAbsensiGerbangPage'))
const RekapAbsensiIbadahPage = lazy(() => import('../pages/RekapAbsensiIbadahPage'))
const ParentsPage = lazy(() => import('../pages/ParentsPage'))
const UserProfileManagementPage = lazy(() => import('../pages/UserProfileManagementPage'))
const EmployeesPage = lazy(() => import('../pages/EmployeesPage'))
const MasterKelasPage = lazy(() => import('../pages/MasterKelasPage'))
const MasterJabatanPage = lazy(() => import('../pages/MasterJabatanPage'))
const MasterHakAksesPage = lazy(() => import('../pages/MasterHakAksesPage'))
const MasterJenisUnitPendidikanPage = lazy(() => import('../pages/MasterJenisUnitPendidikanPage'))
const MasterTahunAjaranPage = lazy(() => import('../pages/MasterTahunAjaranPage'))
const MasterModulSemesterPage = lazy(() => import('../pages/MasterModulSemesterPage'))
const MasterKurikulumPage = lazy(() => import('../pages/MasterKurikulumPage'))
const MasterSubjectPage = lazy(() => import('../pages/MasterSubjectPage'))
const MasterSchedulePage = lazy(() => import('../pages/MasterSchedulePage'))
const MasterCapaianPembelajaranPage = lazy(() => import('../pages/MasterCapaianPembelajaranPage'))
const MasterTujuanPembelajaranPage = lazy(() => import('../pages/MasterTujuanPembelajaranPage'))
const LmsModulAjarPage = lazy(() => import('../pages/LmsModulAjarPage'))
const LmsMateriPage = lazy(() => import('../pages/LmsMateriPage'))
const LmsMediaPage = lazy(() => import('../pages/LmsMediaPage'))
const LmsReferensiPage = lazy(() => import('../pages/LmsReferensiPage'))
const LmsAktivitasBelajarPage = lazy(() => import('../pages/LmsAktivitasBelajarPage'))
const LmsDiskusiPage = lazy(() => import('../pages/LmsDiskusiPage'))
const LmsPenugasanPage = lazy(() => import('../pages/LmsPenugasanPage'))
const LmsPengumpulanTugasPage = lazy(() => import('../pages/LmsPengumpulanTugasPage'))
const AttendanceWorkspacePage = lazy(() => import('../pages/AttendanceWorkspacePage'))
const LmsKisiKisiPage = lazy(() => import('../pages/LmsKisiKisiPage'))
const LmsBankSoalPage = lazy(() => import('../pages/LmsBankSoalPage'))
const LmsUjianPage = lazy(() => import('../pages/LmsUjianPage'))
const LmsPenilaianPage = lazy(() => import('../pages/LmsPenilaianPage'))
const LmsRaporPage = lazy(() => import('../pages/LmsRaporPage'))
const StudentCrudPage = lazy(() => import('../pages/StudentCrudPage'))
const MultiRoleDashboardPage = lazy(() => import('../pages/MultiRoleDashboardPage'))
const KepalaSekolahDashboardPage = lazy(() => import('../pages/KepalaSekolahDashboardPage'))
const WaliKelasDashboardPage = lazy(() => import('../pages/WaliKelasDashboardPage'))
const DivisiPendidikanDashboardPage = lazy(() => import('../pages/DivisiPendidikanDashboardPage'))
const WakaKurikulumDashboardPage = lazy(() => import('../pages/WakaKurikulumDashboardPage'))
const WakaKesiswaanDashboardPage = lazy(() => import('../pages/WakaKesiswaanDashboardPage'))
const TataUsahaDashboardPage = lazy(() => import('../pages/TataUsahaDashboardPage'))
const GuruTahfizhDashboardPage = lazy(() => import('../pages/GuruTahfizhDashboardPage'))
const GuruBkDashboardPage = lazy(() => import('../pages/GuruBkDashboardPage'))
const OperatorDashboardPage = lazy(() => import('../pages/OperatorDashboardPage'))
const MusyrifDashboardPage = lazy(() => import('../pages/MusyrifDashboardPage'))
const AlumniPortalPage = lazy(() => import('../pages/AlumniPortalPage'))
const MonitoringDashboardPage = lazy(() => import('../pages/MonitoringDashboardPage'))
const MutabaahPage = lazy(() => import('../pages/MutabaahPage'))
const MutabaahDashboardPage = lazy(() => import('../pages/mutabaah/MutabaahDashboardPage'))
const MutabaahRecapPage = lazy(() => import('../pages/mutabaah/MutabaahRecapPage'))
const MutabaahTargetEvaluationPage = lazy(() => import('../pages/mutabaah/MutabaahTargetEvaluationPage'))
const MutabaahAgendaDetailPage = lazy(() => import('../pages/mutabaah/MutabaahAgendaDetailPage'))
const MutabaahTemplatePage = lazy(() => import('../pages/mutabaah/MutabaahTemplatePage'))
const MutabaahTemplateAssignmentPage = lazy(() => import('../pages/mutabaah/MutabaahTemplateAssignmentPage'))
const MutabaahSupervisorAssignmentPage = lazy(() => import('../pages/mutabaah/MutabaahSupervisorAssignmentPage'))
const MutabaahParentMonitoringPage = lazy(() => import('../pages/mutabaah/MutabaahParentMonitoringPage'))
const MasterQuranSurahPage = lazy(() => import('../pages/MasterQuranSurahPage'))
const MasterJadwalSholatPage = lazy(() => import('../pages/MasterJadwalSholatPage'))
const MasterDoaPage = lazy(() => import('../pages/MasterDoaPage'))
const DeleteApprovalPage = lazy(() => import('../pages/DeleteApprovalPage'))
const GateAttendancePage = lazy(() => import('../pages/GateAttendancePage'))
const WorshipAttendancePage = lazy(() => import('../pages/WorshipAttendancePage'))
const TeacherTeachingWorkspacePage = lazy(() => import('../pages/TeacherTeachingWorkspacePage'))
const ParentPortalPage = lazy(() => import('../pages/ParentPortalPage'))
const StudentPortalPage = lazy(() => import('../pages/StudentPortalPage'))
const TeacherStudentPortalDashboardPage = lazy(() => import('../pages/TeacherStudentPortalDashboardPage'))
const EmployeeChatPage = lazy(() => import('../pages/EmployeeChatPage'))
const StudentAttendancePage = lazy(() => import('../pages/attendance/StudentAttendancePage'))
const StudentAttendanceHistoryPage = lazy(() => import('../pages/attendance/StudentAttendanceHistoryPage'))
const AcademicLmsContainerPage = lazy(() => import('../pages/AcademicLmsContainerPage'))

const FoundationDashboardPage = lazy(() => import('../pages/foundation/FoundationDashboardPage').then(m => ({ default: m.FoundationDashboardPage })))
const FoundationUnitsPage = lazy(() => import('../pages/foundation/FoundationUnitsPage').then(m => ({ default: m.FoundationUnitsPage })))
const FoundationUnitDetailPage = lazy(() => import('../pages/foundation/FoundationUnitDetailPage').then(m => ({ default: m.FoundationUnitDetailPage })))
const FoundationEmployeesPage = lazy(() => import('../pages/foundation/FoundationEmployeesPage').then(m => ({ default: m.FoundationEmployeesPage })))
const FoundationStudentsPage = lazy(() => import('../pages/foundation/FoundationStudentsPage').then(m => ({ default: m.FoundationStudentsPage })))
const FoundationNewStudentsPage = lazy(() => import('../pages/foundation/FoundationNewStudentsPage').then(m => ({ default: m.FoundationNewStudentsPage })))
const FoundationMutationsPage = lazy(() => import('../pages/foundation/FoundationMutationsPage').then(m => ({ default: m.FoundationMutationsPage })))
const FoundationGraduationAlumniPage = lazy(() => import('../pages/foundation/FoundationGraduationAlumniPage').then(m => ({ default: m.FoundationGraduationAlumniPage })))
const FoundationInformationPage = lazy(() => import('../pages/foundation/FoundationInformationPage').then(m => ({ default: m.FoundationInformationPage })))
const FoundationReportsPage = lazy(() => import('../pages/foundation/FoundationReportsPage').then(m => ({ default: m.FoundationReportsPage })))
const FoundationLaporanSdmPage = lazy(() => import('../pages/foundation/reports/LaporanSdmPage').then(m => ({ default: m.LaporanSdmPage })))
const FoundationLaporanSiswaPage = lazy(() => import('../pages/foundation/reports/LaporanSiswaPage').then(m => ({ default: m.LaporanSiswaPage })))
const FoundationLaporanMutasiPage = lazy(() => import('../pages/foundation/reports/LaporanMutasiPage').then(m => ({ default: m.LaporanMutasiPage })))
const FoundationLaporanKelulusanPage = lazy(() => import('../pages/foundation/reports/LaporanKelulusanPage').then(m => ({ default: m.LaporanKelulusanPage })))
const FoundationLaporanAlumniPage = lazy(() => import('../pages/foundation/reports/LaporanAlumniPage').then(m => ({ default: m.LaporanAlumniPage })))
const FoundationLaporanLintasUnitPage = lazy(() => import('../pages/foundation/reports/LaporanLintasUnitPage').then(m => ({ default: m.LaporanLintasUnitPage })))
const FoundationNotificationsPage = lazy(() => import('../pages/foundation/FoundationNotificationsPage').then(m => ({ default: m.FoundationNotificationsPage })))
const FoundationProfilePage = lazy(() => import('../pages/foundation/FoundationProfilePage').then(m => ({ default: m.FoundationProfilePage })))
import RouteErrorElement from '../components/common/RouteErrorElement'
import { useAuthStore } from '../stores/authStore'
import { hasAnyRole, resolveDefaultPortal } from '../auth/portalResolver'

const portalDestination = (roles) => resolveDefaultPortal({ roles })

function BungkusLazy({ children }) {
  return <Suspense fallback={<section className="panel">Memuat halaman...</section>}>{children}</Suspense>
}

function RouteTerlindungi() {
  const token = localStorage.getItem('school_erp_token')

  if (!token) {
    return <Navigate to="/masuk" replace />
  }

  return <Outlet />
}

function RouteRole({ allow, children }) {
  const roles = useAuthStore((state) => state.user?.roles || [])
  const isSuperAdmin = hasAnyRole(roles, ['Super Admin'])
  if (!isSuperAdmin && !hasAnyRole(roles, allow)) {
    return <Navigate to={portalDestination(roles)} replace />
  }
  return children || <Outlet />
}

function RoleElement({ allow, children }) {
  const roles = useAuthStore((state) => state.user?.roles || [])
  const isSuperAdmin = hasAnyRole(roles, ['Super Admin'])
  if (!isSuperAdmin && !hasAnyRole(roles, allow)) return <Navigate to={portalDestination(roles)} replace />
  return children
}

function PermissionElement({ any = [], children }) {
  const user = useAuthStore((state) => state.user)
  const roles = user?.roles || []
  const permissions = user?.permissions || []
  const isSuperAdmin = hasAnyRole(roles, ['Super Admin'])
  const hasPermission = any.length === 0 || any.some((permission) => permissions.includes(permission))

  if (!isSuperAdmin && !hasPermission) {
    return <Navigate to={portalDestination(roles)} replace />
  }

  return children || <Outlet />
}


function AbsensiIndex() {
  const roles = useAuthStore((state) => state.user?.roles || [])
  if (hasAnyRole(roles, ['Wali Kelas'])) return <Navigate to="/absensi/dashboard-wali-kelas" replace />
  if (hasAnyRole(roles, ['Guru'])) return <Navigate to="/absensi/dashboard-guru" replace />
  if (hasAnyRole(roles, ['Siswa'])) return <Navigate to="/absensi/kehadiran-saya" replace />
  return <Navigate to="/dashboard" replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <BungkusLazy>
        <BeritaPublikPage />
      </BungkusLazy>
    ),
  },
  {
    path: '/masuk',
    element: (
      <BungkusLazy>
        <LoginPage />
      </BungkusLazy>
    ),
  },
  {
    path: '/masuk-keluarga',
    element: <Navigate to="/masuk" replace />,
  },
  {
    path: '/auth',
    element: (
      <BungkusLazy>
        <LoginPage />
      </BungkusLazy>
    ),
  },
  {
    path: '/authentication',
    element: (
      <BungkusLazy>
        <LoginPage />
      </BungkusLazy>
    ),
  },
  {
    element: <RouteTerlindungi />,
    errorElement: <RouteErrorElement />,
    children: [
      {
        path: '/portal-guru',
        element: (
          <RouteRole allow={['Guru', 'Guru Mata Pelajaran', 'Guru PAI', 'Pembimbing', 'Wali Kelas', 'Guru Tahfizh', 'Guru BK', 'Musyrif', 'Musyrifah', 'Musyrif / Musyrifah']}>
            <BungkusLazy>
              <DashboardLayout />
            </BungkusLazy>
          </RouteRole>
        ),
        children: [
          { index: true, element: <BungkusLazy><TeacherStudentPortalDashboardPage /></BungkusLazy> },
          { path: 'workspace', element: <BungkusLazy><TeacherTeachingWorkspacePage /></BungkusLazy> },
        ],
      },
      {
        path: '/portal-orangtua',
        element: (
          <BungkusLazy>
            <DashboardLayout />
          </BungkusLazy>
        ),
        children: [{ element: <RouteRole allow={['Orang Tua', 'Orangtua', 'Wali Murid', 'orang_tua', 'parent']} />, children: [
          { index: true, element: <BungkusLazy><ParentPortalPage /></BungkusLazy> },
        ] }],
      },
      {
        path: '/portal-siswa',
        element: (
          <BungkusLazy>
            <DashboardLayout />
          </BungkusLazy>
        ),
        children: [{ element: <RouteRole allow={['Siswa', 'siswa', 'student']} />, children: [
          { index: true, element: <BungkusLazy><StudentPortalPage section="ringkasan" /></BungkusLazy> },
          { path: 'profil', element: <BungkusLazy><StudentPortalPage section="profile" /></BungkusLazy> },
          { path: 'informasi-sekolah', element: <BungkusLazy><StudentPortalPage section="announcements" /></BungkusLazy> },
          { path: 'jadwal', element: <BungkusLazy><StudentPortalPage section="schedules" /></BungkusLazy> },
          { path: 'materi', element: <BungkusLazy><StudentPortalPage section="materials" /></BungkusLazy> },
          { path: 'tugas', element: <BungkusLazy><StudentPortalPage section="assignments" /></BungkusLazy> },
          { path: 'tahfizh', element: <BungkusLazy><StudentPortalPage section="tahfizh" /></BungkusLazy> },
          { path: 'nilai', element: <BungkusLazy><StudentPortalPage section="grades" /></BungkusLazy> },
          { path: 'komentar-guru', element: <BungkusLazy><StudentPortalPage section="student-notes" /></BungkusLazy> },
          { path: 'mutabaah', element: <BungkusLazy><StudentPortalPage section="mutabaah" /></BungkusLazy> },
          { path: 'absensi', element: <BungkusLazy><StudentPortalPage section="attendance" /></BungkusLazy> },
          { path: 'kisi-kisi', element: <BungkusLazy><StudentPortalPage section="kisi" /></BungkusLazy> },
          { path: 'ujian-cbt', element: <BungkusLazy><StudentPortalPage section="ujian" /></BungkusLazy> },
          { path: 'hasil', element: <BungkusLazy><StudentPortalPage section="hasil" /></BungkusLazy> },
        ] }],
      },
      {
        path: '/portal/orang-tua',
        element: (
          <BungkusLazy>
            <DashboardLayout />
          </BungkusLazy>
        ),
        children: [{ element: <RouteRole allow={['Orang Tua', 'Orangtua', 'Wali Murid', 'orang_tua', 'parent']} />, children: [
          { index: true, element: <BungkusLazy><ParentPortalPage /></BungkusLazy> },
        ] }],
      },
      {
        path: '/portal/siswa',
        element: (
          <BungkusLazy>
            <DashboardLayout />
          </BungkusLazy>
        ),
        children: [{ element: <RouteRole allow={['Siswa', 'siswa', 'student']} />, children: [
          { index: true, element: <BungkusLazy><StudentPortalPage section="ringkasan" /></BungkusLazy> },
        ] }],
      },
      {
        path: '/portal/alumni',
        element: (
          <BungkusLazy>
            <DashboardLayout />
          </BungkusLazy>
        ),
        children: [{ element: <RouteRole allow={['Alumni', 'Super Admin', 'SuperAdmin']} />, children: [
          { index: true, element: <BungkusLazy><AlumniPortalPage /></BungkusLazy> },
        ] }],
      },
      {
        path: '/portal-alumni',
        element: (
          <BungkusLazy>
            <DashboardLayout />
          </BungkusLazy>
        ),
        children: [{ element: <RouteRole allow={['Alumni', 'Super Admin', 'SuperAdmin']} />, children: [
          { index: true, element: <BungkusLazy><AlumniPortalPage /></BungkusLazy> },
        ] }],
      },
      {
        path: '/absensi',
        element: (
          <RouteRole allow={['Super Admin', 'Admin', 'Yayasan', 'Ketua Yayasan', 'Pengurus Yayasan', 'Divisi Pendidikan', 'Kepala Sekolah', 'Waka Kurikulum', 'Waka Kesiswaan', 'Tata Usaha', 'TU', 'Operator', 'Guru', 'Wali Kelas', 'Guru Tahfizh', 'Guru BK', 'Musyrif', 'Siswa']}>
            <BungkusLazy>
              <DashboardLayout />
            </BungkusLazy>
          </RouteRole>
        ),
        children: [
          { index: true, element: <AbsensiIndex /> },
          { path: 'dashboard-guru', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'jadwal-mengajar', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'presensi', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'presensi/tambah', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'presensi/:id', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'presensi/:id/edit', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'riwayat-guru', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'dashboard-wali-kelas', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'rekap-kehadiran', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'verifikasi-izin', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'koreksi', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'tindak-lanjut', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { path: 'tindak-lanjut/tambah', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          { element: <RouteRole allow={['Siswa', 'siswa', 'student']} />, children: [
            { element: <PermissionElement any={['student_attendance.view_own']} />, children: [
              { path: 'kehadiran-saya', element: <BungkusLazy><StudentAttendancePage /></BungkusLazy> },
              { path: 'riwayat-saya', element: <BungkusLazy><StudentAttendanceHistoryPage /></BungkusLazy> },
            ] },
            { path: 'pengajuan-izin', element: <Navigate to="/portal-siswa" replace /> },
            { path: 'pengajuan-izin/tambah', element: <Navigate to="/portal-siswa" replace /> },
            { path: 'pengajuan-izin/:id', element: <Navigate to="/portal-siswa" replace /> },
            { path: 'pengajuan-izin/:id/edit', element: <Navigate to="/portal-siswa" replace /> },
          ] },
          { path: 'laporan', element: <BungkusLazy><AttendanceWorkspacePage /></BungkusLazy> },
          {
            path: '*',
            element: (
              <BungkusLazy>
                <AttendanceWorkspacePage />
              </BungkusLazy>
            ),
          },
        ],
      },
      {
        path: '/dashboard',
        element: (
          <RouteRole allow={['Super Admin', 'Admin', 'Yayasan', 'Ketua Yayasan', 'Pengurus Yayasan', 'Sekretaris Yayasan', 'Bendahara Yayasan', 'Divisi Pendidikan', 'Kepala Bidang Pendidikan', 'Divisi Kurikulum', 'Divisi Kesiswaan', 'Divisi Bahasa', 'Divisi Program Khusus', 'Kepala Sekolah', 'Wakil Kepala Sekolah', 'Waka Kurikulum', 'Wakil Kurikulum', 'Waka Kesiswaan', 'Wakil Kesiswaan', 'Tata Usaha', 'TU', 'Operator', 'Guru', 'Wali Kelas', 'Guru Tahfizh', 'Guru BK', 'Musyrif']}>
            <BungkusLazy>
              <DashboardLayout />
            </BungkusLazy>
          </RouteRole>
        ),
        children: [
          {
            index: true,
            element: (
              <BungkusLazy>
                <MultiRoleDashboardPage />
              </BungkusLazy>
            ),
          },
           {
             path: 'yayasan',
             element: <PermissionElement any={['foundation.dashboard.view']} />,
             children: [
               { index: true, element: <BungkusLazy><FoundationDashboardPage /></BungkusLazy> },
               { path: 'unit-pendidikan', element: <BungkusLazy><FoundationUnitsPage /></BungkusLazy> },
               { path: 'unit-pendidikan/:id', element: <BungkusLazy><FoundationUnitDetailPage /></BungkusLazy> },
               { path: 'pegawai-guru', element: <BungkusLazy><FoundationEmployeesPage /></BungkusLazy> },
               { path: 'pegawai-guru/:id', element: <BungkusLazy><FoundationEmployeesPage /></BungkusLazy> },
               { path: 'siswa', element: <BungkusLazy><FoundationStudentsPage /></BungkusLazy> },
               { path: 'siswa/:id', element: <BungkusLazy><FoundationStudentsPage /></BungkusLazy> },
               { path: 'siswa-baru', element: <BungkusLazy><FoundationNewStudentsPage /></BungkusLazy> },
               { path: 'mutasi-siswa', element: <BungkusLazy><FoundationMutationsPage /></BungkusLazy> },
               { path: 'kelulusan-alumni', element: <BungkusLazy><FoundationGraduationAlumniPage /></BungkusLazy> },
               { path: 'informasi-sekolah', element: <BungkusLazy><FoundationInformationPage /></BungkusLazy> },
               { path: 'laporan', element: <BungkusLazy><FoundationReportsPage /></BungkusLazy> },
               { path: 'laporan/sdm', element: <BungkusLazy><FoundationLaporanSdmPage /></BungkusLazy> },
               { path: 'laporan/siswa', element: <BungkusLazy><FoundationLaporanSiswaPage /></BungkusLazy> },
               { path: 'laporan/mutasi', element: <BungkusLazy><FoundationLaporanMutasiPage /></BungkusLazy> },
               { path: 'laporan/kelulusan', element: <BungkusLazy><FoundationLaporanKelulusanPage /></BungkusLazy> },
               { path: 'laporan/alumni', element: <BungkusLazy><FoundationLaporanAlumniPage /></BungkusLazy> },
               { path: 'laporan/lintas-unit', element: <BungkusLazy><FoundationLaporanLintasUnitPage /></BungkusLazy> },
               { path: 'notifikasi', element: <BungkusLazy><FoundationNotificationsPage /></BungkusLazy> },
               { path: 'profil', element: <BungkusLazy><FoundationProfilePage /></BungkusLazy> },
             ],
           },
           { path: 'kepala-sekolah', element: <PermissionElement any={['dashboard.kepala-sekolah.view']}><BungkusLazy><KepalaSekolahDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'wali-kelas', element: <PermissionElement any={['dashboard.guru.view']}><BungkusLazy><WaliKelasDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'divisi-pendidikan', element: <PermissionElement any={['dashboard.divisi-pendidikan.view']}><BungkusLazy><DivisiPendidikanDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'waka-kurikulum', element: <PermissionElement any={['dashboard.waka-kurikulum.view']}><BungkusLazy><WakaKurikulumDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'waka-kesiswaan', element: <PermissionElement any={['dashboard.waka-kesiswaan.view']}><BungkusLazy><WakaKesiswaanDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'tata-usaha', element: <PermissionElement any={['dashboard.tata-usaha.view']}><BungkusLazy><TataUsahaDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'guru-tahfizh', element: <PermissionElement any={['dashboard.guru-tahfizh.view']}><BungkusLazy><GuruTahfizhDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'guru-bk', element: <PermissionElement any={['dashboard.guru-bk.view']}><BungkusLazy><GuruBkDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'operator', element: <PermissionElement any={['dashboard.operator.view']}><BungkusLazy><OperatorDashboardPage /></BungkusLazy></PermissionElement> },
           { path: 'musyrif', element: <PermissionElement any={['dashboard.guru-tahfizh.view']}><BungkusLazy><MusyrifDashboardPage /></BungkusLazy></PermissionElement> },
          { path: 'chat-pegawai', element: <BungkusLazy><EmployeeChatPage /></BungkusLazy> },
          { path: 'akademik', element: <Navigate to="/dashboard/akademik/dashboard" replace /> },
          { path: 'akademik/dashboard', element: <BungkusLazy><AcademicPage /></BungkusLazy> },
          { path: 'akademik/pengaturan', element: <BungkusLazy><AcademicLmsContainerPage section="pengaturan" /></BungkusLazy> },
          { path: 'akademik/perencanaan', element: <BungkusLazy><AcademicLmsContainerPage section="perencanaan" /></BungkusLazy> },
          { path: 'akademik/pembelajaran', element: <BungkusLazy><AcademicLmsContainerPage section="pembelajaran" /></BungkusLazy> },
          { path: 'akademik/evaluasi', element: <BungkusLazy><AcademicLmsContainerPage section="evaluasi" /></BungkusLazy> },
          { path: 'akademik/nilai-rapor', element: <BungkusLazy><AcademicLmsContainerPage section="nilai-rapor" /></BungkusLazy> },
          {
            path: 'pemantauan',
            element: (
              <PermissionElement any={['dashboard.pemantauan.lihat', 'teacher_monitoring.view']}>
                <BungkusLazy>
                  <MonitoringDashboardPage />
                </BungkusLazy>
              </PermissionElement>
            ),
          },
          {
            path: 'crud-demo',
            element: (
              <BungkusLazy>
                <StudentCrudPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'students',
            element: (
              <BungkusLazy>
                <StudentDataPage />
              </BungkusLazy>
            ),
            children: [
              {
                index: true,
                element: (
                  <PermissionElement any={['kesiswaan.data_lengkap_siswa']}>
                    <BungkusLazy><StudentsPage /></BungkusLazy>
                  </PermissionElement>
                ),
              },
              {
                path: 'input',
                element: (
                  <PermissionElement any={['kesiswaan.data_lengkap_siswa']}>
                    <BungkusLazy><StudentsPage /></BungkusLazy>
                  </PermissionElement>
                ),
              },
              {
                path: 'kelas',
                element: (
                  <PermissionElement any={['kesiswaan.kelas_rombel']}>
                    <BungkusLazy><MasterKelasPage /></BungkusLazy>
                  </PermissionElement>
                ),
              },
              {
                path: 'unit-pendidikan',
                element: (
                  <BungkusLazy>
                    <EducationUnitsPage />
                  </BungkusLazy>
                ),
              },
              {
                path: 'pegawai',
                element: (
                  <BungkusLazy>
                    <EmployeesPage />
                  </BungkusLazy>
                ),
              },
              {
                path: 'jabatan',
                element: (
                  <BungkusLazy>
                    <MasterJabatanPage />
                  </BungkusLazy>
                ),
              },
              {
                path: 'rombel',
                element: (
                  <PermissionElement any={['kesiswaan.kelas_rombel']}>
                    <BungkusLazy><MasterKelasPage /></BungkusLazy>
                  </PermissionElement>
                ),
              },
              {
                path: 'laporan',
                element: (
                  <PermissionElement any={['kesiswaan.data_lengkap_siswa']}>
                    <BungkusLazy><StudentsPage /></BungkusLazy>
                  </PermissionElement>
                ),
              },
            ],
          },
          {
            path: 'employees',
            element: (
              <BungkusLazy>
                <EmployeesPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-jabatan',
            element: (
              <BungkusLazy>
                <MasterJabatanPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-jenis-unit',
            element: (
              <BungkusLazy>
                <MasterJenisUnitPendidikanPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-tahun-ajaran',
            element: (
              <BungkusLazy>
                <MasterTahunAjaranPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-quran-surah',
            element: (
              <PermissionElement any={['sistem.master_data']}>
                <BungkusLazy>
                  <MasterQuranSurahPage />
                </BungkusLazy>
              </PermissionElement>
            ),
          },
          {
            path: 'master-jadwal-sholat',
            element: (
              <PermissionElement any={['sistem.master_data']}>
                <BungkusLazy>
                  <MasterJadwalSholatPage />
                </BungkusLazy>
              </PermissionElement>
            ),
          },
          {
            path: 'master/unit-pendidikan',
            element: (
              <BungkusLazy>
                <EducationUnitsPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master/guru',
            element: (
              <BungkusLazy>
                <EmployeesPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master/pegawai',
            element: (
              <BungkusLazy>
                <EmployeesPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master/siswa',
            element: (
              <BungkusLazy>
                <StudentsPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master/orang-tua',
            element: (
              <BungkusLazy>
                <ParentsPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master/alumni',
            element: (
              <BungkusLazy>
                <FoundationGraduationAlumniPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'akademik/kelas',
            element: (
              <BungkusLazy>
                <MasterKelasPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'akademik/rombel',
            element: (
              <BungkusLazy>
                <MasterKelasPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'persetujuan-hapus',
            element: (
              <BungkusLazy>
                <DeleteApprovalPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-doa',
            element: (
              <PermissionElement any={['sistem.master_data']}>
                <BungkusLazy>
                  <MasterDoaPage />
                </BungkusLazy>
              </PermissionElement>
            ),
          },
          {
            path: 'hak-akses',
            element: (
              <BungkusLazy>
                <MasterHakAksesPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'attendance',
            element: (
              <BungkusLazy>
                <AttendancePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'absensi-gerbang',
            element: (
              <BungkusLazy>
                <GateAttendancePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'absensi-ibadah',
            element: (
              <BungkusLazy>
                <WorshipAttendancePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'tahfizh',
            element: (
              <PermissionElement any={['kesiswaan.kelas_rombel', 'academic.schedule.view', 'sistem.master_data']}>
                <BungkusLazy>
                  <TahfizhPage />
                </BungkusLazy>
              </PermissionElement>
            ),
          },
          {
            path: 'academic',
            element: (
              <BungkusLazy>
                <AcademicPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'modul-ajar',
            element: (
              <BungkusLazy>
                <LmsModulAjarPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/modul-ajar',
            element: (
              <BungkusLazy>
                <LmsModulAjarPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-modul-semester',
            element: (
              <BungkusLazy>
                <MasterModulSemesterPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-kurikulum',
            element: (
              <BungkusLazy>
                <MasterKurikulumPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-subjects',
            element: (
              <BungkusLazy>
                <MasterSubjectPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'jadwal-pelajaran',
            element: (
              <BungkusLazy>
                <MasterSchedulePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-capaian-pembelajaran',
            element: (
              <BungkusLazy>
                <MasterCapaianPembelajaranPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/capaian-pembelajaran',
            element: (
              <BungkusLazy>
                <MasterCapaianPembelajaranPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'master-tujuan-pembelajaran',
            element: (
              <BungkusLazy>
                <MasterTujuanPembelajaranPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/tujuan-pembelajaran',
            element: (
              <BungkusLazy>
                <MasterTujuanPembelajaranPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'materi-pembelajaran',
            element: (
              <BungkusLazy>
                <LmsMateriPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/materi-pembelajaran',
            element: (
              <BungkusLazy>
                <LmsMateriPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/materi',
            element: (
              <BungkusLazy>
                <LmsMateriPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'media-pembelajaran',
            element: (
              <BungkusLazy>
                <LmsMediaPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/media-pembelajaran',
            element: (
              <BungkusLazy>
                <LmsMediaPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/media',
            element: (
              <BungkusLazy>
                <LmsMediaPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'referensi-pembelajaran',
            element: (
              <BungkusLazy>
                <LmsReferensiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/referensi-pembelajaran',
            element: (
              <BungkusLazy>
                <LmsReferensiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/referensi',
            element: (
              <BungkusLazy>
                <LmsReferensiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'aktivitas-belajar',
            element: (
              <BungkusLazy>
                <LmsAktivitasBelajarPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/aktivitas-belajar',
            element: (
              <BungkusLazy>
                <LmsAktivitasBelajarPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/aktivitas',
            element: (
              <BungkusLazy>
                <LmsAktivitasBelajarPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'diskusi-kelas',
            element: (
              <BungkusLazy>
                <LmsDiskusiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/diskusi-kelas',
            element: (
              <BungkusLazy>
                <LmsDiskusiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/diskusi',
            element: (
              <BungkusLazy>
                <LmsDiskusiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'penugasan',
            element: (
              <BungkusLazy>
                <LmsPenugasanPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/penugasan',
            element: (
              <BungkusLazy>
                <LmsPenugasanPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'pengumpulan-tugas',
            element: (
              <BungkusLazy>
                <LmsPengumpulanTugasPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/pengumpulan-tugas',
            element: (
              <BungkusLazy>
                <LmsPengumpulanTugasPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'absensi-pembelajaran',
            element: (
              <BungkusLazy>
                <AttendanceWorkspacePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'presensi-pembelajaran',
            element: (
              <BungkusLazy>
                <AttendanceWorkspacePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/presensi-pembelajaran',
            element: (
              <BungkusLazy>
                <AttendanceWorkspacePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'absensi/*',
            element: (
              <BungkusLazy>
                <AttendanceWorkspacePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'kisi-kisi-ujian',
            element: (
              <BungkusLazy>
                <LmsKisiKisiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/kisi-kisi',
            element: (
              <BungkusLazy>
                <LmsKisiKisiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'bank-soal',
            element: (
              <BungkusLazy>
                <LmsBankSoalPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/bank-soal',
            element: (
              <BungkusLazy>
                <LmsBankSoalPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'ujian-online',
            element: (
              <BungkusLazy>
                <LmsUjianPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/ujian-online',
            element: (
              <BungkusLazy>
                <LmsUjianPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/ujian',
            element: (
              <BungkusLazy>
                <LmsUjianPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'penilaian',
            element: (
              <BungkusLazy>
                <LmsPenilaianPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/penilaian',
            element: (
              <BungkusLazy>
                <LmsPenilaianPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/penilaian-rapor',
            element: (
              <BungkusLazy>
                <LmsRaporPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'lms/rapor',
            element: (
              <BungkusLazy>
                <LmsRaporPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'mutabaah',
            element: (
              <BungkusLazy>
                <MutabaahDashboardPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'mutabaah/rekap',
            element: (
              <BungkusLazy>
                <MutabaahRecapPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'mutabaah/target-evaluasi',
            element: (
              <BungkusLazy>
                <MutabaahTargetEvaluationPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'mutabaah/rincian-agenda',
            element: (
              <BungkusLazy>
                <MutabaahAgendaDetailPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'mutabaah/template-agenda',
            element: (
              <BungkusLazy>
                <MutabaahTemplatePage />
              </BungkusLazy>
            ),
          },
          {
            path: 'mutabaah/assign-template',
            element: (
              <BungkusLazy>
                <MutabaahTemplateAssignmentPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'mutabaah/assign-pembimbing',
            element: (
              <BungkusLazy>
                <MutabaahSupervisorAssignmentPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'mutabaah/monitoring-orang-tua',
            element: (
              <BungkusLazy>
                <MutabaahParentMonitoringPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'parents',
            element: (
              <BungkusLazy>
                <ParentsPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'notifications',
            element: (
              <BungkusLazy>
                <NotificationsPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'pengaturan',
            element: (
              <BungkusLazy>
                <PengaturanPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'laporan-absensi',
            element: (
              <BungkusLazy>
                <LaporanAbsensiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'laporan-tahfizh',
            element: (
              <BungkusLazy>
                <LaporanTahfizhPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'laporan-akademik',
            element: (
              <BungkusLazy>
                <LaporanAkademikPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'laporan-siswa',
            element: (
              <BungkusLazy>
                <LaporanSiswaPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'laporan-pegawai',
            element: (
              <BungkusLazy>
                <LaporanPegawaiPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'laporan-lms',
            element: (
              <BungkusLazy>
                <LaporanLmsPage />
              </BungkusLazy>
            ),
          },
          {
            path: 'laporan-alumni',
            element: (
              <BungkusLazy>
                <LaporanAlumniPage />
              </BungkusLazy>
            ),
          },
          { path: 'rekap-absensi-gerbang', element: <BungkusLazy><RekapAbsensiGerbangPage /></BungkusLazy> },
          { path: 'rekap-absensi-ibadah', element: <BungkusLazy><RekapAbsensiIbadahPage /></BungkusLazy> },
          {
            path: 'profil-akun',
            element: (
              <BungkusLazy>
                <UserProfileManagementPage />
              </BungkusLazy>
            ),
          },
        ],
      },
    ],
  },
])

export default router
