import React, { useState } from 'react'
import { X as FaTimes, FileInput as FaFileImport, Download as FaDownload, UploadCloud as FaUpload, CircleCheck as FaCheckCircle, CircleAlert as FaExclamationCircle } from 'lucide-react'

export default function JabatanImportModal({ isOpen, onClose, onImport, isSubmitting = false }) {
  const [file, setFile] = useState(null)
  const [parsedData, setParsedData] = useState([])
  const [parseError, setParseError] = useState('')

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    setFile(selected)
    setParseError('')
    setParsedData([])

    if (!selected) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target.result
        if (selected.name.endsWith('.json')) {
          const json = JSON.parse(text)
          if (Array.isArray(json)) {
            setParsedData(json)
          } else if (json.data && Array.isArray(json.data)) {
            setParsedData(json.data)
          } else {
            setParseError('Format file JSON harus berupa array objek data jabatan.')
          }
        } else if (selected.name.endsWith('.csv') || selected.name.endsWith('.txt')) {
          const lines = text.split('\n').filter((line) => line.trim() !== '')
          if (lines.length < 2) {
            setParseError('File CSV minimal harus memiliki header dan 1 baris data.')
            return
          }
          const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
          const rows = lines.slice(1).map((line) => {
            const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
            const obj = {}
            headers.forEach((h, idx) => {
              obj[h] = values[idx] || ''
            })
            return obj
          })
          setParsedData(rows)
        } else {
          setParseError('Format file tidak didukung. Harap gunakan CSV atau JSON.')
        }
      } catch (err) {
        setParseError('Gagal membaca file: ' + err.message)
      }
    }
    reader.readAsText(selected)
  }

  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        kode_jabatan: 'JBT-101',
	        nama_jabatan: 'Koordinator Ekstrakurikuler',
	        satuan_kerja: 'Unit Pendidikan',
	        scope_akses: 'siswa_binaan',
        level_jabatan: 5,
        urutan: 15,
        warna: '#3B82F6',
        ikon: 'UserCheck',
        deskripsi: 'Mengkoordinasi seluruh kegiatan ekstrakurikuler siswa',
        status: 'Aktif',
        tampil_struktur: true,
        boleh_login: true,
      },
    ]

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sampleData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', 'template_import_master_jabatan.json')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (parsedData.length === 0) {
      setParseError('Pilih file yang berisi data valid terlebih dahulu.')
      return
    }
    onImport(parsedData)
  }

  return (
    <div className="ui-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-labelledby="impor-jabatan-title">
      <div className="ui-modal my-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1B2433]">
        {/* Header Bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#1B2433]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#054e3b] font-bold">
              <FaFileImport className="w-5 h-5" />
            </div>
            <div>
              <h3 id="impor-jabatan-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Impor Data Jabatan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah file JSON atau CSV berisi daftar jabatan batch.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            title="Tutup impor jabatan"
            aria-label="Tutup impor jabatan"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {/* Template Download Option */}
          <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-slate-200/90 text-xs">
            <div>
              <p className="font-bold text-slate-900">Belum punya format template?</p>
              <p className="text-slate-500 mt-0.5">Unduh contoh berkas struktur data yang sesuai.</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="ui-button inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <FaDownload className="w-3.5 h-3.5" />
              <span>Unduh Template</span>
            </button>
          </div>

          {/* Upload Area (Persis UI UX Referensi) */}
          <div className="border-2 border-dashed border-[#10b981] rounded-2xl p-6 text-center hover:bg-emerald-50/20 transition-colors bg-emerald-50/10">
            <input
              type="file"
              accept=".json,.csv,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-jabatan"
            />
            <label htmlFor="file-upload-jabatan" className="cursor-pointer space-y-2 block">
              <FaUpload className="w-8 h-8 mx-auto text-[#047857]" />
              <p className="text-sm font-bold text-[#0f172a]">
                {file ? file.name : 'Upload File CSV / JSON'}
              </p>
              <p className="text-xs text-slate-400">Ukuran maksimal file 5MB</p>
            </label>
          </div>

          {/* Validation Feedback */}
          {parseError && (
            <div className="p-3.5 bg-rose-50 text-rose-700 rounded-2xl text-xs flex items-center space-x-2 border border-rose-200">
              <FaExclamationCircle className="w-4 h-4 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {parsedData.length > 0 && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl text-xs flex items-center space-x-2 border border-emerald-200">
              <FaCheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>Berhasil membaca <strong>{parsedData.length} baris</strong> data siap diimpor.</span>
            </div>
          )}

          {/* Footer Bar (Persis UI UX Referensi) */}
          <div className="sticky bottom-0 -mx-5 -mb-5 flex items-center justify-between border-t border-slate-100 bg-white px-5 py-4 dark:border-slate-700 dark:bg-[#1B2433] sm:-mx-6 sm:-mb-6 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="ui-button rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || parsedData.length === 0}
              className="ui-button inline-flex items-center space-x-2 rounded-xl bg-emerald-800 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-900 disabled:opacity-50"
            >
              <FaFileImport className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Memproses Impor...' : 'Proses Impor Data'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
