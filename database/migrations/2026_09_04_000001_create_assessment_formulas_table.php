<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessment_formulas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150);
            $table->string('type', 20)->comment('academic, tahfizh, mutabaah');
            $table->string('scope', 20)->default('global')->comment('global, unit, class');
            $table->uuid('education_unit_id')->nullable();
            $table->uuid('class_id')->nullable();
            $table->uuid('academic_year_id');
            $table->uuid('semester_id')->nullable();
            $table->jsonb('components');
            $table->decimal('minimum_score', 5, 2)->nullable();
            $table->unsignedTinyInteger('rounding_precision')->default(2);
            $table->string('status', 20)->default('draft')->comment('draft, submitted, approved, active, archived');
            $table->unsignedInteger('version')->default(1);
            $table->date('effective_from')->nullable();
            $table->date('effective_until')->nullable();
            $table->uuid('created_by');
            $table->uuid('updated_by')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->uuid('activated_by')->nullable();
            $table->timestampTz('approved_at')->nullable();
            $table->timestampTz('activated_at')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->foreign('education_unit_id')->references('id')->on('education_units')->nullOnDelete();
            $table->foreign('class_id')->references('id')->on('tbl_kelas')->nullOnDelete();
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->restrictOnDelete();
            $table->foreign('semester_id')->references('id')->on('semesters')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('activated_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['type', 'status', 'academic_year_id', 'semester_id'], 'assessment_formula_period_idx');
            $table->index(['scope', 'education_unit_id', 'class_id'], 'assessment_formula_scope_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessment_formulas');
    }
};
