<?php
namespace Database\Seeders;

use App\Models\User;
use App\Enums\Role;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create(['name' => 'Admin', 'email' => 'admin@aventura.com', 'role' => Role::ADMIN]);
        User::factory()->create(['name' => 'Editor', 'email' => 'editor@aventura.com', 'role' => Role::CONTENT_EDITOR]);
        User::factory()->family()->create(['name' => 'Familia Pérez', 'email' => 'familia@example.com']);
        User::factory()->teacher()->create(['name' => 'Profesor Martínez', 'email' => 'profesor@example.com']);
        
        User::factory(5)->family()->create();
        User::factory(2)->teacher()->create();
    }
}