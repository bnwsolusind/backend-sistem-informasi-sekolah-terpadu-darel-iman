<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class AttendancePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Daily Gate Attendance
            'student_attendance.daily.view',
            'student_attendance.daily.scan',
            'student_attendance.daily.create',
            'student_attendance.daily.update',
            'student_attendance.daily.verify',
            'student_attendance.daily.export',

            // Lesson Attendance
            'student_attendance.lesson.view',
            'student_attendance.lesson.create',
            'student_attendance.lesson.finalize',
            'student_attendance.lesson.correct.request',
            'student_attendance.lesson.correct.approve',
            'student_attendance.lesson.export',

            // Worship Attendance (Santri)
            'worship_attendance.view',
            'worship_attendance.template.manage',
            'worship_attendance.session.manage',
            'worship_attendance.scan',
            'worship_attendance.verify',
            'worship_attendance.private_status.view',
            'worship_attendance.export',

            // Legacy Permissions (Compatibility)
            'attendance.teacher.dashboard',
            'attendance.homeroom.dashboard',
            'attendance.student.view_own',
            'lesson_attendance.view',
            'lesson_attendance.view_own',
            'lesson_attendance.create',
            'lesson_attendance.update',
            'lesson_attendance.finalize',
            'lesson_attendance.unlock',
            'lesson_attendance.cancel',
            'lesson_attendance.correct',
            'lesson_attendance.export',
            'attendance_permission.view',
            'attendance_permission.view_own',
            'attendance_permission.create',
            'attendance_permission.update',
            'attendance_permission.submit',
            'attendance_permission.review',
            'attendance_permission.cancel',
            'attendance_correction.view',
            'attendance_correction.create',
            'attendance_correction.review',
            'attendance_correction.cancel',
            'attendance_follow_up.view',
            'attendance_follow_up.create',
            'attendance_follow_up.update',
            'attendance_follow_up.complete',
            'attendance_follow_up.close',
            'attendance_report.view',
            'attendance_report.export',
        ];

        foreach ($permissions as $name) {
            Permission::query()->firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $map = [
            'Guru' => [
                'student_attendance.lesson.view',
                'student_attendance.lesson.create',
                'student_attendance.lesson.finalize',
                'student_attendance.lesson.correct.request',
                'attendance.teacher.dashboard',
                'lesson_attendance.view_own',
                'lesson_attendance.create',
                'lesson_attendance.update',
                'lesson_attendance.finalize',
                'lesson_attendance.cancel',
                'lesson_attendance.correct',
                'lesson_attendance.export',
            ],
            'Wali Kelas' => [
                'student_attendance.daily.view',
                'student_attendance.lesson.view',
                'attendance.homeroom.dashboard',
                'lesson_attendance.view',
                'attendance_permission.view',
                'attendance_permission.review',
                'attendance_correction.view',
                'attendance_correction.review',
                'attendance_follow_up.view',
                'attendance_follow_up.create',
            ],
            'Musyrif / Musyrifah' => [
                'worship_attendance.view',
                'worship_attendance.scan',
                'worship_attendance.verify',
                'worship_attendance.private_status.view',
            ],
            'Tata Usaha' => [
                'student_attendance.daily.view',
                'student_attendance.daily.scan',
                'student_attendance.daily.create',
                'student_attendance.daily.update',
                'student_attendance.daily.verify',
                'student_attendance.daily.export',
            ],
            'Siswa' => [
                'attendance.student.view_own',
                'attendance_permission.view_own',
                'attendance_permission.create',
                'attendance_permission.submit',
            ],
        ];

        foreach ($map as $roleName => $items) {
            if ($role = Role::query()->where(['name' => $roleName, 'guard_name' => 'web'])->first()) {
                $role->givePermissionTo($items);
            }
        }

        foreach (['Super Admin', 'Kepala Sekolah', 'Admin'] as $roleName) {
            if ($role = Role::query()->where(['name' => $roleName, 'guard_name' => 'web'])->first()) {
                $role->givePermissionTo($permissions);
            }
        }
    }
}
