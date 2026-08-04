import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  BookOpen,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Mic,
  Upload,
  Play,
  Pause,
  Save,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  FileText,
  FileAudio,
  Search,
  X,
  Edit,
  Loader2,
  Volume2,
  CheckSquare,
  ShieldCheck,
  UserCheck,
  Heart,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { tahfizhService } from '../services/tahfizhService'
import { equranService } from '../services/equranService'
import { kelasService } from '../services/kelasService'
import { studentService } from '../services/studentService'

export default function TahfizhPage() {
  // State Filter & Context
  const [kelases, setKelases] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')

  // State Date (Start of week - Senin)
  const [currentMonday, setCurrentMonday] = useState(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    const monday = new Date(d.setDate(diff))
    return monday.toISOString().split('T')[0]
  })

  // State View Mode (Guru / Musyrif vs Orang Tua)
  const [viewMode, setViewMode] = useState('guru') // 'guru' | 'ortu'

  // Data Loading & Sheet State
  const [loadingSheet, setLoadingSheet] = useState(false)
  const [weeklySheet, setWeeklySheet] = useState([])
  const [summaryTeacherNotes, setSummaryTeacherNotes] = useState('')
  const [summaryParentNotes, setSummaryParentNotes] = useState('')
  const [studentProgress, setStudentProgress] = useState(null)

  // Master Qur'an Data
  const [quranSurahs, setQuranSurahs] = useState([])
  const [showQuranModal, setShowQuranModal] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState(null)
  const [quranSearch, setQuranSearch] = useState('')

  // Modal Quran State Form
  const [modalSurah, setModalSurah] = useState(null)
  const [modalAyahStart, setModalAyahStart] = useState(1)
  const [modalAyahEnd, setModalAyahEnd] = useState(7)
  const [modalBarisCount, setModalBarisCount] = useState(5)

  // Audio Player State
  const [playingAudioUrl, setPlayingAudioUrl] = useState(null)
  const audioRef = useRef(null)

  // Recording State (MediaRecorder)
  const [uploadingAudioRow, setUploadingAudioRow] = useState(null)

  // Fetch Master Data Kelas & Qur'an pada mount
  useEffect(() => {
    const initMaster = async () => {
      try {
        const [kelasRes, surahRes] = await Promise.all([
          kelasService.getDaftar({ per_page: 100 }),
          equranService.getSurahs(),
        ])
        const kList = kelasRes?.data || []
        setKelases(kList)
        if (kList.length > 0) {
          setSelectedClassId(kList[0].id)
        }

        setQuranSurahs(surahRes || [])
      } catch (e) {
        console.error('Error init master Tahfizh:', e)
      }
    }
    initMaster()
  }, [])

  // Fetch Siswa saat Kelas berubah
  useEffect(() => {
    if (!selectedClassId) return
    const fetchSiswa = async () => {
      try {
        const res = await kelasService.getSiswaRombel(selectedClassId)
        const sList = Array.isArray(res) ? res : res?.data || []
        setStudents(sList)
        if (sList.length > 0) {
          setSelectedStudentId(sList[0].id || sList[0].student_id)
        } else {
          setSelectedStudentId('')
          setWeeklySheet([])
          setStudentProgress(null)
        }
      } catch (e) {
        console.error('Error fetch siswa:', e)
      }
    }
    fetchSiswa()
  }, [selectedClassId])

  // Fetch Weekly Sheet & Progress saat Siswa atau Tanggal Minggu berubah
  const loadSheetAndProgress = async () => {
    if (!selectedStudentId) return
    setLoadingSheet(true)
    try {
      const [sheetData, progressData] = await Promise.all([
        tahfizhService.getWeeklySheet(selectedStudentId, currentMonday),
        tahfizhService.getStudentProgress(selectedStudentId),
      ])

      if (sheetData && sheetData.days) {
        // Map days item for editable state
        const mappedDays = sheetData.days.map((dayItem) => {
          const log = dayItem.log || {}
          return {
            record_date: dayItem.record_date,
            day_name: dayItem.day_name,
            day_index: dayItem.day_index,
            tilawah_text: log.tilawah_text || '',
            tilawah_baris: log.tilawah_baris || 0,
            hafalan_surah_number: log.hafalan_surah_number || null,
            hafalan_surah_name: log.hafalan_surah_name || '',
            hafalan_ayah_start: log.hafalan_ayah_start || '',
            hafalan_ayah_end: log.hafalan_ayah_end || '',
            hafalan_baris: log.hafalan_baris || 0,
            murajaah_text: log.murajaah_text || '',
            murajaah_lembar: log.murajaah_lembar || 0,
            audio_url: log.audio_url || '',
            notes_teacher: log.notes_teacher || '',
            notes_parent: log.notes_parent || '',
            signature_teacher: log.signature_teacher || '',
            signature_parent: log.signature_parent || '',
            isSaved: !!log.id,
          }
        })
        setWeeklySheet(mappedDays)
        setSummaryTeacherNotes(sheetData.notes_teacher_summary || '')
        setSummaryParentNotes(sheetData.notes_parent_summary || '')
      }

      setStudentProgress(progressData || null)
    } catch (e) {
      console.error('Error load weekly sheet:', e)
    } finally {
      setLoadingSheet(false)
    }
  }

  useEffect(() => {
    loadSheetAndProgress()
  }, [selectedStudentId, currentMonday])

  // Navigasi Minggu (Prev / Next)
  const handlePrevWeek = () => {
    const curr = new Date(currentMonday)
    curr.setDate(curr.getDate() - 7)
    setCurrentMonday(curr.toISOString().split('T')[0])
  }

  const handleNextWeek = () => {
    const curr = new Date(currentMonday)
    curr.setDate(curr.getDate() + 7)
    setCurrentMonday(curr.toISOString().split('T')[0])
  }

  // Handle Input Per Baris di Tabel
  const handleCellChange = (index, field, value) => {
    const updated = [...weeklySheet]
    updated[index][field] = value
    setWeeklySheet(updated)
  }

  // Open Qur'an Master Modal for Hafalan Baru selection
  const handleOpenQuranModal = (rowIndex) => {
    setSelectedRowIndex(rowIndex)
    const currentRow = weeklySheet[rowIndex]
    if (currentRow.hafalan_surah_number) {
      const foundSurah = quranSurahs.find((s) => Number(s.nomor) === Number(currentRow.hafalan_surah_number))
      setModalSurah(foundSurah || quranSurahs[0] || null)
      setModalAyahStart(currentRow.hafalan_ayah_start || 1)
      setModalAyahEnd(currentRow.hafalan_ayah_end || (foundSurah ? foundSurah.jumlah_ayat : 7))
      setModalBarisCount(currentRow.hafalan_baris || 5)
    } else {
      setModalSurah(quranSurahs[0] || null)
      setModalAyahStart(1)
      setModalAyahEnd(7)
      setModalBarisCount(5)
    }
    setShowQuranModal(true)
  }

  // Apply Qur'an Selection to Row
  const handleApplyQuranSelection = () => {
    if (selectedRowIndex === null || !modalSurah) return
    const updated = [...weeklySheet]
    updated[selectedRowIndex].hafalan_surah_number = modalSurah.nomor
    updated[selectedRowIndex].hafalan_surah_name = modalSurah.nama_latin || modalSurah.nama
    updated[selectedRowIndex].hafalan_ayah_start = Number(modalAyahStart)
    updated[selectedRowIndex].hafalan_ayah_end = Number(modalAyahEnd)
    updated[selectedRowIndex].hafalan_baris = Number(modalBarisCount)
    setWeeklySheet(updated)
    setShowQuranModal(false)
  }

  // Handle Upload Audio Murajaah (Ortu)
  const handleAudioUpload = async (index, file) => {
    if (!file) return
    setUploadingAudioRow(index)
    try {
      const res = await tahfizhService.uploadAudio(file)
      if (res && res.audio_url) {
        handleCellChange(index, 'audio_url', res.audio_url)
        Swal.fire({
          icon: 'success',
          title: 'Rekaman Suara Terunggah',
          text: 'File rekaman suara murajaah berhasil disimpan.',
          timer: 1500,
          showConfirmButton: false,
        })
      }
    } catch (e) {
      console.error(e)
      Swal.fire('Error', 'Gagal mengunggah file rekaman suara', 'error')
    } finally {
      setUploadingAudioRow(null)
    }
  }

  // Play / Pause Audio Recording
  const handlePlayAudio = (url) => {
    if (!url) return
    if (playingAudioUrl === url && audioRef.current) {
      audioRef.current.pause()
      setPlayingAudioUrl(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const fullUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`
    const newAudio = new Audio(fullUrl)
    newAudio.play()
    audioRef.current = newAudio
    setPlayingAudioUrl(url)

    newAudio.onended = () => {
      setPlayingAudioUrl(null)
    }
  }

  // Save Single Day Entry
  const handleSaveSingleDay = async (index) => {
    const row = weeklySheet[index]
    if (!selectedStudentId) {
      Swal.fire('Peringatan', 'Silakan pilih siswa terlebih dahulu', 'warning')
      return
    }

    try {
      const payload = {
        student_id: selectedStudentId,
        class_id: selectedClassId,
        record_date: row.record_date,
        day_name: row.day_name,
        tilawah_text: row.tilawah_text,
        tilawah_baris: Number(row.tilawah_baris) || 0,
        hafalan_surah_number: row.hafalan_surah_number ? Number(row.hafalan_surah_number) : null,
        hafalan_surah_name: row.hafalan_surah_name,
        hafalan_ayah_start: row.hafalan_ayah_start ? Number(row.hafalan_ayah_start) : null,
        hafalan_ayah_end: row.hafalan_ayah_end ? Number(row.hafalan_ayah_end) : null,
        hafalan_baris: Number(row.hafalan_baris) || 0,
        murajaah_text: row.murajaah_text,
        murajaah_lembar: Number(row.murajaah_lembar) || 0,
        audio_url: row.audio_url,
        notes_teacher: summaryTeacherNotes,
        notes_parent: summaryParentNotes,
        signature_teacher: row.signature_teacher || 'Guru Verified',
        signature_parent: row.signature_parent || 'Ortu Verified',
      }

      await tahfizhService.saveDailyLog(payload)
      const updated = [...weeklySheet]
      updated[index].isSaved = true
      setWeeklySheet(updated)

      // Reload progress to keep statistics updated
      const pData = await tahfizhService.getStudentProgress(selectedStudentId)
      setStudentProgress(pData)

      Swal.fire({
        icon: 'success',
        title: 'Tersimpan',
        text: `Data Tahfizh & Murajaah hari ${row.day_name} (${row.record_date}) berhasil disimpan!`,
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (e) {
      console.error(e)
      Swal.fire('Error', 'Gagal menyimpan data log harian.', 'error')
    }
  }

  // Save Entire Weekly Sheet
  const handleSaveAllWeekly = async () => {
    if (!selectedStudentId) return
    Swal.fire({
      title: 'Simpan Lembar Mingguan?',
      text: 'Semua entri 7 hari (Senin - Ahad) dan catatan akan disinkronkan ke server.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Simpan Semua',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#059669',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          for (let i = 0; i < weeklySheet.length; i++) {
            const row = weeklySheet[i]
            // Simpan jika ada perubahan atau data diisi
            const payload = {
              student_id: selectedStudentId,
              class_id: selectedClassId,
              record_date: row.record_date,
              day_name: row.day_name,
              tilawah_text: row.tilawah_text,
              tilawah_baris: Number(row.tilawah_baris) || 0,
              hafalan_surah_number: row.hafalan_surah_number ? Number(row.hafalan_surah_number) : null,
              hafalan_surah_name: row.hafalan_surah_name,
              hafalan_ayah_start: row.hafalan_ayah_start ? Number(row.hafalan_ayah_start) : null,
              hafalan_ayah_end: row.hafalan_ayah_end ? Number(row.hafalan_ayah_end) : null,
              hafalan_baris: Number(row.hafalan_baris) || 0,
              murajaah_text: row.murajaah_text,
              murajaah_lembar: Number(row.murajaah_lembar) || 0,
              audio_url: row.audio_url,
              notes_teacher: summaryTeacherNotes,
              notes_parent: summaryParentNotes,
              signature_teacher: 'Guru Verified',
              signature_parent: 'Ortu Verified',
            }
            await tahfizhService.saveDailyLog(payload)
          }

          await loadSheetAndProgress()

          Swal.fire({
            icon: 'success',
            title: 'Berhasil Disimpan!',
            text: 'Seluruh lembar data Tahfizh & Murajaah minggu ini telah berhasil diperbarui.',
            timer: 2000,
            showConfirmButton: false,
          })
        } catch (e) {
          console.error(e)
          Swal.fire('Error', 'Gagal menyimpan seluruh lembar mingguan.', 'error')
        }
      }
    })
  }

  // Filtered Quran list for modal
  const filteredQuranSurahs = useMemo(() => {
    if (!quranSearch) return quranSurahs
    return quranSurahs.filter(
      (s) =>
        s.nama_latin?.toLowerCase().includes(quranSearch.toLowerCase()) ||
        s.arti?.toLowerCase().includes(quranSearch.toLowerCase()) ||
        String(s.nomor).includes(quranSearch)
    )
  }, [quranSurahs, quranSearch])

  // Selected student object
  const currentStudentObj = useMemo(() => {
    return students.find((s) => (s.id || s.student_id) === selectedStudentId)
  }, [students, selectedStudentId])

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 text-white" />
        </div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Modul Tahfizh & Murajaah Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            Setoran Hafalan & Murajaah Harian
          </h1>
          <p className="text-emerald-100/90 text-sm max-w-2xl">
            Pencatatan setoran hafalan siswa/santri oleh Guru/Musyrif & pencatatan Murajaah dengan rekaman suara oleh Orang Tua sesuai form fisik 7 hari.
          </p>
        </div>

        {/* View Mode Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full lg:w-auto justify-end">
          <div className="bg-white/10 p-1 rounded-2xl backdrop-blur-md border border-white/20 flex items-center">
            <button
              onClick={() => setViewMode('guru')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'guru'
                  ? 'bg-emerald-400 text-emerald-950 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Mode Guru / Musyrif</span>
            </button>
            <button
              onClick={() => setViewMode('ortu')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'ortu'
                  ? 'bg-emerald-400 text-emerald-950 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Mode Orang Tua (Audio Murajaah)</span>
            </button>
          </div>

          <button
            onClick={handleSaveAllWeekly}
            className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Minggu Ini</span>
          </button>
        </div>
      </div>

      {/* Context Selection Toolbar (Kelas, Siswa, & Mingguan) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Pilih Kelas */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            1. Pilih Kelas / Rombel:
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          >
            {kelases.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_kelas || k.nama || `Kelas ${k.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Pilih Siswa / Santri */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            2. Pilih Siswa / Santri:
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          >
            {students.length === 0 ? (
              <option value="">(Belum Ada Siswa di Kelas Ini)</option>
            ) : (
              students.map((s) => (
                <option key={s.id || s.student_id} value={s.id || s.student_id}>
                  {s.nama_lengkap || s.name || s.nama || `Siswa #${s.id}`} {s.nis ? `(${s.nis})` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Navigasi Minggu */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            3. Periode Pekan (Senin - Ahad):
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
              title="Pekan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center bg-emerald-50 border border-emerald-200 py-2 px-3 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Senin, {currentMonday}</span>
            </div>
            <button
              onClick={handleNextWeek}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
              title="Pekan Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Cards: Penarikan Data Hafalan & Sisa Target Al-Qur'an */}
      {studentProgress && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold">Total Dihafal</div>
              <div className="text-xl font-extrabold text-emerald-900">
                {studentProgress.total_ayats_memorized.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-bold text-emerald-600">Ayat</span>
              </div>
              <div className="text-[11px] text-gray-400 font-medium">{studentProgress.total_surahs_memorized} Surah Dihafal</div>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold">Sisa Belum Dihafal</div>
              <div className="text-xl font-extrabold text-amber-900">
                {studentProgress.remaining_ayats.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-bold text-amber-600">Ayat</span>
              </div>
              <div className="text-[11px] text-amber-600 font-medium">Sisa {studentProgress.remaining_surahs} Surah Lagi</div>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-cyan-100 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold">Prosentase Target</div>
              <div className="text-xl font-extrabold text-cyan-900">
                {studentProgress.progress_percentage}%
              </div>
              <div className="text-[11px] text-gray-400 font-medium">Dari Target 30 Juz (6.236 Ayat)</div>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-indigo-100 flex flex-col justify-center gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
              <span>Progres 30 Juz</span>
              <span className="text-indigo-600">{studentProgress.progress_percentage}%</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-200">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${studentProgress.progress_percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-400 text-right">Target Lengkap 114 Surah</div>
          </div>
        </div>
      )}

      {/* Main Table: Form Manual Tahfizh (Matching Image Layout) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Title Bar */}
        <div className="bg-emerald-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Formulir Tahfizh & Murajaah Harian (Senin - Ahad)</span>
            {currentStudentObj && (
              <span className="bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-md text-xs">
                Siswa: {currentStudentObj.nama_lengkap || currentStudentObj.nama}
              </span>
            )}
          </div>
          <span className="text-xs text-emerald-200 font-medium">
            Mode Aktif: <strong className="uppercase text-emerald-400">{viewMode === 'guru' ? 'Guru / Musyrif' : 'Orang Tua'}</strong>
          </span>
        </div>

        {loadingSheet ? (
          <div className="p-16 text-center text-gray-400 flex flex-col items-center gap-3">
            <Loader2 className="w-9 h-9 animate-spin text-emerald-600" />
            <span className="text-sm font-semibold text-gray-600">Memuat lembar data Tahfizh minggu ini...</span>
          </div>
        ) : weeklySheet.length === 0 ? (
          <div className="p-16 text-center text-gray-400">Silakan pilih siswa untuk melihat lembar data</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-emerald-100/70 border-b border-emerald-200 text-emerald-950 font-extrabold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-3 py-3 text-center border-r border-emerald-200/60 w-12">No</th>
                  <th className="px-3 py-3 border-r border-emerald-200/60 w-36">Hari / Tanggal</th>
                  <th className="px-3 py-3 border-r border-emerald-200/60 w-44">
                    Tilawah <span className="text-[10px] text-emerald-700 block font-normal">(Input Guru)</span>
                  </th>
                  <th className="px-2 py-3 border-r border-emerald-200/60 text-center w-16">Baris</th>
                  <th className="px-3 py-3 border-r border-emerald-200/60">
                    Hafalan Baru <span className="text-[10px] text-emerald-700 block font-normal">(Tarik Master Al-Qur'an)</span>
                  </th>
                  <th className="px-2 py-3 border-r border-emerald-200/60 text-center w-16">Baris</th>
                  <th className="px-3 py-3 border-r border-emerald-200/60">
                    Murajaah & Audio <span className="text-[10px] text-emerald-700 block font-normal">(Input & Sound Ortu)</span>
                  </th>
                  <th className="px-2 py-3 border-r border-emerald-200/60 text-center w-16">Lembar</th>
                  <th className="px-3 py-3 border-r border-emerald-200/60 text-center w-24">Ttd / Status</th>
                  <th className="px-3 py-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                {weeklySheet.map((row, idx) => (
                  <tr key={row.record_date} className={`hover:bg-emerald-50/40 transition-colors ${row.isSaved ? 'bg-emerald-50/20' : ''}`}>
                    {/* No */}
                    <td className="px-3 py-3 text-center font-extrabold text-gray-700 border-r border-gray-200 bg-gray-50/50">
                      {idx + 1}
                    </td>

                    {/* Hari / Tanggal */}
                    <td className="px-3 py-3 border-r border-gray-200 font-bold text-gray-800 bg-gray-50/30">
                      <div className="text-sm font-extrabold text-emerald-900">{row.day_name}</div>
                      <div className="text-[11px] text-gray-500 font-medium">{row.record_date}</div>
                    </td>

                    {/* Tilawah (Guru input) */}
                    <td className="px-2 py-2 border-r border-gray-200">
                      <input
                        type="text"
                        value={row.tilawah_text}
                        onChange={(e) => handleCellChange(idx, 'tilawah_text', e.target.value)}
                        placeholder="Contoh: Surah 2 (Ayat 1-10)"
                        readOnly={viewMode === 'ortu'}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-gray-50"
                      />
                    </td>
                    <td className="px-1.5 py-2 border-r border-gray-200 text-center">
                      <input
                        type="number"
                        min="0"
                        value={row.tilawah_baris}
                        onChange={(e) => handleCellChange(idx, 'tilawah_baris', e.target.value)}
                        readOnly={viewMode === 'ortu'}
                        className="w-full px-1 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>

                    {/* Hafalan Baru (Selected from Master Qur'an) */}
                    <td className="px-2 py-2 border-r border-gray-200">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenQuranModal(idx)}
                          disabled={viewMode === 'ortu'}
                          className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all active:scale-95 disabled:opacity-60"
                          title="Tarik dari Master Al-Qur'an"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{row.hafalan_surah_name ? row.hafalan_surah_name : 'Pilih Surah'}</span>
                        </button>

                        {row.hafalan_surah_number && (
                          <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md border">
                            Ayat {row.hafalan_ayah_start}-{row.hafalan_ayah_end}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-1.5 py-2 border-r border-gray-200 text-center">
                      <input
                        type="number"
                        min="0"
                        value={row.hafalan_baris}
                        onChange={(e) => handleCellChange(idx, 'hafalan_baris', e.target.value)}
                        readOnly={viewMode === 'ortu'}
                        className="w-full px-1 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>

                    {/* Murajaah (Input Orang Tua / Audio Sound) */}
                    <td className="px-2 py-2 border-r border-gray-200">
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={row.murajaah_text}
                          onChange={(e) => handleCellChange(idx, 'murajaah_text', e.target.value)}
                          placeholder="Juz/Surah/Ayat Murajaah..."
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />

                        {/* Sound Audio Recording Section */}
                        <div className="flex items-center gap-2">
                          {row.audio_url ? (
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(row.audio_url)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                                playingAudioUrl === row.audio_url
                                  ? 'bg-rose-600 text-white animate-pulse shadow-md'
                                  : 'bg-indigo-100 text-indigo-900 border border-indigo-300 hover:bg-indigo-200'
                              }`}
                            >
                              {playingAudioUrl === row.audio_url ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              <span>{playingAudioUrl === row.audio_url ? 'Pause Voice' : 'Dengar Sound Murajaah'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-medium italic">Belum ada rekaman suara</span>
                          )}

                          {/* Upload Sound Button (Orang Tua / Guru) */}
                          <label className="cursor-pointer px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold border border-gray-300 flex items-center gap-1 transition-all active:scale-95">
                            {uploadingAudioRow === idx ? (
                              <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                            ) : (
                              <Upload className="w-3 h-3 text-emerald-600" />
                            )}
                            <span>{uploadingAudioRow === idx ? 'Mengunggah...' : 'Upload Sound'}</span>
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleAudioUpload(idx, e.target.files[0])
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className="px-1.5 py-2 border-r border-gray-200 text-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={row.murajaah_lembar}
                        onChange={(e) => handleCellChange(idx, 'murajaah_lembar', e.target.value)}
                        className="w-full px-1 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>

                    {/* Ttd / Verification */}
                    <td className="px-2 py-2 border-r border-gray-200 text-center">
                      {row.isSaved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold italic">Belum Simpan</span>
                      )}
                    </td>

                    {/* Aksi Simpan Per Hari */}
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleSaveSingleDay(idx)}
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center mx-auto"
                        title="Simpan Log Hari Ini"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Notes & Signatures (Matching Physical Form Bottom Section) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Catatan & Ttd Guru */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>Catatan Guru / Musyrif :</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Guru 1 : Verified
            </span>
          </div>
          <textarea
            rows={3}
            value={summaryTeacherNotes}
            onChange={(e) => setSummaryTeacherNotes(e.target.value)}
            placeholder="Tuliskan evaluasi, tajwid, makhraj, dan catatan khusus dari Guru/Musyrif..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Catatan & Ttd Orang Tua */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-teal-100 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="font-extrabold text-sm text-teal-950 flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-700" />
              <span>Catatan Orang Tua :</span>
            </h3>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Ttd Ortu : Verified
            </span>
          </div>
          <textarea
            rows={3}
            value={summaryParentNotes}
            onChange={(e) => setSummaryParentNotes(e.target.value)}
            placeholder="Tuliskan perkembangan murajaah anak di rumah atau pesan untuk guru..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* MODAL TARIK MASTER AL-QUR'AN (Pilih Surah & Rentang Ayat) */}
      {showQuranModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-300" />
                <span>Pilih Hafalan dari Master Al-Qur'an</span>
              </h3>
              <button
                onClick={() => setShowQuranModal(false)}
                className="p-1 rounded-full text-emerald-100 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Cari Surah */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quranSearch}
                  onChange={(e) => setQuranSearch(e.target.value)}
                  placeholder="Cari nama surah atau nomor (misal: Al-Baqarah)..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Grid / List Surah */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  1. Pilih Surah ({filteredQuranSurahs.length} Surah):
                </label>
                <div className="max-h-48 overflow-y-auto border rounded-xl divide-y divide-gray-100 bg-gray-50/50">
                  {filteredQuranSurahs.map((s) => (
                    <button
                      key={s.nomor}
                      type="button"
                      onClick={() => {
                        setModalSurah(s)
                        setModalAyahStart(1)
                        setModalAyahEnd(s.jumlah_ayat || 7)
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                        modalSurah?.nomor === s.nomor
                          ? 'bg-emerald-100 font-extrabold text-emerald-950 border-l-4 border-emerald-600'
                          : 'hover:bg-emerald-50 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-200/60 text-emerald-900 font-bold text-[11px] flex items-center justify-center">
                          {s.nomor}
                        </span>
                        <span>{s.nama_latin}</span>
                        <span className="text-[10px] text-gray-400">({s.arti})</span>
                      </div>
                      <span className="font-serif text-sm text-emerald-800">{s.nama} ({s.jumlah_ayat} Ayat)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Rentang Ayat & Jumlah Baris */}
              {modalSurah && (
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Surah Terpilih: {modalSurah.nama_latin} ({modalSurah.jumlah_ayat} Ayat)</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Ayat Awal</label>
                      <input
                        type="number"
                        min="1"
                        max={modalSurah.jumlah_ayat}
                        value={modalAyahStart}
                        onChange={(e) => setModalAyahStart(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Ayat Akhir</label>
                      <input
                        type="number"
                        min={modalAyahStart}
                        max={modalSurah.jumlah_ayat}
                        value={modalAyahEnd}
                        onChange={(e) => setModalAyahEnd(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Jumlah Baris</label>
                      <input
                        type="number"
                        min="1"
                        value={modalBarisCount}
                        onChange={(e) => setModalBarisCount(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowQuranModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyQuranSelection}
                disabled={!modalSurah}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                Terapkan ke Form Tahfizh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
