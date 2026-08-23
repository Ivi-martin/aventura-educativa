<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Services\PinService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        // Obtenemos únicamente los estudiantes creados por el profesor autenticado
        $students = $request->user()->students()->latest()->get();

        return Inertia::render('Dashboard', [
            'students' => $students
        ]);
    }

    public function store(Request $request, PinService $pinService)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Generamos un PIN de 4 dígitos y guardamos únicamente su hash
        $pin = $pinService->generatePin();

        $request->user()->students()->create([
            'name' => $validated['name'],
            'pin_hash' => $pinService->hashPin($pin),
        ]);

        // Devolvemos el PIN en texto plano solo en esta respuesta (no se guarda así en BD),
        // para que el profesor/familia pueda anotarlo y dárselo al estudiante.
        return redirect()->back()
            ->with('success', 'Estudiante creado correctamente.')
            ->with('pin', $pin);
    }
}