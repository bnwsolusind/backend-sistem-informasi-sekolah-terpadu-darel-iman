<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StudentGradesSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'development', 'testing'])) return;
        $actor = User::query()->whereHas('roles', fn ($q) => $q->whereIn('name', ['Operator', 'Tata Usaha', 'Guru', 'Super Admin']))->orderBy('id')->first();
        if (! $actor) return;

        $targetStudentId = env('DEMO_GRADE_STUDENT_ID');
        Student::query()->with('kelas.unitPendidikan')->where('is_active', true)->whereNotNull('kelas_id')
            ->when($targetStudentId, fn ($q) => $q->whereKey($targetStudentId))
            ->when(! $targetStudentId, fn ($q) => $q->where('metadata->is_demo', true))
            ->orderBy('id')->chunkById(100, function ($students) use ($actor) {
                foreach ($students as $student) {
                    $kelas = $student->kelas; $unit = $kelas?->unitPendidikan;
                    $yearId = $kelas?->tahun_ajaran_id; $semesterId = $kelas?->semester_id;
                    $level = $this->level($kelas?->jenjang, $unit?->level);
                    if (! $kelas || ! $unit || ! $yearId || ! $semesterId || ! $level) continue;
                    $subjects = Subject::query()->where('unit_pendidikan_id', $unit->id)->where('status', true)->where('jenjang', $level)->orderBy('urutan_tampil')->get();
                    if ($subjects->isEmpty()) $subjects = $this->createUnitSubjects($unit, $level, $actor);

                    foreach ($subjects as $subject) {
                        $seed = abs(crc32($student->id.'|'.$subject->id.'|'.$yearId.'|'.$semesterId));
                        $scores = [72 + $seed % 23, 70 + ($seed >> 3) % 25, 74 + ($seed >> 5) % 23, 71 + ($seed >> 7) % 24, 73 + ($seed >> 9) % 23];
                        $final = round($scores[0] * .20 + $scores[1] * .15 + $scores[2] * .25 + $scores[3] * .20 + $scores[4] * .20, 2);
                        StudentGrade::query()->updateOrCreate([
                            'student_id' => $student->id, 'subject_id' => $subject->id,
                            'academic_year_id' => $yearId, 'semester_id' => $semesterId,
                        ], [
                            'kelas_id' => $kelas->id, 'class_id' => $student->class_id,
                            'score_assignment' => $scores[0], 'score_quiz' => $scores[1], 'score_project' => $scores[2],
                            'score_midterm' => $scores[3], 'score_final' => $scores[4], 'final_score' => $final,
                            'grade_letter' => StudentGrade::getGradeLetter($final), 'is_passed' => $final >= (float) ($subject->kkm ?? 75),
                            'notes' => $this->note($final), 'created_by' => $actor->id, 'updated_by' => $actor->id,
                            'metadata' => ['source' => self::class, 'is_demo' => true, 'formula' => 'demo_academic_v1'],
                        ]);
                    }
                }
            });
    }

    private function createUnitSubjects($unit, string $level, User $actor)
    {
        return Subject::query()->where('status', true)->where('jenjang', $level)
            ->where(fn ($q) => $q->whereNull('metadata')->orWhereNull('metadata->is_demo'))
            ->orderBy('urutan_tampil')->get()->unique('kode_mapel')
            ->map(function (Subject $template) use ($unit, $level, $actor) {
                $suffix = Str::upper(Str::slug($unit->code ?: Str::limit($unit->name, 8, ''), '-'));
                $code = Str::limit(($template->kode_mapel ?: $template->code).'-'.$suffix, 50, '');
                return Subject::query()->updateOrCreate(['code' => $code], [
                    'unit_pendidikan_id' => $unit->id, 'kurikulum_id' => $template->kurikulum_id, 'kode_mapel' => $code,
                    'nama_mapel' => $template->nama_mapel ?: $template->name, 'name' => $template->nama_mapel ?: $template->name,
                    'nama_singkat' => $template->nama_singkat, 'kelompok_mapel' => $template->kelompok_mapel,
                    'kategori' => $template->kategori, 'jenjang' => $level, 'tingkat_kelas' => 'All',
                    'jam_pelajaran' => $template->jam_pelajaran, 'kkm' => $template->kkm, 'warna' => $template->warna,
                    'ikon' => $template->ikon, 'urutan_tampil' => $template->urutan_tampil, 'status' => true,
                    'deskripsi' => $template->deskripsi, 'created_by' => $actor->id,
                    'metadata' => ['source' => self::class, 'is_demo' => true, 'template_subject_id' => $template->id],
                ]);
            })->values();
    }

    private function level(...$values): ?string
    {
        $v = strtoupper(implode(' ', array_filter($values)));
        return match (true) {
            preg_match('/\b(TK|PAUD|RA|KB)\b/', $v) === 1 => 'TK',
            preg_match('/\b(SMA|SMK|MA|ALIYAH)\b/', $v) === 1 => 'SMA',
            preg_match('/\b(SMP|MTS)\b/', $v) === 1 => 'SMP',
            preg_match('/\b(SD|SDIT|MI)\b/', $v) === 1 => 'SD', default => null,
        };
    }

    private function note(float $score): string
    {
        return match (true) {
            $score >= 90 => 'Capaian sangat baik. Pertahankan konsistensi belajar.',
            $score >= 80 => 'Pemahaman baik dan perlu terus ditingkatkan.',
            $score >= 75 => 'Capaian memenuhi target dengan ruang penguatan materi.',
            default => 'Perlu pendampingan pada kompetensi yang belum tuntas.',
        };
    }
}
