<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\Kelas;
use App\Models\PengumumanSekolah;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class KepalaSekolahDashboardService
{
    public function getDashboardData($user, array $filters = []): array
    {
        // Determine unit_id for Principal
        $employee = Employee::where('user_id', $user->id)->first();
        $unitId = $employee ? $employee->unit_id : null;

        if (! $unitId && ! empty($filters['unit_id'])) {
            $unitId = $filters['unit_id'];
        }

        // Active unit info
        $unit = $unitId ? EducationUnit::find($unitId) : EducationUnit::first();
        $targetUnitId = $unit ? $unit->id : null;

        // Context
        $activeAcademicYear = AcademicYear::where('is_active', true)->first() ?? AcademicYear::latest()->first();
        $activeSemester = Semester::where('is_active', true)->first() ?? Semester::latest()->first();

        // 1. KPIs scoped to Principal's unit
        $studentQuery = Student::query();
        $employeeQuery = Employee::query();
        $teacherQuery = Teacher::query();
        $classQuery = Kelas::query();

        if ($targetUnitId) {
            $studentQuery->where('unit_id', $targetUnitId);
            $employeeQuery->where('unit_id', $targetUnitId);
            $classQuery->where('unit_pendidikan_id', $targetUnitId);
        }

        $totalSiswa = (clone $studentQuery)->where('is_active', true)->count();
        $like = DB::getDriverName() === 'pgsql' ? 'ILIKE' : 'LIKE';
        $totalGuru = (clone $employeeQuery)->where(function ($q) use ($like) {
            $q->whereHas('teacher')
              ->orWhereHas('teachings')
              ->orWhere('status_pegawai', $like, '%Guru%')
              ->orWhereHas('position', function ($p) use ($like) {
                  $p->where('name', $like, '%Guru%')
                    ->orWhere('name', $like, '%Pendidik%');
              });
        })->count();

        $totalPegawai = (clone $employeeQuery)->count();
        $totalKelas = (clone $classQuery)->count();

        $totalRombel = Schema::hasTable('rombels') && $targetUnitId
            ? DB::table('rombels')->where('unit_id', $targetUnitId)->count()
            : $totalKelas;

        // Attendance today
        $today = now()->toDateString();
        $hadirHariIni = 0;
        $terlambat = 0;
        $izin = 0;
        $sakit = 0;
        $alpha = 0;

        if (Schema::hasTable('attendances')) {
            $attQuery = DB::table('attendances')->whereDate('attendance_date', $today);
            if ($targetUnitId) {
                $attQuery->whereIn('student_id', (clone $studentQuery)->pluck('id'));
            }
            $hadirHariIni = (clone $attQuery)->whereIn('status', ['present', 'hadir'])->count();
            $terlambat = (clone $attQuery)->where('status', 'late')->count();
            $izin = (clone $attQuery)->whereIn('status', ['permission', 'izin'])->count();
            $sakit = (clone $attQuery)->whereIn('status', ['sick', 'sakit'])->count();
            $alpha = (clone $attQuery)->whereIn('status', ['absent', 'alpha'])->count();
        }

        // Tahfizh setoran hari ini
        $setoranTahfizhHariIni = 0;
        if (Schema::hasTable('tahfizh_records')) {
            $tQuery = DB::table('tahfizh_records')->whereDate('record_date', $today);
            if ($targetUnitId) {
                $tQuery->whereIn('student_id', (clone $studentQuery)->pluck('id'));
            }
            $setoranTahfizhHariIni = $tQuery->count();
        }

        $kpis = [
            'total_siswa' => ['total' => $totalSiswa, 'growth' => 0],
            'total_guru' => ['total' => $totalGuru, 'growth' => 0],
            'total_pegawai' => ['total' => $totalPegawai, 'growth' => 0],
            'total_kelas' => ['total' => $totalKelas, 'growth' => 0],
            'total_rombel' => ['total' => $totalRombel, 'growth' => 0],
            'siswa_hadir_hari_ini' => ['total' => $hadirHariIni, 'growth' => 0],
            'siswa_terlambat' => ['total' => $terlambat, 'growth' => 0],
            'siswa_izin' => ['total' => $izin, 'growth' => 0],
            'siswa_sakit' => ['total' => $sakit, 'growth' => 0],
            'siswa_alpha' => ['total' => $alpha, 'growth' => 0],
            'setoran_tahfizh_hari_ini' => ['total' => $setoranTahfizhHariIni, 'growth' => 0],
        ];

        // 2. Charts Data
        // Attendance Trend (Last 7 Days) - scoped to principal's unit
        $sub7Days = now()->subDays(6)->toDateString();
        $attendanceTrend = [];
        if (Schema::hasTable('attendances')) {
            $trendQuery = DB::table('attendances')
                ->selectRaw('attendance_date as date, sum(case when status in (\'present\',\'hadir\') then 1 else 0 end) as hadir, sum(case when status = \'late\' then 1 else 0 end) as terlambat, sum(case when status in (\'absent\',\'alpha\') then 1 else 0 end) as alpha')
                ->whereBetween('attendance_date', [$sub7Days, $today]);
            if ($targetUnitId) {
                $trendQuery->whereIn('student_id', (clone $studentQuery)->pluck('id'));
            }
            $attendanceTrend = $trendQuery
                ->groupBy('attendance_date')
                ->orderBy('attendance_date')
                ->get();
        }

        // 3. Tables & Alerts
        $recentAnnouncements = PengumumanSekolah::query()
            ->where('status_aktif', true)
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($announcement) => [
                'id' => $announcement->id,
                'judul' => $announcement->judul_pengumuman,
                'isi' => $announcement->isi_pengumuman,
                'target' => is_array($announcement->target_peran)
                    ? implode(', ', $announcement->target_peran)
                    : ($announcement->target_peran ?: 'Semua Unit'),
                'prioritas' => $announcement->prioritas,
                'created_at' => $announcement->created_at,
            ]);

        return [
            'context' => [
                'role' => 'Kepala Sekolah',
                'unit' => $unit ? ['id' => $unit->id, 'nama' => $unit->name ?? $unit->nama] : null,
                'tahun_ajaran' => $activeAcademicYear ? ['id' => $activeAcademicYear->id, 'nama' => $activeAcademicYear->name ?? $activeAcademicYear->year_name ?? $activeAcademicYear->nama] : null,
                'semester' => $activeSemester ? ['id' => $activeSemester->id, 'nama' => $activeSemester->name ?? $activeSemester->nama] : null,
            ],
            'kpis' => $kpis,
            'charts' => [
                'attendance_trend' => $attendanceTrend,
            ],
            'tables' => [
                'announcements' => $recentAnnouncements,
            ],
            'alerts' => [],
        ];
    }
}
