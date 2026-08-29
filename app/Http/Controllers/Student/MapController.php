<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Subject;
use Inertia\Inertia;
use Inertia\Response;

class MapController extends Controller
{
    private function currentStudent(): Student
    {
        return Student::findOrFail(session('student_id'));
    }

    /**
     * De momento se listan todas las asignaturas que tengan al menos un
     * libro, sin filtrar todavía por el curso del alumno: `Student.course`
     * es un texto libre ("3º Primaria") y `Subject.course`/`Book.course`
     * son enteros (3). Cuando haya varios cursos reales convendrá
     * normalizar uno de los dos formatos y cruzarlos aquí.
     */
    public function index(): Response
    {
        $student = $this->currentStudent();

        $subjects = Subject::has('books')->get();

        return Inertia::render('Student/AdventureMap', [
            'student' => [
                'name' => $student->name,
                'xpTotal' => $student->xp_total,
                'level' => $student->level,
            ],
            'subjects' => $subjects->map(fn ($subject) => [
                'id' => $subject->id,
                'name' => $subject->name,
                'icon' => $subject->icon,
                'color' => $subject->color,
            ]),
        ]);
    }
}
