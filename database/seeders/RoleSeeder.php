<?php

namespace Database\Seeders;

use App\Models\Master\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'id' => 1,
                'role' => 'SUPER ADMIN',
                'status' => 2,
            ],
            [
                'id' => 2,
                'role' => 'ADMIN',
                'status' => 1,
            ],
            [
                'id' => 3,
                'role' => 'OWNER',
                'status' => 1,
            ],
            [
                'id' => 4,
                'role' => 'PEGAWAI',
                'status' => 1,
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['id' => $role['id']], // Kunci pengecekan berdasarkan ID
                [
                    'role' => $role['role'],
                    'status' => $role['status'],
                ]
            );
        }
    }
}
