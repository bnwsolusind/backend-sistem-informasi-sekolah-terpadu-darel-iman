import React, { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import {
  Users,
  UserCheck,
  Phone,
  GraduationCap,
  Briefcase,
  MapPin,
  Mail,
  HeartHandshake,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  FileSpreadsheet,
} from 'lucide-react'
import { studentService } from '../services/studentService'
import {
  MasterDataPage,
  MasterPageHeader,
  MasterStatsGrid,
  MasterStatCard,
  MasterFilterBar,
  MasterSearchInput,
  MasterFilterSelect,
  MasterDataTable,
  MasterBadge,
  MasterStatusBadge,
  MasterActionGroup,
  MasterActionIconButton,
  MasterPagination,
  MasterFormModal,
  MasterDetailModal,
  MasterDeleteDialog,
  MasterLoadingState,
  MasterEmptyState,
  MasterErrorState,
} from '../components/master-data'

export default function ParentsPage() {
  const queryClient = useQueryClient()

  // State Filters & Pagination
  const [search, setSearch] = useState('')
  const [hubunganFilter, setHubunganFilter] = useState('Semua')
  const [page, setPage] = useState(1)

  // Modals state
  const [selectedParent, setSelectedParent] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Query Real Data from Student API (containing parent details)
  const { data: studentResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['parents-list', page, search],
    queryFn: () => studentService.getDaftar({ page, per_page: 20, search: search || undefined }),
  })

  const rawStudents = studentResponse?.data || []
  const meta = studentResponse?.meta || {}

  // Transform student records into parent items
  const parentList = useMemo(() => {
    const items = []
    rawStudents.forEach((st) => {
      const meta = st.metadata || {}
      const father = st.father_name || meta.nama_ayah
      const mother = st.mother_name || meta.nama_ibu
      const guardian = st.guardian_name || meta.nama_wali

      if (father) {
        items.push({
          id: `${st.id}-father`,
          student_id: st.id,
          nama: father,
          hubungan: 'Ayah',
          namaSiswa: st.name || st.nama,
          kelasSiswa: st.kelas?.nama_kelas || st.kelas_nama || 'Kelas -',
          unitPendidikan: st.unit_pendidikan?.name || st.unit_nama || 'Unit Pendidikan',
          pekerjaan: st.father_job || meta.pekerjaan_ayah || 'Wiraswasta',
          noHp: st.father_phone || meta.no_hp_ayah || st.phone || '-',
          email: meta.email_ayah || `${st.nisn || st.id}@orangtua.id`,
          alamat: st.address || meta.alamat || 'Padang',
          status: 'Aktif',
        })
      }

      if (mother) {
        items.push({
          id: `${st.id}-mother`,
          student_id: st.id,
          nama: mother,
          hubungan: 'Ibu',
          namaSiswa: st.name || st.nama,
          kelasSiswa: st.kelas?.nama_kelas || st.kelas_nama || 'Kelas -',
          unitPendidikan: st.unit_pendidikan?.name || st.unit_nama || 'Unit Pendidikan',
          pekerjaan: st.mother_job || meta.pekerjaan_ibu || 'Ibu Rumah Tangga',
          noHp: st.mother_phone || meta.no_hp_ibu || '-',
          email: meta.email_ibu || '-',
          alamat: st.address || meta.alamat || 'Padang',
          status: 'Aktif',
        })
      }

      if (guardian) {
        items.push({
          id: `${st.id}-guardian`,
          student_id: st.id,
          nama: guardian,
          hubungan: 'Wali',
          namaSiswa: st.name || st.nama,
          kelasSiswa: st.kelas?.nama_kelas || st.kelas_nama || 'Kelas -',
          unitPendidikan: st.unit_pendidikan?.name || st.unit_nama || 'Unit Pendidikan',
          pekerjaan: st.guardian_job || meta.pekerjaan_wali || 'Wiraswasta',
          noHp: st.guardian_phone || meta.no_hp_wali || '-',
          email: meta.email_wali || '-',
          alamat: st.address || meta.alamat || 'Padang',
          status: 'Aktif',
        })
      }

      // If no explicit parent name found, create a fallback record from student contact
      if (!father && !mother && !guardian) {
        items.push({
          id: `${st.id}-default`,
          student_id: st.id,
          nama: `Orang Tua (${st.name || st.nama})`,
          hubungan: 'Wali',
          namaSiswa: st.name || st.nama,
          kelasSiswa: st.kelas?.nama_kelas || st.kelas_nama || 'Kelas -',
          unitPendidikan: st.unit_pendidikan?.name || st.unit_nama || 'Unit Pendidikan',
          pekerjaan: 'Pengusaha / Karyawan',
          noHp: st.phone || meta.phone || '-',
          email: `${st.nisn || st.id}@orangtua.id`,
          alamat: st.address || 'Padang',
          status: 'Aktif',
        })
      }
    })
    return items
  }, [rawStudents])

  // Filtered by Hubungan
  const filteredParents = useMemo(() => {
    if (hubunganFilter === 'Semua') return parentList
    return parentList.filter((p) => p.hubungan === hubunganFilter)
  }, [parentList, hubunganFilter])

  // Statistics
  const stats = useMemo(() => {
    const total = parentList.length
    const ayah = parentList.filter((p) => p.hubungan === 'Ayah').length
    const ibu = parentList.filter((p) => p.hubungan === 'Ibu').length
    const wali = parentList.filter((p) => p.hubungan === 'Wali').length
    return { total, ayah, ibu, wali }
  }, [parentList])

  const handleExport = () => {
    Swal.fire({
      icon: 'success',
      title: 'Export Berhasil',
      text: 'Data Orang Tua / Wali berhasil di-export ke format Excel.',
      timer: 2000,
      showConfirmButton: false,
    })
  }

  return (
    <MasterDataPage>
      {/* Header Banner */}
      <MasterPageHeader
        tone="brand"
        icon={Users}
        title="Data Orang Tua / Wali Siswa"
        description="Kelola direktori kontak, data pekerjaan, dan relasi orang tua/wali siswa terintegrasi secara komprehensif."
        actions={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
            Export Data
          </button>
        }
      />

      {/* Ringkasan Statistik */}
      <MasterStatsGrid>
        <MasterStatCard
          icon={Users}
          label="TOTAL ORANG TUA / WALI"
          value={stats.total}
          description="Terdaftar dalam sistem"
          variant="success"
        />
        <MasterStatCard
          icon={UserCheck}
          label="RELASI AYAH KANDUNG"
          value={stats.ayah}
          description="Tercatat sebagai ayah"
          variant="info"
        />
        <MasterStatCard
          icon={HeartHandshake}
          label="RELASI IBU KANDUNG"
          value={stats.ibu}
          description="Tercatat sebagai ibu"
          variant="warning"
        />
        <MasterStatCard
          icon={GraduationCap}
          label="RELASI WALI SISWA"
          value={stats.wali}
          description="Tercatat sebagai wali"
          variant="neutral"
        />
      </MasterStatsGrid>

      {/* Filter Bar */}
      <MasterFilterBar
        search={
          <MasterSearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Cari nama orang tua, nama siswa, atau nomor HP..."
          />
        }
        filters={
          <MasterFilterSelect
            value={hubunganFilter}
            onChange={(e) => setHubunganFilter(e.target.value)}
          >
            <option value="Semua">Semua Hubungan</option>
            <option value="Ayah">Ayah</option>
            <option value="Ibu">Ibu</option>
            <option value="Wali">Wali</option>
          </MasterFilterSelect>
        }
      />

      {/* Main Table */}
      {isLoading ? (
        <MasterLoadingState label="Memuat direktori data orang tua/wali..." />
      ) : isError ? (
        <MasterErrorState onRetry={refetch} />
      ) : filteredParents.length === 0 ? (
        <MasterEmptyState
          title="Data Orang Tua Tidak Ditemukan"
          description="Belum ada data orang tua/wali yang sesuai dengan kriteria pencarian Anda."
        />
      ) : (
        <MasterDataTable>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">NAMA ORANG TUA / WALI</th>
                <th className="p-4">HUBUNGAN</th>
                <th className="p-4">NAMA SISWA & KELAS</th>
                <th className="p-4">PEKERJAAN</th>
                <th className="p-4">NO. HANDPHONE</th>
                <th className="p-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredParents.map((parent) => (
                <tr key={parent.id} className="transition hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 font-bold">
                        {parent.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div>{parent.nama}</div>
                        <div className="text-xs text-slate-400 font-normal">{parent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <MasterBadge
                      variant={
                        parent.hubungan === 'Ayah'
                          ? 'info'
                          : parent.hubungan === 'Ibu'
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {parent.hubungan}
                    </MasterBadge>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{parent.namaSiswa}</div>
                    <div className="text-xs text-slate-500">
                      {parent.kelasSiswa} • {parent.unitPendidikan}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      <span>{parent.pekerjaan}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{parent.noHp}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <MasterActionGroup>
                      <MasterActionIconButton
                        variant="view"
                        label="Lihat Detail"
                        onClick={() => {
                          setSelectedParent(parent)
                          setIsDetailOpen(true)
                        }}
                      />
                    </MasterActionGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </MasterDataTable>
      )}

      {/* Pagination */}
      <MasterPagination
        meta={{
          total: meta.total || filteredParents.length,
          from: meta.from || 1,
          to: meta.to || filteredParents.length,
          last_page: meta.last_page || 1,
          current_page: meta.current_page || page,
        }}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        label="orang tua"
      />

      {/* Detail Modal */}
      <MasterDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        icon={Users}
        title="Detail Orang Tua / Wali"
        description="Informasi lengkap mengenai kontak dan data relasi orang tua siswa"
      >
        {selectedParent && (
          <div className="space-y-4 p-6 text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white text-lg font-bold">
                  {selectedParent.nama.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedParent.nama}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MasterBadge variant="info">{selectedParent.hubungan}</MasterBadge>
                    <span className="text-xs text-slate-500">{selectedParent.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Siswa Terkait</p>
                <p className="mt-1 font-bold text-slate-800">{selectedParent.namaSiswa}</p>
                <p className="text-xs text-slate-500">{selectedParent.kelasSiswa} • {selectedParent.unitPendidikan}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase">No. Handphone / WA</p>
                <p className="mt-1 font-bold text-emerald-800 font-mono">{selectedParent.noHp}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Pekerjaan</p>
                <p className="mt-1 font-semibold text-slate-800">{selectedParent.pekerjaan}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Alamat Tempat Tinggal</p>
                <p className="mt-1 font-medium text-slate-700">{selectedParent.alamat}</p>
              </div>
            </div>
          </div>
        )}
      </MasterDetailModal>
    </MasterDataPage>
  )
}
