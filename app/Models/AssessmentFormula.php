<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssessmentFormula extends Model
{
    use HasFactory, HasUuidPrimaryKey, SoftDeletes;

    protected $fillable = [
        'name', 'type', 'scope', 'education_unit_id', 'class_id', 'academic_year_id',
        'semester_id', 'components', 'minimum_score', 'rounding_precision', 'status',
        'version', 'effective_from', 'effective_until', 'created_by', 'updated_by',
        'approved_by', 'activated_by', 'approved_at', 'activated_at', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'components' => 'array', 'metadata' => 'array', 'minimum_score' => 'float',
            'rounding_precision' => 'integer', 'version' => 'integer',
            'effective_from' => 'date', 'effective_until' => 'date',
            'approved_at' => 'datetime', 'activated_at' => 'datetime',
        ];
    }

    public function educationUnit() { return $this->belongsTo(EducationUnit::class); }
    public function kelas() { return $this->belongsTo(Kelas::class, 'class_id'); }
    public function academicYear() { return $this->belongsTo(AcademicYear::class); }
    public function semester() { return $this->belongsTo(Semester::class); }
    public function creator() { return $this->belongsTo(User::class, 'created_by'); }
    public function approver() { return $this->belongsTo(User::class, 'approved_by'); }
}
