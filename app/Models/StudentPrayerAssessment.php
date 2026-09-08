<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentPrayerAssessment extends Model
{
    use HasFactory, HasUuidPrimaryKey;

    protected $table = 'student_prayer_assessments';

    protected $fillable = [
        'id',
        'student_id',
        'prayer_item_id',
        'academic_year_id',
        'semester_id',
        'score',
        'grade',
        'is_passed',
        'paraf_by',
        'paraf_name',
        'paraf_at',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'is_passed' => 'boolean',
        'paraf_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function prayerItem()
    {
        return $this->belongsTo(PrayerAssessmentItem::class, 'prayer_item_id');
    }

    public function examiner()
    {
        return $this->belongsTo(User::class, 'paraf_by');
    }
}
