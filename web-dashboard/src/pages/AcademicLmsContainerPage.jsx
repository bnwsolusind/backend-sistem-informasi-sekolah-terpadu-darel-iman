import { useEffect, useMemo } from 'react'
import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import AcademicModuleContainer from '../components/akademik/AcademicModuleContainer'
import MasterTahunAjaranPage from './MasterTahunAjaranPage'
import MasterModulSemesterPage from './MasterModulSemesterPage'
import MasterKurikulumPage from './MasterKurikulumPage'
import MasterKelasPage from './MasterKelasPage'
import MasterSubjectPage from './MasterSubjectPage'
import MasterSchedulePage from './MasterSchedulePage'
import MasterCapaianPembelajaranPage from './MasterCapaianPembelajaranPage'
import MasterTujuanPembelajaranPage from './MasterTujuanPembelajaranPage'
import LmsModulAjarPage from './LmsModulAjarPage'
import LmsMateriPage from './LmsMateriPage'
import LmsMediaPage from './LmsMediaPage'
import LmsReferensiPage from './LmsReferensiPage'
import LmsAktivitasBelajarPage from './LmsAktivitasBelajarPage'
import LmsDiskusiPage from './LmsDiskusiPage'
import LmsPenugasanPage from './LmsPenugasanPage'
import LmsPengumpulanTugasPage from './LmsPengumpulanTugasPage'
import LmsKisiKisiPage from './LmsKisiKisiPage'
import LmsBankSoalPage from './LmsBankSoalPage'
import LmsUjianPage from './LmsUjianPage'
import LmsPenilaianPage from './LmsPenilaianPage'
import LmsRaporPage from './LmsRaporPage'

const CONTAINERS = {
  pengaturan: {
    title: 'Pengaturan Akademik',
    description: 'Kelola periode, kurikulum, kelas, mata pelajaran, dan jadwal tanpa mengubah alur CRUD masing-masing modul.',
    tabs: [
      ['tahun-ajaran', 'Tahun Ajaran', MasterTahunAjaranPage],
      ['semester', 'Semester', MasterModulSemesterPage],
      ['kurikulum', 'Kurikulum', MasterKurikulumPage],
      ['kelas-rombel', 'Kelas & Rombel', MasterKelasPage],
      ['mata-pelajaran', 'Mata Pelajaran', MasterSubjectPage],
      ['jadwal', 'Jadwal Pelajaran', MasterSchedulePage],
    ],
  },
  perencanaan: {
    title: 'Perencanaan Pembelajaran',
    description: 'Susun CP, TP, dan Modul Ajar dalam alur yang ringkas dengan data dan relasi dari API yang sudah tersedia.',
    tabs: [
      ['cp', 'Capaian Pembelajaran', MasterCapaianPembelajaranPage],
      ['tp', 'Tujuan Pembelajaran', MasterTujuanPembelajaranPage],
      ['modul-ajar', 'Modul Ajar', LmsModulAjarPage],
    ],
  },
  pembelajaran: {
    title: 'Pembelajaran',
    description: 'Akses konten pembelajaran, aktivitas, dan diskusi dari satu ruang kerja.',
    tabs: [
      ['materi', 'Materi', LmsMateriPage],
      ['media', 'Media', LmsMediaPage],
      ['referensi', 'Referensi', LmsReferensiPage],
      ['aktivitas', 'Aktivitas Belajar', LmsAktivitasBelajarPage],
      ['diskusi', 'Diskusi Kelas', LmsDiskusiPage],
    ],
  },
  evaluasi: {
    title: 'Tugas & Evaluasi',
    description: 'Kelola alur penugasan, pengumpulan, kisi-kisi, bank soal, dan CBT dengan CRUD lama yang tetap utuh.',
    tabs: [
      ['penugasan', 'Penugasan', LmsPenugasanPage],
      ['pengumpulan', 'Pengumpulan', LmsPengumpulanTugasPage],
      ['kisi-kisi', 'Kisi-kisi', LmsKisiKisiPage],
      ['bank-soal', 'Bank Soal', LmsBankSoalPage],
      ['cbt', 'Ujian Online', LmsUjianPage],
    ],
  },
  'nilai-rapor': {
    title: 'Nilai & Rapor',
    description: 'Buku nilai, rekap, rapor digital, dan keluaran PDF tersedia dalam satu area.',
    tabs: [
      ['buku-nilai', 'Buku Nilai', LmsPenilaianPage],
      ['rekap', 'Rekap Nilai', LmsPenilaianPage],
      ['rapor', 'Rapor Digital', LmsRaporPage],
    ],
  },
}

export default function AcademicLmsContainerPage({ section }) {
  const config = CONTAINERS[section]
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab')
  const defaultTab = config.tabs[0][0]
  const selected = useMemo(() => config.tabs.find(([key]) => key === activeTab), [activeTab, config.tabs])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  if (!selected) {
    const params = new URLSearchParams(searchParams)
    params.set('tab', defaultTab)
    return <Navigate to={`${location.pathname}?${params.toString()}`} replace />
  }

  const ActivePage = selected[2]
  const tabs = config.tabs.map(([key, label]) => ({ key, label }))

  return (
    <AcademicModuleContainer title={config.title} description={config.description} tabs={tabs}>
      <ActivePage embedded hidePageHeader hideBreadcrumb />
    </AcademicModuleContainer>
  )
}
