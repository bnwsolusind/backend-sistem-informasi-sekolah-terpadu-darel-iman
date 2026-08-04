<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFoundationReadOnly
{
    /**
     * Middleware untuk memproteksi endpoint operasional dari aksi penulisan (POST/PUT/PATCH/DELETE)
     * khusus untuk role Pengurus Yayasan / monitoring eksekutif.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->hasRole('Super Admin')) {
            $foundationRoles = [
                'Yayasan',
                'Ketua Yayasan',
                'ketua_yayasan',
                'sekretaris_yayasan',
                'bendahara_yayasan',
                'pengurus_yayasan',
            ];

            if ($user->hasAnyRole($foundationRoles)) {
                $method = strtoupper($request->method());

                if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
                    $path = $request->path();

                    // Izinkan mutation hanya pada profil pribadi dan notifikasi pribadi yayasan
                    $isAllowedProfile = str_contains($path, 'foundation/profile') || str_contains($path, 'profile');
                    $isAllowedNotification = str_contains($path, 'foundation/notifications') || str_contains($path, 'notifications');

                    if (! $isAllowedProfile && ! $isAllowedNotification) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Akses ditolak. Role Pengurus Yayasan bersifat Read-Only Monitoring dan tidak memiliki akses mutasi data operasional.',
                        ], 403);
                    }
                }
            }
        }

        return $next($request);
    }
}
