<?php

namespace App\Models;

use App\Traits\HasUuidPrimaryKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory, HasUuidPrimaryKey;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'is_read',
        'read_at',
        'metadata',
        'academic_year_id',
        'semester_id',
        'month',
        'notifiable_id',
        'notifiable_type',
        'body',
        'channel',
    ];


    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Accessors for Schema Compatibility
    public function getMessageAttribute(): ?string
    {
        return $this->attributes['message'] ?? $this->attributes['body'] ?? null;
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where(function ($q) {
            $q->where('is_read', false)->orWhereNull('read_at');
        });
    }

    public function scopeByUser($query, string $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhere('notifiable_id', $userId);
        });
    }
}

