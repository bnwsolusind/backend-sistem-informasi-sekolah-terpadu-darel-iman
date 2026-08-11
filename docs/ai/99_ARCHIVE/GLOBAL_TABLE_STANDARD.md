# GLOBAL TABLE STANDARD

Sistem Manajemen Sekolah Terpadu — Standar tabel.

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

Columns | Rows | Search | Filter | Pagination | Sorting | Loading (skeleton) | Empty | Error + Retry | Row Action | Sticky Action Column | Responsive (`hideOnMobile`).

## Person Data

Data orang memakai `<PersonIdentityCell />`:

```
[Avatar]  Ahmad Fauzi
          NIS 23001
```

## Table Action

Standard: View Detail (Eye) | Edit (Pencil) | Delete (Trash2) | More (ActionDropdown).
Utamakan icon + tooltip. Jangan setiap modul punya style action berbeda.

## Responsive

| Layar | Perilaku |
|---|---|
| Desktop | Full table |
| Tablet | Compact table |
| Mobile | Card-list representation (kolom `hideOnMobile`) |

Dilarang memaksa 10 kolom horizontal di layar 360px.
