#!/usr/bin/env bash
export DYLD_FALLBACK_LIBRARY_PATH="/Applications/XAMPP/xamppfiles/htdocs/Sistem-Manajemen-Sekolah-terpadu-main/backend/libs"
php artisan "$@"
