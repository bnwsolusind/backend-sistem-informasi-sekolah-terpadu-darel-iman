<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrayerGradeRule extends Model
{
    use HasFactory, HasUuidPrimaryKey;

    protected $table = 'prayer_grade_rules';

    protected $fillable = [
        'id',
        'grade',
        'label',
        'min_score',
        'max_score',
        'description',
        'order_index',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'min_score' => 'decimal:2',
        'max_score' => 'decimal:2',
        'order_index' => 'integer',
        'is_active' => 'boolean',
    ];

    public static function resolveGrade(float $score): array
    {
        $rule = static::where('is_active', true)
            ->where('min_score', '<=', $score)
            ->where('max_score', '>=', $score)
            ->orderBy('order_index')
            ->first();

        if ($rule) {
            return [
                'grade' => $rule->grade,
                'label' => $rule->label,
                'description' => $rule->description,
            ];
        }

        if ($score >= 90) return ['grade' => 'A', 'label' => 'Mumtaz', 'description' => 'Istimewa'];
        if ($score >= 80) return ['grade' => 'B', 'label' => 'Jayyid Jiddan', 'description' => 'Sangat Baik'];
        if ($score >= 75) return ['grade' => 'C', 'label' => 'Jayyid', 'description' => 'Baik'];
        return ['grade' => 'D', 'label' => 'Maqbul', 'description' => 'Perlu Bimbingan'];
    }
}
