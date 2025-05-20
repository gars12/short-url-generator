<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('url_clicks');
    }

    public function down(): void
    {
        Schema::create('url_clicks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('url_id');
            $table->timestamp('clicked_at')->nullable();
            $table->timestamps();
        });
    }
};
