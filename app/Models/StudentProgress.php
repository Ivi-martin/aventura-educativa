<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProgress extends Model
{
    use HasFactory;

    protected $table = 'student_progress';

    protected $fillable = [
        'student_id', 'topic_id', 'completed', 'accuracy', 'stars', 'attempts', 'time_spent', 'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'accuracy' => 'decimal:2',
        'stars' => 'integer',
        'attempts' => 'integer',
        'time_spent' => 'integer',
        'completed_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }
}
