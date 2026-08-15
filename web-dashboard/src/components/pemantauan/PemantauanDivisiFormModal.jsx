import React, { useState, useEffect } from 'react'
import { X, Save, RefreshCw, Layers, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import { OverlayWrapper, Backdrop } from '@/components/tailgrids/core/overlay'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/tailgrids/core/dialog'
import { Button } from '@/components/tailgrids/core/button'

const DIVISI_OPTIONS = [
  'Divisi Pendidikan',
  'Divisi Kurikulum',
  'Divisi Kesiswaan',
  'Divisi Tahfizh',
  'Divisi Bahasa',
  'Tata Usaha',
  'HRD & Kepegawaian',
  'Keuangan',
  'Sarana & Prasarana',
  'Keasramaan / Musyrif',
]

const STATUS_OPTIONS = [
  { value: 'proses', label: 'Dalam Proses', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'tercapai', label: 'Tercapai (Sesuai Target)', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'terlambat', label: 'Terlambat', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'belum_tercapai', label: 'Belum Tercapai', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
]

export default function PemantauanDivisiFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const isEditMode = Boolean(initialData?.id)

  const [formData, setFormData] = useState({
    nama_divisi: 'Divisi Pendidikan',
    aspek_pemantauan: '',
    persentase_capaian: 80,
    status_pemantauan: 'proses',
    tanggal_pemantauan: new Date().toISOString().split('T')[0],
    catatan: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_divisi: initialData.nama_divisi || 'Divisi Pendidikan',
        aspek_pemantauan: initialData.aspek_pemantauan || '',
        persentase_capaian: initialData.persentase_capaian !== undefined ? Number(initialData.persentase_capaian) : 80,
        status_pemantauan: initialData.status_pemantauan || 'proses',
        tanggal_pemantauan: initialData.tanggal_pemantauan
          ? new Date(initialData.tanggal_pemantauan).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        catatan: initialData.catatan || '',
      })
    } else {
      setFormData({
        nama_divisi: 'Divisi Pendidikan',
        aspek_pemantauan: '',
        persentase_capaian: 80,
        status_pemantauan: 'proses',
        tanggal_pemantauan: new Date().toISOString().split('T')[0],
        catatan: '',
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validate = () => {
    const errs = {}
    if (!formData.nama_divisi?.trim()) errs.nama_divisi = 'Nama divisi wajib diisi.'
    if (!formData.aspek_pemantauan?.trim()) errs.aspek_pemantauan = 'Aspek pemantauan wajib diisi.'
    if (formData.persentase_capaian < 0 || formData.persentase_capaian > 100) {
      errs.persentase_capaian = 'Persentase harus berada di rentang 0 - 100.'
    }
    if (!formData.tanggal_pemantauan) errs.tanggal_pemantauan = 'Tanggal pemantauan wajib diisi.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...formData,
      persentase_capaian: Number(formData.persentase_capaian),
    })
  }

  if (!isOpen) return null

  return (
    <OverlayWrapper>
      <Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()} />
      <Dialog isOpen={isOpen} onOpenChange={(open) => !open && onClose()} className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Monitoring & Evaluasi Divisi</span>
          </div>
          <DialogTitle>{isEditMode ? 'Ubah Data Pemantauan Divisi' : 'Tambah Pemantauan Divisi Baru'}</DialogTitle>
          <DialogDescription>
            Isi formulir hasil supervisi dan monitoring kinerja divisi pendidikan / unit kerja sekolah.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          <DialogBody className="space-y-4">
            {/* Nama Divisi & Tanggal Pemantauan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Nama Divisi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.nama_divisi}
                  onChange={(e) => setFormData({ ...formData, nama_divisi: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {DIVISI_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.nama_divisi && <p className="mt-1 text-xs text-rose-500">{errors.nama_divisi}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Tanggal Pemantauan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.tanggal_pemantauan}
                  onChange={(e) => setFormData({ ...formData, tanggal_pemantauan: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {errors.tanggal_pemantauan && <p className="mt-1 text-xs text-rose-500">{errors.tanggal_pemantauan}</p>}
              </div>
            </div>

            {/* Aspek Pemantauan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Aspek Pemantauan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Kepatuhan Silabus & Modul Ajar, Rekap Presensi Guru, Target Hafalan"
                value={formData.aspek_pemantauan}
                onChange={(e) => setFormData({ ...formData, aspek_pemantauan: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {errors.aspek_pemantauan && <p className="mt-1 text-xs text-rose-500">{errors.aspek_pemantauan}</p>}
            </div>

            {/* Persentase Capaian & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Persentase Capaian (%) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formData.persentase_capaian}%
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.persentase_capaian}
                  onChange={(e) => setFormData({ ...formData, persentase_capaian: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                {errors.persentase_capaian && <p className="mt-1 text-xs text-rose-500">{errors.persentase_capaian}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Status Pemantauan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status_pemantauan}
                  onChange={(e) => setFormData({ ...formData, status_pemantauan: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Catatan / Ringkasan Evaluasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Catatan & Evaluasi Supervisi
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan catatan hasil pemantauan, kendala, atau rekomendasi perbaikan..."
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </DialogBody>

          <DialogFooter className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              appearance="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              appearance="fill"
              size="sm"
              pending={isSubmitting}
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isEditMode ? 'Simpan Perubahan' : 'Tambah Pemantauan'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </OverlayWrapper>
  )
}
