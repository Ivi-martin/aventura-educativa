<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAttempt extends Model
{
    use HasFactory;

    /** Solo hay created_at (registro de solo-inserción), no updated_at. */
    const UPDATED_AT = null;

    protected $fillable = [
        'student_id', 'question_id', 'correct', 'response_time_ms', 'xp_earned',
    ];

    protected $casts = [
        'correct' => 'boolean',
        'response_time_ms' => 'integer',
        'xp_earned' => 'integer',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
