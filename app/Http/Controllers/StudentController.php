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

        // 1. Generamos un PIN aleatorio de 4 dígitos (ej: "4829")
    $plainPin = (string) rand(1000, 9999);

    // 2. Creamos el alumno pasando tanto 'pin' como 'pin_hash'
    $request->user()->students()->create([
        'name' => $request->name,
        'pin' => $plainPin,
        'pin_hash' => $pinService->hashPin($plainPin),
    ]);

        return redirect()->back()
            ->with('success', 'Estudiante creado correctamente.');
    }
}