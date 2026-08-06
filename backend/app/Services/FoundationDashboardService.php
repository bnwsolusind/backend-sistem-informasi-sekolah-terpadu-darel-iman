<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\JenisUnitPendidikan;
use App\Models\Kelas;
use App\Models\PengumumanSekolah;
use App\Models\Position;
use App\Models\RekapPrestasiSiswa;
use App\Models\Semester;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class FoundationDashboardService
{
    /**
     * Get aggregate overview data for Foundation Dashboard.
     */
    public function getDashboardOverview(array $filters = []): array
    {
        $unitQuery = EducationUnit::query();
        if (! empty($filters['unit_id']) && $filters['unit_id'] !== 'all') {
            $unitQuery->where('id', $filters['unit_id']);
        }

        $activeUnits = $unitQuery->get();
        $unitIds = $activeUnits->pluck('id')->toArray();

        // 1. KPI Aggregation
        $startOfMonth = now()->startOfMonth();

        // Unit Pendidikan & Growth
        $totalUnits = EducationUnit::count();
        $totalActiveUnits = EducationUnit::where('is_active', true)->count();
        $growthUnit = EducationUnit::where('is_active', true)->where('created_at', '>=', $startOfMonth)->count();

        // Pegawai & Growth
        $employeeQuery = Employee::query();
        if (! empty($unitIds)) {
            $employeeQuery->whereIn('unit_id', $unitIds);
        }
        $totalPegawai = (clone $employeeQuery)->count();
        $totalPegawaiAktif = (clone $employeeQuery)->where(function ($q) {
            $q->where('status', 'aktif')->orWhere('status', 'Active')->orWhereNull('status');
        })->count();
        $growthPegawai = (clone $employeeQuery)->where(function ($q) {
            $q->where('status', 'aktif')->orWhere('status', 'Active')->orWhereNull('status');
        })->where('created_at', '>=', $startOfMonth)->count();

        // Guru vs Tendik & Growth
        $guruQuery = (clone $employeeQuery)->where(function ($q) {
            $q->where('status', 'aktif')->orWhere('status', 'Active')->orWhereNull('status');
        })->where(function ($q) {
            $q->whereHas('position', function ($p) {
                $p->where('nama_jabatan', 'like', '%Guru%')
                  ->orWhere('nama_jabatan', 'like', '%Pendidik%')
                  ->orWhere('is_teacher', true);
            })->orWhere('status_pegawai', 'like', '%Guru%');
        });
        $totalGuru = (clone $guruQuery)->count();
        $growthGuru = (clone $guruQuery)->where('created_at', '>=', $startOfMonth)->count();

        $totalTendik = max(0, $totalPegawai - $totalGuru);

        // Siswa & Growth
        $studentQuery = Student::query();
        if (! empty($unitIds)) {
            $studentQuery->whereIn('unit_id', $unitIds);
        }
        $totalSiswaAktif = (clone $studentQuery)->where('is_active', true)->count();
        $growthSiswa = (clone $studentQuery)->where('is_active', true)->where('created_at', '>=', $startOfMonth)->count();
        $totalLakiLaki = (clone $studentQuery)->where('is_active', true)->where('gender', 'male')->count();
        $totalPerempuan = (clone $studentQuery)->where('is_active', true)->where('gender', 'female')->count();

        // Siswa Baru tahun berjalan
        $activeYear = AcademicYear::where('is_active', true)->first();
        $currentYearNum = $activeYear ? (int) substr($activeYear->name, 0, 4) : (int) date('Y');

        $siswaBaru = (clone $studentQuery)->where(function ($q) use ($currentYearNum) {
            $q->where('tahun_masuk', $currentYearNum)
              ->orWhere('metadata->status_pendaftaran', 'baru')
              ->orWhere('metadata->is_new_student', true);
        })->count();

        // Mutasi
        $mutasiMasuk = (clone $studentQuery)->where('metadata->mutasi_type', 'masuk')->count();
        $mutasiKeluar = (clone $studentQuery)->where('metadata->mutasi_type', 'keluar')->count();
        $siswaBerhenti = (clone $studentQuery)->where('metadata->status_siswa', 'berhenti')->count();

        // Kelulusan & Alumni
        $siswaLulus = (clone $studentQuery)->where('is_active', false)->where('metadata->status_siswa', 'lulus')->count();
        $menungguAlumni = (clone $studentQuery)->where('is_active', false)->whereNull('metadata->is_alumni')->count();
        $alumniQuery = (clone $studentQuery)->where(function ($q) {
            $q->where('is_active', false)->orWhere('metadata->is_alumni', true)->orWhere('metadata->status_siswa', 'alumni');
        });
        $totalAlumni = (clone $alumniQuery)->count();
        $growthAlumni = (clone $alumniQuery)->where(function ($q) use ($startOfMonth) {
            $q->where('created_at', '>=', $startOfMonth)->orWhere('updated_at', '>=', $startOfMonth);
        })->count();

        // Orang Tua & Growth (scope ke unit terpilih bila filter aktif)
        $totalOrtu = \App\Models\ParentModel::count();
        $growthOrtu = \App\Models\ParentModel::where('created_at', '>=', $startOfMonth)->count();
        if ($totalOrtu === 0) {
            $totalOrtu = \App\Models\User::whereHas('roles', fn ($r) => $r->whereIn('name', ['Orang Tua', 'Orangtua', 'Wali Murid']))->count();
            $growthOrtu = \App\Models\User::whereHas('roles', fn ($r) => $r->whereIn('name', ['Orang Tua', 'Orangtua', 'Wali Murid']))
                ->where('created_at', '>=', $startOfMonth)->count();
        }
        if (! empty($unitIds)) {
            $totalOrtu = \App\Models\ParentModel::whereHas('students', fn ($q) => $q->whereIn('unit_id', $unitIds))->count();
            $growthOrtu = \App\Models\ParentModel::whereHas('students', fn ($q) => $q->whereIn('unit_id', $unitIds))
                ->where('created_at', '>=', $startOfMonth)->count();
        }

        // Kelas & Growth
        $kelasQuery = Kelas::query();
        if ($activeYear) {
            $kelasQuery->where(function ($q) use ($activeYear) {
                $q->where('tahun_ajaran_id', $activeYear->id)->orWhereNull('tahun_ajaran_id');
            });
        }
        $totalKelas = (clone $kelasQuery)->count();
        $growthKelas = (clone $kelasQuery)->where('created_at', '>=', $startOfMonth)->count();

        // Rombel & Growth
        $activeSemester = Semester::where('is_active', true)->first();
        $rombelQuery = Kelas::query();
        if ($activeYear) {
            $rombelQuery->where(function ($q) use ($activeYear) {
                $q->where('tahun_ajaran_id', $activeYear->id)->orWhereNull('tahun_ajaran_id');
            });
        }
        if ($activeSemester) {
            $rombelQuery->where(function ($q) use ($activeSemester) {
                $q->where('semester_id', $activeSemester->id)->orWhereNull('semester_id');
            });
        }
        $totalRombel = (clone $rombelQuery)->count();
        if ($totalRombel === 0) {
            $totalRombel = $totalKelas;
        }
        $growthRombel = (clone $rombelQuery)->where('created_at', '>=', $startOfMonth)->count();

        // Informasi Baru
        $totalPengumuman = PengumumanSekolah::where('status_aktif', true)->count();

        // 2. Chart Data: SDM Distribution per Unit
        $sdmDistribution = EducationUnit::query()
            ->when(! empty($filters['unit_id']) && $filters['unit_id'] !== 'all', fn ($query) => $query->whereKey($filters['unit_id']))
            ->withCount([
            'employees as total_pegawai',
            'employees as total_guru' => function ($q) {
                $q->whereHas('position', function ($p) {
                    $p->where('nama_jabatan', 'like', '%Guru%')->orWhere('is_teacher', true);
                });
            },
        ])->get()->map(function ($unit) {
            return [
                'id' => $unit->id,
                'name' => $unit->name,
                'code' => $unit->code,
                'pegawai' => $unit->total_pegawai ?? 0,
                'guru' => $unit->total_guru ?? 0,
                'tendik' => max(0, ($unit->total_pegawai ?? 0) - ($unit->total_guru ?? 0)),
            ];
        });

        // 3. Chart Data: Pergerakan siswa berdasarkan catatan yang benar-benar tersimpan.
        $studentMovement = [];
        if (DB::getDriverName() === 'pgsql') {
            $studentMovement = (clone $studentQuery)
                ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
                ->selectRaw("to_char(date_trunc('month', created_at), 'Mon') as month")
                ->selectRaw("count(*) filter (where metadata->>'is_new_student' = 'true' or metadata->>'status_pendaftaran' = 'baru') as siswa_baru")
                ->selectRaw("count(*) filter (where metadata->>'mutasi_type' = 'masuk') as masuk")
                ->selectRaw("count(*) filter (where metadata->>'mutasi_type' = 'keluar') as keluar")
                ->selectRaw("count(*) filter (where is_active = false and metadata->>'status_siswa' = 'lulus') as lulus")
                ->groupByRaw("date_trunc('month', created_at)")
                ->orderByRaw("date_trunc('month', created_at)")
                ->get()
                ->map(fn ($item) => [
                    'month' => $item->month,
                    'siswa_baru' => (int) $item->siswa_baru,
                    'masuk' => (int) $item->masuk,
                    'keluar' => (int) $item->keluar,
                    'lulus' => (int) $item->lulus,
                ])
                ->values()
                ->all();
        }

        // 4. Ringkasan Unit Pendidikan
        $unitSummaries = $this->getUnitSummaries($filters);

        // 5. Berita & Informasi Terbaru
        $recentInformation = PengumumanSekolah::where('status_aktif', true)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul_pengumuman,
                    'isi' => $item->isi_pengumuman,
                    'tanggal' => $item->created_at->format('d M Y'),
                    'prioritas' => $item->prioritas,
                ];
            });

        return [
            'kpis' => [
                'total_unit' => $totalActiveUnits,
                'growth_unit' => $growthUnit,
                'total_unit_aktif' => $totalActiveUnits,
                'total_pegawai' => $totalPegawai,
                'growth_pegawai' => $growthPegawai,
                'total_pegawai_aktif' => $totalPegawaiAktif,
                'total_guru' => $totalGuru,
                'growth_guru' => $growthGuru,
                'total_tendik' => $totalTendik,
                'total_siswa_aktif' => $totalSiswaAktif,
                'growth_siswa' => $growthSiswa,
                'total_ortu' => $totalOrtu,
                'growth_ortu' => $growthOrtu,
                'total_kelas' => $totalKelas,
                'growth_kelas' => $growthKelas,
                'total_rombel' => $totalRombel,
                'growth_rombel' => $growthRombel,
                'siswa_laki_laki' => $totalLakiLaki,
                'siswa_perempuan' => $totalPerempuan,
                'siswa_baru' => $siswaBaru,
                'mutasi_masuk' => $mutasiMasuk,
                'mutasi_keluar' => $mutasiKeluar,
                'siswa_berhenti' => $siswaBerhenti,
                'siswa_lulus' => $siswaLulus,
                'menunggu_alumni' => $menungguAlumni,
                'total_alumni' => $totalAlumni,
                'growth_alumni' => $growthAlumni,
                'informasi_baru' => $totalPengumuman,
                'guru' => ['total' => $totalGuru, 'growth' => $growthGuru],
                'pegawai' => ['total' => $totalPegawai, 'growth' => $growthPegawai],
                'siswa' => ['total' => $totalSiswaAktif, 'growth' => $growthSiswa],
                'orang_tua' => ['total' => $totalOrtu, 'growth' => $growthOrtu],
                'alumni' => ['total' => $totalAlumni, 'growth' => $growthAlumni],
                'kelas' => ['total' => $totalKelas, 'growth' => $growthKelas],
                'rombel' => ['total' => $totalRombel, 'growth' => $growthRombel],
                'unit_pendidikan' => ['total' => $totalActiveUnits, 'growth' => $growthUnit],
            ],
            'charts' => [
                'sdm_distribution' => $sdmDistribution,
                'student_movement' => $studentMovement,
            ],
            'unit_summaries' => $unitSummaries,
            'recent_information' => $recentInformation,
            'active_academic_year' => $activeYear,
            'active_semester' => Semester::where('is_active', true)->first(),
        ];
    }

    /**
     * Get aggregate statistics per education unit.
     */
    public function getUnitSummaries(array $filters = []): array
    {
        $units = EducationUnit::query()
            ->with(['jenisUnit'])
            ->when(! empty($filters['unit_id']) && $filters['unit_id'] !== 'all', fn ($query) => $query->whereKey($filters['unit_id']))
            ->when(! empty($filters['jenis_unit_id']), fn ($query) => $query->where('jenis_unit_id', $filters['jenis_unit_id']))
            ->when(isset($filters['status']) && $filters['status'] !== 'all', fn ($query) => $query->where('is_active', $filters['status'] === 'aktif'))
            ->when(! empty($filters['search']), fn ($query) => $query->where('name', 'ilike', '%' . $filters['search'] . '%'))
            ->get();

        return $units->map(function ($unit) {
            $pegawaiCount = Employee::where('unit_id', $unit->id)->count();
            $guruCount = Employee::where('unit_id', $unit->id)
                ->whereHas('position', function ($p) {
                    $p->where('nama_jabatan', 'like', '%Guru%')->orWhere('is_teacher', true);
                })->count();

            $siswaAktifCount = Student::where('unit_id', $unit->id)->where('is_active', true)->count();
            $kelasCount = Kelas::where('unit_pendidikan_id', $unit->id)->count();
            $rombelCount = $kelasCount > 0 ? $kelasCount : 1;
            $siswaBaruCount = Student::where('unit_id', $unit->id)
                ->where(function ($q) {
                    $q->where('tahun_masuk', date('Y'))->orWhere('metadata->is_new_student', true);
                })->count();

            $mutasiMasuk = Student::where('unit_id', $unit->id)->where('metadata->mutasi_type', 'masuk')->count();
            $mutasiKeluar = Student::where('unit_id', $unit->id)->where('metadata->mutasi_type', 'keluar')->count();
            $lulusCount = Student::where('unit_id', $unit->id)->where('is_active', false)->where('metadata->status_siswa', 'lulus')->count();
            $alumniCount = Student::where('unit_id', $unit->id)->where(function ($q) {
                $q->where('is_active', false)->orWhere('metadata->is_alumni', true);
            })->count();

            // Headmaster / Kepala sekolah
            $kepalaSekolah = Employee::where('unit_id', $unit->id)
                ->whereHas('position', function ($p) {
                    $p->where('nama_jabatan', 'like', '%Kepala%');
                })->first();

            return [
                'id' => $unit->id,
                'name' => $unit->name,
                'code' => $unit->code,
                'jenis_unit' => $unit->jenisUnit->nama_jenis ?? $unit->level ?? 'Umum',
                'level' => $unit->level ?? '-',
                'location' => $unit->description ?? 'Padang',
                'is_active' => (bool) $unit->is_active,
                'kepala_sekolah' => $kepalaSekolah ? $kepalaSekolah->nama_lengkap : 'Belum Ditentukan',
                'pegawai_count' => $pegawaiCount,
                'guru_count' => $guruCount,
                'tendik_count' => max(0, $pegawaiCount - $guruCount),
                'siswa_aktif_count' => $siswaAktifCount,
                'kelas_count' => $kelasCount,
                'rombel_count' => $rombelCount,
                'siswa_baru_count' => $siswaBaruCount,
                'mutasi_masuk' => $mutasiMasuk,
                'mutasi_keluar' => $mutasiKeluar,
                'lulus_count' => $lulusCount,
                'alumni_count' => $alumniCount,
            ];
        })->toArray();
    }

    /**
     * Get detail of single unit with comprehensive statistics.
     */
    public function getUnitDetail(string $id): array
    {
        $unit = EducationUnit::with(['jenisUnit'])->findOrFail($id);

        $pegawaiList = Employee::with(['position', 'division'])->where('unit_id', $id)->get();
        $guruCount = $pegawaiList->filter(function ($e) {
            $j = $e->position->nama_jabatan ?? '';
            return str_contains(strtolower($j), 'guru') || str_contains(strtolower($j), 'pendidik') || ($e->position->is_teacher ?? false);
        })->count();
        $pegawaiCount = $pegawaiList->count();
        $siswaCount = Student::where('unit_id', $id)->where('is_active', true)->count();
        $kelasCount = Kelas::where('unit_pendidikan_id', $id)->count();
        $rombelCount = $kelasCount > 0 ? $kelasCount : 1;

        $kepalaSekolah = Employee::where('unit_id', $id)
            ->whereHas('position', function ($p) {
                $p->where('nama_jabatan', 'like', '%Kepala%');
            })->first();

        $activeYear = AcademicYear::where('is_active', true)->first();
        $activeSemester = Semester::where('is_active', true)->first();

        return [
            'id' => $unit->id,
            'kode' => $unit->code,
            'code' => $unit->code,
            'nama' => $unit->name,
            'name' => $unit->name,
            'jenis_unit' => $unit->jenisUnit->nama_jenis ?? $unit->level ?? 'Umum',
            'level' => $unit->level ?? '-',
            'status' => $unit->is_active ? 'aktif' : 'nonaktif',
            'is_active' => (bool) $unit->is_active,
            'description' => $unit->description,
            'location' => $unit->description ?? 'Padang',
            'kepala_sekolah' => [
                'nama' => $kepalaSekolah ? $kepalaSekolah->nama_lengkap : 'Belum Ditentukan',
                'niy' => $kepalaSekolah ? ($kepalaSekolah->niy ?? $kepalaSekolah->nik) : '-',
                'no_hp' => $kepalaSekolah ? ($kepalaSekolah->no_hp ?? '-') : '-',
                'email' => $kepalaSekolah ? ($kepalaSekolah->email ?? '-') : '-',
            ],
            'statistik' => [
                'guru' => $guruCount,
                'pegawai' => $pegawaiCount,
                'siswa' => $siswaCount,
                'kelas' => $kelasCount,
                'rombel' => $rombelCount,
            ],
            'academic' => [
                'tahun_ajaran' => $activeYear ? $activeYear->name : date('Y') . '/' . (date('Y') + 1),
                'semester' => $activeSemester ? ucfirst($activeSemester->name ?? 'Ganjil') : 'Ganjil',
            ],
            'unit' => $unit,
        ];
    }
}
