<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("tahfizh_daily_logs", function (Blueprint $table) {
            // Drop composite unique constraint agar sesi Ziyadah di sekolah
            // dan sesi Murajaah di rumah pada tanggal yang sama tidak bentrok (duplicate key).
            $table->dropUnique(["student_id", "record_date"]);
            $table->index(["student_id", "record_date"]);

            // Kolom pendukung tugas Murajaah / Pengulangan di Rumah dari Guru ke Orang Tua
            $table->boolean("murajaah_required")->default(false);
            $table->integer("murajaah_required_surah_number")->nullable();
            $table->string("murajaah_required_surah_name", 150)->nullable();
            $table->integer("murajaah_required_ayah_start")->nullable();
            $table->integer("murajaah_required_ayah_end")->nullable();
            $table->string("murajaah_status", 40)->default("none"); // "none", "pending_home", "submitted_by_parent", "approved", "rejected"
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("tahfizh_daily_logs", function (Blueprint $table) {
            $table->dropColumn([
                "murajaah_required",
                "murajaah_required_surah_number",
                "murajaah_required_surah_name",
                "murajaah_required_ayah_start",
                "murajaah_required_ayah_end",
                "murajaah_status",
            ]);
            $table->unique(["student_id", "record_date"]);
        });
    }
};
