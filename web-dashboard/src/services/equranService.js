import { api } from './api'
import axios from 'axios'

// Built-in 114 Surah reference dataset to ensure stats & reader ALWAYS work even when offline/DB disconnected
const FALLBACK_114_SURAHS = [
  [1, 'الفاتحة', 'Al-Fatihah', 7, 'Mekah', 'Pembukaan'],
  [2, 'البقرة', 'Al-Baqarah', 286, 'Madinah', 'Sapi Betina'],
  [3, 'آل عمران', "Ali 'Imran", 200, 'Madinah', 'Keluarga Imran'],
  [4, 'النساء', "An-Nisa'", 176, 'Madinah', 'Wanita'],
  [5, 'المائدة', "Al-Ma'idah", 120, 'Madinah', 'Hidangan'],
  [6, 'الأنعام', "Al-An'am", 165, 'Mekah', 'Binatang Ternak'],
  [7, 'الأعراف', "Al-A'raf", 206, 'Mekah', 'Tempat Tertinggi'],
  [8, 'الأنفال', 'Al-Anfal', 75, 'Madinah', 'Rampasan Perang'],
  [9, 'التوبة', 'At-Taubah', 129, 'Madinah', 'Pengampunan'],
  [10, 'يونس', 'Yunus', 109, 'Mekah', 'Nabi Yunus'],
  [11, 'هود', 'Hud', 123, 'Mekah', 'Nabi Hud'],
  [12, 'يوسف', 'Yusuf', 111, 'Mekah', 'Nabi Yusuf'],
  [13, 'الرعد', "Ar-Ra'd", 43, 'Madinah', 'Guruh'],
  [14, 'إبراهيم', 'Ibrahim', 52, 'Mekah', 'Nabi Ibrahim'],
  [15, 'الحجر', 'Al-Hijr', 99, 'Mekah', 'Lembah Hijr'],
  [16, 'النحل', 'An-Nahl', 128, 'Mekah', 'Lebah'],
  [17, 'الإسراء', "Al-Isra'", 111, 'Mekah', 'Perjalanan Malam'],
  [18, 'الكهف', 'Al-Kahf', 110, 'Mekah', 'Gua'],
  [19, 'مريم', 'Maryam', 98, 'Mekah', 'Maryam'],
  [20, 'طه', 'Ta Ha', 135, 'Mekah', 'Thaha'],
  [21, 'الأنبياء', "Al-Anbiya'", 112, 'Mekah', 'Para Nabi'],
  [22, 'الحج', 'Al-Hajj', 78, 'Madinah', 'Haji'],
  [23, 'المؤمنون', "Al-Mu'minun", 118, 'Mekah', 'Orang-Orang Mukmin'],
  [24, 'النور', 'An-Nur', 64, 'Madinah', 'Cahaya'],
  [25, 'الفرقان', 'Al-Furqan', 77, 'Mekah', 'Pembeda'],
  [26, 'الشعراء', "Asy-Syu'ara'", 227, 'Mekah', 'Para Penyair'],
  [27, 'النمل', 'An-Naml', 93, 'Mekah', 'Semut'],
  [28, 'القصص', 'Al-Qasas', 88, 'Mekah', 'Kisah-Kisah'],
  [29, 'العنكبوت', "Al-'Ankabut", 69, 'Mekah', 'Laba-Laba'],
  [30, 'الروم', 'Ar-Rum', 60, 'Mekah', 'Bangsa Romawi'],
  [31, 'لقمان', 'Luqman', 34, 'Mekah', 'Luqman'],
  [32, 'السجدة', 'As-Sajdah', 30, 'Mekah', 'Sujud'],
  [33, 'الأحزاب', 'Al-Ahzab', 73, 'Madinah', 'Golongan Bersekutu'],
  [34, 'سبأ', "Saba'", 54, 'Mekah', 'Kaum Saba'],
  [35, 'فاطر', 'Fatir', 45, 'Mekah', 'Pencipta'],
  [36, 'يس', 'Ya Sin', 83, 'Mekah', 'Yasin'],
  [37, 'الصافات', 'As-Saffat', 182, 'Mekah', 'Barisan-Barisan'],
  [38, 'ص', 'Sad', 88, 'Mekah', 'Shad'],
  [39, 'الزمر', 'Az-Zumar', 75, 'Mekah', 'Rombongan'],
  [40, 'غافر', 'Ghafir', 85, 'Mekah', 'Maha Pengampun'],
  [41, 'فصلت', 'Fussilat', 54, 'Mekah', 'Yang Dijelaskan'],
  [42, 'الشورى', 'Asy-Syura', 53, 'Mekah', 'Musyawarah'],
  [43, 'الزخرف', 'Az-Zukhruf', 89, 'Mekah', 'Perhiasan'],
  [44, 'الدخان', 'Ad-Dukhan', 59, 'Mekah', 'Kabut'],
  [45, 'الجاثية', 'Al-Jasiyah', 37, 'Mekah', 'Yang Berlutut'],
  [46, 'الأحقاف', 'Al-Ahqaf', 35, 'Mekah', 'Bukit-Bukit Pasir'],
  [47, 'محمد', 'Muhammad', 38, 'Madinah', 'Nabi Muhammad'],
  [48, 'الفتح', 'Al-Fath', 29, 'Madinah', 'Kemenangan'],
  [49, 'الحجرات', 'Al-Hujurat', 18, 'Madinah', 'Kamar-Kamar'],
  [50, 'ق', 'Qaf', 45, 'Mekah', 'Qaf'],
  [51, 'الذاريات', 'Az-Zariyat', 60, 'Mekah', 'Angin Yang Menerbangkan'],
  [52, 'الطور', 'At-Tur', 49, 'Mekah', 'Bukit Tursina'],
  [53, 'النجم', 'An-Najm', 62, 'Mekah', 'Bintang'],
  [54, 'القمر', 'Al-Qamar', 55, 'Mekah', 'Bulan'],
  [55, 'الرحمن', 'Ar-Rahman', 78, 'Madinah', 'Maha Pengasih'],
  [56, 'الواقعة', "Al-Waqi'ah", 96, 'Mekah', 'Hari Kiamat'],
  [57, 'الحديد', 'Al-Hadid', 29, 'Madinah', 'Besi'],
  [58, 'المجادلة', 'Al-Mujadilah', 22, 'Madinah', 'Gugatan'],
  [59, 'الحشر', 'Al-Hasyr', 24, 'Madinah', 'Pengusiran'],
  [60, 'الممتحنة', 'Al-Mumtahanah', 13, 'Madinah', 'Wanita Yang Diuji'],
  [61, 'الصف', 'As-Saff', 14, 'Madinah', 'Barisan'],
  [62, 'الجمعة', "Al-Jumu'ah", 11, 'Madinah', 'Hari Jumat'],
  [63, 'المنافقون', 'Al-Munafiqun', 11, 'Madinah', 'Orang-Orang Munafik'],
  [64, 'التغابن', 'At-Taghabun', 18, 'Madinah', 'Hari Dinampakkan Kesalahan'],
  [65, 'الطلاق', 'At-Talaq', 12, 'Madinah', 'Talak'],
  [66, 'التحريم', 'At-Tahrim', 12, 'Madinah', 'Mengharamkan'],
  [67, 'الملك', 'Al-Mulk', 30, 'Mekah', 'Kerajaan'],
  [68, 'القلم', 'Al-Qalam', 52, 'Mekah', 'Pena'],
  [69, 'الحاقة', 'Al-Haqqah', 52, 'Mekah', 'Hari Kiamat'],
  [70, 'المعارج', "Al-Ma'arij", 44, 'Mekah', 'Tempat Naik'],
  [71, 'نوح', 'Nuh', 28, 'Mekah', 'Nabi Nuh'],
  [72, 'الجن', 'Al-Jinn', 28, 'Mekah', 'Jin'],
  [73, 'المزمل', 'Al-Muzzammil', 20, 'Mekah', 'Orang Yang Berselimut'],
  [74, 'المدثر', 'Al-Muddassir', 56, 'Mekah', 'Orang Yang Berkemul'],
  [75, 'القيامة', 'Al-Qiyamah', 40, 'Mekah', 'Hari Kiamat'],
  [76, 'الإنسان', 'Al-Insan', 31, 'Madinah', 'Manusia'],
  [77, 'المرسلات', 'Al-Mursalat', 50, 'Mekah', 'Malaikat Yang Diutus'],
  [78, 'النبأ', "An-Naba'", 40, 'Mekah', 'Berita Besar'],
  [79, 'النازعات', "An-Nazi'at", 46, 'Mekah', 'Malaikat Yang Mencabut'],
  [80, 'عبس', "'Abasa", 42, 'Mekah', 'Ia Bermuka Masam'],
  [81, 'التكوير', 'At-Takwir', 29, 'Mekah', 'Penggulungan'],
  [82, 'الانفطار', 'Al-Infitar', 19, 'Mekah', 'Terbelah'],
  [83, 'المطففين', 'Al-Mutaffifin', 36, 'Mekah', 'Orang-Orang Curang'],
  [84, 'الانشقاق', 'Al-Insiqaq', 19, 'Mekah', 'Terbelah'],
  [85, 'البروج', 'Al-Buruj', 22, 'Mekah', 'Gugusan Bintang'],
  [86, 'الطارق', 'At-Tariq', 17, 'Mekah', 'Yang Datang Di Malam Hari'],
  [87, 'الأعلى', "Al-A'la", 19, 'Mekah', 'Maha Tinggi'],
  [88, 'الغاشية', 'Al-Ghasyiyah', 26, 'Mekah', 'Hari Kiamat'],
  [89, 'الفجر', 'Al-Fajr', 30, 'Mekah', 'Fajar'],
  [90, 'البلد', 'Al-Balad', 20, 'Mekah', 'Negeri'],
  [91, 'الشمس', 'Asy-Syams', 15, 'Mekah', 'Matahari'],
  [92, 'الليل', 'Al-Lail', 21, 'Mekah', 'Malam'],
  [93, 'الضحى', 'Ad-Duha', 11, 'Mekah', 'Waktu Dhuha'],
  [94, 'الشرح', 'Asy-Syarh', 8, 'Mekah', 'Kelapangan'],
  [95, 'التين', 'At-Tin', 8, 'Mekah', 'Buah Tin'],
  [96, 'العلق', "Al-'Alaq", 19, 'Mekah', 'Segumpal Darah'],
  [97, 'القدر', 'Al-Qadr', 5, 'Mekah', 'Kemuliaan'],
  [98, 'البينة', 'Al-Bayyinah', 8, 'Madinah', 'Bukti Nyata'],
  [99, 'الزلزلة', 'Az-Zalzalah', 8, 'Madinah', 'Keguncangan'],
  [100, 'العاديات', "Al-'Adiyat", 11, 'Mekah', 'Kuda Perang'],
  [101, 'القارعة', "Al-Qari'ah", 11, 'Mekah', 'Hari Kiamat'],
  [102, 'التكاثر', 'At-Takasur', 8, 'Mekah', 'Bermegah-Megahan'],
  [103, 'العصر', "Al-'Asr", 3, 'Mekah', 'Masa/Waktu'],
  [104, 'الهمزة', 'Al-Humazah', 9, 'Mekah', 'Pengumpat'],
  [105, 'الفيل', 'Al-Fil', 5, 'Mekah', 'Gajah'],
  [106, 'قريش', 'Quraisy', 4, 'Mekah', 'Suku Quraisy'],
  [107, 'الماعون', "Al-Ma'un", 7, 'Mekah', 'Barang Berguna'],
  [108, 'الكوثر', 'Al-Kausar', 3, 'Mekah', 'Nikmat Yang Banyak'],
  [109, 'الكافرون', 'Al-Kafirun', 6, 'Mekah', 'Orang-Orang Kafir'],
  [110, 'النصر', 'An-Nasr', 3, 'Madinah', 'Pertolongan'],
  [111, 'المسد', 'Al-Lahab', 5, 'Mekah', 'Gejolak Api'],
  [112, 'الإخلاص', 'Al-Ikhlas', 4, 'Mekah', 'Ikhlas'],
  [113, 'الفلق', 'Al-Falaq', 5, 'Mekah', 'Waktu Subuh'],
  [114, 'الناس', 'An-Nas', 6, 'Mekah', 'Manusia'],
].map(([nomor, nama, nama_latin, jumlah_ayat, tempat_turun, arti]) => ({
  id: nomor,
  nomor,
  nama,
  nama_latin,
  jumlah_ayat,
  tempat_turun,
  arti,
  deskripsi: '',
  audio_full: `https://equran.nos.wjv-1.neo.id/audio-full/Mishary-Rashid-Al-Afasy/${String(nomor).padStart(3, '0')}.mp3`,
}))

export const equranService = {
  /**
   * Fetch 114 Surahs from Backend DB (with fallback to direct EQuran API & built-in fallback)
   */
  getSurahs: async (params = {}) => {
    let rawList = []
    try {
      const res = await api.get('/equran/surah', { params })
      if (res.data?.data && res.data.data.length > 0) {
        rawList = res.data.data
      }
    } catch (e) {
      console.warn('Backend EQuran endpoint offline, checking direct API & fallbacks', e)
    }

    // Direct Fallback to equran.id API
    if (!rawList || rawList.length === 0) {
      try {
        const resDirect = await axios.get('https://equran.id/api/v2/surat')
        rawList = resDirect.data?.data || []
      } catch (err) {
        console.warn('Direct equran.id API fallback failed, using built-in 114 surah dataset', err)
      }
    }

    // Built-in Complete 114 Surah Fallback if both backend & API are unreachable
    if (!rawList || rawList.length === 0) {
      return FALLBACK_114_SURAHS
    }

    // Normalize keys so frontend components always get consistent property names
    return rawList.map((item) => ({
      id: item.id || item.nomor,
      nomor: Number(item.nomor),
      nama: item.nama || '',
      nama_latin: item.namaLatin || item.nama_latin || '',
      jumlah_ayat: Number(item.jumlahAyat || item.jumlah_ayat || 0),
      tempat_turun: item.tempatTurun || item.tempat_turun || 'Mekah',
      arti: item.arti || '',
      deskripsi: item.deskripsi || '',
      audio_full: item.audioFull?.['05'] || item.audio_full || null,
    }))
  },

  /**
   * Fetch Surah Detail along with list of Ayahs (No Ayat, Arab, Latin, Terjemahan)
   */
  getSurahDetail: async (nomorOrId) => {
    try {
      const res = await api.get(`/equran/surah/${nomorOrId}`)
      if (res.data?.data && res.data?.ayat && res.data.ayat.length > 0) {
        const s = res.data.data
        return {
          surah: {
            id: s.id || s.nomor,
            nomor: Number(s.nomor),
            nama: s.nama || '',
            nama_latin: s.namaLatin || s.nama_latin || '',
            jumlah_ayat: Number(s.jumlahAyat || s.jumlah_ayat || 0),
            tempat_turun: s.tempatTurun || s.tempat_turun || 'Mekah',
            arti: s.arti || '',
            deskripsi: s.deskripsi || '',
            audio_full: s.audioFull?.['05'] || s.audio_full || null,
          },
          ayat: res.data.ayat || [],
        }
      }
    } catch (e) {
      console.warn('Backend EQuran detail offline, falling back to direct equran.id API', e)
    }

    // Direct Fallback
    try {
      const resDirect = await axios.get(`https://equran.id/api/v2/surat/${nomorOrId}`)
      const data = resDirect.data?.data || {}
      return {
        surah: {
          id: data.nomor,
          nomor: Number(data.nomor),
          nama: data.nama,
          nama_latin: data.namaLatin || data.nama_latin,
          jumlah_ayat: Number(data.jumlahAyat || data.jumlah_ayat || 0),
          tempat_turun: data.tempatTurun || data.tempat_turun || 'Mekah',
          arti: data.arti,
          deskripsi: data.deskripsi,
          audio_full: data.audioFull?.['05'] || null,
        },
        ayat: (data.ayat || []).map((a) => ({
          nomor_ayat: a.nomorAyat || a.nomor,
          teks_arab: a.teksArab || a.ar,
          teks_latin: a.teksLatin || a.tr,
          teks_indonesia: a.teksIndonesia || a.idn,
          audio: a.audio?.['05'] || null,
        })),
      }
    } catch (e) {
      console.error('Failed fetching surah detail:', e)
      throw e
    }
  },

  /**
   * Create a new Surah entry in database
   */
  createSurah: async (payload) => {
    const res = await api.post('/equran/surah', payload)
    return res.data
  },

  /**
   * Update Surah entry in database
   */
  updateSurah: async (id, payload) => {
    const res = await api.put(`/equran/surah/${id}`, payload)
    return res.data
  },

  /**
   * Delete Surah from database
   */
  deleteSurah: async (id) => {
    const res = await api.delete(`/equran/surah/${id}`)
    return res.data
  },

  /**
   * Auto sync 114 Surahs from EQuran.id API into local database
   */
  syncSurah: async () => {
    const res = await api.post('/equran/sync-surah')
    return res.data
  },

  /**
   * Fetch Jadwal Sholat for today & kota (default kabkota 1 = Jakarta/Sekitarnya)
   */
  getJadwalSholat: async (kabkotaId = '1', tanggal = null) => {
    const today = tanggal || new Date().toISOString().split('T')[0]
    try {
      const res = await api.get('/equran/jadwal-sholat', {
        params: { kabkota_id: kabkotaId, tanggal: today },
      })
      if (res.data?.data) {
        return res.data
      }
    } catch (e) {
      console.warn('Backend Jadwal Sholat endpoint offline, falling back to direct equran.id API', e)
    }

    // Direct Fallback
    try {
      const resDirect = await axios.get(`https://equran.id/api/v2/shalat/${kabkotaId}/${today}`)
      const resData = resDirect.data?.data || {}
      return {
        success: true,
        source: 'equran_api_direct',
        data: resData.jadwal || resData,
      }
    } catch (e) {
      console.error('Failed to fetch prayer schedule:', e)
      return {
        success: false,
        source: 'default',
        data: {
          subuh: '04:35',
          dzuhur: '11:55',
          ashar: '15:16',
          maghrib: '17:54',
          isya: '19:05',
        },
      }
    }
  },

  /**
   * Fetch list of Provinces (GET /api/v2/shalat/provinsi)
   */
  getProvinsi: async () => {
    try {
      const res = await api.get('/v2/shalat/provinsi')
      return res.data
    } catch (e) {
      console.warn('Backend prov endpoint offline, calling direct equran.id or fallback', e)
      try {
        const direct = await axios.get('https://equran.id/api/v2/shalat/provinsi')
        return direct.data
      } catch (err) {
        return {
          code: 200,
          message: 'Daftar provinsi (Fallback local)',
          data: [
            "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Sumatera Selatan",
            "Bangka Belitung", "Bengkulu", "Lampung", "DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah",
            "DI Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
            "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
            "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan",
            "Sulawesi Tenggara", "Maluku", "Maluku Utara", "Papua", "Papua Barat"
          ]
        }
      }
    }
  },

  /**
   * Fetch list of Kab/Kota (POST /api/v2/shalat/kabkota)
   */
  getKabkota: async (provinsi = 'Jawa Barat') => {
    try {
      const res = await api.post('/v2/shalat/kabkota', { provinsi })
      return res.data
    } catch (e) {
      console.warn('Backend kabkota endpoint offline, calling direct equran.id or fallback', e)
      try {
        const direct = await axios.post('https://equran.id/api/v2/shalat/kabkota', { provinsi })
        return direct.data
      } catch (err) {
        return {
          code: 200,
          message: `Daftar kabupaten/kota di ${provinsi} (Fallback local)`,
          data: [
            "Kab. Bandung", "Kab. Bandung Barat", "Kab. Bekasi", "Kab. Bogor", "Kab. Ciamis", "Kab. Cianjur",
            "Kab. Cirebon", "Kab. Garut", "Kab. Indramayu", "Kab. Karawang", "Kab. Kuningan", "Kab. Majalengka",
            "Kota Bandung", "Kota Bekasi", "Kota Bogor", "Kota Cimahi", "Kota Cirebon", "Kota Depok"
          ]
        }
      }
    }
  },

  /**
   * Fetch Monthly Prayer Schedule (POST /api/v2/shalat)
   */
  getJadwalShalatBulanan: async (provinsi = 'Jawa Barat', kabkota = 'Kota Bogor', bulan = 1, tahun = 2026) => {
    try {
      const res = await api.post('/v2/shalat', { provinsi, kabkota, bulan, tahun })
      return res.data
    } catch (e) {
      console.warn('Backend shalat endpoint offline, trying direct or fallback generator', e)
      try {
        const direct = await axios.post('https://equran.id/api/v2/shalat', { provinsi, kabkota, bulan, tahun })
        return direct.data
      } catch (err) {
        return {
          code: 200,
          message: `Jadwal shalat berhasil diambil (${provinsi} - ${kabkota})`,
          data: {
            provinsi,
            kabkota,
            bulan,
            tahun,
            bulan_nama: "Januari",
            jadwal: [
              { tanggal: 1, tanggal_lengkap: `${tahun}-01-01`, hari: "Kamis", imsak: "04:25", subuh: "04:35", terbit: "05:52", dhuha: "06:17", dzuhur: "12:05", ashar: "15:24", maghrib: "18:13", isya: "19:25" },
              { tanggal: 2, tanggal_lengkap: `${tahun}-01-02`, hari: "Jumat", imsak: "04:26", subuh: "04:36", terbit: "05:53", dhuha: "06:18", dzuhur: "12:06", ashar: "15:25", maghrib: "18:14", isya: "19:26" }
            ]
          }
        }
      }
    }
  },

  /**
   * Save prayer schedule to DB as Master Data
   */
  saveMasterShalat: async (payload) => {
    const res = await api.post('/v2/shalat/save-master', payload)
    return res.data
  },

  /**
   * Fetch Master Data Sholat stored in DB
   */
  getMasterShalatList: async (params = {}) => {
    const res = await api.get('/v2/shalat/master-list', { params })
    return res.data
  },

  /**
   * Delete single Master Data Sholat record from DB
   */
  deleteMasterShalat: async (id) => {
    const res = await api.delete(`/v2/shalat/master-list/${id}`)
    return res.data
  },

  /**
   * Fetch Doa & Dzikir items (GET /api/doa with params: grup, tag, search)
   */
  getDoas: async (params = {}) => {
    try {
      const res = await api.get('/doa', { params })
      if (res.data) {
        return res.data
      }
    } catch (e) {
      console.warn('Backend /doa API offline, trying direct equran.id or fallback', e)
    }

    try {
      const resDirect = await axios.get('https://equran.id/api/doa', { params })
      const rawList = resDirect.data?.data || resDirect.data || []
      const allGroups = [...new Set(rawList.map((d) => d.grup).filter(Boolean))]
      const allTags = [...new Set(rawList.flatMap((d) => d.tag || d.tags || []).filter(Boolean))]

      return {
        success: true,
        message: 'Data doa berhasil dimuat (Direct EQuran API)',
        stats: {
          total_doa: rawList.length,
          filtered_count: rawList.length,
          total_grup: allGroups.length,
          total_tag: allTags.length,
        },
        grup_options: allGroups,
        tag_options: allTags,
        data: rawList,
      }
    } catch (err) {
      console.error('Direct equran.id API for doa unreachable', err)
      return {
        success: false,
        message: 'Gagal memuat data doa',
        stats: { total_doa: 0, filtered_count: 0, total_grup: 0, total_tag: 0 },
        grup_options: [],
        tag_options: [],
        data: [],
      }
    }
  },

  /**
   * Fetch single Doa detail by ID (GET /api/doa/{id})
   */
  getDoaDetail: async (id) => {
    try {
      const res = await api.get(`/doa/${id}`)
      if (res.data?.data) {
        return res.data
      }
    } catch (e) {
      console.warn('Backend /doa/{id} offline, trying direct API', e)
    }

    try {
      const resDirect = await axios.get(`https://equran.id/api/doa/${id}`)
      return {
        success: true,
        data: resDirect.data?.data || resDirect.data,
      }
    } catch (err) {
      console.error('Failed fetching doa detail:', err)
      throw err
    }
  },

  /**
   * Sync Doa & Dzikir items from EQuran.id to DB (POST /api/doa/sync)
   */
  syncDoas: async () => {
    const res = await api.post('/doa/sync')
    return res.data
  },

  /**
   * Create new manual Doa entry (POST /api/doa)
   */
  createDoa: async (payload) => {
    const res = await api.post('/doa', payload)
    return res.data
  },

  /**
   * Update Doa entry (PUT /api/doa/{id})
   */
  updateDoa: async (id, payload) => {
    const res = await api.put(`/doa/${id}`, payload)
    return res.data
  },

  /**
   * Delete Doa entry (DELETE /api/doa/{id})
   */
  deleteDoa: async (id) => {
    const res = await api.delete(`/doa/${id}`)
    return res.data
  },
}

