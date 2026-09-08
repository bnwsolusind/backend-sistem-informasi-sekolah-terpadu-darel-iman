<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPresence extends Model
{
    use HasFactory;

    protected $table = 'user_presences';

    protected $fillable = [
        'user_id',
        'status',
        'last_seen_at',
        'last_activity_at',
        'device',
    ];

    protected $casts = [
        'last_seen_at' => 'datetime',
        'last_activity_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function isOnline(): bool
    {
        return $this->status === 'online' &&
            $this->last_activity_at &&
            $this->last_activity_at->gt(now()->subMinutes(15));
    }
}
