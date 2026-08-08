<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $employee = \App\Models\Employee::where('user_id', $this->id)->first();
        $student = \App\Models\Student::where('user_id', $this->id)->first();
        $parent = \App\Models\ParentModel::where('user_id', $this->id)->first();
        $unitId = $employee?->unit_id ?? $student?->unit_id;

        $userData = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'photo_url' => $this->photo_url,
            'avatar_url' => $this->avatar_url,
            'is_active' => $this->is_active,
        ];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'photo_url' => $this->photo_url,
            'avatar_url' => $this->avatar_url,
            'is_active' => $this->is_active,
            'user' => $userData,
            'roles' => $this->getRoleNames(),
            'permissions' => $this->getAllPermissions()->pluck('name')->values(),
            'scope' => [
                'unit_id' => $unitId,
                'employee_id' => $employee?->id,
                'student_id' => $student?->id,
                'parent_id' => $parent?->id,
            ],
            'metadata' => $this->metadata,
        ];
    }
}
