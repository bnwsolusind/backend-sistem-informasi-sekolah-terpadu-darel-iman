<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\EducationProgramSetting;
use App\Models\EducationUnit;
use App\Models\Kelas;
use App\Models\MutabaahAgendaItem;
use App\Models\MutabaahAssessmentPeriod;
use App\Models\MutabaahInputRule;
use App\Models\MutabaahTemplate;
use App\Models\Semester;
use App\Services\AccessScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WorshipAssessmentSettingController extends Controller
{
    public function __construct(private readonly AccessScopeService $scope) {}

    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('worship_assessment.setting.view'), 403);
        $unitIds = $this->scope->accessibleEducationUnits($request->user())->pluck('id');
        $wide = $this->scope->hasGlobalScope($request->user());

        return response()->json(['data' => [
            'programs' => EducationProgramSetting::with(['educationUnit:id,name', 'kelas:id,nama_kelas'])->when(! $wide, fn ($q) => $q->whereIn('education_unit_id', $unitIds))->latest()->get(),
            'periods' => MutabaahAssessmentPeriod::with(['educationUnit:id,name', 'kelas:id,nama_kelas', 'template:id,name'])->when(! $wide, fn ($q) => $q->whereIn('education_unit_id', $unitIds))->latest('start_date')->get(),
            'rules' => MutabaahInputRule::with(['agendaItem:id,code,name', 'period:id,name,period_type'])->latest('priority')->get(),
        ]]);
    }

    public function options(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('worship_assessment.setting.view'), 403);
        $units = $this->scope->accessibleEducationUnits($request->user())->orderBy('name')->get(['id', 'name']);
        return response()->json(['data' => [
            'units' => $units,
            'classes' => Kelas::whereIn('unit_pendidikan_id', $units->pluck('id'))->orderBy('nama_kelas')->get(['id', 'nama_kelas', 'unit_pendidikan_id']),
            'academic_years' => AcademicYear::latest('start_date')->get(['id', 'name', 'is_active']),
            'semesters' => Semester::get(['id', 'name', 'academic_year_id', 'is_active']),
            'templates' => MutabaahTemplate::orderBy('name')->get(['id', 'name', 'education_unit_id']),
            'agenda_items' => MutabaahAgendaItem::active()->orderBy('sort_order')->get(['id', 'code', 'name']),
        ]]);
    }

    public function storeProgram(Request $request): JsonResponse
    {
        $this->manage($request);
        $data = $request->validate([
            'education_unit_id' => ['required', 'uuid', 'exists:education_units,id'], 'class_id' => ['nullable', 'uuid', 'exists:tbl_kelas,id'],
            'program_type' => ['required', Rule::in(['regular', 'fullday', 'boarding', 'tahfizh'])],
            'school_weekdays' => ['required', 'array', 'min:1'], 'school_weekdays.*' => ['integer', 'between:1,7'],
            'effective_from' => ['nullable', 'date'], 'effective_until' => ['nullable', 'date', 'after_or_equal:effective_from'], 'is_active' => ['boolean'],
        ]);
        $this->assertUnit($request, $data['education_unit_id'], $data['class_id'] ?? null);
        $data += ['created_by' => $request->user()->id, 'updated_by' => $request->user()->id];
        return response()->json(['data' => EducationProgramSetting::create($data)], 201);
    }

    public function storePeriod(Request $request): JsonResponse
    {
        $this->manage($request);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'], 'period_type' => ['required', Rule::in(['regular', 'ramadan'])],
            'scope' => ['required', Rule::in(['global', 'unit', 'class'])], 'education_unit_id' => ['nullable', 'uuid', 'exists:education_units,id'],
            'class_id' => ['nullable', 'uuid', 'exists:tbl_kelas,id'], 'academic_year_id' => ['required', 'uuid', 'exists:academic_years,id'],
            'semester_id' => ['nullable', 'uuid', 'exists:semesters,id'], 'template_id' => ['nullable', 'uuid', 'exists:mutabaah_templates,id'],
            'start_date' => ['required', 'date'], 'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'priority' => ['nullable', 'integer', 'min:0'], 'configuration' => ['nullable', 'array'], 'is_active' => ['boolean'],
        ]);
        if ($data['scope'] !== 'global') $this->assertUnit($request, $data['education_unit_id'] ?? '', $data['class_id'] ?? null);
        else abort_unless($this->scope->hasGlobalScope($request->user()), 403);
        $data += ['created_by' => $request->user()->id, 'updated_by' => $request->user()->id];
        return response()->json(['data' => MutabaahAssessmentPeriod::create($data)], 201);
    }

    public function storeRule(Request $request): JsonResponse
    {
        $this->manage($request);
        $data = $request->validate([
            'assessment_period_id' => ['nullable', 'uuid', 'exists:mutabaah_assessment_periods,id'],
            'agenda_item_id' => ['required', 'uuid', 'exists:mutabaah_agenda_items,id'],
            'program_type' => ['required', Rule::in(['regular', 'fullday', 'boarding', 'tahfizh'])],
            'input_source' => ['required', Rule::in(['school', 'parent', 'either', 'student', 'supervisor'])],
            'location' => ['required', Rule::in(['school', 'home', 'any'])], 'weekdays' => ['nullable', 'array'],
            'weekdays.*' => ['integer', 'between:1,7'], 'school_day_only' => ['boolean'], 'requires_verification' => ['boolean'],
            'priority' => ['nullable', 'integer', 'min:0'], 'is_active' => ['boolean'],
        ]);
        $data += ['created_by' => $request->user()->id, 'updated_by' => $request->user()->id];
        return response()->json(['data' => MutabaahInputRule::create($data)], 201);
    }

    public function destroyProgram(Request $request, string $id): JsonResponse
    {
        $this->manage($request);
        $program = EducationProgramSetting::findOrFail($id);
        $this->assertUnit($request, $program->education_unit_id, $program->class_id);
        $program->delete();
        return response()->json(['message' => 'Program berhasil dihapus.']);
    }

    public function destroyPeriod(Request $request, string $id): JsonResponse
    {
        $this->manage($request);
        $period = MutabaahAssessmentPeriod::findOrFail($id);
        if ($period->scope !== 'global') {
            $this->assertUnit($request, $period->education_unit_id ?? '', $period->class_id);
        } else {
            abort_unless($this->scope->hasGlobalScope($request->user()), 403);
        }
        $period->delete();
        return response()->json(['message' => 'Periode berhasil dihapus.']);
    }

    public function destroyRule(Request $request, string $id): JsonResponse
    {
        $this->manage($request);
        $rule = MutabaahInputRule::findOrFail($id);
        $rule->delete();
        return response()->json(['message' => 'Aturan berhasil dihapus.']);
    }

    private function manage(Request $request): void { abort_unless($request->user()->can('worship_assessment.setting.manage'), 403); }
    private function assertUnit(Request $request, string $unitId, ?string $classId): void
    {
        abort_unless($this->scope->accessibleEducationUnits($request->user())->whereKey($unitId)->exists(), 403);
        if ($classId) abort_unless(Kelas::whereKey($classId)->where('unit_pendidikan_id', $unitId)->exists(), 422, 'Kelas tidak sesuai unit.');
    }
}
