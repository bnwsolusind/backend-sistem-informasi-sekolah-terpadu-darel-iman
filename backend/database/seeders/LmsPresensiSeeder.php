<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\ClassSchedule;
use App\Models\Employee;
use App\Models\Kelas;
use App\Models\LmsPresensi;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LmsPresensiSeeder extends Seeder
{
    public function run(): void
    {
        $kelas = Kelas::query()->orderBy('id')->first();
        $employee = Employee::query()->orderBy('id')->first();
        $subject = Subject::query()->orderBy('id')->first();
        $academicYear = AcademicYear::query()->orderBy('id')->first();
        $semester = Semester::query()->orderBy('id')->first();

        if (! $subject || ! $academicYear || ! $semester) {
            $this->command->warn('Skipping LmsPresensiSeeder: Missing subject, academic year, or semester dependency.');

            return;
        }

        // Ensure at least one ClassSchedule exists
        $schedule = ClassSchedule::query()->first();
        if (! $schedule) {
            $schedule = ClassSchedule::create([
                'id' => Str::uuid(),
                'kelas_id' => $kelas?->id,
                'employee_id' => $employee?->id,
                'subject_id' => $subject->id,
                'academic_year_id' => $academicYear->id,
                'semester_id' => $semester->id,
                'day_of_week' => 1, // Senin
                'time_start' => '07:30:00',
                'time_end' => '09:00:00',
                'week_type' => 'all',
                'is_active' => true,
            ]);
        }

        $students = Student::query()->orderBy('id')->limit(10)->get();
        if ($students->isEmpty()) {
            $this->command->warn('Skipping LmsPresensiSeeder: No students found.');

            return;
        }

        $statuses = ['hadir', 'hadir', 'hadir', 'izin', 'sakit', 'alpa', 'terlambat'];
        $today = now()->format('Y-m-d');
        $yesterday = now()->subDay()->format('Y-m-d');

        foreach ([$yesterday, $today] as $index => $date) {
            foreach ($students as $key => $student) {
                $status = $statuses[($key + $index) % count($statuses)];
                LmsPresensi::updateOrCreate(
                    [
                        'jadwal_pelajaran_id' => $schedule->id,
                        'siswa_id' => $student->id,
                        'tanggal' => $date,
                    ],
                    [
                        'status_hadir' => $status,
                        'keterangan' => $status !== 'hadir' ? 'Keterangan '.ucfirst($status) : 'Hadir mengikuti sesi pembelajaran',
                        'pertemuan_ke' => $index + 1,
                        'waktu_presensi' => now(),
                    ]
                );
            }
        }

        $this->command->info('LmsPresensiSeeder executed successfully.');
    }
}
