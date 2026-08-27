<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            UserSeeder::class,   // admin, editor, familias y profesores de prueba
            StudentSeeder::class, // alumno "Lucía", PIN 1234, bajo familia@example.com
            ContentSeeder::class, // tema + actividad + 5 preguntas para probar ActivityRunner
        ]);
    }
}
