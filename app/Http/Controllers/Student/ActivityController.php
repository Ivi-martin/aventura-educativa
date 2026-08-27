<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Student;
use App\Models\StudentAttempt;
use App\Models\StudentProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    /**
     * El alumno autenticado no usa Auth::user() (ese es el sistema de
     * familia/profesor/admin) sino la sesión propia que deja
     * StudentAuthController::login() en `session('student_id')`.
     */
    private function currentStudent(): Student
    {
        return Student::findOrFail(session('student_id'));
    }

    public function show(Activity $activity): Response
    {
        $activity->load(['questions.options' => fn ($q) => $q->orderBy('order')]);

        return Inertia::render('Student/Activity/Show', [
            'activityId' => $activity->id,
            'activityType' => $activity->type,
            'questions' => $activity->questions->map(fn ($question) => [
                'id' => $question->id,
                'text' => $question->text,
                'type' => $question->type,
                'data_json' => $question->data_json,
                'xp_value' => $question->xp_value,
                'explanation' => $question->explanation,
                'options' => $question->options->map(fn ($option) => [
                    'id' => $option->id,
                    'text' => $option->text,
                    'is_correct' => $option->is_correct,
                    'order' => $option->order,
                ]),
            ]),
        ]);
    }

    /**
     * Persiste cada intento (acierto o fallo) tal y como lo envía
     * ActivityContext::handleAnswer vía onSaveAttempt. No devuelve props
     * nuevas: el frontend no necesita esperar nada de esta llamada.
     */
    public function storeAttempt(Request $request, Activity $activity): \Illuminate\Http\Response
    {
        $validated = $request->validate([
            'questionId' => 'required|integer|exists:questions,id',
            'correct' => 'required|boolean',
            'xpGained' => 'required|integer|min:0',
            'responseTimeMs' => 'nullable|integer|min:0',
        ]);

        StudentAttempt::create([
            'student_id' => $this->currentStudent()->id,
            'question_id' => $validated['questionId'],
            'correct' => $validated['correct'],
            'response_time_ms' => $validated['responseTimeMs'] ?? null,
            'xp_earned' => $validated['xpGained'],
        ]);

        return response()->noContent();
    }

    /**
     * Cierra la actividad: actualiza (o crea) el progreso del tema y suma el
     * XP ganado al total del alumno. Las gemas y el cálculo de nivel se
     * dejan pendientes para la Fase 3 (GamificationService), cuando exista
     * la columna de gemas y la lógica de subida de nivel — de momento solo
     * se devuelven en el flash para que RewardScreen pueda mostrarlas.
     *
     * Redirige de vuelta al mapa de aventura porque RewardScreen.tsx
     * todavía no existe; en cuanto se construya, este redirect cambia.
     */
    public function complete(Request $request, Activity $activity): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'stars' => 'required|integer|min:1|max:3',
            'xpEarned' => 'required|integer|min:0',
            'gemsEarned' => 'required|integer|min:0',
            'accuracy' => 'required|numeric|min:0|max:100',
            'attempts' => 'required|integer|min:0',
            'combo' => 'required|integer|min:0',
        ]);

        $student = $this->currentStudent();

        $progress = StudentProgress::firstOrNew([
            'student_id' => $student->id,
            'topic_id' => $activity->topic_id,
        ]);
        $progress->completed = true;
        $progress->accuracy = $validated['accuracy'];
        $progress->stars = max($validated['stars'], $progress->stars ?? 0);
        $progress->attempts = ($progress->attempts ?? 0) + $validated['attempts'];
        $progress->completed_at = now();
        $progress->save();

        $student->xp_total += $validated['xpEarned'];
        $student->updateStreak();

        return redirect()->route('student.adventure')
            ->with('success', '¡Actividad completada!')
            ->with('reward', $validated);
    }
}
