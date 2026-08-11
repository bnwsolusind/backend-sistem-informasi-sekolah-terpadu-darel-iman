import axios from 'axios'
import { clearAuthArtifacts } from '../stores/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('school_erp_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      clearAuthArtifacts()
      window.dispatchEvent(new Event('auth-session-cleared'))

      if (window.location.pathname !== '/masuk') {
        window.location.href = '/masuk'
      }
    }

    return Promise.reject(error)
  }
)

export default api
