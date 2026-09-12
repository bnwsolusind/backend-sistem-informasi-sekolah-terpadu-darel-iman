<?php

use App\Models\EducationUnit;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Populate logo_url in metadata for all education units if not yet present
        $units = EducationUnit::all();
        foreach ($units as $unit) {
            $meta = $unit->metadata ?? [];
            if (empty($meta['logo_url'])) {
                $lvl = strtolower($unit->level ?? '');
                $meta['logo_url'] = match (true) {
                    str_contains($lvl, 'tk') => '/assets/logos/tkit.svg',
                    str_contains($lvl, 'taud') => '/assets/logos/taud.svg',
                    str_contains($lvl, 'sd') => '/assets/logos/sdit.svg',
                    str_contains($lvl, 'mit') => '/assets/logos/mit.svg',
                    str_contains($lvl, 'smp') => '/assets/logos/smpit.svg',
                    str_contains($lvl, 'sma') => '/assets/logos/smait.svg',
                    str_contains($lvl, 'ponpes') || str_contains($lvl, 'ma') => '/assets/logos/ponpes.svg',
                    str_contains($lvl, 'mahad') => '/assets/logos/mahad.svg',
                    default => '/assets/logos/smait.svg',
                };
                $unit->metadata = $meta;
                $unit->saveQuietly();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No destructive reverse needed
    }
};
