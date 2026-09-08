<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PrayerAssessmentItem extends Model
{
    use HasFactory, HasUuidPrimaryKey, SoftDeletes;

    protected $table = 'prayer_assessment_items';

    protected $fillable = [
        'id',
        'order_number',
        'name',
        'group',
        'max_score',
        'passing_score',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'order_number' => 'integer',
        'max_score' => 'decimal:2',
        'passing_score' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function assessments()
    {
        return $this->hasMany(StudentPrayerAssessment::class, 'prayer_item_id');
    }
}
