import React, { useState, useEffect } from 'react'
import { Filter, RotateCcw, Check, ChevronDown, Calendar, Building2, MapPin, Tag } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

export function FoundationGlobalFilterBar({ onFilterChange }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [academicYear, setAcademicYear] = useState(searchParams.get('academic_year_id') || '2026/2027')
  const [semester, setSemester] = useState(searchParams.get('semester') || 'Ganjil')
  const [unit, setUnit] = useState(searchParams.get('unit_id') || 'all')
  const [jenisUnit, setJenisUnit] = useState(searchParams.get('jenis_unit') || 'all')
  const [lokasi, setLokasi] = useState(searchParams.get('lokasi') || 'all')
  const [period, setPeriod] = useState(searchParams.get('period') || 'year')

  const handleApply = () => {
    const params = new URLSearchParams()
    if (academicYear !== '2026/2027') params.set('academic_year_id', academicYear)
    if (semester !== 'Ganjil') params.set('semester', semester)
    if (unit !== 'all') params.set('unit_id', unit)
    if (jenisUnit !== 'all') params.set('jenis_unit', jenisUnit)
    if (lokasi !== 'all') params.set('lokasi', lokasi)
    if (period !== 'year') params.set('period', period)

    setSearchParams(params)
    if (onFilterChange) {
      onFilterChange({ academicYear, semester, unit, jenisUnit, lokasi, period })
    }
  }

  const handleReset = () => {
    setAcademicYear('2026/2027')
    setSemester('Ganjil')
    setUnit('all')
    setJenisUnit('all')
    setLokasi('all')
    setPeriod('year')
    setSearchParams(new URLSearchParams())
    if (onFilterChange) {
      onFilterChange({
        academicYear: '2026/2027',
        semester: 'Ganjil',
        unit: 'all',
        jenisUnit: 'all',
        lokasi: 'all',
        period: 'year',
      })
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#1B2433]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
          <Filter className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Filter Global Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E5C44] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0B4936] transition"
          >
            <Check className="h-3.5 w-3.5" />
            Terapkan Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Tahun Ajaran</label>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="2026/2027">2026/2027</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2024/2025">2024/2025</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="Ganjil">Ganjil</option>
            <option value="Genap">Genap</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Unit Pendidikan</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">Semua Unit</option>
            <option value="MIT SaQu">MIT SaQu Padang</option>
            <option value="SMPIT 2">SMPIT 2 50 Kota</option>
            <option value="SMAIT">SMAIT Padang</option>
            <option value="SDIT 2">SDIT 2 Padang</option>
            <option value="PONPES">PONPES Putra/Putri</option>
            <option value="TKIT">TKIT Padang</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Jenis Unit</label>
          <select
            value={jenisUnit}
            onChange={(e) => setJenisUnit(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">Semua Jenjang</option>
            <option value="TK">TK / PAUD</option>
            <option value="SD/MIT">SD / MIT</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="PONPES">Ponpes / Dormitory</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Lokasi</label>
          <select
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">Semua Lokasi</option>
            <option value="Padang">Kota Padang</option>
            <option value="50 Kota">Kab. 50 Kota</option>
            <option value="Bukittinggi">Kota Bukittinggi</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">Periode</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="year">Tahun Ini</option>
            <option value="semester">Semester Ini</option>
            <option value="month">Bulan Ini</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Calendar className="h-3 w-3" /> TA {academicYear} ({semester})
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Building2 className="h-3 w-3" /> {unit === 'all' ? 'Semua Unit' : unit}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Tag className="h-3 w-3" /> {jenisUnit === 'all' ? 'Semua Jenjang' : jenisUnit}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <MapPin className="h-3 w-3" /> {lokasi === 'all' ? 'Semua Lokasi' : lokasi}
        </span>
      </div>
    </div>
  )
}
