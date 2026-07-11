<?php

namespace App\Services\Master;

use App\Models\Master\Permission;
use Illuminate\Support\Facades\DB;
// use App\Models\Master\Role;

class PermissionService
{
    public function getPermission(int $id)
    {
        $data = Permission::where('role_id', $id)->get();

        return $data;
    }

    /**
     * Update permissions secara massal (Batch/Bulk)
     */
    public function updateBulkPermissions(int $roleId, array $permissions)
    {
        // Bungkus dengan transaksi database agar aman jika di tengah jalan ada data corrupt
        DB::beginTransaction();

        try {
            foreach ($permissions as $perm) {
                Permission::updateOrCreate(
                    [
                        'role_id' => $roleId,
                        'menu'    => $perm['menu']
                    ],
                    [
                        'read'   => $perm['read'] ?? 0,
                        'create' => $perm['create'] ?? 0,
                        'update' => $perm['update'] ?? 0,
                        'delete' => $perm['delete'] ?? 0,
                    ]
                );
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception("Gagal memperbarui hak akses: " . $e->getMessage());
        }
    }
}
