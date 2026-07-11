<?php

namespace Database\Seeders;

use App\Models\Master\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                'id' => 1,
                'role_id' => 1, // SUPER ADMIN
                'menu' => 'dashboard',
                'read' => 1,
                'create' => 1,
                'update' => 1,
                'delete' => 1,
            ],
            [
                'id' => 2,
                'role_id' => 1, // SUPER ADMIN
                'menu' => 'jabatan',
                'read' => 1,
                'create' => 1,
                'update' => 1,
                'delete' => 1,
            ],
            [
                'id' => 3,
                'role_id' => 1, // SUPER ADMIN
                'menu' => 'pegawai',
                'read' => 1,
                'create' => 1,
                'update' => 1,
                'delete' => 1,
            ],
            [
                'id' => 4,
                'role_id' => 1, // SUPER ADMIN
                'menu' => 'role',
                'read' => 1,
                'create' => 1,
                'update' => 1,
                'delete' => 1,
            ],
            [
                'id' => 5,
                'role_id' => 1, // SUPER ADMIN
                'menu' => 'users',
                'read' => 1,
                'create' => 1,
                'update' => 1,
                'delete' => 1,
            ],
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(
                ['id' => $perm['id']], // Kunci pengecekan berdasarkan ID unik
                [
                    'role_id' => $perm['role_id'],
                    'menu'    => $perm['menu'],
                    'read'    => $perm['read'],
                    'create'  => $perm['create'],
                    'update'  => $perm['update'],
                    'delete'  => $perm['delete'],
                ]
            );
        }
    }
}
