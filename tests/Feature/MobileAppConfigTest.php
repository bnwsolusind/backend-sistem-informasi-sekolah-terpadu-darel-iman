<?php

namespace Tests\Feature;

use App\Models\MobileAppConfig;
use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class MobileAppConfigTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $unauthorizedUser;

    protected function setUp(): void
    {
        parent::setUp();

        \Spatie\Permission\Models\Permission::findOrCreate('sistem.pengaturan', 'web');
        $role = \Spatie\Permission\Models\Role::findOrCreate('Super Admin', 'web');
        $role->givePermissionTo('sistem.pengaturan');

        $this->admin = User::factory()->create();
        $this->admin->assignRole('Super Admin');

        $this->unauthorizedUser = User::factory()->create();
    }

    public function test_android_can_read_published_visual_configuration_without_login(): void
    {
        $this->getJson('/api/mobile/config')
            ->assertOk()
            ->assertHeader('ETag', '"android-config-1"')
            ->assertJsonPath('data.platform', 'android')
            ->assertJsonPath('data.theme.primary_color', '#0E5C44')
            ->assertJsonPath('data.theme.background_gradient_enabled', true)
            ->assertJsonPath('data.theme.background_gradient_direction', 'diagonal')
            ->assertJsonPath('data.navigation.style', 'bottom_tabs')
            ->assertJsonPath('data.role_home_layouts.teacher.sections.0.type', 'schedule')
            ->assertJsonPath('data.role_home_layouts.parent.sections.0.type', 'announcements')
            ->assertJsonCount(4, 'data.home_layout.sections')
            ->assertJsonPath('data.features.qr_login', true)
            ->assertJsonPath('data.system.min_app_version', '1.0.0');
    }

    public function test_android_admin_configuration_requires_login(): void
    {
        $this->getJson('/api/admin/mobile-config')->assertUnauthorized();
        $this->putJson('/api/admin/mobile-config', [])->assertUnauthorized();
    }

    public function test_authenticated_user_without_permission_is_forbidden(): void
    {
        $this->actingAs($this->unauthorizedUser)
            ->getJson('/api/admin/mobile-config')
            ->assertForbidden();

        $this->actingAs($this->unauthorizedUser)
            ->putJson('/api/admin/mobile-config', ['theme' => ['primary_color' => '#123456']])
            ->assertForbidden();
    }

    public function test_authorized_admin_can_update_all_five_sections_and_persists(): void
    {
        $payload = [
            'theme' => [
                'primary_color' => '#1A5F7A',
                'secondary_color' => '#228B22',
                'accent_color' => '#FFD700',
                'background_color' => '#FAFAFA',
                'background_gradient_enabled' => true,
                'background_gradient_start' => '#FFFFFF',
                'background_gradient_end' => '#F0F8FF',
                'background_gradient_direction' => 'vertical',
                'surface_color' => '#FFFFFF',
                'text_color' => '#111827',
                'muted_text_color' => '#4B5563',
                'font_family' => 'Poppins',
                'font_scale' => 'large',
                'button_radius' => 16,
                'card_radius' => 20,
                'welcome_text' => 'Selamat Datang di Portal Mobile Darel Iman',
                'login_banner_url' => 'https://example.com/banner.jpg',
            ],
            'branding' => [
                'app_name' => 'SIMSIT Darel Iman Mobile',
                'school_name' => 'Yayasan Dar el-Iman Islamic School',
                'splash_background_color' => '#0A3A40',
                'logo_url' => 'https://example.com/logo-primary.png',
                'logo_header_url' => 'https://example.com/logo-header.png',
                'logo_login_url' => 'https://example.com/logo-login.png',
                'logo_footer_url' => 'https://example.com/logo-footer.png',
            ],
            'navigation' => [
                'style' => 'bottom_tabs',
                'show_labels' => true,
                'items' => [
                    ['key' => 'home', 'label' => 'Beranda', 'icon' => 'home', 'enabled' => true, 'order' => 1],
                    ['key' => 'notifications', 'label' => 'Notif', 'icon' => 'bell', 'enabled' => true, 'order' => 2],
                    ['key' => 'qr', 'label' => 'Scan QR', 'icon' => 'qrcode', 'enabled' => true, 'order' => 3],
                    ['key' => 'profile', 'label' => 'Akun', 'icon' => 'user', 'enabled' => true, 'order' => 4],
                ],
            ],
            'home_layout' => [
                'template' => 'dashboard_default',
                'sections' => [
                    ['type' => 'quick_menu', 'enabled' => true, 'order' => 1],
                    ['type' => 'announcements', 'enabled' => true, 'order' => 2],
                ],
            ],
            'role_home_layouts' => [
                'super_admin' => [
                    'template' => 'dashboard_default',
                    'sections' => [
                        ['type' => 'metrics', 'enabled' => true, 'order' => 1],
                        ['type' => 'announcements', 'enabled' => true, 'order' => 2],
                    ],
                ],
                'foundation' => [
                    'template' => 'dashboard_default',
                    'sections' => [['type' => 'metrics', 'enabled' => true, 'order' => 1]],
                ],
                'principal' => [
                    'template' => 'dashboard_default',
                    'sections' => [['type' => 'schedule', 'enabled' => true, 'order' => 1]],
                ],
                'teacher' => [
                    'template' => 'dashboard_default',
                    'sections' => [['type' => 'schedule', 'enabled' => true, 'order' => 1]],
                ],
                'parent' => [
                    'template' => 'dashboard_default',
                    'sections' => [['type' => 'announcements', 'enabled' => true, 'order' => 1]],
                ],
                'student' => [
                    'template' => 'dashboard_default',
                    'sections' => [['type' => 'schedule', 'enabled' => true, 'order' => 1]],
                ],
                'staff' => [
                    'template' => 'dashboard_default',
                    'sections' => [['type' => 'quick_menu', 'enabled' => true, 'order' => 1]],
                ],
            ],
            'features' => [
                'qr_login' => false,
                'qr_attendance' => true,
                'chat' => true,
                'notifications' => true,
                'tahfizh' => true,
                'mutabaah' => false,
                'cbt' => true,
                'school_info' => true,
            ],
            'system' => [
                'min_app_version' => '1.2.0',
                'latest_app_version' => '1.5.0',
                'maintenance_mode' => true,
                'maintenance_message' => 'Sedang pemeliharaan server pusat.',
                'force_update' => true,
                'update_url' => 'https://play.google.com/store/apps/details?id=id.sch.dareliman.sims.mobile',
            ],
        ];

        // 1. PUT update
        $updateRes = $this->actingAs($this->admin)
            ->putJson('/api/admin/mobile-config', $payload)
            ->assertOk()
            ->assertJsonPath('data.version', 2)
            ->assertJsonPath('data.theme.primary_color', '#1A5F7A')
            ->assertJsonPath('data.features.qr_login', false)
            ->assertJsonPath('data.system.min_app_version', '1.2.0')
            ->assertJsonPath('data.system.maintenance_mode', true);

        // 2. Verify database direct state
        $dbConfig = MobileAppConfig::where('platform', 'android')->first();
        $this->assertEquals(2, $dbConfig->version);
        $this->assertEquals('#1A5F7A', $dbConfig->config['theme']['primary_color']);
        $this->assertFalse($dbConfig->config['features']['qr_login']);
        $this->assertTrue($dbConfig->config['system']['maintenance_mode']);

        // 3. Admin GET returns persisted values
        $this->actingAs($this->admin)
            ->getJson('/api/admin/mobile-config')
            ->assertOk()
            ->assertJsonPath('data.version', 2)
            ->assertJsonPath('data.theme.primary_color', '#1A5F7A')
            ->assertJsonPath('data.branding.logo_header_url', 'https://example.com/logo-header.png')
            ->assertJsonPath('data.features.qr_login', false)
            ->assertJsonPath('data.system.min_app_version', '1.2.0');

        // 4. Public GET returns persisted client-safe values
        $this->getJson('/api/mobile/config')
            ->assertOk()
            ->assertHeader('ETag', '"android-config-2"')
            ->assertJsonPath('data.theme.primary_color', '#1A5F7A')
            ->assertJsonPath('data.features.qr_login', false)
            ->assertJsonPath('data.system.min_app_version', '1.2.0')
            ->assertJsonMissing(['password', 'secret', 'updated_by', 'api_key']);
    }

    public function test_partial_update_preserves_unrelated_existing_configuration(): void
    {
        // Initial setup: ensure baseline exists
        MobileAppConfig::android();

        // Update ONLY system maintenance mode and message
        $partialPayload = [
            'system' => [
                'maintenance_mode' => true,
                'maintenance_message' => 'Pemeliharaan parsial.',
                'force_update' => false,
            ],
        ];

        $this->actingAs($this->admin)
            ->putJson('/api/admin/mobile-config', $partialPayload)
            ->assertOk()
            ->assertJsonPath('data.system.maintenance_mode', true)
            ->assertJsonPath('data.system.maintenance_message', 'Pemeliharaan parsial.')
            // Verify other sections were NOT wiped out:
            ->assertJsonPath('data.theme.primary_color', '#0E5C44')
            ->assertJsonPath('data.branding.app_name', 'Sistem Manajemen Sekolah Terpadu')
            ->assertJsonPath('data.features.qr_login', true);

        // Subsequent public fetch preserves all data
        $this->getJson('/api/mobile/config')
            ->assertOk()
            ->assertJsonPath('data.system.maintenance_mode', true)
            ->assertJsonPath('data.theme.primary_color', '#0E5C44');
    }

    public function test_validation_rejects_invalid_hex_color(): void
    {
        $this->actingAs($this->admin)
            ->putJson('/api/admin/mobile-config', [
                'theme' => [
                    'primary_color' => 'INVALID_COLOR',
                ],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['theme.primary_color']);
    }

    public function test_validation_rejects_invalid_urls(): void
    {
        $this->actingAs($this->admin)
            ->putJson('/api/admin/mobile-config', [
                'system' => [
                    'force_update' => true,
                    'update_url' => 'not-a-valid-url',
                ],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['system.update_url']);
    }

    public function test_validation_rejects_minimum_version_exceeding_latest_version(): void
    {
        $this->actingAs($this->admin)
            ->putJson('/api/admin/mobile-config', [
                'system' => [
                    'min_app_version' => '2.5.0',
                    'latest_app_version' => '2.0.0',
                ],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['system.min_app_version']);
    }

    public function test_validation_rejects_non_boolean_feature_flags(): void
    {
        $this->actingAs($this->admin)
            ->putJson('/api/admin/mobile-config', [
                'features' => [
                    'qr_login' => 'not-a-boolean',
                ],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['features.qr_login']);
    }

    public function test_android_logo_fallback_works_only_when_dedicated_logo_is_absent(): void
    {
        $siteSetting = SiteSetting::current();
        $siteSetting->update(['logo_path' => 'site/logo/default-site-logo.png']);

        // 1. Without dedicated logo: falls back to site logo
        $this->getJson('/api/mobile/config')
            ->assertOk()
            ->assertJsonPath(
                'data.branding.logo_url',
                url('/storage/site/logo/default-site-logo.png')
            )
            ->assertJsonPath(
                'data.branding.logo_header_url',
                url('/storage/site/logo/default-site-logo.png')
            );

        // 2. With dedicated logo configured: dedicated logo takes precedence
        $this->actingAs($this->admin)
            ->putJson('/api/admin/mobile-config', [
                'branding' => [
                    'logo_header_url' => 'https://example.com/dedicated-mobile-header.png',
                ],
            ])
            ->assertOk()
            ->assertJsonPath('data.branding.logo_header_url', 'https://example.com/dedicated-mobile-header.png');
    }

    public function test_unauthenticated_and_unauthorized_media_endpoints(): void
    {
        \Illuminate\Support\Facades\Storage::fake('public');
        $file = \Illuminate\Http\UploadedFile::fake()->image('logo.png', 200, 200);

        // 1. Unauthenticated
        $this->postJson('/api/admin/mobile-config/media', ['type' => 'logo_header', 'file' => $file])
            ->assertUnauthorized();
        $this->deleteJson('/api/admin/mobile-config/media/logo_header')
            ->assertUnauthorized();

        // 2. Authenticated but unauthorized
        $this->actingAs($this->unauthorizedUser)
            ->postJson('/api/admin/mobile-config/media', ['type' => 'logo_header', 'file' => $file])
            ->assertForbidden();
        $this->actingAs($this->unauthorizedUser)
            ->deleteJson('/api/admin/mobile-config/media/logo_header')
            ->assertForbidden();
    }

    public function test_authorized_admin_can_upload_and_replace_assets_persisting_in_database(): void
    {
        \Illuminate\Support\Facades\Storage::fake('public');

        // 1. Upload header logo
        $headerFile = \Illuminate\Http\UploadedFile::fake()->image('header.png', 400, 120);
        $res = $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', [
                'type' => 'logo_header',
                'file' => $headerFile,
            ])
            ->assertOk()
            ->assertJsonPath('data.version', 2);

        $headerUrl = $res->json('data.branding.logo_header_url');
        $this->assertStringContainsString('/storage/mobile-config/logo_header/', $headerUrl);

        // Verify DB state
        $db = MobileAppConfig::where('platform', 'android')->first();
        $this->assertEquals($headerUrl, $db->config['branding']['logo_header_url']);
        $firstPath = $db->config['media_paths']['logo_header'];
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($firstPath);

        // 2. Upload replacement: ensures old file is deleted safely
        $replacementFile = \Illuminate\Http\UploadedFile::fake()->image('header-v2.png', 400, 120);
        $res2 = $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', [
                'type' => 'logo_header',
                'file' => $replacementFile,
            ])
            ->assertOk()
            ->assertJsonPath('data.version', 3);

        $dbFresh = MobileAppConfig::where('platform', 'android')->first();
        $secondPath = $dbFresh->config['media_paths']['logo_header'];
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($secondPath);
        \Illuminate\Support\Facades\Storage::disk('public')->assertMissing($firstPath);

        // 3. Upload banner
        $bannerFile = \Illuminate\Http\UploadedFile::fake()->image('banner.jpg', 1200, 600);
        $resBanner = $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', [
                'type' => 'login_banner',
                'file' => $bannerFile,
            ])
            ->assertOk()
            ->assertJsonPath('data.version', 4);

        $bannerUrl = $resBanner->json('data.theme.login_banner_url');
        $this->assertStringContainsString('/storage/mobile-config/login_banner/', $bannerUrl);

        // 4. Upload login logo & footer logo
        $loginFile = \Illuminate\Http\UploadedFile::fake()->image('login-logo.png', 300, 100);
        $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', ['type' => 'logo_login', 'file' => $loginFile])
            ->assertOk()
            ->assertJsonPath('data.version', 5);

        $footerFile = \Illuminate\Http\UploadedFile::fake()->image('footer-logo.png', 300, 100);
        $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', ['type' => 'logo_footer', 'file' => $footerFile])
            ->assertOk()
            ->assertJsonPath('data.version', 6);

        // 5. Verify Public API exposes valid URLs without internal paths or credentials
        $publicRes = $this->getJson('/api/mobile/config')
            ->assertOk()
            ->assertJsonPath('data.version', 6)
            ->assertJsonPath('data.branding.logo_header_url', $res2->json('data.branding.logo_header_url'))
            ->assertJsonPath('data.theme.login_banner_url', $bannerUrl)
            ->assertJsonMissing(['media_paths']);

        $publicContent = $publicRes->getContent();
        $this->assertStringNotContainsString('/Applications/', $publicContent);
        $this->assertStringNotContainsString('password', $publicContent);
        $this->assertStringNotContainsString('.env', $publicContent);
    }

    public function test_media_validation_rejects_invalid_type_and_files(): void
    {
        \Illuminate\Support\Facades\Storage::fake('public');

        // Invalid type
        $file = \Illuminate\Http\UploadedFile::fake()->image('test.png');
        $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', ['type' => 'invalid_type', 'file' => $file])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['type']);

        // Non-image file
        $pdf = \Illuminate\Http\UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');
        $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', ['type' => 'logo_header', 'file' => $pdf])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);

        // Oversized logo (> 2048 KB)
        $oversized = \Illuminate\Http\UploadedFile::fake()->image('huge.png')->size(3000);
        $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', ['type' => 'logo_header', 'file' => $oversized])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

    public function test_media_delete_restores_fallback_and_deletes_file(): void
    {
        \Illuminate\Support\Facades\Storage::fake('public');
        $siteSetting = SiteSetting::current();
        $siteSetting->update(['logo_path' => 'site/logo/global-logo.png']);

        // Upload dedicated logo
        $file = \Illuminate\Http\UploadedFile::fake()->image('logo.png');
        $this->actingAs($this->admin)
            ->postJson('/api/admin/mobile-config/media', ['type' => 'logo_header', 'file' => $file])
            ->assertOk();

        $db = MobileAppConfig::where('platform', 'android')->first();
        $uploadedPath = $db->config['media_paths']['logo_header'];
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists($uploadedPath);

        // Delete dedicated logo
        $deleteRes = $this->actingAs($this->admin)
            ->deleteJson('/api/admin/mobile-config/media/logo_header')
            ->assertOk()
            ->assertJsonPath(
                'data.branding.logo_header_url',
                url('/storage/site/logo/global-logo.png')
            );

        // File is deleted
        \Illuminate\Support\Facades\Storage::disk('public')->assertMissing($uploadedPath);

        // SiteSetting logo was NEVER touched
        $this->assertEquals('site/logo/global-logo.png', $siteSetting->fresh()->logo_path);
    }
}
