<?php

namespace Tests\Feature;

use App\Http\Middleware\EnsureFoundationReadOnly;
use App\Models\AcademicYear;
use App\Models\Attendance;
use App\Models\ClassSchedule;
use App\Models\DeleteRequest;
use App\Models\Employee;
use App\Models\ParentModel;
use App\Models\QrCredential;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Mockery;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class MultiPortalAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Guru', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Siswa', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'Orang Tua', 'guard_name' => 'web']);

        // Konteks akademik aktif dibutuhkan oleh tabel `attendances` yang
        // partitioned pada PostgreSQL (academic_year_id/semester_id/month).
        $ay = AcademicYear::create([
            'name' => 'Tahun Ajaran Test ' . Str::random(4),
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'is_active' => true,
        ]);
        Semester::create([
            'academic_year_id' => $ay->id,
            'name' => 'Semester Ganjil',
            'sequence' => 1,
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'is_active' => true,
        ]);
    }

    public function test_superadmin_can_login_with_username_and_password_only(): void
    {
        $superadmin = User::create([
            'name' => 'Superadmin Test',
            'username' => 'superadmin_test',
            'email' => 'superadmin_test@school-erp.local',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);
        $superadmin->assignRole('Super Admin');

        $response = $this->postJson('/api/v2/auth/login/admin', [
            'username' => 'superadmin_test',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user', 'portal'])
            ->assertJson(['portal' => 'admin']);
    }

    public function test_admin_cannot_use_qr_login(): void
    {
        $admin = User::create([
            'name' => 'Admin Test',
            'username' => 'admin_test',
            'email' => 'admin_test@school-erp.local',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);
        $admin->assignRole('Admin');

        $response = $this->postJson('/api/v2/auth/login/employee-qr', [
            'qr_token' => 'invalid-token',
        ]);

        $response->assertStatus(401);
    }

    public function test_employee_can_login_via_niy_and_records_daily_attendance_once(): void
    {
        $user = User::create([
            'name' => 'Employee Test',
            'username' => 'emp001',
            'email' => 'emp001@school-erp.local',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);
        $user->assignRole('Guru');

        $employee = Employee::create([
            'niy' => 'NIY999',
            'nama_lengkap' => 'Employee Test',
            'status' => 'AKTIF',
            'user_id' => $user->id,
        ]);

        // First login -> records attendance
        $response1 = $this->postJson('/api/v2/auth/login/employee', [
            'identifier' => 'NIY999',
            'password' => 'Password123!',
        ]);

        $response1->assertStatus(200);
        $this->assertDatabaseHas('attendances', [
            'employee_id' => $employee->id,
            'attendance_date' => now()->toDateString(),
        ]);

        $count = Attendance::where('employee_id', $employee->id)
            ->where('attendance_date', now()->toDateString())
            ->count();
        $this->assertEquals(1, $count);

        // Second login (re-login or refresh) -> does NOT duplicate attendance
        $response2 = $this->postJson('/api/v2/auth/login/employee', [
            'identifier' => 'NIY999',
            'password' => 'Password123!',
        ]);

        $response2->assertStatus(200);
        $countAfter = Attendance::where('employee_id', $employee->id)
            ->where('attendance_date', now()->toDateString())
            ->count();
        $this->assertEquals(1, $countAfter);
    }

    public function test_employee_can_login_via_valid_qr_token(): void
    {
        $user = User::create([
            'name' => 'Guru QR Test',
            'username' => 'guruqr',
            'email' => 'guruqr@school-erp.local',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);
        $user->assignRole('Guru');

        $employee = Employee::create([
            'niy' => 'NIY777',
            'nama_lengkap' => 'Guru QR Test',
            'status' => 'AKTIF',
            'user_id' => $user->id,
        ]);

        $rawToken = Str::uuid()->toString();
        $tokenHash = hash('sha256', $rawToken);

        QrCredential::create([
            'user_id' => $user->id,
            'employee_id' => $employee->id,
            'card_type' => 'employee_card',
            'token_hash' => $tokenHash,
            'status' => 'active',
            'issued_at' => now(),
        ]);

        $response = $this->postJson('/api/v2/auth/login/employee-qr', [
            'qr_token' => $rawToken,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user', 'portal']);
    }

    public function test_admin_delete_request_and_superadmin_approval_flow(): void
    {
        $admin = User::create([
            'name' => 'Admin Requester',
            'username' => 'admin_req',
            'email' => 'admin_req@school-erp.local',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);
        $admin->assignRole('Admin');

        $superadmin = User::create([
            'name' => 'Superadmin Approver',
            'username' => 'super_appr',
            'email' => 'super_appr@school-erp.local',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);
        $superadmin->assignRole('Super Admin');

        // Target record to be deleted
        $targetUser = User::create([
            'name' => 'User To Delete',
            'email' => 'todelete@school-erp.local',
            'password' => Hash::make('Password123!'),
            'is_active' => true,
        ]);

        // 1. Admin creates delete request
        $responseReq = $this->actingAs($admin)->postJson('/api/v2/approval/delete-requests', [
            'target_table' => 'users',
            'target_id' => $targetUser->id,
            'target_label' => 'User To Delete',
            'reason' => 'Data duplikat tidak terpakai.',
        ]);

        $responseReq->assertStatus(201);
        $deleteRequestId = $responseReq->json('data.id');

        // Target user is NOT deleted yet
        $this->assertDatabaseHas('users', ['id' => $targetUser->id, 'deleted_at' => null]);

        // 2. Superadmin approves delete request
        $responseApprove = $this->actingAs($superadmin)->postJson("/api/v2/approval/delete-requests/{$deleteRequestId}/approve");

        $responseApprove->assertStatus(200);

        // Target user is now soft deleted
        $this->assertDatabaseMissing('users', ['id' => $targetUser->id, 'deleted_at' => null]);
        $this->assertDatabaseHas('delete_requests', ['id' => $deleteRequestId, 'status' => 'approved']);
    }

    public function test_foundation_read_only_middleware_allows_only_explicit_personal_paths(): void
    {
        $foundationUser = Mockery::mock();
        $foundationUser->shouldReceive('hasRole')->with('Super Admin')->andReturnFalse();
        $foundationUser->shouldReceive('hasAnyRole')->andReturnTrue();
        $middleware = app(EnsureFoundationReadOnly::class);
        $next = fn () => response()->json(['status' => 'ok']);

        $blockedRequest = Request::create('/api/profile-data', 'POST');
        $blockedRequest->setUserResolver(fn () => $foundationUser);
        $this->assertSame(403, $middleware->handle($blockedRequest, $next)->getStatusCode());

        $allowedRequest = Request::create('/api/foundation/profile', 'PATCH');
        $allowedRequest->setUserResolver(fn () => $foundationUser);
        $this->assertSame(200, $middleware->handle($allowedRequest, $next)->getStatusCode());
    }
}
