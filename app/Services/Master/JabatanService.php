<?php

namespace App\Services\Master;

use App\Models\Master\Jabatan;

class JabatanService
{
    public function getJabatanAktif()
    {
        $data = Jabatan::where('status', 1)->get();

        return $data;
    }

    public function createJabatan(array $data): Jabatan
    {
        $data = Jabatan::create([
            'jabatan' => strtoupper($data['jabatan']),
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateJabatan(int $id, array $data): ?Jabatan
    {
        $jabatan = Jabatan::find($id);

        if (!$jabatan) {
            return null;
        }

        $jabatan->update([
            'jabatan' => strtoupper($data['jabatan']),
        ]);

        return $jabatan;
    }

    public function deleteJabatan(int $id): bool
    {
        $jabatan = Jabatan::find($id);

        if (!$jabatan) {
            return false;
        }

        $jabatan->status = 0;
        return $jabatan->save();
    }
}
