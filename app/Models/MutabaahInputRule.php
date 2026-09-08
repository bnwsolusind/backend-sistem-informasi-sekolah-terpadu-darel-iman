<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MutabaahInputRule extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['assessment_period_id', 'agenda_item_id', 'program_type', 'input_source', 'location', 'weekdays', 'school_day_only', 'requires_verification', 'priority', 'is_active', 'metadata', 'created_by', 'updated_by'];
    protected $casts = ['weekdays' => 'array', 'school_day_only' => 'boolean', 'requires_verification' => 'boolean', 'priority' => 'integer', 'is_active' => 'boolean', 'metadata' => 'array'];

    public function period() { return $this->belongsTo(MutabaahAssessmentPeriod::class, 'assessment_period_id'); }
    public function agendaItem() { return $this->belongsTo(MutabaahAgendaItem::class); }
}

