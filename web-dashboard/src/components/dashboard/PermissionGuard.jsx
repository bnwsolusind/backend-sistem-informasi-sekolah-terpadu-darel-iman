import React from 'react'
import { useAuthStore } from '../../stores/authStore'

export default function PermissionGuard({ any = [], children, fallback = null }) {
  const user = useAuthStore((state) => state.user)
  const roles = (user?.roles || []).map((r) => String(r).toLowerCase().replace(/\s+/g, ''))
  const permissions = user?.permissions || []
  
  const isSuperAdmin = roles.includes('superadmin') || roles.includes('super_admin')
  const hasPermission = any.length === 0 || any.some((permission) => permissions.includes(permission))

  if (isSuperAdmin || hasPermission) {
    return children
  }

  return fallback
}
