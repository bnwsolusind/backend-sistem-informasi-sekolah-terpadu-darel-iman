# Parent Portal — Child Switcher UX & Konsistensi Data

## 1. Masalah

`ParentPortalPage` menampilkan satu dropdown anak dan memuat data section per anak.
Sebelum sesi 10:

- Anak aktif **tidak persisten** lintas navigasi/tab (kembali ke anak pertama setiap mount).
- Saat mengganti anak, **data section lama (anak sebelumnya) masih tampil** selama
  request baru berjalan → flash data anak lain (risiko kebocoran tampilan + kebingungan).

## 2. Perbaikan (`web-dashboard/src/pages/ParentPortalPage.jsx`)

### a. Persistensi via URL (`?child=`)

- Mount pertama: anak aktif dipulihkan dari `?child=` **hanya bila** id masih ada di
  daftar anak terhubung; fallback ke anak pertama. Daftar anak dijamin valid karena
  backend selalu memvalidasi ownership.
- `selectChild(id)` memperbarui `?child=` (replace, bukan push) → dapat dibagikan /
  direfresh tanpa kehilangan konteks anak.
- `selectTab(id)` tidak lagi menghapus parameter lain: mempertahankan `child`.

### b. Pembersihan data lama saat switch

`selectChild()` mereset state data anak sebelumnya secara atomik sebelum request baru:

```
setChildId(id)
setRecords([])           // izin/schedule dsb.
setDashboard(null)
setResultsData(null)
setCbtOverview(null)
setExamGridsRecords([])
setReportsRecords([])
setPermissionsRecords([])
setContacts([])
setMessages([])
```

Sehingga tidak ada blok UI yang menampilkan data anak lain saat loading.

### c. Kontrak dengan backend

- Konteks anak dikirim sebagai `?child_id=` pada tiap request `familyPortalService`
  (`web-dashboard/src/services/familyPortalService.js`), didukung juga oleh header
  `X-Child-Id`.
- Backend fail-closed: anak tak terhubung → 404; UI menampilkan state kosong/error.

## 3. Matriks Perilaku

| Skenario | Sebelum | Sesudah |
|----------|---------|---------|
| Pilih anak B lalu pindah tab | kembali anak A | tetap anak B |
| Refresh halaman | kembali anak A | tetap anak yang dipilih (`?child=`) |
| Ganti anak saat data lama masih loading | data anak A tampil | data bersih + spinner |
| Share URL | tidak ada | `?tab=&child=` terbawa |
| Anak asing via URL | diabaikan diam-diam | tidak dipilih (backend 404), fallback anak valid |

## 4. Catatan Keamanan

Pemilihan anak client-side tidak pernah dipercaya; seluruh endpoint tetap memvalidasi
ownership di server (lihat `PARENT_PORTAL_CHILD_OWNERSHIP_MODEL.md`).
