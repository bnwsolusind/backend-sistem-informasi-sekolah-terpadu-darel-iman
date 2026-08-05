import React, { useState, useEffect } from 'react'
import { FaTimes, FaCloudUploadAlt, FaArrowRight, FaArrowLeft, FaSave, FaCheckCircle, FaTrashAlt } from 'react-icons/fa'

const defaultForm = () => ({
  foto_url: '', no_pendaftaran: '', nik: '', no_registrasi_akta_lahir: '', no_kk: '', nisn: '', full_name: '', birth_date: '', birth_place: '', gender: 'male', agama: 'Islam', email: '', anak_ke: '', jumlah_saudara: '', jumlah_saudara_tiri: '', berat_badan: '', tinggi_badan: '', riwayat_penyakit: '', kewarganegaraan: 'WNI', alamat_siswa: '', rt: '', rw: '', dusun: '', kelurahan: '', kecamatan: '', kode_pos: '', kota_kabupaten: '', provinsi: '', jenis_tempat_tinggal: '', jarak_tempuh_ke_sekolah: '', moda_transportasi: '', hobi: '', cita_cita: '',
  sekolah_asal: '', status_sekolah_asal: 'Formal', kecamatan_sekolah_asal: '', kota_kab_sekolah_asal: '', nomor_hp_wa_sekolah_asal: '', nominal_spp: '', nominal_ortu_asuh: '', penerima_kps_pkh: 'tidak', apakah_punya_kip: 'tidak', apakah_layak_menerima_pip: 'tidak', alasan_menolak_pip: '',
  nik_ayah: '', nama_ayah: '', tempat_lahir_ayah: '', tgl_lahir_ayah: '', telfon_ayah: '', hp_ayah: '', pendidikan_terakhir_ayah: '', pekerjaan_ayah: '', instansi_pekerjaan_ayah: '', jabatan_pekerjaan_ayah: '', alamat_instansi_ayah: '', keahlian_ayah: '', penghasilan_ayah: '', alamat_ayah: '', nomor_wa_ayah: '', medsos_ayah: '',
  nik_ibu: '', nama_ibu: '', tempat_lahir_ibu: '', tgl_lahir_ibu: '', telfon_ibu: '', hp_ibu: '', pendidikan_terakhir_ibu: '', pekerjaan_ibu: '', instansi_pekerjaan_ibu: '', jabatan_pekerjaan_ibu: '', alamat_instansi_ibu: '', keahlian_ibu: '', penghasilan_ibu: '', alamat_ibu: '', nomor_wa_ibu: '', medsos_ibu: '',
  status_pernikahan_wali: '', tanggungan_anak_wali: '', nik_wali: '', nama_wali: '', tempat_lahir_wali: '', tgl_lahir_wali: '', telfon_wali: '', hp_wali: '', pendidikan_terakhir_wali: '', pekerjaan_wali: '', instansi_pekerjaan_wali: '', jabatan_pekerjaan_wali: '', alamat_instansi_wali: '', keahlian_wali: '', penghasilan_wali: '', alamat_wali: '', nomor_wa_wali: '', medsos_wali: '',
  unit_id: '', unit_pendidikan: '', nis_pembayaran: '', tahun_ajaran_masuk: '', kelas_id: '', tahun_ajaran_berjalan: '', status_siswa: 'aktif', status_orang_tua: 'Umum', niy_ortu_jika_pegawai: '', wali_kelas: '', niy_wali_kelas: '',
})

const toYesNo = (value) => {
  if (value === true || value === 1 || value === '1' || value === 'true' || value === 'ya') return 'ya'
  return 'tidak'
}

const toBoolean = (value) => toYesNo(value) === 'ya'

export default function StudentFormModal({ isOpen, onClose, initialData, onSubmit, classes, units }) {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState(defaultForm())
  const [isUploading, setIsUploading] = useState(false)

  const steps = [
    { number: 1, id: 'pribadi', title: 'Informasi Pribadi', desc: 'Identitas & Alamat Siswa' },
    { number: 2, id: 'pendidikan', title: 'Pendidikan & Bantuan', desc: 'Sekolah Asal & SPP/PIP' },
    { number: 3, id: 'ortu', title: 'Data Orang Tua', desc: 'Identitas Ayah & Ibu Kandung' },
    { number: 4, id: 'wali', title: 'Data Wali Siswa', desc: 'Wali (Opsional)' },
    { number: 5, id: 'akademik', title: 'Akademik & Status', desc: 'Unit, Kelas & Status' },
  ]

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0)
      if (initialData) {
        const meta = initialData.raw?.metadata || {}
        const orangTua = meta.orang_tua || {}
        const parentRel = initialData.raw?.parent || {}
        setFormData({
          ...defaultForm(),
          id: initialData.id,
          full_name: initialData.nama || initialData.full_name || '',
          gender: initialData.gender === 'Perempuan' ? 'female' : 'male',
          birth_place: initialData.tempatLahir || initialData.birth_place || '',
          birth_date: initialData.tanggalLahir || initialData.birth_date || '',
          agama: initialData.agama || meta.agama || 'Islam',
          foto_url: initialData.foto || meta.foto_url || meta.foto || meta.photo_url || meta.photo || meta.avatar || '',
          nisn: initialData.nisn || meta.nisn || '',
          nis: initialData.nis || '',
          alamat_siswa: initialData.alamat || meta.alamat_siswa || meta.alamat_ortu || '',
          kelas_id: initialData.raw?.kelas_id || '',
          unit_id: initialData.raw?.unit_id || '',
          status_siswa: (initialData.status || initialData.status_siswa || 'aktif').toLowerCase(),
          unit_pendidikan: initialData.unit || meta.akademik?.unit_pendidikan || '',
          ...meta,
          nama_ayah: meta.nama_ayah || meta.ayah?.nama || orangTua.nama_ayah || parentRel.full_name || parentRel.name || '',
          nama_ibu: meta.nama_ibu || meta.ibu?.nama || orangTua.nama_ibu || '',
          nama_wali: meta.nama_wali || meta.wali?.nama || orangTua.nama_wali || '',
          hp_ayah: meta.hp_ayah || meta.ayah?.hp || orangTua.no_hp || parentRel.phone || parentRel.no_hp || '',
          hp_ibu: meta.hp_ibu || meta.ibu?.hp || orangTua.no_hp || '',
          hp_wali: meta.hp_wali || meta.wali?.hp || orangTua.no_hp || '',
          penerima_kps_pkh: toYesNo(meta.penerima_kps_pkh),
          apakah_punya_kip: toYesNo(meta.apakah_punya_kip),
          apakah_layak_menerima_pip: toYesNo(meta.apakah_layak_menerima_pip),
        })
      } else {
        setFormData(defaultForm())
      }
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'unit_id' ? { kelas_id: '' } : {}),
    }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, foto_url: reader.result }))
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFoto = () => {
    setFormData(prev => ({ ...prev, foto_url: '' }))
  }

  const handleSave = (e) => {
    if (e) e.preventDefault()
    const payload = {
      id: formData.id,
      nis: formData.nis,
      full_name: formData.full_name,
      gender: formData.gender,
      birth_place: formData.birth_place,
      birth_date: formData.birth_date,
      address: formData.alamat_siswa,
      unit_id: formData.unit_id || null,
      kelas_id: formData.kelas_id || null,
      is_active: formData.status_siswa === 'aktif',
      metadata: { ...formData }
    }
    delete payload.metadata.id
    delete payload.metadata.full_name
    delete payload.metadata.gender
    delete payload.metadata.birth_place
    delete payload.metadata.birth_date
    delete payload.metadata.kelas_id
    delete payload.metadata.unit_id
    delete payload.metadata.is_active
    delete payload.metadata.address
    payload.metadata.penerima_kps_pkh = toBoolean(formData.penerima_kps_pkh)
    payload.metadata.apakah_punya_kip = toBoolean(formData.apakah_punya_kip)
    payload.metadata.apakah_layak_menerima_pip = toBoolean(formData.apakah_layak_menerima_pip)
    payload.metadata.foto_url = formData.foto_url || ''
    payload.metadata.nama_ayah = formData.nama_ayah || ''
    payload.metadata.hp_ayah = formData.hp_ayah || ''
    payload.metadata.nama_ibu = formData.nama_ibu || ''
    payload.metadata.hp_ibu = formData.hp_ibu || ''
    payload.metadata.nama_wali = formData.nama_wali || ''
    payload.metadata.hp_wali = formData.hp_wali || ''
    payload.metadata.orang_tua = {
      ...(formData.orang_tua || {}),
      nama_ayah: formData.nama_ayah || '',
      nama_ibu: formData.nama_ibu || '',
      nama_wali: formData.nama_wali || '',
      no_hp: formData.hp_ayah || formData.hp_ibu || formData.hp_wali || '',
    }
    onSubmit(payload)
  }

  const Input = ({ label, name, required = false, type = 'text', placeholder = '', ...props }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
        {...props}
      />
    </div>
  )

  const Select = ({ label, name, required = false, options = [], ...props }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
        {...props}
      >
        <option value="">-- Pilih --</option>
        {options.map(opt => typeof opt === 'string'
          ? <option key={opt} value={opt}>{opt}</option>
          : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="my-4 flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

        {/* Modal Header — Clean Top with Title & Close (X) */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              {initialData ? 'Edit Siswa' : 'Tambah Siswa'}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {initialData ? 'Perbarui informasi siswa melalui tahapan berikut.' : 'Lengkapi informasi siswa melalui tahapan berikut.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Horizontal stepper seperti modal master data */}
        <div className="shrink-0 border-b border-slate-100 bg-white px-4 py-4 sm:px-6">
          <div className="grid grid-cols-5">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx
                const isCompleted = activeStep > idx
                return (
                  <button
                    type="button"
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className="group relative flex min-w-0 items-center gap-2 pr-2 text-left"
                  >
                    {idx < steps.length - 1 && (
                      <span className={`absolute left-8 right-0 top-4 h-px ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    )}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-800 text-white ring-4 ring-emerald-50'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {isCompleted ? <FaCheckCircle className="text-sm" /> : step.number}
                    </div>
                    <span className={`relative z-10 hidden truncate bg-white pr-1 text-[10px] font-bold leading-tight lg:block ${isActive ? 'text-emerald-800' : 'text-slate-500'}`}>
                      {step.title}
                    </span>
                  </button>
                )
              })}
          </div>
        </div>

        {/* Form Content Area */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-white p-5 sm:p-6">
            <div className="mb-5">
              <h3 className="text-sm font-bold text-slate-900">{steps[activeStep].title}</h3>
              <p className="mt-1 text-[11px] text-slate-500">{steps[activeStep].desc}. Pastikan data yang dimasukkan sudah benar.</p>
            </div>
            <form id="student-main-form" onSubmit={handleSave} className="space-y-6">

              {/* STEP 1: INFORMASI PRIBADI */}
              {activeStep === 0 && (
                <div className="space-y-6">
                  {/* Upload Foto Box - Sesuai UI Gambar */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Unggah Foto Siswa</label>
                    {formData.foto_url ? (
                      <div className="relative flex items-center gap-4 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40">
                        <img
                          src={formData.foto_url}
                          alt="Preview Foto"
                          className="h-20 w-20 rounded-xl object-cover border-2 border-emerald-600 shadow"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800">Foto Siswa Berhasil Diunggah</p>
                          <p className="text-[11px] text-slate-500">Guna untuk data Kartu Siswa & Administrasi</p>
                          <button
                            type="button"
                            onClick={handleRemoveFoto}
                            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline pt-1"
                          >
                            <FaTrashAlt /> Hapus & Unggah Ulang
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:bg-emerald-50/30 hover:border-emerald-400 cursor-pointer transition">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-[#064e3b] mb-2 shadow-xs">
                          <FaCloudUploadAlt className="text-2xl" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                          {isUploading ? 'Mengunggah...' : 'Upload Foto Siswa'}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">PNG, JPG atau WEBP (maksimal 2MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Nama Lengkap Siswa" name="full_name" required placeholder="Contoh: Fathir Ahmad" />
                    <Input label="NIS" name="nis" required placeholder="Nomor Induk Siswa" />
                    <Input label="NISN" name="nisn" required placeholder="10 Digit NISN" />
                    <Input label="NIK Siswa" name="nik" placeholder="16 Digit NIK" />
                    <Input label="No Pendaftaran" name="no_pendaftaran" placeholder="PDK-2024-001" />
                    <Input label="No Kartu Keluarga (KK)" name="no_kk" placeholder="16 Digit No KK" />
                    <Input label="No Registrasi Akta Lahir" name="no_registrasi_akta_lahir" placeholder="No Akta Lahir" />
                    <Input label="Tempat Lahir" name="birth_place" placeholder="Kota Lahir" />
                    <Input label="Tanggal Lahir" name="birth_date" type="date" />
                    <Select label="Jenis Kelamin" name="gender" required options={[{label:'Laki-laki', value:'male'}, {label:'Perempuan', value:'female'}]} />
                    <Select label="Agama" name="agama" options={['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu']} />
                    <Input label="Email Siswa (Opsional)" name="email" type="email" placeholder="siswa@sekolah.sch.id" />
                    <Select label="Kewarganegaraan" name="kewarganegaraan" options={['WNI','WNA']} />
                  </div>

                  <hr className="border-slate-100 my-4" />

                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alamat & Tempat Tinggal</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Input label="Alamat Lengkap" name="alamat_siswa" placeholder="Jl. Khatib Sulaiman No. 10..." />
                    </div>
                    <Input label="RT" name="rt" placeholder="001" />
                    <Input label="RW" name="rw" placeholder="002" />
                    <Input label="Kelurahan / Desa" name="kelurahan" placeholder="Kelurahan" />
                    <Input label="Kecamatan" name="kecamatan" placeholder="Kecamatan" />
                    <Input label="Kota / Kabupaten" name="kota_kabupaten" placeholder="Kota/Kab" />
                    <Input label="Provinsi" name="provinsi" placeholder="Provinsi" />
                    <Input label="Kode Pos" name="kode_pos" placeholder="25114" />
                    <Input label="Moda Transportasi" name="moda_transportasi" placeholder="Jalan Kaki / Sepeda / Bus" />
                  </div>
                </div>
              )}

              {/* STEP 2: PENDIDIKAN & BANTUAN */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Riwayat Sekolah Asal</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Nama Sekolah Asal" name="sekolah_asal" placeholder="SD Negeri 01 Padang" />
                    <Select label="Status Sekolah Asal" name="status_sekolah_asal" options={['Formal', 'Tidak Formal']} />
                    <Input label="Kecamatan Sekolah Asal" name="kecamatan_sekolah_asal" placeholder="Kecamatan" />
                    <Input label="Kota / Kab Sekolah Asal" name="kota_kab_sekolah_asal" placeholder="Kota/Kab" />
                    <Input label="No HP / WA Sekolah Asal" name="nomor_hp_wa_sekolah_asal" placeholder="08xx-xxxx-xxxx" />
                  </div>

                  <hr className="border-slate-100 my-4" />

                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Administrasi Bantuan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Nominal SPP (Rp)" name="nominal_spp" type="number" placeholder="500000" />
                    <Input label="Nominal Bantuan Ortu Asuh (Rp)" name="nominal_ortu_asuh" type="number" placeholder="0" />
                    <Select label="Penerima KPS / PKH" name="penerima_kps_pkh" options={['ya', 'tidak']} />
                    <Select label="Apakah Punya KIP?" name="apakah_punya_kip" options={['ya', 'tidak']} />
                    <Select label="Apakah Layak Menerima PIP?" name="apakah_layak_menerima_pip" options={['ya', 'tidak']} />
                    <div className="sm:col-span-2">
                      <Input label="Alasan Menolak PIP (Jika ada)" name="alasan_menolak_pip" placeholder="Ditolak / Sudah Mampu" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DATA ORANG TUA */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-emerald-900 border-b border-emerald-100 pb-2">Ayah Kandung</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="NIK Ayah" name="nik_ayah" placeholder="16 Digit NIK Ayah" />
                    <Input label="Nama Ayah Kandung" name="nama_ayah" placeholder="Nama Ayah" />
                    <Input label="Tempat Lahir Ayah" name="tempat_lahir_ayah" />
                    <Input label="Tanggal Lahir Ayah" name="tgl_lahir_ayah" type="date" />
                    <Input label="No HP / WA Ayah" name="hp_ayah" placeholder="08xx-xxxx-xxxx" />
                    <Select label="Pendidikan Terakhir Ayah" name="pendidikan_terakhir_ayah" options={['SD/MI','SMP/MTs','SMA/SMK/MA','D1/D2/D3','S1/D4','S2','S3','Tidak Sekolah']} />
                    <Input label="Pekerjaan Ayah" name="pekerjaan_ayah" placeholder="Wiraswasta / PNS / Guru" />
                    <Input label="Penghasilan Ayah (Rp)" name="penghasilan_ayah" placeholder="5000000" />
                  </div>

                  <h4 className="text-xs font-bold text-emerald-900 border-b border-emerald-100 pb-2 pt-2">Ibu Kandung</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="NIK Ibu" name="nik_ibu" placeholder="16 Digit NIK Ibu" />
                    <Input label="Nama Ibu Kandung" name="nama_ibu" placeholder="Nama Ibu" />
                    <Input label="Tempat Lahir Ibu" name="tempat_lahir_ibu" />
                    <Input label="Tanggal Lahir Ibu" name="tgl_lahir_ibu" type="date" />
                    <Input label="No HP / WA Ibu" name="hp_ibu" placeholder="08xx-xxxx-xxxx" />
                    <Select label="Pendidikan Terakhir Ibu" name="pendidikan_terakhir_ibu" options={['SD/MI','SMP/MTs','SMA/SMK/MA','D1/D2/D3','S1/D4','S2','S3','Tidak Sekolah']} />
                    <Input label="Pekerjaan Ibu" name="pekerjaan_ibu" placeholder="Ibu Rumah Tangga / PNS" />
                    <Input label="Penghasilan Ibu (Rp)" name="penghasilan_ibu" placeholder="0" />
                  </div>
                </div>
              )}

              {/* STEP 4: DATA WALI */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600">
                    Isi data di bawah ini hanya jika siswa tinggal bersama wali (selain ayah/ibu kandung).
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="NIK Wali" name="nik_wali" placeholder="16 Digit NIK Wali" />
                    <Input label="Nama Wali Siswa" name="nama_wali" placeholder="Nama Wali" />
                    <Input label="No HP / WA Wali" name="hp_wali" placeholder="08xx-xxxx-xxxx" />
                    <Select label="Pendidikan Terakhir Wali" name="pendidikan_terakhir_wali" options={['SD/MI','SMP/MTs','SMA/SMK/MA','D1/D2/D3','S1/D4','S2','S3','Tidak Sekolah']} />
                    <Input label="Pekerjaan Wali" name="pekerjaan_wali" placeholder="Pekerjaan Wali" />
                    <Input label="Penghasilan Wali (Rp)" name="penghasilan_wali" placeholder="Penghasilan" />
                    <div className="sm:col-span-2">
                      <Input label="Alamat Wali" name="alamat_wali" placeholder="Alamat lengkap wali..." />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: AKADEMIK & STATUS */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Penempatan Unit & Kelas</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select label="Unit Pendidikan" name="unit_id" required options={units?.map(unit => ({ value: unit.id, label: unit.name })) || []} />
                    <Select label="Pilih Kelas" name="kelas_id" options={classes?.filter(kelas => !formData.unit_id || kelas.unit_pendidikan_id === formData.unit_id).map(kelas => ({ value: kelas.id, label: kelas.nama_kelas || kelas.name })) || []} />
                    <Input label="NIS Pembayaran" name="nis_pembayaran" placeholder="NIS Pembayaran" />
                    <Input label="Tahun Ajaran Masuk" name="tahun_ajaran_masuk" placeholder="2024/2025" />
                    <Input label="Tahun Ajaran Berjalan" name="tahun_ajaran_berjalan" placeholder="2024/2025" />
                    <Select label="Status Siswa" name="status_siswa" options={['aktif', 'lulus', 'mutasi', 'berhenti']} />
                    <Select label="Status Orang Tua" name="status_orang_tua" options={['Umum', 'Pegawai']} />
                    <Input label="NIY Ortu (Jika Pegawai)" name="niy_ortu_jika_pegawai" placeholder="NIY Pegawai" />
                  </div>
                </div>
              )}

            </form>
          </div>

        {/* Modal Footer — Standard Actions Matching UI Image */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Batal
          </button>

          <div className="ml-auto flex items-center gap-2">
            {activeStep > 0 && (
              <button
                type="button"
                onClick={() => setActiveStep(prev => prev - 1)}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FaArrowLeft className="text-xs" /> Kembali
              </button>
            )}

            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(prev => prev + 1)}
                className="flex h-10 items-center gap-2 rounded-lg bg-emerald-800 px-5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-900"
              >
                Selanjutnya <FaArrowRight className="text-xs" />
              </button>
            ) : (
              <button
                type="submit"
                form="student-main-form"
                className="flex h-10 items-center gap-2 rounded-lg bg-emerald-800 px-5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-900"
              >
                <FaSave /> Simpan Data
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
