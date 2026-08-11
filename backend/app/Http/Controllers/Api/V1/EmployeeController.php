<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Services\AccessScopeService;
use App\Services\EmployeeService;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(
        EmployeeService $employeeService,
        protected AccessScopeService $accessScopeService
    ) {
        $this->employeeService = $employeeService;
    }

    public function dashboard()
    {
        $stats = $this->employeeService->getDashboardStats();

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'unit_id', 'jabatan_id', 'status_pegawai', 'status', 'jenis_kelamin']);
        $filters['allowed_unit_ids'] = $this->accessScopeService
            ->accessibleEmployees($request->user())
            ->select('unit_id')
            ->distinct()
            ->pluck('unit_id')
            ->all();
        $perPage = (int) $request->get('per_page', 15);

        $result = $this->employeeService->list($filters, $perPage);

        return response()->json($result);
    }

    public function show(Request $request, string $id)
    {
        $employee = $this->accessScopeService
            ->accessibleEmployees($request->user())
            ->whereKey($id)
            ->first();

        if (! $employee) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data pegawai tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $employee,
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();
        $this->assertUnitScope($request, $data['unit_id'] ?? null);
        $employee = $this->employeeService->create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Pegawai berhasil ditambahkan',
            'data' => $employee,
        ], 201);
    }

    public function update(UpdateEmployeeRequest $request, string $id)
    {
        $this->scopedEmployee($request, $id);
        $data = $request->validated();
        $this->assertUnitScope($request, $data['unit_id'] ?? null);
        $employee = $this->employeeService->update($id, $data);

        return response()->json([
            'status' => 'success',
            'message' => 'Data pegawai berhasil diperbarui',
            'data' => $employee,
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $this->scopedEmployee($request, $id);
        $this->employeeService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Pegawai berhasil dihapus',
        ]);
    }

    public function positions()
    {
        $positions = $this->employeeService->getPositions();

        return response()->json([
            'status' => 'success',
            'data' => $positions,
        ]);
    }

    public function assignTeaching(Request $request, string $id)
    {
        $this->scopedEmployee($request, $id);
        $request->validate([
            'teachings' => 'required|array',
            'teachings.*.classroom_id' => 'nullable|uuid',
            'teachings.*.subject_id' => 'nullable|uuid',
            'teachings.*.academic_year_id' => 'nullable|uuid',
            'teachings.*.semester_id' => 'nullable|uuid',
            'teachings.*.aktif' => 'nullable|boolean',
        ]);

        $res = $this->employeeService->assignTeaching($id, $request->get('teachings'));

        return response()->json([
            'status' => 'success',
            'message' => 'Penugasan mengajar berhasil diperbarui',
            'data' => $res,
        ]);
    }

    public function import(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Proses import data pegawai berhasil dilakukan',
        ]);
    }

    public function export(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Data pegawai berhasil diexport',
        ]);
    }

    private function scopedEmployee(Request $request, string $id): Employee
    {
        return $this->accessScopeService
            ->accessibleEmployees($request->user())
            ->whereKey($id)
            ->firstOrFail();
    }

    private function assertUnitScope(Request $request, ?string $unitId): void
    {
        if (! $unitId) {
            return;
        }

        abort_unless(
            $this->accessScopeService->accessibleEducationUnits($request->user())->whereKey($unitId)->exists(),
            403,
            'Unit pegawai berada di luar cakupan akun.'
        );
    }
}
