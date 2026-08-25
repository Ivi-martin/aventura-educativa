<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'avatar_settings', 'pin', 'pin_hash', 'course', 
        'family_user_id', 'school_id', 'classroom_id', 
        'xp_total', 'level', 'streak_days', 'last_activity_at',
    ];

    protected $casts = [
        'avatar_settings' => 'array',
        'last_activity_at' => 'datetime',
        'xp_total' => 'integer',
        'level' => 'integer',
        'streak_days' => 'integer',
    ];

    public function family(): BelongsTo { return $this->belongsTo(User::class, 'family_user_id'); }
    public function school(): BelongsTo { return $this->belongsTo(School::class); }
    public function classroom(): BelongsTo { return $this->belongsTo(Classroom::class); }
    
    // Dejamos preparadas las relaciones que crearemos en futuras fases
    public function progress(): HasMany { return $this->hasMany(StudentProgress::class); }
    public function attempts(): HasMany { return $this->hasMany(StudentAttempt::class); }
    public function avatarItems(): HasMany { return $this->hasMany(StudentAvatarItem::class); }
    public function achievements(): HasMany { return $this->hasMany(StudentAchievement::class); }

    public function belongsToClassroom(?int $classroomId): bool
    {
        if (!$classroomId) return false;
        return $this->classroom_id === $classroomId;
    }

    public function updateStreak(): void
    {
        $today = now()->startOfDay();
        $lastActivity = $this->last_activity_at?->startOfDay();

        if (!$lastActivity) {
            $this->streak_days = 1;
        } elseif ($lastActivity->diffInDays($today) === 1) {
            $this->streak_days += 1;
        } elseif ($lastActivity->diffInDays($today) > 1) {
            $this->streak_days = 1;
        }

        $this->last_activity_at = now();
        $this->save();
    }

    public function getLevelName(): string
    {
        $levels = [1 => 'Aprendiz', 2 => 'Explorador', 3 => 'Aventurero', 4 => 'Sabio', 5 => 'Maestro', 6 => 'Leyenda'];
        return $levels[min($this->level, 6)] ?? 'Aprendiz';
    }

    public function getAvatarUrl(): string
    {
        return '/images/default-avatar.png'; // Placeholder para la Fase 0
    }
}