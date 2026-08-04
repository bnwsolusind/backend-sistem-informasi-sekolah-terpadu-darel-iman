import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  CheckCircle2,
  Target,
  Award,
  Activity,
  Users,
  Building2,
  BookOpen,
  UserCheck,
  HeartHandshake,
  School,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react'

const ikonStat = {
  'Total Unit': Building2,
  'Unit Pendidikan': Building2,
  'Total Guru': UserCheck,
  'Guru': UserCheck,
  'Total Pegawai': Users,
  'Pegawai': Users,
  'Total Siswa': GraduationCap,
  'Siswa': GraduationCap,
  'Orang Tua': HeartHandshake,
  'Alumni': Sparkles,
  'Total Kelas': School,
  'Kelas': School,
  'Rombel': Layers,
  'Kehadiran Hari Ini': CheckCircle2,
  'Target Tahfizh Sekolah': Target,
  'Prestasi Siswa': Award,
  'Mutabaah Yaumiyah': Activity,
  'Kurikulum & Mapel': BookOpen,
  'Keuangan': DollarSign,
}

const colorMap = {
  'Unit Pendidikan': { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30' },
  'Guru': { bg: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30' },
  'Pegawai': { bg: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30' },
  'Siswa': { bg: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/30' },
  'Orang Tua': { bg: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30' },
  'Alumni': { bg: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30' },
  'Kelas': { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30' },
  'Rombel': { bg: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/30' },
}

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendType = 'up',
  trendText = 'dari bulan lalu',
  onClickTo,
  onClick,
  tooltipText,
}) {
  const navigate = useNavigate()
  const Icon = ikonStat[title] || Target
  const colorStyle = colorMap[title] || { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400' }

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    } else if (onClickTo) {
      navigate(onClickTo)
    }
  }

  const isClickable = Boolean(onClick || onClickTo)

  return (
    <div
      onClick={handleClick}
      title={tooltipText || `${title}: ${value}`}
      className={`group relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-3.5 shadow-xs transition-all duration-200 dark:border-slate-800 dark:bg-[#13221f] ${
        isClickable ? 'cursor-pointer hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${colorStyle.bg} transition-all duration-200 group-hover:scale-105`}>
          <Icon className="h-4.5 w-4.5 stroke-[2]" />
        </div>
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">
          {title}
        </span>
      </div>

      <div className="mt-2.5">
        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
          {value}
        </h3>
      </div>

      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold flex-wrap">
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-bold ${
              trendType === 'up'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trendType === 'up' ? '↑' : '↓'} {trend}
          </span>
        )}
        <span className="text-slate-400 font-normal truncate">
          {trendText}
        </span>
      </div>
    </div>
  )
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.string,
  trendType: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendText: PropTypes.string,
  onClickTo: PropTypes.string,
  tooltipText: PropTypes.string,
}

StatCard.defaultProps = {
  subtitle: '',
  trend: '',
  trendType: 'up',
  onClickTo: '',
  tooltipText: '',
}
