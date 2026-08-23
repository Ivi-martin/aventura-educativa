<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('course', 20)->nullable();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('school_id')->nullable()->constrained('schools')->onDelete('set null');
            $table->timestamps();

            $table->index('teacher_id');
            $table->index('school_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
