<?php

namespace App\Http\Middleware;

use App\Support\RoleName;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFoundationReadOnly
{
    /**
     * Middleware untuk memproteksi endpoint operasional dari aksi penulisan (POST/PUT/PATCH/DELETE)
     * khusus untuk role yayasan monitoring; Pengurus Yayasan mendapat
     * pengecualian terbatas pada modul personel dan hak akses global.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! RoleName::userHasAny($user, ['Super Admin'])) {
            $foundationRoles = [
                'Yayasan',
                'Ketua Yayasan',
                'Pengurus Yayasan',
                'Sekretaris Yayasan',
                'Bendahara Yayasan',
            ];

            if (RoleName::userHasAny($user, $foundationRoles)) {
                $method = strtoupper($request->method());

                if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
                    // Izinkan mutation hanya pada profil pribadi dan notifikasi pribadi yayasan
                    $isAllowedProfile = $request->is('api/foundation/profile', 'api/foundation/profile/*', 'api/profile', 'api/profile/*');
                    $isAllowedNotification = $request->is('api/foundation/notifications', 'api/foundation/notifications/*', 'api/notifications');

                    $isAllowedGlobalPersonnel = RoleName::userHasAny($user, ['Pengurus Yayasan', 'pengurus_yayasan'])
                        && $request->is(
                            'api/hak-akses',
                            'api/hak-akses/*',
                            'api/employees',
                            'api/employees/*',
                            'api/jabatan',
                            'api/jabatan/*'
                        );

                    $isAllowedAssessmentFormula = RoleName::userHasAny($user, ['Pengurus Yayasan', 'pengurus_yayasan'])
                        && $request->is('api/assessment-formulas', 'api/assessment-formulas/*')
                        && $user->hasAnyPermission([
                            'assessment_formula.create', 'assessment_formula.update', 'assessment_formula.submit',
                            'assessment_formula.approve', 'assessment_formula.activate', 'assessment_formula.archive',
                        ]);

                    $isAllowedWorshipAssessment = RoleName::userHasAny($user, ['Pengurus Yayasan', 'pengurus_yayasan'])
                        && $request->is('api/worship-assessment-settings', 'api/worship-assessment-settings/*')
                        && $user->can('worship_assessment.setting.manage');

                    if (! $isAllowedProfile && ! $isAllowedNotification && ! $isAllowedGlobalPersonnel && ! $isAllowedAssessmentFormula && ! $isAllowedWorshipAssessment) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Akses ditolak. Role yayasan monitoring tidak memiliki akses mutasi data operasional.',
                        ], 403);
                    }
                }
            }
        }

        return $next($request);
    }
}
