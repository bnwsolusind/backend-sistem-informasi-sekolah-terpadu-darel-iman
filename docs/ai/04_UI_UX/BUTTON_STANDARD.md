# BUTTON STANDARD

Standar tombol. Bukti historis: `99_ARCHIVE/GLOBAL_BUTTON_STANDARD.md`, `99_ARCHIVE/BUTTON_STANDARD.md`.

## Canonical

`<AppButton />` — satu-satunya tombol di seluruh aplikasi.

```jsx
<AppButton variant="primary" icon={Plus}>Tambah</AppButton>
<AppButton variant="outline" icon={Download}>Export</AppButton>
<AppButton variant="ghost" icon={Trash2}>Hapus</AppButton>
<AppButton variant="destructive">Hapus</AppButton>
<AppButton loading loadingText="Menyimpan...">Simpan</AppButton>
```

`<IconButton />` — tombol ikon saja; `label` → tooltip + aria-label.

## Variants

| Variant | Penggunaan |
|---|---|
| `primary` | Aksi utama (Simpan, Tambah, Setujui) |
| `secondary` | Aksi sekunder |
| `outline` | Aksi alternatif (Export, Import) |
| `ghost` | Aksi ringan/ikon |
| `destructive` | Hapus / berbahaya (map danger) |
| `success` | Konfirmasi positif (map primary) |
| `icon` | Icon button |
| `link` | Link-style |

## Ukuran (Size Tokens)

`sm` h-8 · `default` h-10 · `lg` h-12 · `icon` h-9 w-9.

## State

Default · Hover (`-translate-y-0.5`) · Focus (`focus-visible:ring-3`) · Disabled (`opacity-50`) · Loading (spinner `LoaderCircle`/`Loader2` + disabled).

## Icon + Label Ringkas

| Ikon | Label |
|---|---|
| `Plus` | Tambah |
| `Upload` | Import |
| `Download` | Export |
| `Filter` | Filter |
| `Eye` | Detail |
| `Pencil` | Edit |
| `Trash2` | Hapus |

## Aturan

- Tombol tidak boleh keluar card / bertumpuk / berubah ukuran antar halaman.
- Teks terlalu panjang → tooltip.
- Semua tombol ikon wajib `aria-label`.
- Hover tidak boleh menggeser layout.
- No arbitrary sizes: semua tombol memakai `AppButton variant size`.

## Referensi

- Design tokens: `04_UI_UX/DESIGN_SYSTEM.md`
- Detail sumber: `99_ARCHIVE/GLOBAL_BUTTON_STANDARD.md`, `99_ARCHIVE/BUTTON_STANDARD.md`
