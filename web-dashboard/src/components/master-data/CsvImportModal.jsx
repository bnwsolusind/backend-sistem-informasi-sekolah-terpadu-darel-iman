import { useRef, useState } from 'react'
import { Download, FileSpreadsheet, Upload, X } from 'lucide-react'

const parseLine = (line, delimiter) => {
  const values = []
  let value = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"' && line[index + 1] === '"' && quoted) { value += '"'; index += 1 }
    else if (char === '"') quoted = !quoted
    else if (char === delimiter && !quoted) { values.push(value.trim()); value = '' }
    else value += char
  }
  values.push(value.trim())
  return values
}

const parseCsv = (text) => {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim())
  if (lines.length < 2) throw new Error('File harus memiliki header dan minimal satu baris data.')
  const delimiter = lines[0].includes(';') && !lines[0].includes(',') ? ';' : ','
  const headers = parseLine(lines[0], delimiter).map((item) => item.trim().toLowerCase())
  return lines.slice(1).map((line) => Object.fromEntries(headers.map((header, index) => [header, parseLine(line, delimiter)[index] ?? ''])))
}

export default function CsvImportModal({ open, onClose, title, columns, onImport }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const downloadTemplate = () => {
    const header = columns.map((item) => item.key).join(',')
    const example = columns.map((item) => `"${item.example ?? ''}"`).join(',')
    const blob = new Blob([`\uFEFF${header}\n${example}\n`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `template-${title.toLowerCase().replaceAll(' ', '-')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!file) return setError('Pilih file CSV terlebih dahulu.')
    try {
      setBusy(true)
      setError('')
      const rows = parseCsv(await file.text())
      const missing = columns.filter((item) => item.required && !Object.hasOwn(rows[0], item.key))
      if (missing.length) throw new Error(`Kolom wajib tidak ditemukan: ${missing.map((item) => item.key).join(', ')}`)
      await onImport(rows)
      setFile(null)
      onClose()
    } catch (importError) {
      setError(importError?.response?.data?.message || importError.message || 'Import gagal diproses.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#1B2433]">
        <header className="mb-5 flex items-start justify-between"><div><h2 className="text-lg font-black text-slate-900 dark:text-white">Import {title}</h2><p className="mt-1 text-sm text-slate-500">CSV dapat diedit di Excel. Baris valid diproses satu per satu agar kegagalan mudah dilacak.</p></div><button type="button" onClick={onClose} aria-label="Tutup"><X /></button></header>
        <button type="button" onClick={downloadTemplate} className="mb-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-800"><Download size={16} /> Unduh Template CSV</button>
        <button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"><FileSpreadsheet size={32} /><strong className="mt-2">{file?.name || 'Pilih file CSV'}</strong><small>Maksimal mengikuti batas unggah browser</small></button>
        <input ref={inputRef} hidden type="file" accept=".csv,text/csv" onChange={(event) => { setFile(event.target.files?.[0] || null); setError('') }} />
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"><strong>Kolom:</strong> {columns.map((item) => `${item.key}${item.required ? '*' : ''}`).join(', ')}</div>
        {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
        <footer className="mt-5 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border px-4 py-2">Batal</button><button disabled={busy || !file} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2 font-bold text-white disabled:opacity-50"><Upload size={16} /> {busy ? 'Mengimpor...' : 'Mulai Import'}</button></footer>
      </form>
    </div>
  )
}
