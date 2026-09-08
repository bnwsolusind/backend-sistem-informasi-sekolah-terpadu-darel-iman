<?php

namespace App\Services;

use App\Models\EducationProgramSetting;
use App\Models\MutabaahAssessmentPeriod;
use App\Models\MutabaahDailyHeader;
use App\Models\MutabaahInputRule;
use App\Models\Student;
use Carbon\Carbon;

class MutabaahAssessmentService
{
    public function __construct(private readonly AssessmentFormulaService $formulas) {}

    public function program(Student $student, string $date): ?EducationProgramSetting
    {
        return EducationProgramSetting::query()->where('education_unit_id', $student->unit_id)
            ->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('effective_from')->orWhereDate('effective_from', '<=', $date))
            ->where(fn ($q) => $q->whereNull('effective_until')->orWhereDate('effective_until', '>=', $date))
            ->where(fn ($q) => $q->whereNull('class_id')->orWhere('class_id', $student->kelas_id))
            ->orderByRaw('CASE WHEN class_id IS NULL THEN 0 ELSE 1 END DESC')->latest()->first();
    }

    public function period(Student $student, string $date): ?MutabaahAssessmentPeriod
    {
        return MutabaahAssessmentPeriod::query()->where('is_active', true)
            ->whereDate('start_date', '<=', $date)->whereDate('end_date', '>=', $date)
            ->where(fn ($q) => $q->where('scope', 'global')->orWhere('education_unit_id', $student->unit_id))
            ->where(fn ($q) => $q->whereNull('class_id')->orWhere('class_id', $student->kelas_id))
            ->orderByRaw("CASE WHEN period_type = 'ramadan' THEN 1 ELSE 0 END DESC")
            ->orderByDesc('priority')->first();
    }

    public function parentRules(Student $student, string $date)
    {
        $program = $this->program($student, $date);
        $period = $this->period($student, $date);
        if (! $program) return collect();

        $weekday = Carbon::parse($date)->dayOfWeekIso;
        return MutabaahInputRule::query()->with('agendaItem')->where('is_active', true)
            ->where('program_type', $program->program_type)
            ->whereIn('input_source', ['parent', 'either'])
            ->where(fn ($q) => $q->whereNull('assessment_period_id')->when($period, fn ($x) => $x->orWhere('assessment_period_id', $period->id)))
            ->orderByRaw('CASE WHEN assessment_period_id IS NULL THEN 0 ELSE 1 END DESC')->orderByDesc('priority')->get()
            ->filter(fn ($rule) => empty($rule->weekdays) || in_array($weekday, $rule->weekdays, true))
            ->unique('agenda_item_id')->values();
    }

    public function recalculate(MutabaahDailyHeader $header): void
    {
        $details = $header->details()->with('templateItem')->get();
        $eligible = $details->filter(fn ($detail) => $detail->status_value?->value !== 'na');
        $points = ['good' => 1.0, 'less' => 0.5, 'not_done' => 0.0];
        $weightTotal = $eligible->sum(fn ($detail) => (float) ($detail->templateItem?->weight ?? 0));
        $weighted = $eligible->sum(fn ($detail) => ($points[$detail->status_value?->value] ?? 0) * (float) ($detail->templateItem?->weight ?? 0));
        $counts = $details->groupBy(fn ($detail) => $detail->status_value?->value)->map->count();
        $baseScore = $weightTotal > 0 ? round(($weighted / $weightTotal) * 100, 2) : null;
        $denominator = max(1, $eligible->count());
        $verified = $eligible->filter(fn ($detail) => in_array($detail->verification_status, ['not_required', 'verified'], true))->count();
        $formula = $header->academic_year_id ? $this->formulas->resolveActive(
            'mutabaah', $header->academic_year_id, $header->semester_id,
            $header->education_unit_id, $header->rombel_id
        ) : null;
        $score = $baseScore;
        if ($formula) {
            $historyAverage = MutabaahDailyHeader::where('student_id', $header->student_id)
                ->whereKeyNot($header->id)->whereDate('activity_date', '<=', $header->activity_date)
                ->whereNotNull('score')->latest('activity_date')->limit(30)->avg('score');
            $score = $this->formulas->calculate($formula, [
                'achievement' => $baseScore,
                'consistency' => $historyAverage === null ? $baseScore : (float) $historyAverage,
                'verification' => round(($verified / $denominator) * 100, 2),
                'good' => round(((int) ($counts['good'] ?? 0) / $denominator) * 100, 2),
                'less' => round(((int) ($counts['less'] ?? 0) / $denominator) * 100, 2),
                'not_done' => round(((int) ($counts['not_done'] ?? 0) / $denominator) * 100, 2),
            ]);
        }
        $header->update([
            'good_count' => (int) ($counts['good'] ?? 0), 'less_count' => (int) ($counts['less'] ?? 0),
            'not_done_count' => (int) ($counts['not_done'] ?? 0), 'na_count' => (int) ($counts['na'] ?? 0),
            'score' => $score,
        ]);
    }
}
