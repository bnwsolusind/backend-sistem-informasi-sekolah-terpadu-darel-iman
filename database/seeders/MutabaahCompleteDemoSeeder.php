<?php

namespace Database\Seeders;

use App\Enums\Mutabaah\DailyStatus;
use App\Enums\Mutabaah\DetailStatus;
use App\Enums\Mutabaah\RecordStatus;
use App\Enums\Mutabaah\SignatureStatus;
use App\Enums\Mutabaah\SupervisorType;
use App\Models\AcademicYear;
use App\Models\EducationProgramSetting;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\MutabaahAgendaItem;
use App\Models\MutabaahAssessmentPeriod;
use App\Models\MutabaahDailyDetail;
use App\Models\MutabaahDailyHeader;
use App\Models\MutabaahInputRule;
use App\Models\MutabaahParentSignature;
use App\Models\MutabaahSupervisorAssignment;
use App\Models\MutabaahTemplate;
use App\Models\MutabaahTemplateItem;
use App\Models\ParentModel;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MutabaahCompleteDemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Memulai seeding data dummy Mutabaah sesuai alur resmi...');

        $academicYear = AcademicYear::where('is_active', true)->first() ?? AcademicYear::first();
        $semester = Semester::where('is_active', true)->first() ?? Semester::first();
        $employee = Employee::first();
        $template = MutabaahTemplate::with('items.agendaItem')->where('name', 'like', '%SD%')->first()
            ?? MutabaahTemplate::with('items.agendaItem')->first();

        $admin = User::first();
        if (! $academicYear || ! $semester || ! $template || ! $admin) {
            $this->command->error('Tahun ajaran, semester, template, atau admin user tidak ditemukan.');
            return;
        }

        // 1. Setup EducationProgramSetting (Fullday) untuk semua unit yang aktif
        $units = EducationUnit::all();
        foreach ($units as $unit) {
            EducationProgramSetting::updateOrCreate(
                ['education_unit_id' => $unit->id, 'class_id' => null],
                [
                    'program_type' => 'fullday',
                    'school_weekdays' => [1, 2, 3, 4, 5],
                    'is_active' => true,
                    'effective_from' => '2026-01-01',
                    'effective_until' => null,
                    'created_by' => $admin->id,
                ]
            );
        }
        $this->command->info('1. EducationProgramSetting (Fullday) berhasil diatur.');

        // 2. Setup MutabaahAssessmentPeriod
        foreach ($units as $unit) {
            MutabaahAssessmentPeriod::updateOrCreate(
                ['education_unit_id' => $unit->id, 'academic_year_id' => $academicYear->id, 'semester_id' => $semester->id],
                [
                    'name' => 'Periode Mutabaah Semester Ganjil',
                    'period_type' => 'regular',
                    'scope' => 'unit',
                    'class_id' => null,
                    'template_id' => $template->id,
                    'start_date' => '2026-07-01',
                    'end_date' => '2026-12-31',
                    'priority' => 10,
                    'is_active' => true,
                    'created_by' => $admin->id,
                ]
            );
        }
        $this->command->info('2. MutabaahAssessmentPeriod berhasil diatur.');

        // 3. Setup MutabaahInputRule untuk membagi tugas input Rumah (Orang Tua) vs Sekolah (Guru)
        $agendaItems = MutabaahAgendaItem::all()->keyBy('name');
        $homeRules = [
            'Subuh' => ['source' => 'parent', 'location' => 'home'],
            'Maghrib' => ['source' => 'parent', 'location' => 'home'],
            'Isya' => ['source' => 'parent', 'location' => 'home'],
            'Tahajud/Witir' => ['source' => 'parent', 'location' => 'home'],
            'Zikir Petang' => ['source' => 'parent', 'location' => 'home'],
            'Bersalaman dengan Orang Tua' => ['source' => 'parent', 'location' => 'home'],
            'Tilawah Al-Qur’an' => ['source' => 'either', 'location' => 'home'],
            'Murajaah' => ['source' => 'either', 'location' => 'home'],
        ];

        foreach ($homeRules as $agendaName => $ruleConfig) {
            $agenda = $agendaItems->get($agendaName);
            if ($agenda) {
                MutabaahInputRule::updateOrCreate(
                    ['agenda_item_id' => $agenda->id, 'program_type' => 'fullday'],
                    [
                        'input_source' => $ruleConfig['source'],
                        'location' => $ruleConfig['location'],
                        'requires_verification' => false,
                        'priority' => 10,
                        'is_active' => true,
                        'created_by' => $admin->id,
                    ]
                );
            }
        }
        $this->command->info('3. MutabaahInputRule (Aturan Input Rumah vs Sekolah) berhasil diatur.');

        // 4. Setup MutabaahSupervisorAssignment untuk setiap unit & kelas santri
        $assignments = [];
        foreach ($units as $unit) {
            $assignment = MutabaahSupervisorAssignment::firstOrCreate(
                ['education_unit_id' => $unit->id, 'template_id' => $template->id],
                [
                    'employee_id' => $employee?->id,
                    'supervisor_type' => SupervisorType::WaliKelas->value,
                    'academic_year_id' => $academicYear->id,
                    'semester_id' => $semester->id,
                    'start_date' => '2026-07-01',
                    'end_date' => '2027-06-30',
                    'is_primary' => true,
                    'can_input' => true,
                    'can_edit' => true,
                    'can_finalize' => true,
                    'can_view_report' => true,
                    'status' => RecordStatus::Active->value,
                ]
            );
            $assignments[$unit->id] = $assignment;
        }
        $this->command->info('4. MutabaahSupervisorAssignment berhasil diatur.');

        // 5. Target Santri: Laila Fitriani, Siswa Test, dan Ahmad Zaky
        $targetStudents = Student::with(['parent.user', 'educationUnit', 'kelas'])
            ->whereIn('full_name', ['Laila Fitriani', 'Siswa Test', 'Ahmad Zaky'])
            ->get();

        if ($targetStudents->isEmpty()) {
            $targetStudents = Student::with(['parent.user', 'educationUnit', 'kelas'])->limit(3)->get();
        }

        $templateItems = $template->items()->with('agendaItem')->orderBy('sort_order')->get();

        // Hari-hari yang akan di-generate (5 hari terakhir hingga hari ini)
        $dates = [
            '2026-09-04' => [
                'status' => DailyStatus::Finalized,
                'score' => 94.50,
                'signed' => false,
                'note' => 'Alhamdulillah ananda tertib dan istiqamah dalam shalat 5 waktu dan tilawah. Mohon terus dampingi zikir petang di rumah.',
            ],
            '2026-09-03' => [
                'status' => DailyStatus::ParentSigned,
                'score' => 96.00,
                'signed' => true,
                'sign_status' => SignatureStatus::Approved,
                'sign_comment' => 'Alhamdulillah ananda rajin shalat tepat waktu dan murajaah bersama abi di rumah.',
                'note' => 'Hafalan dan adab ananda di sekolah sangat baik hari ini.',
            ],
            '2026-09-02' => [
                'status' => DailyStatus::ParentSigned,
                'score' => 92.00,
                'signed' => true,
                'sign_status' => SignatureStatus::Approved,
                'sign_comment' => 'Semua amalan rumah terlaksana dengan baik.',
                'note' => 'Catatan: Murajaah juz 30 lancar, lanjutkan ayat berikutnya.',
            ],
            '2026-09-01' => [
                'status' => DailyStatus::Finalized,
                'score' => 95.00,
                'signed' => false,
                'note' => 'Shalat dhuha dan zikir pagi terlaksana rutin.',
            ],
            '2026-08-31' => [
                'status' => DailyStatus::ParentSigned,
                'score' => 91.50,
                'signed' => true,
                'sign_status' => SignatureStatus::Approved,
                'sign_comment' => 'Terima kasih atas bimbingan asatidzah.',
                'note' => 'Evaluasi awal pekan berjalan tertib.',
            ],
        ];

        $supervisorUserId = $employee?->user_id ?? $admin->id;

        foreach ($targetStudents as $student) {
            $unitId = $student->unit_id ?? $template->education_unit_id ?? $units->first()->id;
            $assignment = $assignments[$unitId] ?? $assignments[array_key_first($assignments)];
            $parentUser = $student->parent?->user;

            foreach ($dates as $dateStr => $dayMeta) {
                $activityDate = Carbon::parse($dateStr);

                $header = MutabaahDailyHeader::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'activity_date' => $activityDate->startOfDay(),
                    ],
                    [
                        'template_id' => $template->id,
                        'supervisor_assignment_id' => $assignment->id,
                        'education_unit_id' => $unitId,
                        'kelas_id' => $student->kelas_id,
                        'academic_year_id' => $academicYear->id,
                        'semester_id' => $semester->id,
                        'status' => $dayMeta['status'],
                        'total_items' => $templateItems->count(),
                        'good_count' => 9,
                        'less_count' => 1,
                        'not_done_count' => 0,
                        'na_count' => 0,
                        'score' => $dayMeta['score'],
                        'supervisor_notes' => $dayMeta['note'],
                        'finalized_at' => $activityDate->copy()->setTime(17, 30),
                        'finalized_by' => $supervisorUserId,
                        'created_by' => $supervisorUserId,
                        'updated_by' => $supervisorUserId,
                    ]
                );

                // Buat atau perbarui rincian detail 10 butir amalan
                foreach ($templateItems as $index => $tItem) {
                    $agendaName = $tItem->agendaItem?->name ?? '';
                    $isLess = ($index === 8); // Contoh: zikir petang dibuat 'less' agar realistis

                    $statusValue = $isLess ? DetailStatus::Less : DetailStatus::Good;
                    $location = in_array($agendaName, ['Subuh', 'Maghrib', 'Isya', 'Tahajud/Witir', 'Bersalaman dengan Orang Tua'], true) ? 'home' : 'school';
                    $source = ($location === 'home') ? 'parent' : 'supervisor';

                    $notes = null;
                    if ($agendaName === 'Tilawah Al-Qur’an') {
                        $notes = 'Tilawah 2 lembar Surah Al-Mulk';
                    } elseif ($agendaName === 'Murajaah') {
                        $notes = 'Murajaah lancar Surah An-Naba s/d An-Nazi\'at';
                    } elseif ($isLess) {
                        $notes = 'Terlewat sebagian karena perjalanan';
                    }

                    $inputBy = ($source === 'parent' && $parentUser) ? $parentUser->id : $supervisorUserId;

                    MutabaahDailyDetail::updateOrCreate(
                        [
                            'daily_header_id' => $header->id,
                            'template_item_id' => $tItem->id,
                        ],
                        [
                            'agenda_item_id' => $tItem->agenda_item_id,
                            'status_value' => $statusValue,
                            'numeric_value' => ($agendaName === 'Tilawah Al-Qur’an') ? 2 : (($agendaName === 'Murajaah') ? 10 : null),
                            'text_value' => null,
                            'notes' => $notes,
                            'input_by' => $inputBy,
                            'input_source' => $source,
                            'input_location' => $location,
                            'verification_status' => 'verified',
                            'verified_by' => $supervisorUserId,
                            'verified_at' => $activityDate->copy()->setTime(17, 0),
                            'input_at' => $activityDate->copy()->setTime(16, 0),
                        ]
                    );
                }

                // Tanda tangan orang tua jika hari tersebut sudah diparaf
                $parentUser = $student->parent?->user;
                if ($dayMeta['signed'] && $parentUser) {
                    MutabaahParentSignature::updateOrCreate(
                        [
                            'daily_header_id' => $header->id,
                            'parent_user_id' => $parentUser->id,
                        ],
                        [
                            'signature_status' => $dayMeta['sign_status']->value,
                            'comment' => $dayMeta['sign_comment'],
                            'signed_at' => $activityDate->copy()->setTime(20, 15),
                            'ip_address' => '127.0.0.1',
                            'device_info' => ['platform' => 'android', 'app' => 'mobile_app_sit'],
                        ]
                    );
                }
            }

            $this->command->info("5. Data Mutabaah berhasil di-generate untuk {$student->full_name}.");
        }

        $this->command->info('Seeding data dummy Mutabaah selesai 100%!');
    }
}
