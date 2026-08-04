import { BookOpen, CalendarDays, GraduationCap, HeartHandshake } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const dashboardItems = [
  {
    title: 'Pembelajaran Terpadu',
    description: 'Satu ruang untuk mengikuti kegiatan belajar dan mengajar di sekolah.',
    icon: BookOpen,
  },
  {
    title: 'Agenda Sekolah',
    description: 'Pantau kegiatan dan agenda akademik yang sedang berlangsung.',
    icon: CalendarDays,
  },
  {
    title: 'Kolaborasi Akademik',
    description: 'Guru dan siswa terhubung dalam alur pembelajaran yang sama.',
    icon: HeartHandshake,
  },
]

export default function TeacherStudentPortalDashboardPage() {
  const user = useAuthStore((state) => state.user)
  const displayName = user?.name || user?.nama_lengkap || 'Pengguna'

  return (
    <main className="min-h-screen bg-[#F7F9FC] p-4 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0E5C44] via-[#187154] to-[#3FBF75] p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <GraduationCap className="absolute bottom-3 right-7 h-28 w-28 text-white/10" />
          <div className="relative max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-100">Portal Guru &amp; Siswa</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Assalamu&apos;alaikum, {displayName}</h1>
            <p className="mt-2 text-sm leading-6 text-emerald-50">
              Selamat datang di dashboard portal sekolah. Guru dan siswa menggunakan ruang portal yang sama untuk mendukung kegiatan pembelajaran.
            </p>
          </div>
        </section>

        <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dashboard Portal</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Gunakan menu utama di samping untuk membuka layanan sekolah yang tersedia pada akun Anda.
            </p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {dashboardItems.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-[18px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/70">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
