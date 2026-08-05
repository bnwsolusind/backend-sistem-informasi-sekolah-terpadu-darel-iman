# Duplicate Findings

| Nama duplikasi | Lokasi pertama | Lokasi kedua | Implementasi utama | Tindakan | Status |
| --- | --- | --- | --- | --- | --- |
| API doa kompatibilitas | `/api/doa/*` | `/api/equran/doa/*` | `EQuranController` | Dipertahankan sebagai alias backward-compatible dan diberi middleware identik untuk mutasi. | DUPLICATE FOUND — DELETION DEFERRED DUE TO DEPENDENCY RISK |
| API jadwal shalat kompatibilitas | `/api/v2/shalat/*` | `/api/shalat/*` | `EQuranController` | Dipertahankan sebagai alias backward-compatible dan diberi middleware identik untuk mutasi. | DUPLICATE FOUND — DELETION DEFERRED DUE TO DEPENDENCY RISK |

Tidak ada route atau migration dihapus pada batch ini.
