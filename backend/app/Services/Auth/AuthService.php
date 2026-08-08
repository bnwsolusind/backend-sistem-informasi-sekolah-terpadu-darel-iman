<?php

namespace App\Services\Auth;

use App\Exceptions\Auth\AuthLoginException;
use App\Models\LoginEvent;
use App\Models\QrCredential;
use App\Models\User;
use App\Services\Attendance\EmployeeAttendanceService;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class AuthService
{
    public function __construct(
        private readonly AuthIdentifierResolver $resolver,
        private readonly EmployeeAttendanceService $employeeAttendanceService
    ) {}

    /**
     * Portal 1: Superadmin & Admin System Login (email / No. HP + password).
     * Source of truth: users.email / users.phone (PostgreSQL).
     */
    public function loginAdminSystem(string $username, string $password, string $deviceName = 'web-dashboard', ?string $ipAddress = null): array
    {
        $identifier = trim($username);

        $user = $this->resolver->resolveAdminUser($identifier);

        if (! $user) {
            $this->fail(
                AuthLoginException::IDENTIFIER_NOT_FOUND,
                'Username/Email/No. HP atau password tidak valid.',
                null, 'admin', $identifier, $ipAddress
            );
        }

        if (! $user->hasAnyRole(['Super Admin', 'Admin', 'Superadmin'])) {
            $this->fail(
                AuthLoginException::ROLE_NOT_ASSIGNED,
                'Akses ditolak. Portal ini khusus untuk Superadmin dan Admin.',
                $user, 'admin', $identifier, $ipAddress
            );
        }

        $this->verifyPasswordOrFail($user, $password, 'admin', $identifier, $ipAddress);
        $this->assertActiveOrFail($user, 'admin', $identifier, $ipAddress);

        $token = $user->createToken($deviceName)->plainTextToken;
        $loginEvent = $this->logLoginEvent($user, 'admin', $identifier, 'username_password', 'success', null, $ipAddress);

        return [
            'user' => $user,
            'token' => $token,
            'login_event_id' => $loginEvent?->id,
            'portal' => 'admin',
        ];
    }

    /**
     * Portal 2: Pegawai & Guru Login (No. HP / NIY / Email + password).
     *
     * Identifier di-resolve dari PostgreSQL (employees.niy / no_hp / email /
     * nik, fallback teachers.employee_number / phone / email). Akun pegawai
     * tanpa linked User DITOLAK (EMPLOYEE_ACCOUNT_NOT_LINKED).
     */
    public function loginEmployeeGuru(string $identifier, string $password, string $deviceName = 'web-dashboard', ?string $ipAddress = null): array
    {
        $input = trim($identifier);
        $resolved = $this->resolver->resolveEmployee($input);

        $actor = $resolved['employee'] ?? $resolved['teacher'];
        $user = $resolved['user'];

        if (! $actor) {
            $this->fail(
                AuthLoginException::IDENTIFIER_NOT_FOUND,
                'Kredensial pegawai/guru atau password tidak valid.',
                null, 'employee', $input, $ipAddress
            );
        }

        if (! $user) {
            $this->fail(
                AuthLoginException::ACCOUNT_NOT_LINKED,
                'Kredensial pegawai/guru atau password tidak valid.',
                null, 'employee', $input, $ipAddress
            );
        }

        $this->verifyPasswordOrFail($user, $password, 'employee', $input, $ipAddress);
        $this->assertActiveOrFail($user, 'employee', $input, $ipAddress);

        $token = $user->createToken($deviceName)->plainTextToken;
        $loginEvent = $this->logLoginEvent($user, 'employee', $input, 'identifier_password', 'success', null, $ipAddress);

        $attendanceResult = $this->processEmployeeAttendance($user, 'login_password', $ipAddress);

        return [
            'user' => $user,
            'token' => $token,
            'login_event_id' => $loginEvent?->id,
            'portal' => 'employee',
            'attendance_summary' => $attendanceResult,
        ];
    }

    /**
     * Portal 2 Alternative: Scan QR ID Card Pegawai.
     */
    public function loginEmployeeQr(string $qrToken, string $deviceName = 'mobile-app', ?string $ipAddress = null): array
    {
        $rawToken = trim($qrToken);
        $tokenHash = hash('sha256', $rawToken);

        $qrCredential = QrCredential::query()
            ->where(function ($q) use ($rawToken, $tokenHash) {
                $q->where('token_hash', $tokenHash)
                    ->orWhere('token_hash', $rawToken);
            })
            ->where('card_type', 'employee_card')
            ->active()
            ->first();

        if (! $qrCredential) {
            $this->logLoginEvent(null, 'employee', 'QR_SCAN', 'qr_code', 'failed', AuthLoginException::IDENTIFIER_NOT_FOUND, $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'QR Code ID Card Pegawai tidak valid, kedaluwarsa, atau telah dicabut.');
        }

        $employee = $qrCredential->employee;
        $user = $qrCredential->user ?? ($employee?->user_id ? User::query()->find($employee->user_id) : null);

        if (! $user || ! $user->is_active) {
            $this->logLoginEvent($user, 'employee', 'QR_SCAN', 'qr_code', 'failed', $user ? AuthLoginException::ACCOUNT_INACTIVE : AuthLoginException::ACCOUNT_NOT_LINKED, $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Akun pegawai terkait QR Code tidak aktif.');
        }

        $qrCredential->update(['last_used_at' => now()]);

        $token = $user->createToken($deviceName)->plainTextToken;
        $loginEvent = $this->logLoginEvent($user, 'employee', 'QR_SCAN', 'qr_code', 'success', null, $ipAddress);

        $attendanceResult = $this->processEmployeeAttendance($user, 'login_qr', $ipAddress);

        return [
            'user' => $user,
            'token' => $token,
            'login_event_id' => $loginEvent?->id,
            'portal' => 'employee',
            'attendance_summary' => $attendanceResult,
        ];
    }

    /**
     * Portal 3: Orang Tua & Siswa Login (No. HP / NIK Ayah / NIK Ibu /
     * NIS anak / email + password/PIN).
     *
     * - portal_type = parent  → resolve household; scope = parent_id; response
     *   membawa SELURUH anak terhubung (child switcher).
     * - portal_type = student → resolve siswa; scope = self only (TANPA akses
     *   saudara kandung).
     */
    public function loginParentStudent(string $portalType, string $identifier, string $password, string $deviceName = 'web-dashboard', ?string $ipAddress = null): array
    {
        $input = trim($identifier);
        $isStudent = strtolower($portalType) === 'student';

        if ($isStudent) {
            $resolved = $this->resolver->resolveStudent($input);
            $student = $resolved['student'];
            $user = $resolved['user'];

            if (! $student) {
                $this->fail(
                    AuthLoginException::IDENTIFIER_NOT_FOUND,
                    'Kredensial atau password/PIN tidak valid.',
                    null, 'student', $input, $ipAddress
                );
            }

            if (! $user) {
                $this->fail(
                    AuthLoginException::STUDENT_NOT_LINKED,
                    'Kredensial atau password/PIN tidak valid.',
                    null, 'student', $input, $ipAddress
                );
            }

            if (! $student->is_active) {
                $this->fail(
                    AuthLoginException::STUDENT_NOT_ACTIVE,
                    'Akun siswa tidak aktif. Hubungi pihak sekolah.',
                    $user, 'student', $input, $ipAddress
                );
            }

            $this->verifyPasswordOrFail($user, $password, 'student', $input, $ipAddress);
            $this->assertActiveOrFail($user, 'student', $input, $ipAddress);

            $token = $user->createToken($deviceName)->plainTextToken;
            $loginEvent = $this->logLoginEvent($user, 'student', $input, 'identifier_password', 'success', null, $ipAddress);

            return [
                'user' => $user,
                'token' => $token,
                'login_event_id' => $loginEvent?->id,
                'portal' => 'student',
                'student' => $student,
                'children' => null, // siswa: self scope
            ];
        }

        // ===== Parent portal =====
        $resolved = $this->resolver->resolveParent($input);
        $parent = $resolved['parent'];
        $user = $resolved['user'];

        if (! $parent) {
            $reason = $resolved['child_matched']
                ? AuthLoginException::PARENT_NOT_LINKED
                : AuthLoginException::IDENTIFIER_NOT_FOUND;

            $this->fail(
                $reason,
                'Kredensial atau password/PIN tidak valid.',
                null, 'parent', $input, $ipAddress
            );
        }

        if (! $user) {
            $this->fail(
                AuthLoginException::PARENT_NOT_LINKED,
                'Kredensial atau password/PIN tidak valid.',
                null, 'parent', $input, $ipAddress
            );
        }

        $this->verifyPasswordOrFail($user, $password, 'parent', $input, $ipAddress);
        $this->assertActiveOrFail($user, 'parent', $input, $ipAddress);

        $token = $user->createToken($deviceName)->plainTextToken;
        $loginEvent = $this->logLoginEvent($user, 'parent', $input, 'identifier_password', 'success', null, $ipAddress);

        $children = $this->resolver->childrenForParent($parent);

        return [
            'user' => $user,
            'token' => $token,
            'login_event_id' => $loginEvent?->id,
            'portal' => 'parent',
            'parent' => $parent,
            'children' => $children,
        ];
    }

    /**
     * Legacy unified login untuk backward compatibility.
     */
    public function login(string $email, string $password, string $deviceName = 'web-client'): array
    {
        $input = trim($email);
        $user = $this->resolver->resolveAdminUser($input);

        if (! $user) {
            $resolved = $this->resolver->resolveEmployee($input);
            $user = $resolved['user'];
        }

        if (! $user) {
            $resolved = $this->resolver->resolveStudent($input);
            $user = $resolved['user'];
        }

        if (! $user) {
            $resolved = $this->resolver->resolveParent($input);
            $user = $resolved['user'];
        }

        if (! $user) {
            throw new UnauthorizedHttpException('Bearer', 'Username/Email/NIP/NIS/NIK atau password tidak valid.');
        }

        $passwordValid = $this->verifyPassword($user, $password);
        if (! $passwordValid) {
            throw new UnauthorizedHttpException('Bearer', 'Username/Email/NIP/NIS/NIK atau password tidak valid.');
        }

        if (! $user->is_active) {
            throw new UnauthorizedHttpException('Bearer', 'Akun tidak aktif. Hubungi Administrator.');
        }

        $token = $user->createToken($deviceName)->plainTextToken;

        $attendanceResult = null;
        if ($user->hasAnyRole(['Guru', 'Kepala Sekolah', 'Divisi Pendidikan', 'Tata Usaha', 'Wali Kelas', 'Pegawai', 'Operator'])) {
            $attendanceResult = $this->processEmployeeAttendance($user, 'login_password');
        }

        $this->logLoginEvent($user, 'unified', $input, 'identifier_password', 'success', null);

        return [$user, $token, $attendanceResult];
    }

    /* =====================================================================
     * Helpers
     * ===================================================================== */

    private function verifyPassword(User $user, string $password): bool
    {
        return Hash::check($password, $user->password);
    }

    private function verifyPasswordOrFail(User $user, string $password, string $portalType, string $identifier, ?string $ipAddress): void
    {
        if (! $this->verifyPassword($user, $password)) {
            $this->fail(
                AuthLoginException::PASSWORD_INVALID,
                'Kredensial atau password/PIN tidak valid.',
                $user, $portalType, $identifier, $ipAddress
            );
        }
    }

    private function assertActiveOrFail(User $user, string $portalType, string $identifier, ?string $ipAddress): void
    {
        if (! $user->is_active) {
            $this->fail(
                AuthLoginException::ACCOUNT_INACTIVE,
                'Akun tidak aktif. Hubungi Administrator.',
                $user, $portalType, $identifier, $ipAddress
            );
        }
    }

    private function fail(string $reason, string $genericMessage, ?User $user, string $portalType, string $identifier, ?string $ipAddress): never
    {
        $this->logLoginEvent($user, $portalType, $identifier, 'identifier_password', 'failed', $reason, $ipAddress);
        throw new AuthLoginException($reason, $genericMessage);
    }

    /**
     * Proses absensi otomatis pegawai saat login. Kegagalan pada modul absensi
     * tidak boleh menghalangi proses login.
     */
    private function processEmployeeAttendance(User $user, string $method, ?string $ipAddress = null)
    {
        try {
            return $this->employeeAttendanceService->processEmployeeLoginAttendance($user, $method, $ipAddress);
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    private function logLoginEvent(?User $user, string $portalType, ?string $identifier, string $method, string $status, ?string $failureReason = null, ?string $ipAddress = null): ?LoginEvent
    {
        try {
            return LoginEvent::create([
                'user_id' => $user?->id,
                'portal_type' => $portalType,
                'identifier_used' => $identifier,
                'login_method' => $method,
                'status' => $status,
                'failure_reason' => $failureReason,
                'ip_address' => $ipAddress ?? request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Throwable $e) {
            // Log failure should not block login flow
            return null;
        }
    }
}
