<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon', 'color', 'course'];

    protected $casts = [
        'course' => 'integer',
    ];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }
}
