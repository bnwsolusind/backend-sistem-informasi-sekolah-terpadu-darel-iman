<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Master Item 62 Target Doa Harian
        Schema::create('prayer_assessment_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedSmallInteger('order_number')->unique()->comment('Nomor urut 1 - 62');
            $table->string('name', 255)->comment('Nama Doa Harian');
            $table->string('group', 100)->default('Doa Doa Harian');
            $table->decimal('max_score', 5, 2)->default(100.00);
            $table->decimal('passing_score', 5, 2)->default(75.00)->comment('KKM capaian');
            $table->boolean('is_active')->default(true);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['order_number', 'is_active'], 'prayer_items_order_active_idx');
        });

        // 2. Skala Konversi Nilai ke Grade (Mumtaz, Jayyid Jiddan, Jayyid, Maqbul)
        Schema::create('prayer_grade_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('grade', 5)->comment('A, B, C, D');
            $table->string('label', 100)->comment('Mumtaz, Jayyid Jiddan, Jayyid, Maqbul');
            $table->decimal('min_score', 5, 2);
            $table->decimal('max_score', 5, 2);
            $table->string('description', 255)->nullable();
            $table->unsignedSmallInteger('order_index')->default(1);
            $table->boolean('is_active')->default(true);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestampsTz();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });

        // 3. Transaksi Lembar Penilaian Doa Siswa (Poin & Paraf Penguji)
        Schema::create('student_prayer_assessments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('student_id');
            $table->uuid('prayer_item_id');
            $table->uuid('academic_year_id')->nullable();
            $table->uuid('semester_id')->nullable();
            $table->decimal('score', 5, 2)->nullable()->comment('Poin perolehan');
            $table->string('grade', 10)->nullable()->comment('Grade per item');
            $table->boolean('is_passed')->default(false)->comment('Status kelulusan KKM');
            $table->uuid('paraf_by')->nullable()->comment('ID Guru/Penguji yang memaraf');
            $table->string('paraf_name', 150)->nullable()->comment('Nama Guru/Penguji');
            $table->timestampTz('paraf_at')->nullable()->comment('Waktu paraf dibubuhkan');
            $table->text('notes')->nullable()->comment('Catatan makhraj/adab/kelancaran');
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestampsTz();

            $table->foreign('student_id')->references('id')->on('students')->cascadeOnDelete();
            $table->foreign('prayer_item_id')->references('id')->on('prayer_assessment_items')->cascadeOnDelete();
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->nullOnDelete();
            $table->foreign('semester_id')->references('id')->on('semesters')->nullOnDelete();
            $table->foreign('paraf_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();

            $table->unique(['student_id', 'prayer_item_id'], 'unique_student_prayer_item');
            $table->index(['student_id', 'is_passed'], 'student_prayer_passed_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_prayer_assessments');
        Schema::dropIfExists('prayer_grade_rules');
        Schema::dropIfExists('prayer_assessment_items');
    }
};
