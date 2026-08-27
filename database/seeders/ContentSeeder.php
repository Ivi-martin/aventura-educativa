<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Book;
use App\Models\Publisher;
use App\Models\Question;
use App\Models\Subject;
use App\Models\Topic;
use Illuminate\Database\Seeder;

/**
 * Contenido mínimo de ejemplo para poder probar ActivityRunner de principio
 * a fin (visitando /student/activity/{id} una vez logueado como alumno).
 * No pretende ser el seeder completo de la Fase 1 (1 colegio, 2 clases,
 * varias asignaturas y 10-15 preguntas por tema) — es a propósito pequeño,
 * solo para desarrollo del motor de juego.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $publisher = Publisher::firstOrCreate(['name' => 'Editorial Aventura']);

        $subject = Subject::firstOrCreate(
            ['name' => 'Matemáticas', 'course' => 3],
            ['icon' => '🔢', 'color' => '#3B82F6']
        );

        $book = Book::firstOrCreate([
            'publisher_id' => $publisher->id,
            'subject_id' => $subject->id,
            'name' => 'Matemáticas 3º Primaria',
            'course' => 3,
        ]);

        $topic = Topic::firstOrCreate(
            ['book_id' => $book->id, 'number' => 1],
            [
                'title' => 'Sumas y restas',
                'description' => 'Repaso de sumas y restas sin llevadas.',
                'xp_reward' => 50,
                'world' => 'numeros',
                'unlock_level' => 1,
            ]
        );

        $activity = Activity::firstOrCreate(
            ['topic_id' => $topic->id, 'order' => 1],
            ['type' => 'multiple_choice', 'difficulty' => 1]
        );

        if ($activity->questions()->count() > 0) {
            $this->command?->info('ContentSeeder: ya había preguntas, no se duplican.');

            return;
        }

        $questionsData = [
            ['text' => '¿Cuánto es 5 + 3?', 'correct' => '8', 'wrong' => ['7', '9', '6']],
            ['text' => '¿Cuánto es 12 - 4?', 'correct' => '8', 'wrong' => ['9', '7', '6']],
            ['text' => '¿Cuánto es 6 + 6?', 'correct' => '12', 'wrong' => ['11', '13', '10']],
            ['text' => '¿Cuánto es 20 - 9?', 'correct' => '11', 'wrong' => ['10', '12', '9']],
            ['text' => '¿Cuánto es 7 + 5?', 'correct' => '12', 'wrong' => ['11', '13', '14']],
        ];

        foreach ($questionsData as $data) {
            $question = Question::create([
                'activity_id' => $activity->id,
                'text' => $data['text'],
                'type' => 'multiple_choice',
                'xp_value' => 10,
                'explanation' => "La respuesta correcta es {$data['correct']}.",
            ]);

            $options = array_merge([$data['correct']], $data['wrong']);
            shuffle($options);

            foreach ($options as $i => $text) {
                $question->options()->create([
                    'text' => $text,
                    'is_correct' => $text === $data['correct'],
                    'order' => $i,
                ]);
            }
        }
    }
}
