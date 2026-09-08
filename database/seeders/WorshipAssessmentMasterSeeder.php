<?php

namespace Database\Seeders;

use App\Models\MutabaahAgendaItem;
use App\Models\MutabaahCategory;
use Illuminate\Database\Seeder;

class WorshipAssessmentMasterSeeder extends Seeder
{
    public function run(): void
    {
        $shalat = MutabaahCategory::where('code', 'SHALAT')->firstOrFail();
        $harian = MutabaahCategory::where('code', 'IBADAH-HARIAN')->firstOrFail();
        $tilawah = MutabaahCategory::where('code', 'TILAWAH')->firstOrFail();
        $items = [
            [$shalat, 'DHUHA', 'Dhuha', 'status'],
            [$shalat, 'TARAWIH', 'Tarawih', 'status'],
            [$harian, 'PUASA-RAMADAN', 'Puasa Ramadan', 'status'],
            [$tilawah, 'TADARUS-RAMADAN', 'Tadarus Ramadan', 'pages'],
        ];
        $start = (int) MutabaahAgendaItem::max('sort_order');
        foreach ($items as $index => [$category, $code, $name, $type]) {
            MutabaahAgendaItem::updateOrCreate(['code' => $code], [
                'category_id' => $category->id, 'name' => $name, 'input_type' => $type,
                'weight' => 0, 'sort_order' => $start + $index + 1,
                'icon' => $category->icon, 'color' => $category->color,
                'description' => 'Master aktivitas; bobot ditetapkan pada template penilaian.', 'is_active' => true,
            ]);
        }
    }
}
