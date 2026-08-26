<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `student_progress` y `student_attempts` se crearon en la Fase 0 con campos
 * genéricos (`content_id`/`content_type`, `question_id` suelto) porque el CMS
 * (topics/questions) todavía no existía. Ahora que sí existe, se reconstruyen
 * para que coincidan exactamente con la sección 5 del documento maestro.
 *
 * Se recrean desde cero en vez de alterar columnas porque aún no hay datos
 * reales de producción en estas tablas (estamos en Fase 1-2 de desarrollo).
 * Si esto llegara a ejecutarse ya con datos reales, habría que escribir una
 * migración de traspaso de datos en su lugar.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('student_attempts');
        Schema::dropIfExists('student_progress');

        Schema::create('student_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();

            $table->boolean('completed')->default(false);
            $table->decimal('accuracy', 5, 2)->nullable(); // % de aciertos, 0-100
            $table->unsignedTinyInteger('stars')->nullable(); // 1-3
            $table->unsignedInteger('attempts')->default(0);
            $table->unsignedInteger('time_spent')->default(0); // segundos
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->unique(['student_id', 'topic_id']);
        });

        Schema::create('student_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();

            $table->boolean('correct')->default(false);
            $table->unsignedInteger('response_time_ms')->nullable();
            $table->unsignedInteger('xp_earned')->default(0);

            $table->timestamp('created_at')->useCurrent();

            $table->index('student_id');
            $table->index('question_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_attempts');
        Schema::dropIfExists('student_progress');
    }
};
