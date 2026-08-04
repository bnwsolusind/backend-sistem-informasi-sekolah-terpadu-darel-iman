<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_fetch_and_mark_notifications(): void
    {
        $user = User::factory()->create();

        $notif = Notification::create([
            'academic_year_id' => '00000000-0000-0000-0000-000000000000',
            'semester_id' => '00000000-0000-0000-0000-000000000000',
            'month' => 7,
            'notifiable_id' => $user->id,
            'notifiable_type' => 'User',
            'title' => 'Ujian Dimulai',
            'body' => 'Jadwal ujian matematika telah dibuka',
            'channel' => 'web',
            'read_at' => null,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/notifications');

        $response->assertStatus(200);

        $unreadResponse = $this->actingAs($user)
            ->getJson('/api/notifications/unread-count');

        $unreadResponse->assertStatus(200)
            ->assertJsonPath('unread_count', 1);

        $readResponse = $this->actingAs($user)
            ->postJson("/api/notifications/{$notif->id}/read");

        $readResponse->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertNotNull($notif->fresh()->read_at);

    }
}
