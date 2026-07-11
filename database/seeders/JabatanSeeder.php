<?php

namespace Database\Seeders;

use App\Models\Master\Jabatan;
use Illuminate\Database\Seeder;

class JabatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jabatans = [
            [
                'id' => 1,
                'jabatan' => 'OWNER',
                'status' => 1, // Aktif
            ],
            [
                'id' => 2,
                'jabatan' => 'PEGAWAI',
                'status' => 1, // Aktif
            ],
        ];

        foreach ($jabatans as $jabatan) {
            // Menggunakan updateOrCreate agar aman dari error duplicate entry saat diketik ulang
            Jabatan::updateOrCreate(
                ['id' => $jabatan['id']], // Kunci pengecekan
                [
                    'jabatan' => $jabatan['jabatan'],
                    'status' => $jabatan['status']
                ]
            );
        }
    }
}
