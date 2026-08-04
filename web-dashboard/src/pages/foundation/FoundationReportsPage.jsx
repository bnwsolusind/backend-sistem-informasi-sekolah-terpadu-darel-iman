import React from 'react'
import { Link } from 'react-router-dom'
import { Users, GraduationCap, ArrowRightLeft, Award, BookOpen, Building2, ArrowRight, ShieldCheck } from 'lucide-react'

export function FoundationReportsPage() {
  const reports = [
    {
      id: 'sdm',
      title: 'Laporan Sumber Daya Manusia',
      description: 'Laporan tenaga pendidik dan kependidikan, rasio guru, status kepegawaian, dan distribusi per unit.',
      path: '/dashboard/yayasan/laporan/sdm',
      icon: Users,
      color: 'bg-emerald-50 text-[#0E5C44] dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      id: 'siswa',
      title: 'Laporan Data Siswa',
      description: 'Laporan jumlah, distribusi gender, jenjang, kelas/rombel, dan pertumbuhan siswa aktif.',
      path: '/dashboard/yayasan/laporan/siswa',
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
    },
    {
      id: 'mutasi',
      title: 'Laporan Mutasi Siswa',
      description: 'Laporan perpindahan siswa masuk, keluar, dan antarunit beserta selisih net pertumbuhan.',
      path: '/dashboard/yayasan/laporan/mutasi',
      icon: ArrowRightLeft,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300',
    },
    {
      id: 'kelulusan',
      title: 'Laporan Kelulusan Siswa',
      description: 'Laporan hasil penetapan kelulusan, persentase kelulusan, dan kelulusan tepat waktu.',
      path: '/dashboard/yayasan/laporan/kelulusan',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
    },
    {
      id: 'alumni',
      title: 'Laporan Data Alumni',
      description: 'Laporan penelusuran karir alumni, angkatan, perguruan tinggi lanjutan, dan status pekerjaan.',
      path: '/dashboard/yayasan/laporan/alumni',
      icon: BookOpen,
      color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-300',
    },
    {
      id: 'lintas-unit',
      title: 'Laporan Lintas Unit (Eksekutif)',
      description: 'Laporan eksekutif perbandingan komparatif seluruh unit pendidikan di bawah yayasan.',
      path: '/dashboard/yayasan/laporan/lintas-unit',
      icon: Building2,
      color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-300',
    },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1B2433] md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#0E5C44] dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Pusat Laporan Eksekutif Pengurus Yayasan</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Daftar Modul Laporan</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pilih salah satu menu laporan eksekutif di bawah ini untuk melihat KPI, grafik, rekap, data rinci, dan export.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              to={item.path}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-[#1B2433]"
            >
              <div className="space-y-4">
                <div className={`w-fit rounded-xl p-3 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-[#0E5C44] dark:group-hover:text-emerald-400 transition">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-[#0E5C44] dark:border-slate-800 dark:text-emerald-400">
                <span>Buka Laporan Full</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
