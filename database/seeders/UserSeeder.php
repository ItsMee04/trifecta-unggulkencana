<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@email.com'], // Kunci pengecekan berdasarkan email unik
            [
                'password' => Hash::make('kusuma04'), // 🌟 Password '123' dienkripsi aman
                'pegawai_id' => 1,               // Hubungkan ke pegawai 'ADMINISTRATOR OWNER' (ID: 1)
                'role_id' => 1,                  // Hubungkan ke role 'SUPER ADMIN' (ID: 1)
                'status' => 1,                   // Status ACTIVE
            ]
        );
    }
}
