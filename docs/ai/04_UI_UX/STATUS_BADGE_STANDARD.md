# STATUS BADGE STANDARD

Standar badge status. Bukti historis: `99_ARCHIVE/UI_STATUS_BADGE_STANDARD.md`.

## Canonical

`<AppBadge />` — satu-satunya badge. Variants via `variant` atau `status` prop:

```jsx
<AppBadge variant="success">Aktif</AppBadge>
<AppBadge variant="warning">Pending</AppBadge>
<AppBadge variant="danger">Nonaktif</AppBadge>
<AppBadge variant="info">Info</AppBadge>
<AppBadge variant="neutral">Draft</AppBadge>
<AppBadge variant="primary">Utama</AppBadge>
```

## Pemetaan Status

| Status | Variant |
|---|---|
| Aktif / Active / Approved / Success / Done / Diterima / Hadir / Lulus / Selesai | `success` |
| Pending / Menunggu / On Review / Draft / Scheduled / Incomplete / Disetujui-Sebagian | `warning` |
| Nonaktif / Rejected / Failed / Gagal / Invalid / Ditolak / Tidak Hadir / Absen / Tidak Lulus / Suspended / Disqualified | `danger` |
| Info / Referensi / Baru / Update / Berlangsung / Sedang Berjalan | `info` |
| Netral / Default / N/A / Canceled / Unassigned | `neutral` |

## Aturan

- Badge berbentuk pill (`rounded-full`), dengan dot indikator.
- Teks singkat; warna kontras memadai.
- Status value dari backend di-normalisasi ke variant via `getStatusVariant(value)` — pemetaan di satu tempat, bukan hardcode per halaman.
- DILARANG membuat badge custom per modul (MasterBadge, MutabaahStatusBadge → pakai `AppBadge`).

## Referensi

- Detail sumber: `99_ARCHIVE/UI_STATUS_BADGE_STANDARD.md`
- Komponen canonical: `04_UI_UX/COMPONENT_STANDARD.md`
