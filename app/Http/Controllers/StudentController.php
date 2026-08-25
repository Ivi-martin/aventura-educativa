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
        // Obtenemos los estudiantes con su PIN en texto plano para que el panel pueda mostrarlos
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

        // Generamos un PIN de 4 dígitos en texto plano
        $pin = $pinService->generatePin();

        // Guardamos el PIN en texto plano (columna 'pin') y opcionalmente su hash si el sistema lo requiere
        $request->user()->students()->create([
            'name' => $validated['name'],
            'pin' => $pin,                     // Guardado plano para que el profesor lo consulte siempre
            'pin_hash' => $pinService->hashPin($pin), // Mantenemos el hash por si el login de alumnos lo valida
        ]);

        return redirect()->back()
            ->with('success', 'Estudiante creado correctamente.');
    }
}