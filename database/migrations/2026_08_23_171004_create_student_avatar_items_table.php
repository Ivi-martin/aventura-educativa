<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_avatar_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');

            $table->string('item_key', 100); // p.ej. 'hat_wizard', 'skin_forest'
            $table->string('category', 50)->nullable(); // p.ej. 'hat', 'skin', 'accessory'
            $table->boolean('equipped')->default(false);
            $table->timestamp('unlocked_at')->nullable();

            $table->timestamps();

            $table->unique(['student_id', 'item_key']);
            $table->index('student_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_avatar_items');
    }
};
