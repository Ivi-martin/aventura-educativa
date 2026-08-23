<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');

            $table->string('achievement_key', 100); // p.ej. 'streak_7_days', 'first_lesson'
            $table->timestamp('earned_at')->useCurrent();

            $table->timestamps();

            $table->unique(['student_id', 'achievement_key']);
            $table->index('student_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_achievements');
    }
};
