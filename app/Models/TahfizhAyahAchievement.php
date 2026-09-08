<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TahfizhAyahAchievement extends Model
{
    use HasUuids;

    protected $fillable = ['student_id', 'academic_year_id', 'semester_id', 'class_id', 'source_log_id', 'surah_number', 'ayah_number', 'juz_number', 'status', 'validated_by', 'validated_at', 'metadata'];
    protected $casts = ['surah_number' => 'integer', 'ayah_number' => 'integer', 'juz_number' => 'integer', 'validated_at' => 'datetime', 'metadata' => 'array'];

    public function student() { return $this->belongsTo(Student::class); }
    public function sourceLog() { return $this->belongsTo(TahfizhDailyLog::class, 'source_log_id'); }
}

