<?php

namespace App\Services\Pelanggan;

use App\Models\Pelanggan\Pesan;

class PesanService
{
    public function getPesan()
    {
        $data = Pesan::where('status', 1)->get();

        return $data;
    }

    public function createPesan(array $data): Pesan
    {
        $data = Pesan::create([
            'judul'     => strtoupper($data['judul']),
            'pesan'     => strtoupper($data['pesan'])
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updatePesan(int $id, array $NewData): ?Pesan
    {
        $data = Pesan::find($id);

        if (!$data) {
            return null;
        }

        $data->update([
            'judul'     => strtoupper($NewData['judul']),
            'pesan'     => strtoupper($NewData['pesan'])
        ]);

        return $data;
    }

    public function deletePesan(int $id): bool
    {
        $data = Pesan::find($id);

        if (!$data) {
            return false;
        }

        $data->status = 0;
        return $data->save();
    }
}
