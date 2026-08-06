<?php

namespace App\Services;

use App\Models\ClassSchedule;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\Kelas;
use App\Models\ParentModel;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class AccessScopeService
{
    /**
     * Scope query Unit Pendidikan yang berhak diakses user.
     */
    public function accessibleEducationUnits(User $user): Builder
    {
        if ($this->hasAnyRole($user, ['Super Admin', 'super_admin', 'Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'pengurus_yayasan', 'Pengurus Yayasan'])) {
            return EducationUnit::query();
        }

        $employee = Employee::query()->where('user_id', $user->id)->first();
        if ($employee && $employee->unit_id) {
            return EducationUnit::query()->whereKey($employee->unit_id);
        }

        $student = Student::query()->where('user_id', $user->id)->first();
        if ($student && ($student->unit_id || $student->education_unit_id)) {
            $unitId = $student->unit_id ?? $student->education_unit_id;
            return EducationUnit::query()->whereKey($unitId);
        }

        $parent = ParentModel::query()->where('user_id', $user->id)->first();
        if ($parent) {
            $unitIds = Student::query()
                ->where(fn ($q) => $q->where('parent_id', $parent->id)->orWhereHas('parentsPivot', fn ($p) => $p->whereKey($parent->id)))
                ->pluck('unit_id')
                ->filter()
                ->unique();

            return EducationUnit::query()->whereIn('id', $unitIds);
        }

        return EducationUnit::query()->whereRaw('1 = 0');
    }

    /**
     * Scope query Rombel / Kelas yang berhak diakses user.
     */
    public function accessibleRombels(User $user): Builder
    {
        if ($this->hasAnyRole($user, ['Super Admin', 'super_admin', 'Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'pengurus_yayasan', 'Pengurus Yayasan', 'Divisi Pendidikan', 'divisi_pendidikan', 'Kepala Sekolah', 'kepala_sekolah', 'Waka Kurikulum', 'waka_kurikulum', 'Waka Kesiswaan', 'waka_kesiswaan', 'Tata Usaha', 'TU', 'tata_usaha', 'Guru BK', 'guru_bk'])) {
            $unitIds = $this->accessibleEducationUnits($user)->pluck('id');
            return Kelas::query()->whereIn('unit_pendidikan_id', $unitIds);
        }

        $employee = Employee::query()->where('user_id', $user->id)->first();
        if ($employee) {
            // Rombel yang diajar atau di-walikelasi
            $teachingRombelIds = ClassSchedule::query()
                ->where(fn ($q) => $q->where('employee_id', $employee->id)->orWhere('teacher_id', $employee->id))
                ->pluck('kelas_id')
                ->filter();
            $homeroomRombelIds = Kelas::query()->where('wali_kelas_id', $employee->id)->pluck('id');
            $allIds = $teachingRombelIds->merge($homeroomRombelIds)->unique();

            return Kelas::query()->whereIn('id', $allIds);
        }

        $student = Student::query()->where('user_id', $user->id)->first();
        if ($student && $student->kelas_id) {
            return Kelas::query()->whereKey($student->kelas_id);
        }

        $parent = ParentModel::query()->where('user_id', $user->id)->first();
        if ($parent) {
            $childRombelIds = Student::query()
                ->where(fn ($q) => $q->where('parent_id', $parent->id)->orWhereHas('parentsPivot', fn ($p) => $p->whereKey($parent->id)))
                ->pluck('kelas_id')
                ->filter()
                ->unique();

            return Kelas::query()->whereIn('id', $childRombelIds);
        }

        return Kelas::query()->whereRaw('1 = 0');
    }

    /**
     * Scope query Siswa yang berhak diakses user.
     */
    public function accessibleStudents(User $user): Builder
    {
        if ($this->hasAnyRole($user, ['Super Admin', 'super_admin', 'Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'pengurus_yayasan', 'Pengurus Yayasan', 'Divisi Pendidikan', 'divisi_pendidikan', 'Kepala Sekolah', 'kepala_sekolah', 'Waka Kesiswaan', 'waka_kesiswaan', 'Tata Usaha', 'TU', 'tata_usaha', 'Guru BK', 'guru_bk'])) {
            $unitIds = $this->accessibleEducationUnits($user)->pluck('id');
            return Student::query()->whereIn('unit_id', $unitIds);
        }

        $employee = Employee::query()->where('user_id', $user->id)->first();
        if ($employee) {
            $rombelIds = $this->accessibleRombels($user)->pluck('id');
            return Student::query()->whereIn('kelas_id', $rombelIds);
        }

        $parent = ParentModel::query()->where('user_id', $user->id)->first();
        if ($parent) {
            return Student::query()->where(function ($query) use ($parent) {
                $query->where('parent_id', $parent->id)
                    ->orWhereHas('parentsPivot', fn ($p) => $p->whereKey($parent->id));
            });
        }

        return Student::query()->where('user_id', $user->id);
    }

    /**
     * Scope query Pegawai & Guru yang berhak diakses user.
     */
    public function accessibleEmployees(User $user): Builder
    {
        if ($this->hasAnyRole($user, ['Super Admin', 'super_admin', 'Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'pengurus_yayasan', 'Pengurus Yayasan'])) {
            return Employee::query();
        }

        $unitIds = $this->accessibleEducationUnits($user)->pluck('id');
        return Employee::query()->whereIn('unit_id', $unitIds);
    }

    /**
     * Scope query Jadwal Pelajaran yang berhak diakses user.
     */
    public function accessibleSchedules(User $user): Builder
    {
        if ($this->hasAnyRole($user, ['Super Admin', 'super_admin', 'Yayasan', 'Ketua Yayasan', 'ketua_yayasan', 'pengurus_yayasan', 'Pengurus Yayasan', 'Divisi Pendidikan', 'divisi_pendidikan', 'Kepala Sekolah', 'kepala_sekolah', 'Waka Kurikulum', 'waka_kurikulum', 'Tata Usaha', 'TU', 'tata_usaha'])) {
            $unitIds = $this->accessibleEducationUnits($user)->pluck('id');
            $rombelIds = Kelas::query()->whereIn('unit_pendidikan_id', $unitIds)->pluck('id');
            return ClassSchedule::query()->whereIn('kelas_id', $rombelIds);
        }

        $employee = Employee::query()->where('user_id', $user->id)->first();
        if ($employee) {
            return ClassSchedule::query()->where(fn ($q) => $q->where('employee_id', $employee->id)->orWhere('teacher_id', $employee->id));
        }

        $rombelIds = $this->accessibleRombels($user)->pluck('id');
        return ClassSchedule::query()->whereIn('kelas_id', $rombelIds);
    }

    /**
     * Ambil seluruh anak terhubung untuk Orang Tua.
     */
    public function accessibleChildren(User $user): Collection
    {
        $parent = ParentModel::query()->where('user_id', $user->id)->first();
        if (! $parent) {
            return collect([]);
        }

        return Student::query()
            ->with(['kelas', 'educationUnit'])
            ->where(function ($query) use ($parent) {
                $query->where('parent_id', $parent->id)
                    ->orWhereHas('parentsPivot', fn ($p) => $p->whereKey($parent->id));
            })
            ->get();
    }

    /**
     * Scope Kelompok Binaan Tahfizh.
     */
    public function accessibleTahfizhGroups(User $user): Builder
    {
        return $this->accessibleEducationUnits($user);
    }

    private function hasAnyRole(User $user, array $roles): bool
    {
        if (method_exists($user, 'hasAnyRole')) {
            return $user->hasAnyRole($roles);
        }

        return false;
    }
}
