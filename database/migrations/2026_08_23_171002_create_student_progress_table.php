<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');

            // Referencia genérica al contenido educativo (unidad, lección, actividad...).
            // Se deja sin FK estricta porque el módulo de contenidos aún se está definiendo.
            $table->unsignedBigInteger('content_id')->nullable();
            $table->string('content_type', 50)->nullable(); // p.ej. 'lesson', 'unit', 'activity'

            $table->string('status', 20)->default('in_progress'); // in_progress | completed
            $table->unsignedTinyInteger('score')->nullable(); // 0-100
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index('student_id');
            $table->index(['content_type', 'content_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_progress');
    }
};
