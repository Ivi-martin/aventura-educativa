<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'question_id', 'is_correct', 'time_spent_seconds', 'answer_data',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'time_spent_seconds' => 'integer',
        'answer_data' => 'array',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
