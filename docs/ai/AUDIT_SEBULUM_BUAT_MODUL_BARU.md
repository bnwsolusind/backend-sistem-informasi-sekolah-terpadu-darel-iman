# PROMPT STANDAR PENAMBAHAN MODUL BARU AGAR MIGRATION SELALU SINKRON

Anda bertindak sebagai **Senior Laravel 12 Backend Architect, PostgreSQL Database Engineer, dan System Integration Engineer**.

Setiap kali menambahkan modul baru pada proyek Sistem Manajemen Sekolah Terpadu, jangan langsung membuat migration, model, controller, atau seeder secara terpisah.

Lakukan audit terlebih dahulu terhadap struktur proyek yang sedang berjalan agar modul baru mengikuti standar database, relasi, penamaan, UUID, audit field, multi-unit, tahun ajaran, semester, dan pola CRUD yang sudah ada.

Teknologi proyek:

* Laravel 12
* PHP 8.3
* PostgreSQL 17
* React.js + Vite untuk dashboard web
* React Native untuk aplikasi mobile
* Laravel Sanctum
* Spatie Laravel Permission
* UUID sebagai primary key
* Soft delete
* Multi-unit pendidikan
* REST API
* Controller, Form Request, Service, Repository, Resource, Model
* Seeder idempotent
* PostgreSQL foreign key dan index

# TUJUAN

Setiap modul baru harus:

1. Menggunakan struktur migration yang sama
2. Menggunakan tipe primary key dan foreign key yang sama
3. Menggunakan relasi akademik yang sudah tersedia
4. Tidak membuat tabel master baru jika master sudah ada
5. Tidak membuat foreign key dengan nama berbeda
6. Tidak menduplikasi data atau tabel
7. Tidak mengubah CRUD modul lama
8. Tidak mengubah endpoint lama
9. Tidak merusak relasi lama
10. Dapat dijalankan pada database existing
11. Dapat dibangun dari database kosong
12. Seeder dapat dijalankan berulang kali
13. Mendukung penambahan modul berikutnya
14. Memiliki test integritas relasi

# MASTER NON-BREAKING RULE

JANGAN mengubah:

* Alur CRUD modul yang sudah berjalan
* Endpoint API lama
* Nama route lama
* Nama menu lama
* Struktur response API lama
* Request frontend lama
* Komponen UI lama
* Service frontend lama
* State management lama
* Hak akses lama
* Role lama
* Permission lama
* Nama tabel lama yang masih digunakan
* Nama kolom lama yang masih digunakan
* Struktur data produksi
* Relasi yang sudah benar
* Migration lama yang sudah dijalankan

Modul baru harus menyesuaikan struktur proyek, bukan memaksa proyek lama menyesuaikan modul baru.

# TAHAP 1 — AUDIT SEBELUM MEMBUAT MODUL

Sebelum membuat modul baru, baca dan audit:

```text
database/migrations/
database/seeders/
database/factories/
app/Models/
app/Http/Controllers/
app/Http/Requests/
app/Http/Resources/
app/Services/
app/Repositories/
routes/
tests/
web-dashboard/
mobile-app/
```

Cari terlebih dahulu:

* Tabel yang sudah tersedia
* Model yang sudah tersedia
* Foreign key yang sudah tersedia
* Relasi induk yang sudah tersedia
* Master data yang dapat digunakan
* Seeder yang sudah tersedia
* Endpoint yang dapat digunakan kembali
* Trait UUID yang digunakan
* Trait audit yang digunakan
* Pola soft delete
* Format status
* Scope unit pendidikan
* Scope tahun ajaran
* Scope semester
* Scope pengguna
* Pola permission
* Pola API Resource
* Pola pagination
* Pola filter
* Pola validasi
* Pola import dan export

Jangan membuat migration sebelum audit selesai.

# TAHAP 2 — IDENTIFIKASI KONTEKS MODUL

Tentukan apakah modul baru membutuhkan relasi berikut:

```text
education_unit_id
academic_year_id
semester_id
curriculum_id
subject_id
classroom_id
study_group_id
schedule_id
employee_id
teacher_id
student_id
parent_id
created_by
updated_by
deleted_by
```

Jangan menambahkan seluruh foreign key secara otomatis.

Tambahkan hanya foreign key yang benar-benar dibutuhkan oleh proses bisnis modul.

Contoh:

## Modul akademik

Biasanya membutuhkan:

```text
education_unit_id
academic_year_id
semester_id
subject_id
study_group_id
teacher_id
```

## Modul data siswa

Biasanya membutuhkan:

```text
education_unit_id
student_id
academic_year_id
study_group_id
```

## Modul LMS

Biasanya membutuhkan:

```text
education_unit_id
academic_year_id
semester_id
subject_id
teacher_id
study_group_id
learning_outcome_id
learning_objective_id
```

## Modul tahfizh

Biasanya membutuhkan:

```text
education_unit_id
academic_year_id
semester_id
student_id
teacher_id
study_group_id
surah_id
```

## Modul mutabaah

Biasanya membutuhkan:

```text
education_unit_id
academic_year_id
semester_id
student_id
monitoring_date
```

# TAHAP 3 — CEK TABEL MASTER

Sebelum membuat tabel baru, cari apakah tabel master sudah ada.

Contoh:

Jangan membuat:

```text
master_siswa
data_siswa
student_master
tbl_student
```

jika tabel berikut sudah ada:

```text
students
```

Jangan membuat:

```text
master_guru
teachers_data
tbl_guru
```

jika data guru sudah berasal dari:

```text
employees
```

dengan jabatan atau role guru.

Jangan membuat:

```text
master_tahun_ajaran
tahun_ajaran_lms
academic_periods
```

jika sudah tersedia:

```text
academic_years
semesters
```

Jangan membuat ulang:

* Unit pendidikan
* Tahun ajaran
* Semester
* Kurikulum
* Mata pelajaran
* Pegawai
* Guru
* Siswa
* Kelas
* Rombel
* Jadwal
* CP
* TP
* Pengguna
* Role
* Permission

Gunakan foreign key ke tabel master yang sudah tersedia.

# STANDAR MIGRATION MODUL BARU

Migration modul baru harus mengikuti pola berikut:

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nama_tabel_plural', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('education_unit_id')
                ->constrained('education_units')
                ->restrictOnDelete();

            $table->foreignUuid('academic_year_id')
                ->constrained('academic_years')
                ->restrictOnDelete();

            $table->foreignUuid('semester_id')
                ->nullable()
                ->constrained('semesters')
                ->restrictOnDelete();

            $table->string('code', 50);
            $table->string('name');
            $table->string('status', 30)->default('active');
            $table->text('description')->nullable();

            $table->foreignUuid('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignUuid('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignUuid('deleted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(
                ['education_unit_id', 'code'],
                'nama_tabel_unit_code_unique'
            );

            $table->index(
                ['education_unit_id', 'academic_year_id', 'semester_id'],
                'nama_tabel_academic_context_index'
            );

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nama_tabel_plural');
    }
};
```

Sesuaikan foreign key dengan kebutuhan modul.

Jangan menyalin seluruh contoh tanpa audit.

# STANDAR PRIMARY KEY

Gunakan:

```php
$table->uuid('id')->primary();
```

Model menggunakan:

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class NamaModel extends Model
{
    use HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;
}
```

Jangan menggunakan:

```php
$table->id();
$table->bigIncrements('id');
$table->increments('id');
```

jika standar proyek memakai UUID.

# STANDAR FOREIGN KEY

Foreign key harus memiliki tipe yang sama dengan primary key tabel induk.

Jika tabel induk:

```php
$table->uuid('id')->primary();
```

maka tabel anak wajib menggunakan:

```php
$table->foreignUuid('student_id')
    ->constrained('students');
```

Jangan menggunakan:

```php
$table->unsignedBigInteger('student_id');
$table->integer('student_id');
$table->string('student_id');
```

untuk relasi ke UUID.

# STANDAR NAMA FOREIGN KEY

Gunakan nama konsisten:

```text
education_unit_id
academic_year_id
semester_id
curriculum_id
subject_id
classroom_id
study_group_id
schedule_id
employee_id
teacher_id
student_id
parent_id
learning_outcome_id
learning_objective_id
created_by
updated_by
deleted_by
```

Jangan membuat variasi:

```text
unit_id
unit_pendidikan_id
id_unit
tahun_ajaran_id
academic_period_id
mapel_id
mata_pelajaran_id
id_siswa
pegawai_guru_id
```

Jika proyek existing masih menggunakan nama lama, ikuti nama yang sudah menjadi standar aktif pada proyek.

Jangan membuat standar ketiga.

# PENENTUAN RELASI GURU

Audit terlebih dahulu apakah guru menggunakan:

```text
employees.id
```

atau tabel khusus:

```text
teachers.id
```

Jika guru adalah bagian dari pegawai, gunakan:

```php
$table->foreignUuid('teacher_id')
    ->constrained('employees')
    ->restrictOnDelete();
```

Jangan membuat tabel guru baru apabila data guru sudah berasal dari tabel pegawai.

Model:

```php
public function teacher(): BelongsTo
{
    return $this->belongsTo(Employee::class, 'teacher_id');
}
```

# PENENTUAN RELASI KELAS DAN ROMBEL

Bedakan:

```text
classrooms
```

sebagai kelas atau tingkat dasar, dan:

```text
study_groups
```

sebagai rombongan belajar pada periode tertentu.

Untuk transaksi pembelajaran, presensi, nilai, tugas, tahfizh, dan mutabaah, prioritaskan relasi:

```text
study_group_id
```

karena rombel merepresentasikan kelompok siswa pada tahun ajaran tertentu.

Jangan hanya menggunakan `classroom_id` jika transaksi memerlukan histori rombel.

# KONTEKS AKADEMIK WAJIB

Modul transaksi akademik harus memiliki konteks periode yang jelas.

Minimal audit kebutuhan:

```text
education_unit_id
academic_year_id
semester_id
```

Jangan mengambil semester aktif secara tersembunyi tanpa menyimpan relasi jika data harus memiliki histori.

Data transaksi tahun sebelumnya harus tetap dapat diketahui periodenya.

# STANDAR DELETE BEHAVIOR

Gunakan:

## Restrict

```php
->restrictOnDelete();
```

untuk master penting:

* Unit pendidikan
* Tahun ajaran
* Semester
* Kurikulum
* Mata pelajaran
* Siswa
* Pegawai
* Kelas
* Rombel
* Jadwal

## Cascade

```php
->cascadeOnDelete();
```

hanya untuk data anak murni:

* Detail transaksi
* Pivot
* Lampiran
* Item yang tidak dapat berdiri sendiri

## Null

```php
->nullOnDelete();
```

untuk relasi opsional atau audit:

* created_by
* updated_by
* deleted_by
* approved_by
* teacher_id opsional jika histori harus dipertahankan

Jangan menggunakan cascade delete pada data master secara sembarangan.

# STANDAR UNIQUE CONSTRAINT

Unique constraint harus mengikuti konteks multi-unit.

Jangan membuat:

```php
$table->string('code')->unique();
```

jika kode dapat sama pada unit berbeda.

Gunakan:

```php
$table->unique(
    ['education_unit_id', 'code'],
    'module_unit_code_unique'
);
```

Jika terkait periode:

```php
$table->unique(
    [
        'education_unit_id',
        'academic_year_id',
        'semester_id',
        'code',
    ],
    'module_academic_code_unique'
);
```

Jika transaksi per siswa:

```php
$table->unique(
    [
        'student_id',
        'academic_year_id',
        'semester_id',
        'reference_id',
    ],
    'module_student_period_unique'
);
```

Sebelum membuat unique constraint, pastikan tidak ada data duplikat.

# STANDAR INDEX

Tambahkan index berdasarkan query nyata.

Index umum:

```php
$table->index('education_unit_id');
$table->index('academic_year_id');
$table->index('semester_id');
$table->index('student_id');
$table->index('teacher_id');
$table->index('subject_id');
$table->index('study_group_id');
$table->index('status');
```

Composite index:

```php
$table->index(
    ['education_unit_id', 'academic_year_id', 'semester_id'],
    'module_academic_context_index'
);
```

Jangan menambahkan index berulang jika foreign key atau unique constraint sudah membuat index yang cukup.

Audit index PostgreSQL terlebih dahulu.

# MODEL MODUL BARU

Model harus mengikuti migration secara penuh.

Contoh:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class NamaModul extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'nama_tabel';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'education_unit_id',
        'academic_year_id',
        'semester_id',
        'code',
        'name',
        'status',
        'description',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function educationUnit(): BelongsTo
    {
        return $this->belongsTo(
            EducationUnit::class,
            'education_unit_id'
        );
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(
            AcademicYear::class,
            'academic_year_id'
        );
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(
            Semester::class,
            'semester_id'
        );
    }
}
```

Pastikan:

* Semua kolom migration yang boleh diisi ada di `$fillable`
* Semua foreign key memiliki relasi model
* Nama foreign key ditulis eksplisit
* Cast tanggal, boolean, JSON, dan decimal sesuai migration
* Soft delete sama dengan migration
* Jangan membuat relasi ke model yang tidak ada

# FORM REQUEST

Validasi harus sinkron dengan migration.

Contoh:

```php
public function rules(): array
{
    return [
        'education_unit_id' => [
            'required',
            'uuid',
            'exists:education_units,id',
        ],

        'academic_year_id' => [
            'required',
            'uuid',
            'exists:academic_years,id',
        ],

        'semester_id' => [
            'nullable',
            'uuid',
            'exists:semesters,id',
        ],

        'code' => [
            'required',
            'string',
            'max:50',
        ],

        'name' => [
            'required',
            'string',
            'max:255',
        ],

        'status' => [
            'required',
            Rule::in([
                'active',
                'inactive',
            ]),
        ],
    ];
}
```

Pastikan validasi create dan update mempertimbangkan unique constraint sesuai unit dan periode.

# SERVICE DAN REPOSITORY

Query modul baru harus menggunakan konteks yang sama dengan proyek.

Contoh:

```php
$query->when(
    $filters['education_unit_id'] ?? null,
    fn ($query, $unitId) =>
        $query->where('education_unit_id', $unitId)
);

$query->when(
    $filters['academic_year_id'] ?? null,
    fn ($query, $academicYearId) =>
        $query->where('academic_year_id', $academicYearId)
);

$query->when(
    $filters['semester_id'] ?? null,
    fn ($query, $semesterId) =>
        $query->where('semester_id', $semesterId)
);
```

Jangan membuat filter menggunakan nama kolom berbeda dari migration.

Gunakan eager loading untuk relasi yang ditampilkan:

```php
$query->with([
    'educationUnit:id,name',
    'academicYear:id,name',
    'semester:id,name',
]);
```

# API RESOURCE

Response modul baru harus mengikuti format API proyek.

Jangan membuat format response baru apabila proyek sudah memiliki standar.

Contoh isi Resource:

```php
public function toArray($request): array
{
    return [
        'id' => $this->id,
        'education_unit_id' => $this->education_unit_id,
        'academic_year_id' => $this->academic_year_id,
        'semester_id' => $this->semester_id,
        'code' => $this->code,
        'name' => $this->name,
        'status' => $this->status,
        'description' => $this->description,

        'education_unit' => $this->whenLoaded(
            'educationUnit'
        ),

        'academic_year' => $this->whenLoaded(
            'academicYear'
        ),

        'semester' => $this->whenLoaded(
            'semester'
        ),

        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
    ];
}
```

# SEEDER MODUL BARU

Seeder harus:

* Menggunakan relasi yang tersedia
* Tidak menggunakan UUID foreign key hardcode
* Menggunakan `updateOrCreate`
* Aman dijalankan berulang kali
* Memiliki dependency yang jelas
* Tidak membuat data yatim
* Tidak menghapus data lama
* Tidak menggunakan truncate
* Tidak membuat data produksi palsu

Contoh:

```php
use App\Models\AcademicYear;
use App\Models\EducationUnit;
use App\Models\NamaModul;
use App\Models\Semester;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class NamaModulSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $unit = EducationUnit::query()
                ->where('status', 'active')
                ->first();

            $academicYear = AcademicYear::query()
                ->where('status', 'active')
                ->first();

            $semester = Semester::query()
                ->where('academic_year_id', $academicYear?->id)
                ->where('status', 'active')
                ->first();

            if (!$unit || !$academicYear || !$semester) {
                throw new RuntimeException(
                    'NamaModulSeeder membutuhkan unit pendidikan, tahun ajaran, dan semester aktif.'
                );
            }

            NamaModul::query()->updateOrCreate(
                [
                    'education_unit_id' => $unit->id,
                    'academic_year_id' => $academicYear->id,
                    'semester_id' => $semester->id,
                    'code' => 'CONTOH-001',
                ],
                [
                    'name' => 'Data Contoh',
                    'status' => 'active',
                    'description' => 'Data awal modul.',
                ]
            );
        });
    }
}
```

# DATABASESEEDER

Tambahkan seeder modul baru sesuai urutan dependency.

Contoh:

```php
$this->call([
    EducationUnitSeeder::class,
    AcademicYearSeeder::class,
    SemesterSeeder::class,
    SubjectSeeder::class,
    StudentSeeder::class,
    ClassScheduleSeeder::class,

    NamaModulSeeder::class,
]);
```

Jangan memanggil seeder modul sebelum seeder induknya.

# MIGRATION BARU PADA DATABASE EXISTING

Jika proyek sudah memiliki data, jangan mengubah migration lama.

Buat migration baru:

```bash
php artisan make:migration create_nama_modul_table
```

Jika memperbaiki modul setelah migration dijalankan:

```bash
php artisan make:migration add_academic_context_to_nama_modul_table
```

Jangan menggunakan:

```bash
php artisan migrate:fresh
php artisan migrate:reset
php artisan migrate:refresh
```

pada database yang memiliki data penting.

# MIGRATION BERTAHAP

Jika modul baru membutuhkan relasi ke data lama, gunakan tahapan:

```text
1. Tambahkan kolom foreign key sebagai nullable
2. Isi data relasi lama
3. Audit nilai null
4. Audit orphan record
5. Tambahkan foreign key constraint
6. Tambahkan index
7. Tambahkan unique constraint
8. Ubah menjadi required hanya jika aman
```

Jangan menambahkan kolom required langsung jika tabel sudah memiliki data.

# SYNCHRONIZATION CHECKLIST

Sebelum modul dianggap selesai, pastikan sinkronisasi berikut.

## Migration dengan model

```text
Nama tabel sama
Nama kolom sama
Primary key sama
Foreign key sama
Nullable sama
Default value sama
Soft delete sama
Cast sama
```

## Migration dengan Request

```text
Required sesuai nullable
UUID sesuai tipe database
Max length sesuai kolom
Enum sesuai status
Exists sesuai tabel induk
Unique sesuai composite unique
```

## Migration dengan Seeder

```text
Semua foreign key tersedia
Tidak ada ID hardcode
Urutan dependency benar
Seeder idempotent
Tidak ada data orphan
Tidak ada data duplikat
```

## Migration dengan API

```text
Nama field request sama
Nama field response sama
Relasi tampil
Filter bekerja
Pagination bekerja
Dropdown relasi bekerja
```

## Migration dengan frontend

```text
Field form tersedia
Field tabel tersedia
Dropdown mengambil data benar
Create berhasil
Update berhasil
Delete berhasil
Detail tampil
Filter tampil
```

# TEST WAJIB MODUL BARU

Buat Feature Test:

```text
Modul dapat menampilkan daftar
Modul dapat menampilkan detail
Modul dapat membuat data
Modul dapat mengubah data
Modul dapat menghapus data
Soft delete berjalan
Foreign key invalid ditolak
Unit pendidikan invalid ditolak
Tahun ajaran invalid ditolak
Semester invalid ditolak
Data antar unit tidak tercampur
Seeder dapat dijalankan dua kali
Relasi model dapat dimuat
API response sesuai standar
```

Contoh nama test:

```text
tests/Feature/NamaModul/NamaModulCrudTest.php
tests/Feature/NamaModul/NamaModulRelationTest.php
tests/Feature/NamaModul/NamaModulSeederTest.php
```

# PERINTAH VERIFIKASI

Jalankan:

```bash
php artisan optimize:clear
php artisan migrate:status
php artisan migrate --pretend
php artisan migrate
php artisan db:seed --class=NamaModulSeeder
php artisan db:seed --class=NamaModulSeeder
php artisan test
```

Seeder dijalankan dua kali untuk memastikan tidak terjadi duplikasi.

Untuk database testing:

```bash
php artisan migrate:fresh --seed --env=testing
php artisan test --env=testing
```

Jangan menggunakan database production untuk pengujian fresh migration.

# DETEKSI KETIDAKSINKRONAN

Jika ditemukan kondisi berikut:

```text
Kolom migration tidak ada pada model
Kolom model tidak ada pada migration
Foreign key berbeda tipe
Seeder menggunakan field yang tidak ada
Request mengirim field lama
Resource tidak mengembalikan field yang dibutuhkan
Frontend menggunakan nama field berbeda
Relasi mengarah ke tabel salah
Seeder dijalankan sebelum parent data tersedia
```

maka:

1. Hentikan penambahan kode baru pada bagian tersebut
2. Laporkan masalah
3. Tentukan sumber data yang benar
4. Gunakan standar yang sudah aktif di proyek
5. Perbaiki modul baru
6. Jangan mengubah modul lama jika tidak diperlukan
7. Buat adapter jika kompatibilitas dibutuhkan
8. Jalankan test ulang

# PENGHAPUSAN FILE MODUL BARU YANG SALAH

Jika migration, seeder, model, factory, atau file modul baru belum pernah digunakan dan terbukti tidak sinkron:

* Hapus file yang salah
* Buat ulang menggunakan struktur proyek
* Perbarui dependency
* Perbarui DatabaseSeeder
* Perbarui test

File boleh dihapus jika:

* Belum masuk production
* Migration belum dijalankan
* Tidak memiliki data
* Tidak memiliki dependency
* Tidak digunakan modul lain
* Ada file pengganti yang benar

Jika migration sudah dijalankan, jangan hanya menghapus file.

Buat migration koreksi baru.

# TEMPLATE ANALISIS MODUL BARU

Sebelum implementasi, tampilkan:

```text
NAMA MODUL:
JENIS MODUL:
TABEL BARU:
TABEL MASTER YANG DIGUNAKAN:
FOREIGN KEY:
PRIMARY KEY:
KONTEKS UNIT:
KONTEKS TAHUN AJARAN:
KONTEKS SEMESTER:
RELASI SISWA:
RELASI PEGAWAI/GURU:
RELASI KELAS/ROMBEL:
DEPENDENCY SEEDER:
UNIQUE CONSTRAINT:
INDEX:
SOFT DELETE:
AUDIT FIELD:
ROLE DAN PERMISSION:
RISIKO BREAKING CHANGE:
```

Nilai risiko breaking change harus:

```text
RENDAH atau 0
```

Jika risiko tidak rendah, jelaskan penyebab sebelum implementasi.

# OUTPUT AKHIR

Setelah menambahkan modul, tampilkan:

## File dibuat

```text
Migration
Model
Factory
Seeder
Controller
Form Request
Service
Repository
Resource
Route
Permission
Test
Frontend service
Frontend page
```

## Relasi digunakan

```text
Nama foreign key
Tabel induk
Delete behavior
Nullable atau required
Index
```

## Hasil sinkronisasi

```text
Migration vs Model: PASS/FAIL
Migration vs Request: PASS/FAIL
Migration vs Seeder: PASS/FAIL
Migration vs API: PASS/FAIL
Migration vs Frontend: PASS/FAIL
Foreign key integrity: PASS/FAIL
Seeder idempotent: PASS/FAIL
CRUD compatibility: PASS/FAIL
Fresh database test: PASS/FAIL
Existing database upgrade: PASS/FAIL
```

## Hasil test

```text
Create: PASS/FAIL
Read: PASS/FAIL
Update: PASS/FAIL
Delete: PASS/FAIL
Relation: PASS/FAIL
Filter: PASS/FAIL
Permission: PASS/FAIL
Seeder twice: PASS/FAIL
```

# LARANGAN KERAS

Jangan:

* Membuat tabel master duplikat
* Membuat nama foreign key baru untuk relasi yang sama
* Mencampurkan UUID dan BIGINT
* Mengubah migration lama yang sudah dijalankan
* Menghapus tabel existing
* Menghapus data lama
* Menggunakan ID hardcode pada seeder
* Menjalankan truncate
* Menggunakan migrate:fresh pada production
* Menambahkan cascade delete tanpa audit
* Mengubah endpoint lama
* Mengubah response lama
* Mengubah CRUD lama
* Mengubah UI lama
* Membuat status baru tanpa audit status existing
* Membuat relasi guru yang berbeda dengan modul lain
* Membuat relasi kelas dan rombel yang berbeda dengan modul lain
* Menyimpan data akademik tanpa konteks periode
* Menganggap migration berhasil hanya karena tidak error
* Menyelesaikan modul tanpa test relasi dan seeder

# INSTRUKSI EKSEKUSI

Setiap menerima permintaan penambahan modul:

```text
Audit proyek
→ Temukan master dan relasi existing
→ Tentukan struktur tabel
→ Tampilkan rencana relasi
→ Buat migration
→ Buat model dan relasi
→ Buat Request
→ Buat Service dan Repository
→ Buat Resource
→ Buat Controller
→ Buat Seeder
→ Tambahkan ke DatabaseSeeder
→ Buat permission
→ Buat test
→ Jalankan migrate --pretend
→ Jalankan migration
→ Jalankan seeder dua kali
→ Jalankan CRUD test
→ Periksa frontend
→ Laporkan hasil
```

Jangan berhenti hanya pada pembuatan file.

Pastikan modul benar-benar terhubung dengan struktur database proyek.

# TUJUAN AKHIR

Setiap modul baru harus menghasilkan kondisi berikut:

```text
Tidak ada tabel duplikat
Tidak ada foreign key berbeda standar
Tidak ada relasi yatim
Tidak ada seeder duplikat
Tidak ada data lintas unit tercampur
Tidak ada perbedaan konteks tahun ajaran
Tidak ada perbedaan konteks semester
Tidak ada UUID dan BIGINT tercampur
Tidak ada field frontend yang hilang
Tidak ada perubahan CRUD lama
Migration existing tetap aman
Database kosong dapat dibangun
Database lama dapat di-upgrade
Seeder dapat dijalankan berulang kali
Modul berikutnya dapat mengikuti pola yang sama
```
