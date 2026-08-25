<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Services\PinService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAuthController extends Controller
{
    public function showLogin()
    {
        // Traemos los alumnos para la pantalla de selección visual
        $students = Student::select('id', 'name', 'avatar_settings')->get();

        return Inertia::render('Student/Login', [
            'students' => $students,
        ]);
    }

    public function login(Request $request, PinService $pinService)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'pin' => 'required|string|size:4',
        ]);

        $student = Student::findOrFail($request->student_id);

        // Verificamos el PIN con Rate Limiting a través de PinService
        $result = $pinService->attemptPin(
            (string) $student->id,
            $request->pin,
            $student->pin_hash ?? $pinService->hashPin($student->pin)
        );

        if (!$result['success']) {
            if ($result['blocked'] ?? false) {
                return back()->withErrors([
                    'pin' => 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde.',
                ]);
            }

            return back()->withErrors([
                'pin' => "PIN incorrecto. Te quedan {$result['remaining']} intentos.",
            ]);
        }

        // Guardamos la sesión del alumno
        session(['student_id' => $student->id]);

        return redirect()->route('student.adventure');
    }

    public function logout(Request $request)
    {
        $request->session()->forget('student_id');
        return redirect()->route('student.login');
    }
}