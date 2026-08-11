# TABLE STANDARD

Standar tabel. Bukti historis: `99_ARCHIVE/GLOBAL_TABLE_STANDARD.md`, `99_ARCHIVE/TABLE_STANDARD.md`, `99_ARCHIVE/UI_TABLE_STANDARD.md`.

## Canonical

`<AppDataTable />` — satu-satunya tabel yang boleh dipakai.

```jsx
<AppDataTable
  columns={[
    { key: 'nama', label: 'Nama', render: (row) => <PersonIdentityCell person={row} /> },
    { key: 'kelas', label: 'Kelas', hideOnMobile: true },
    { key: 'status', label: 'Status', render: (row) => <AppBadge variant={...}>{row.status}</AppBadge> },
  ]}
  data={items}
  searchableKeys={['nama', 'nis']}
  search={q} onSearchChange={setQ}
  filters={<AppFilterBar>...</AppFilterBar>}
  meta={pageMeta}          // Laravel pagination meta
  onPageChange={setPage}
  onView={handleView} onEdit={handleEdit} onDelete={handleDelete}
  onHistory={handleHistory} extraActions={[...]}
  isLoading={isPending} isError={isError} onRetry={refetch}
  density="comfortable"    // atau "compact"
  selectedKeys={selected} onToggleSelect={setSelected}
  emptyTitle="Belum ada data siswa." emptyDescription="Data akan muncul setelah record tersedia."
  toolbarClassName="..."
/>
```

## Dukungan

Columns · Rows · Search · Filter · Pagination · Sorting · Loading (skeleton) · Empty · Error + Retry · Row Action · Sticky Action Column · Responsive (`hideOnMobile`).

## Person Data

Data orang memakai `<PersonIdentityCell />`:

```
[Avatar]  Ahmad Fauzi
          NIS 23001
```

## Table Action

Standard: View Detail (Eye) | Edit (Pencil) | Delete (Trash2) | More (ActionDropdown). Utamakan icon + tooltip; jangan setiap modul punya style action berbeda.

## Visual Spec

- Sticky header (`sticky top-0 z-10 bg-slate-50 dark:bg-slate-900`).
- Sticky action column (`sticky right-0 z-10 bg-white dark:bg-[#1B2433]`).
- Responsive wrapper `w-full overflow-x-auto`.
- Header `text-[11px] font-extrabold uppercase text-slate-500`; cell `text-xs font-semibold text-slate-700`.

## Responsive

| Layar | Perilaku |
|---|---|
| Desktop | Full table |
| Tablet | Compact table |
| Mobile | Card-list representation (kolom `hideOnMobile`) |

Dilarang memaksa 10 kolom horizontal di layar 360px.

## Referensi

- Detail sumber: `99_ARCHIVE/GLOBAL_TABLE_STANDARD.md`, `99_ARCHIVE/TABLE_STANDARD.md`, `99_ARCHIVE/UI_TABLE_STANDARD.md`
- Badge status: `04_UI_UX/STATUS_BADGE_STANDARD.md`
