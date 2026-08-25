<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Editoriales[cite: 3]
        Schema::create('publishers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo')->nullable();
            $table->timestamps();
        });

        // 2. Asignaturas[cite: 3]
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->integer('course');
            $table->timestamps();
        });

        // 3. Libros[cite: 3]
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publisher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('course');
            $table->timestamps();
        });

        // 4. Temas[cite: 3]
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->integer('number');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('xp_reward');
            $table->string('world', 50);
            $table->integer('unlock_level')->default(1);
            $table->timestamps();
        });

        // 5. Actividades[cite: 3]
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['multiple_choice', 'true_false', 'matching', 'fill_blank', 'dictation']);
            $table->tinyInteger('difficulty');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 6. Preguntas[cite: 3]
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained()->cascadeOnDelete();
            $table->text('text');
            $table->enum('type', ['multiple_choice', 'true_false', 'matching', 'fill_blank', 'dictation']);
            $table->json('data_json')->nullable();
            $table->integer('xp_value');
            $table->text('explanation')->nullable();
            $table->timestamps();
        });

        // 7. Opciones de respuesta[cite: 3]
        Schema::create('options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->string('text');
            $table->boolean('is_correct');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Se borran en orden inverso para no violar las claves foráneas
        Schema::dropIfExists('options');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('books');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('publishers');
    }
};