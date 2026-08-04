<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\ClassSchedule;
use App\Models\EducationUnit;
use App\Models\Employee;
use App\Models\Kelas;
use App\Models\LessonAttendanceSession;
use App\Models\LmsMateri;
use App\Models\LmsModulAjar;
use App\Models\LmsPengumpulanTugas;
use App\Models\LmsPenugasan;
use App\Models\LmsPresensi;
use App\Models\MasterKurikulum;
use App\Models\MutabaahDailyHeader;
use App\Models\MutabaahSupervisorAssignment;
use App\Models\Notification;
use App\Models\ParentModel;
use App\Models\PortalMessage;
use App\Models\PengumumanSekolah;
use App\Models\QuranSurah;
use App\Models\Semester;
use App\Models\Student;
use App\Models\StudentGrade;
use App\Models\StudentNote;
use App\Models\Subject;
use App\Models\TahfizhDailyLog;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TeacherPortalController extends Controller
{
    private function getTeacherContext(Request $request): ?Teacher
    {
        $user = $request->user();
        if (! $user) {
            return null;
        }

        $teacher = Teacher::query()->where('user_id', $user->id)->first();
        $employee = Employee::query()->where('user_id', $user->id)->first();

        if (! $employee) {
            $employee = Employee::query()->where('email', $user->email)->first();
        }

        if (! $employee) {
            $employee = Employee::query()->create([
                'id' => (string) Str::uuid(),
                'niy' => 'EMP-' . substr((string) Str::uuid(), 0, 8),
                'nama_lengkap' => $user->name ?? 'Guru Otomatis',
                'email' => $user->email,
                'user_id' => $user->id,
                'status' => 'Aktif',
            ]);
        }

        if (! $teacher) {
            $teacher = Teacher::query()->where('employee_id', $employee->id)->first();
        }

        if (! $teacher) {
            $teacher = Teacher::query()->create([
                'user_id' => $user->id,
                'employee_id' => $employee->id,
                'employee_number' => 'TCH-' . substr((string) Str::uuid(), 0, 8),
                'full_name' => $employee->nama_lengkap ?? $user->name ?? 'Guru Otomatis',
                'email' => $employee->email ?? $user->email,
            ]);
        }

        return $teacher;
    }

    private function resolveSchoolReferenceId(?string $value, string $modelClass, ?callable $fallback = null): ?string
    {
        if (empty($value)) {
            return null;
        }

        $model = new $modelClass();
        $exists = $model::query()->whereKey($value)->exists();
        if ($exists) {
            return $value;
        }

        return $fallback ? $fallback() : null;
    }

    private function ensureEducationUnit(?string $requestedId = null): EducationUnit
    {
        $educationUnit = EducationUnit::query()->first();
        if ($educationUnit) {
            return $educationUnit;
        }

        return EducationUnit::query()->create([
            'id' => $requestedId ?: (string) Str::uuid(),
            'code' => 'AUTO' . substr((string) Str::uuid(), 0, 6),
            'name' => 'Unit Pendidikan Otomatis',
            'level' => 'Sekolah',
            'description' => 'Dibuat otomatis untuk portal guru',
            'is_active' => true,
        ]);
    }

    private function ensureAcademicYear(?string $requestedId = null): AcademicYear
    {
        $academicYear = AcademicYear::query()->where('is_active', true)->first();
        if ($academicYear) {
            return $academicYear;
        }

        return AcademicYear::query()->create([
            'id' => $requestedId ?: (string) Str::uuid(),
            'name' => '2025/2026',
            'start_date' => now()->subYear()->startOfYear()->toDateString(),
            'end_date' => now()->subYear()->endOfYear()->toDateString(),
            'is_active' => true,
        ]);
    }

    private function ensureSemester(?string $academicYearId = null, ?string $requestedId = null): Semester
    {
        $semester = Semester::query()->where('academic_year_id', $academicYearId)->first();
        if ($semester) {
            return $semester;
        }

        return Semester::query()->create([
            'id' => $requestedId ?: (string) Str::uuid(),
            'academic_year_id' => $academicYearId ?: $this->ensureAcademicYear()->id,
            'name' => 'Ganjil',
            'sequence' => 1,
            'start_date' => now()->startOfYear()->toDateString(),
            'end_date' => now()->endOfYear()->toDateString(),
            'is_active' => true,
        ]);
    }

    private function ensureKurikulum(?string $educationUnitId = null, ?string $academicYearId = null, ?string $semesterId = null, ?string $requestedId = null): MasterKurikulum
    {
        $educationUnitId = $educationUnitId ?: $this->ensureEducationUnit()->id;
        $academicYearId = $academicYearId ?: $this->ensureAcademicYear()->id;
        $semesterId = $semesterId ?: $this->ensureSemester($academicYearId)->id;

        $kurikulum = MasterKurikulum::query()
            ->where('unit_pendidikan_id', $educationUnitId)
            ->where('tahun_ajaran_id', $academicYearId)
            ->first();
        if ($kurikulum) {
            return $kurikulum;
        }

        $academicYear = AcademicYear::query()->find($academicYearId);
        $startDate = $academicYear?->start_date ?? now()->subYear()->startOfYear()->toDateString();
        $endDate = $academicYear?->end_date ?? now()->addYear()->endOfYear()->toDateString();

        return MasterKurikulum::query()->create([
            'id' => $requestedId ?: (string) Str::uuid(),
            'kode_kurikulum' => 'AUTO-' . substr((string) Str::uuid(), 0, 8),
            'nama_kurikulum' => 'Kurikulum Otomatis',
            'jenis_kurikulum' => 'Nasional',
            'unit_pendidikan_id' => $educationUnitId,
            'jenjang' => 'SD',
            'tahun_ajaran_id' => $academicYearId,
            'semester_id' => $semesterId,
            'tanggal_mulai' => $startDate,
            'tanggal_selesai' => $endDate,
            'status' => true,
        ]);
    }

    private function ensureSubject(?string $requestedId = null, ?string $educationUnitId = null, ?string $createdBy = null): Subject
    {
        if ($requestedId) {
            $subject = Subject::query()->find($requestedId);
            if ($subject) {
                return $subject;
            }
        }

        return Subject::query()->create([
            'id' => $requestedId ?: (string) Str::uuid(),
            'unit_pendidikan_id' => $educationUnitId ?: $this->ensureEducationUnit()->id,
            'kurikulum_id' => $this->ensureKurikulum($educationUnitId)->id,
            'kode_mapel' => 'AUTO' . substr((string) Str::uuid(), 0, 4),
            'nama_mapel' => 'Mapel Otomatis',
            'name' => 'Mapel Otomatis',
            'status' => true,
            'created_by' => $createdBy,
        ]);
    }

    private function ensureKelas(?string $requestedId = null, ?string $educationUnitId = null, ?string $academicYearId = null, ?string $semesterId = null, ?string $createdBy = null): Kelas
    {
        if ($requestedId) {
            $kelas = Kelas::query()->find($requestedId);
            if ($kelas) {
                return $kelas;
            }
        }

        $educationUnitId = $educationUnitId ?: $this->ensureEducationUnit()->id;
        $academicYearId = $academicYearId ?: $this->ensureAcademicYear()->id;
        $semesterId = $semesterId ?: $this->ensureSemester($academicYearId)->id;

        return Kelas::query()->create([
            'id' => $requestedId ?: (string) Str::uuid(),
            'unit_pendidikan_id' => $educationUnitId,
            'tahun_ajaran_id' => $academicYearId,
            'semester_id' => $semesterId,
            'jenjang' => 'SD',
            'tingkat' => '1',
            'kode_kelas' => 'AUTO' . substr((string) Str::uuid(), 0, 4),
            'nama_kelas' => 'Kelas Otomatis',
            'status' => 'Aktif',
            'created_by' => $createdBy,
        ]);
    }

    private function ensureLmsModulAjar(string $guruId, ?string $subjectId, ?string $classId, ?string $semesterId, ?string $academicYearId, ?string $createdBy = null): LmsModulAjar
    {
        $educationUnit = $this->ensureEducationUnit();
        $academicYear = $this->ensureAcademicYear($academicYearId);
        $semester = $this->ensureSemester($academicYear->id, $semesterId);
        $subject = $this->ensureSubject($subjectId, $educationUnit->id, $createdBy);
        $kelas = $this->ensureKelas($classId, $educationUnit->id, $academicYear->id, $semester->id, $createdBy);

        $subjectId = $subject->id;
        $classId = $kelas->id;
        $semesterId = $semester->id;
        $academicYearId = $academicYear->id;

        $existing = LmsModulAjar::query()
            ->where('guru_id', $guruId)
            ->where('mata_pelajaran_id', $subjectId)
            ->where('kelas_id', $classId)
            ->where('semester_id', $semesterId)
            ->where('tahun_ajaran_id', $academicYearId)
            ->first();

        if ($existing) {
            return $existing;
        }

        $kurikulum = $this->ensureKurikulum($educationUnit->id, $academicYear->id, $semester->id);
        $subjectName = Subject::query()->find($subjectId)?->name ?? Subject::query()->first()?->name ?? 'Pembelajaran';

        return LmsModulAjar::create([
            'unit_pendidikan_id' => $educationUnit->id,
            'kurikulum_id' => $kurikulum->id,
            'mata_pelajaran_id' => $subjectId,
            'guru_id' => $guruId,
            'kelas_id' => $classId,
            'semester_id' => $semesterId,
            'tahun_ajaran_id' => $academicYearId,
            'judul_modul' => 'Modul otomatis ' . $subjectName,
            'tujuan_pembelajaran' => 'Dibuat otomatis dari portal guru.',
            'status' => 'draft',
            'created_by' => $createdBy,
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $teacher = $this->getTeacherContext($request);
        $employee = Employee::query()->where('user_id', $user?->id)->first();

        $activeAcademicYear = AcademicYear::query()->where('is_active', true)->first();
        $activeSemester = Semester::query()->where('is_active', true)->first();
        $educationUnit = $teacher?->educationUnit ?? EducationUnit::query()->first();

        $todayDayNum = now()->dayOfWeekIso;

        // Schedules today
        $schedulesQuery = ClassSchedule::query()
            ->with(['kelas', 'subject'])
            ->when($teacher || $employee, function ($q) use ($teacher, $employee) {
                $q->where(function ($sq) use ($teacher, $employee) {
                    if ($teacher) {
                        $sq->where('teacher_id', $teacher->id);
                        if ($teacher->employee_id) {
                            $sq->orWhere('employee_id', $teacher->employee_id);
                        }
                    }
                    if ($employee) {
                        $sq->orWhere('employee_id', $employee->id);
                    }
                });
            })
            ->when($activeAcademicYear, fn ($q) => $q->where('academic_year_id', $activeAcademicYear->id))
            ->when($activeSemester, fn ($q) => $q->where('semester_id', $activeSemester->id));

        $schedulesToday = (clone $schedulesQuery)
            ->where('day_of_week', $todayDayNum)
            ->orderBy('time_start')
            ->get();

        // Classes/Rombel taught
        $classIds = (clone $schedulesQuery)->pluck('kelas_id')
            ->merge((clone $schedulesQuery)->pluck('class_id'))
            ->unique()
            ->filter();
        $totalClasses = $classIds->count();

        // Total students
        $totalStudents = Student::query()
            ->where(fn ($q) => $q->whereIn('kelas_id', $classIds)->orWhereIn('class_id', $classIds))
            ->where('status', 'aktif')
            ->count();

        // Pending assignments to grade
        $pendingGrading = LmsPengumpulanTugas::query()
            ->whereNull('nilai')
            ->whereHas('penugasan', function ($q) use ($teacher, $employee) {
                if ($teacher || $employee) {
                    $q->where(function ($sq) use ($teacher, $employee) {
                        if ($teacher) {
                            $sq->where('teacher_id', $teacher->id);
                        }
                        if ($employee) {
                            $sq->orWhere('employee_id', $employee->id);
                        }
                    });
                }
            })
            ->count();

        // Tahfizh deposits today
        $tahfizhTodayCount = TahfizhDailyLog::query()
            ->whereDate('date', now()->toDateString())
            ->when($teacher || $employee, fn ($q) => $q->where(function ($sq) use ($teacher, $employee) {
                if ($teacher) {
                    $sq->where('teacher_id', $teacher->id);
                }
                if ($employee) {
                    $sq->orWhere('employee_id', $employee->id);
                }
            }))
            ->count();

        // Mutabaah unverified count
        $unverifiedMutabaah = MutabaahDailyHeader::query()
            ->where('status', 'draft')
            ->count();

        // Notifications
        $unreadNotifications = Notification::query()
            ->where('user_id', $user?->id)
            ->where('is_read', false)
            ->count();

        // Announcements
        $announcements = PengumumanSekolah::query()
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'teacher' => [
                    'id' => $teacher?->id ?? $employee?->id,
                    'name' => $user?->name ?? 'Pengajar',
                    'nip_niy' => $teacher?->employee_number ?? $employee?->nip_niy ?? $user?->username,
                    'education_unit' => $educationUnit?->name ?? 'Unit Utama',
                ],
                'academic_context' => [
                    'academic_year' => $activeAcademicYear?->name ?? '2025/2026',
                    'semester' => $activeSemester?->name ?? 'Ganjil',
                    'date' => now()->translatedFormat('l, d F Y'),
                ],
                'kpi' => [
                    'schedules_today_count' => $schedulesToday->count(),
                    'total_students' => $totalStudents,
                    'total_classes' => $totalClasses,
                    'pending_grading_count' => $pendingGrading,
                    'tahfizh_today_count' => $tahfizhTodayCount,
                    'unverified_mutabaah_count' => $unverifiedMutabaah,
                    'unread_notifications' => $unreadNotifications,
                ],
                'schedules_today' => $schedulesToday,
                'announcements' => $announcements,
            ],
        ]);
    }

    public function schedules(Request $request): JsonResponse
    {
        $teacher = $this->getTeacherContext($request);
        $employee = Employee::query()->where('user_id', $request->user()?->id)->first();
        $day = $request->query('day');
        $classId = $request->query('class_id');

        $schedules = ClassSchedule::query()
            ->with(['kelas', 'subject'])
            ->when($teacher || $employee, function ($q) use ($teacher, $employee) {
                $q->where(function ($sq) use ($teacher, $employee) {
                    if ($teacher) {
                        $sq->where('teacher_id', $teacher->id);
                        if ($teacher->employee_id) {
                            $sq->orWhere('employee_id', $teacher->employee_id);
                        }
                    }
                    if ($employee) {
                        $sq->orWhere('employee_id', $employee->id);
                    }
                });
            })
            ->when($day, function ($q) use ($day) {
                if (is_numeric($day)) {
                    $q->where('day_of_week', (int) $day);
                } else {
                    $dayMap = [
                        'senin' => 1, 'selasa' => 2, 'rabu' => 3, 'kamis' => 4,
                        'jumat' => 5, 'sabtu' => 6, 'minggu' => 7, 'ahad' => 7,
                    ];
                    $dayNum = $dayMap[Str::lower($day)] ?? null;
                    if ($dayNum) {
                        $q->where('day_of_week', $dayNum);
                    }
                }
            })
            ->when($classId, fn ($q) => $q->where(fn ($sq) => $sq->where('class_id', $classId)->orWhere('kelas_id', $classId)))
            ->orderBy('time_start')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules,
        ]);
    }

    public function classes(Request $request): JsonResponse
    {
        $teacher = $this->getTeacherContext($request);
        $employee = Employee::query()->where('user_id', $request->user()?->id)->first();

        if ($request->user()?->hasRole('Super Admin')) {
            $classIds = Student::query()->active()
                ->selectRaw('COALESCE(kelas_id, class_id) as scoped_class_id')
                ->where(fn ($query) => $query->whereNotNull('kelas_id')->orWhereNotNull('class_id'))
                ->pluck('scoped_class_id')->unique()->filter();

            $classes = Kelas::query()->whereIn('id', $classIds)->orderBy('nama_kelas')->get();

            return response()->json(['success' => true, 'data' => $classes]);
        }

        $classIds = ClassSchedule::query()
            ->when($teacher || $employee, function ($q) use ($teacher, $employee) {
                $q->where(function ($sq) use ($teacher, $employee) {
                    if ($teacher) {
                        $sq->where('teacher_id', $teacher->id);
                        if ($teacher->employee_id) {
                            $sq->orWhere('employee_id', $teacher->employee_id);
                        }
                    }
                    if ($employee) {
                        $sq->orWhere('employee_id', $employee->id);
                    }
                });
            })
            ->pluck('kelas_id')
            ->merge(
                ClassSchedule::query()
                    ->when($teacher || $employee, function ($q) use ($teacher, $employee) {
                        $q->where(function ($sq) use ($teacher, $employee) {
                            if ($teacher) {
                                $sq->where('teacher_id', $teacher->id);
                                if ($teacher->employee_id) {
                                    $sq->orWhere('employee_id', $teacher->employee_id);
                                }
                            }
                            if ($employee) {
                                $sq->orWhere('employee_id', $employee->id);
                            }
                        });
                    })
                    ->pluck('class_id')
            )
            ->unique()
            ->filter();

        $classes = Kelas::query()
            ->whereIn('id', $classIds)
            ->orWhere(fn ($q) => $q->where('wali_kelas_id', $teacher?->id)->orWhere('wali_kelas_id', $employee?->id))
            ->get();

        return response()->json([
            'success' => true,
            'data' => $classes,
        ]);
    }

    public function students(Request $request): JsonResponse
    {
        $classId = $request->query('class_id');
        $teacher = $this->getTeacherContext($request);
        $classIds = $this->teacherClassIds($request, $teacher);

        if ($classId) {
            abort_unless($classIds->contains($classId), 403, 'Rombel berada di luar scope guru.');
        }

        $students = Student::query()
            ->with(['kelas', 'parent', 'parentsPivot'])
            ->where(function ($query) use ($classIds) {
                $query->whereIn('kelas_id', $classIds)->orWhereIn('class_id', $classIds);
            })
            ->when($classId, fn ($q) => $q->byClass($classId))
            ->active()
            ->orderBy('full_name')
            ->paginate($request->query('per_page', 25));

        // Workspace guru lama memakai nama field Indonesia. Sertakan alias ini
        // tanpa mengubah kontrak Student utama yang memakai `full_name`.
        $students->getCollection()->each(function (Student $student): void {
            $student->append(['nama_lengkap']);
        });

        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }

    public function attendance(Request $request): JsonResponse
    {
        $teacher = $this->getTeacherContext($request);
        $classId = $request->query('class_id');
        $date = $request->query('date', now()->toDateString());

        $sessions = LessonAttendanceSession::query()
            ->with(['classSchedule', 'kelas', 'subject', 'attendances.student'])
            ->when($teacher, fn ($q) => $q->where('teacher_id', $teacher->id))
            ->when($classId, fn ($q) => $q->where('class_id', $classId))
            ->whereDate('date', $date)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sessions,
        ]);
    }

    public function saveAttendance(Request $request): JsonResponse
    {
        $request->validate([
            'class_schedule_id' => 'required|uuid',
            'date' => 'required|date',
            'meeting_number' => 'required|integer',
            'topic' => 'required|string',
            'students' => 'required|array',
            'students.*.student_id' => 'required|uuid',
            'students.*.status' => 'required|string|in:Hadir,Izin,Sakit,Alpha,Terlambat',
            'students.*.notes' => 'nullable|string',
        ]);

        $teacher = $this->getTeacherContext($request);
        $schedule = ClassSchedule::findOrFail($request->class_schedule_id);

        $session = LessonAttendanceSession::updateOrCreate(
            [
                'class_schedule_id' => $schedule->id,
                'date' => $request->date,
                'meeting_number' => $request->meeting_number,
            ],
            [
                'teacher_id' => $teacher?->id,
                'class_id' => $schedule->class_id,
                'subject_id' => $schedule->subject_id,
                'education_unit_id' => $schedule->education_unit_id,
                'topic' => $request->topic,
                'status' => 'completed',
            ]
        );

        foreach ($request->students as $st) {
            LmsPresensi::updateOrCreate(
                [
                    'session_id' => $session->id,
                    'student_id' => $st['student_id'],
                ],
                [
                    'class_schedule_id' => $schedule->id,
                    'status' => $st['status'],
                    'notes' => $st['notes'] ?? null,
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Presensi pembelajaran berhasil disimpan dan difinalisasi.',
            'session' => $session->load('attendances.student'),
        ]);
    }

    public function materials(Request $request): JsonResponse
    {
        $ownerIds = $this->teacherMaterialOwnerIds($request);

        $materials = LmsMateri::query()
            ->with(['subject'])
            ->whereIn('guru_id', $ownerIds)
            ->orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $materials,
        ]);
    }

    public function saveMaterial(Request $request): JsonResponse
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'subject_id' => 'required|uuid',
            'class_id' => 'required|uuid',
            'ringkasan' => 'nullable|string',
            'isi' => 'nullable|string',
            'status' => 'required|string|in:draft,published',
        ]);

        $teacher = $this->getTeacherContext($request);
        $employee = Employee::query()->where('user_id', $request->user()?->id)->first();
        $guruId = $teacher?->employee_id ?? $employee?->id ?? $request->user()?->id;

        $academicYear = $this->ensureAcademicYear($request->input('tahun_ajaran_id'));
        $semester = $this->ensureSemester($academicYear->id, $request->input('semester_id'));
        $subject = $this->ensureSubject($request->subject_id, null, $request->user()?->id);
        $kelas = $this->ensureKelas($request->class_id, null, $academicYear->id, $semester->id, $request->user()?->id);

        $subjectId = $subject->id;
        $classId = $kelas->id;
        $semesterId = $semester->id;
        $academicYearId = $academicYear->id;
        $module = $this->ensureLmsModulAjar($guruId, $subjectId, $classId, $semesterId, $academicYearId, $request->user()?->id);

        $material = LmsMateri::create([
            'teacher_id' => $guruId,
            'subject_id' => $subjectId,
            'mata_pelajaran_id' => $subjectId,
            'modul_ajar_id' => $module->id,
            'guru_id' => $guruId,
            'judul' => $request->judul,
            'ringkasan' => $request->ringkasan,
            'isi' => $request->isi,
            'status' => $request->status,
            'tanggal_publish' => $request->status === 'published' ? now() : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil disimpan.',
            'data' => $material,
        ]);
    }

    public function updateMaterial(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'ringkasan' => 'nullable|string',
            'isi' => 'nullable|string',
            'status' => 'required|string|in:draft,published',
        ]);

        $material = $this->teacherMaterial($request, $id);
        $material->fill($validated);
        $material->tanggal_publish = $validated['status'] === 'published'
            ? ($material->tanggal_publish ?? now())
            : null;
        $material->save();

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil diperbarui.',
            'data' => $material->fresh('subject'),
        ]);
    }

    public function deleteMaterial(Request $request, string $id): JsonResponse
    {
        $material = $this->teacherMaterial($request, $id);
        $material->delete();

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil dihapus.',
        ]);
    }

    private function teacherMaterial(Request $request, string $id): LmsMateri
    {
        return LmsMateri::query()
            ->whereKey($id)
            ->whereIn('guru_id', $this->teacherMaterialOwnerIds($request))
            ->firstOrFail();
    }

    private function teacherMaterialOwnerIds(Request $request): array
    {
        $teacher = $this->getTeacherContext($request);
        $employee = Employee::query()->where('user_id', $request->user()?->id)->first();
        return array_values(array_unique(array_filter([
            $teacher?->id,
            $teacher?->employee_id,
            $employee?->id,
            $request->user()?->id,
        ])));
    }

    public function assignments(Request $request): JsonResponse
    {
        $teacher = $this->getTeacherContext($request);

        $assignments = LmsPenugasan::query()
            ->with(['subject', 'pengumpulanTugas'])
            ->when($teacher, fn ($q) => $q->where('guru_id', $teacher->id))
            ->orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $assignments,
        ]);
    }

    public function saveAssignment(Request $request): JsonResponse
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'subject_id' => 'required|uuid',
            'class_id' => 'required|uuid',
            'instruksi' => 'required|string',
            'deadline' => 'required|date',
            'bobot' => 'nullable|numeric',
        ]);

        $teacher = $this->getTeacherContext($request);
        $employee = Employee::query()->where('user_id', $request->user()?->id)->first();
        $guruId = $teacher?->employee_id ?? $employee?->id ?? $request->user()?->id;

        $academicYear = $this->ensureAcademicYear($request->input('tahun_ajaran_id'));
        $semester = $this->ensureSemester($academicYear->id, $request->input('semester_id'));
        $subject = $this->ensureSubject($request->subject_id, null, $request->user()?->id);
        $kelas = $this->ensureKelas($request->class_id, null, $academicYear->id, $semester->id, $request->user()?->id);

        $subjectId = $subject->id;
        $classId = $kelas->id;
        $semesterId = $semester->id;
        $academicYearId = $academicYear->id;
        $module = $this->ensureLmsModulAjar($guruId, $subjectId, $classId, $semesterId, $academicYearId, $request->user()?->id);

        $assignment = LmsPenugasan::create([
            'teacher_id' => $guruId,
            'subject_id' => $subjectId,
            'class_id' => $classId,
            'judul' => $request->judul,
            'instruksi' => $request->instruksi,
            'deadline' => $request->deadline,
            'bobot' => $request->bobot ?? 100,
            'status' => 'published',
            'mata_pelajaran_id' => $subjectId,
            'kelas_id' => $classId,
            'guru_id' => $guruId,
            'semester_id' => $semesterId,
            'tahun_ajaran_id' => $academicYearId,
            'modul_ajar_id' => $module->id,
            'is_published' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Penugasan berhasil dibuat.',
            'data' => $assignment,
        ]);
    }

    public function submissions(Request $request): JsonResponse
    {
        $assignmentId = $request->query('assignment_id');

        $submissions = LmsPengumpulanTugas::query()
            ->with(['student', 'penugasan'])
            ->when($assignmentId, fn ($q) => $q->where('penugasan_id', $assignmentId))
            ->orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $submissions,
        ]);
    }

    public function gradeSubmission(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'nilai' => 'required|numeric|min:0|max:100',
            'catatan_guru' => 'nullable|string',
        ]);

        $submission = LmsPengumpulanTugas::findOrFail($id);
        $submission->update([
            'nilai' => $request->nilai,
            'catatan_guru' => $request->catatan_guru,
            'status' => 'dinilai',
            'graded_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Nilai pengumpulan tugas berhasil disimpan.',
            'data' => $submission,
        ]);
    }

    public function grades(Request $request): JsonResponse
    {
        $classId = $request->query('class_id');
        $subjectId = $request->query('subject_id');

        $grades = StudentGrade::query()
            ->with(['student', 'subject', 'kelas'])
            ->when($classId, fn ($q) => $q->where('class_id', $classId))
            ->when($subjectId, fn ($q) => $q->where('subject_id', $subjectId))
            ->get();

        return response()->json([
            'success' => true,
            'data' => $grades,
        ]);
    }

    public function saveGrades(Request $request): JsonResponse
    {
        $request->validate([
            'class_id' => 'required|uuid',
            'subject_id' => 'required|uuid',
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|uuid',
            'grades.*.nilai_tugas' => 'nullable|numeric',
            'grades.*.nilai_uts' => 'nullable|numeric',
            'grades.*.nilai_uas' => 'nullable|numeric',
            'grades.*.nilai_akhir' => 'nullable|numeric',
        ]);

        foreach ($request->grades as $g) {
            StudentGrade::updateOrCreate(
                [
                    'student_id' => $g['student_id'],
                    'subject_id' => $request->subject_id,
                    'class_id' => $request->class_id,
                ],
                [
                    'nilai_tugas' => $g['nilai_tugas'] ?? null,
                    'nilai_uts' => $g['nilai_uts'] ?? null,
                    'nilai_uas' => $g['nilai_uas'] ?? null,
                    'nilai_akhir' => $g['nilai_akhir'] ?? (($g['nilai_tugas'] ?? 0) * 0.3 + ($g['nilai_uts'] ?? 0) * 0.3 + ($g['nilai_uas'] ?? 0) * 0.4),
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Daftar nilai berhasil disimpan.',
        ]);
    }

    public function tahfizh(Request $request): JsonResponse
    {
        $studentId = $request->query('student_id');
        $classId = $request->query('class_id');
        $teacher = $this->getTeacherContext($request);

        $logs = TahfizhDailyLog::query()
            ->with(['student', 'teacher', 'classModel'])
            ->when($studentId, fn ($q) => $q->where('student_id', $studentId))
            ->when($classId, fn ($q) => $q->where('class_id', $classId))
            ->when($teacher, fn ($q) => $q->where('teacher_id', $teacher->id))
            ->orderBy('record_date', 'desc')
            ->paginate($request->query('per_page', 200));

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }

    public function saveTahfizh(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|uuid',
            'class_id' => 'required|uuid',
            'type' => 'required|string|in:Ziyadah,Murajaah,Tasmi,Ujian',
            'juz' => 'required|integer|min:1|max:30',
            'surah_number' => 'required|integer|exists:quran_surahs,nomor',
            'ayat_start' => 'required|integer|min:1',
            'ayat_end' => 'required|integer|gte:ayat_start',
            'kelancaran' => 'required|string',
            'tajwid' => 'required|string',
            'makhraj' => 'required|string',
            'notes_teacher' => 'nullable|string',
        ]);

        $teacher = $this->getTeacherContext($request);
        $surah = QuranSurah::query()->where('nomor', $validated['surah_number'])->firstOrFail();

        if ($validated['ayat_end'] > $surah->jumlah_ayat) {
            return response()->json([
                'success' => false,
                'message' => "Nomor ayat melebihi jumlah ayat Surah {$surah->nama_latin}.",
            ], 422);
        }

        $log = TahfizhDailyLog::updateOrCreate(
            ['student_id' => $validated['student_id'], 'record_date' => now()->toDateString()],
            [
                'class_id' => $validated['class_id'],
                'teacher_id' => $teacher?->id,
                'day_name' => now()->locale('id')->isoFormat('dddd'),
                'hafalan_surah_number' => $surah->nomor,
                'hafalan_surah_name' => $surah->nama_latin,
                'hafalan_ayah_start' => $validated['ayat_start'],
                'hafalan_ayah_end' => $validated['ayat_end'],
                'hafalan_baris' => $validated['ayat_end'] - $validated['ayat_start'] + 1,
                'notes_teacher' => $validated['notes_teacher'] ?? null,
                'status' => 'verified',
                'metadata' => [
                    'type' => $validated['type'],
                    'juz' => $validated['juz'],
                    'kelancaran' => $validated['kelancaran'],
                    'tajwid' => $validated['tajwid'],
                    'makhraj' => $validated['makhraj'],
                ],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Setoran tahfizh berhasil dicatat.',
            'data' => $log,
        ]);
    }

    public function mutabaah(Request $request): JsonResponse
    {
        $date = $request->query('date', now()->toDateString());
        $user = $request->user();
        abort_unless($user->hasRole('Super Admin') || $user->can('mutabaah.daily.view'), 403);

        $employeeId = Employee::query()->where('user_id', $user->id)->value('id');
        abort_unless($employeeId || $user->hasRole('Super Admin'), 403, 'Akun belum terhubung dengan data pembimbing.');
        $assignmentIds = MutabaahSupervisorAssignment::query()
            ->active()->byDate($date)
            ->when(! $user->hasRole('Super Admin'), fn ($query) => $query->where('employee_id', $employeeId))
            ->pluck('id');

        $headers = MutabaahDailyHeader::query()
            ->with(['student', 'details'])
            ->whereDate('activity_date', $date)
            ->whereIn('supervisor_assignment_id', $assignmentIds)
            ->paginate($request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $headers,
        ]);
    }

    public function verifyMutabaah(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasRole('Super Admin') || $user->can('mutabaah.daily.finalize'), 403);
        $employeeId = Employee::query()->where('user_id', $user->id)->value('id');

        $header = MutabaahDailyHeader::query()
            ->whereHas('supervisorAssignment', function ($query) use ($user, $employeeId) {
                $query->active()->when(! $user->hasRole('Super Admin'), fn ($scope) => $scope->where('employee_id', $employeeId));
            })
            ->findOrFail($id);
        abort_unless($header->supervisorAssignment?->can_finalize || $user->hasRole('Super Admin'), 403, 'Assignment tidak memiliki hak finalisasi.');
        $header->update([
            'status' => 'finalized',
            'finalized_at' => now(),
            'finalized_by' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mutabaah siswa berhasil diverifikasi.',
            'data' => $header,
        ]);
    }

    public function studentNotes(Request $request): JsonResponse
    {
        $studentId = $request->query('student_id');
        $classId = $request->query('class_id');
        $teacher = $this->getTeacherContext($request);
        $classIds = $this->teacherClassIds($request, $teacher);

        if ($classId) {
            abort_unless($classIds->contains($classId), 403, 'Rombel berada di luar scope guru.');
            $classIds = collect([$classId]);
        }

        $notes = StudentNote::query()
            ->with(['student', 'teacher'])
            ->whereHas('student', fn ($query) => $query->where(fn ($scope) => $scope->whereIn('kelas_id', $classIds)->orWhereIn('class_id', $classIds)))
            ->when($studentId, fn ($q) => $q->where('student_id', $studentId))
            ->when($request->query('category'), fn ($q, $category) => $q->where('category', $category))
            ->when($request->query('priority'), fn ($q, $priority) => $q->where('priority', $priority))
            ->when($request->query('search'), function ($query, $search) {
                $query->where(fn ($scope) => $scope
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhereHas('student', fn ($student) => $student->where('full_name', 'like', "%{$search}%")));
            })
            ->orderBy('date', 'desc')
            ->latest('created_at')
            ->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $notes,
        ]);
    }

    public function saveStudentNote(Request $request): JsonResponse
    {
        $validated = $request->validate($this->studentNoteRules());

        $teacher = $this->getTeacherContext($request);
        $classIds = $this->teacherClassIds($request, $teacher);
        $student = Student::query()->where(fn ($query) => $query->whereIn('kelas_id', $classIds)->orWhereIn('class_id', $classIds))->findOrFail($validated['student_id']);
        $activeAcademicYear = AcademicYear::query()->where('is_active', true)->first();
        $activeSemester = Semester::query()->where('is_active', true)->first();

        $note = StudentNote::create([
            ...$validated,
            'teacher_id' => $teacher?->id,
            'education_unit_id' => $student->unit_id,
            'academic_year_id' => $activeAcademicYear?->id,
            'semester_id' => $activeSemester?->id,
            'date' => $validated['date'] ?? now()->toDateString(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Catatan siswa berhasil disimpan.',
            'data' => $note->load(['student', 'teacher']),
        ], 201);
    }

    public function showStudentNote(Request $request, string $id): JsonResponse
    {
        $note = $this->scopedStudentNote($request, $id, false);

        return response()->json(['success' => true, 'data' => $note->load(['student', 'teacher'])]);
    }

    public function updateStudentNote(Request $request, string $id): JsonResponse
    {
        $note = $this->scopedStudentNote($request, $id);
        $validated = $request->validate($this->studentNoteRules());
        $teacher = $this->getTeacherContext($request);
        $classIds = $this->teacherClassIds($request, $teacher);
        Student::query()->where(fn ($query) => $query->whereIn('kelas_id', $classIds)->orWhereIn('class_id', $classIds))->findOrFail($validated['student_id']);
        $note->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Catatan siswa berhasil diperbarui.',
            'data' => $note->fresh()->load(['student', 'teacher']),
        ]);
    }

    public function deleteStudentNote(Request $request, string $id): JsonResponse
    {
        $note = $this->scopedStudentNote($request, $id);
        $note->delete();

        return response()->json(['success' => true, 'message' => 'Catatan siswa berhasil dihapus.']);
    }

    private function studentNoteRules(): array
    {
        return [
            'student_id' => 'required|uuid',
            'date' => 'nullable|date',
            'category' => 'required|string|in:Akademik,Perilaku,Kedisiplinan,Prestasi,Konseling,Tahfizh,Ibadah,Kesehatan',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'follow_up' => 'nullable|string|max:5000',
            'visible_to_parent' => 'boolean',
            'visible_to_student' => 'boolean',
        ];
    }

    private function scopedStudentNote(Request $request, string $id, bool $ownerOnly = true): StudentNote
    {
        $teacher = $this->getTeacherContext($request);
        return StudentNote::query()
            ->whereHas('student', function ($query) use ($request, $teacher) {
                $classIds = $this->teacherClassIds($request, $teacher);
                $query->where(fn ($scope) => $scope->whereIn('kelas_id', $classIds)->orWhereIn('class_id', $classIds));
            })
            ->when($ownerOnly, fn ($query) => $query->where('teacher_id', $teacher?->id))
            ->findOrFail($id);
    }

    private function teacherClassIds(Request $request, ?Teacher $teacher = null)
    {
        if ($request->user()?->hasRole('Super Admin')) {
            return Student::query()->active()
                ->get(['kelas_id', 'class_id'])
                ->flatMap(fn ($student) => [$student->kelas_id, $student->class_id])
                ->filter()->unique()->values();
        }

        $teacher ??= $this->getTeacherContext($request);
        $employee = Employee::query()->where('user_id', $request->user()?->id)->first();

        $scheduled = ClassSchedule::query()
            ->where(function ($query) use ($teacher, $employee) {
                if ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                    if ($teacher->employee_id) {
                        $query->orWhere('employee_id', $teacher->employee_id);
                    }
                }
                if ($employee) {
                    $query->orWhere('employee_id', $employee->id);
                }
            })
            ->get(['class_id', 'kelas_id'])
            ->flatMap(fn ($schedule) => [$schedule->class_id, $schedule->kelas_id]);

        $homeroom = Kelas::query()
            ->where(fn ($query) => $query->where('wali_kelas_id', $teacher?->id)->orWhere('wali_kelas_id', $employee?->id))
            ->pluck('id');

        return $scheduled->merge($homeroom)->filter()->unique()->values();
    }

    public function notifications(Request $request): JsonResponse
    {
        $notifications = Notification::query()
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        $teacher = $this->getTeacherContext($request);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'teacher' => $teacher?->load(['educationUnit', 'kelas']),
            ],
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'phone' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:6',
        ]);

        if ($request->filled('phone')) {
            $user->phone = $request->phone;
        }
        if ($request->filled('email')) {
            $user->email = $request->email;
        }
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data' => $user,
        ]);
    }

    public function chatConversations(Request $request): JsonResponse
    {
        $user = $request->user();
        $teacher = $this->getTeacherContext($request);
        $employee = Employee::query()->where('user_id', $user->id)->first();

        $homeroomKelasIds = Kelas::query()
            ->where(fn ($q) => $q->where('wali_kelas_id', $teacher?->id)->orWhere('wali_kelas_id', $employee?->id))
            ->pluck('id')
            ->toArray();

        $teachingKelasIds = ClassSchedule::query()
            ->where(fn ($q) => $q->where('teacher_id', $teacher?->id)->orWhere('employee_id', $employee?->id))
            ->where('is_active', true)
            ->pluck('kelas_id')
            ->filter()
            ->unique()
            ->toArray();

        $messages = PortalMessage::query()
            ->with(['student.kelas', 'student.educationUnit', 'sender:id,name,email', 'recipient:id,name,email'])
            ->where(fn ($q) => $q->where('sender_user_id', $user->id)->orWhere('recipient_user_id', $user->id))
            ->orderBy('created_at', 'desc')
            ->get();

        $grouped = [];

        foreach ($messages as $msg) {
            $student = $msg->student;
            if (! $student) {
                continue;
            }

            $otherUserId = $msg->sender_user_id === $user->id ? $msg->recipient_user_id : $msg->sender_user_id;
            $key = $student->id.'_'.$otherUserId;

            if (! isset($grouped[$key])) {
                $otherUser = $msg->sender_user_id === $user->id ? $msg->recipient : $msg->sender;
                $isHomeroom = in_array($student->kelas_id, $homeroomKelasIds, true);

                $unreadCount = PortalMessage::query()
                    ->where('student_id', $student->id)
                    ->where('sender_user_id', $otherUserId)
                    ->where('recipient_user_id', $user->id)
                    ->whereNull('read_at')
                    ->count();

                $grouped[$key] = [
                    'id' => $key,
                    'student_id' => $student->id,
                    'student_name' => $student->full_name,
                    'parent_user_id' => $otherUserId,
                    'parent_name' => $otherUser?->name ?? 'Orang Tua/Wali',
                    'class_name' => $student->kelas?->nama_kelas ?? '-',
                    'unit_name' => $student->educationUnit?->name ?? '-',
                    'teacher_type' => $isHomeroom ? 'wali_kelas' : 'guru_mapel',
                    'role_label' => $isHomeroom ? 'Wali Kelas' : 'Guru Mapel',
                    'last_message' => $msg->message,
                    'last_message_at' => $msg->created_at?->toIso8601String(),
                    'unread_count' => $unreadCount,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => array_values($grouped),
        ]);
    }

    public function chatMessages(Request $request, string $parentUserId, string $studentId): JsonResponse
    {
        $user = $request->user();

        PortalMessage::query()
            ->where('student_id', $studentId)
            ->where('sender_user_id', $parentUserId)
            ->where('recipient_user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = PortalMessage::query()
            ->with(['sender:id,name', 'recipient:id,name'])
            ->where('student_id', $studentId)
            ->where(function ($q) use ($user, $parentUserId) {
                $q->where(fn ($q2) => $q2->where('sender_user_id', $user->id)->where('recipient_user_id', $parentUserId))
                    ->orWhere(fn ($q2) => $q2->where('sender_user_id', $parentUserId)->where('recipient_user_id', $user->id));
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function sendChatMessage(Request $request, string $parentUserId, string $studentId): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $user = $request->user();
        $student = Student::query()->with('kelas')->find($studentId);

        if (! $student) {
            return response()->json(['success' => false, 'message' => 'Siswa tidak ditemukan.'], 404);
        }

        $message = PortalMessage::query()->create([
            'id' => (string) Str::uuid(),
            'student_id' => $studentId,
            'sender_user_id' => $user->id,
            'recipient_user_id' => $parentUserId,
            'message' => trim($request->input('message')),
        ]);

        try {
            Notification::query()->create([
                'id' => (string) Str::uuid(),
                'user_id' => $parentUserId,
                'title' => 'Pesan Baru Guru (' . $user->name . ')',
                'body' => Str::limit($message->message, 100),
                'type' => 'chat',
                'data' => [
                    'student_id' => $studentId,
                    'teacher_user_id' => $user->id,
                    'message_id' => $message->id,
                ],
                'is_read' => false,
            ]);
        } catch (\Throwable $e) {
            // Silence notification schema fallback
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dikirim.',
            'data' => $message->load(['sender:id,name', 'recipient:id,name']),
        ]);
    }
}
