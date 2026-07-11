<?php

namespace Database\Seeders;

use App\Models\Master\Pegawai;
use Illuminate\Database\Seeder;

class PegawaiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pegawais = [
            [
                'id' => 1,
                'nip' => '0110001',
                'nama' => 'ADMINISTRATOR OWNER',
                'alamat' => 'PURWOKERTO',
                'kontak' => '081390469322',
                'jabatan_id' => 1, // Hubungkan ke OWNER (ID: 1)
                'image' => null,   // 🌟 Di-null kan sesuai request
                'status' => 1,
            ]
        ];

        foreach ($pegawais as $pegawai) {
            Pegawai::updateOrCreate(
                ['id' => $pegawai['id']], // Kunci pengecekan agar tidak duplikat
                [
                    'nip' => $pegawai['nip'],
                    'nama' => $pegawai['nama'],
                    'alamat' => $pegawai['alamat'],
                    'kontak' => $pegawai['kontak'],
                    'jabatan_id' => $pegawai['jabatan_id'],
                    'image' => $pegawai['image'],
                    'status' => $pegawai['status'],
                ]
            );
        }
    }
}
