<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\Role;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Student; 
use App\Models\Classroom;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => Role::class,
        ];
    }

    // Relaciones (los modelos Student y Classroom los crearemos pronto)
    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'family_user_id');
    }

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class, 'teacher_id');
    }

    // Helpers de roles
    public function isFamily(): bool { return $this->role === Role::FAMILY; }
    public function isTeacher(): bool { return $this->role === Role::TEACHER; }
    public function isContentEditor(): bool { return $this->role === Role::CONTENT_EDITOR; }
    public function isAdmin(): bool { return $this->role === Role::ADMIN; }
    public function hasRole(Role $role): bool { return $this->role === $role; }
}