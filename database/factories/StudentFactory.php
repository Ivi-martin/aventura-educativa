<?php
namespace Database\Factories;

use App\Models\User;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'name' => fake()->firstName(),
            'avatar_settings' => ['head' => null, 'body' => null, 'pet' => null, 'background' => null],
            'pin' => '1234',
            'pin_hash' => bcrypt('1234'),
            'course' => '3º Primaria',
            'family_user_id' => User::factory()->family(),
            'school_id' => null,
            'classroom_id' => null,
            'xp_total' => fake()->numberBetween(0, 500),
            'level' => fake()->numberBetween(1, 3),
            'streak_days' => fake()->numberBetween(0, 10),
            'last_activity_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    public function withClassroom($classroomId): static { return $this->state(fn (array $attributes) => ['classroom_id' => $classroomId]); }
    public function withSchool($schoolId): static { return $this->state(fn (array $attributes) => ['school_id' => $schoolId]); }
}