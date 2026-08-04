<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DefaultRoleUserSeeder extends Seeder
{
    /**
     * Akun bootstrap untuk pengujian setiap role.
     *
     * Password dapat dioverride lewat environment dan wajib diganti setelah
     * instalasi produksi. updateOrCreate membuat seeder aman dijalankan ulang.
     */
    public function run(): void
    {
        $accounts = [
            'Super Admin' => [
                'name' => 'Super Admin',
                'username' => 'superadmin',
                'email' => 'superadmin@school-erp.local',
                'password' => env('DEFAULT_SUPER_ADMIN_PASSWORD', 'Password123!'),
            ],
            'Admin' => [
                'name' => 'Admin Sistem',
                'username' => 'admin',
                'email' => 'admin@school-erp.local',
                'password' => env('DEFAULT_ADMIN_PASSWORD', 'Admin@2026!'),
            ],
            'Yayasan' => [
                'name' => 'Pengurus Yayasan',
                'username' => 'yayasan',
                'email' => 'yayasan@school-erp.local',
                'password' => env('DEFAULT_YAYASAN_PASSWORD', 'Yayasan@2026!'),
            ],
            'ketua_yayasan' => [
                'name' => 'Ketua Yayasan',
                'username' => 'ketua_yayasan',
                'email' => 'ketua.yayasan@school-erp.local',
                'password' => env('DEFAULT_KETUA_YAYASAN_PASSWORD', 'Yayasan@2026!'),
            ],
            'sekretaris_yayasan' => [
                'name' => 'Sekretaris Yayasan',
                'username' => 'sekretaris_yayasan',
                'email' => 'sekretaris.yayasan@school-erp.local',
                'password' => env('DEFAULT_SEKRETARIS_YAYASAN_PASSWORD', 'Yayasan@2026!'),
            ],
            'bendahara_yayasan' => [
                'name' => 'Bendahara Yayasan',
                'username' => 'bendahara_yayasan',
                'email' => 'bendahara.yayasan@school-erp.local',
                'password' => env('DEFAULT_BENDAHARA_YAYASAN_PASSWORD', 'Yayasan@2026!'),
            ],
            'pengurus_yayasan' => [
                'name' => 'Pengurus Yayasan',
                'username' => 'pengurus_yayasan',
                'email' => 'pengurus.yayasan@school-erp.local',
                'password' => env('DEFAULT_PENGURUS_YAYASAN_PASSWORD', 'Yayasan@2026!'),
            ],
            'Kepala Sekolah' => [
                'name' => 'Kepala Sekolah',
                'username' => 'kepsek',
                'email' => 'kepsek@school-erp.local',
                'password' => env('DEFAULT_KEPSEK_PASSWORD', 'Kepsek@2026!'),
            ],
            'Divisi Pendidikan' => [
                'name' => 'Divisi Pendidikan',
                'username' => 'divisi',
                'email' => 'divisi.pendidikan@school-erp.local',
                'password' => env('DEFAULT_DIVISI_PASSWORD', 'Divisi@2026!'),
            ],
            'Tata Usaha' => [
                'name' => 'Tata Usaha',
                'username' => 'tu',
                'email' => 'tu@school-erp.local',
                'password' => env('DEFAULT_TU_PASSWORD', 'TU@2026!'),
            ],
            'Guru' => [
                'name' => 'Guru',
                'username' => 'guru',
                'email' => 'guru@school-erp.local',
                'password' => env('DEFAULT_GURU_PASSWORD', 'Guru@2026!'),
            ],
            'Guru Tahfizh' => [
                'name' => 'Guru Tahfizh',
                'username' => 'guru.tahfizh',
                'email' => 'guru.tahfizh@school-erp.local',
                'password' => env('DEFAULT_GURU_TAHFIZH_PASSWORD', 'Tahfizh@2026!'),
            ],
            'Musyrif' => [
                'name' => 'Musyrif',
                'username' => 'musyrif',
                'email' => 'musyrif@school-erp.local',
                'password' => env('DEFAULT_MUSYRIF_PASSWORD', 'Musyrif@2026!'),
            ],
            'Orang Tua' => [
                'name' => 'Orang Tua',
                'username' => 'orangtua',
                'email' => 'orangtua@school-erp.local',
                'password' => env('DEFAULT_ORANG_TUA_PASSWORD', 'OrangTua@2026!'),
            ],
            'Siswa' => [
                'name' => 'Siswa',
                'username' => 'siswa',
                'email' => 'siswa@school-erp.local',
                'password' => env('DEFAULT_SISWA_PASSWORD', 'Siswa@2026!'),
            ],
        ];

        foreach ($accounts as $role => $account) {
            \App\Models\Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);

            $user = User::query()->updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'username' => $account['username'],
                    'password' => \Illuminate\Support\Facades\Hash::make($account['password']),
                    'is_active' => true,
                    'metadata' => [
                        'created_by' => 'default_role_user_seeder',
                        'must_change_password' => true,
                        'bootstrap_role' => $role,
                    ],
                ],
            );

            $user->syncRoles([$role]);
        }
    }
}
