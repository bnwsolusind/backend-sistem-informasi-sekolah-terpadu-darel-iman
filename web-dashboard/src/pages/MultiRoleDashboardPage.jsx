import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import DashboardPage from './DashboardPage'

export default function MultiRoleDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const roles = user?.roles || []
  const permissions = user?.permissions || []

  const isSuperAdmin = roles.some((r) => r.toLowerCase().replace(/\s+/g, '') === 'superadmin')

  const isFoundationUser =
    !isSuperAdmin &&
    (roles.some((r) =>
      ['Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'sekretaris_yayasan', 'bendahara_yayasan', 'pengurus_yayasan'].includes(r)
    ) || permissions.includes('foundation.dashboard.view'))

  if (isFoundationUser) {
    return <Navigate to="/dashboard/yayasan" replace />
  }

  if (!isSuperAdmin && roles.includes('Siswa')) {
    return <Navigate to="/portal-siswa" replace />
  }

  if (!isSuperAdmin && roles.includes('Orang Tua')) {
    return <Navigate to="/portal-orangtua" replace />
  }

  return <DashboardPage />
}
