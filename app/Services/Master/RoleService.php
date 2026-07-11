<?php

namespace App\Services\Master;

use App\Models\Master\Role;

class RoleService
{
    public function getRoleAktif()
    {
        $data = Role::where('status', 1)->get();

        return $data;
    }

    public function createRole(array $data): Role
    {
        $data = Role::create([
            'role' => strtoupper($data['role']),
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateRole(int $id, array $data): ?Role
    {
        $role = Role::find($id);

        if (!$role) {
            return null;
        }

        $role->update([
            'role' => strtoupper($data['role']),
        ]);

        return $role;
    }

    public function deleteRole(int $id): bool
    {
        $role = Role::find($id);

        if (!$role) {
            return false;
        }

        $role->status = 0;
        return $role->save();
    }
}
