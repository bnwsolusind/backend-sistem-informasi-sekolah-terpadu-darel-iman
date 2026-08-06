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

    /**
     * Kirim notifikasi ke satu pengguna memakai SKEMA KANONIK (partitioned).
     *
     * Tabel `notifications` di PostgreSQL bersifat partitioned: kolom
     * academic_year_id / semester_id / month adalah bagian dari primary key
     * dan foreign key, sehingga WAJIB terisi. Konteks akademik aktif
     * (tahun ajaran + semester berjalan) di-resolve di sini; bila belum ada
     * konteks akademik aktif, notifikasi dilewati dengan aman (null) karena
     * tidak mungkin memenuhi partition key pada mesin produksi.
     */
    public static function deliver(string $userId, string $title, string $body, string $channel, array $metadata = []): ?self
    {
        $activeAy = AcademicYear::query()->where('is_active', true)->first();
        $activeSem = $activeAy
            ? Semester::query()
                ->where('academic_year_id', $activeAy->id)
                ->where('is_active', true)
                ->orderBy('sequence', 'desc')
                ->first()
            : null;

        if (! $activeAy || ! $activeSem) {
            return null;
        }

        return static::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'academic_year_id' => $activeAy->id,
            'semester_id' => $activeSem->id,
            'month' => now()->month,
            'notifiable_id' => $userId,
            'notifiable_type' => User::class,
            'title' => $title,
            'body' => $body,
            'channel' => $channel,
            'metadata' => $metadata,
            'read_at' => null,
        ]);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeByUser($query, string $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('user_id', $userId)->orWhere('notifiable_id', $userId);
        });
    }
}

