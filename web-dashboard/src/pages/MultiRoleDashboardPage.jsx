import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import SuperAdminDashboardPage from './SuperAdminDashboardPage'
import DashboardPage from './DashboardPage'

const roleDashboardRoutes = [
  { roles: ['Guru'], route: '/portal-guru' },
  { roles: ['Wali Kelas'], route: '/dashboard/wali-kelas' },
  { roles: ['Guru Tahfizh', 'Musyrif', 'Musyrifah'], route: '/dashboard/guru-tahfizh' },
  { roles: ['Kepala Sekolah'], route: '/dashboard/kepala-sekolah' },
  { roles: ['Divisi Pendidikan'], route: '/dashboard/divisi-pendidikan' },
  { roles: ['Tata Usaha', 'TU'], route: '/dashboard/tata-usaha' },
  { roles: ['Wakil Kepala Sekolah'], route: '/dashboard/waka-kurikulum' },
  { roles: ['Guru BK'], route: '/dashboard/guru-bk' },
  { roles: ['Operator'], route: '/dashboard/operator' },
  { roles: ['Alumni'], route: '/portal/alumni' },
]

export default function MultiRoleDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const roles = user?.roles || []
  const permissions = user?.permissions || []

  const isSuperAdmin = roles.some((r) => r.toLowerCase().replace(/\s+/g, '') === 'superadmin')

  if (isSuperAdmin) {
    return <SuperAdminDashboardPage />
  }

  const isFoundationUser =
    roles.some((r) =>
      ['Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'sekretaris_yayasan', 'bendahara_yayasan', 'pengurus_yayasan'].includes(r)
    ) || permissions.includes('foundation.dashboard.view')

  if (isFoundationUser) {
    return <Navigate to="/dashboard/yayasan" replace />
  }

  if (roles.includes('Siswa')) {
    return <Navigate to="/portal-siswa" replace />
  }

  if (roles.includes('Orang Tua')) {
    return <Navigate to="/portal-orangtua" replace />
  }

  const resolvedRoute = roleDashboardRoutes.find(({ roles: allowedRoles }) => roles.some((role) => allowedRoles.includes(role)))?.route

  if (resolvedRoute) {
    return <Navigate to={resolvedRoute} replace />
  }

  return <DashboardPage />
}
