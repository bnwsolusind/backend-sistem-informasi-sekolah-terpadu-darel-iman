import React from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import SuperAdminDashboardPage from './SuperAdminDashboardPage'

const normalizeRole = (role) => String(role).toLowerCase().replace(/[\s_-]+/g, '')
const hasAnyRole = (roles, allowedRoles) =>
  allowedRoles.some((allowed) => roles.some((role) => normalizeRole(role) === normalizeRole(allowed)))

const roleDashboardRoutes = [
  { roles: ['Guru', 'guru', 'Guru Mata Pelajaran', 'Guru PAI', 'Pembimbing'], route: '/portal-guru' },
  { roles: ['Wali Kelas', 'walas', 'wali_kelas'], route: '/dashboard/wali-kelas' },
  { roles: ['Guru Tahfizh', 'Musyrif', 'Musyrifah', 'Musyrif / Musyrifah', 'guru_tahfizh'], route: '/dashboard/guru-tahfizh' },
  { roles: ['Kepala Sekolah', 'kepala_sekolah', 'kepsek'], route: '/dashboard/kepala-sekolah' },
  { roles: ['Divisi Pendidikan', 'divisi_pendidikan'], route: '/dashboard/divisi-pendidikan' },
  { roles: ['Waka Kurikulum', 'waka_kurikulum', 'Wakil Kepala Sekolah'], route: '/dashboard/waka-kurikulum' },
  { roles: ['Waka Kesiswaan', 'waka_kesiswaan'], route: '/dashboard/waka-kesiswaan' },
  { roles: ['Tata Usaha', 'TU', 'tu', 'tata_usaha'], route: '/dashboard/tata-usaha' },
  { roles: ['Guru BK', 'guru_bk'], route: '/dashboard/guru-bk' },
  { roles: ['Operator', 'operator'], route: '/dashboard/operator' },
  { roles: ['Alumni', 'alumni'], route: '/portal/alumni' },
]

export default function MultiRoleDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const roles = user?.roles || []
  const permissions = user?.permissions || []

  const isSuperAdmin = hasAnyRole(roles, ['Super Admin', 'super_admin'])

  if (isSuperAdmin) {
    return <SuperAdminDashboardPage />
  }

  const isFoundationUser =
    hasAnyRole(roles, ['Yayasan', 'Ketua Yayasan', 'sekretaris_yayasan', 'bendahara_yayasan', 'pengurus_yayasan', 'Pengurus Yayasan']) ||
    permissions.includes('foundation.dashboard.view')

  if (isFoundationUser) {
    return <Navigate to="/dashboard/yayasan" replace />
  }

  if (hasAnyRole(roles, ['Siswa', 'siswa', 'student'])) {
    return <Navigate to="/portal-siswa" replace />
  }

  if (hasAnyRole(roles, ['Orang Tua', 'Orangtua', 'Wali Murid', 'orang_tua', 'parent'])) {
    return <Navigate to="/portal-orangtua" replace />
  }

  const resolvedRoute = roleDashboardRoutes.find(({ roles: allowedRoles }) =>
    roles.some((role) => allowedRoles.some((allowed) => normalizeRole(role) === normalizeRole(allowed))),
  )?.route

  if (resolvedRoute) {
    return <Navigate to={resolvedRoute} replace />
  }

  // Admin dan role tanpa dashboard khusus: halaman Pemantauan (dashboard.pemantauan.lihat).
  // Bila tidak punya akses dashboard apa pun, tampilkan pesan jelas (bukan dashboard rusak).
  if (permissions.includes('dashboard.pemantauan.lihat')) {
    return <Navigate to="/dashboard/pemantauan" replace />
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <ShieldAlert className="h-10 w-10 text-amber-500" />
      <h1 className="text-lg font-semibold text-slate-800">Akses Dashboard Tidak Tersedia</h1>
      <p className="max-w-md text-sm text-slate-500">
        Akun Anda belum memiliki hak akses ke dashboard mana pun. Hubungi Super Admin untuk
        penetapan role/permission.
      </p>
    </div>
  )
}
