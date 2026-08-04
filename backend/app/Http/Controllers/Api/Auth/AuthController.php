<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserProfileResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        [$user, $token, $attendanceSummary] = $this->authService->login(
            email: $request->validated('email'),
            password: $request->validated('password'),
            deviceName: $request->validated('device_name', 'school-erp-client')
        );

        return response()->json([
            'message' => 'Login berhasil.',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserProfileResource($user),
            'attendance_summary' => $attendanceSummary,
        ]);
    }

    public function loginAdmin(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        $result = $this->authService->loginAdminSystem(
            username: $request->input('username'),
            password: $request->input('password'),
            deviceName: $request->input('device_name', 'web-dashboard'),
            ipAddress: $request->ip()
        );

        return response()->json([
            'message' => 'Login Superadmin/Admin berhasil.',
            'token' => $result['token'],
            'token_type' => 'Bearer',
            'user' => new UserProfileResource($result['user']),
            'portal' => $result['portal'],
        ]);
    }

    public function loginEmployee(Request $request): JsonResponse
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        $result = $this->authService->loginEmployeeGuru(
            identifier: $request->input('identifier'),
            password: $request->input('password'),
            deviceName: $request->input('device_name', 'web-dashboard'),
            ipAddress: $request->ip()
        );

        return response()->json([
            'message' => 'Login Pegawai/Guru berhasil.',
            'token' => $result['token'],
            'token_type' => 'Bearer',
            'user' => new UserProfileResource($result['user']),
            'portal' => $result['portal'],
            'attendance_summary' => $result['attendance_summary'] ?? null,
        ]);
    }

    public function loginEmployeeQr(Request $request): JsonResponse
    {
        $request->validate([
            'qr_token' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        $result = $this->authService->loginEmployeeQr(
            qrToken: $request->input('qr_token'),
            deviceName: $request->input('device_name', 'mobile-app'),
            ipAddress: $request->ip()
        );

        return response()->json([
            'message' => 'Login QR Code Pegawai berhasil.',
            'token' => $result['token'],
            'token_type' => 'Bearer',
            'user' => new UserProfileResource($result['user']),
            'portal' => $result['portal'],
            'attendance_summary' => $result['attendance_summary'] ?? null,
        ]);
    }

    public function loginParentStudent(Request $request): JsonResponse
    {
        $request->validate([
            'portal_type' => 'required|string|in:student,parent',
            'identifier' => 'required|string',
            'password' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        $result = $this->authService->loginParentStudent(
            portalType: $request->input('portal_type'),
            identifier: $request->input('identifier'),
            password: $request->input('password'),
            deviceName: $request->input('device_name', 'web-dashboard'),
            ipAddress: $request->ip()
        );

        return response()->json([
            'message' => 'Login Portal ' . ucfirst($request->input('portal_type')) . ' berhasil.',
            'token' => $result['token'],
            'token_type' => 'Bearer',
            'user' => new UserProfileResource($result['user']),
            'portal' => $result['portal'],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    public function profile(Request $request): UserProfileResource
    {
        return new UserProfileResource($request->user());
    }

    /**
     * Membuat sesi sementara sebagai pengguna representatif sebuah role.
     * Endpoint ini sengaja hanya dapat dipanggil oleh Super Admin dan role
     * tujuan dibatasi dengan allow-list agar tidak menjadi eskalasi akses.
     */
    public function impersonate(Request $request): JsonResponse
    {
        abort_unless($request->user()?->hasRole('Super Admin'), 403, 'Hanya Super Admin yang dapat menggunakan akses role.');

        $allowedRoles = [
            'Yayasan',
            'Ketua Yayasan',
            'Divisi Pendidikan',
            'Kepala Sekolah',
            'Tata Usaha',
            'Guru',
            'Guru Tahfizh',
            'Musyrif',
            'Orang Tua',
            'Siswa',
        ];

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:' . implode(',', $allowedRoles)],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        $targetRoles = $validated['role'] === 'Yayasan'
            ? ['Yayasan', 'Ketua Yayasan']
            : [$validated['role']];

        $target = User::query()
            ->where('is_active', true)
            ->role($targetRoles)
            ->orderBy('name')
            ->first();

        if (! $target) {
            return response()->json([
                'message' => "Belum ada akun aktif dengan role {$validated['role']}.",
            ], 404);
        }

        $token = $target->createToken($validated['device_name'] ?? 'web-dashboard-impersonation')->plainTextToken;

        return response()->json([
            'message' => "Berhasil masuk sebagai {$validated['role']}.",
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserProfileResource($target),
            'impersonated_by' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
            ],
        ]);
    }
}
