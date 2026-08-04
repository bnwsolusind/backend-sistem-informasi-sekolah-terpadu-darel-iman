import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Users,
  X,
  Upload,
} from 'lucide-react'
import CsvImportModal from '../components/master-data/CsvImportModal'
import { scheduleService } from '../services/scheduleService'
import {
  MasterDataPage,
  MasterActionButton,
  MasterPageHeader,
  MasterStatsGrid,
  MasterStatCard,
  MasterFilterBar,
  MasterSearchInput,
  MasterFilterSelect,
  MasterDataTable,
  MasterStatusBadge,
  MasterActionGroup,
  MasterActionIconButton,
  MasterPagination,
} from '../components/master-data'

const emptyForm = {
  kelas_id: '',
  employee_id: '',
  subject_id: '',
  academic_year_id: '',
  semester_id: '',
  day_of_week: 1,
  time_start: '07:00',
  time_end: '08:00',
  week_type: 'all',
  is_active: true,
}

const pickError = (error, fallback) => {
  const errors = error.response?.data?.errors
  return errors ? Object.values(errors).flat()[0] : error.response?.data?.message || fallback
}

const time = (value) => value?.slice(0, 5) || '-'
const subjectName = (item) => item?.nama_mapel || item?.name || 'Mata Pelajaran'

export default function MasterSchedulePage({ embedded = false, hideBreadcrumb = false }) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [day, setDay] = useState('')
  const [teacher, setTeacher] = useState('')
  const [status, setStatus] = useState('')
  const [modal, setModal] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const { data: options = {} } = useQuery({
    queryKey: ['schedule-options'],
    queryFn: scheduleService.getOptions,
  })

  const { data: response = {}, isLoading, isError, refetch } = useQuery({
    queryKey: ['schedules', page, search, day, teacher, status],
    queryFn: () =>
      scheduleService.getDaftar({
        page,
        per_page: 15,
        search,
        day_of_week: day,
        employee_id: teacher,
        is_active: status,
      }),
  })

  const items = response.data || []
  const meta = response.meta || {}
  const stats = response.statistik || {}
  const semesters = useMemo(
    () =>
      (options.semester || []).filter(
        (item) => !form.academic_year_id || item.academic_year_id === form.academic_year_id
      ),
    [options.semester, form.academic_year_id]
  )

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing ? scheduleService.ubah({ id: editing.id, payload }) : scheduleService.tambah(payload),
    onSuccess: (result) => {
      Swal.fire({ icon: 'success', title: 'Berhasil', text: result.message, confirmColor: '#0E5C44' })
      setModal(false)
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
    },
    onError: (error) =>
      Swal.fire({
        icon: 'error',
        title: 'Jadwal belum tersimpan',
        text: pickError(error, 'Periksa kembali data jadwal.'),
        confirmColor: '#0E5C44',
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: scheduleService.hapus,
    onSuccess: (result) => {
      Swal.fire({ icon: 'success', title: 'Terhapus', text: result.message, confirmColor: '#0E5C44' })
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
    },
    onError: (error) => Swal.fire('Gagal', pickError(error, 'Jadwal gagal dihapus.'), 'error'),
  })

  const openAdd = () => {
    const activeYear = (options.tahun_ajaran || []).find((item) => item.is_active)
    const yearId = activeYear?.id || options.tahun_ajaran?.[0]?.id || ''
    const activeSemester = (options.semester || []).find(
      (item) => item.is_active && item.academic_year_id === yearId
    )
    setEditing(null)
    setForm({
      ...emptyForm,
      academic_year_id: yearId,
      semester_id:
        activeSemester?.id ||
        options.semester?.find((item) => item.academic_year_id === yearId)?.id ||
        '',
    })
    setModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      kelas_id: item.kelas_id || item.school_class_id || '',
      employee_id: item.employee_id || item.teacher_id || '',
      subject_id: item.subject_id || '',
      academic_year_id: item.academic_year_id || '',
      semester_id: item.semester_id || '',
      day_of_week: item.day_of_week || 1,
      time_start: item.time_start || '07:00',
      time_end: item.time_end || '08:00',
      week_type: item.week_type || 'all',
      is_active: item.is_active ?? true,
    })
    setModal(true)
  }

  const submit = (event) => {
    event.preventDefault()
    saveMutation.mutate({ ...form, day_of_week: Number(form.day_of_week) })
  }

  const remove = async (item) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Hapus jadwal?',
      text: `${subjectName(item.subject)} · ${item.kelas?.nama_kelas || 'Kelas'}`,
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
    })
    if (result.isConfirmed) deleteMutation.mutate(item.id)
  }

  const importRows = async (rows) => {
    let success = 0
    const failures = []
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index]
      try {
        await scheduleService.tambah({ ...row, day_of_week: Number(row.day_of_week), is_active: !['0', 'false', 'nonaktif'].includes(String(row.is_active).toLowerCase()) })
        success += 1
      } catch (error) { failures.push(`baris ${index + 2}: ${error.response?.data?.message || 'gagal'}`) }
    }
    queryClient.invalidateQueries({ queryKey: ['schedules'] })
    await Swal.fire({ icon: failures.length ? 'warning' : 'success', title: 'Import selesai', text: `${success} jadwal berhasil, ${failures.length} gagal.${failures.length ? ` ${failures.slice(0, 3).join('; ')}` : ''}`, confirmColor: '#0E5C44' })
  }

  return (
    <MasterDataPage
      className="education-unit-page schedule-master-page"
      hideBreadcrumb={embedded || hideBreadcrumb}
    >
      {/* Header Banner */}
      <MasterPageHeader
        tone="brand"
        icon={CalendarDays}
        title="Jadwal Pelajaran Sekolah"
        description="Kelola penugasan guru, mata pelajaran, rombongan belajar, serta plot jam mengajar terstruktur."
        actions={<><MasterActionButton variant="import" icon={Upload} onClick={() => setImportOpen(true)}>Import CSV</MasterActionButton><MasterActionButton onClick={openAdd}>Tambah Jadwal Pelajaran</MasterActionButton></>}
      />

      <CsvImportModal open={importOpen} onClose={() => setImportOpen(false)} title="Jadwal Pelajaran" onImport={importRows} columns={[
        { key: 'kelas_id', required: true }, { key: 'employee_id', required: true }, { key: 'subject_id', required: true }, { key: 'academic_year_id', required: true }, { key: 'semester_id', required: true },
        { key: 'day_of_week', required: true, example: '1' }, { key: 'time_start', required: true, example: '07:00' }, { key: 'time_end', required: true, example: '08:00' }, { key: 'week_type', example: 'all' }, { key: 'is_active', example: '1' },
      ]} />

      {/* Ringkasan Stats */}
      <MasterStatsGrid className="education-unit-kpis">
        <MasterStatCard icon={CalendarDays} label="TOTAL JADWAL" value={stats.total} description="Terdaftar di sistem" variant="success" />
        <MasterStatCard icon={CheckCircle2} label="JADWAL AKTIF" value={stats.aktif} description="Siap digunakan presensi" variant="info" />
        <MasterStatCard icon={Clock3} label="TIDAK AKTIF" value={stats.tidak_aktif} description="Nonaktif / Arsip" variant="warning" />
        <MasterStatCard icon={Users} label="GURU TERJADWAL" value={stats.guru_terjadwal} description="Guru mengajar aktif" variant="neutral" />
      </MasterStatsGrid>

      {/* Filter Bar */}
      <MasterFilterBar
        search={
          <MasterSearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari nama guru, nama mapel, atau nama kelas..."
          />
        }
        filters={
          <>
            <MasterFilterSelect value={day} onChange={(e) => { setDay(e.target.value); setPage(1) }}>
              <option value="">Semua Hari</option>
              {(options.hari || []).map((item) => (<option key={item.id} value={item.id}>{item.name}</option>))}
            </MasterFilterSelect>

            <MasterFilterSelect value={teacher} onChange={(e) => { setTeacher(e.target.value); setPage(1) }}>
              <option value="">Semua Guru</option>
              {(options.guru || []).map((item) => (<option key={item.id} value={item.id}>{item.nama_lengkap}</option>))}
            </MasterFilterSelect>

            <MasterFilterSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
              <option value="">Semua Status</option>
              <option value="1">Aktif</option>
              <option value="0">Tidak Aktif</option>
            </MasterFilterSelect>
          </>
        }
      />

      {/* Table Data */}
      <MasterDataTable>
        <table className="w-full table-fixed text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700 dark:bg-slate-800/70">
            <tr>
              <th className="w-[14%] p-4">Hari & Jam</th>
              <th className="w-[20%] p-4">Mata Pelajaran</th>
              <th className="w-[17%] p-4">Kelas & Unit</th>
              <th className="hidden w-[18%] p-4 lg:table-cell">Guru Pengampu</th>
              <th className="hidden w-[14%] p-4 xl:table-cell">Periode Akademik</th>
              <th className="hidden w-[9%] p-4 sm:table-cell">Status</th>
              <th className="w-[16%] p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700 dark:divide-slate-700 dark:text-slate-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`schedule-skeleton-${index}`} aria-hidden="true">
                  <td colSpan="7" className="p-4">
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700/70" />
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan="7" className="p-10 text-center">
                  <p className="font-bold text-slate-800 dark:text-white">Jadwal pelajaran gagal dimuat</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Periksa koneksi lalu coba kembali.</p>
                  <button type="button" onClick={() => refetch()} className="mt-4 h-10 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white">Coba Lagi</button>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center">
                  <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 font-bold text-slate-800 dark:text-white">Belum ada jadwal pelajaran</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Ubah filter atau tambahkan jadwal pertama.</p>
                  <MasterActionButton className="mt-4" onClick={openAdd}>Tambah Jadwal</MasterActionButton>
                </td>
              </tr>
            ) : items.map((item) => (
              <tr key={item.id} className="transition hover:bg-emerald-50/40 dark:hover:bg-slate-800/70">
                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  <div>{item.nama_hari}</div>
                  <div className="font-mono text-xs font-semibold text-emerald-800">{time(item.time_start)} – {time(item.time_end)}</div>
                </td>
                <td className="p-4">
                  <div className="truncate font-bold text-slate-800 dark:text-white">{subjectName(item.subject)}</div>
                  <div className="text-xs text-slate-400 font-mono">{item.subject?.kode_mapel || item.subject?.code || '-'}</div>
                </td>
                <td className="p-4">
                  <div className="truncate font-semibold text-slate-800 dark:text-slate-100">{item.kelas?.nama_kelas || item.school_class?.name || '-'}</div>
                  <div className="text-xs text-slate-500">{item.kelas?.unit_pendidikan?.name || '-'}</div>
                </td>
                <td className="hidden p-4 lg:table-cell">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                    <GraduationCap className="h-4 w-4 text-emerald-800 shrink-0" />
                    <span>{item.employee?.nama_lengkap || item.teacher?.name || '-'}</span>
                  </div>
                </td>
                <td className="hidden p-4 text-xs xl:table-cell">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{item.academic_year?.name || '-'}</div>
                  <div className="text-slate-500">{item.semester?.name || '-'}</div>
                </td>
                <td className="hidden p-4 sm:table-cell">
                  <MasterStatusBadge active={item.is_active} />
                </td>
                <td className="p-4 text-center">
                  <MasterActionGroup>
                    <MasterActionIconButton variant="edit" onClick={() => openEdit(item)} />
                    <MasterActionIconButton variant="delete" onClick={() => remove(item)} />
                  </MasterActionGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MasterDataTable>

      {/* Pagination */}
      <MasterPagination meta={meta} page={page} onPageChange={(p) => setPage(p)} label="jadwal" />

      {/* Modal Form */}
      {modal && (
        <div className="ui-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={submit} className="ui-modal my-auto flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}</h2>
                <p className="text-xs text-slate-500">Lengkapi data jam mengajar dan penugasan guru.</p>
              </div>
              <button type="button" onClick={() => setModal(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Tahun Ajaran *</label>
                  <select required value={form.academic_year_id} onChange={(e) => setForm({ ...form, academic_year_id: e.target.value, semester_id: '' })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 outline-none focus:border-emerald-700">
                    <option value="">Pilih Tahun Ajaran</option>
                    {(options.tahun_ajaran || []).map((item) => (<option key={item.id} value={item.id}>{item.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Semester *</label>
                  <select required value={form.semester_id} onChange={(e) => setForm({ ...form, semester_id: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 outline-none focus:border-emerald-700">
                    <option value="">Pilih Semester</option>
                    {semesters.map((item) => (<option key={item.id} value={item.id}>{item.name}</option>))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Kelas / Rombel *</label>
                  <select required value={form.kelas_id} onChange={(e) => setForm({ ...form, kelas_id: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 outline-none focus:border-emerald-700">
                    <option value="">Pilih Kelas</option>
                    {(options.kelas || []).map((item) => (<option key={item.id} value={item.id}>{item.nama_kelas} {item.unit_pendidikan?.name ? `· ${item.unit_pendidikan.name}` : ''}</option>))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Guru Pengampu *</label>
                  <select required value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 outline-none focus:border-emerald-700">
                    <option value="">Pilih Guru</option>
                    {(options.guru || []).map((item) => (<option key={item.id} value={item.id}>{item.nama_lengkap}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-800">Mata Pelajaran *</label>
                <select required value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 outline-none focus:border-emerald-700">
                  <option value="">Pilih Mata Pelajaran</option>
                  {(options.mata_pelajaran || []).map((item) => (<option key={item.id} value={item.id}>{subjectName(item)}</option>))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Hari Mengajar *</label>
                  <select required value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 outline-none focus:border-emerald-700">
                    {(options.hari || []).map((item) => (<option key={item.id} value={item.id}>{item.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Pola Minggu</label>
                  <select value={form.week_type} onChange={(e) => setForm({ ...form, week_type: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 outline-none focus:border-emerald-700">
                    <option value="all">Setiap Minggu</option>
                    <option value="odd">Minggu Ganjil</option>
                    <option value="even">Minggu Genap</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Jam Mulai *</label>
                  <input required type="time" value={form.time_start} onChange={(e) => setForm({ ...form, time_start: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-mono outline-none focus:border-emerald-700" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-800">Jam Selesai *</label>
                  <input required type="time" value={form.time_end} onChange={(e) => setForm({ ...form, time_end: e.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-mono outline-none focus:border-emerald-700" />
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <label className="flex items-center gap-2.5 font-bold text-slate-800 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 rounded text-emerald-800 focus:ring-emerald-800" />
                  <span>Jadwal aktif dan dapat digunakan untuk presensi</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 p-4">
              <button type="button" onClick={() => setModal(false)} className="h-11 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700">Batal</button>
              <button disabled={saveMutation.isPending} className="h-11 rounded-xl bg-emerald-800 px-5 text-xs font-semibold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-900 disabled:opacity-50">
                {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Jadwal'}
              </button>
            </div>
          </form>
        </div>
      )}
    </MasterDataPage>
  )
}
