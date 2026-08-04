<?php

use App\Models\User;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$u = User::where('email', 'superadmin@school-erp.local')->first();

if (! $u) {
    $u = User::create([
        'name' => 'Super Admin',
        'email' => 'superadmin@school-erp.local',
        'password' => 'Password123!',
        'is_active' => true,
    ]);
    $u->assignRole('Super Admin');
}

echo $u->createToken('uji-api')->plainTextToken.PHP_EOL;
