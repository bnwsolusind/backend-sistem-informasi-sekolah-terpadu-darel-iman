import { useCallback, useEffect, useMemo, useState } from 'react'
import { BadgeCheck, FileSpreadsheet, RefreshCcw, ShieldAlert, Users, UserCheck, UsersRound } from 'lucide-react'
import ActionDropdown from '../../components/app/ActionDropdown'
import api from '../../services/api'
import {
  MasterActionButton,
  MasterActionIconButton,
  MasterBadge,
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

export function FoundationEmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const [jenis, setJenis] = useState('all') // 'all' | 'guru' | 'pegawai'
  const [search, setSearch] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 15

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [selectedDetailType, setSelectedDetailType] = useState('pegawai')
  const [showExport, setShowExport] = useState(false)

  useEffect(() => {
    api.get('/foundation/units')
      .then((res) => {
        const raw = res.data?.data || res.data || []
        setUnits(Array.isArray(raw) ? raw : [])
      })
      .catch(() => {})
  }, [])

  const fetchEmployees = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setIsFetching(true)
    setError(false)
    try {
      const params = {
        search: search || undefined,
        unit_id: selectedUnit !== 'all' ? selectedUnit : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        per_page: 100,
      }
      const res = await api.get('/foundation/employees', { params })
      const resData = res.data
      let list = []
      if (Array.isArray(resData)) {
        list = resData
      } else if (resData?.data) {
        list = Array.isArray(resData.data) ? resData.data : resData.data.data || []
      }
      setEmployees(list)
    } catch (err) {
      console.error('Failed to fetch foundation employees:', err)
      setError(true)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [search, selectedUnit, selectedStatus])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const isGuru = (emp) => {
    const j = (emp.position?.nama_jabatan || emp.jabatan || '').toLowerCase()
    return j.includes('guru') || j.includes('pendidik')
  }

  const filteredEmployees = useMemo(() => employees.filter((emp) => {
    const name = (emp.nama_lengkap || emp.nama || '').toString().toLowerCase()
    const niy = (emp.niy || emp.nik || '').toString().toLowerCase()
    const unitName = (emp.unit?.name || emp.unit?.code || '').toString().toLowerCase()

    const matchesJenis = jenis === 'all' || (jenis === 'guru' ? isGuru(emp) : !isGuru(emp))
    const matchesSearch = name.includes(search.toLowerCase()) || niy.includes(search.toLowerCase())
    const matchesUnit = selectedUnit === 'all' || emp.unit_id === selectedUnit || unitName.includes(selectedUnit.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus

    return matchesJenis && matchesSearch && matchesUnit && matchesStatus
  }), [employees, jenis, search, selectedUnit, selectedStatus])

  const totalItems = filteredEmployees.length
  const lastPage = Math.max(1, Math.ceil(totalItems / perPage))
  const paginatedEmployees = filteredEmployees.slice((page - 1) * perPage, page * perPage)

  const totalGuru = employees.filter((e) => isGuru(e)).length
  const totalSDM = employees.length
  const totalTendik = Math.max(0, totalSDM - totalGuru)
  const guruTetap = employees.filter((e) => (e.status_pegawai || '').toLowerCase().includes('tetap')).length

  const handleOpenDetail = (emp) => {
    setSelectedDetailType(isGuru(emp) ? 'guru' : 'pegawai')
    setSelectedEmployeeId(emp.id)
  }

  const handleRefresh = () => {
    setPage(1)
    fetchEmployees(Boolean(employees.length))
  }

  const exportRows = paginatedEmployees.map((emp, idx) => ({
    No: (page - 1) * perPage + idx + 1,
    'NIY / NIK': emp.niy || emp.nik || '-',
    Nama: emp.nama_lengkap || emp.nama || '-',
    Jenis: isGuru(emp) ? 'Guru' : 'Pegawai',
    'Unit Kerja': emp.unit?.name || emp.unit?.code || '-',
    Jabatan: emp.position?.nama_jabatan || emp.jabatan || 'Staf',
    'Status Pegawai': emp.status_pegawai || 'Tetap',
    Status: emp.status || 'Aktif',
  }))

  return (
    <MasterDataPage hideBreadcrumb className="foundation-employees-page">
      <MasterPageHeader
        title="Pegawai & Guru Seluruh Unit"
        description="Pantau seluruh tenaga pendidik dan tenaga kependidikan pada semua Unit Pendidikan secara terpusat."
        tone="brand"
        icon={UsersRound}
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
        <MasterStatCard icon={Users} label="Total SDM" value={totalSDM} description="Seluruh pegawai & guru" variant="success" delay={40} />
        <MasterStatCard icon={UserCheck} label="Total Guru" value={totalGuru} description="Pendidik pengajar" variant="info" delay={80} />
        <MasterStatCard icon={UsersRound} label="Total Pegawai" value={totalTendik} description="Tenaga kependidikan" variant="warning" delay={120} />
        <MasterStatCard icon={BadgeCheck} label="Guru Tetap" value={guruTetap} description="Status kepegawaian tetap" variant="neutral" delay={160} />
      </MasterStatsGrid>

      <MasterFilterBar
        search={<MasterSearchInput placeholder="Cari nama, NIY, NIK, atau jabatan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />}
        filters={
          <>
            <MasterFilterSelect value={jenis} onChange={(e) => { setJenis(e.target.value); setPage(1) }} aria-label="Filter jenis SDM">
              <option value="all">Semua SDM</option>
              <option value="guru">Guru & Pendidik</option>
              <option value="pegawai">Pegawai & Tendik</option>
            </MasterFilterSelect>
            <MasterFilterSelect value={selectedUnit} onChange={(e) => { setSelectedUnit(e.target.value); setPage(1) }} aria-label="Filter unit kerja">
              <option value="all">Semua Unit</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.name || u.code}</option>)}
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
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Daftar Pegawai & Guru</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Data SDM sesuai filter dan kewenangan pengguna.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">{totalItems} SDM</span>
        </div>
        <div className="overflow-x-auto">
          {error ? (
            <div className="p-5"><MasterErrorState title="Data SDM gagal dimuat" description="Periksa koneksi kemudian coba muat ulang." onRetry={handleRefresh} /></div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="w-[5%] px-2 py-3 text-center">No</th>
                  <th className="w-[22%] px-3 py-3 font-bold">Nama SDM</th>
                  <th className="hidden w-[9%] px-3 py-3 font-bold md:table-cell">Jenis</th>
                  <th className="hidden w-[18%] px-3 py-3 font-bold lg:table-cell">Unit Kerja</th>
                  <th className="hidden w-[18%] px-3 py-3 font-bold xl:table-cell">Jabatan</th>
                  <th className="hidden w-[12%] px-3 py-3 font-bold lg:table-cell">Status Pegawai</th>
                  <th className="hidden w-[9%] px-2 py-3 text-center font-bold sm:table-cell">Status</th>
                  <th className="w-[7%] px-2 py-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td colSpan={8} className="px-4 py-4"><div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" /></td>
                    </tr>
                  ))
                ) : paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-5"><MasterEmptyState title="Belum ada data SDM" description="Ubah filter pencarian untuk menampilkan pegawai atau guru lain." /></td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp, idx) => {
                    const guru = isGuru(emp)
                    return (
                      <tr key={emp.id || idx} className="transition-colors hover:bg-emerald-50/40">
                        <td className="px-2 py-3 text-center text-xs font-bold text-slate-400">{(page - 1) * perPage + idx + 1}</td>
                        <td className="px-3 py-3">
                          <PersonIdentityCell
                            src={emp.foto || emp.photo}
                            name={emp.nama_lengkap || emp.nama}
                            subtitle={`${emp.niy || emp.nik || 'NIY tidak tersedia'}`}
                          />
                        </td>
                        <td className="hidden px-3 py-3 md:table-cell">
                          <MasterBadge variant={guru ? 'success' : 'info'}>{guru ? 'Guru' : 'Pegawai'}</MasterBadge>
                        </td>
                        <td className="hidden px-3 py-3 lg:table-cell">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{emp.unit?.name || emp.unit?.code || '-'}</span>
                        </td>
                        <td className="hidden px-3 py-3 xl:table-cell">
                          <span className="text-xs text-slate-600 dark:text-slate-300">{emp.position?.nama_jabatan || emp.jabatan || 'Staf'}</span>
                        </td>
                        <td className="hidden px-3 py-3 lg:table-cell">
                          <MasterBadge variant="neutral">{emp.status_pegawai || 'Tetap'}</MasterBadge>
                        </td>
                        <td className="hidden px-2 py-3 text-center sm:table-cell">
                          <MasterStatusBadge active={emp.status === 'aktif' || !emp.status} activeLabel="Aktif" inactiveLabel="Nonaktif" />
                        </td>
                        <td className="px-2 py-3 text-center">
                          <ActionDropdown onView={() => handleOpenDetail(emp)} />
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
          label="pegawai"
        />
      )}

      <KpiDetailDrawer
        type={selectedDetailType}
        id={selectedEmployeeId}
        isOpen={Boolean(selectedEmployeeId)}
        onClose={() => setSelectedEmployeeId(null)}
      />

      <FoundationExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        title="Pegawai & Guru Seluruh Yayasan"
        rows={exportRows}
        filename="Pegawai_Guru_Yayasan"
      />
    </MasterDataPage>
  )
}
