<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentProgress;
use App\Models\Subject;
use Inertia\Inertia;
use Inertia\Response;

class TopicController extends Controller
{
    private function currentStudent(): Student
    {
        return Student::findOrFail(session('student_id'));
    }

    /**
     * Lista los temas de una asignatura. Cada tema apunta ya a su primera
     * actividad (`firstActivityId`) para poder ir directos a jugar — todavía
     * no existe una pantalla intermedia de "actividades dentro del tema"
     * porque, de momento, cada tema solo tiene una. Cuando un tema tenga
     * varias actividades, aquí habrá que añadir esa vista intermedia.
     */
    public function index(Subject $subject): Response
    {
        $student = $this->currentStudent();

        $topics = $subject->books()
            ->with(['topics' => fn ($q) => $q->orderBy('number')->with([
                'activities' => fn ($q) => $q->orderBy('order'),
            ])])
            ->get()
            ->pluck('topics')
            ->flatten();

        $progressByTopic = StudentProgress::where('student_id', $student->id)
            ->whereIn('topic_id', $topics->pluck('id'))
            ->get()
            ->keyBy('topic_id');

        return Inertia::render('Student/TopicView', [
            'subject' => [
                'id' => $subject->id,
                'name' => $subject->name,
                'color' => $subject->color,
            ],
            'topics' => $topics->values()->map(function ($topic) use ($progressByTopic) {
                $progress = $progressByTopic->get($topic->id);

                return [
                    'id' => $topic->id,
                    'number' => $topic->number,
                    'title' => $topic->title,
                    'description' => $topic->description,
                    'firstActivityId' => optional($topic->activities->first())->id,
                    'stars' => $progress->stars ?? 0,
                    'completed' => (bool) ($progress->completed ?? false),
                ];
            }),
        ]);
    }
}
