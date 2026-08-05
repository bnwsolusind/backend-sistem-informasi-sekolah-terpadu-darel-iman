<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\MutabaahSupervisorAssignment;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;

class MutabaahDataScope
{
    public function applyEnterprise(EloquentBuilder $query, string $resource, User $user): EloquentBuilder
    {
        if ($this->isFoundationWide($user) || in_array($resource, ['categories', 'agendas'], true)) {
            return $query;
        }
        $unitId = $this->employeeUnitId($user);
        abort_unless($unitId, 403, 'Akun belum terhubung dengan unit pendidikan.');

        return $query->where('education_unit_id', $unitId);
    }

    public function assertEnterpriseModel(User $user, Model $model): void
    {
        if ($this->isFoundationWide($user) || ! in_array('education_unit_id', $model->getFillable(), true)) {
            return;
        }
        abort_unless($this->employeeUnitId($user) === $model->getAttribute('education_unit_id'), 403, 'Data berada di luar unit kewenangan Anda.');
    }

    public function applyHeaders(Builder $query, User $user): Builder
    {
        if ($this->isFoundationWide($user)) {
            return $query;
        }
        $employee = Employee::where('user_id', $user->id)->first(['id', 'unit_id']);
        if (! $employee) {
            if ($user->hasAnyRole(['Kepala Sekolah', 'Tata Usaha', 'TU', 'Waka Kesiswaan', 'Waka Kurikulum', 'Operator', 'Admin', 'Wali Kelas', 'Guru', 'Musyrif'])) {
                return $query;
            }
            abort(403, 'Akun belum terhubung dengan data pegawai.');
        }

        if ($user->hasAnyRole(['Kepala Sekolah', 'Tata Usaha', 'TU', 'Waka Kesiswaan', 'Waka Kurikulum', 'Operator', 'Admin'])) {
            if (! $employee->unit_id) {
                return $query;
            }

            return $query->where('h.education_unit_id', $employee->unit_id);
        }

        return $query->where('sa.employee_id', $employee->id);
    }

    public function applyStudents(EloquentBuilder $query, User $user, string $date): EloquentBuilder
    {
        if ($this->isFoundationWide($user)) {
            return $query;
        }
        $employee = Employee::where('user_id', $user->id)->first(['id', 'unit_id']);
        if (! $employee) {
            if ($user->hasAnyRole(['Kepala Sekolah', 'Tata Usaha', 'TU', 'Waka Kesiswaan', 'Waka Kurikulum', 'Operator', 'Admin', 'Wali Kelas', 'Guru', 'Musyrif'])) {
                return $query;
            }
            abort(403, 'Akun belum terhubung dengan data pegawai.');
        }

        if ($user->hasAnyRole(['Kepala Sekolah', 'Tata Usaha', 'TU', 'Waka Kesiswaan', 'Waka Kurikulum', 'Operator', 'Admin'])) {
            return $query->where(function ($student) use ($employee) {
                if ($employee->unit_id) {
                    $student->where('unit_id', $employee->unit_id)
                        ->orWhereHas('kelas', fn ($kelas) => $kelas->where('unit_pendidikan_id', $employee->unit_id));
                }
            });
        }
        $assignments = MutabaahSupervisorAssignment::active()->byDate($date)->where('employee_id', $employee->id)->get();

        return $query->where(function ($scope) use ($assignments) {
            foreach ($assignments as $assignment) {
                $scope->orWhere(function ($student) use ($assignment) {
                    $student->where(function ($unit) use ($assignment) {
                        $unit->where('unit_id', $assignment->education_unit_id)
                            ->orWhereHas('kelas', fn ($kelas) => $kelas->where('unit_pendidikan_id', $assignment->education_unit_id));
                    })
                        ->when($assignment->kelas_id, fn ($q, $id) => $q->where('class_id', $id))
                        ->when($assignment->rombel_id, fn ($q, $id) => $q->where('class_id', $id))
                        ->when($assignment->mentoring_group, fn ($q, $group) => $q->where('metadata->mentoring_group', $group))
                        ->when($assignment->dormitory_id, fn ($q, $id) => $q->where('metadata->dormitory_id', $id))
                        ->when($assignment->room_id, fn ($q, $id) => $q->where('metadata->room_id', $id));
                });
            }
            if ($assignments->isEmpty()) {
                $scope->whereRaw('1 = 0');
            }
        });
    }

    public function employeeUnitId(User $user): ?string
    {
        return Employee::where('user_id', $user->id)->value('unit_id');
    }

    public function isFoundationWide(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Ketua Yayasan', 'Yayasan', 'Admin', 'Divisi Pendidikan', 'Operator']);
    }
}
