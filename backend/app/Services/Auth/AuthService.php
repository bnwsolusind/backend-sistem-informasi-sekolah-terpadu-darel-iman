<?php

namespace App\Services\Auth;

use App\Models\Employee;
use App\Models\LoginEvent;
use App\Models\ParentModel;
use App\Models\QrCredential;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Services\Attendance\EmployeeAttendanceService;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class AuthService
{
    public function __construct(
        private readonly EmployeeAttendanceService $employeeAttendanceService
    ) {}

    /**
     * Portal 1: Superadmin & Admin System Login (Username + Password only).
     */
    public function loginAdminSystem(string $username, string $password, string $deviceName = 'web-dashboard', ?string $ipAddress = null): array
    {
        $identifier = trim($username);

        // Find user strictly by username or email (matching username)
        $user = User::query()
            ->where('username', $identifier)
            ->orWhere('email', $identifier)
            ->first();

        if (! $user) {
            $this->logLoginEvent(null, 'admin', $identifier, 'username_password', 'failed', 'Akun admin tidak ditemukan.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Username atau password tidak valid.');
        }

        // Ensure user is Superadmin or Admin
        if (! $user->hasAnyRole(['Super Admin', 'Admin', 'Superadmin'])) {
            $this->logLoginEvent($user, 'admin', $identifier, 'username_password', 'failed', 'Akun tidak memiliki hak akses portal Admin.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Akses ditolak. Portal ini khusus untuk Superadmin dan Admin.');
        }

        $passwordValid = $this->verifyPassword($user, $password);
        if (! $passwordValid) {
            $this->logLoginEvent($user, 'admin', $identifier, 'username_password', 'failed', 'Password tidak valid.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Username atau password tidak valid.');
        }

        if (! $user->is_active) {
            $this->logLoginEvent($user, 'admin', $identifier, 'username_password', 'failed', 'Akun tidak aktif.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Akun tidak aktif. Hubungi Administrator.');
        }

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
     * Portal 2: Pegawai & Guru Login (Username / NIY / No. HP + Password).
     */
    public function loginEmployeeGuru(string $identifier, string $password, string $deviceName = 'web-dashboard', ?string $ipAddress = null): array
    {
        $input = trim($identifier);

        $user = User::query()->where('username', $input)
            ->orWhere('email', $input)
            ->orWhere('phone', $input)
            ->first();

        if (! $user) {
            $employee = Employee::query()->where('niy', $input)
                ->orWhere('nik', $input)
                ->orWhere('no_hp', $input)
                ->orWhere('email', $input)
                ->first();
            if ($employee && $employee->user_id) {
                $user = User::query()->find($employee->user_id);
            }
        }

        if (! $user) {
            $teacher = Teacher::query()->where('employee_number', $input)
                ->orWhere('phone', $input)
                ->orWhere('email', $input)
                ->first();
            if ($teacher && $teacher->user_id) {
                $user = User::query()->find($teacher->user_id);
            }
        }

        if (! $user) {
            $this->logLoginEvent(null, 'employee', $input, 'identifier_password', 'failed', 'Akun pegawai/guru tidak ditemukan.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Kredensial pegawai/guru atau password tidak valid.');
        }

        $passwordValid = $this->verifyPassword($user, $password);
        if (! $passwordValid) {
            $this->logLoginEvent($user, 'employee', $input, 'identifier_password', 'failed', 'Password tidak valid.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Kredensial pegawai/guru atau password tidak valid.');
        }

        if (! $user->is_active) {
            $this->logLoginEvent($user, 'employee', $input, 'identifier_password', 'failed', 'Akun pegawai tidak aktif.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Akun pegawai tidak aktif. Hubungi Administrator.');
        }

        $token = $user->createToken($deviceName)->plainTextToken;
        $loginEvent = $this->logLoginEvent($user, 'employee', $input, 'identifier_password', 'success', null, $ipAddress);

        // Process automatic attendance evaluation for employee
        $attendanceResult = $this->employeeAttendanceService->processEmployeeLoginAttendance($user, 'login_password', $ipAddress);

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
            $this->logLoginEvent(null, 'employee', 'QR_SCAN', 'qr_code', 'failed', 'Token QR ID Card Pegawai tidak valid atau kedaluwarsa.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'QR Code ID Card Pegawai tidak valid, kedaluwarsa, atau telah dicabut.');
        }

        $employee = $qrCredential->employee;
        $user = $qrCredential->user ?? ($employee?->user_id ? User::query()->find($employee->user_id) : null);

        if (! $user || ! $user->is_active) {
            $this->logLoginEvent($user, 'employee', 'QR_SCAN', 'qr_code', 'failed', 'Akun pegawai tidak aktif.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Akun pegawai terkait QR Code tidak aktif.');
        }

        $qrCredential->update(['last_used_at' => now()]);

        $token = $user->createToken($deviceName)->plainTextToken;
        $loginEvent = $this->logLoginEvent($user, 'employee', 'QR_SCAN', 'qr_code', 'success', null, $ipAddress);

        // Process automatic attendance evaluation for employee
        $attendanceResult = $this->employeeAttendanceService->processEmployeeLoginAttendance($user, 'login_qr', $ipAddress);

        return [
            'user' => $user,
            'token' => $token,
            'login_event_id' => $loginEvent?->id,
            'portal' => 'employee',
            'attendance_summary' => $attendanceResult,
        ];
    }

    /**
     * Portal 3: Orang Tua & Siswa Login (NIS / NIK / No. HP + Password/PIN).
     */
    public function loginParentStudent(string $portalType, string $identifier, string $password, string $deviceName = 'web-dashboard', ?string $ipAddress = null): array
    {
        $input = trim($identifier);
        $user = null;
        $isStudent = strtolower($portalType) === 'student';

        if ($isStudent) {
            // Find student by NIS or NISN or Username
            $student = Student::query()->where('nis', $input)
                ->orWhere('nisn', $input)
                ->first();

            if ($student && $student->user_id) {
                $user = User::query()->find($student->user_id);
            }
            if (! $user) {
                $user = User::query()->where('username', $input)->orWhere('email', $input)->first();
            }
        } else {
            // Find Parent by NIK or Phone or Email
            $parent = ParentModel::query()->where('nik', $input)
                ->orWhere('phone', $input)
                ->orWhere('email', $input)
                ->first();

            if ($parent && $parent->user_id) {
                $user = User::query()->find($parent->user_id);
            }
            if (! $user) {
                $user = User::query()->where('username', $input)->orWhere('phone', $input)->orWhere('email', $input)->first();
            }
        }

        if (! $user) {
            $this->logLoginEvent(null, $portalType, $input, 'identifier_password', 'failed', 'Akun tidak ditemukan.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Kredensial atau password/PIN tidak valid.');
        }

        $hasPortalProfile = $isStudent
            ? Student::query()->where('user_id', $user->id)->where('is_active', true)->exists()
            : ParentModel::query()->where('user_id', $user->id)->exists();
        if (! $hasPortalProfile) {
            $this->logLoginEvent($user, $portalType, $input, 'identifier_password', 'failed', 'Profil portal tidak sesuai.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Akun tidak terdaftar pada portal yang dipilih.');
        }

        $passwordValid = $this->verifyPassword($user, $password);
        if (! $passwordValid) {
            $this->logLoginEvent($user, $portalType, $input, 'identifier_password', 'failed', 'Password/PIN tidak valid.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Kredensial atau password/PIN tidak valid.');
        }

        if (! $user->is_active) {
            $this->logLoginEvent($user, $portalType, $input, 'identifier_password', 'failed', 'Akun tidak aktif.', $ipAddress);
            throw new UnauthorizedHttpException('Bearer', 'Akun Anda tidak aktif. Hubungi pihak sekolah.');
        }

        $token = $user->createToken($deviceName)->plainTextToken;
        $loginEvent = $this->logLoginEvent($user, $portalType, $input, 'identifier_password', 'success', null, $ipAddress);

        return [
            'user' => $user,
            'token' => $token,
            'login_event_id' => $loginEvent?->id,
            'portal' => $portalType,
        ];
    }

    /**
     * Legacy login method for backward compatibility.
     */
    public function login(string $email, string $password, string $deviceName = 'web-client'): array
    {
        $input = trim($email);
        $lowerInput = strtolower($input);

        $user = User::query()->where('email', $input)
            ->orWhere('email', $lowerInput)
            ->orWhere('username', $input)
            ->orWhere('username', $lowerInput)
            ->orWhere('phone', $input)
            ->first();

        if (! $user) {
            $teacher = Teacher::query()->where('employee_number', $input)
                ->orWhere('email', $input)
                ->orWhere('email', $lowerInput)
                ->orWhere('phone', $input)
                ->first();
            if ($teacher && $teacher->user_id) {
                $user = User::query()->find($teacher->user_id);
            }
        }

        if (! $user) {
            $employee = Employee::query()->where('niy', $input)
                ->orWhere('nik', $input)
                ->orWhere('no_hp', $input)
                ->orWhere('email', $input)
                ->orWhere('email', $lowerInput)
                ->first();
            if ($employee && $employee->user_id) {
                $user = User::query()->find($employee->user_id);
            }
        }

        if (! $user) {
            $student = Student::query()->where('nis', $input)
                ->orWhere('nisn', $input)
                ->orWhere('user_id', function ($q) use ($input, $lowerInput) {
                    $q->select('id')->from('users')->where('username', $input)->orWhere('username', $lowerInput);
                })
                ->first();
            if ($student && $student->user_id) {
                $user = User::query()->find($student->user_id);
            }
        }

        if (! $user) {
            $parent = ParentModel::query()->where('nik', $input)
                ->orWhere('phone', $input)
                ->orWhere('email', $input)
                ->orWhere('email', $lowerInput)
                ->first();
            if ($parent && $parent->user_id) {
                $user = User::query()->find($parent->user_id);
            }
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
            $attendanceResult = $this->employeeAttendanceService->processEmployeeLoginAttendance($user, 'login_password');
        }

        $this->logLoginEvent($user, 'unified', $input, 'identifier_password', 'success', null);

        return [$user, $token, $attendanceResult];
    }

    private function verifyPassword(User $user, string $password): bool
    {
        return Hash::check($password, $user->password);
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
