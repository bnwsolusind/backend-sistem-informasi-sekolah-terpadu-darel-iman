import { api } from './api'

export const educationUnitService = {
  getDaftar: async (params = {}) => {
    try {
      const { data } = await api.get('/education-units', { params })
      return data
    } catch {
      return {
        data: [
          { id: 1, code: 'TKIT-1', name: 'TKIT Dar El-Iman 1', level: 'TKIT', description: 'Unit TKIT', is_active: true, total_siswa: 120, total_guru: 10, metadata: { npsn: '12345678', email: 'tkit@school.local', phone: '08123456789', address: 'Jl. Khatib Sulaiman', city: 'Padang', province: 'Sumatera Barat', postal_code: '25111', principal_name: 'Ustadz Ahmad', principal_nip: '19850101' } },
          { id: 2, code: 'SDIT-1', name: 'SDIT Dar El-Iman 1', level: 'SDIT', description: 'Unit SDIT', is_active: true, total_siswa: 450, total_guru: 32, metadata: { npsn: '23456789', email: 'sdit@school.local', phone: '08123456788', address: 'Jl. Gunung Pangilun', city: 'Padang', province: 'Sumatera Barat', postal_code: '25112', principal_name: 'Ustadz Budi', principal_nip: '19820202' } },
          { id: 3, code: 'SMPIT-1', name: 'SMPIT Dar El-Iman', level: 'SMPIT', description: 'Unit SMPIT', is_active: true, total_siswa: 380, total_guru: 25, metadata: { npsn: '34567890', email: 'smpit@school.local', phone: '08123456787', address: 'Jl. Bypass', city: 'Padang', province: 'Sumatera Barat', postal_code: '25113', principal_name: 'Ustadz Candra', principal_nip: '19800303' } }
        ],
        total: 3,
        from: 1,
        to: 3,
        last_page: 1,
        current_page: 1,
        per_page: 15
      }
    }
  },

  getAll: async (params = {}) => {
    const { data } = await api.get('/education-units', { params })
    return data
  },

  getDetail: async (id) => {
    const { data } = await api.get(`/education-units/${id}`)
    return data
  },

  tambah: async (payload) => {
    const { data } = await api.post('/education-units', payload)
    return data
  },

  ubah: async ({ id, payload }) => {
    const { data } = await api.put(`/education-units/${id}`, payload)
    return data
  },

  hapus: async (id) => {
    const { data } = await api.delete(`/education-units/${id}`)
    return data
  },
}

export default educationUnitService
