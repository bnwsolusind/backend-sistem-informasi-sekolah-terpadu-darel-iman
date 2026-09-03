<?php

namespace Tests\Feature;

use App\Models\EducationUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class EducationUnitLeaderRegressionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
        $this->user = User::factory()->create();
        $this->user->assignRole('Super Admin');
    }

    /** @test */
    public function test_education_unit_index_endpoint_returns_success_without_leader_relation_exception(): void
    {
        $unit = EducationUnit::query()->create([
            'code' => 'REG-001',
            'name' => 'SDIT Regression Unit',
            'level' => 'SDIT',
            'is_active' => true,
            'metadata' => [
                'principal_name' => 'Ustadz Abdullah, S.Pd.',
                'city' => 'Padang',
            ],
        ]);

        DB::enableQueryLog();

        $response = $this->actingAs($this->user)
            ->getJson('/api/education-units');

        $response->assertStatus(200);

        $queries = DB::getQueryLog();
        $querySqls = array_column($queries, 'query');

        // Verify no query attempts fuzzy relation LIKE '%Kepala%' or LIKE '%Pimpinan%' on EducationUnit leader
        foreach ($querySqls as $sql) {
            $this->assertStringNotContainsString('leader', strtolower($sql));
        }

        $this->assertEquals('Ustadz Abdullah, S.Pd.', $unit->fresh()->metadata['principal_name'] ?? null);
    }

    /** @test */
    public function test_education_unit_show_returns_correct_model_when_principal_unassigned(): void
    {
        $unit = EducationUnit::query()->create([
            'code' => 'REG-002',
            'name' => 'SMPIT Regression Unit',
            'level' => 'SMPIT',
            'is_active' => true,
            'metadata' => [],
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/education-units/{$unit->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $unit->id)
            ->assertJsonPath('name', 'SMPIT Regression Unit');

        $this->assertNull($unit->fresh()->metadata['principal_name'] ?? null);
    }

    /** @test */
    public function test_foundation_units_endpoint_returns_success_without_exceptions(): void
    {
        EducationUnit::query()->create([
            'code' => 'REG-003',
            'name' => 'SMAIT Regression Unit',
            'level' => 'SMAIT',
            'is_active' => true,
            'metadata' => [
                'principal_name' => 'Ustadz Faisal, Lc.',
            ],
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/foundation/units');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success');
    }
}
