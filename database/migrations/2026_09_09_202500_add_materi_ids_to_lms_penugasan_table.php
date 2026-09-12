<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lms_penugasan', function (Blueprint $table) {
            if (! Schema::hasColumn('lms_penugasan', 'materi_ids')) {
                $table->json('materi_ids')->nullable()->after('materi_id')->comment('Daftar ID materi pembelajaran yang ditautkan (bisa lebih dari satu)');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lms_penugasan', function (Blueprint $table) {
            if (Schema::hasColumn('lms_penugasan', 'materi_ids')) {
                $table->dropColumn('materi_ids');
            }
        });
    }
};
