<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAvatarItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'item_key', 'category', 'equipped', 'unlocked_at',
    ];

    protected $casts = [
        'equipped' => 'boolean',
        'unlocked_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
