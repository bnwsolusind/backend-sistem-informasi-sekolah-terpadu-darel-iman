<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lms_penugasan', function (Blueprint $table) {
            if (! Schema::hasColumn('lms_penugasan', 'materi_id')) {
                $table->uuid('materi_id')->nullable()->after('modul_ajar_id')->comment('Tautan materi pembelajaran referensi');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lms_penugasan', function (Blueprint $table) {
            if (Schema::hasColumn('lms_penugasan', 'materi_id')) {
                $table->dropColumn('materi_id');
            }
        });
    }
};
