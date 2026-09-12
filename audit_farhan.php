<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'ahmad.farhan@dareliman.sch.id';
$u = App\Models\User::where('email', $email)->first();
$emp = App\Models\Employee::where('user_id', $u->id)->first()
    ?? App\Models\Employee::where('email', $u->email)->first();
$tch = App\Models\Teacher::where('user_id', $u->id)->first()
    ?? ($emp ? App\Models\Teacher::where('employee_id', $emp->id)->first() : null);

$ownerIds = array_values(array_unique(array_filter([
    $tch?->id, $tch?->employee_id, $emp?->id, $u->id,
])));

// 1. Cek ClassSchedule lebih detail
echo "=== CLASS SCHEDULES DETAIL ===\n";
$schedules = App\Models\ClassSchedule::where(function($q) use ($emp, $tch) {
    if ($emp) $q->orWhere('employee_id', $emp->id);
    if ($tch) $q->orWhere('teacher_id', $tch->id);
})->with(['kelas','subject'])->get();
foreach ($schedules as $s) {
    echo "  kelas_id: {$s->kelas_id} | nama: ".($s->kelas?->nama_kelas ?? 'N/A')." | mapel: ".($s->subject?->name ?? 'N/A')." | subject_id: {$s->subject_id}\n";
}

// 2. Cari apakah ada jadwal di Kelas 2 Utsman
echo "\n=== SEARCH: Is Kelas 2 Utsman in schedules? ===\n";
$utsman = App\Models\Kelas::where('nama_kelas', 'LIKE', '%Utsman%')->get(['id','nama_kelas']);
foreach ($utsman as $k) {
    $hasSched = App\Models\ClassSchedule::where(function($q) use ($emp, $tch) {
        if ($emp) $q->orWhere('employee_id', $emp->id);
        if ($tch) $q->orWhere('teacher_id', $tch->id);
    })->where('kelas_id', $k->id)->count();
    echo "  {$k->nama_kelas} (ID:{$k->id}): $hasSched jadwal\n";
}

// 3. Audit LmsModulAjar yang terhubung ke materi guru ini
echo "\n=== MODUL AJAR detail (from materials) ===\n";
$modulIds = App\Models\LmsMateri::whereIn('guru_id', $ownerIds)->pluck('modul_ajar_id')->unique();
$moduls = App\Models\LmsModulAjar::whereIn('id', $modulIds)->with(['kelas','subject'])->get();
echo "Jumlah modul unik: ".count($moduls)."\n";
foreach ($moduls as $m) {
    $kelasNama = $m->kelas?->nama_kelas ?? App\Models\Kelas::find($m->kelas_id)?->nama_kelas ?? 'NULL';
    $matCount = App\Models\LmsMateri::where('modul_ajar_id', $m->id)->count();
    echo "  ModulID: {$m->id}\n";
    echo "    kelas_id : {$m->kelas_id} ({$kelasNama})\n";
    echo "    rombel_id: {$m->rombel_id}\n";
    echo "    guru_id  : {$m->guru_id}\n";
    echo "    mapel    : ".($m->subject?->name ?? App\Models\Subject::find($m->mata_pelajaran_id)?->name ?? 'NULL')."\n";
    echo "    jumlah materi: $matCount\n";
    echo "    ---\n";
}

// 4. Cek per rombel: berapa materi yang seharusnya tampil?
echo "\n=== MATERI SEHARUSNYA PER ROMBEL (via modul_ajar.kelas_id) ===\n";
$kelasIds = $schedules->pluck('kelas_id')->filter()->unique()->values();
foreach ($kelasIds as $kid) {
    $kName = App\Models\Kelas::find($kid)?->nama_kelas ?? $kid;
    $count = App\Models\LmsMateri::whereIn('guru_id', $ownerIds)
        ->whereHas('modulAjar', fn($q) => $q->where('kelas_id', $kid)->orWhere('rombel_id', $kid))
        ->count();
    echo "  $kName ($kid): $count materi\n";
}

// 5. Cek Kelas 2 Utsman secara khusus
echo "\n=== KELAS 2 UTSMAN: ID ===\n";
$utsman2 = '019fe0a0-3f06-7218-9fdc-6656f092292e';
$utsman2Name = App\Models\Kelas::find($utsman2)?->nama_kelas ?? 'NOT FOUND';
echo "  ID: $utsman2 => $utsman2Name\n";

// Siapa guru yang ada jadwal di Kelas 2 Utsman?
echo "\n=== SIAPA GURU YANG PUNYA JADWAL DI KELAS 2 UTSMAN? ===\n";
$utsSched = App\Models\ClassSchedule::where(function($q) {
    $q->where('kelas_id', '019fe0a0-3f06-7218-9fdc-6656f092292e');
})->with(['employee','subject'])->limit(10)->get();
foreach ($utsSched as $s) {
    echo "  employee: ".($s->employee?->name ?? 'N/A')." | mapel: ".($s->subject?->name ?? 'N/A')."\n";
}

// 6. Audit filter yang dikirim backend saat selectedClass = Kelas 2 Utsman
echo "\n=== SIMULASI API QUERY: materials?class_id=019fe0a0-3f06-7218-9fdc-6656f092292e ===\n";
$classId = '019fe0a0-3f06-7218-9fdc-6656f092292e';
$matFiltered = App\Models\LmsMateri::whereIn('guru_id', $ownerIds)
    ->whereHas('modulAjar', fn($q) => $q->where('kelas_id', $classId)->orWhere('rombel_id', $classId))
    ->with('subject')
    ->get();
echo "Result count: ".count($matFiltered)."\n";
$bySubject = $matFiltered->groupBy(fn($m) => $m->subject?->name ?? 'NO SUBJECT');
foreach ($bySubject as $subj => $items) {
    echo "  $subj: ".count($items)." materi\n";
}
