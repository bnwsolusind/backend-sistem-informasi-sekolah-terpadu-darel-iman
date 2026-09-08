<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EducationProgramSetting extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['education_unit_id', 'class_id', 'program_type', 'school_weekdays', 'is_active', 'effective_from', 'effective_until', 'metadata', 'created_by', 'updated_by'];
    protected $casts = ['school_weekdays' => 'array', 'is_active' => 'boolean', 'effective_from' => 'date', 'effective_until' => 'date', 'metadata' => 'array'];

    public function educationUnit() { return $this->belongsTo(EducationUnit::class); }
    public function kelas() { return $this->belongsTo(Kelas::class, 'class_id'); }
}

