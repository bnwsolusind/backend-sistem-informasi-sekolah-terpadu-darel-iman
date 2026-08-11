import React from 'react'
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Database,
  Eye,
  FileInput,
  FileSpreadsheet,
  Home,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  AppBadge,
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppFilterBar,
  AppModal,
  AppPageHeader,
  AppPagination,
  AppSearch,
  AppSkeleton,
  ConfirmDialog,
  IconButton,
  SummaryCard,
} from '../app'

export const masterStyles = {
  card: 'rounded-[var(--master-card-radius,18px)] border border-slate-200/80 bg-white shadow-[var(--shadow-soft-xl)] dark:border-slate-700/80 dark:bg-[#1B2433]',
  control:
    'h-12 rounded-[var(--master-control-radius,14px)] border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/15 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200',
  label: 'mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-100',
  error: 'mt-1.5 text-xs font-medium text-rose-600',
}

export function MasterDataPage({ children, className = '', hideBreadcrumb = false }) {
  const location = useLocation()
  const currentLabel = {
    '/dashboard/students/unit-pendidikan': 'Unit Pendidikan',
    '/dashboard/master-jenis-unit': 'Jenis Unit',
    '/dashboard/master-tahun-ajaran': 'Tahun Ajaran',
    '/dashboard/master-subjects': 'Mata Pelajaran',
    '/dashboard/master-jabatan': 'Jabatan',
    '/dashboard/employees': 'Pegawai',
    '/dashboard/students': 'Siswa',
  }[location.pathname] || 'Master Data'

  return (
    <div className={`master-data-page space-y-6 pb-12 ${className}`}>
      {!hideBreadcrumb && (
        <nav className="master-breadcrumb ui-enter" aria-label="Breadcrumb">
          <Link to="/dashboard" aria-label="Kembali ke Dashboard"><Home aria-hidden="true" /></Link>
          <ChevronRight aria-hidden="true" />
          <span>Master Data</span>
          <ChevronRight aria-hidden="true" />
          <strong aria-current="page">{currentLabel}</strong>
        </nav>
      )}
      {children}
    </div>
  )
}

export function MasterPageHeader({ title, description, actions, tone = 'default', icon: Icon }) {
  return (
    <AppPageHeader
      variant={tone === 'brand' ? 'brand' : 'card'}
      icon={Icon}
      title={title}
      description={description}
      actions={actions && <MasterHeaderActions>{actions}</MasterHeaderActions>}
    />
  )
}

export function MasterHeaderActions({ children }) {
  return <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center">{children}</div>
}

const actionIcons = {
  export: FileSpreadsheet,
  import: FileInput,
  primary: Plus,
}

export function MasterActionButton({ variant = 'primary', icon: CustomIcon, children, className = '', ...props }) {
  const Icon = CustomIcon || actionIcons[variant] || actionIcons.primary
  return (
    <AppButton
      type="button"
      variant={variant === 'primary' ? 'primary' : 'secondary'}
      size="lg"
      icon={Icon}
      className={className}
      {...props}
    >
      {children}
    </AppButton>
  )
}

export function MasterStatsGrid({ children, className = '' }) {
  return <section className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>{children}</section>
}

const statSchemeMap = {
  success: 'emerald',
  warning: 'amber',
  info: 'blue',
  danger: 'rose',
  neutral: 'slate',
}

export function MasterStatCard({ icon: Icon, label, value, description, variant = 'success', delay = 0 }) {
  return (
    <div className="ui-enter" style={{ animationDelay: `${delay}ms` }}>
      <SummaryCard
        icon={Icon}
        title={label}
        value={value}
        description={description}
        colorScheme={statSchemeMap[variant] || 'emerald'}
      />
    </div>
  )
}

export function MasterFilterBar({ search, filters, children }) {
  return (
    <AppFilterBar label={null} className="ui-enter">
      {search}
      {(filters || children) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300">
            <span className="text-[#0E5C44] dark:text-[#3FBF75]">Filter:</span>
          </span>
          {filters || children}
        </div>
      )}
    </AppFilterBar>
  )
}

export function MasterSearchInput({ className = '', ...props }) {
  return <AppSearch className={className} {...props} />
}

export function MasterFilterSelect({ className = '', children, ...props }) {
  return (
    <div className={`relative min-w-38 ${className}`}>
      <select className={`${masterStyles.control} w-full appearance-none px-3.5 pr-9`} {...props}>{children}</select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

export function MasterDataTable({ children, className = '' }) {
  return (
    <AppCard noPadding className={`master-table ui-enter overflow-hidden ${className}`}>
      <div className="overflow-x-auto">{children}</div>
    </AppCard>
  )
}

const badgeVariantMap = {
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
  neutral: 'neutral',
}

export function MasterBadge({ variant = 'neutral', children, color, className = '' }) {
  return (
    <AppBadge
      variant={badgeVariantMap[variant] || 'neutral'}
      className={className}
      style={color ? { borderColor: color, color } : undefined}
    >
      {children}
    </AppBadge>
  )
}

export function MasterStatusBadge({ active, activeLabel = 'Aktif', inactiveLabel = 'Tidak Aktif' }) {
  return (
    <AppBadge variant={active ? 'success' : 'danger'} dot>
      {active ? activeLabel : inactiveLabel}
    </AppBadge>
  )
}

export function MasterActionGroup({ children }) {
  return <div className="inline-flex items-center gap-2">{children}</div>
}

const iconButtonVariants = {
  view: { Icon: Eye, variant: 'outline', label: 'Lihat Detail' },
  edit: { Icon: Pencil, variant: 'warning', label: 'Edit Data' },
  delete: { Icon: Trash2, variant: 'destructive', label: 'Hapus Data' },
}

export function MasterActionIconButton({ variant = 'view', icon: CustomIcon, label, loading = false, ...props }) {
  const config = iconButtonVariants[variant] || iconButtonVariants.view
  const Icon = CustomIcon || config.Icon
  const title = label || config.label

  return (
    <IconButton
      label={title}
      icon={Icon}
      variant={config.variant}
      size="icon"
      loading={loading}
      className="h-11 w-11"
      {...props}
    />
  )
}

export function MasterPagination({ meta = {}, page = 1, onPageChange }) {
  if (!(meta.total > 0)) return null
  return (
    <AppPagination
      meta={meta}
      currentPage={page}
      onPageChange={onPageChange}
    />
  )
}

function ModalShell({ isOpen, onClose, icon: Icon = Database, title, description, children, footer, maxWidth = 'max-w-2xl' }) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      icon={Icon}
      title={title}
      description={description}
      footer={footer}
      maxWidth={maxWidth}
    >
      {children}
    </AppModal>
  )
}

export function MasterFormModal(props) {
  return <ModalShell {...props} />
}

export function MasterDetailModal(props) {
  return <ModalShell maxWidth="max-w-xl" {...props} />
}

export function MasterDeleteDialog({ isOpen, onClose, onConfirm, title = 'Hapus data?', description, isLoading = false }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={description || 'Tindakan ini tidak dapat dibatalkan.'}
      action="delete"
      confirmLabel="Hapus"
      isDanger
      isLoading={isLoading}
      icon={Trash2}
    />
  )
}

export function MasterLoadingState({ label = 'Memuat data...' }) {
  return (
    <div className={`${masterStyles.card} p-4`}>
      <AppSkeleton variant="table" rows={4} cols={4} />
      <p className="mt-3 text-center text-sm font-medium text-emerald-700 dark:text-emerald-300">{label}</p>
    </div>
  )
}

export function MasterEmptyState({ title = 'Data Tidak Ditemukan', description = 'Belum ada data yang sesuai dengan kriteria.', action }) {
  return <AppEmptyState title={title} description={description} action={action} />
}

export function MasterErrorState({ title = 'Data gagal dimuat', description = 'Terjadi kesalahan saat mengambil data.', onRetry }) {
  return <AppErrorState title={title} description={description} onRetry={onRetry} />
}
