<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Enums\Role;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => Role::FAMILY,
        ];
    }

    public function family(): static { return $this->state(fn (array $attributes) => ['role' => Role::FAMILY]); }
    public function teacher(): static { return $this->state(fn (array $attributes) => ['role' => Role::TEACHER]); }
    public function contentEditor(): static { return $this->state(fn (array $attributes) => ['role' => Role::CONTENT_EDITOR]); }
    public function admin(): static { return $this->state(fn (array $attributes) => ['role' => Role::ADMIN]); }
}