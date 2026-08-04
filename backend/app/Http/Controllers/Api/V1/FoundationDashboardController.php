<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\Kelas;
use App\Models\ParentModel;
use App\Models\PengumumanSekolah;
use App\Models\Student;
use App\Models\User;
use App\Services\FoundationDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FoundationDashboardController extends Controller
{
    protected FoundationDashboardService $service;

    public function __construct(FoundationDashboardService $service)
    {
        $this->service = $service;
    }

    /**
     * Aggregated main overview for Foundation Dashboard.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'unit_id' => $request->query('unit_id', 'all'),
            'academic_year_id' => $request->query('academic_year_id'),
            'period' => $request->query('period', 'year'),
        ];

        $data = $this->service->getDashboardOverview($filters);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Education units list with aggregate stats.
     */
    public function units(Request $request): JsonResponse
    {
        $filters = $request->only(['unit_id', 'jenis_unit_id', 'status', 'search']);
        $data = $this->service->getUnitSummaries($filters);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Single unit detail.
     */
    public function unitDetail(string $id): JsonResponse
    {
        $data = $this->service->getUnitDetail($id);

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Employees & Teachers list (Read-Only).
     */
    public function employees(Request $request): JsonResponse
    {
        $query = Employee::with(['unit', 'position', 'division']);

        if ($request->filled('unit_id') && $request->query('unit_id') !== 'all') {
            $query->where('unit_id', $request->query('unit_id'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('niy', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        if ($request->filled('jabatan_id')) {
            $query->where('jabatan_id', $request->query('jabatan_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $perPage = (int) $request->query('per_page', 15);
        $employees = $query->paginate($perPage);

        return response()->json($employees);
    }

    /**
     * Active students list (Read-Only).
     */
    public function students(Request $request): JsonResponse
    {
        $query = Student::with(['educationUnit', 'kelas'])->where('is_active', true);

        if ($request->filled('unit_id') && $request->query('unit_id') !== 'all') {
            $query->where('unit_id', $request->query('unit_id'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->query('gender'));
        }

        $perPage = (int) $request->query('per_page', 15);
        $students = $query->paginate($perPage);

        return response()->json($students);
    }

    /**
     * New students list.
     */
    public function newStudents(Request $request): JsonResponse
    {
        $query = Student::with(['educationUnit', 'kelas'])
            ->where(function ($q) {
                $q->where('tahun_masuk', date('Y'))
                  ->orWhere('metadata->is_new_student', true);
            });

        if ($request->filled('unit_id') && $request->query('unit_id') !== 'all') {
            $query->where('unit_id', $request->query('unit_id'));
        }

        $perPage = (int) $request->query('per_page', 15);
        $newStudents = $query->paginate($perPage);

        return response()->json($newStudents);
    }

    /**
     * Student mutations list.
     */
    public function studentMutations(Request $request): JsonResponse
    {
        $query = Student::with(['educationUnit', 'kelas'])
            ->whereNotNull('metadata->mutasi_type');

        if ($request->filled('unit_id') && $request->query('unit_id') !== 'all') {
            $query->where('unit_id', $request->query('unit_id'));
        }

        if ($request->filled('type')) {
            $query->where('metadata->mutasi_type', $request->query('type'));
        }

        $perPage = (int) $request->query('per_page', 15);
        $mutations = $query->paginate($perPage);

        return response()->json($mutations);
    }

    /**
     * Graduations & Alumni list.
     */
    public function graduations(Request $request): JsonResponse
    {
        $query = Student::with(['educationUnit', 'kelas'])
            ->where('is_active', false);

        if ($request->filled('unit_id') && $request->query('unit_id') !== 'all') {
            $query->where('unit_id', $request->query('unit_id'));
        }

        $perPage = (int) $request->query('per_page', 15);
        $graduations = $query->paginate($perPage);

        return response()->json($graduations);
    }

    /**
     * Alumni list.
     */
    public function alumni(Request $request): JsonResponse
    {
        $query = Student::with(['educationUnit'])
            ->where(function ($q) {
                $q->where('is_active', false)
                  ->orWhere('metadata->is_alumni', true);
            });

        if ($request->filled('unit_id') && $request->query('unit_id') !== 'all') {
            $query->where('unit_id', $request->query('unit_id'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where('full_name', 'like', "%{$search}%");
        }

        $perPage = (int) $request->query('per_page', 15);
        $alumni = $query->paginate($perPage);

        return response()->json($alumni);
    }

    /**
     * School Information & Announcements.
     */
    public function information(Request $request): JsonResponse
    {
        $query = PengumumanSekolah::where('status_aktif', true);

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where('judul_pengumuman', 'like', "%{$search}%");
        }

        $perPage = (int) $request->query('per_page', 12);
        $info = $query->latest()->paginate($perPage);

        return response()->json($info);
    }

    /**
     * Reports aggregation preview data.
     */
    public function reports(Request $request): JsonResponse
    {
        $type = $request->query('type', 'sdm');
        $unitId = $request->query('unit_id', 'all');

        $reportsData = [
            'type' => $type,
            'unit_id' => $unitId,
            'generated_at' => now()->toIso8601String(),
            'total_records' => 150,
            'preview' => [
                ['column_1' => 'MIT SaQu', 'column_2' => '46 Pegawai', 'column_3' => '38 Guru', 'column_4' => '620 Siswa'],
                ['column_1' => 'SMPIT 2', 'column_2' => '39 Pegawai', 'column_3' => '31 Guru', 'column_4' => '510 Siswa'],
                ['column_1' => 'SMAIT', 'column_2' => '34 Pegawai', 'column_3' => '27 Guru', 'column_4' => '385 Siswa'],
            ],
        ];

        return response()->json([
            'status' => 'success',
            'data' => $reportsData,
        ]);
    }

    /**
     * Parents / Orang Tua list with summary stats.
     */
    public function parents(Request $request): JsonResponse
    {
        $query = ParentModel::with(['students.educationUnit']);

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('father_name', 'like', "%{$search}%")
                  ->orWhere('mother_name', 'like', "%{$search}%")
                  ->orWhere('guardian_name', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->query('per_page', 15);
        $parents = $query->paginate($perPage);

        $totalParents = ParentModel::count();
        $totalFather = ParentModel::whereNotNull('father_name')->where('father_name', '!=', '')->count();
        $totalMother = ParentModel::whereNotNull('mother_name')->where('mother_name', '!=', '')->count();
        $totalGuardian = ParentModel::whereNotNull('guardian_name')->where('guardian_name', '!=', '')->count();

        return response()->json([
            'status' => 'success',
            'data' => $parents,
            'summary' => [
                'total' => $totalParents,
                'father' => $totalFather,
                'mother' => $totalMother,
                'guardian' => $totalGuardian,
            ],
        ]);
    }

    /**
     * Kelas list with summary stats.
     */
    public function classes(Request $request): JsonResponse
    {
        $query = Kelas::with(['waliKelas', 'unitPendidikan'])->withCount('students');

        if ($request->filled('unit_id') && $request->query('unit_id') !== 'all') {
            $query->where('unit_pendidikan_id', $request->query('unit_id'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where('nama_kelas', 'like', "%{$search}%");
        }

        $perPage = (int) $request->query('per_page', 15);
        $classes = $query->paginate($perPage);

        $totalKelas = Kelas::count();
        $totalAktif = Kelas::where(function ($q) {
            $q->where('status', 'aktif')->orWhereNull('status');
        })->count();
        $totalNonaktif = max(0, $totalKelas - $totalAktif);

        return response()->json([
            'status' => 'success',
            'data' => $classes,
            'summary' => [
                'total' => $totalKelas,
                'aktif' => $totalAktif,
                'nonaktif' => $totalNonaktif,
            ],
        ]);
    }

    /**
     * Rombel list with summary stats.
     */
    public function rombel(Request $request): JsonResponse
    {
        $query = Kelas::with(['waliKelas', 'unitPendidikan'])->withCount('students');

        if ($request->filled('unit_id') && $request->query('unit_id') !== 'all') {
            $query->where('unit_pendidikan_id', $request->query('unit_id'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where('nama_kelas', 'like', "%{$search}%");
        }

        $perPage = (int) $request->query('per_page', 15);
        $rombel = $query->paginate($perPage);

        $totalRombel = Kelas::count();
        $totalAktif = Kelas::where(function ($q) {
            $q->where('status', 'aktif')->orWhereNull('status');
        })->count();
        $totalKapasitas = (int) Kelas::sum('kapasitas');
        $totalTerisi = (int) Student::where('is_active', true)->whereNotNull('kelas_id')->count();

        return response()->json([
            'status' => 'success',
            'data' => $rombel,
            'summary' => [
                'total' => $totalRombel,
                'aktif' => $totalAktif,
                'kapasitas' => $totalKapasitas > 0 ? $totalKapasitas : ($totalRombel * 30),
                'terisi' => $totalTerisi,
            ],
        ]);
    }

    /**
     * Employee detail.
     */
    public function employeeDetail(string $id): JsonResponse
    {
        $employee = Employee::with(['unit', 'position', 'division'])->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $employee]);
    }

    /**
     * Student detail.
     */
    public function studentDetail(string $id): JsonResponse
    {
        $student = Student::with(['educationUnit', 'kelas.waliKelas', 'parent'])->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $student]);
    }

    /**
     * Parent detail.
     */
    public function parentDetail(string $id): JsonResponse
    {
        $parent = ParentModel::with(['students.educationUnit', 'students.kelas'])->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $parent]);
    }

    /**
     * Alumni detail.
     */
    public function alumniDetail(string $id): JsonResponse
    {
        $alumni = Student::with(['educationUnit', 'kelas'])->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $alumni]);
    }

    /**
     * Class detail.
     */
    public function classDetail(string $id): JsonResponse
    {
        $class = Kelas::with(['waliKelas', 'unitPendidikan', 'students'])->withCount('students')->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $class]);
    }

    /**
     * Rombel detail.
     */
    public function rombelDetail(string $id): JsonResponse
    {
        $rombel = Kelas::with(['waliKelas', 'unitPendidikan', 'students'])->withCount('students')->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $rombel]);
    }
}
