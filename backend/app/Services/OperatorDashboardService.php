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

        $totalSiswa = Student::count();
        $totalPegawai = Employee::count();

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
