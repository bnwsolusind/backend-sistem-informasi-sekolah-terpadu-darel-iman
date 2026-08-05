<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DivisiPendidikanDashboardService
{
    public function getDashboardOverview(array $filters = []): array
    {
        $unitQuery = EducationUnit::query();
        if (! empty($filters['unit_id']) && $filters['unit_id'] !== 'all') {
            $unitQuery->where('id', $filters['unit_id']);
        }
        $units = $unitQuery->get();
        $unitIds = $units->pluck('id')->toArray();

        $activeAcademicYear = AcademicYear::where('is_active', true)->first() ?? AcademicYear::latest()->first();
        $activeSemester = Semester::where('is_active', true)->first() ?? Semester::latest()->first();

        // Multi-unit aggregates for Division
        $totalUnitsMonitored = count($unitIds);
        $totalSiswa = Student::whereIn('unit_id', $unitIds)->where('is_active', true)->count();
        $totalGuru = Employee::whereIn('unit_id', $unitIds)->where(function ($q) {
            $q->where('status_pegawai', 'like', '%Guru%')
              ->orWhereHas('position', function ($p) {
                  $p->where('nama_jabatan', 'like', '%Guru%');
              });
        })->count();

        // Monthly reports count
        $laporanBulananMasuk = 0;
        $laporanBulananBelum = 0;
        if (Schema::hasTable('laporan_bulanans')) {
            $laporanBulananMasuk = DB::table('laporan_bulanans')->whereIn('unit_id', $unitIds)->where('status', 'disetujui')->count();
            $laporanBulananBelum = DB::table('laporan_bulanans')->whereIn('unit_id', $unitIds)->where('status', '!=', 'disetujui')->count();
        }

        // Student achievement records
        $totalPrestasi = 0;
        if (Schema::hasTable('rekap_prestasi_siswas')) {
            $totalPrestasi = DB::table('rekap_prestasi_siswas')->whereIn('unit_id', $unitIds)->count();
        }

        $kpis = [
            'unit_monitored' => ['total' => $totalUnitsMonitored, 'growth' => 0],
            'total_siswa' => ['total' => $totalSiswa, 'growth' => 0],
            'total_guru' => ['total' => $totalGuru, 'growth' => 0],
            'laporan_bulanan_masuk' => ['total' => $laporanBulananMasuk, 'growth' => 0],
            'laporan_bulanan_belum' => ['total' => $laporanBulananBelum, 'growth' => 0],
            'total_prestasi' => ['total' => $totalPrestasi, 'growth' => 0],
        ];

        // Comparison chart data per unit
        $unitComparison = EducationUnit::withCount(['students', 'employees'])
            ->whereIn('id', $unitIds)
            ->get()
            ->map(function ($u) {
                return [
                    'name' => $u->name ?? $u->nama,
                    'siswa' => $u->students_count,
                    'pegawai' => $u->employees_count,
                ];
            });

        return [
            'context' => [
                'role' => 'Divisi Pendidikan',
                'tahun_ajaran' => $activeAcademicYear ? ['id' => $activeAcademicYear->id, 'nama' => $activeAcademicYear->year_name ?? $activeAcademicYear->nama] : null,
                'semester' => $activeSemester ? ['id' => $activeSemester->id, 'nama' => $activeSemester->name ?? $activeSemester->nama] : null,
            ],
            'kpis' => $kpis,
            'charts' => [
                'unit_comparison' => $unitComparison,
            ],
            'tables' => [],
        ];
    }
}
