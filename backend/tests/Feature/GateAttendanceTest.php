<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\EducationUnit;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class GateAttendanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'RolePermissionSeeder']);
        $this->artisan('db:seed', ['--class' => 'AttendancePermissionSeeder']);
    }

    private function createUnit(): EducationUnit
    {
        return EducationUnit::create([
            'id' => (string) Str::uuid(),
            'code' => 'UNIT-TEST-'.rand(100, 999),
            'nama' => 'Unit SD Test',
            'name' => 'Unit SD Test',
            'is_active' => true,
        ]);
    }

    private function createStudent(EducationUnit $unit): Student
    {
        return Student::create([
            'id' => (string) Str::uuid(),
            'education_unit_id' => $unit->id,
            'nisn' => '999'.rand(10000, 99999),
            'nis' => '100'.rand(1000, 9999),
            'nama_lengkap' => 'Siswa Test Gate',
            'full_name' => 'Siswa Test Gate',
            'gender' => 'L',
            'jenis_kelamin' => 'L',
            'is_active' => true,
        ]);
    }

    public function test_gate_checkin_scan_creates_attendance_record(): void
    {
        $unit = $this->createUnit();
        $student = $this->createStudent($unit);

        $user = User::factory()->create();
        $user->assignRole('Super Admin');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/gate-attendance/scan-in', [
                'student_id' => $student->id,
                'check_in_time' => '07:05:00',
                'attendance_method' => 'QRCODE',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'HADIR');

        $this->assertDatabaseHas('attendances', [
            'student_id' => $student->id,
            'status' => 'HADIR',
        ]);
    }

    public function test_late_checkin_sets_terlambat_status(): void
    {
        $unit = $this->createUnit();
        $student = $this->createStudent($unit);

        $user = User::factory()->create();
        $user->assignRole('Super Admin');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/gate-attendance/scan-in', [
                'student_id' => $student->id,
                'check_in_time' => '07:35:00',
                'attendance_method' => 'RFID',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'TERLAMBAT');
    }

    public function test_duplicate_checkin_is_rejected(): void
    {
        $unit = $this->createUnit();
        $student = $this->createStudent($unit);

        $user = User::factory()->create();
        $user->assignRole('Super Admin');

        // First scan
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/gate-attendance/scan-in', [
                'student_id' => $student->id,
                'check_in_time' => '07:00:00',
                'attendance_method' => 'QRCODE',
            ]);

        // Second scan on same day
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/gate-attendance/scan-in', [
                'student_id' => $student->id,
                'check_in_time' => '07:05:00',
                'attendance_method' => 'QRCODE',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('code', 'DUPLICATE_CHECKIN');
    }

    public function test_gate_checkout_updates_record(): void
    {
        $unit = $this->createUnit();
        $student = $this->createStudent($unit);

        $user = User::factory()->create();
        $user->assignRole('Super Admin');

        // Initial checkin
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/gate-attendance/scan-in', [
                'student_id' => $student->id,
                'check_in_time' => '07:00:00',
            ]);

        // Checkout
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/gate-attendance/scan-out', [
                'student_id' => $student->id,
                'check_out_time' => '14:20:00',
                'attendance_method' => 'QRCODE',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('attendances', [
            'student_id' => $student->id,
            'check_out_status' => 'pulang_normal',
        ]);
    }
}
