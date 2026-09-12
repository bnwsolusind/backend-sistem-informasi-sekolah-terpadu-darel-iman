<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $isPgsql = DB::getDriverName() === 'pgsql';

        if ($isPgsql) {
            DB::statement('ALTER TABLE lms_capaian_pembelajaran ALTER COLUMN fase TYPE VARCHAR(50);');
            DB::statement('ALTER TABLE lms_capaian_pembelajaran ALTER COLUMN kode_cp TYPE VARCHAR(50);');
            DB::statement('ALTER TABLE lms_tujuan_pembelajaran ALTER COLUMN kode_tp TYPE VARCHAR(50);');
        } else {
            Schema::table('lms_capaian_pembelajaran', function (Blueprint $table) {
                $table->string('fase', 50)->nullable()->change();
                $table->string('kode_cp', 50)->change();
            });
            Schema::table('lms_tujuan_pembelajaran', function (Blueprint $table) {
                $table->string('kode_tp', 50)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $isPgsql = DB::getDriverName() === 'pgsql';

        if ($isPgsql) {
            DB::statement('ALTER TABLE lms_capaian_pembelajaran ALTER COLUMN fase TYPE VARCHAR(10);');
            DB::statement('ALTER TABLE lms_capaian_pembelajaran ALTER COLUMN kode_cp TYPE VARCHAR(30);');
            DB::statement('ALTER TABLE lms_tujuan_pembelajaran ALTER COLUMN kode_tp TYPE VARCHAR(30);');
        } else {
            Schema::table('lms_capaian_pembelajaran', function (Blueprint $table) {
                $table->string('fase', 10)->nullable()->change();
                $table->string('kode_cp', 30)->change();
            });
            Schema::table('lms_tujuan_pembelajaran', function (Blueprint $table) {
                $table->string('kode_tp', 30)->change();
            });
        }
    }
};
