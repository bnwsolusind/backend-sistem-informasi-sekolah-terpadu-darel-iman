import React, { useState, useEffect } from 'react'
import { GraduationCap, UserCheck, Phone, Mail, Building, Briefcase, BookOpen, Save, CheckCircle2 } from 'lucide-react'
import Swal from 'sweetalert2'

import DashboardHeader from '../components/dashboard/DashboardHeader'
import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import KpiCard from '../components/dashboard/KpiCard'
import DataTableCard from '../components/dashboard/DataTableCard'
import SkeletonDashboard from '../components/dashboard/SkeletonDashboard'
import ErrorState from '../components/dashboard/ErrorState'

import { alumniPortalService } from '../services/alumniPortalService'

export default function AlumniPortalPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    status_lanjutan: 'Kuliah',
    perguruan_tinggi: '',
    pekerjaan: '',
    instansi: '',
  })

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await alumniPortalService.getDashboard()
      if (res && res.data) {
        setData(res.data)
        const prof = res.data.profile || {}
        setFormData({
          address: prof.address || '',
          phone: prof.phone || '',
          email: prof.email || '',
          status_lanjutan: prof.status_lanjutan || 'Kuliah',
          perguruan_tinggi: prof.perguruan_tinggi || '',
          pekerjaan: prof.pekerjaan || '',
          instansi: prof.instansi || '',
        })
      } else {
        setError('Format respon server tidak valid.')
      }
    } catch (err) {
      console.error('Failed to load Alumni dashboard:', err)
      setError(err.response?.data?.message || 'Gagal memuat data portal Alumni.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await alumniPortalService.updateProfile(formData)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data profil alumni berhasil diperbarui.',
        timer: 2000,
        showConfirmButton: false,
      })
      fetchDashboard()
    } catch (err) {
      console.error('Failed to update alumni profile:', err)
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.response?.data?.message || 'Gagal memperbarui profil alumni.',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <SkeletonDashboard />
  if (error) return <ErrorState message={error} onRetry={fetchDashboard} />

  const profile = data?.profile || {}
  const kpis = data?.kpis || {}
  const announcements = data?.announcements || []

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title={`Portal Alumni — ${profile.full_name || 'Alumni'}`}
        subtitle={`Lulusan ${profile.education_unit || 'Sekolah'} — Tahun Lulus ${profile.tahun_lulus}`}
        roleName="Alumni"
        unitName={profile.education_unit}
      />

      <KpiCardGrid cols={4}>
        <KpiCard title="Tahun Lulus" value={kpis.tahun_lulus} icon={GraduationCap} />
        <KpiCard title="Unit Asal Sekolah" value={kpis.unit_asal} icon={Building} />
        <KpiCard title="Status Profil Kontak" value={kpis.status_profil} icon={UserCheck} />
        <KpiCard title="Aktivitas Saat Ini" value={kpis.status_lanjutan} icon={Briefcase} />
      </KpiCardGrid>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Read-Only Official Academic Records & Editable Profile Form */}
        <div className="space-y-4 lg:col-span-8">
          {/* Read-Only Official Credentials */}
          <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Data Resmi Kelulusan (Read-Only)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Identitas akademik resmi yang diterbitkan oleh sistem sekolah.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">Nama Lengkap</span>
                <span className="font-bold text-slate-900 dark:text-white">{profile.full_name}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">NIS / NISN</span>
                <span className="font-bold text-slate-900 dark:text-white">{profile.nis || '-'} / {profile.nisn || '-'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">Tahun Lulus</span>
                <span className="font-bold text-slate-900 dark:text-white">{profile.tahun_lulus}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block mb-1">Status Kelulusan</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{profile.status_kelulusan}</span>
              </div>
            </div>
          </div>

          {/* Editable Form for Alumni Contact & Education/Job info */}
          <form onSubmit={handleSaveProfile} className="space-y-4 rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Perbarui Informasi Kontak &amp; Karir Alumni
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Perbarui domisili, kontak, perguruan tinggi, atau tempat kerja Anda untuk tracer alumni.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">No. HP / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Aktif</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="email@domain.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Domisili</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="Alamat domisili saat ini"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Aktivitas Lanjutan</label>
                <select
                  value={formData.status_lanjutan}
                  onChange={(e) => setFormData({ ...formData, status_lanjutan: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Kuliah">Kuliah (Perguruan Tinggi)</option>
                  <option value="Bekerja">Bekerja</option>
                  <option value="Wirausaha">Wirausaha / Bisnis</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Perguruan Tinggi / Universitas</label>
                <input
                  type="text"
                  value={formData.perguruan_tinggi}
                  onChange={(e) => setFormData({ ...formData, perguruan_tinggi: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="Nama universitas / kampus"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pekerjaan / Jabatan</label>
                <input
                  type="text"
                  value={formData.pekerjaan}
                  onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="Pekerjaan saat ini"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Instansi / Nama Perusahaan</label>
                <input
                  type="text"
                  value={formData.instansi}
                  onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="Nama tempat bekerja / wirausaha"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E5C44] text-white text-xs font-semibold hover:bg-[#1E8E5A] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Simpan...' : 'Simpan Perubahan Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Alumni Announcements Table */}
        <div className="lg:col-span-4">
          <DataTableCard
            title="Pengumuman Sekolah & Alumni"
            subtitle="Kabar alumni dan informasi resmi dari sekolah"
            headers={['Pengumuman', 'Tanggal']}
            rows={announcements.map((ann, idx) => [
              <span key="title" className="font-semibold text-slate-900 dark:text-white">{ann.judul_pengumuman || ann.judul}</span>,
              ann.created_at ? new Date(ann.created_at).toLocaleDateString('id-ID') : '-'
            ])}
            emptyMessage="Belum ada pengumuman alumni."
          />
        </div>
      </div>
    </div>
  )
}
