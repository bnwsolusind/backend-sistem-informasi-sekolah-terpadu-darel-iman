<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('realtime_events')) {
            Schema::create('realtime_events', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('channel')->index();
                $table->string('event')->index();
                $table->jsonb('payload');
                $table->uuid('sender_id')->nullable()->index();
                $table->boolean('delivered')->default(false);
                $table->timestamp('created_at')->useCurrent()->index();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('realtime_events');
    }
};
