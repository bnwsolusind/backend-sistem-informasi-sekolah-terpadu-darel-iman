/**
 * ============================================================
 * GLOBAL COMPONENT SYSTEM — SISTEM MANAJEMEN SEKOLAH TERPADU
 * ============================================================
 *
 * Satu-satunya sumber component global di seluruh aplikasi.
 * Seluruh halaman WAJIB memakai komponen dari barrel ini.
 *
 * DILARANG membuat duplikat: DashboardHeader, GuruHeader,
 * YayasanHeader, PortalHeader, MutabaahHeader, StudentTable,
 * TeacherTable, DashboardCard, InfoCard, SummaryBox, dsb.
 *
 * ============================================================
 */

// --- Primitive global components ---
export { default as AppButton } from './AppButton'
export { default as AppIconButton } from './IconButton'
export { default as AppBadge, getStatusVariant } from './AppBadge'
export { default as AppModal } from './AppModal'
export { default as AppDrawer } from './AppDrawer'
export { default as AppPagination } from './AppPagination'
export { default as AppEmptyState } from './AppEmptyState'
export { default as AppErrorState } from './AppErrorState'
export { default as AppSkeleton } from './AppSkeleton'
export { default as AppSearch } from './AppSearch'
export { default as AppFilterBar } from './AppFilterBar'
export { default as AppToolbar } from './AppToolbar'

// --- Layout global components ---
export { default as AppPageLayout } from './AppPageLayout'
export { default as AppPageHeader } from './AppPageHeader'
export { default as AppHero } from './AppHero'
export { default as AppBreadcrumb } from './AppBreadcrumb'
export { default as PageContainer } from './PageContainer'
export { default as AppBottomNavigation } from './AppBottomNavigation'

// --- Data display ---
export { default as AppDataTable } from './AppDataTable'
export { default as AppCard } from './AppCard'
export { SectionCard } from './AppCard'
export { default as AppTabs } from './AppTabs'
export { default as KpiCard } from './KpiCard'
export { default as SummaryCard } from './SummaryCard'
export { default as InfoCard } from './SummaryCard'
export { default as PersonCard } from './PersonCard'
export { default as ActionDropdown } from './ActionDropdown'
export { default as AppDropdown } from './ActionDropdown'
export { default as AppForm } from './AppForm'

// --- Buttons ---
export { default as IconButton } from './IconButton'

// --- Dialog konfirmasi CRUD ---
export { default as ConfirmDialog } from './ConfirmDialog'
export { default as DeleteDialog } from './DeleteDialog'
export { default as ExportDialog } from './ExportDialog'
export { default as ImportDialog } from './ImportDialog'
export { default as AppConfirmDialog } from './ConfirmDialog'
export { default as AppDeleteDialog } from './DeleteDialog'
export { default as AppExportDialog } from './ExportDialog'
export { default as AppImportDialog } from './ImportDialog'

// --- Notification & Chat ---
export { default as NotificationCenter } from './NotificationCenter'
export { default as AppNotificationCenter } from './NotificationCenter'
export { ToastProvider as AppToast } from './ToastProvider'
export { ToastProvider, useToast } from './ToastProvider'

// --- Identity ---
export { default as PersonAvatar } from '../ui/PersonAvatar'
export { default as PersonIdentityCell } from '../ui/PersonIdentityCell'
export { PersonIdentityCell as PersonIdentityCellNamed } from '../ui/PersonIdentityCell'
