<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use App\Services\PinService;
use Illuminate\Database\Seeder;

/**
 * Alumno de prueba para poder loguearse en /student/login y probar
 * ActivityRunner de verdad. PIN fijo y conocido: 1234.
 */
class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $family = User::where('email', 'familia@example.com')->first();

        if (!$family) {
            $this->command?->warn('StudentSeeder: no existe familia@example.com, ejecuta UserSeeder antes.');

            return;
        }

        if (Student::where('family_user_id', $family->id)->exists()) {
            return;
        }

        $pinService = app(PinService::class);

        Student::create([
            'name' => 'Lucía',
            'avatar_settings' => ['head' => null, 'body' => null, 'pet' => null, 'background' => null],
            'pin' => '1234',
            'pin_hash' => $pinService->hashPin('1234'),
            'course' => '3º Primaria',
            'family_user_id' => $family->id,
        ]);
    }
}
