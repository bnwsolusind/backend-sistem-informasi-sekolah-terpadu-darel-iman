<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\AssessmentFormulaRequest;
use App\Models\AcademicYear;
use App\Models\AssessmentFormula;
use App\Models\EducationUnit;
use App\Models\Kelas;
use App\Models\Semester;
use App\Services\AssessmentFormulaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentFormulaController extends Controller
{
    public function __construct(private readonly AssessmentFormulaService $service) {}

    public function index(Request $request): JsonResponse
    {
        $query = $this->service->scopedQuery($request->user())
            ->with(['educationUnit:id,name,code', 'kelas:id,nama_kelas,unit_pendidikan_id', 'academicYear:id,name', 'semester:id,name', 'creator:id,name', 'approver:id,name']);
        foreach (['type', 'status', 'academic_year_id', 'semester_id', 'education_unit_id'] as $filter) {
            if ($request->filled($filter)) $query->where($filter, $request->query($filter));
        }
        if ($request->filled('search')) $query->where('name', 'like', '%'.$request->query('search').'%');

        return response()->json(['success' => true, 'data' => $query->latest()->paginate(min((int) $request->query('per_page', 15), 50))]);
    }

    public function store(AssessmentFormulaRequest $request): JsonResponse
    {
        $formula = $this->service->save($request->user(), $request->validated());
        return response()->json(['success' => true, 'message' => 'Draft rumus berhasil dibuat.', 'data' => $formula], 201);
    }

    public function update(AssessmentFormulaRequest $request, string $id): JsonResponse
    {
        $formula = $this->service->scopedQuery($request->user())->findOrFail($id);
        abort_unless($request->user()->can('assessment_formula.update'), 403);
        return response()->json(['success' => true, 'message' => 'Draft rumus berhasil diperbarui.', 'data' => $this->service->save($request->user(), $request->validated(), $formula)]);
    }

    public function transition(Request $request, string $id, string $action): JsonResponse
    {
        abort_unless(in_array($action, ['submit', 'approve', 'activate', 'archive'], true), 404);
        abort_unless($request->user()->can('assessment_formula.'.$action), 403);
        $formula = $this->service->scopedQuery($request->user())->findOrFail($id);
        $this->service->assertWritableScope($request->user(), $formula->toArray());
        $updated = $this->service->transition($request->user(), $formula, $action);
        return response()->json(['success' => true, 'message' => 'Status rumus berhasil diperbarui.', 'data' => $updated]);
    }

    public function options(Request $request): JsonResponse
    {
        $unitIds = $this->service->scopedQuery($request->user())->select('education_unit_id');
        $units = app(\App\Services\AccessScopeService::class)->accessibleEducationUnits($request->user())->orderBy('name')->get(['id', 'name', 'code']);
        return response()->json(['success' => true, 'data' => [
            'units' => $units,
            'classes' => Kelas::query()->whereIn('unit_pendidikan_id', $units->pluck('id'))->orderBy('nama_kelas')->get(['id', 'nama_kelas', 'unit_pendidikan_id']),
            'academic_years' => AcademicYear::query()->orderByDesc('start_date')->get(['id', 'name', 'is_active']),
            'semesters' => Semester::query()->orderBy('sequence')->get(['id', 'name', 'academic_year_id', 'is_active']),
            'component_catalog' => [
                'academic' => [['key'=>'assignment','label'=>'Tugas'],['key'=>'quiz','label'=>'Kuis/UH'],['key'=>'project','label'=>'Proyek'],['key'=>'midterm','label'=>'UTS/PTS'],['key'=>'final_exam','label'=>'UAS/PAS']],
                'tahfizh' => [['key'=>'hafalan','label'=>'Hafalan'],['key'=>'murajaah','label'=>'Murajaah'],['key'=>'tilawah','label'=>'Tilawah'],['key'=>'kelancaran','label'=>'Kelancaran'],['key'=>'tajwid','label'=>'Tajwid'],['key'=>'makhraj','label'=>'Makhraj'],['key'=>'adab','label'=>'Adab']],
                'mutabaah' => [['key'=>'achievement','label'=>'Ketercapaian'],['key'=>'consistency','label'=>'Konsistensi'],['key'=>'verification','label'=>'Verifikasi'],['key'=>'good','label'=>'Baik'],['key'=>'less','label'=>'Kurang'],['key'=>'not_done','label'=>'Belum Dikerjakan']],
            ],
        ]]);
    }
}
