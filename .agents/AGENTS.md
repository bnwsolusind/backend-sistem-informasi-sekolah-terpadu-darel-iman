# Project Rules for Sistem Manajemen Sekolah Terpadu

## Environment Bootstrap & Command Rules
- **DO NOT** create or run shell wrappers, bootstrap scripts, or set dynamic library environment variables (`export DYLD_FALLBACK_LIBRARY_PATH`, `export LD_LIBRARY_PATH`, `export DYLD_LIBRARY_PATH`) unless explicitly requested by the user or strictly required by a proven runtime error.
- **ALWAYS** use standard Laravel and Node.js commands (`php artisan ...`, `npm run dev`, `npm run build`, `composer install`).
