<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');

            $table->unsignedBigInteger('question_id')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->unsignedInteger('time_spent_seconds')->nullable();
            $table->json('answer_data')->nullable();

            $table->timestamps();

            $table->index('student_id');
            $table->index('question_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_attempts');
    }
};
