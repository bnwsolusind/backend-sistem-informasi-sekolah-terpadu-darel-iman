<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Employee;
use App\Models\Semester;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TataUsahaDashboardService
{
    public function getDashboardOverview($user, array $filters = []): array
    {
        $employee = Employee::where('user_id', $user->id)->first();
        $unitId = $employee ? $employee->unit_id : null;

        $activeAcademicYear = AcademicYear::where('is_active', true)->first() ?? AcademicYear::latest()->first();
        $activeSemester = Semester::where('is_active', true)->first() ?? Semester::latest()->first();

        $studentQuery = Student::query();
        $employeeQuery = Employee::query();

        if ($unitId) {
            $studentQuery->where('unit_id', $unitId);
            $employeeQuery->where('unit_id', $unitId);
        }

        $totalSiswa = (clone $studentQuery)->where('is_active', true)->count();
        $totalPegawai = (clone $employeeQuery)->count();

        // Incomplete student records
        $siswaIncomplete = (clone $studentQuery)->where(function ($q) {
            $q->whereNull('nisn')->orWhereNull('nik')->orWhereNull('birth_place');
        })->count();

        // Incomplete employee records
        $pegawaiIncomplete = (clone $employeeQuery)->where(function ($q) {
            $q->whereNull('niy')->orWhereNull('nik');
        })->count();

        $today = now()->toDateString();
        $absensiHariIni = 0;
        if (Schema::hasTable('attendances')) {
            $absensiHariIni = DB::table('attendances')->whereDate('attendance_date', $today)->count();
        }

        $kpis = [
            'total_siswa' => ['total' => $totalSiswa, 'growth' => 0],
            'total_pegawai' => ['total' => $totalPegawai, 'growth' => 0],
            'siswa_incomplete' => ['total' => $siswaIncomplete, 'growth' => 0],
            'pegawai_incomplete' => ['total' => $pegawaiIncomplete, 'growth' => 0],
            'absensi_hari_ini' => ['total' => $absensiHariIni, 'growth' => 0],
        ];

        return [
            'context' => [
                'role' => 'Tata Usaha',
                'tahun_ajaran' => $activeAcademicYear ? ['id' => $activeAcademicYear->id, 'nama' => $activeAcademicYear->year_name ?? $activeAcademicYear->nama] : null,
                'semester' => $activeSemester ? ['id' => $activeSemester->id, 'nama' => $activeSemester->name ?? $activeSemester->nama] : null,
            ],
            'kpis' => $kpis,
            'charts' => [],
            'tables' => [],
        ];
    }
}
