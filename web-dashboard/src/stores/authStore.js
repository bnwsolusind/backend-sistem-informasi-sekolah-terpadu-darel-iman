import { create } from 'zustand'

function bacaUserTersimpan() {
  try {
    const raw = localStorage.getItem('school_erp_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearAuthArtifacts() {
  localStorage.removeItem('school_erp_token')
  localStorage.removeItem('school_erp_user')
  localStorage.removeItem('school_erp_superadmin_session')
}

function normalizeUser(user) {
  return user?.data || user || null
}

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('school_erp_token'),
  user: bacaUserTersimpan(),
  setSession: ({ token, user }) => {
    const normalizedUser = normalizeUser(user)
    localStorage.setItem('school_erp_token', token)
    localStorage.setItem('school_erp_user', JSON.stringify(normalizedUser))
    set({ token, user: normalizedUser })
  },
  clearSession: () => {
    clearAuthArtifacts()
    set({ token: null, user: null })
  },
}))
