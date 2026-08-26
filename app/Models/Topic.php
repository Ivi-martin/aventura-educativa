<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id', 'number', 'title', 'description', 'xp_reward', 'world', 'unlock_level',
    ];

    protected $casts = [
        'number' => 'integer',
        'xp_reward' => 'integer',
        'unlock_level' => 'integer',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function studentProgress(): HasMany
    {
        return $this->hasMany(StudentProgress::class);
    }
}
