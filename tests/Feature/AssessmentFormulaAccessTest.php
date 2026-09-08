<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\AssessmentFormula;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\Semester;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Services\AssessmentFormulaService;

class AssessmentFormulaAccessTest extends TestCase
{
    use RefreshDatabase;

    private function payload(EducationUnit $unit, AcademicYear $year, Semester $semester): array
    {
        return [
            'name' => 'Rumus Akademik Unit', 'type' => 'academic', 'scope' => 'unit',
            'education_unit_id' => $unit->id, 'academic_year_id' => $year->id,
            'semester_id' => $semester->id, 'minimum_score' => 75,
            'components' => [
                ['key' => 'assignment', 'label' => 'Tugas', 'weight' => 40, 'aggregation' => 'average'],
                ['key' => 'midterm', 'label' => 'UTS', 'weight' => 30, 'aggregation' => 'average'],
                ['key' => 'final_exam', 'label' => 'UAS', 'weight' => 30, 'aggregation' => 'average'],
            ],
        ];
    }

    public function test_unit_operator_can_only_create_formula_in_own_unit(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $year = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
        $semester = Semester::create(['academic_year_id' => $year->id, 'name' => 'Ganjil', 'sequence' => 1, 'is_active' => true]);
        $own = EducationUnit::create(['code' => 'OWN', 'name' => 'Unit Sendiri', 'level' => 'SD', 'is_active' => true]);
        $foreign = EducationUnit::create(['code' => 'OTHER', 'name' => 'Unit Lain', 'level' => 'SMP', 'is_active' => true]);
        $user = User::factory()->create();
        $user->assignRole('Tata Usaha');
        Employee::create(['niy' => 'TU-001', 'nama_lengkap' => 'TU Unit', 'jenis_kelamin' => 'L', 'status' => 'Aktif', 'unit_id' => $own->id, 'user_id' => $user->id]);

        $this->actingAs($user, 'sanctum')->postJson('/api/assessment-formulas', $this->payload($own, $year, $semester))
            ->assertCreated()->assertJsonPath('data.education_unit_id', $own->id);
        $this->actingAs($user, 'sanctum')->postJson('/api/assessment-formulas', $this->payload($foreign, $year, $semester))
            ->assertForbidden();
        $global = $this->payload($own, $year, $semester);
        $global['scope'] = 'global'; unset($global['education_unit_id']);
        $this->actingAs($user, 'sanctum')->postJson('/api/assessment-formulas', $global)->assertForbidden();
    }

    public function test_formula_requires_exactly_one_hundred_percent_weight(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $year = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
        $semester = Semester::create(['academic_year_id' => $year->id, 'name' => 'Ganjil', 'sequence' => 1, 'is_active' => true]);
        $unit = EducationUnit::create(['code' => 'UJI', 'name' => 'Unit Uji', 'level' => 'SD', 'is_active' => true]);
        $user = User::factory()->create(); $user->assignRole('Pengurus Yayasan');
        $this->assertTrue($user->can('assessment_formula.create'));
        $payload = $this->payload($unit, $year, $semester);
        $payload['components'][0]['weight'] = 39;

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/assessment-formulas', $payload);
        $response->assertUnprocessable()->assertJsonValidationErrors('components');
    }

    public function test_active_formula_calculates_weighted_score_without_ui_hardcode(): void
    {
        $year = AcademicYear::create(['name' => '2026/2027', 'is_active' => true]);
        $user = User::factory()->create();
        $formula = AssessmentFormula::create([
            'name' => 'Rumus Uji', 'type' => 'academic', 'scope' => 'global',
            'academic_year_id' => $year->id, 'status' => 'active', 'created_by' => $user->id,
            'components' => [
                ['key' => 'assignment', 'label' => 'Tugas', 'weight' => 40],
                ['key' => 'midterm', 'label' => 'UTS', 'weight' => 30],
                ['key' => 'final_exam', 'label' => 'UAS', 'weight' => 30],
            ],
        ]);

        $score = app(AssessmentFormulaService::class)->calculate($formula, [
            'assignment' => 80, 'midterm' => 90, 'final_exam' => 90,
        ]);
        $this->assertSame(86.0, $score);
    }
}
