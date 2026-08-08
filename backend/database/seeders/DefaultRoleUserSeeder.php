<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\Kelas;
use App\Models\ParentModel;
use App\Models\Role;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentParent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DefaultRoleUserSeeder extends Seeder
{
    /** @var list<string> */
    private const CANONICAL_ROLES = [
        'Super Admin',
        'Ketua Yayasan',
        'Pengurus Yayasan',
        'Sekretaris Yayasan',
        'Bendahara Yayasan',
        'Kepala Bidang Pendidikan',
        'Divisi Kurikulum',
        'Divisi Kesiswaan',
        'Divisi Bahasa',
        'Divisi Program Khusus',
        'Kepala Sekolah',
        'Wakil Kepala Sekolah',
        'Wakil Kurikulum',
        'Wakil Kesiswaan',
        'Tata Usaha',
        'Operator',
        'Guru',
        'Guru Tahfizh',
        'Guru BK',
        'Wali Kelas',
        'Musyrif',
        'Orang Tua',
        'Siswa',
        'Alumni',
    ];

    /**
     * Membuat satu akun login berelasi untuk setiap role kanonik.
     *
     * User memakai cast `hashed`, sehingga nilai password yang tersimpan di
     * PostgreSQL selalu hash. updateOrCreate menjaga seeder idempotent.
     */
    public function run(): void
    {
        $unit = EducationUnit::query()->where('is_active', true)->orderBy('code')->first();
        $academicYear = AcademicYear::query()->where('is_active', true)->first()
            ?? AcademicYear::query()->latest('start_date')->first();
        $semester = Semester::query()->where('is_active', true)->first()
            ?? Semester::query()->where('academic_year_id', $academicYear?->id)->orderBy('sequence')->first();
        $kelas = Kelas::query()->where('status', 'Aktif')->first();
        $defaultPassword = (string) env('DEFAULT_TEST_ACCOUNT_PASSWORD', 'Password123!');
        $canonicalOverrides = [
            'Super Admin' => ['superadmin@school-erp.local', (string) env('DEFAULT_SUPER_ADMIN_PASSWORD', 'Password123!')],
            'Ketua Yayasan' => ['role.ketua.yayasan@school-erp.local', $defaultPassword],
            'Pengurus Yayasan' => ['role.pengurus.yayasan@school-erp.local', $defaultPassword],
            'Sekretaris Yayasan' => ['role.sekretaris.yayasan@school-erp.local', $defaultPassword],
            'Bendahara Yayasan' => ['role.bendahara.yayasan@school-erp.local', $defaultPassword],
            'Kepala Sekolah' => ['kepsek@school-erp.local', (string) env('DEFAULT_KEPSEK_PASSWORD', 'Kepsek@2026!')],
            'Tata Usaha' => ['tu@school-erp.local', (string) env('DEFAULT_TU_PASSWORD', 'TU@2026!')],
            'Guru' => ['guru@school-erp.local', (string) env('DEFAULT_GURU_PASSWORD', 'Guru@2026!')],
            'Guru Tahfizh' => ['guru.tahfizh@school-erp.local', (string) env('DEFAULT_GURU_TAHFIZH_PASSWORD', 'Tahfizh@2026!')],
            'Musyrif' => ['musyrif@school-erp.local', (string) env('DEFAULT_MUSYRIF_PASSWORD', 'Musyrif@2026!')],
            'Orang Tua' => ['orangtua@school-erp.local', (string) env('DEFAULT_ORANG_TUA_PASSWORD', 'OrangTua@2026!')],
            'Siswa' => ['siswa@school-erp.local', (string) env('DEFAULT_SISWA_PASSWORD', 'Siswa@2026!')],
        ];

        $users = [];
        foreach (self::CANONICAL_ROLES as $index => $roleName) {
            $role = Role::query()->firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $slug = Str::slug($roleName, '.');
            $sequence = str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);
            [$email, $password] = $canonicalOverrides[$roleName] ?? [$slug.'@school-erp.local', $defaultPassword];
            $phone = '0812999900'.$sequence;

            $user = User::query()->updateOrCreate(
                ['email' => $email],
                [
                    'name' => $roleName.' Test',
                    'password' => $password,
                    'phone' => $phone,
                    'is_active' => true,
                    'metadata' => [
                        'created_by' => 'default_role_user_seeder',
                        'must_change_password' => true,
                        'bootstrap_role' => $roleName,
                        'education_unit_id' => $unit?->id,
                        'academic_year_id' => $academicYear?->id,
                        'semester_id' => $semester?->id,
                        'data_scope' => $this->dataScopeFor($roleName),
                    ],
                ],
            );

            $user->syncRoles([$role->name]);
            $users[$roleName] = $user;

            if (! in_array($roleName, ['Super Admin', 'Orang Tua', 'Siswa', 'Alumni'], true)) {
                Employee::query()->updateOrCreate(
                    ['niy' => 'TEST-NIY-'.$sequence],
                    [
                        'user_id' => $user->id,
                        'role_id' => $role->id,
                        'unit_id' => $unit?->id,
                        'nama_lengkap' => $user->name,
                        'nama_panggilan' => $roleName,
                        'jenis_kelamin' => 'L',
                        'status_pegawai' => 'Tetap',
                        'tanggal_masuk' => now()->startOfYear()->toDateString(),
                        'status' => 'Aktif',
                        'no_hp' => $phone,
                        'email' => $email,
                        'metadata' => [
                            'fixture' => 'canonical_role_login',
                            'academic_year_id' => $academicYear?->id,
                            'semester_id' => $semester?->id,
                        ],
                    ],
                );
            }
        }

        // Akun alias lama tetap disediakan agar fixture dan integrasi yang
        // sudah memakai identifier historis tidak rusak.
        $legacyAccounts = [
            'Admin' => ['Admin Sistem', 'admin@school-erp.local', (string) env('DEFAULT_ADMIN_PASSWORD', 'Admin@2026!')],
            'Yayasan' => ['Pengurus Yayasan', 'yayasan@school-erp.local', (string) env('DEFAULT_YAYASAN_PASSWORD', 'Yayasan@2026!')],
            'ketua_yayasan' => ['Ketua Yayasan', 'ketua.yayasan@school-erp.local', (string) env('DEFAULT_KETUA_YAYASAN_PASSWORD', 'Yayasan@2026!')],
            'sekretaris_yayasan' => ['Sekretaris Yayasan', 'sekretaris.yayasan@school-erp.local', (string) env('DEFAULT_SEKRETARIS_YAYASAN_PASSWORD', 'Yayasan@2026!')],
            'bendahara_yayasan' => ['Bendahara Yayasan', 'bendahara.yayasan@school-erp.local', (string) env('DEFAULT_BENDAHARA_YAYASAN_PASSWORD', 'Yayasan@2026!')],
            'pengurus_yayasan' => ['Pengurus Yayasan', 'pengurus.yayasan@school-erp.local', (string) env('DEFAULT_PENGURUS_YAYASAN_PASSWORD', 'Yayasan@2026!')],
            'Divisi Pendidikan' => ['Divisi Pendidikan', 'divisi.pendidikan@school-erp.local', (string) env('DEFAULT_DIVISI_PASSWORD', 'Divisi@2026!')],
        ];

        foreach ($legacyAccounts as $roleName => [$name, $email, $password]) {
            Role::query()->firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $user = User::query()->updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => $password,
                    'is_active' => true,
                    'metadata' => [
                        'created_by' => 'default_role_user_seeder',
                        'must_change_password' => true,
                        'bootstrap_role' => $roleName,
                        'education_unit_id' => $unit?->id,
                        'academic_year_id' => $academicYear?->id,
                        'semester_id' => $semester?->id,
                        'data_scope' => $this->dataScopeFor($roleName),
                    ],
                ],
            );
            $user->syncRoles([$roleName]);
        }

        $parentUser = $users['Orang Tua'];
        $parent = ParentModel::withTrashed()->updateOrCreate(
            ['nik' => '1371000000000022'],
            [
                'user_id' => $parentUser->id,
                'full_name' => $parentUser->name,
                'phone' => $parentUser->phone,
                'email' => $parentUser->email,
                'father_nik' => '1371000000000022',
                'mother_nik' => '1371000000000122',
                'occupation' => 'Akun Uji',
                'address' => 'Data fixture pengujian sistem',
                'metadata' => ['fixture' => 'canonical_role_login'],
            ],
        );
        if ($parent->trashed()) {
            $parent->restore();
        }

        foreach (['Siswa' => 'TEST-NIS-023', 'Alumni' => 'TEST-NIS-024'] as $roleName => $nis) {
            $studentUser = $users[$roleName];
            $student = Student::withTrashed()->updateOrCreate(
                ['nis' => $nis],
                [
                    'user_id' => $studentUser->id,
                    'parent_id' => $parent->id,
                    'kelas_id' => $kelas?->id,
                    'unit_id' => $unit?->id,
                    'full_name' => $studentUser->name,
                    'gender' => 'male',
                    'birth_date' => now()->subYears($roleName === 'Alumni' ? 19 : 12)->toDateString(),
                    'birth_place' => 'Padang',
                    'address' => 'Data fixture pengujian sistem',
                    'is_active' => true,
                    'metadata' => [
                        'fixture' => 'canonical_role_login',
                        'academic_year_id' => $academicYear?->id,
                        'semester_id' => $semester?->id,
                        'alumni' => $roleName === 'Alumni',
                    ],
                ],
            );
            if ($student->trashed()) {
                $student->restore();
            }

            StudentParent::query()->updateOrCreate(
                ['student_id' => $student->id, 'parent_id' => $parent->id],
                ['relationship_type' => 'father', 'is_primary' => true, 'metadata' => ['fixture' => true]],
            );
        }
    }

    private function dataScopeFor(string $roleName): string
    {
        return match (true) {
            $roleName === 'Super Admin' => 'global',
            str_contains($roleName, 'Yayasan') || str_starts_with($roleName, 'Kepala Bidang') || str_starts_with($roleName, 'Divisi ') => 'cross_unit_read',
            in_array($roleName, ['Kepala Sekolah', 'Wakil Kepala Sekolah', 'Wakil Kurikulum', 'Wakil Kesiswaan', 'Tata Usaha', 'Operator'], true) => 'education_unit',
            in_array($roleName, ['Guru', 'Guru Tahfizh', 'Guru BK', 'Wali Kelas', 'Musyrif'], true) => 'own_assignments',
            $roleName === 'Orang Tua' => 'linked_children',
            default => 'self',
        };
    }
}
