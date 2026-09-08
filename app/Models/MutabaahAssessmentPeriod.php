<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MutabaahAssessmentPeriod extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['name', 'period_type', 'scope', 'education_unit_id', 'class_id', 'academic_year_id', 'semester_id', 'template_id', 'start_date', 'end_date', 'priority', 'is_active', 'configuration', 'created_by', 'updated_by'];
    protected $casts = ['start_date' => 'date', 'end_date' => 'date', 'priority' => 'integer', 'is_active' => 'boolean', 'configuration' => 'array'];

    public function educationUnit() { return $this->belongsTo(EducationUnit::class); }
    public function kelas() { return $this->belongsTo(Kelas::class, 'class_id'); }
    public function template() { return $this->belongsTo(MutabaahTemplate::class); }
    public function rules() { return $this->hasMany(MutabaahInputRule::class, 'assessment_period_id'); }
}

