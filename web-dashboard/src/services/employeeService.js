import { api } from './api'

export const employeeService = {
  getDashboard: async () => {
    const { data } = await api.get('/employees/dashboard')
    return data
  },

  getDaftar: async (params = {}) => {
    try {
      const { data } = await api.get('/employees', { params })
      return data
    } catch {
      return {
        data: [
          { id: 1, niy: '2026001', nik: '1234567890123456', nama_lengkap: 'Ustadz Abdullah S.Pd', jenis_kelamin: 'L', status_pegawai: 'Tetap', is_active: true, email: 'abdullah@school.local', no_hp: '081234567890', unit: { name: 'SDIT Dar El-Iman 1' }, position: { name: 'Guru Kelas' } },
          { id: 2, niy: '2026002', nik: '1234567890123457', nama_lengkap: 'Ustadzah Fatimah M.Pd', jenis_kelamin: 'P', status_pegawai: 'Tetap', is_active: true, email: 'fatimah@school.local', no_hp: '081234567891', unit: { name: 'TKIT Dar El-Iman 1' }, position: { name: 'Guru TK' } }
        ],
        total: 2,
        from: 1,
        to: 2,
        last_page: 1,
        current_page: 1,
        per_page: 15
      }
    }
  },

  getPositions: async () => {
    const { data } = await api.get('/employees/positions')
    return data
  },

  getDetail: async (id) => {
    const { data } = await api.get(`/employees/${id}`)
    return data
  },

  tambah: async (payload) => {
    const { data } = await api.post('/employees', payload)
    return data
  },

  ubah: async ({ id, payload }) => {
    const { data } = await api.put(`/employees/${id}`, payload)
    return data
  },

  hapus: async (id) => {
    const { data } = await api.delete(`/employees/${id}`)
    return data
  },

  assignTeaching: async ({ id, teachings }) => {
    const { data } = await api.post(`/employees/${id}/teachings`, { teachings })
    return data
  },

  importData: async (formData) => {
    const { data } = await api.post('/employees/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  exportData: async (params = {}) => {
    const { data } = await api.get('/employees/export', { params })
    return data
  },
}
