<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('dormitory_permits')) {
            Schema::create('dormitory_permits', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('student_id');
                $table->uuid('unit_pendidikan_id')->nullable();
                $table->string('permit_number', 50)->unique();
                $table->enum('permit_type', ['pesiar_mingguan', 'kunjungan_ortu', 'pulang_berkala', 'izin_khusus'])->default('pesiar_mingguan');
                $table->string('destination')->default('Rumah Orang Tua');
                $table->dateTime('scheduled_departure_at');
                $table->dateTime('actual_departure_at')->nullable();
                $table->dateTime('scheduled_return_at');
                $table->dateTime('actual_return_at')->nullable();
                $table->string('guardian_name')->nullable();
                $table->string('guardian_phone', 30)->nullable();
                $table->string('guardian_relation', 50)->default('Orang Tua');
                $table->enum('status', ['diajukan', 'disetujui', 'keluar', 'kembali', 'ditolak', 'batal'])->default('disetujui');
                $table->enum('return_status', ['belum_kembali', 'tepat_waktu', 'terlambat'])->default('belum_kembali');
                $table->integer('late_minutes')->default(0);
                $table->text('notes')->nullable();
                $table->uuid('approved_by_musyrif_id')->nullable();
                $table->uuid('checked_out_by')->nullable();
                $table->uuid('checked_in_by')->nullable();
                $table->timestamps();

                $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
                $table->index(['student_id', 'status']);
                $table->index(['unit_pendidikan_id', 'scheduled_departure_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('dormitory_permits');
    }
};
