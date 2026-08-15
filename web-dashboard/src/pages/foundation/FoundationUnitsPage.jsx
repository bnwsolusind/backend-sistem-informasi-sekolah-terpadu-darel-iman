import { useCallback, useEffect, useMemo, useState } from 'react'
import ActionDropdown from '../../components/app/ActionDropdown'
import { Building2, CheckCircle2, FileSpreadsheet, GraduationCap, MapPin, RefreshCcw, School, ShieldAlert, UsersRound } from 'lucide-react'
import api from '../../services/api'
import {
  MasterActionButton,
  MasterDataPage,
  MasterDataTable,
  MasterEmptyState,
  MasterErrorState,
  MasterFilterBar,
  MasterFilterSelect,
  MasterPageHeader,
  MasterPagination,
  MasterSearchInput,
  MasterStatCard,
  MasterStatsGrid,
  MasterStatusBadge,
} from '../../components/master-data'
import { PersonIdentityCell } from '../../components/ui/PersonIdentityCell'
import KpiDetailDrawer from '../../components/KpiDetailDrawer'
import { FoundationExportModal } from '../../components/foundation/FoundationExportModal'

const LEVEL_OPTIONS = ['TKIT', 'TAUD', 'SDIT', 'MIT', 'SMPIT', 'SMAIT', 'PONPES', 'Mahad']

export function FoundationUnitsPage() {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 15

  const [selectedUnitId, setSelectedUnitId] = useState(null)
  const [showExport, setShowExport] = useState(false)

  const fetchUnits = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setIsFetching(true)
    setError(false)
    try {
      const params = {
        search: search || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        per_page: 100,
      }
      const res = await api.get('/foundation/units', { params })
      const rawData = res.data?.data || res.data || []
      setUnits(Array.isArray(rawData) ? rawData : [])
    } catch (err) {
      console.error('Failed to fetch foundation units:', err)
      setError(true)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [search, selectedStatus])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  const filteredUnits = useMemo(() => units.filter((u) => {
    const name = (u.name || u.nama || '').toString().toLowerCase()
    const code = (u.code || u.kode || '').toString().toLowerCase()
    const level = (u.jenis_unit || u.level || '').toString().toLowerCase()

    const matchesSearch = name.includes(search.toLowerCase()) || code.includes(search.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || level.includes(selectedLevel.toLowerCase())
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'aktif' && (u.is_active || u.status === 'aktif')) ||
      (selectedStatus === 'nonaktif' && (!u.is_active && u.status !== 'aktif'))

    return matchesSearch && matchesLevel && matchesStatus
  }), [units, search, selectedLevel, selectedStatus])

  const totalItems = filteredUnits.length
  const lastPage = Math.max(1, Math.ceil(totalItems / perPage))
  const paginatedUnits = filteredUnits.slice((page - 1) * perPage, page * perPage)

  const totalGuru = units.reduce((acc, u) => acc + Number(u.guru_count || 0), 0)
  const totalSiswa = units.reduce((acc, u) => acc + Number(u.siswa_aktif_count || 0), 0)
  const activeUnits = units.filter((u) => u.is_active || u.status === 'aktif').length

  const handleRefresh = () => {
    setPage(1)
    fetchUnits(Boolean(units.length))
  }

  const levelOptions = useMemo(() => {
    const set = new Set(units.map((u) => u.jenis_unit || u.level).filter(Boolean))
    return Array.from(set)
  }, [units])

  const exportRows = paginatedUnits.map((u, idx) => ({
    No: (page - 1) * perPage + idx + 1,
    Kode: u.code || u.kode || '-',
    'Nama Unit': u.name || u.nama || '-',
    'Jenis Unit': u.jenis_unit || u.level || '-',
    'Kepala Sekolah': u.kepala_sekolah || 'Belum Ditentukan',
    Guru: u.guru_count || 0,
    Pegawai: u.pegawai_count || 0,
    Siswa: u.siswa_aktif_count || 0,
    Kelas: u.kelas_count || 0,
    Rombel: u.rombel_count || 0,
    Status: u.is_active || u.status === 'aktif' ? 'Aktif' : 'Nonaktif',
  }))

  return (
    <MasterDataPage hideBreadcrumb className="foundation-units-page">
      <MasterPageHeader
        title="Unit Pendidikan"
        description="Pantau seluruh Unit Pendidikan, pimpinan, jumlah guru, pegawai, siswa, kelas, dan rombel secara real-time."
        tone="brand"
        icon={School}
        actions={(
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <ShieldAlert className="h-3 w-3" />
              Mode Monitoring • Akses Read-Only
            </span>
            <MasterActionButton variant="export" icon={FileSpreadsheet} onClick={() => setShowExport(true)}>
              Export Data
            </MasterActionButton>
          </>
        )}
      />

      <MasterStatsGrid>
        <MasterStatCard icon={Building2} label="Total Unit" value={units.length} description="Terdaftar di sistem" variant="success" delay={40} />
        <MasterStatCard icon={CheckCircle2} label="Unit Aktif" value={activeUnits} description={`${units.length - activeUnits} unit nonaktif`} variant="info" delay={80} />
        <MasterStatCard icon={UsersRound} label="Total Guru" value={totalGuru.toLocaleString('id-ID')} description="Guru pada seluruh unit" variant="warning" delay={120} />
        <MasterStatCard icon={GraduationCap} label="Total Siswa Aktif" value={totalSiswa.toLocaleString('id-ID')} description="Siswa terdaftar aktif" variant="neutral" delay={160} />
      </MasterStatsGrid>

      <MasterFilterBar
        search={<MasterSearchInput placeholder="Cari nama unit atau kode..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />}
        filters={
          <>
            <MasterFilterSelect value={selectedLevel} onChange={(e) => { setSelectedLevel(e.target.value); setPage(1) }} aria-label="Filter jenjang">
              <option value="all">Semua Jenjang</option>
              {(levelOptions.length ? levelOptions : LEVEL_OPTIONS).map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
            </MasterFilterSelect>
            <MasterFilterSelect value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setPage(1) }} aria-label="Filter status">
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </MasterFilterSelect>
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Muat ulang data"
              title="Muat ulang"
              className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--master-control-radius,14px)] border border-slate-200 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-emerald-950/40"
            >
              <RefreshCcw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </>
        }
      />

      <MasterDataTable className="foundation-table">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Daftar Unit Pendidikan</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Data unit sesuai filter dan kewenangan pengguna.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{totalItems} unit</span>
        </div>
        <div className="overflow-x-auto">
          {error ? (
            <div className="p-5"><MasterErrorState title="Data unit gagal dimuat" description="Periksa koneksi kemudian coba muat ulang." onRetry={handleRefresh} /></div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="w-[5%] px-2 py-3 text-center">No</th>
                  <th className="w-[26%] px-3 py-3 font-bold">Identitas Unit</th>
                  <th className="hidden w-[16%] px-3 py-3 font-bold md:table-cell">Lokasi</th>
                  <th className="hidden w-[18%] px-3 py-3 font-bold lg:table-cell">Kepala Sekolah</th>
                  <th className="hidden w-[19%] px-3 py-3 font-bold xl:table-cell">Statistik</th>
                  <th className="hidden w-[9%] px-2 py-3 text-center font-bold sm:table-cell">Status</th>
                  <th className="w-[7%] px-2 py-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td colSpan={7} className="px-4 py-4"><div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" /></td>
                    </tr>
                  ))
                ) : paginatedUnits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-5"><MasterEmptyState title="Belum ada unit pendidikan" description="Ubah filter pencarian untuk menampilkan unit pendidikan lain." /></td>
                  </tr>
                ) : (
                  paginatedUnits.map((u, idx) => {
                    const isActive = u.is_active || u.status === 'aktif'
                    const level = u.jenis_unit || u.level || 'UP'
                    return (
                      <tr key={u.id || idx} className="transition-colors hover:bg-emerald-50/40">
                        <td className="px-2 py-3 text-center text-xs font-bold text-slate-400">{(page - 1) * perPage + idx + 1}</td>
                        <td className="px-3 py-3">
                          <PersonIdentityCell
                            src={u.logo_url}
                            name={u.name || u.nama}
                            subtitle={`${u.code || u.kode || '-'} • ${level}`}
                          />
                        </td>
                        <td className="hidden px-3 py-3 md:table-cell">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200"><MapPin className="h-3.5 w-3.5 text-slate-400" />{u.location || u.description || 'Padang'}</span>
                        </td>
                        <td className="hidden px-3 py-3 lg:table-cell">
                          <PersonIdentityCell name={u.kepala_sekolah || 'Belum Ditentukan'} subtitle={u.principal_nip ? `NIP. ${u.principal_nip}` : 'Kepala Unit'} />
                        </td>
                        <td className="hidden px-3 py-3 xl:table-cell">
                          <div className="space-y-1 text-[10px] font-medium text-slate-500 dark:text-slate-300">
                            <span className="flex items-center gap-1.5"><GraduationCap className="h-3 w-3" />{(u.siswa_aktif_count || 0).toLocaleString('id-ID')} siswa</span>
                            <span className="flex items-center gap-1.5"><UsersRound className="h-3 w-3" />{(u.guru_count || 0).toLocaleString('id-ID')} guru</span>
                            <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" />{(u.rombel_count || 0).toLocaleString('id-ID')} rombel</span>
                          </div>
                        </td>
                        <td className="hidden px-2 py-3 text-center sm:table-cell">
                          <MasterStatusBadge active={isActive} activeLabel="Aktif" inactiveLabel="Nonaktif" />
                        </td>
                        <td className="px-2 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <ActionDropdown onView={() => setSelectedUnitId(u.id)} />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </MasterDataTable>

      {totalItems > 0 && (
        <MasterPagination
          meta={{ total: totalItems, from: totalItems ? (page - 1) * perPage + 1 : 0, to: Math.min(page * perPage, totalItems), last_page: lastPage, current_page: page }}
          page={page}
          onPageChange={setPage}
          label="unit pendidikan"
        />
      )}

      <KpiDetailDrawer
        type="unit_pendidikan"
        id={selectedUnitId}
        isOpen={Boolean(selectedUnitId)}
        onClose={() => setSelectedUnitId(null)}
      />

      <FoundationExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        title="Unit Pendidikan Seluruh Yayasan"
        rows={exportRows}
        filename="Unit_Pendidikan_Yayasan"
      />
    </MasterDataPage>
  )
}
