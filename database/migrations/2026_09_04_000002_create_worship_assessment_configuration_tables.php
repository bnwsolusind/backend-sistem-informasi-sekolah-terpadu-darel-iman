<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('education_program_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('education_unit_id');
            $table->uuid('class_id')->nullable();
            $table->string('program_type', 30)->comment('regular, fullday, boarding, tahfizh');
            $table->jsonb('school_weekdays')->nullable();
            $table->boolean('is_active')->default(true);
            $table->date('effective_from')->nullable();
            $table->date('effective_until')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->uuid('created_by');
            $table->uuid('updated_by')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();
            $table->foreign('education_unit_id')->references('id')->on('education_units')->cascadeOnDelete();
            $table->foreign('class_id')->references('id')->on('tbl_kelas')->cascadeOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['education_unit_id', 'class_id', 'is_active'], 'education_program_scope_idx');
        });

        Schema::create('mutabaah_assessment_periods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150);
            $table->string('period_type', 20)->default('regular')->comment('regular, ramadan');
            $table->string('scope', 20)->default('unit')->comment('global, unit, class');
            $table->uuid('education_unit_id')->nullable();
            $table->uuid('class_id')->nullable();
            $table->uuid('academic_year_id');
            $table->uuid('semester_id')->nullable();
            $table->uuid('template_id')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedInteger('priority')->default(0);
            $table->boolean('is_active')->default(true);
            $table->jsonb('configuration')->nullable();
            $table->uuid('created_by');
            $table->uuid('updated_by')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();
            $table->foreign('education_unit_id')->references('id')->on('education_units')->nullOnDelete();
            $table->foreign('class_id')->references('id')->on('tbl_kelas')->nullOnDelete();
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->restrictOnDelete();
            $table->foreign('semester_id')->references('id')->on('semesters')->nullOnDelete();
            $table->foreign('template_id')->references('id')->on('mutabaah_templates')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['period_type', 'start_date', 'end_date', 'is_active'], 'mutabaah_period_active_idx');
            $table->index(['scope', 'education_unit_id', 'class_id'], 'mutabaah_period_scope_idx');
        });

        Schema::create('mutabaah_input_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('assessment_period_id')->nullable();
            $table->uuid('agenda_item_id');
            $table->string('program_type', 30)->default('regular');
            $table->string('input_source', 20)->comment('school, parent, either, student, supervisor');
            $table->string('location', 20)->default('any')->comment('school, home, any');
            $table->jsonb('weekdays')->nullable();
            $table->boolean('school_day_only')->default(false);
            $table->boolean('requires_verification')->default(false);
            $table->unsignedInteger('priority')->default(0);
            $table->boolean('is_active')->default(true);
            $table->jsonb('metadata')->nullable();
            $table->uuid('created_by');
            $table->uuid('updated_by')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();
            $table->foreign('assessment_period_id')->references('id')->on('mutabaah_assessment_periods')->cascadeOnDelete();
            $table->foreign('agenda_item_id')->references('id')->on('mutabaah_agenda_items')->cascadeOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['program_type', 'agenda_item_id', 'is_active'], 'mutabaah_rule_resolve_idx');
        });

        Schema::table('mutabaah_daily_details', function (Blueprint $table) {
            $table->string('input_source', 20)->nullable()->after('notes');
            $table->string('input_location', 20)->nullable()->after('input_source');
            $table->string('verification_status', 30)->default('not_required')->after('input_location');
            $table->uuid('verified_by')->nullable()->after('verification_status');
            $table->timestampTz('verified_at')->nullable()->after('verified_by');
            $table->foreign('verified_by')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('tahfizh_ayah_achievements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('student_id');
            $table->uuid('academic_year_id')->nullable();
            $table->uuid('semester_id')->nullable();
            $table->uuid('class_id')->nullable();
            $table->uuid('source_log_id');
            $table->unsignedSmallInteger('surah_number');
            $table->unsignedSmallInteger('ayah_number');
            $table->unsignedTinyInteger('juz_number')->nullable();
            $table->string('status', 20)->default('validated');
            $table->uuid('validated_by')->nullable();
            $table->timestampTz('validated_at')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestampsTz();
            $table->foreign('student_id')->references('id')->on('students')->cascadeOnDelete();
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->nullOnDelete();
            $table->foreign('semester_id')->references('id')->on('semesters')->nullOnDelete();
            $table->foreign('class_id')->references('id')->on('tbl_kelas')->nullOnDelete();
            $table->foreign('source_log_id')->references('id')->on('tahfizh_daily_logs')->cascadeOnDelete();
            $table->foreign('validated_by')->references('id')->on('users')->nullOnDelete();
            $table->unique(['student_id', 'surah_number', 'ayah_number'], 'tahfizh_unique_ayah_achievement');
            $table->index(['student_id', 'status', 'juz_number'], 'tahfizh_achievement_summary_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tahfizh_ayah_achievements');
        Schema::table('mutabaah_daily_details', function (Blueprint $table) {
            $table->dropForeign(['verified_by']);
            $table->dropColumn(['input_source', 'input_location', 'verification_status', 'verified_by', 'verified_at']);
        });
        Schema::dropIfExists('mutabaah_input_rules');
        Schema::dropIfExists('mutabaah_assessment_periods');
        Schema::dropIfExists('education_program_settings');
    }
};
