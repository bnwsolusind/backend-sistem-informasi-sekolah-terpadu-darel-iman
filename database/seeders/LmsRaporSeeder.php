<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use App\Services\LmsRaporService;
use Illuminate\Database\Seeder;

class LmsRaporSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'development', 'testing'])) return;
        $actor = User::query()->whereHas('roles', fn ($q) => $q->whereIn('name', ['Operator', 'Tata Usaha', 'Super Admin']))->orderBy('id')->first();
        if (! $actor) return;
        $service = app(LmsRaporService::class);
        $targetStudentId = env('DEMO_GRADE_STUDENT_ID');
        Student::query()->with('kelas')->where('is_active', true)->whereNotNull('kelas_id')
            ->when($targetStudentId, fn ($q) => $q->whereKey($targetStudentId))
            ->when(! $targetStudentId, fn ($q) => $q->where('metadata->is_demo', true))->orderBy('id')
            ->chunkById(100, function ($students) use ($actor, $service) {
                foreach ($students as $student) {
                    $kelas = $student->kelas;
                    if (! $kelas?->tahun_ajaran_id || ! $kelas?->semester_id) continue;
                    $rapor = $service->generateStudent($student->id, $kelas->semester_id, $kelas->tahun_ajaran_id, $kelas->id);
                    if ($rapor->total_mapel < 1) continue;
                    $rapor->update([
                        'guru_wali_id' => $kelas->wali_kelas_id, 'status_rapor' => 'diterbitkan',
                        'tanggal_terbit' => now()->toDateString(), 'created_by' => $actor->id, 'updated_by' => $actor->id,
                        'catatan_wali_kelas' => 'Pertahankan kebiasaan belajar yang baik dan tingkatkan kompetensi yang belum optimal.',
                    ]);
                }
            });
    }
}
