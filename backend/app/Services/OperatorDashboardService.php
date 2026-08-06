<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Employee;
use App\Models\Semester;
use App\Models\Student;

class OperatorDashboardService
{
    public function getDashboardOverview($user, array $filters = []): array
    {
        $activeAcademicYear = AcademicYear::where('is_active', true)->first() ?? AcademicYear::latest()->first();
        $activeSemester = Semester::where('is_active', true)->first() ?? Semester::latest()->first();

        // Operator melekat pada unit via data Employee; bila ada unit, scope data ke unit tsb.
        $employee = Employee::where('user_id', $user->id)->first();
        $unitId = $employee ? $employee->unit_id : null;

        $studentQuery = Student::query();
        $employeeQuery = Employee::query();
        if ($unitId) {
            $studentQuery->where('unit_id', $unitId);
            $employeeQuery->where('unit_id', $unitId);
        }

        $totalSiswa = $studentQuery->count();
        $totalPegawai = $employeeQuery->count();

        $kpis = [
            'data_siswa' => ['total' => $totalSiswa, 'growth' => 0],
            'data_pegawai' => ['total' => $totalPegawai, 'growth' => 0],
        ];

        return [
            'context' => [
                'role' => 'Operator Sekolah',
                'tahun_ajaran' => $activeAcademicYear ? ['id' => $activeAcademicYear->id, 'nama' => $activeAcademicYear->year_name ?? $activeAcademicYear->nama] : null,
                'semester' => $activeSemester ? ['id' => $activeSemester->id, 'nama' => $activeSemester->name ?? $activeSemester->nama] : null,
            ],
            'kpis' => $kpis,
            'charts' => [],
            'tables' => [],
        ];
    }
}
