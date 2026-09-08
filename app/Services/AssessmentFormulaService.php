<?php

namespace App\Services;

use App\Models\AssessmentFormula;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AssessmentFormulaService
{
    public function __construct(private readonly AccessScopeService $accessScope) {}

    public function scopedQuery(User $user): Builder
    {
        $query = AssessmentFormula::query();
        if ($this->accessScope->hasGlobalScope($user)) return $query;

        $unitIds = $this->accessScope->accessibleEducationUnits($user)->select('education_units.id');
        return $query->where(function (Builder $scope) use ($unitIds) {
            $scope->where('scope', 'global')->orWhereIn('education_unit_id', $unitIds);
        });
    }

    public function assertWritableScope(User $user, array $data): void
    {
        if (($data['scope'] ?? 'global') === 'global') {
            abort_unless($this->accessScope->hasGlobalScope($user), 403, 'Rumus global hanya dapat dikelola oleh pengelola yayasan.');
            return;
        }
        $unitId = $data['education_unit_id'] ?? null;
        abort_unless($unitId && $this->accessScope->accessibleEducationUnits($user)->whereKey($unitId)->exists(), 403, 'Unit pendidikan berada di luar cakupan akun.');
        if (($data['scope'] ?? null) === 'class') {
            abort_unless(Kelas::query()->whereKey($data['class_id'] ?? null)->where('unit_pendidikan_id', $unitId)->exists(), 422, 'Kelas tidak berada pada unit pendidikan yang dipilih.');
        }
    }

    public function save(User $user, array $data, ?AssessmentFormula $formula = null): AssessmentFormula
    {
        $this->assertWritableScope($user, $data);
        abort_if($formula && in_array($formula->status, ['active', 'archived'], true), 422, 'Rumus aktif atau arsip tidak dapat diubah. Buat versi baru.');

        return DB::transaction(function () use ($user, $data, $formula) {
            $data['updated_by'] = $user->id;
            if (! $formula) {
                $data['created_by'] = $user->id;
                $data['status'] = 'draft';
                $formula = AssessmentFormula::create($data);
            } else {
                $formula->update($data);
            }
            return $formula->fresh(['educationUnit', 'kelas', 'academicYear', 'semester', 'creator', 'approver']);
        });
    }

    public function transition(User $user, AssessmentFormula $formula, string $action): AssessmentFormula
    {
        $map = [
            'submit' => ['from' => ['draft'], 'to' => 'submitted'],
            'approve' => ['from' => ['submitted'], 'to' => 'approved'],
            'activate' => ['from' => ['approved'], 'to' => 'active'],
            'archive' => ['from' => ['active'], 'to' => 'archived'],
        ];
        $rule = $map[$action] ?? abort(404);
        abort_unless(in_array($formula->status, $rule['from'], true), 422, 'Transisi status rumus tidak valid.');

        return DB::transaction(function () use ($user, $formula, $action, $rule) {
            if ($action === 'activate') {
                AssessmentFormula::query()
                    ->whereKeyNot($formula->id)->where('type', $formula->type)
                    ->where('scope', $formula->scope)->where('academic_year_id', $formula->academic_year_id)
                    ->where('semester_id', $formula->semester_id)->where('education_unit_id', $formula->education_unit_id)
                    ->where('class_id', $formula->class_id)->where('status', 'active')
                    ->update(['status' => 'archived', 'updated_by' => $user->id]);
            }
            $changes = ['status' => $rule['to'], 'updated_by' => $user->id];
            if ($action === 'approve') $changes += ['approved_by' => $user->id, 'approved_at' => now()];
            if ($action === 'activate') $changes += ['activated_by' => $user->id, 'activated_at' => now()];
            $formula->update($changes);
            return $formula->fresh(['educationUnit', 'kelas', 'academicYear', 'semester', 'creator', 'approver']);
        });
    }

    public function resolveActive(string $type, string $academicYearId, ?string $semesterId, ?string $unitId, ?string $classId): ?AssessmentFormula
    {
        $base = AssessmentFormula::query()->where('type', $type)->where('status', 'active')
            ->where('academic_year_id', $academicYearId)
            ->where(fn (Builder $q) => $q->whereNull('semester_id')->when($semesterId, fn (Builder $x, string $id) => $x->orWhere('semester_id', $id)))
            ->where(fn (Builder $q) => $q->whereNull('effective_from')->orWhereDate('effective_from', '<=', today()))
            ->where(fn (Builder $q) => $q->whereNull('effective_until')->orWhereDate('effective_until', '>=', today()));

        if ($classId) {
            $formula = (clone $base)->where('scope', 'class')->where('class_id', $classId)->latest('version')->first();
            if ($formula) return $formula;
        }
        if ($unitId) {
            $formula = (clone $base)->where('scope', 'unit')->where('education_unit_id', $unitId)->latest('version')->first();
            if ($formula) return $formula;
        }
        return (clone $base)->where('scope', 'global')->latest('version')->first();
    }

    public function calculate(AssessmentFormula $formula, array $values): float
    {
        $missing = collect($formula->components)
            ->filter(fn (array $component) => (float) ($component['weight'] ?? 0) > 0)
            ->pluck('key')->filter(fn (string $key) => ! is_numeric($values[$key] ?? null))->values();
        if ($missing->isNotEmpty()) {
            throw ValidationException::withMessages(['components' => ['Komponen nilai belum lengkap: '.$missing->join(', ').'.']]);
        }
        $score = collect($formula->components)->sum(function (array $component) use ($values) {
            return (float) ($values[$component['key']] ?? 0) * ((float) ($component['weight'] ?? 0) / 100);
        });
        return round($score, $formula->rounding_precision);
    }
}
