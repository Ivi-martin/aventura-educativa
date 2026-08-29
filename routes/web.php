<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\Student\ActivityController;
use App\Http\Controllers\Student\MapController;
use App\Http\Controllers\Student\TopicController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [StudentController::class, 'index'])->name('dashboard');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de autenticación de alumno
Route::get('/student/login', [StudentAuthController::class, 'showLogin'])->name('student.login');
Route::post('/student/login', [StudentAuthController::class, 'login'])->name('student.login.post');
Route::post('/student/logout', [StudentAuthController::class, 'logout'])->name('student.logout');

// Rutas protegidas del juego
Route::middleware([\App\Http\Middleware\EnsureStudentIsAuthenticated::class])->prefix('student')->name('student.')->group(function () {
    Route::get('/adventure', [MapController::class, 'index'])->name('adventure');
    Route::get('/subject/{subject}', [TopicController::class, 'index'])->name('topics');

    Route::get('/activity/{activity}', [ActivityController::class, 'show'])->name('activity.show');
    Route::post('/activity/{activity}/attempt', [ActivityController::class, 'storeAttempt'])->name('activity.attempt');
    Route::post('/activity/{activity}/complete', [ActivityController::class, 'complete'])->name('activity.complete');
});

require __DIR__.'/auth.php';
