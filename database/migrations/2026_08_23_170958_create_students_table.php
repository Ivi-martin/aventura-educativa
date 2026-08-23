<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->json('avatar_settings')->nullable();
            $table->string('pin_hash', 255);
            $table->string('course', 20)->default('3º Primaria');
            
            // Relaciones con otras tablas
            $table->foreignId('family_user_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('school_id')->nullable();
            $table->unsignedBigInteger('classroom_id')->nullable();
            
            // Gamificación
            $table->integer('xp_total')->default(0);
            $table->integer('level')->default(1);
            $table->integer('streak_days')->default(0);
            $table->timestamp('last_activity_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices para optimizar las consultas de rendimiento
            $table->index('family_user_id');
            $table->index('school_id');
            $table->index('classroom_id');
            $table->index('course');
            $table->index('level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};