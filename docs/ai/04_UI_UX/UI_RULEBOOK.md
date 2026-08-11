# UI RULEBOOK

Master UI lock + aturan global UI/UX SIMSIT (canonical). Sumber historis sudah diarsipkan; dokumen ini dan dokumen di folder `04_UI_UX/` adalah acuan aktif.

## MASTER UI LOCK

Gunakan UI referensi sebagai MASTER DESIGN.

**JANGAN redesign total. JANGAN ubah layout, navigasi, struktur dashboard.**

Pertahankan: Sidebar · Topbar · Hero Banner · KPI Cards · Chart · Table · CRUD Form · Modal · Drawer · Bottom Navigation · Responsive · Light Mode · Dark Mode.

Style: **Modern Enterprise SaaS, Minimal, Premium, Clean, Islamic, PWA Ready**.

## Urutan Prioritas Aturan

1. `UI_RULEBOOK.md` (ini)
2. `DESIGN_SYSTEM.md`
3. `COMPONENT_STANDARD.md`
4. `LAYOUT_STANDARD.md` / `NAVIGATION_STANDARD.md`
5. `RESPONSIVE_STANDARD.md`
6. Rulebook khusus komponen yang sedang dikerjakan
7. Instruksi modul

Konflik → aturan yang lebih spesifik berlaku selama tidak melanggar Master UI Lock.

## Aturan Global (WAJIB)

- Semua halaman wajib memakai komponen dari barrel `src/components/app` (AppPageLayout, AppDataTable, AppButton, AppCard, AppModal, AppDrawer, AppBadge, dst).
- **DILARANG membuat komponen duplikat baru** per halaman (Header/Table/Card/Modal/Search/Badge custom). Lihat Banned Names di `COMPONENT_STANDARD.md`.
- **DILARANG hardcode/mock data bisnis** — semua KPI/chart/tabel dari API Laravel → PostgreSQL. Loading/empty/error state wajib ada.
- CRUD memakai popup/modal/drawer (bukan navigasi halaman terpisah untuk form).
- **Konfirmasi sebelum aksi kritis** (delete, import, export, approval, finalisasi) via ConfirmDialog/DeleteDialog.
- Feedback: success/error toast (`useToast`), notification bell, loading state.
- Light & Dark mode layout IDENTIK — hanya warna berubah.
- Accessibility: focus ring terlihat, icon button wajib `aria-label`/tooltip, kontras cukup (target WCAG 2.1 AA), keyboard support.
- Tanpa animasi berat; gunakan micro-interaction global yang konsisten.
- Responsive: 360/390/768/1024/1280/1440 wajib benar (lihat RESPONSIVE_STANDARD).

## Canonical UI Contract

| Area | Aturan aktif |
|---|---|
| Brand tokens | Primary `#0E5C44`, Secondary `#1E8E5A`, Accent `#3FBF75` |
| Typography and icons | Font `Inter`; icons `Lucide` |
| Shape | Card radius `18px`; modal radius `20px` |
| Responsive | Desktop, tablet, dan mobile mengikuti `RESPONSIVE_STANDARD.md`; tidak boleh overlap, clipping, atau overflow yang tidak perlu |
| Reuse | Reuse global components; jangan membuat Button, Card, Table, Form, Modal, Drawer, Badge, Search, atau Header duplikat |
| Data | Tidak ada mock/hardcoded business data; KPI, chart, table, dan options berasal dari API/PostgreSQL |
| CRUD | Create/update memakai popup/modal/drawer; delete, import, export, approval, dan finalisasi meminta confirmation sebelum aksi kritis |
| Feedback | Toast/notification untuk hasil aksi; loading, empty, error, retry, dan access-denied state wajib |
| Theme | Light dan dark mode memakai struktur/layout yang sama; hanya token warna yang berubah |
| Accessibility | Keyboard support, visible focus, accessible name/`aria-label`, tooltip icon button, kontras WCAG 2.1 AA, dan target sentuh minimal 44px pada layar sentuh |

## Batasan Kerja

Hanya boleh mengubah UI/UX/layout/komponen presentasi/styling/responsive/animation/state popup & notifikasi. **Jangan mengubah** business logic, API & payload, route/URL, controller/service/repository/model/migration/permission/menu utama/autentikasi/kontrak data.

## Referensi

- Tokens: `04_UI_UX/DESIGN_SYSTEM.md`
- Komponen canonical: `04_UI_UX/COMPONENT_STANDARD.md`
- Layout: `04_UI_UX/LAYOUT_STANDARD.md` · Navigasi: `04_UI_UX/NAVIGATION_STANDARD.md`
- Komponen: `04_UI_UX/BUTTON_STANDARD.md`, `CARD_STANDARD.md`, `TABLE_STANDARD.md`, `FORM_STANDARD.md`, `MODAL_DRAWER_STANDARD.md`
- Responsive: `04_UI_UX/RESPONSIVE_STANDARD.md` · Notifikasi: `04_UI_UX/NOTIFICATION_STANDARD.md` · Badge: `04_UI_UX/STATUS_BADGE_STANDARD.md`
